import React, { useState } from 'react';
import { 
  Lock, 
  Mail, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  AlertCircle,
  KeyRound,
  ShieldCheck
} from 'lucide-react';
import { HaiHuongLogo } from '../brand/HaiHuongLogo';
import { HuongGiotBienMascot } from '../brand/HuongGiotBienMascot';
import { AppUser } from '../../types/auth';
import { StaffMember } from '../../types';
import { signInAppUser } from '../../firebase';

interface LoginViewProps {
  onLoginSuccess: (user: AppUser) => void;
  staffList?: StaffMember[];
}

export const LoginView: React.FC<LoginViewProps> = ({
  onLoginSuccess,
  staffList = []
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password) {
      setErrorMessage('Vui lòng nhập đầy đủ Email đăng nhập và Mật khẩu.');
      return;
    }

    setLoading(true);
    setErrorMessage(null);

    try {
      const user = await signInAppUser(email.trim(), password, staffList);
      onLoginSuccess(user);
    } catch (err: any) {
      setErrorMessage(err.message || 'Đăng nhập không thành công. Vui lòng kiểm tra lại thông tin.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#2E1200] via-[#4A1E00] to-[#1F0A00] flex flex-col justify-center items-center p-4 sm:p-6 text-amber-50 relative overflow-hidden select-none">
      {/* Decorative Warm Ambient Glows */}
      <div className="absolute top-0 -left-20 w-96 h-96 bg-[#FFA31A]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 -right-20 w-96 h-96 bg-[#8A3E00]/30 rounded-full blur-3xl pointer-events-none" />
      
      {/* Subtle traditional fishnet/wave pattern */}
      <div className="absolute inset-0 opacity-5 pointer-events-none bg-[radial-gradient(#FFA31A_1px,transparent_1px)] [background-size:20px_20px]" />

      <div className="relative w-full max-w-md z-10 my-auto">
        {/* Brand Header */}
        <div className="text-center mb-5 sm:mb-6">
          <div className="inline-flex items-center justify-center p-3 sm:p-3.5 bg-black/40 rounded-2xl border border-[#FFA31A]/30 backdrop-blur-sm shadow-xl shadow-black/40 mb-3">
            <HaiHuongLogo size="lg" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-amber-100 tracking-wide mt-1">
            Hệ Thống Quản Trị
          </h1>
          <p className="text-xs sm:text-sm text-amber-300/80 mt-1 font-sans">
            Nước mắm truyền thống cốt nhĩ cá cơm Phú Quốc • Vị ngon trăm năm
          </p>
        </div>

        {/* Mascot Greeting Pill */}
        <div className="mb-4 bg-gradient-to-r from-[#FFA31A]/20 via-[#FFC407]/15 to-transparent border border-[#FFA31A]/40 rounded-2xl p-3 sm:p-3.5 flex items-center gap-3 backdrop-blur-md shadow-md">
          <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-[#FFF9ED] p-1 flex items-center justify-center border border-[#FFA31A] shrink-0 shadow-sm">
            <HuongGiotBienMascot pose="thumbs-up" size="md" />
          </div>
          <div className="text-left text-xs">
            <div className="font-bold text-[#FFC407] font-serif flex items-center gap-1.5">
              <span>Hương Giọt Biển chào bạn!</span>
              <span className="text-[9px] bg-[#FFA31A] text-[#3D1B00] px-1.5 py-0.2 rounded font-extrabold">Bảo Mật</span>
            </div>
            <p className="text-amber-200/90 text-[11px] mt-0.5 leading-snug">
              Vui lòng đăng nhập để truy cập dữ liệu và nghiệp vụ theo phân quyền chức vụ của bạn.
            </p>
          </div>
        </div>

        {/* Login Form Card */}
        <div className="bg-[#3D1B00]/85 border border-[#FFA31A]/30 rounded-3xl p-5 sm:p-7 backdrop-blur-md shadow-2xl shadow-black/60 relative">
          <div className="flex items-center justify-between border-b border-[#FFA31A]/20 pb-3 mb-5">
            <div className="flex items-center gap-2">
              <KeyRound className="w-4 h-4 text-[#FFA31A]" />
              <span className="text-sm font-bold text-amber-100 uppercase tracking-wider">Đăng Nhập Hệ Thống</span>
            </div>
          </div>

          {errorMessage && (
            <div className="mb-4 p-3 rounded-xl bg-rose-950/70 border border-rose-500/40 text-rose-200 text-xs flex items-start gap-2.5 animate-shake">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <div className="flex-1 leading-relaxed">
                {errorMessage}
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Field */}
            <div>
              <label className="block text-xs font-semibold text-amber-200/90 mb-1.5">
                Tên đăng nhập (Email)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-amber-400/60">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  required
                  autoFocus
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Nhập email tài khoản..."
                  className="w-full pl-10 pr-3.5 py-2.5 bg-black/40 border border-[#FFA31A]/30 rounded-xl text-amber-50 placeholder-amber-200/40 text-xs sm:text-sm focus:outline-hidden focus:border-[#FFA31A] focus:ring-1 focus:ring-[#FFA31A] transition-colors"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-xs font-semibold text-amber-200/90 mb-1.5">
                Mật khẩu
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-amber-400/60">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Nhập mật khẩu..."
                  className="w-full pl-10 pr-10 py-2.5 bg-black/40 border border-[#FFA31A]/30 rounded-xl text-amber-50 placeholder-amber-200/40 text-xs sm:text-sm focus:outline-hidden focus:border-[#FFA31A] focus:ring-1 focus:ring-[#FFA31A] transition-colors font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-amber-400/70 hover:text-amber-200 transition-colors cursor-pointer"
                  title={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-3 py-3 px-4 bg-gradient-to-r from-[#FFA31A] to-[#FF8C00] hover:from-[#FFB03A] hover:to-[#FFA01A] text-[#3D1B00] font-bold rounded-xl text-sm shadow-lg shadow-[#FFA31A]/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.01] active:scale-[0.99]"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-[#3D1B00] border-t-transparent rounded-full animate-spin" />
                  <span>Đang xác thực thông tin...</span>
                </>
              ) : (
                <>
                  <span>Đăng Nhập Vào Hệ Thống</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Security and Heritage Note Footer */}
        <div className="mt-5 text-center text-[11px] text-amber-300/60 flex items-center justify-center gap-2">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>Hệ thống quản trị nội bộ bảo mật đa tầng • Nước Mắm Hải Hương</span>
        </div>
      </div>
    </div>
  );
};
