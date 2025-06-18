import { useState } from 'react';
import { Mail, Lock, Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://127.0.0.1:5000/api/donors',
  withCredentials: true,
});

const DonorLogin = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate(); // ✅ added for redirect

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

const handleLogin = async (e) => {
  e.preventDefault();
  setIsLoading(true);
  try {
    const res = await api.post('/login', form);
    setMessage(res.data.message);

    // Save the token to localStorage
    if (res.data.token) {
      localStorage.setItem('donor_token', res.data.token);
    }

    navigate('/donor-portal'); // redirect on success
  } catch (err) {
    setMessage(err.response?.data?.error || 'Login failed');
  } finally {
    setIsLoading(false);
  }
};

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        <div className="text-center mb-6">
          <Heart className="w-12 h-12 text-blue-500 mx-auto mb-3" />
          <h2 className="text-2xl font-bold text-gray-800">Donor Login</h2>
          <p className="text-gray-600 mt-1">Welcome back, hero!</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
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
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
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
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Logging in...' : 'Login'}
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
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Don't have an account?{' '}
            <a href="/donor-register" className="text-blue-500 hover:text-blue-600 font-semibold">
              Register here
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default DonorLogin;
