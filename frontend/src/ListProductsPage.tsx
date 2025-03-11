import React, { useState } from "react";
import {
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
} from "@mui/material";
import FilterSortForm from "./components/FilterSortForm";
import ProductTable from "./components/ProductTable";
import useProducts from "./hooks/useProducts";
import axios from "axios";

const ListProductsPage: React.FC = () => {
  const { products, filters, setFilters, setProducts, deleteProduct } =
    useProducts({
      sortBy: "",
      search: "",
    });

  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  const handleFilterChange = (name: string, value: string) => {
    setFilters({ ...filters, [name]: value });
  };

  const handleDeleteProduct = async (id: number) => {
    try {
      setLoading(true);
      deleteProduct(id);
    } catch (err) {
      console.error("Error deleting product:", err);
    } finally {
      setLoading(false);
      setDeleteId(null);
    }
  };

  return (
    <Container>
      <FilterSortForm
        filter={filters}
        handleFilterChange={handleFilterChange}
      />
      <ProductTable
        products={products}
        handleDeleteProduct={(id) => setDeleteId(id)}
      />

      {/* Confirmation Dialog */}
      <Dialog open={deleteId !== null} onClose={() => setDeleteId(null)}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this product?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteId(null)} color="secondary">
            Cancel
          </Button>
          <Button
            onClick={() => {
              if (deleteId !== null) {
                handleDeleteProduct(deleteId);
              }
            }}
            color="error"
            disabled={loading}
          >
            {loading ? "Deleting..." : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ListProductsPage;
