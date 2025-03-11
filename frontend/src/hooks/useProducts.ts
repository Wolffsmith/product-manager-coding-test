import { useState, useEffect } from "react";
import axios from "axios";

interface Product {
  id: number;
  name: string;
  available: boolean;
}

interface NewProduct {
  name: string;
  available: boolean;
}

interface Filters {
  sortBy: string;
  search: string;
}

const API_URL = "http://localhost:3000/products";

const useProducts = (initialFilters: Filters) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filters, setFilters] = useState<Filters>(initialFilters);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError("");

      try {
        const response = await axios.get(`${API_URL}`, {
          params: {
            sortBy: filters.sortBy,
            search: filters.search,
          },
        });

        if (response.data.success) {
          setProducts(response.data.responseObject);
        } else {
          setError(response.data.message);
        }
      } catch (err) {
        setError("Error fetching products.");
      }

      setLoading(false);
    };

    fetchProducts();
  }, [filters]);

  const addProduct = async (newProduct: NewProduct) => {
    setLoading(true);
    try {
      const response = await axios.post(API_URL, newProduct);

      if (response.status === 200) {
        setProducts(response.data.responseObject);
      } else {
        setError("Failed to add product.");
      }
    } catch (error) {
      setError("Error adding product.");
    }
    setLoading(false);
  };

  const deleteProduct = async (id: number) => {
    setLoading(true);
    try {
      const response = await axios.delete(`${API_URL}/${id}`);

      if (response.status === 200) {
        setProducts(response.data.responseObject);
      } else {
        setError("Failed to delete product.");
      }
    } catch (error) {
      setError("Error deleting product.");
    }
    setLoading(false);
  };

  return {
    products,
    filters,
    setFilters,
    setProducts,
    addProduct,
    deleteProduct,
    loading,
    error,
  };
};

export default useProducts;
