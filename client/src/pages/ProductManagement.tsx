import { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import ProductModal from "@/components/ProductModal";
import GroupsList from "@/components/GroupsList";
import ProductsList from "@/components/ProductsList";
import BulkActions from "@/components/BulkActions";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

export interface Product {
  id: string;
  title: string;
  notes: string;
  image: string;
}

export interface Group {
  id: string;
  name: string;
  notes: string;
  products: string[];
}

function ProductManagement() {
  const [products, setProducts] = useState<Product[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);
  const [selectedProducts, setSelectedProducts] = useState<Set<string>>(new Set());
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    loadProducts();
    loadGroups();
  }, []);

  async function loadProducts() {
    try {
      const querySnapshot = await getDocs(collection(db, "products"));
      const productsData: Product[] = [];
      querySnapshot.forEach((doc) => {
        productsData.push({ id: doc.id, ...doc.data() } as Product);
      });
      setProducts(productsData);
    } catch (error) {
      console.error("Error loading products:", error);
    }
  }

  async function loadGroups() {
    try {
      const querySnapshot = await getDocs(collection(db, "groups"));
      const groupsData: Group[] = [];
      querySnapshot.forEach((doc) => {
        groupsData.push({ id: doc.id, ...doc.data() } as Group);
      });
      setGroups(groupsData);
    } catch (error) {
      console.error("Error loading groups:", error);
    }
  }

  function toggleSelection(id: string, checked: boolean) {
    setSelectedProducts(prev => {
      const newSet = new Set(prev);
      if (checked) {
        newSet.add(id);
      } else {
        newSet.delete(id);
      }
      return newSet;
    });
  }

  const handleAddProductSuccess = () => {
    loadProducts();
  };

  const handleCreateGroupSuccess = () => {
    loadGroups();
    setSelectedProducts(new Set());
  };

  const handleDeleteProductsSuccess = () => {
    loadProducts();
    setSelectedProducts(new Set());
  };

  return (
    <div className="flex flex-col h-screen">
      <div className="flex-[0.6] p-5 bg-gray-100 border-b-2 border-gray-300 overflow-y-auto" id="groups-section">
        <h2 className="text-xl font-semibold mb-4">📁 المجموعات</h2>
        <GroupsList groups={groups} />
      </div>
      
      <div className="flex-[1.4] p-5 bg-white overflow-y-auto" id="products-section">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">📦 المنتجات</h2>
          <Button 
            onClick={() => setIsModalOpen(true)}
            className="bg-primary hover:bg-blue-700 text-white"
          >
            <PlusCircle className="ml-2 h-4 w-4" />
            إضافة منتج
          </Button>
        </div>

        {selectedProducts.size > 0 && (
          <BulkActions 
            selectedProducts={selectedProducts} 
            onCreateGroupSuccess={handleCreateGroupSuccess}
            onDeleteSuccess={handleDeleteProductsSuccess}
          />
        )}

        <ProductsList 
          products={products} 
          onDeleteSuccess={loadProducts}
          onToggleSelection={toggleSelection}
          selectedProducts={selectedProducts}
        />
      </div>

      <ProductModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSuccess={handleAddProductSuccess} 
      />
    </div>
  );
}

export default ProductManagement;
