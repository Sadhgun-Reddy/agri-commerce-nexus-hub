import React, { useState } from "react";
import { URLS } from "../Urls";

const RemainingPayment = ({ order }) => {
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  const payRemaining = async () => {
    console.log("Initiating remaining payment for order:", order);

    try {
      setLoading(true);
      setMsg("");

      // 1️⃣ Start Remaining Payment
      const response = await fetch(URLS.remainingAmount, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
        body: JSON.stringify({ orderId: order.id }),   // FIXED
      });

      const data = await response.json();

      if (!data.success) {
        setMsg(data.message || "Something went wrong initiating payment.");
        setLoading(false);
        return;
      }

      // 2️⃣ Razorpay Checkout
      const options = {
        key: data.key,
        amount: data.amount,
        currency: data.currency,
        name: "Agri Store",
        description: "Remaining Payment",
        order_id: data.orderId,

        handler: async function (response) {
          console.log("Razorpay payment success:", response);

          // 3️⃣ VERIFY PAYMENT (CORRECTED)
          const verifyRes = await fetch(URLS.verifypayment, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("authToken")}`,  // FIXED
            },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              paymentType: "remaining",
              orderId: order.id,  // FIXED
            }),
          });

          const verifyData = await verifyRes.json();

          if (verifyData.success) {
            setMsg("🎉 Payment successful! Order fully paid.");
          } else {
            setMsg("❌ Payment verification failed.");
          }
        },

        prefill: {
          name: order.user?.name || "Customer",
          email: order.user?.email || "customer@example.com",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();

    } catch (error) {
      console.error("Remaining payment error:", error);
      setMsg("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  if (order.paymentStatus === "Fully Paid") {
    return <p className="text-green-600 font-bold">✔ Fully Paid</p>;
  }

  return (
    <div className="border p-4 rounded-xl shadow bg-white">
      <h2 className="text-lg font-semibold">Remaining Payment</h2>

      <p className="text-gray-700">
        Total Amount: ₹{order.amount}
        <br />
        Paid: ₹{order.paidAmount || order.advanceAmount || 0}
        <br />
        <b>Remaining: ₹{order.remainingAmount}</b>
      </p>

      <button
        onClick={payRemaining}
        disabled={loading}
        className="mt-3 bg-blue-600 text-white px-4 py-2 rounded-lg disabled:bg-gray-400"
      >
        {loading ? "Processing..." : `Pay ₹${order.remainingAmount}`}
      </button>

      {msg && <p className="mt-2 text-sm font-medium text-gray-800">{msg}</p>}
    </div>
  );
};

export default RemainingPayment;
