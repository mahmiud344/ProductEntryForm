import { useState } from "react";
import { addDoc, collection } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

function ProductModal({ isOpen, onClose, onSuccess }: ProductModalProps) {
  const [title, setTitle] = useState("");
  const [notes, setNotes] = useState("");
  const [image, setImage] = useState("");
  const [errors, setErrors] = useState({ title: false, image: false });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const resetForm = () => {
    setTitle("");
    setNotes("");
    setImage("");
    setErrors({ title: false, image: false });
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const validateForm = () => {
    const newErrors = {
      title: !title.trim(),
      image: !image.trim()
    };
    setErrors(newErrors);
    return !newErrors.title && !newErrors.image;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      await addDoc(collection(db, "products"), { 
        title: title.trim(), 
        notes: notes.trim(), 
        image: image.trim() 
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
              رابط صورة المنتج <span className="text-red-500">*</span>
            </Label>
            <Input
              id="product-image"
              type="url"
              value={image}
              onChange={(e) => setImage(e.target.value)}
              className={errors.image ? "border-red-500" : ""}
            />
            {errors.image && (
              <p className="text-red-500 text-sm">هذا الحقل مطلوب</p>
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
