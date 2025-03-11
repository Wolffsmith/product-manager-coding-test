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
  const { products, filters, setFilters, setProducts } = useProducts({
    sortBy: "",
    search: "",
  });

  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  const handleFilterChange = (name: string, value: string) => {
    setFilters({ ...filters, [name]: value });
  };

  const handleDeleteProduct = async (id: number) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this product?"
    );
    if (!confirmDelete) return;

    try {
      const response = await axios.delete(`/products/${id}`);

      if (response.status === 204) {
        setProducts((prev) => prev.filter((p) => p.id !== id));
      } else {
        alert("Failed to delete product.");
      }
    } catch (err) {
      console.error("Error deleting product:", err);
      alert("Error deleting product.");
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
