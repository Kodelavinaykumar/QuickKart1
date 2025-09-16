import React from 'react';
import { Container, Row, Col, Card, Button, Table, Alert, Form } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Cart = () => {
  const { items, removeFromCart, updateQuantity, clearCart, getTotalPrice } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleQuantityChange = (productId, newQuantity) => {
    updateQuantity(productId, parseInt(newQuantity));
  };

  const handleCheckout = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    try {
      const orderItems = items.map(item => ({
        product: { id: item.id },
        quantity: item.quantity,
        price: item.price
      }));

      const orderData = {
        userId: user.id,
        orderItems: orderItems,
        shippingAddress: user.address || 'Default Address',
        paymentMethod: 'Credit Card'
      };

      await axios.post('/api/orders', orderData);
      clearCart();
      alert('Order placed successfully!');
      navigate('/orders');
    } catch (error) {
      console.error('Error placing order:', error);
      alert('Failed to place order. Please try again.');
    }
  };

  if (items.length === 0) {
    return (
      <Container className="my-5">
        <Row>
          <Col className="text-center">
            <h2>Your Cart is Empty</h2>
            <p className="lead">Start shopping to add items to your cart!</p>
            <LinkContainer to="/products">
              <Button variant="primary" size="lg">
                Continue Shopping
              </Button>
            </LinkContainer>
          </Col>
        </Row>
      </Container>
    );
  }

  return (
    <Container className="my-4">
      <Row>
        <Col>
          <h2 className="mb-4">Shopping Cart</h2>
        </Col>
      </Row>

      <Row>
        <Col lg={8}>
          <Card>
            <Card.Body>
              <Table responsive>
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Price</th>
                    <th>Quantity</th>
                    <th>Total</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map(item => (
                    <tr key={item.id}>
                      <td>
                        <div className="d-flex align-items-center">
                          <img 
                            src={item.imageUrl || 'https://via.placeholder.com/60x60?text=Product'} 
                            alt={item.name}
                            style={{ width: '60px', height: '60px', objectFit: 'cover' }}
                            className="me-3"
                          />
                          <div>
                            <h6 className="mb-0">{item.name}</h6>
                            {item.category && (
                              <small className="text-muted">{item.category}</small>
                            )}
                          </div>
                        </div>
                      </td>
                      <td>${item.price}</td>
                      <td>
                        <Form.Control
                          type="number"
                          min="1"
                          max={item.stockQuantity}
                          value={item.quantity}
                          onChange={(e) => handleQuantityChange(item.id, e.target.value)}
                          style={{ width: '80px' }}
                        />
                      </td>
                      <td>${(item.price * item.quantity).toFixed(2)}</td>
                      <td>
                        <Button 
                          variant="outline-danger" 
                          size="sm"
                          onClick={() => removeFromCart(item.id)}
                        >
                          Remove
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={4}>
          <Card>
            <Card.Header>
              <h5 className="mb-0">Order Summary</h5>
            </Card.Header>
            <Card.Body>
              <div className="d-flex justify-content-between mb-2">
                <span>Subtotal:</span>
                <span>${getTotalPrice().toFixed(2)}</span>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span>Shipping:</span>
                <span>Free</span>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span>Tax:</span>
                <span>${(getTotalPrice() * 0.1).toFixed(2)}</span>
              </div>
              <hr />
              <div className="d-flex justify-content-between mb-3">
                <strong>Total:</strong>
                <strong>${(getTotalPrice() * 1.1).toFixed(2)}</strong>
              </div>

              {!user && (
                <Alert variant="info" className="mb-3">
                  Please <LinkContainer to="/login"><Button variant="link" className="p-0">login</Button></LinkContainer> to proceed with checkout.
                </Alert>
              )}

              <div className="d-grid gap-2">
                <Button 
                  variant="primary" 
                  size="lg"
                  onClick={handleCheckout}
                  disabled={!user}
                >
                  Proceed to Checkout
                </Button>
                <Button 
                  variant="outline-secondary"
                  onClick={clearCart}
                >
                  Clear Cart
                </Button>
                <LinkContainer to="/products">
                  <Button variant="outline-primary">
                    Continue Shopping
                  </Button>
                </LinkContainer>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Cart;
