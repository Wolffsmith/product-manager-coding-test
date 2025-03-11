import React, { useEffect, useState } from "react";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Typography,
  Box,
  TextField,
} from "@mui/material";

interface FilterSortFormProps {
  filter: { sortBy: string; search: string };
  handleFilterChange: (name: string, value: string) => void;
}

const FilterSortForm: React.FC<FilterSortFormProps> = ({
  filter,
  handleFilterChange,
}) => {
  const [searchTerm, setSearchTerm] = useState(filter.search);

  useEffect(() => {
    const timeout = setTimeout(() => {
      handleFilterChange("search", searchTerm);
    }, 500); // Debounce for 500ms

    return () => clearTimeout(timeout);
  }, [searchTerm]);

  return (
    <Box mb={4}>
      <Typography variant="h5" gutterBottom>
        Filter and Sort Products
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={6} sm={6}>
          <FormControl fullWidth>
            <InputLabel>Sort By</InputLabel>
            <Select
              name="sortBy"
              value={filter.sortBy}
              onChange={(e) => handleFilterChange("sortBy", e.target.value)}
            >
              <MenuItem value="">None</MenuItem>
              <MenuItem value="name">Name</MenuItem>
              <MenuItem value="available">Available</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={6} sm={6}>
          <TextField
            label="Search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            fullWidth
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default FilterSortForm;
