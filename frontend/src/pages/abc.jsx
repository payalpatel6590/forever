import React, { useState, useContext, useEffect } from "react";
import { ShopContext } from "../context/ShopContext";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const Payment = () => {
  const navigate = useNavigate();

  const {
    backendUrl,
    token,
    setCartItems,
    cartItems,
    products,
    currancy,
    delivery_fee
  } = useContext(ShopContext);

  const [orderSummary, setOrderSummary] = useState({
    subtotal: 0,
    delivery: delivery_fee,
    total: 0
  });

  const [isProcessing, setIsProcessing] = useState(false);
  const [invoiceData, setInvoiceData] = useState(null);

  // ✅ FAST CALCULATION (NO LAG)
  useEffect(() => {
    let subtotal = 0;

    const productMap = {};
    products.forEach(p => {
      productMap[p._id] = p;
    });

    for (const itemId in cartItems) {
      const product = productMap[itemId];

      for (const size in cartItems[itemId]) {
        const qty = cartItems[itemId][size];
        if (product) subtotal += product.price * qty;
      }
    }

    const total = subtotal + delivery_fee;

    setOrderSummary({
      subtotal,
      delivery: delivery_fee,
      total
    });

  }, [cartItems, products, delivery_fee]);

  // ✅ PDF GENERATOR
  const generateInvoicePDF = (order) => {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text("ORDER INVOICE", 14, 20);

    doc.setFontSize(10);
    doc.text(`Order ID: ${order._id}`, 14, 30);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 14, 36);

    doc.text("Customer:", 14, 48);
    doc.text(`${order.address.firstName} ${order.address.lastName}`, 14, 54);
    doc.text(order.address.street, 14, 60);

    const table = order.items.map(item => [
      item.name,
      item.quantity,
      `${currancy}${item.price}`,
      `${currancy}${item.price * item.quantity}`
    ]);

    autoTable(doc, {
      startY: 70,
      head: [["Product", "Qty", "Price", "Total"]],
      body: table,
    });

    const y = doc.lastAutoTable.finalY + 10;

    doc.text(`Subtotal: ${currancy}${orderSummary.subtotal}`, 14, y);
    doc.text(`Delivery: ${currancy}${orderSummary.delivery}`, 14, y + 6);

    doc.setFontSize(14);
    doc.text(`Total: ${currancy}${orderSummary.total}`, 14, y + 16);

    doc.save(`invoice_${order._id}.pdf`);
  };

  // ✅ PAYMENT FLOW (DUMMY STRIPE)
  const handlePayment = async () => {
    setIsProcessing(true);

    try {
      const pendingOrder = JSON.parse(localStorage.getItem("pendingOrder"));

      await new Promise(res => setTimeout(res, 1500));

      const finalOrder = {
        ...pendingOrder,
        amount: orderSummary.total,
        payment: true,
        paymentMethod: "Dummy Stripe"
      };

      const res = await axios.post(
        `${backendUrl}/api/order/place`,
        finalOrder,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const savedOrder = res.data.order;

      // ✅ Generate PDF
      generateInvoicePDF(savedOrder);

      // ✅ Send Email
      await axios.post(`${backendUrl}/api/order/send-invoice`, {
        order: savedOrder
      });

      setInvoiceData(savedOrder);

      toast.success("Payment Successful 🎉");

      localStorage.removeItem("pendingOrder");
      setCartItems({});
      navigate("/current-order");

    } catch (err) {
      console.log(err);
      toast.error("Payment Failed");
    } finally {
      setIsProcessing(false);
    }
  };

  const pendingOrder = JSON.parse(localStorage.getItem("pendingOrder"));

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="max-w-6xl mx-auto grid lg:grid-cols-3 gap-8">

        {/* LEFT */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow">

          <h2 className="text-2xl font-bold mb-6">Secure Payment</h2>

          <input placeholder="Card Number" className="w-full p-3 border mb-3 rounded"/>
          <input placeholder="Name on Card" className="w-full p-3 border mb-3 rounded"/>

          <div className="flex gap-2">
            <input placeholder="MM/YY" className="w-full p-3 border rounded"/>
            <input placeholder="CVV" className="w-full p-3 border rounded"/>
          </div>

          <button
            onClick={handlePayment}
            className="w-full mt-6 bg-yellow-500 hover:bg-yellow-600 text-black py-3 rounded font-semibold"
          >
            {isProcessing ? "Processing..." : `Pay ${currancy}${orderSummary.total}`}
          </button>

          {invoiceData && (
            <button
              onClick={() => generateInvoicePDF(invoiceData)}
              className="w-full mt-3 bg-black text-white py-2 rounded"
            >
              Download Invoice
            </button>
          )}
        </div>

        {/* RIGHT */}
        <div className="bg-white p-6 rounded-xl shadow">
          <h3 className="font-bold text-lg mb-4">Order Summary</h3>

          <p>Subtotal: {currancy}{orderSummary.subtotal}</p>
          <p>Delivery: {currancy}{orderSummary.delivery}</p>

          <hr className="my-3"/>

          <h4 className="font-bold text-xl">
            Total: {currancy}{orderSummary.total}
          </h4>

          {pendingOrder?.address && (
            <div className="mt-4 text-sm">
              <h4 className="font-semibold">Deliver To</h4>
              <p>{pendingOrder.address.firstName} {pendingOrder.address.lastName}</p>
              <p>{pendingOrder.address.street}</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default Payment;