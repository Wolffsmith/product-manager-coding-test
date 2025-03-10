import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button } from '@mui/material';

interface Product {
  id: number;
  name: string;
  available: boolean;
}

interface ProductTableProps {
  products: Product[];
  handleDeleteProduct: (id: number) => void;
}

const ProductTable: React.FC<ProductTableProps> = ({ products, handleDeleteProduct }) => {
  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Available</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {products.map(product => (
            <TableRow key={product.id}>
              <TableCell>{product.name}</TableCell>
              <TableCell>{product.available ? 'Yes' : 'No'}</TableCell>
              <TableCell>
                <Button variant="contained" color="error" onClick={() => handleDeleteProduct(product.id)}>
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default ProductTable;