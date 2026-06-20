import { motion } from 'framer-motion';
import { User, Mail, Shield } from 'lucide-react';
import { useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '@/store/store';
import { fetchUserProfile } from '@/store/userSlice';

export default function Profile() {
  const dispatch = useAppDispatch();
  const userState = useAppSelector((state) => state.user);
  const { userInfo, status } = userState;

  // Fetch fresh profile data on component mount
  useEffect(() => {
    dispatch(fetchUserProfile()).catch((error) => {
      console.error('[Profile] Failed to fetch profile:', error);
    });
  }, [dispatch]);

  if (!userInfo) {
    return (
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl mx-auto">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
          <p>User data not found. Please log in again.</p>
        </div>
      </motion.div>
    );
  }

  const isLoading = status === 'loading';

  const user = {
    name: userInfo.name || 'Unknown User',
    email: userInfo.email || 'No email',
    role: userInfo.role || 'user',
    joined: userInfo.createdAt ? new Date(userInfo.createdAt).toLocaleDateString() : 'Unknown'
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
              <button 
                disabled={isLoading}
                onClick={() => alert('Edit profile coming soon')}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Loading...' : 'Edit Profile'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}