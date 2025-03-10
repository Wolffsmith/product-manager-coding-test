import React from 'react';
import { BrowserRouter as Router, Route, Link, Routes } from 'react-router-dom';
import { Container, Typography, Button, Box } from '@mui/material';
import ListProductsPage from './ListProductsPage';
import ManageProductsPage from './ManageProductsPage';

const App: React.FC = () => {
  return (
    <Router>
      <Container>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
          <Typography variant="h2" gutterBottom>
            Products
          </Typography>
          <Box>
            <Button component={Link} to="/" variant="contained" color="primary" style={{ marginRight: '10px' }}>
              Product List
            </Button>
            <Button component={Link} to="/manage" variant="contained" color="secondary">
              Manage Products
            </Button>
          </Box>
        </Box>
        <Routes>
          <Route path="/" element={<ListProductsPage />} />
          <Route path="/manage" element={<ManageProductsPage />} />
        </Routes>
      </Container>
    </Router>
  );
};

export default App;