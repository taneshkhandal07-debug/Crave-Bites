import Razorpay from "razorpay";

export const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || "rzp_test_yourkeyhere",
  key_secret: process.env.RAZORPAY_KEY_SECRET || "your_secret_here",
});
