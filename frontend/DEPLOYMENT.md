# E-commerce App - Unified Platform

A complete e-commerce platform with role-based authentication for buyers, sellers, and administrators.

## 🚀 Features

### **Universal Authentication System**
- **Single Login Page** for all user types
- **Role-based Access Control**:
  - 🛒 **Buyers**: Shop, cart, orders, profile management
  - 🏪 **Sellers**: Product management, sales dashboard, order fulfillment
  - 👨‍💼 **Admins**: Platform management, analytics, user oversight

### **Core Functionality**
- **Product Management**: Add, edit, delete products with images
- **Order Management**: Track and manage orders with status updates
- **Shopping Cart**: Full cart functionality for buyers
- **Payment Integration**: Razorpay integration
- **Admin Dashboard**: Analytics, charts, and insights
- **Seller Dashboard**: Sales tracking and product performance
- **Hero Banners**: Dynamic banner management
- **Promo Codes**: Discount campaign system

## 🛠️ Tech Stack

- **Frontend**: React 19, Vite, Tailwind CSS
- **Routing**: React Router v7
- **UI Components**: Lucide React Icons
- **Charts**: Recharts
- **Notifications**: React Toastify
- **HTTP Client**: Axios
- **State Management**: React Context API

## 📦 Deployment

### **Netlify Deployment**
1. Push code to GitHub repository
2. Connect repository to Netlify
3. Set build command: `npm run build`
4. Set publish directory: `dist`
5. Deploy! 🎉

### **GitHub Pages Deployment**
1. Update `vite.config.js` base path to your repo name
2. Run deployment script:
   ```bash
   chmod +x deploy.sh
   ./deploy.sh
   ```
3. Enable GitHub Pages in repository settings

### **Environment Variables**
Set these in your deployment platform:
```
VITE_BACKEND_URL=https://your-backend-url.com
```

## 🏗️ Project Structure

```
ecommerce-app/
├── src/
│   ├── pages/           # Main application pages
│   ├── componants/      # Reusable UI components  
│   ├── admin-pages/      # Admin/seller specific pages
│   ├── admin-components/ # Admin/seller components
│   ├── admin-assets/     # Admin-specific assets
│   ├── context/         # React context providers
│   └── assets/          # General assets
├── public/              # Static files
├── dist/               # Build output (deploy this)
├── package.json        # Dependencies and scripts
├── vite.config.js      # Vite configuration
└── netlify.toml       # Netlify deployment config
```

## 🔐 Authentication Flow

1. **Universal Login**: Single login page with role selection
2. **Token Management**: Different tokens for buyers vs admin/sellers
3. **Route Protection**: Protected routes based on user roles
4. **Automatic Redirect**: Users redirected to appropriate dashboard

## 🎯 User Roles & Access

### **Buyer Role**
- ✅ Browse products
- ✅ Add to cart
- ✅ Place orders
- ✅ View order history
- ✅ Manage profile
- ❌ Access admin panels

### **Seller Role**  
- ✅ Product management
- ✅ Order fulfillment
- ✅ Sales dashboard
- ✅ Inventory tracking
- ❌ Platform administration
- ❌ Access buyer cart

### **Admin Role**
- ✅ Full platform access
- ✅ User management
- ✅ Analytics dashboard
- ✅ System configuration
- ✅ All seller capabilities

## 🚀 Getting Started

### **Development Setup**
```bash
# Clone repository
git clone <repository-url>
cd ecommerce-app

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

### **Backend Setup**
Ensure your backend is running on port 4000 or update the proxy configuration in `vite.config.js`.

## 📱 Responsive Design

- **Mobile First**: Optimized for all screen sizes
- **Progressive Enhancement**: Enhanced experience on larger screens
- **Touch Friendly**: Mobile-optimized interactions

## 🔧 Configuration

### **Vite Configuration**
- **Development**: Runs on `http://localhost:5173`
- **API Proxy**: Backend requests proxied to `http://localhost:4000`
- **Build Optimization**: Code splitting and minification

### **Build Optimization**
- **Code Splitting**: Separate chunks for vendors, router, UI, charts
- **Asset Optimization**: Image optimization and lazy loading
- **Source Maps**: Available for debugging

## 🌟 Key Features Implemented

### **Universal Login System**
- Single entry point for all user types
- Role-based authentication
- Seamless user experience

### **Admin Dashboard**
- Real-time analytics
- Order management
- Product oversight
- User management

### **Seller Tools**
- Product catalog management
- Sales tracking
- Order processing
- Performance metrics

### **Shopping Experience**
- Product browsing with filters
- Shopping cart management
- Secure checkout
- Order tracking

## 📊 Analytics & Reporting

- **Sales Analytics**: Revenue and order trends
- **Product Performance**: Best-selling products
- **User Metrics**: Registration and activity stats
- **Inventory Management**: Stock tracking and alerts

## 🎨 UI/UX Features

- **Modern Design**: Clean, professional interface
- **Interactive Elements**: Smooth transitions and animations
- **Accessibility**: WCAG compliant components
- **Loading States**: Optimized user feedback
- **Error Handling**: Comprehensive error management

## 🔒 Security Features

- **JWT Authentication**: Secure token-based auth
- **Role-Based Access**: Proper authorization controls
- **Input Validation**: Client and server-side validation
- **XSS Protection**: Sanitized user inputs

## 📈 Performance

- **Lazy Loading**: Components and images loaded on demand
- **Code Splitting**: Optimized bundle sizes
- **Caching**: Browser and server caching strategies
- **SEO Optimized**: Meta tags and structured data

## 🤝 Contributing

1. Fork the repository
2. Create feature branch
3. Make your changes
4. Add tests if applicable
5. Submit pull request

## 📝 License

This project is licensed under the MIT License.

---

**🎉 Ready for Deployment!**

The application is fully configured and ready for deployment to Netlify, GitHub Pages, or any static hosting platform.
