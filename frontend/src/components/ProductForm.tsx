import React from 'react';
import { TextField, Button, Grid, Typography, Box } from '@mui/material';

interface ProductFormProps {
  newProduct: { name: string; available: boolean };
  handleInputChange: (e: any) => void;
  handleAddProduct: () => void;
}

const ProductForm: React.FC<ProductFormProps> = ({ newProduct, handleInputChange, handleAddProduct }) => {
  return (
    <Box mb={4}>
      <Typography variant="h5" gutterBottom>
        Add New Product
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={3}>
          <TextField
            label="Name"
            name="name"
            value={newProduct.name}
            onChange={handleInputChange}
            fullWidth
          />
        </Grid>
        <Grid item xs={12} sm={3}>
          <Button variant="contained" color="primary" onClick={handleAddProduct} fullWidth>
            Add Product
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ProductForm;