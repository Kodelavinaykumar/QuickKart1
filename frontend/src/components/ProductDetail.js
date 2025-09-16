import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Badge, Spinner, Alert, Form } from 'react-bootstrap';
import { useCart } from '../context/CartContext';
import axios from 'axios';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/products/${id}`);
      setProduct(response.data);
      setError('');
    } catch (error) {
      console.error('Error fetching product:', error);
      setError('Product not found');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }
    // You could add a success message here
  };

  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value);
    if (value > 0 && value <= product.stockQuantity) {
      setQuantity(value);
    }
  };

  if (loading) {
    return (
      <Container className="text-center my-5">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </Container>
    );
  }

  if (error || !product) {
    return (
      <Container className="my-5">
        <Alert variant="danger">
          {error || 'Product not found'}
        </Alert>
        <Button variant="primary" onClick={() => navigate('/products')}>
          Back to Products
        </Button>
      </Container>
    );
  }

  return (
    <Container className="my-4">
      <Row>
        <Col md={6}>
          <Card>
            <Card.Img 
              variant="top" 
              src={product.imageUrl || 'https://via.placeholder.com/500x400?text=Product+Image'} 
              style={{ height: '400px', objectFit: 'cover' }}
            />
          </Card>
        </Col>
        <Col md={6}>
          <div className="product-details">
            <h1>{product.name}</h1>
            
            {product.brand && (
              <p className="text-muted mb-2">Brand: {product.brand}</p>
            )}
            
            {product.category && (
              <Badge bg="secondary" className="mb-3">{product.category}</Badge>
            )}
            
            <h2 className="text-primary mb-3">${product.price}</h2>
            
            <p className="lead">{product.description}</p>
            
            <div className="mb-3">
              <strong>Stock Available: </strong>
              <span className={product.stockQuantity > 0 ? 'text-success' : 'text-danger'}>
                {product.stockQuantity} units
              </span>
            </div>
            
            {product.stockQuantity > 0 && (
              <Row className="mb-3">
                <Col md={4}>
                  <Form.Group>
                    <Form.Label>Quantity</Form.Label>
                    <Form.Control
                      type="number"
                      min="1"
                      max={product.stockQuantity}
                      value={quantity}
                      onChange={handleQuantityChange}
                    />
                  </Form.Group>
                </Col>
              </Row>
            )}
            
            <div className="d-grid gap-2 d-md-flex">
              <Button 
                variant="primary" 
                size="lg"
                onClick={handleAddToCart}
                disabled={product.stockQuantity === 0}
                className="me-md-2"
              >
                {product.stockQuantity === 0 ? 'Out of Stock' : 'Add to Cart'}
              </Button>
              <Button 
                variant="outline-secondary" 
                size="lg"
                onClick={() => navigate('/products')}
              >
                Back to Products
              </Button>
            </div>
            
            <div className="mt-4">
              <h5>Product Information</h5>
              <ul className="list-unstyled">
                <li><strong>Product ID:</strong> {product.id}</li>
                {product.category && <li><strong>Category:</strong> {product.category}</li>}
                {product.brand && <li><strong>Brand:</strong> {product.brand}</li>}
                <li><strong>Price:</strong> ${product.price}</li>
                <li><strong>Availability:</strong> {product.stockQuantity > 0 ? 'In Stock' : 'Out of Stock'}</li>
              </ul>
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default ProductDetail;
