import React, { useState } from 'react';
import { Container } from '@mui/material';
import ProductForm from './components/ProductForm';
import ProductTable from './components/ProductTable';
import useProducts from './hooks/useProducts';

const ManageProductsPage: React.FC = () => {
  const { products, addProduct, deleteProduct } = useProducts({ sortBy: '', search: '' });
  const [newProduct, setNewProduct] = useState({ name: '', available: true });

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setNewProduct({ ...newProduct, [name]: value });
  };

  const handleAddProduct = () => {
    addProduct(newProduct);
    setNewProduct({ name: '', available: true });
  };

  const handleDeleteProduct = (id: number) => {
    deleteProduct(id);
  };

  return (
    <Container>
      <ProductForm
        newProduct={newProduct}
        handleInputChange={handleInputChange}
        handleAddProduct={handleAddProduct}
      />
      <ProductTable
        products={products}
        handleDeleteProduct={handleDeleteProduct}
      />
    </Container>
  );
};

export default ManageProductsPage;