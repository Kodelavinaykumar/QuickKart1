import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Button, Modal, Form, Badge, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AdminDashboard = () => {
  const [stats, setStats] = useState({});
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const navigate = useNavigate();

  const [productForm, setProductForm] = useState({
    name: '',
    description: '',
    price: '',
    stockQuantity: '',
    category: '',
    brand: '',
    imageUrl: ''
  });

  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    const admin = localStorage.getItem('admin');
    if (!admin) {
      navigate('/admin/login');
      return;
    }
    fetchStats();
    fetchProducts();
    fetchOrders();
    fetchUsers();
  }, [navigate]);

  const fetchStats = async () => {
    try {
      const response = await axios.get('/api/admin/stats');
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await axios.get('/api/products');
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const fetchOrders = async () => {
    try {
      const response = await axios.get('/api/admin/orders');
      setOrders(response.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await axios.get('/api/admin/users');
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('admin');
    navigate('/admin/login');
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProductSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingProduct) {
        // For editing, use the existing endpoint if no new image is selected
        if (!selectedImage) {
          await axios.put(`/api/admin/products/${editingProduct.id}`, productForm);
        } else {
          // If new image is selected, use FormData
          const formData = new FormData();
          formData.append('name', productForm.name);
          formData.append('description', productForm.description);
          formData.append('price', productForm.price);
          formData.append('stockQuantity', productForm.stockQuantity);
          formData.append('category', productForm.category);
          formData.append('brand', productForm.brand);
          formData.append('image', selectedImage);
          
          await axios.put(`/api/admin/products/${editingProduct.id}/with-image`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
          });
        }
      } else {
        // For new products, use the with-image endpoint
        const formData = new FormData();
        formData.append('name', productForm.name);
        formData.append('description', productForm.description);
        formData.append('price', productForm.price);
        formData.append('stockQuantity', productForm.stockQuantity);
        formData.append('category', productForm.category);
        formData.append('brand', productForm.brand);
        
        if (selectedImage) {
          formData.append('image', selectedImage);
          await axios.post('/api/admin/products/with-image', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
          });
        } else {
          // Fallback to regular endpoint if no image
          await axios.post('/api/admin/products', productForm);
        }
      }
      
      setShowProductModal(false);
      setEditingProduct(null);
      setProductForm({
        name: '', description: '', price: '', stockQuantity: '', category: '', brand: '', imageUrl: ''
      });
      setSelectedImage(null);
      setImagePreview(null);
      fetchProducts();
      fetchStats();
    } catch (error) {
      console.error('Error saving product:', error);
    }
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setProductForm({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      stockQuantity: product.stockQuantity.toString(),
      category: product.category,
      brand: product.brand || '',
      imageUrl: product.imageUrl || ''
    });
    setSelectedImage(null);
    setImagePreview(product.imageUrl || null);
    setShowProductModal(true);
  };

  const handleDeleteProduct = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await axios.delete(`/api/products/${id}`);
        fetchProducts();
        fetchStats();
      } catch (error) {
        console.error('Error deleting product:', error);
      }
    }
  };

  const updateOrderStatus = async (orderId, status) => {
    try {
      await axios.put(`/api/admin/orders/${orderId}/status`, { status });
      fetchOrders();
      fetchStats();
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

  const getStatusBadge = (status) => {
    const variants = {
      PENDING: 'warning',
      CONFIRMED: 'info',
      SHIPPED: 'primary',
      DELIVERED: 'success',
      CANCELLED: 'danger'
    };
    return <Badge bg={variants[status] || 'secondary'}>{status}</Badge>;
  };

  const renderDashboard = () => (
    <Row>
      <Col md={3}>
        <Card className="text-center">
          <Card.Body>
            <h3>{stats.totalProducts}</h3>
            <p>Total Products</p>
          </Card.Body>
        </Card>
      </Col>
      <Col md={3}>
        <Card className="text-center">
          <Card.Body>
            <h3>{stats.totalUsers}</h3>
            <p>Total Users</p>
          </Card.Body>
        </Card>
      </Col>
      <Col md={3}>
        <Card className="text-center">
          <Card.Body>
            <h3>{stats.totalOrders}</h3>
            <p>Total Orders</p>
          </Card.Body>
        </Card>
      </Col>
      <Col md={3}>
        <Card className="text-center">
          <Card.Body>
            <h3>{stats.pendingOrders}</h3>
            <p>Pending Orders</p>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );

  const renderProducts = () => (
    <Card>
      <Card.Header className="d-flex justify-content-between align-items-center">
        <h5>Product Management</h5>
        <Button variant="primary" onClick={() => setShowProductModal(true)}>
          Add Product
        </Button>
      </Card.Header>
      <Card.Body>
        <Table responsive>
          <thead>
            <tr>
              <th>Name</th>
              <th>Category</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map(product => (
              <tr key={product.id}>
                <td>{product.name}</td>
                <td>{product.category}</td>
                <td>${product.price}</td>
                <td>{product.stockQuantity}</td>
                <td>
                  <Button 
                    variant="outline-primary" 
                    size="sm" 
                    className="me-2"
                    onClick={() => handleEditProduct(product)}
                  >
                    Edit
                  </Button>
                  <Button 
                    variant="outline-danger" 
                    size="sm"
                    onClick={() => handleDeleteProduct(product.id)}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Card.Body>
    </Card>
  );

  const renderOrders = () => (
    <Card>
      <Card.Header>
        <h5>Order Management</h5>
      </Card.Header>
      <Card.Body>
        <Table responsive>
          <thead>
            <tr>
              <th>Order ID</th>
              <th>User</th>
              <th>Total</th>
              <th>Status</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => (
              <tr key={order.id}>
                <td>#{order.id}</td>
                <td>{order.user?.firstName} {order.user?.lastName}</td>
                <td>${order.totalAmount}</td>
                <td>{getStatusBadge(order.status)}</td>
                <td>{new Date(order.orderDate).toLocaleDateString()}</td>
                <td>
                  <Form.Select 
                    size="sm" 
                    value={order.status}
                    onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                  >
                    <option value="PENDING">Pending</option>
                    <option value="CONFIRMED">Confirmed</option>
                    <option value="SHIPPED">Shipped</option>
                    <option value="DELIVERED">Delivered</option>
                    <option value="CANCELLED">Cancelled</option>
                  </Form.Select>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Card.Body>
    </Card>
  );

  return (
    <Container fluid className="my-4">
      <Row>
        <Col md={2}>
          <Card>
            <Card.Header>
              <h6>Admin Panel</h6>
            </Card.Header>
            <Card.Body className="p-0">
              <div className="list-group list-group-flush">
                <button 
                  className={`list-group-item list-group-item-action ${activeTab === 'dashboard' ? 'active' : ''}`}
                  onClick={() => setActiveTab('dashboard')}
                >
                  Dashboard
                </button>
                <button 
                  className={`list-group-item list-group-item-action ${activeTab === 'products' ? 'active' : ''}`}
                  onClick={() => setActiveTab('products')}
                >
                  Products
                </button>
                <button 
                  className={`list-group-item list-group-item-action ${activeTab === 'orders' ? 'active' : ''}`}
                  onClick={() => setActiveTab('orders')}
                >
                  Orders
                </button>
                <button 
                  className="list-group-item list-group-item-action text-danger"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={10}>
          {activeTab === 'dashboard' && renderDashboard()}
          {activeTab === 'products' && renderProducts()}
          {activeTab === 'orders' && renderOrders()}
        </Col>
      </Row>

      {/* Product Modal */}
      <Modal show={showProductModal} onHide={() => setShowProductModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{editingProduct ? 'Edit Product' : 'Add Product'}</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleProductSubmit}>
          <Modal.Body>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Name</Form.Label>
                  <Form.Control
                    type="text"
                    value={productForm.name}
                    onChange={(e) => setProductForm({...productForm, name: e.target.value})}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Category</Form.Label>
                  <Form.Control
                    type="text"
                    value={productForm.category}
                    onChange={(e) => setProductForm({...productForm, category: e.target.value})}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={productForm.description}
                onChange={(e) => setProductForm({...productForm, description: e.target.value})}
              />
            </Form.Group>
            <Row>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Price</Form.Label>
                  <Form.Control
                    type="number"
                    step="0.01"
                    value={productForm.price}
                    onChange={(e) => setProductForm({...productForm, price: e.target.value})}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Stock Quantity</Form.Label>
                  <Form.Control
                    type="number"
                    value={productForm.stockQuantity}
                    onChange={(e) => setProductForm({...productForm, stockQuantity: e.target.value})}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Brand</Form.Label>
                  <Form.Control
                    type="text"
                    value={productForm.brand}
                    onChange={(e) => setProductForm({...productForm, brand: e.target.value})}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Form.Group className="mb-3">
              <Form.Label>Product Image</Form.Label>
              <Form.Control
                type="file"
                accept="image/*"
                onChange={handleImageChange}
              />
              {imagePreview && (
                <div className="mt-2">
                  <img 
                    src={imagePreview} 
                    alt="Preview" 
                    style={{ maxWidth: '200px', maxHeight: '200px', objectFit: 'cover' }}
                    className="img-thumbnail"
                  />
                </div>
              )}
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowProductModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              {editingProduct ? 'Update Product' : 'Add Product'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </Container>
  );
};

export default AdminDashboard;
