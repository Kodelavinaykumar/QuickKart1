import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Form, Spinner, Alert } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { useCart } from '../context/CartContext';
import axios from 'axios';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    category: '',
    minPrice: '',
    maxPrice: '',
    search: ''
  });

  const { addToCart } = useCart();

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [filters]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      
      if (filters.category) params.append('category', filters.category);
      if (filters.minPrice) params.append('minPrice', filters.minPrice);
      if (filters.maxPrice) params.append('maxPrice', filters.maxPrice);
      if (filters.search) params.append('search', filters.search);

      const url = params.toString() 
        ? `/api/products/filter?${params.toString()}`
        : '/api/products/available';
        
      const response = await axios.get(url);
      setProducts(response.data);
      setError('');
    } catch (error) {
      console.error('Error fetching products:', error);
      setError('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get('/api/products/categories');
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const clearFilters = () => {
    setFilters({
      category: '',
      minPrice: '',
      maxPrice: '',
      search: ''
    });
  };

  const handleAddToCart = (product) => {
    addToCart(product);
    // You could add a toast notification here
  };

  if (loading && products.length === 0) {
    return (
      <Container className="text-center my-5">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </Container>
    );
  }

  return (
    <Container className="my-4">
      <Row>
        <Col>
          <h2 className="mb-4">Our Products</h2>
        </Col>
      </Row>

      {/* Filters */}
      <Row className="mb-4">
        <Col md={12}>
          <Card>
            <Card.Body>
              <h5>Filters</h5>
              <Row>
                <Col md={3}>
                  <Form.Group>
                    <Form.Label>Search</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Search products..."
                      value={filters.search}
                      onChange={(e) => handleFilterChange('search', e.target.value)}
                    />
                  </Form.Group>
                </Col>
                <Col md={3}>
                  <Form.Group>
                    <Form.Label>Category</Form.Label>
                    <Form.Select
                      value={filters.category}
                      onChange={(e) => handleFilterChange('category', e.target.value)}
                    >
                      <option value="">All Categories</option>
                      {categories.map(category => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={2}>
                  <Form.Group>
                    <Form.Label>Min Price</Form.Label>
                    <Form.Control
                      type="number"
                      placeholder="0"
                      value={filters.minPrice}
                      onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                    />
                  </Form.Group>
                </Col>
                <Col md={2}>
                  <Form.Group>
                    <Form.Label>Max Price</Form.Label>
                    <Form.Control
                      type="number"
                      placeholder="1000"
                      value={filters.maxPrice}
                      onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                    />
                  </Form.Group>
                </Col>
                <Col md={2} className="d-flex align-items-end">
                  <Button variant="outline-secondary" onClick={clearFilters} className="w-100">
                    Clear Filters
                  </Button>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {error && (
        <Row className="mb-4">
          <Col>
            <Alert variant="danger">{error}</Alert>
          </Col>
        </Row>
      )}

      {/* Products Grid */}
      <Row>
        {products.length === 0 ? (
          <Col className="text-center">
            <h4>No products found</h4>
            <p>Try adjusting your filters or search terms.</p>
          </Col>
        ) : (
          products.map(product => (
            <Col md={4} lg={3} key={product.id} className="mb-4">
              <Card className="product-card h-100">
                <Card.Img 
                  variant="top" 
                  src={product.imageUrl || 'https://via.placeholder.com/300x200?text=Product+Image'} 
                  className="product-image"
                />
                <Card.Body className="d-flex flex-column">
                  <Card.Title>{product.name}</Card.Title>
                  <Card.Text className="flex-grow-1">
                    {product.description?.substring(0, 80)}...
                  </Card.Text>
                  <div className="mt-auto">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <h5 className="text-primary mb-0">${product.price}</h5>
                      <small className="text-muted">
                        Stock: {product.stockQuantity}
                      </small>
                    </div>
                    <div className="d-grid gap-2">
                      <LinkContainer to={`/products/${product.id}`}>
                        <Button variant="outline-primary" size="sm">
                          View Details
                        </Button>
                      </LinkContainer>
                      <Button 
                        variant="primary" 
                        size="sm"
                        onClick={() => handleAddToCart(product)}
                        disabled={product.stockQuantity === 0}
                      >
                        {product.stockQuantity === 0 ? 'Out of Stock' : 'Add to Cart'}
                      </Button>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))
        )}
      </Row>

      {loading && products.length > 0 && (
        <Row className="mt-4">
          <Col className="text-center">
            <Spinner animation="border" size="sm" />
            <span className="ms-2">Updating products...</span>
          </Col>
        </Row>
      )}
    </Container>
  );
};

export default ProductList;
