import React from 'react';
import { Navbar, Nav, Container, Badge } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const Navigation = () => {
  const { getTotalItems } = useCart();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <Navbar bg="dark" variant="dark" expand="lg" sticky="top">
      <Container>
        <LinkContainer to="/">
          <Navbar.Brand>🛒 QuickKart</Navbar.Brand>
        </LinkContainer>
        
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <LinkContainer to="/">
              <Nav.Link>Home</Nav.Link>
            </LinkContainer>
            <LinkContainer to="/products">
              <Nav.Link>Products</Nav.Link>
            </LinkContainer>
          </Nav>
          
          <Nav>
            <LinkContainer to="/cart">
              <Nav.Link className="position-relative">
                🛒 Cart
                {getTotalItems() > 0 && (
                  <Badge bg="danger" className="cart-badge">
                    {getTotalItems()}
                  </Badge>
                )}
              </Nav.Link>
            </LinkContainer>
            
            {user ? (
              <>
                <LinkContainer to="/orders">
                  <Nav.Link>My Orders</Nav.Link>
                </LinkContainer>
                <Nav.Link onClick={handleLogout}>
                  Logout ({user.firstName})
                </Nav.Link>
              </>
            ) : (
              <>
                <LinkContainer to="/login">
                  <Nav.Link>Login</Nav.Link>
                </LinkContainer>
                <LinkContainer to="/register">
                  <Nav.Link>Register</Nav.Link>
                </LinkContainer>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Navigation;
