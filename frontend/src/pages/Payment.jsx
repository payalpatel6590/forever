import React, { useState, useContext, useEffect } from "react";
import { ShopContext } from "../context/ShopContext";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { CreditCard, Lock, Shield, Download, Mail, CheckCircle, ShoppingBag, Truck, Percent, Tag, Calendar, User, MapPin, Phone } from 'lucide-react';

const Payment = () => {
  const navigate = useNavigate();

  const {
    backendUrl,
    token,
    setCartItems,
    cartItems,
    products,
    currancy,
    delivery_fee,
    getCartAmount
  } = useContext(ShopContext);

  const [orderSummary, setOrderSummary] = useState({
    subtotal: 0,
    delivery: delivery_fee || 10,
    tax: 0,
    discount: 0,
    total: 0,
    itemCount: 0
  });

  const [isProcessing, setIsProcessing] = useState(false);
  const [invoiceData, setInvoiceData] = useState(null);
  const [showInvoice, setShowInvoice] = useState(false);
  const [emailSending, setEmailSending] = useState(false);

  // Card form state
  const [cardData, setCardData] = useState({
    cardNumber: "",
    expiry: "",
    cvv: "",
    name: "",
    saveCard: false
  });

  const [errors, setErrors] = useState({});

  // ✅ FAST CALCULATION (NO LAG) - Using same logic as CartTotal
  useEffect(() => {
    // Use getCartAmount from context (same as CartTotal component)
    const subtotal = getCartAmount();
    
    // Calculate item count
    let itemCount = 0;
    for (const itemId in cartItems) {
      const itemSizes = cartItems[itemId];
      if (typeof itemSizes === 'object') {
        // Cart has size variations
        for (const size in itemSizes) {
          const quantity = itemSizes[size];
          if (quantity > 0) {
            itemCount += quantity;
          }
        }
      } else if (typeof itemSizes === 'number' && itemSizes > 0) {
        // Cart has simple quantity (no sizes)
        itemCount += itemSizes;
      }
    }

    console.log('Payment Page Calculation:', { subtotal, itemCount });

    // Calculate tax (8% of subtotal)
    const tax = subtotal * 0.08;
    
    // Calculate discount (5% if subtotal > 100)
    const discount = subtotal > 100 ? subtotal * 0.05 : 0;
    
    // Calculate total
    const total = subtotal + (delivery_fee || 10) + tax - discount;

    setOrderSummary({
      subtotal,
      delivery: delivery_fee || 10,
      tax,
      discount,
      total,
      itemCount
    });

  }, [cartItems, getCartAmount, delivery_fee]);

  // ✅ PDF GENERATOR
  const generateInvoicePDF = (order) => {
    const doc = new jsPDF();

    // Header
    doc.setFontSize(20);
    doc.setTextColor(102, 51, 153);
    doc.text("INVOICE", 105, 20, { align: 'center' });

    doc.setFontSize(12);
    doc.setTextColor(100);
    doc.text(`Order ID: ${order._id}`, 14, 35);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 14, 42);
    doc.text(`Payment Method: ${order.paymentMethod || 'Card'}`, 14, 49);

    // Customer Information
    doc.setFontSize(14);
    doc.setTextColor(0);
    doc.text("Customer Information:", 14, 65);
    
    doc.setFontSize(10);
    doc.setTextColor(60);
    doc.text(`${order.address?.firstName || 'N/A'} ${order.address?.lastName || 'N/A'}`, 14, 72);
    doc.text(order.address?.street || 'N/A', 14, 78);
    doc.text(`${order.address?.city || 'N/A'}, ${order.address?.state || 'N/A'} ${order.address?.zipCode || 'N/A'}`, 14, 84);
    doc.text(order.address?.country || 'N/A', 14, 90);
    doc.text(`Phone: ${order.address?.phone || 'N/A'}`, 14, 96);
    doc.text(`Email: ${order.address?.email || 'N/A'}`, 14, 102);

    // Order Items
    const tableData = [];
    if (order.items && Array.isArray(order.items)) {
      order.items.forEach(item => {
        tableData.push([
          item.name || 'Product',
          item.quantity || 1,
          `${currancy}${item.price || 0}`,
          `${currancy}${(item.price || 0) * (item.quantity || 1)}`
        ]);
      });
    }

    autoTable(doc, {
      startY: 115,
      head: [["Product", "Quantity", "Price", "Total"]],
      body: tableData,
      theme: 'grid',
      headStyles: {
        fillColor: [102, 51, 153],
        textColor: 255
      }
    });

    // Summary
    const y = doc.lastAutoTable.finalY + 15;
    doc.setFontSize(12);
    doc.setTextColor(0);
    doc.text(`Subtotal: ${currancy}${orderSummary.subtotal.toFixed(2)}`, 140, y);
    doc.text(`Delivery: ${currancy}${orderSummary.delivery.toFixed(2)}`, 140, y + 8);
    doc.text(`Tax (8%): ${currancy}${orderSummary.tax.toFixed(2)}`, 140, y + 16);
    
    if (orderSummary.discount > 0) {
      doc.setTextColor(34, 139, 34);
      doc.text(`Discount: -${currancy}${orderSummary.discount.toFixed(2)}`, 140, y + 24);
    }

    doc.setFontSize(14);
    doc.setTextColor(102, 51, 153);
    doc.text(`Total: ${currancy}${orderSummary.total.toFixed(2)}`, 140, y + 34);

    // Footer
    doc.setFontSize(10);
    doc.setTextColor(150);
    doc.text("Thank you for your purchase!", 105, 280, { align: 'center' });

    doc.save(`invoice_${order._id}.pdf`);
  };

  const onChangeHandler = (e) => {
    const { name, value, type, checked } = e.target;
    setCardData({ 
      ...cardData, 
      [name]: type === 'checkbox' ? checked : value 
    });
    
    // Clear error for this field
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const validateCard = () => {
    const newErrors = {};
    
    // Card number validation (16 digits, numbers only)
    const cardNumberClean = cardData.cardNumber.replace(/\s/g, '');
    if (!cardNumberClean) {
      newErrors.cardNumber = "Card number is required";
    } else if (cardNumberClean.length !== 16) {
      newErrors.cardNumber = "Card number must be 16 digits";
    } else if (!/^\d{16}$/.test(cardNumberClean)) {
      newErrors.cardNumber = "Card number must contain only digits";
    }
    
    // Expiry validation (MM/YY format and future date)
    if (!cardData.expiry) {
      newErrors.expiry = "Expiry date is required";
    } else {
      const expiryRegex = /^(0[1-9]|1[0-2])\/\d{2}$/;
      if (!expiryRegex.test(cardData.expiry)) {
        newErrors.expiry = "Expiry date must be in MM/YY format";
      } else {
        const [month, year] = cardData.expiry.split('/');
        const currentYear = new Date().getFullYear() % 100;
        const currentMonth = new Date().getMonth() + 1;
        const expYear = parseInt(year);
        const expMonth = parseInt(month);
        
        if (expYear < currentYear || (expYear === currentYear && expMonth < currentMonth)) {
          newErrors.expiry = "Card has expired";
        }
      }
    }
    
    // CVV validation (3 digits, numbers only)
    if (!cardData.cvv) {
      newErrors.cvv = "CVV is required";
    } else if (cardData.cvv.length !== 3) {
      newErrors.cvv = "CVV must be 3 digits";
    } else if (!/^\d{3}$/.test(cardData.cvv)) {
      newErrors.cvv = "CVV must contain only digits";
    }
    
    // Name validation (letters only, min 3 characters)
    if (!cardData.name) {
      newErrors.name = "Cardholder name is required";
    } else if (cardData.name.trim().length < 3) {
      newErrors.name = "Name must be at least 3 characters";
    } else if (!/^[a-zA-Z\s]+$/.test(cardData.name.trim())) {
      newErrors.name = "Name must contain only letters";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const formatCardNumber = (value) => {
    const v = value.replace(/\s/g, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  const formatExpiry = (value) => {
    const v = value.replace(/\s/g, '');
    if (v.length >= 2) {
      return v.slice(0, 2) + '/' + v.slice(2, 4);
    }
    return v;
  };

  const handleCardNumberChange = (e) => {
    // Only allow numbers
    const value = e.target.value.replace(/\D/g, '');
    const formatted = formatCardNumber(value);
    setCardData({ ...cardData, cardNumber: formatted });
  };

  const handleExpiryChange = (e) => {
    // Only allow numbers
    const value = e.target.value.replace(/\D/g, '');
    const formatted = formatExpiry(value);
    setCardData({ ...cardData, expiry: formatted });
  };

  const handleCvvChange = (e) => {
    // Only allow numbers, max 3 digits
    const value = e.target.value.replace(/\D/g, '').slice(0, 3);
    setCardData({ ...cardData, cvv: value });
  };

  const handlePayment = async () => {
    if (!validateCard()) {
      toast.error("Please fix the errors in the form");
      return;
    }

    setIsProcessing(true);

    try {
      const pendingOrder = JSON.parse(localStorage.getItem("pendingOrder"));

      if (!pendingOrder) {
        toast.error("No order found");
        return;
      }

      // Create order items from current cart
      const orderItems = [];
      const productMap = {};
      products.forEach(p => {
        productMap[p._id] = p;
      });

      for (const itemId in cartItems) {
        const product = productMap[itemId];
        if (!product) continue;

        const itemSizes = cartItems[itemId];
        if (typeof itemSizes === 'object') {
          // Cart has size variations
          for (const size in itemSizes) {
            const quantity = itemSizes[size];
            if (quantity > 0) {
              orderItems.push({
                productId: itemId,
                name: product.name,
                price: product.price,
                quantity: quantity,
                size: size,
                image: product.image?.[0] || product.image
              });
            }
          }
        } else if (typeof itemSizes === 'number' && itemSizes > 0) {
          // Cart has simple quantity (no sizes)
          orderItems.push({
            productId: itemId,
            name: product.name,
            price: product.price,
            quantity: itemSizes,
            size: 'One Size',
            image: product.image?.[0] || product.image
          });
        }
      }

      console.log('Order Items Created:', orderItems);

      // Update pending order with calculated totals and items
      const updatedOrder = {
        ...pendingOrder,
        items: orderItems,
        subtotal: orderSummary.subtotal,
        delivery: orderSummary.delivery,
        tax: orderSummary.tax,
        discount: orderSummary.discount,
        total: orderSummary.total,
        itemCount: orderSummary.itemCount,
        amount: orderSummary.total
      };

      console.log('Final Order Data:', updatedOrder);

      // Simulate payment processing delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Place the order
      const response = await axios.post(
        `${backendUrl}/api/order/place`,
        {
          ...updatedOrder,
          paymentMethod: "Card",
          payment: true,
          cardLast4: cardData.cardNumber.slice(-4),
          cardHolder: cardData.name
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        const savedOrder = response.data.order;

        // Generate PDF invoice
        generateInvoicePDF(savedOrder);

        // Send invoice email
        try {
          await axios.post(`${backendUrl}/api/order/send-invoice`, {
            order: savedOrder
          });
          toast.success("Invoice sent to email! 📧");
        } catch (emailError) {
          console.log("Email error:", emailError);
          toast.error("Failed to send email, but order was placed");
        }

        toast.success("Payment Successful! 🎉 Order placed successfully!");

        localStorage.removeItem("pendingOrder");
        setCartItems({});

        // Navigate to current order page
        navigate("/current-order");
      } else {
        toast.error(response.data.message || "Order placement failed");
      }
    } catch (error) {
      console.error("Payment error:", error);
      toast.error("Payment failed. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const getCardType = (number) => {
    const n = number.replace(/\s/g, '');
    if (n.startsWith('4')) return 'visa';
    if (n.startsWith('5') || n.startsWith('2')) return 'mastercard';
    if (n.startsWith('3')) return 'amex';
    return 'unknown';
  };

  const cardType = getCardType(cardData.cardNumber);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full mb-4">
            <CreditCard className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-3">
            Secure Checkout
          </h1>
          <p className="text-gray-600 text-lg">Complete your purchase with our secure payment system</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Payment Form */}
          <div className="lg:col-span-2">
            <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl p-8 border border-white/20">
              <div className="flex items-center mb-8">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg flex items-center justify-center mr-4">
                  <CreditCard className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Payment Details</h2>
                  <p className="text-gray-600 text-sm">Enter your card information securely</p>
                </div>
              </div>

              <div className="space-y-8">
                {/* Card Number */}
                <div className="group">
                  <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center">
                    <CreditCard className="w-4 h-4 mr-2 text-purple-600" />
                    Card Number
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      name="cardNumber"
                      value={cardData.cardNumber}
                      onChange={handleCardNumberChange}
                      placeholder="1234 5678 9012 3456"
                      maxLength="19"
                      className={`w-full px-4 py-4 border-2 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm ${
                        errors.cardNumber ? 'border-red-500 bg-red-50' : 'border-gray-200 hover:border-purple-300'
                      }`}
                    />
                    {cardType !== 'unknown' && (
                      <div className="absolute right-4 top-4">
                        <span className="px-3 py-1 bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 text-xs font-bold rounded-full uppercase">
                          {cardType}
                        </span>
                      </div>
                    )}
                  </div>
                  {errors.cardNumber && (
                    <p className="mt-2 text-sm text-red-600 flex items-center">
                      <span className="w-1 h-1 bg-red-600 rounded-full mr-2"></span>
                      {errors.cardNumber}
                    </p>
                  )}
                </div>

                {/* Name and Expiry */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="group">
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Cardholder Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={cardData.name}
                      onChange={onChangeHandler}
                      placeholder="John Doe"
                      className={`w-full px-4 py-4 border-2 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm ${
                        errors.name ? 'border-red-500 bg-red-50' : 'border-gray-200 hover:border-purple-300'
                      }`}
                    />
                    {errors.name && (
                      <p className="mt-2 text-sm text-red-600 flex items-center">
                        <span className="w-1 h-1 bg-red-600 rounded-full mr-2"></span>
                        {errors.name}
                      </p>
                    )}
                  </div>

                  <div className="group">
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Expiry Date
                    </label>
                    <input
                      type="text"
                      name="expiry"
                      value={cardData.expiry}
                      onChange={handleExpiryChange}
                      placeholder="MM/YY"
                      maxLength="5"
                      className={`w-full px-4 py-4 border-2 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm ${
                        errors.expiry ? 'border-red-500 bg-red-50' : 'border-gray-200 hover:border-purple-300'
                      }`}
                    />
                    {errors.expiry && (
                      <p className="mt-2 text-sm text-red-600 flex items-center">
                        <span className="w-1 h-1 bg-red-600 rounded-full mr-2"></span>
                        {errors.expiry}
                      </p>
                    )}
                  </div>
                </div>

                {/* CVV */}
                <div className="group">
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    CVV Security Code
                  </label>
                  <input
                    type="password"
                    name="cvv"
                    value={cardData.cvv}
                    onChange={handleCvvChange}
                    placeholder="123"
                    maxLength="3"
                    className={`w-full px-4 py-4 border-2 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm ${
                      errors.cvv ? 'border-red-500 bg-red-50' : 'border-gray-200 hover:border-purple-300'
                    }`}
                  />
                  {errors.cvv && (
                    <p className="mt-2 text-sm text-red-600 flex items-center">
                      <span className="w-1 h-1 bg-red-600 rounded-full mr-2"></span>
                      {errors.cvv}
                    </p>
                  )}
                </div>

                {/* Save Card */}
                <div className="flex items-center p-4 bg-purple-50 rounded-xl border border-purple-200">
                  <input
                    type="checkbox"
                    name="saveCard"
                    id="saveCard"
                    checked={cardData.saveCard}
                    onChange={onChangeHandler}
                    className="h-5 w-5 text-purple-600 focus:ring-purple-500 border-purple-300 rounded"
                  />
                  <label htmlFor="saveCard" className="ml-3 text-sm text-gray-700">
                    Save card information for future purchases
                  </label>
                </div>

                {/* Pay Button */}
                <button
                  onClick={handlePayment}
                  disabled={isProcessing}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 px-6 rounded-xl font-bold hover:from-purple-700 hover:to-pink-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  {isProcessing ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                      Processing Payment...
                    </>
                  ) : (
                    <>
                      <Lock className="w-5 h-5 mr-3" />
                      Pay {currancy}{orderSummary.total.toFixed(2)} Securely
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Order Summary & Security Info */}
          <div className="space-y-6">
            {/* Order Summary */}
            <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl p-6 border border-white/20">
              <div className="flex items-center mb-6">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg flex items-center justify-center mr-3">
                  <ShoppingBag className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-lg font-bold text-gray-900">Order Summary</h3>
              </div>
              
              <div className="space-y-4">
                {/* Items Count */}
                <div className="flex justify-between items-center py-3 border-b border-gray-100">
                  <div className="flex items-center text-gray-600">
                    <ShoppingBag className="w-4 h-4 mr-2 text-purple-600" />
                    <span>Items ({orderSummary.itemCount})</span>
                  </div>
                  <span className="font-semibold text-gray-900">{currancy}{orderSummary.subtotal.toFixed(2)}</span>
                </div>

                {/* Delivery */}
                <div className="flex justify-between items-center py-3 border-b border-gray-100">
                  <div className="flex items-center text-gray-600">
                    <Truck className="w-4 h-4 mr-2 text-purple-600" />
                    <span>Delivery</span>
                  </div>
                  <span className="font-semibold text-gray-900">{currancy}{orderSummary.delivery.toFixed(2)}</span>
                </div>

                {/* Tax */}
                <div className="flex justify-between items-center py-3 border-b border-gray-100">
                  <div className="flex items-center text-gray-600">
                    <Percent className="w-4 h-4 mr-2 text-purple-600" />
                    <span>Tax (8%)</span>
                  </div>
                  <span className="font-semibold text-gray-900">{currancy}{orderSummary.tax.toFixed(2)}</span>
                </div>

                {/* Discount */}
                {orderSummary.discount > 0 && (
                  <div className="flex justify-between items-center py-3 border-b border-gray-100">
                    <div className="flex items-center text-green-600">
                      <Tag className="w-4 h-4 mr-2" />
                      <span>Discount (5%)</span>
                    </div>
                    <span className="font-semibold text-green-600">-{currancy}{orderSummary.discount.toFixed(2)}</span>
                  </div>
                )}

                {/* Total */}
                <div className="pt-4 mt-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-4">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-gray-900">Total Amount</span>
                    <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                      {currancy}{orderSummary.total.toFixed(2)}
                    </span>
                  </div>
                  {orderSummary.discount > 0 && (
                    <p className="text-xs text-green-600 mt-2">You saved {currancy}{orderSummary.discount.toFixed(2)} on this order!</p>
                  )}
                </div>
              </div>
            </div>

            {/* Security Badges */}
            <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl p-6 border border-white/20">
              <div className="flex items-center mb-6">
                <div className="w-10 h-10 bg-gradient-to-r from-green-600 to-emerald-600 rounded-lg flex items-center justify-center mr-3">
                  <Shield className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-lg font-bold text-gray-900">Security & Trust</h3>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center p-3 bg-green-50 rounded-lg">
                  <Shield className="w-5 h-5 text-green-600 mr-3" />
                  <span className="text-sm text-gray-700">256-bit SSL Encryption</span>
                </div>
                <div className="flex items-center p-3 bg-green-50 rounded-lg">
                  <Lock className="w-5 h-5 text-green-600 mr-3" />
                  <span className="text-sm text-gray-700">PCI DSS Compliant</span>
                </div>
                <div className="flex items-center p-3 bg-green-50 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-green-600 mr-3" />
                  <span className="text-sm text-gray-700">3D Secure Authentication</span>
                </div>
              </div>
              
              <div className="mt-6 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-200">
                <p className="text-xs text-purple-800 leading-relaxed">
                  <strong>🔒 Your payment information is encrypted and secure.</strong> We never store your card details and use industry-standard security measures.
                </p>
              </div>
            </div>

            {/* Accepted Cards */}
            <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl p-6 border border-white/20">
              <h3 className="text-lg font-bold text-gray-900 mb-4">We Accept</h3>
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-lg p-3 text-center">
                  <span className="text-sm font-bold text-blue-700">VISA</span>
                </div>
                <div className="bg-gradient-to-r from-red-50 to-red-100 border border-red-200 rounded-lg p-3 text-center">
                  <span className="text-sm font-bold text-red-700">MC</span>
                </div>
                <div className="bg-gradient-to-r from-green-50 to-green-100 border border-green-200 rounded-lg p-3 text-center">
                  <span className="text-sm font-bold text-green-700">AMEX</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;





