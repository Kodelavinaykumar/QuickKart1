# QuickKart - E-commerce Website

A full-stack e-commerce application built with Spring Boot (backend) and React (frontend), using MySQL as the database.

## Features

- **Product Management**: Browse, search, and filter products by category and price
- **Shopping Cart**: Add/remove items, update quantities, persistent cart storage
- **User Authentication**: Register and login functionality
- **Order Management**: Place orders and view order history
- **Responsive Design**: Modern UI with Bootstrap components
- **RESTful API**: Well-structured backend API endpoints

## Tech Stack

### Backend
- **Spring Boot 3.1.0** - Main framework
- **Spring Data JPA** - Database operations
- **Spring Security** - Authentication and authorization
- **MySQL 8.0** - Database
- **Maven** - Dependency management

### Frontend
- **React 18** - UI framework
- **React Router** - Navigation
- **React Bootstrap** - UI components
- **Axios** - HTTP client
- **Context API** - State management

## Project Structure

```
QuickKart2/
├── src/main/java/com/quickkart/
│   ├── entity/          # JPA entities
│   ├── repository/      # Data repositories
│   ├── service/         # Business logic
│   ├── controller/      # REST controllers
│   └── config/          # Configuration classes
├── frontend/
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── context/     # Context providers
│   │   └── App.js       # Main app component
│   └── public/          # Static files
└── README.md
```

## Setup Instructions

### Prerequisites
- Java 17 or higher
- Node.js 16 or higher
- MySQL 8.0
- Maven 3.6+

### Database Setup
1. Install MySQL and create a database named `quickkart`
2. Update database credentials in `src/main/resources/application.properties`

### Backend Setup
1. Navigate to the project root directory
2. Run the Spring Boot application:
   ```bash
   mvn spring-boot:run
   ```
3. The backend will start on `http://localhost:8084`

### Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the React development server:
   ```bash
   npm start
   ```
4. The frontend will start on `http://localhost:3000`

## API Endpoints

### Products
- `GET /api/products` - Get all products
- `GET /api/products/{id}` - Get product by ID
- `GET /api/products/category/{category}` - Get products by category
- `GET /api/products/search?q={query}` - Search products
- `GET /api/products/filter` - Filter products with parameters

### Users
- `POST /api/users/register` - Register new user
- `POST /api/users/login` - User login
- `GET /api/users/{id}` - Get user by ID

### Orders
- `POST /api/orders` - Create new order
- `GET /api/orders/user/{userId}` - Get user's orders
- `PUT /api/orders/{id}/status` - Update order status

## Default Configuration

- **Server Port**: 8084
- **Database**: MySQL on localhost:3306
- **Database Name**: quickkart
- **Username**: root
- **Password**: root

## Sample Data

The application automatically populates the database with sample products across various categories:
- Electronics (iPhones, laptops, tablets)
- Clothing (shoes, jeans, hoodies)
- Home & Garden (appliances, smart devices)
- Books (novels, technical books)
- Sports (equipment, fitness gear)

## Usage

1. **Browse Products**: Visit the homepage to see featured products and categories
2. **Search & Filter**: Use the products page to search and filter items
3. **Add to Cart**: Click "Add to Cart" on any product
4. **Register/Login**: Create an account or login to place orders
5. **Checkout**: Review your cart and place an order
6. **Order History**: View your past orders in the "My Orders" section

## Development Notes

- The application uses CORS configuration to allow frontend-backend communication
- Cart data is persisted in localStorage
- User sessions are managed through React Context
- The database schema is auto-generated using JPA annotations
- Sample data is loaded automatically on first startup

## Future Enhancements

- Payment gateway integration
- Product image upload functionality
- Admin panel for product management
- Email notifications
- Product reviews and ratings
- Inventory management
- Order tracking system

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is licensed under the MIT License.
