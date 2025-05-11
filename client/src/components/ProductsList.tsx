import { Product } from "@/pages/ProductManagement";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { deleteDoc, doc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useToast } from "@/hooks/use-toast";
import { Trash2 } from "lucide-react";

interface ProductsListProps {
  products: Product[];
  onDeleteSuccess: () => void;
  onToggleSelection: (id: string, checked: boolean) => void;
  selectedProducts: Set<string>;
}

function ProductsList({ 
  products, 
  onDeleteSuccess, 
  onToggleSelection,
  selectedProducts 
}: ProductsListProps) {
  const { toast } = useToast();

  const handleDelete = async (id: string) => {
    try {
      await deleteDoc(doc(db, "products", id));
      toast({
        title: "تم حذف المنتج بنجاح",
        duration: 3000
      });
      onDeleteSuccess();
    } catch (error) {
      console.error("Error deleting product:", error);
      toast({
        title: "حدث خطأ أثناء حذف المنتج",
        variant: "destructive",
        duration: 3000
      });
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {products.length === 0 ? (
        <p className="text-gray-500 col-span-full">لا توجد منتجات حتى الآن</p>
      ) : (
        products.map((product) => (
          <Card key={product.id} className="overflow-hidden">
            <div className="relative">
              <Checkbox
                className="absolute top-3 left-3 h-5 w-5 z-10"
                checked={selectedProducts.has(product.id)}
                onCheckedChange={(checked) => 
                  onToggleSelection(product.id, checked === true)
                }
              />
              <img 
                src={product.image || 'https://images.unsplash.com/photo-1526947425960-945c6e72858f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fHByb2R1Y3R8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60'} 
                alt={`صورة ${product.title}`}
                className="w-full h-40 object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.onerror = null; 
                  target.src = 'https://images.unsplash.com/photo-1526947425960-945c6e72858f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fHByb2R1Y3R8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60'; 
                }}
              />
            </div>
            <CardContent className="p-4">
              <h3 className="font-semibold text-lg mb-2">{product.title}</h3>
              {product.notes && <p className="text-gray-600 mb-4">{product.notes}</p>}
              <div className="flex justify-end">
                <Button 
                  onClick={() => handleDelete(product.id)} 
                  variant="destructive"
                  size="sm"
                >
                  <Trash2 className="ml-1 h-4 w-4" />
                  حذف
                </Button>
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
}

export default ProductsList;
