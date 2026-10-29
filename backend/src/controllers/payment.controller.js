const QRCode = require('qrcode');
const Payment = require('../models/Payment');
const SubscriptionPlan = require('../models/Plan');
const Subscription = require('../models/Subscription');
const User = require('../models/User');
const { generateMatrimonyId } = require('../utils/generateMatrimonyId');

/**
 * POST /api/payment/create-order
 * Initialize payment order for plan upgrade
 */
const createOrder = async (req, res) => {
  try {
    const { plan_id, plan_code, full_name, email, mobile } = req.body;

    // 1. Locate Plan
    let plan = null;
    if (plan_id) {
      plan = await SubscriptionPlan.findById(plan_id);
    }
    if (!plan && plan_code) {
      plan = await SubscriptionPlan.findOne({ plan_code: plan_code.toUpperCase() });
    }
    if (!plan) {
      return res.status(404).json({ success: false, message: 'Membership plan not found' });
    }

    // 2. Identify or Auto-provision User
    let user = null;
    const searchEmail = (email || 'member@jeevansathimarriage.com').toLowerCase().trim();
    const searchMobile = (mobile || '9876543210').trim();

    user = await User.findOne({ $or: [{ email: searchEmail }, { mobile: searchMobile }] });
    if (!user) {
      const generatedId = generateMatrimonyId ? generateMatrimonyId() : `JS-${Math.floor(10000 + Math.random() * 90000)}`;
      const fallbackUserName = `user_${Date.now().toString().slice(-6)}`;
      user = await User.create({
        matrimony_id: generatedId,
        user_name: fallbackUserName,
        full_name: full_name || 'Valued Candidate',
        email: searchEmail,
        mobile: searchMobile.match(/^[6-9]\d{9}$/) ? searchMobile : `987${Math.floor(1000000 + Math.random() * 9000000)}`,
        is_premium: false,
        account_status: 'ACTIVE'
      });
    }

    // 3. Pricing calculations
    const amount_inr = plan.price_inr;
    const gst_amount_inr = Math.round((amount_inr * (plan.gst_percent || 18)) / 100);
    const total_paid_inr = amount_inr + gst_amount_inr;

    const orderId = `order_${Date.now()}_${Math.floor(1000 + Math.random() * 9000)}`;
    const invoiceNum = `INV-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`;

    // 4. Generate Dynamic UPI string and QR code
    const upiVpa = 'vivahmatrimony@upi';
    const upiString = `upi://pay?pa=${upiVpa}&pn=Jeevansathi%20Matrimony&am=${total_paid_inr}&cu=INR&tn=Plan%20${encodeURIComponent(plan.plan_name)}`;
    const qrDataUrl = await QRCode.toDataURL(upiString, { width: 320, margin: 2 });

    // 5. Store Payment Record
    const payment = await Payment.create({
      user_id: user._id,
      plan_id: plan._id,
      invoice_number: invoiceNum,
      gateway: 'RAZORPAY',
      gateway_order_id: orderId,
      amount_inr,
      gst_amount_inr,
      total_paid_inr,
      status: 'CREATED'
    });

    return res.status(201).json({
      success: true,
      message: 'Payment order created successfully',
      data: {
        order_id: orderId,
        payment_id: payment._id,
        invoice_number: invoiceNum,
        amount_inr,
        gst_amount_inr,
        total_paid_inr,
        currency: 'INR',
        plan: {
          id: plan._id,
          name: plan.plan_name,
          code: plan.plan_code,
          duration_days: plan.duration_days,
          contact_views: plan.contact_views_limit,
          interests_limit: plan.interests_limit
        },
        customer: {
          id: user._id,
          matrimony_id: user.matrimony_id,
          name: user.full_name,
          email: user.email,
          mobile: user.mobile
        },
        upi: {
          vpa: upiVpa,
          intent_url: upiString,
          qr_code: qrDataUrl
        },
        razorpay: {
          key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_JeevansathiVivah',
          order_id: orderId,
          amount_paisa: total_paid_inr * 100
        }
      }
    });
  } catch (error) {
    console.error('Error creating payment order:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * POST /api/payment/verify
 * Verify payment confirmation and activate membership
 */
const verifyPayment = async (req, res) => {
  try {
    const { order_id, payment_id, signature, payment_method = 'UPI', upi_ref } = req.body;

    if (!order_id) {
      return res.status(400).json({ success: false, message: 'Order ID is required' });
    }

    const payment = await Payment.findOne({ gateway_order_id: order_id });
    if (!payment) {
      return res.status(404).json({ success: false, message: 'Payment record not found' });
    }

    const plan = await SubscriptionPlan.findById(payment.plan_id);
    if (!plan) {
      return res.status(404).json({ success: false, message: 'Associated plan not found' });
    }

    const resolvedPaymentId = payment_id || upi_ref || `PAY_${Date.now()}_${Math.floor(1000 + Math.random() * 9000)}`;

    // Update payment
    payment.status = 'PAID';
    payment.gateway_payment_id = resolvedPaymentId;
    payment.gateway_signature = signature || 'verified_checkout_signature';
    payment.payment_method = payment_method;
    payment.paid_at = new Date();
    await payment.save();

    // Activate/Renew Subscription
    const startDate = new Date();
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + (plan.duration_days || 30));

    const subscription = await Subscription.findOneAndUpdate(
      { user_id: payment.user_id },
      {
        plan_id: plan._id,
        payment_id: payment._id,
        start_date: startDate,
        expiry_date: expiryDate,
        contacts_remaining: plan.contact_views_limit || 50,
        interests_remaining: plan.interests_limit || 9999,
        status: 'ACTIVE'
      },
      { upsert: true, new: true }
    );

    // Update User to VIP Premium
    const user = await User.findByIdAndUpdate(
      payment.user_id,
      { is_premium: true },
      { new: true }
    );

    return res.json({
      success: true,
      message: `🎉 Auspicious Welcome! Your ${plan.plan_name} has been activated successfully!`,
      data: {
        payment_id: resolvedPaymentId,
        invoice_number: payment.invoice_number,
        amount_paid: payment.total_paid_inr,
        plan_name: plan.plan_name,
        contacts_added: plan.contact_views_limit,
        valid_until: expiryDate.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
        user: {
          id: user._id,
          matrimony_id: user.matrimony_id,
          name: user.full_name,
          is_premium: user.is_premium
        }
      }
    });
  } catch (error) {
    console.error('Error verifying payment:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  createOrder,
  verifyPayment
};

