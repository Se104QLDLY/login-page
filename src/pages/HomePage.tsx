import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Building, Users, Shield, UserCheck, LogOut, Loader2 } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

export const HomePage = () => {
  const { user, logout, isLoading } = useAuth();
  const [loadingLogout, setLoadingLogout] = useState(false);

  const handleLogout = async () => {
    setLoadingLogout(true);
    try {
      await logout();
      // useAuth logout sẽ tự redirect về trang chủ
    } catch (error) {
      console.error('Logout error:', error);
      setLoadingLogout(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-100 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-lg text-gray-600">Đang tải thông tin...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-100 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
          <div className="text-center mb-8">
            <img src="/logo.png" alt="Logo" className="mx-auto mb-4 h-16 w-16" />
            <h2 className="text-3xl font-bold text-blue-800 mb-2">Chào mừng</h2>
            <p className="text-gray-600">Vui lòng đăng nhập để tiếp tục</p>
          </div>
          <Link
            to="/login"
            className="w-full py-3 bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-bold rounded-xl shadow-lg hover:scale-105 hover:shadow-xl transition-all text-lg border-2 border-transparent hover:border-blue-700 text-center block"
          >
            Đăng nhập
          </Link>
        </div>
      </div>
    );
  }

  // Determine available apps based on user role
  const getAvailableApps = () => {
    const apps = [];
    
    if (user.account_role === 'agent') {
      apps.push({
        name: 'Agency App',
        description: 'Quản lý thông tin đại lý và đơn hàng',
        icon: Building,
        url: 'http://localhost:5174',
        color: 'from-blue-600 to-indigo-600',
        available: true
      });
    }
    
    if (user.account_role === 'staff') {
      apps.push({
        name: 'Staff App', 
        description: 'Quản lý kho và xử lý đơn hàng',
        icon: Users,
        url: 'http://localhost:5176',
        color: 'from-green-600 to-emerald-600',
        available: true
      });
    }
    
    if (user.account_role === 'admin') {
      apps.push({
        name: 'Admin App',
        description: 'Quản trị hệ thống và người dùng',
        icon: Shield,
        url: 'http://localhost:5178', // Fixed: 5178 not 5177
        color: 'from-purple-600 to-violet-600',
        available: true
      });
    }

    return apps;
  };

  const availableApps = getAvailableApps();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <img src="/logo.png" alt="Logo" className="h-10 w-10 mr-3" />
              <h1 className="text-2xl font-bold text-blue-800">Hệ thống quản lý đại lý</h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-700">{user.username}</p>
                <p className="text-xs text-gray-500 capitalize">{user.account_role}</p>
              </div>
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                <UserCheck className="h-5 w-5 text-white" />
              </div>
              <button
                onClick={handleLogout}
                disabled={loadingLogout}
                className="flex items-center gap-2 px-4 py-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-all disabled:opacity-50"
              >
                {loadingLogout ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <LogOut className="h-4 w-4" />
                )}
                Đăng xuất
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-extrabold text-blue-800 mb-4">
            Chào mừng, {user.full_name || user.username}!
          </h2>
          <p className="text-xl text-gray-600">
            Chọn ứng dụng phù hợp với vai trò của bạn để bắt đầu làm việc
          </p>
        </div>

        {availableApps.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {availableApps.map((app, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl shadow-xl p-8 border-2 border-blue-100 hover:shadow-2xl hover:border-blue-400 transition-all duration-300 group"
              >
                <div className="flex flex-col items-center">
                  <div className={`w-20 h-20 bg-gradient-to-r ${app.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg`}>
                    <app.icon className="h-10 w-10 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-blue-800 mb-3 text-center">
                    {app.name}
                  </h3>
                  <p className="text-gray-600 text-center mb-6">
                    {app.description}
                  </p>
                  <a
                    href={app.url}
                    className={`w-full py-3 bg-gradient-to-r ${app.color} text-white font-bold rounded-xl shadow-lg hover:scale-105 hover:shadow-xl transition-all text-lg text-center block`}
                  >
                    Mở ứng dụng
                  </a>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md mx-auto">
              <div className="text-gray-500 mb-4">
                <UserCheck className="h-16 w-16 mx-auto mb-4" />
              </div>
              <h3 className="text-xl font-bold text-gray-700 mb-2">
                Chưa có quyền truy cập
              </h3>
              <p className="text-gray-600">
                Tài khoản của bạn chưa được cấp quyền truy cập ứng dụng nào. 
                Vui lòng liên hệ quản trị viên để được hỗ trợ.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
