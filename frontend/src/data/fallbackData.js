// MongoDB-like fallback data service for complete application functionality
// This provides all data that would normally come from backend APIs

// Import products from assets
import { products as allProducts } from "../assets/assets.js";

// Import hero images from assets
import { hero_img, contact_img, about_img } from "../assets/assets.js";

// Hero Slider Data
export const heroSlides = [
  {
    _id: 'hero-1',
    image: hero_img,
    title: 'New Collection 2024',
    subtitle: 'Discover our latest arrivals with exclusive discounts',
    tag: 'NEW',
    category: 'Featured',
    categorySlug: 'featured',
    buttonText: 'Shop Now',
    bottomText: 'Limited time offer - Up to 50% off'
  },
  {
    _id: 'hero-2',
    image: contact_img,
    title: 'Summer Sale',
    subtitle: 'Massive discounts on selected items',
    tag: 'SALE',
    category: 'Summer',
    categorySlug: 'summer',
    buttonText: 'View Deals',
    bottomText: 'Hurry! Sale ends soon'
  },
  {
    _id: 'hero-3',
    image: about_img,
    title: 'Premium Quality',
    subtitle: 'Handpicked products with guaranteed satisfaction',
    tag: 'PREMIUM',
    category: 'Quality',
    categorySlug: 'quality',
    buttonText: 'Explore',
    bottomText: 'Premium collection available'
  }
];

// Orders Data for Admin/Seller Panels
export const sampleOrders = [
  {
    _id: 'order-1',
    orderNumber: 'ORD-2024-001',
    date: new Date('2024-01-15'),
    customer: {
      name: 'John Doe',
      email: 'john@example.com',
      phone: '+1234567890'
    },
    items: [
      {
        productId: 'aaaaa',
        name: 'Women Round Neck Cotton Top',
        quantity: 2,
        size: 'M',
        price: 100
      },
      {
        productId: 'aaaab',
        name: 'Men Round Neck Pure Cotton T-shirt',
        quantity: 1,
        size: 'L',
        price: 200
      }
    ],
    totalAmount: 400,
    status: 'Processing',
    paymentMethod: 'COD',
    address: {
      street: '123 Main St',
      city: 'New York',
      state: 'NY',
      zip: '10001',
      country: 'USA'
    }
  },
  {
    _id: 'order-2',
    orderNumber: 'ORD-2024-002',
    date: new Date('2024-01-16'),
    customer: {
      name: 'Jane Smith',
      email: 'jane@example.com',
      phone: '+0987654321'
    },
    items: [
      {
        productId: 'aaaac',
        name: 'Girls Round Neck Cotton Top',
        quantity: 1,
        size: 'S',
        price: 220
      }
    ],
    totalAmount: 220,
    status: 'Shipped',
    paymentMethod: 'Online',
    address: {
      street: '456 Oak Ave',
      city: 'Los Angeles',
      state: 'CA',
      zip: '90001',
      country: 'USA'
    }
  },
  {
    _id: 'order-3',
    orderNumber: 'ORD-2024-003',
    date: new Date('2024-01-17'),
    customer: {
      name: 'Bob Johnson',
      email: 'bob@example.com',
      phone: '+1122334455'
    },
    items: [
      {
        productId: 'aaaad',
        name: 'Men Round Neck Pure Cotton T-shirt',
        quantity: 3,
        size: 'XL',
        price: 110
      }
    ],
    totalAmount: 330,
    status: 'Delivered',
    paymentMethod: 'Card',
    address: {
      street: '789 Pine St',
      city: 'Chicago',
      state: 'IL',
      zip: '60601',
      country: 'USA'
    }
  }
];

// Sales Analytics Data
export const salesAnalytics = {
  totalRevenue: 15450,
  totalOrders: 156,
  averageOrderValue: 99.04,
  todayRevenue: 1250,
  todayOrders: 8,
  weeklyRevenue: 8750,
  weeklyOrders: 89,
  monthlyRevenue: 35200,
  monthlyOrders: 356,
  topProducts: [
    { productId: 'aaaaa', name: 'Women Round Neck Cotton Top', sales: 45, revenue: 4500 },
    { productId: 'aaaab', name: 'Men Round Neck Pure Cotton T-shirt', sales: 32, revenue: 6400 },
    { productId: 'aaaac', name: 'Girls Round Neck Cotton Top', sales: 28, revenue: 6160 }
  ],
  categoryBreakdown: [
    { category: 'Women', sales: 89, revenue: 12450 },
    { category: 'Men', sales: 67, revenue: 8750 },
    { category: 'Kids', sales: 28, revenue: 6160 }
  ],
  recentSales: [
    {
      _id: 'sale-1',
      date: new Date('2024-01-17'),
      productId: 'aaaaa',
      name: 'Women Round Neck Cotton Top',
      quantity: 3,
      total: 300
    },
    {
      _id: 'sale-2',
      date: new Date('2024-01-17'),
      productId: 'aaaab',
      name: 'Men Round Neck Pure Cotton T-shirt',
      quantity: 2,
      total: 400
    }
  ]
};

// Users Data for Admin Panel
export const sampleUsers = [
  {
    _id: 'user-1',
    name: 'John Doe',
    email: 'john@example.com',
    role: 'buyer',
    registeredDate: new Date('2024-01-10'),
    lastLogin: new Date('2024-01-17'),
    totalOrders: 12,
    totalSpent: 1250,
    status: 'Active'
  },
  {
    _id: 'user-2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    role: 'seller',
    registeredDate: new Date('2024-01-12'),
    lastLogin: new Date('2024-01-16'),
    totalProducts: 25,
    totalSales: 8750,
    status: 'Active'
  },
  {
    _id: 'user-3',
    name: 'Admin User',
    email: 'admin@example.com',
    role: 'admin',
    registeredDate: new Date('2024-01-01'),
    lastLogin: new Date('2024-01-17'),
    status: 'Active'
  }
];

// Promo Codes Data
export const promoCodes = [
  {
    _id: 'promo-1',
    code: 'SAVE20',
    discount: 20,
    type: 'percentage',
    maxUses: 100,
    currentUses: 45,
    expires: new Date('2024-12-31'),
    status: 'Active',
    description: 'Save 20% on your order'
  },
  {
    _id: 'promo-2',
    code: 'FLAT50',
    discount: 50,
    type: 'fixed',
    minAmount: 200,
    maxUses: 50,
    currentUses: 12,
    expires: new Date('2024-06-30'),
    status: 'Active',
    description: '$50 off on orders over $200'
  },
  {
    _id: 'promo-3',
    code: 'WELCOME10',
    discount: 10,
    type: 'percentage',
    maxUses: 200,
    currentUses: 89,
    expires: new Date('2024-03-31'),
    status: 'Expired',
    description: 'Welcome bonus - 10% off'
  }
];

// Dashboard Statistics
export const dashboardStats = {
  overview: {
    totalProducts: 52,
    activeProducts: 48,
    outOfStock: 4,
    lowStock: 6,
    totalCategories: 3,
    totalUsers: 1247,
    activeUsers: 892,
    newUsersToday: 15
  },
  performance: {
    conversionRate: 3.4,
    bounceRate: 2.1,
    avgSessionDuration: '4m 32s',
    pageViews: 15420,
    uniqueVisitors: 8934
  },
  inventory: {
    totalValue: 125750,
    categoriesValue: {
      'Women': 45200,
      'Men': 38400,
      'Kids': 42150
    },
    topMoving: [
      { productId: 'aaaaa', name: 'Women Round Neck Cotton Top', stock: 15 },
      { productId: 'aaaab', name: 'Men Round Neck Pure Cotton T-shirt', stock: 12 },
      { productId: 'aaaac', name: 'Girls Round Neck Cotton Top', stock: 8 }
    ]
  }
};

// Helper functions for data manipulation
export const dataHelpers = {
  // Get orders by status
  getOrdersByStatus: (status) => {
    return sampleOrders.filter(order => order.status === status);
  },
  
  // Get orders by date range
  getOrdersByDateRange: (startDate, endDate) => {
    return sampleOrders.filter(order => 
      order.date >= startDate && order.date <= endDate
    );
  },
  
  // Get active promo codes
  getActivePromoCodes: () => {
    return promoCodes.filter(promo => 
      promo.status === 'Active' && new Date(promo.expires) > new Date()
    );
  },
  
  // Get users by role
  getUsersByRole: (role) => {
    return sampleUsers.filter(user => user.role === role);
  },
  
  // Calculate revenue for period
  getRevenueForPeriod: (period) => {
    const now = new Date();
    let startDate;
    
    switch(period) {
      case 'today':
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        break;
      case 'week':
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7);
        break;
      case 'month':
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        break;
      default:
        startDate = new Date(now.getFullYear(), 0, 1);
    }
    
    return sampleOrders
      .filter(order => order.date >= startDate)
      .reduce((total, order) => total + order.totalAmount, 0);
  },
  
  // Search products
  searchProducts: (query) => {
    if (!query) return [];
    
    const searchTerm = query.toLowerCase();
    return sampleOrders.flatMap(order => order.items)
      .filter(item => 
        item.name.toLowerCase().includes(searchTerm)
      )
      .slice(0, 10); // Limit to 10 results
  }
};

// Export products for use in other components
export const products = allProducts;
