import React, { useState } from 'react';
import { Heart, DollarSign, BookOpen, Box, Users, CreditCard, Smartphone, Building2 } from 'lucide-react';
import content from '../data/content.json';

const Donate = () => {
  const [selectedAmount, setSelectedAmount] = useState(null);
  const [customAmount, setCustomAmount] = useState('');

  const predefinedAmounts = [100, 500, 1000, 5000];
  const paymentMethods = [
    { icon: CreditCard, name: 'Credit Card', description: 'Secure card payment' },
    { icon: Smartphone, name: 'UPI', description: 'Quick mobile payment' },
    { icon: Building2, name: 'Net Banking', description: 'Direct bank transfer' }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-white via-blue-50 to-white">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="flex justify-center mb-6">
            <Heart className="w-16 h-16 text-red-500 animate-pulse" />
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Support Our Mission
          </h2>
          <p className="text-xl text-gray-700 mb-4">
            Your generosity can transform lives. Every contribution makes a significant impact in providing hope, education, and care to children in need.
          </p>
          <p className="text-lg text-blue-600 font-medium">
            Join us in creating lasting change - one child at a time.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Left Side - Donation Options */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h3 className="text-2xl font-semibold mb-6">Choose Donation Amount</h3>
            
            {/* Predefined Amounts */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              {predefinedAmounts.map((amount) => (
                <button
                  key={amount}
                  onClick={() => {
                    setSelectedAmount(amount);
                    setCustomAmount('');
                  }}
                  className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                    selectedAmount === amount
                      ? 'border-blue-600 bg-blue-50 text-blue-600'
                      : 'border-gray-200 hover:border-blue-600'
                  }`}
                >
                  ₹{amount}
                </button>
              ))}
            </div>

            {/* Custom Amount */}
            <div className="mb-8">
              <label className="block text-gray-700 mb-2">Custom Amount (₹)</label>
              <input
                type="number"
                value={customAmount}
                onChange={(e) => {
                  setCustomAmount(e.target.value);
                  setSelectedAmount(null);
                }}
                className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-blue-600 focus:ring-0"
                placeholder="Enter amount"
              />
            </div>

            {/* Payment Methods */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold mb-4">Payment Methods</h3>
              <div className="grid gap-4">
                {paymentMethods.map((method) => (
                  <button
                    key={method.name}
                    className="flex items-center p-4 border-2 border-gray-200 rounded-xl hover:border-blue-600 transition-all duration-300"
                  >
                    <method.icon className="w-6 h-6 text-blue-600 mr-4" />
                    <div className="text-left">
                      <div className="font-medium">{method.name}</div>
                      <div className="text-sm text-gray-600">{method.description}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right Side - Impact Information */}
          <div className="space-y-8">
            <div className="bg-blue-50 rounded-2xl p-8">
              <h3 className="text-2xl font-semibold mb-6">Your Impact</h3>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-white rounded-lg">
                    <BookOpen className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-medium mb-1">Educational Support</h4>
                    <p className="text-gray-600">Provide books, supplies, and quality education</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-white rounded-lg">
                    <Box className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-medium mb-1">Daily Essentials</h4>
                    <p className="text-gray-600">Supply nutritious meals and basic necessities</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-white rounded-lg">
                    <Users className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-medium mb-1">Care & Support</h4>
                    <p className="text-gray-600">Provide counseling and emotional support</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-2xl p-8">
              <h3 className="text-2xl font-semibold mb-4">Why Donate?</h3>
              <p className="mb-6">
                "Every child deserves a chance to dream big and achieve their potential. Your support makes this possible."
              </p>
              <ul className="space-y-3 text-blue-100">
                <li>✓ 100% of donations go directly to children's welfare</li>
                <li>✓ Tax benefits under 80G</li>
                <li>✓ Regular updates on impact</li>
                <li>✓ Transparent fund utilization</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Donate;