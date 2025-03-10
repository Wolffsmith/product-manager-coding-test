import React from 'react';
import { FormControl, InputLabel, Select, MenuItem, Grid, Typography, Box, TextField } from '@mui/material';

interface FilterSortFormProps {
  filter: { sortBy: string; search: string };
  handleFilterChange: (e: any) => void;
}

const FilterSortForm: React.FC<FilterSortFormProps> = ({ filter, handleFilterChange }) => {
  return (
    <Box mb={4}>
      <Typography variant="h5" gutterBottom>
        Filter and Sort Products
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <InputLabel>Sort By</InputLabel>
            <Select
              name="sortBy"
              value={filter.sortBy}
              onChange={handleFilterChange}
            >
              <MenuItem value="">None</MenuItem>
              <MenuItem value="name">Name</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Search"
            name="search"
            value={filter.search}
            onChange={handleFilterChange}
            fullWidth
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default FilterSortForm;