import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Badge, Spinner, Alert } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchOrders();
  }, [user, navigate]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/orders/user/${user.id}`);
      setOrders(response.data);
      setError('');
    } catch (error) {
      console.error('Error fetching orders:', error);
      setError('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const getStatusVariant = (status) => {
    switch (status) {
      case 'PENDING': return 'warning';
      case 'CONFIRMED': return 'info';
      case 'SHIPPED': return 'primary';
      case 'DELIVERED': return 'success';
      case 'CANCELLED': return 'danger';
      default: return 'secondary';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
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

  if (error) {
    return (
      <Container className="my-5">
        <Alert variant="danger">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container className="my-4">
      <Row>
        <Col>
          <h2 className="mb-4">Order History</h2>
        </Col>
      </Row>

      {orders.length === 0 ? (
        <Row>
          <Col className="text-center">
            <h4>No orders found</h4>
            <p>You haven't placed any orders yet.</p>
          </Col>
        </Row>
      ) : (
        <Row>
          {orders.map(order => (
            <Col key={order.id} className="mb-4">
              <Card>
                <Card.Header>
                  <Row>
                    <Col md={6}>
                      <h5 className="mb-0">Order #{order.id}</h5>
                      <small className="text-muted">
                        Placed on {formatDate(order.orderDate)}
                      </small>
                    </Col>
                    <Col md={6} className="text-md-end">
                      <Badge bg={getStatusVariant(order.status)} className="me-2">
                        {order.status}
                      </Badge>
                      <strong>${order.totalAmount}</strong>
                    </Col>
                  </Row>
                </Card.Header>
                <Card.Body>
                  {order.orderItems && order.orderItems.length > 0 ? (
                    <Table responsive size="sm">
                      <thead>
                        <tr>
                          <th>Product</th>
                          <th>Price</th>
                          <th>Quantity</th>
                          <th>Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        {order.orderItems.map(item => (
                          <tr key={item.id}>
                            <td>{item.product?.name || 'Product'}</td>
                            <td>${item.price}</td>
                            <td>{item.quantity}</td>
                            <td>${(item.price * item.quantity).toFixed(2)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  ) : (
                    <p className="text-muted">Order items not available</p>
                  )}
                  
                  {order.shippingAddress && (
                    <div className="mt-3">
                      <strong>Shipping Address:</strong>
                      <p className="mb-0">{order.shippingAddress}</p>
                    </div>
                  )}
                  
                  {order.paymentMethod && (
                    <div className="mt-2">
                      <strong>Payment Method:</strong> {order.paymentMethod}
                    </div>
                  )}
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
};

export default OrderHistory;
