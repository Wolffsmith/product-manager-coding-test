import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Tooltip,
} from "@mui/material";

interface Product {
  id: number;
  name: string;
  available: boolean;
}

interface ProductTableProps {
  products: Product[];
  handleDeleteProduct: (id: number) => void;
}

const ProductTable: React.FC<ProductTableProps> = ({
  products,
  handleDeleteProduct,
}) => {
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
          {products.map((product) => (
            <TableRow key={product.id}>
              <TableCell>{product.name}</TableCell>
              <TableCell>{product.available ? "Yes" : "No"}</TableCell>
              <TableCell>
                <Tooltip
                  title={
                    product.available
                      ? "This product is available and cannot be deleted."
                      : "Delete this product"
                  }
                >
                  <span>
                    <Button
                      variant="contained"
                      color="error"
                      onClick={() => handleDeleteProduct(product.id)}
                      disabled={product.available}
                    >
                      Delete
                    </Button>
                  </span>
                </Tooltip>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default ProductTable;
