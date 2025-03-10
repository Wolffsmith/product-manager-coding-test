import React from 'react';
import { Container } from '@mui/material';
import FilterSortForm from './components/FilterSortForm';
import ProductTable from './components/ProductTable';
import useProducts from './hooks/useProducts';

const ListProductsPage: React.FC = () => {
  const { products, filters, setFilters } = useProducts({ sortBy: '', search: '' });

  const handleFilterChange = (e: any) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  return (
    <Container>
      <FilterSortForm
        filter={filters}
        handleFilterChange={handleFilterChange}
      />
      <ProductTable
        products={products}
        handleDeleteProduct={() => {}}
      />
    </Container>
  );
};

export default ListProductsPage;