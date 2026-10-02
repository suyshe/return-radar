'use client';

import React, { useState } from 'react';
import { useApp } from '../lib/context/app-context';
import { Navbar } from './navbar';
import { Sidebar } from './sidebar';
import { ProductModal } from './product-modal';
import { Product } from '../lib/types';

interface AppLayoutWrapperProps {
  children: React.ReactNode;
}

export function AppLayoutWrapper({ children }: AppLayoutWrapperProps) {
  const { addProduct, updateProduct, userProfile } = useApp();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [productToEdit, setProductToEdit] = useState<Product | null>(null);

  const handleOpenAddModal = () => {
    setProductToEdit(null);
    setIsAddModalOpen(true);
  };

  const handleOpenEditModal = (product: Product) => {
    setProductToEdit(product);
    setIsAddModalOpen(true);
  };

  const handleSaveProduct = async (data: any) => {
    if (productToEdit) {
      await updateProduct(productToEdit.id, data);
    } else {
      await addProduct(data);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-sans selection:bg-indigo-500/30 selection:text-white">
      <Navbar 
        onOpenAddModal={handleOpenAddModal} 
        onToggleSidebar={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)} 
      />

      <div className="flex-1 flex w-full">
        <Sidebar 
          isOpenMobile={isMobileSidebarOpen} 
          onCloseMobile={() => setIsMobileSidebarOpen(false)} 
        />

        <main className="flex-1 min-w-0 px-4 sm:px-8 py-6 max-w-7xl mx-auto w-full">
          {children}
        </main>
      </div>

      <ProductModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={handleSaveProduct}
        productToEdit={productToEdit}
        defaultCurrency={userProfile.preferredCurrency}
      />
    </div>
  );
}
