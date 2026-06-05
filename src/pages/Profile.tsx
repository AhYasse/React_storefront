import { motion } from 'framer-motion';
import { User, Mail, Shield } from 'lucide-react';

export default function Profile() {
  // Placeholder user data (would come from Redux/Context in real app)
  const user = {
    name: 'John Doe',
    email: 'john.doe@example.com',
    role: 'user',
    joined: 'January 2024'
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">My Profile</h1>
      
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="bg-blue-600 h-32"></div>
        <div className="px-8 pb-8">
          <div className="relative -mt-12 mb-6">
            <div className="w-24 h-24 bg-white rounded-full border-4 border-white shadow-md flex items-center justify-center">
              <User className="w-12 h-12 text-gray-400" />
            </div>
          </div>

          <div className="space-y-6">
            <div className="flex items-start">
              <User className="w-5 h-5 text-gray-400 mt-1 mr-4" />
              <div>
                <p className="text-sm text-gray-500">Full Name</p>
                <p className="text-lg font-medium text-gray-900">{user.name}</p>
              </div>
            </div>

            <div className="flex items-start">
              <Mail className="w-5 h-5 text-gray-400 mt-1 mr-4" />
              <div>
                <p className="text-sm text-gray-500">Email Address</p>
                <p className="text-lg font-medium text-gray-900">{user.email}</p>
              </div>
            </div>

            <div className="flex items-start">
              <Shield className="w-5 h-5 text-gray-400 mt-1 mr-4" />
              <div>
                <p className="text-sm text-gray-500">Account Type</p>
                <p className="text-lg font-medium text-gray-900 capitalize">{user.role}</p>
              </div>
            </div>

            <div className="pt-6 border-t border-gray-100">
              <button className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition">
                Edit Profile
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}