import { useState, useEffect } from 'react';
import axios from 'axios';

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

const useProducts = (initialFilters: Filters) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filters, setFilters] = useState<Filters>(initialFilters);

  useEffect(() => {
    fetchProducts();
  }, [filters]);

  const fetchProducts = () => {
    let query = `http://localhost:3000/products?`;
    if (filters.sortBy) query += `sortBy=${filters.sortBy}&`;
    if (filters.search) query += `search=${filters.search}&`;

    axios.get(query)
      .then(response => {
        setProducts(response.data);
      })
      .catch(error => {
        console.error('There was an error fetching the products!', error);
      });
  };

  const addProduct = (newProduct: NewProduct) => {
    axios.post('http://localhost:3000/products', newProduct)
      .then(response => {
        setProducts([...products, response.data]);
      })
      .catch(error => {
        console.error('There was an error adding the product!', error);
      });
  };

  const deleteProduct = (id: number) => {
    axios.delete(`http://localhost:3000/products/${id}`)
      .then(() => {
        setProducts(products.filter(product => product.id !== id));
      })
      .catch(error => {
        console.error('There was an error deleting the product!', error);
      });
  };

  return {
    products,
    filters,
    setFilters,
    addProduct,
    deleteProduct,
  };
};

export default useProducts;