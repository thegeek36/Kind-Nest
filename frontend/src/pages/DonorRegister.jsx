import { useState } from 'react';
import { User, Mail, Lock, Phone, MapPin, Heart } from 'lucide-react';
import axios from 'axios';
// Mock axios for demo - replace with your actual axios setup

const api = axios.create({
  baseURL: 'http://127.0.0.1:5000/api/donors',
  withCredentials: true, // to handle sessions
});
// const api = {
//   post: async (url, data) => {
//     await new Promise(resolve => setTimeout(resolve, 1000));
//     if (data.email === 'test@example.com') {
//       throw { response: { data: { error: 'Email already exists' } } };
//     }
//     return { data: { message: 'Registration successful!' } };
//   }
// };

const DonorRegister = () => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    address: '',
  });

  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await api.post('/register', form);
      setMessage(res.data.message);
      setForm({ name: '', email: '', password: '', phone: '', address: '' });
    } catch (err) {
      setMessage(err.response?.data?.error || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-rose-100 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        <div className="text-center mb-6">
          <Heart className="w-12 h-12 text-red-500 mx-auto mb-3" />
          <h2 className="text-2xl font-bold text-gray-800">Donor Registration</h2>
          <p className="text-gray-600 mt-1">Join our life-saving community</p>
        </div>

        <div onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              <User className="w-4 h-4 inline mr-2" />
              Full Name
            </label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">
              <Mail className="w-4 h-4 inline mr-2" />
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">
              <Lock className="w-4 h-4 inline mr-2" />
              Password
            </label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">
              <Phone className="w-4 h-4 inline mr-2" />
              Phone Number
            </label>
            <input
              type="tel"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">
              <MapPin className="w-4 h-4 inline mr-2" />
              Address
            </label>
            <input
              type="text"
              name="address"
              value={form.address}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400"
            />
          </div>

          <button
            onClick={handleRegister}
            disabled={isLoading}
            className="w-full bg-red-500 text-white py-3 rounded-lg hover:bg-red-600 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Registering...' : 'Register'}
          </button>

          {message && (
            <div className={`p-3 rounded-lg text-center ${
              message.includes('successful') 
                ? 'bg-green-100 text-green-700' 
                : 'bg-red-100 text-red-700'
            }`}>
              {message}
            </div>
          )}
        </div>

        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Already have an account?{' '}
            <a href="/donor-login" className="text-red-500 hover:text-red-600 font-semibold">
              Login here
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default DonorRegister;