import { useState, useRef } from "react";
import { addDoc, collection } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "@/lib/firebase";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { ImageIcon } from "lucide-react";

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

function ProductModal({ isOpen, onClose, onSuccess }: ProductModalProps) {
  const [title, setTitle] = useState("");
  const [notes, setNotes] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [errors, setErrors] = useState({ title: false, image: false });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const resetForm = () => {
    setTitle("");
    setNotes("");
    setFile(null);
    setPreviewUrl(null);
    setErrors({ title: false, image: false });
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const validateForm = () => {
    const newErrors = {
      title: !title.trim(),
      image: !file
    };
    setErrors(newErrors);
    return !newErrors.title && !newErrors.image;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      
      // Check file size (limit to 5MB)
      if (selectedFile.size > 5 * 1024 * 1024) {
        toast({
          title: "حجم الملف كبير جدًا",
          description: "يجب أن يكون حجم الصورة أقل من 5 ميجابايت",
          variant: "destructive",
          duration: 3000
        });
        return;
      }
      
      setFile(selectedFile);
      
      // Create preview URL
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
      
      // Clear any previous errors
      setErrors(prev => ({ ...prev, image: false }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      let imageUrl = "";
      
      if (file) {
        // Generate a unique filename
        const timestamp = new Date().getTime();
        const fileExtension = file.name.split('.').pop();
        const fileName = `products/${timestamp}-${Math.random().toString(36).substring(2, 15)}.${fileExtension}`;
        
        // Upload file to Firebase Storage
        const storageRef = ref(storage, fileName);
        await uploadBytes(storageRef, file);
        
        // Get download URL
        imageUrl = await getDownloadURL(storageRef);
      }
      
      // Add product to Firestore with image URL
      await addDoc(collection(db, "products"), { 
        title: title.trim(), 
        notes: notes.trim(), 
        image: imageUrl 
      });
      
      toast({
        title: "تم إضافة المنتج بنجاح",
        duration: 3000
      });
      
      onSuccess();
      handleClose();
    } catch (error) {
      console.error("Error adding product:", error);
      toast({
        title: "حدث خطأ أثناء إضافة المنتج",
        variant: "destructive",
        duration: 3000
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent dir="rtl" className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl">إضافة منتج جديد</DialogTitle>
          <DialogDescription>
            أدخل معلومات المنتج الجديد وارفع صورة له
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="product-title">
              عنوان المنتج <span className="text-red-500">*</span>
            </Label>
            <Input
              id="product-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={errors.title ? "border-red-500" : ""}
            />
            {errors.title && (
              <p className="text-red-500 text-sm">هذا الحقل مطلوب</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="product-image">
              صورة المنتج <span className="text-red-500">*</span>
            </Label>
            
            <div 
              className="file-drop-area"
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                ref={fileInputRef}
                id="product-image"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
              
              {previewUrl ? (
                <div className="file-preview">
                  <img 
                    src={previewUrl} 
                    alt="معاينة الصورة" 
                  />
                  <Button 
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      setFile(null);
                      setPreviewUrl(null);
                      if (fileInputRef.current) {
                        fileInputRef.current.value = "";
                      }
                    }}
                  >
                    تغيير الصورة
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-6 w-full cursor-pointer">
                  <ImageIcon className="h-12 w-12 text-gray-400 mb-2" />
                  <p className="text-gray-600 font-medium">اضغط لرفع صورة</p>
                  <p className="text-gray-500 text-sm mt-1">JPG, PNG, أو GIF</p>
                </div>
              )}
            </div>
            
            {errors.image && (
              <p className="text-red-500 text-sm">الصورة مطلوبة</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="product-notes">ملاحظات</Label>
            <Textarea
              id="product-notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={4}
            />
          </div>
          
          <div className="flex flex-row-reverse gap-2 pt-2">
            <Button type="submit" className="bg-primary" disabled={isSubmitting}>
              {isSubmitting ? "جاري الحفظ..." : "حفظ"}
            </Button>
            <Button 
              type="button" 
              variant="secondary" 
              onClick={handleClose}
              disabled={isSubmitting}
            >
              إلغاء
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default ProductModal;
