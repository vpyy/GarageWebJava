# GarageGo Frontend

Modern React frontend application for GarageGo - Automotive Garage Management System.

## 🚀 Features

### Admin Dashboard
- **Dashboard Overview**: Statistics, charts, and key metrics
- **Customer Management**: CRUD operations for customers and their vehicles
- **Service Management**: Manage automotive services and pricing
- **Product Management**: Inventory management with stock tracking
- **Invoice Management**: Create and manage service invoices
- **Request Management**: Handle customer service requests
- **Contact Management**: Manage customer inquiries
- **Reports & Analytics**: Revenue reports and business insights

### Customer Portal
- **Service Catalog**: Browse available automotive services
- **Product Catalog**: Browse and purchase automotive products
- **Shopping Cart**: Add products and checkout
- **Service Booking**: Request automotive services
- **User Profile**: Manage personal information
- **Order Tracking**: View order history and status
- **Contact Form**: Submit inquiries and feedback

## 🛠 Tech Stack

- **React 18** with TypeScript
- **Redux Toolkit** for state management
- **React Router** for navigation
- **React Query** for server state management
- **React Hook Form** with Yup validation
- **Tailwind CSS** for styling
- **Recharts** for data visualization
- **Axios** for API communication
- **React Hot Toast** for notifications

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── auth/           # Authentication components
│   ├── common/         # Common UI components
│   ├── forms/          # Form components
│   ├── layouts/        # Layout components
│   └── ui/             # Base UI components
├── pages/              # Page components
│   ├── admin/          # Admin dashboard pages
│   ├── auth/           # Authentication pages
│   ├── customer/       # Customer portal pages
│   └── error/          # Error pages
├── services/           # API service classes
├── store/              # Redux store and slices
├── types/              # TypeScript type definitions
├── utils/              # Utility functions and constants
├── hooks/              # Custom React hooks
└── assets/             # Static assets
```

## 🚦 Getting Started

### Prerequisites
- Node.js 16+ and npm/yarn
- GaraAPI backend running on https://localhost:7002

### Installation

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Environment setup**
   ```bash
   # Copy environment file
   cp .env.development .env.local
   
   # Update API URL if needed
   REACT_APP_API_BASE_URL=https://localhost:7002/api
   ```

3. **Start development server**
   ```bash
   npm start
   ```

4. **Open application**
   - Customer Portal: http://localhost:3000
   - Admin Dashboard: http://localhost:3000/admin

### Build for Production

```bash
npm run build
```

## 🔐 Authentication

The application supports role-based authentication:

- **Admin Role**: Access to admin dashboard and management features
- **Customer Role**: Access to customer portal and personal features

### Default Login Credentials
- **Admin**: username: `admin`, password: `admin123`
- **Customer**: Register new account or use existing customer credentials

## 🎨 UI/UX Features

- **Responsive Design**: Works on desktop, tablet, and mobile
- **Dark/Light Theme**: Theme switching support
- **Loading States**: Skeleton loaders and spinners
- **Error Handling**: User-friendly error messages
- **Toast Notifications**: Success/error feedback
- **Form Validation**: Real-time validation with error messages
- **Search & Filter**: Advanced search and filtering capabilities
- **Pagination**: Efficient data pagination
- **Charts & Analytics**: Interactive data visualizations

## 📊 State Management

### Redux Store Structure
- **auth**: User authentication and session management
- **cart**: Shopping cart state for customer portal
- **ui**: UI state (sidebar, theme, notifications)

### React Query
- Server state caching and synchronization
- Background refetching
- Optimistic updates
- Error handling

## 🔌 API Integration

All API calls are handled through service classes:
- `authService`: Authentication operations
- `customerService`: Customer and vehicle management
- `productService`: Products, services, and service requests
- `invoiceService`: Invoice management and statistics
- `contactService`: Contact management

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests with coverage
npm test -- --coverage

# Run tests in watch mode
npm test -- --watch
```

## 📝 Code Quality

- **ESLint**: Code linting with React and TypeScript rules
- **Prettier**: Code formatting
- **TypeScript**: Type safety and better developer experience

```bash
# Lint code
npm run lint

# Fix linting issues
npm run lint:fix

# Format code
npm run format
```

## 🚀 Deployment

### Build Optimization
- Code splitting and lazy loading
- Bundle size optimization
- Image optimization
- Caching strategies

### Environment Variables
- `REACT_APP_API_BASE_URL`: Backend API URL
- `REACT_APP_ENVIRONMENT`: Environment (development/production)
- `REACT_APP_APP_NAME`: Application name
- `REACT_APP_VERSION`: Application version

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation

---

**GarageGo Frontend** - Modern automotive garage management made simple.