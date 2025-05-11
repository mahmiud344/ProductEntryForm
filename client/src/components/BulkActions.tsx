import { useState } from "react";
import { addDoc, collection, deleteDoc, doc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { Trash2, FolderPlus } from "lucide-react";

interface BulkActionsProps {
  selectedProducts: Set<string>;
  onDeleteSuccess: () => void;
  onCreateGroupSuccess: () => void;
}

function BulkActions({ 
  selectedProducts, 
  onDeleteSuccess, 
  onCreateGroupSuccess 
}: BulkActionsProps) {
  const [groupName, setGroupName] = useState("");
  const [groupNotes, setGroupNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleDeleteSelected = async () => {
    setIsSubmitting(true);
    try {
      for (const id of selectedProducts) {
        await deleteDoc(doc(db, "products", id));
      }
      toast({
        title: "تم حذف المنتجات المختارة بنجاح",
        duration: 3000
      });
      onDeleteSuccess();
    } catch (error) {
      console.error("Error deleting selected products:", error);
      toast({
        title: "حدث خطأ أثناء حذف المنتجات المختارة",
        variant: "destructive",
        duration: 3000
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCreateGroup = async () => {
    if (!groupName.trim()) {
      toast({
        title: "اسم المجموعة مطلوب",
        variant: "destructive",
        duration: 3000
      });
      return;
    }

    setIsSubmitting(true);
    try {
      await addDoc(collection(db, "groups"), {
        name: groupName.trim(),
        notes: groupNotes.trim(),
        products: Array.from(selectedProducts)
      });
      
      toast({
        title: "تم إنشاء المجموعة بنجاح",
        duration: 3000
      });
      
      setGroupName("");
      setGroupNotes("");
      onCreateGroupSuccess();
    } catch (error) {
      console.error("Error creating group:", error);
      toast({
        title: "حدث خطأ أثناء إنشاء المجموعة",
        variant: "destructive",
        duration: 3000
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="bg-blue-50 border border-blue-200 mb-6">
      <CardContent className="p-4 space-y-3">
        <Button 
          onClick={handleDeleteSelected} 
          variant="destructive"
          disabled={isSubmitting}
        >
          <Trash2 className="ml-2 h-4 w-4" />
          حذف المنتجات المختارة ({selectedProducts.size})
        </Button>
        
        <Separator className="my-2 bg-blue-200" />
        
        <div className="space-y-3">
          <div>
            <Label htmlFor="group-name" className="font-medium">اسم المجموعة</Label>
            <Input
              id="group-name"
              placeholder="✏️ اسم المجموعة"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              className="mt-1"
            />
          </div>
          
          <div>
            <Label htmlFor="group-notes" className="font-medium">ملاحظات المجموعة</Label>
            <Textarea
              id="group-notes"
              placeholder="📝 ملاحظات المجموعة"
              value={groupNotes}
              onChange={(e) => setGroupNotes(e.target.value)}
              className="mt-1 h-20"
            />
          </div>
          
          <Button 
            onClick={handleCreateGroup} 
            className="bg-green-600 hover:bg-green-700"
            disabled={isSubmitting}
          >
            <FolderPlus className="ml-2 h-4 w-4" />
            إنشاء مجموعة
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default BulkActions;
