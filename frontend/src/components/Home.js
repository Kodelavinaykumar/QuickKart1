import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchFeaturedProducts();
    fetchCategories();
  }, []);

  const fetchFeaturedProducts = async () => {
    try {
      const response = await axios.get('/api/products/available');
      setFeaturedProducts(response.data.slice(0, 6));
    } catch (error) {
      console.error('Error fetching featured products:', error);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get('/api/products/categories');
      setCategories(response.data.slice(0, 4));
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleCategoryClick = (category) => {
    navigate(`/products?category=${encodeURIComponent(category)}`);
  };

  return (
    <>
      {/* Hero Section */}
      <div className="hero-section">
        <Container>
          <Row>
            <Col lg={8} className="mx-auto">
              <h1 className="display-4 mb-4">Welcome to QuickKart</h1>
              <p className="lead mb-4">
                Discover amazing products at unbeatable prices. Shop now and enjoy fast delivery!
              </p>
              <LinkContainer to="/products">
                <Button variant="light" size="lg">
                  Shop Now
                </Button>
              </LinkContainer>
            </Col>
          </Row>
        </Container>
      </div>

      <Container className="my-5">
        {/* Categories Section */}
        {categories.length > 0 && (
          <Row className="mb-5">
            <Col>
              <h2 className="text-center mb-4">Shop by Category</h2>
              <Row>
                {categories.map((category, index) => (
                  <Col md={3} key={index} className="mb-3">
                    <Card className="category-card h-100 text-center p-3">
                      <Card.Body>
                        <h5>{category}</h5>
                        <Button 
                          variant="outline-primary"
                          onClick={() => handleCategoryClick(category)}
                        >
                          Browse
                        </Button>
                      </Card.Body>
                    </Card>
                  </Col>
                ))}
              </Row>
            </Col>
          </Row>
        )}

        {/* Featured Products */}
        <Row>
          <Col>
            <h2 className="text-center mb-4">Featured Products</h2>
            <Row>
              {featuredProducts.map(product => (
                <Col md={4} key={product.id} className="mb-4">
                  <Card className="product-card h-100">
                    <Card.Img 
                      variant="top" 
                      src={product.imageUrl || 'https://via.placeholder.com/300x200?text=Product+Image'} 
                      className="product-image"
                    />
                    <Card.Body className="d-flex flex-column">
                      <Card.Title>{product.name}</Card.Title>
                      <Card.Text className="flex-grow-1">
                        {product.description?.substring(0, 100)}...
                      </Card.Text>
                      <div className="mt-auto">
                        <h5 className="text-primary">${product.price}</h5>
                        <LinkContainer to={`/products/${product.id}`}>
                          <Button variant="primary" className="w-100">
                            View Details
                          </Button>
                        </LinkContainer>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          </Col>
        </Row>

        {/* Call to Action */}
        <Row className="mt-5">
          <Col className="text-center">
            <h3>Ready to start shopping?</h3>
            <p className="lead">Browse our full collection of products</p>
            <LinkContainer to="/products">
              <Button variant="primary" size="lg">
                View All Products
              </Button>
            </LinkContainer>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Home;
