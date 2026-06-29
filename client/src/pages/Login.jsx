import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Wallet, User, Lock, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';
import { useSettings } from '../context/SettingsContext';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const { darkMode } = useSettings();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(username, password);
      toast.success('Logged in successfully!');
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to login');
    }
  };

  return (
    <div 
      className={`flex-grow flex items-center justify-center w-full ${
        darkMode 
        ? "bg-[#051424] bg-[radial-gradient(at_0%_0%,_hsla(185,100%,50%,0.15)_0,transparent_50%),radial-gradient(at_100%_100%,_hsla(210,100%,30%,0.2)_0,transparent_50%)]"
        : "bg-[#f8fafc] bg-[radial-gradient(at_0%_0%,_hsla(185,100%,50%,0.10)_0,transparent_50%),radial-gradient(at_100%_100%,_hsla(210,100%,30%,0.10)_0,transparent_50%)]"
      }`}
    >
      <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-16 items-center px-6">
        
        {/* Left Side: Illustration */}
        <div className="hidden lg:flex flex-col items-center justify-center relative">
          <div className="absolute -z-10 w-[400px] h-[400px] bg-[#00f2ff]/10 blur-[100px] rounded-full"></div>
          <div className="flex justify-center items-center w-full">
            <img 
              className="w-full max-w-md object-contain drop-shadow-[0_20px_50px_rgba(0,0,0,0.5)]" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDM9mYdPnNxVmdLL7_XwmON8vVWX6AVyoG1AEMzyjvUFJd2RJL5wSocWcFmY9w1zxOU2totHALEy33YMuTqXRzUTI39_5uZF9OYrI0hB8pS762BJzX3c_vmlAJH6iubd3l2p6Wwe-kb2znaedUM_2biBxjLASN4Ly2lgC-g3zkvj3vPs_kM7nXwLW3QCH-LdRLhwGLowzEnqae8kaU1QP_EpBlIYrMpM5Nugndu6F9yRR-UwCKnQQpGg6liXaOgmz-EbFN_x-yEDgM" 
              alt="Digital Wallet 3D"
            />
          </div>
          <div className="mt-8 text-center space-y-2">
            <h2 className="text-3xl font-bold tracking-tight text-[#00dbe7]">SpendSmart</h2>
            <p className="text-lg text-[var(--text-secondary)] max-w-md mx-auto">
              Experience the future of personal finance with our intelligent ecosystem.
            </p>
          </div>
        </div>

        {/* Right Side: Login Card */}
        <div className="w-full max-w-md mx-auto">
          <div className={`rounded-[2rem] p-10 relative overflow-hidden backdrop-blur-xl border shadow-2xl ${
            darkMode 
              ? "bg-white/5 border-white/10 shadow-[0_8px_32px_0_rgba(0,0,0,0.37)]" 
              : "bg-white/50 border-white/40 shadow-[0_8px_32px_0_rgba(0,0,0,0.1)]"
          }`}>
            
            {/* Subtle Inner Glow */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none bg-gradient-to-br from-white/10 to-transparent opacity-50"></div>
            
            <div className="relative z-10">
              <div className="mb-10 text-center lg:text-left">
                <div className="flex justify-center lg:hidden mb-6">
                  <Wallet className="text-[#00dbe7] h-12 w-12" />
                </div>
                <h2 className="text-3xl font-bold text-[var(--text-primary)] mb-2">Welcome Back</h2>
                <p className="text-base text-[var(--text-secondary)]">Sign in to manage your precision assets.</p>
              </div>

              <form className="space-y-8" onSubmit={handleSubmit}>
                {/* Username Field */}
                <div className="space-y-2 group">
                  <label className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-widest transition-colors group-focus-within:text-[#00dbe7]" htmlFor="username">
                    Username
                  </label>
                  <div className="relative flex items-center">
                    <User className="absolute left-0 text-[var(--text-secondary)] transition-colors group-focus-within:text-[#00dbe7] h-5 w-5" />
                    <input 
                      id="username"
                      type="text" 
                      required
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className={`w-full bg-transparent border-t-0 border-x-0 border-b-2 pl-8 py-2 text-base text-[var(--text-primary)] transition-all duration-300 focus:outline-none focus:ring-0 ${
                        darkMode ? "border-[#849495]/30 focus:border-[#00dbe7] focus:shadow-[0_4px_12px_-4px_rgba(0,219,231,0.3)] placeholder-[#b9cacb]/40" 
                                 : "border-[var(--border-color)] focus:border-[#00dbe7] placeholder-[var(--text-secondary)]/50"
                      }`}
                      placeholder="Enter your username"
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div className="space-y-2 group">
                  <label className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-widest transition-colors group-focus-within:text-[#00dbe7]" htmlFor="password">
                    Password
                  </label>
                  <div className="relative flex items-center">
                    <Lock className="absolute left-0 text-[var(--text-secondary)] transition-colors group-focus-within:text-[#00dbe7] h-5 w-5" />
                    <input 
                      id="password"
                      type={showPassword ? "text" : "password"}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className={`w-full bg-transparent border-t-0 border-x-0 border-b-2 pl-8 py-2 text-base text-[var(--text-primary)] transition-all duration-300 focus:outline-none focus:ring-0 ${
                        darkMode ? "border-[#849495]/30 focus:border-[#00dbe7] focus:shadow-[0_4px_12px_-4px_rgba(0,219,231,0.3)] placeholder-[#b9cacb]/40" 
                                 : "border-[var(--border-color)] focus:border-[#00dbe7] placeholder-[var(--text-secondary)]/50"
                      }`}
                      placeholder="••••••••"
                    />
                    <button 
                      type="button" 
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-0 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <label className="flex items-center gap-2 cursor-pointer group">
                    <input type="checkbox" className="w-4 h-4 rounded border-[var(--border-color)] text-[#00dbe7] focus:ring-[#00dbe7]/30 bg-transparent" />
                    <span className="text-sm font-medium text-[var(--text-secondary)] group-hover:text-[var(--text-primary)] transition-colors">Remember me</span>
                  </label>
                </div>

                <button 
                  type="submit" 
                  className="w-full bg-[#00dbe7] text-[#00363a] font-bold text-lg py-3 rounded-xl mt-6 active:scale-[0.98] transition-all hover:-translate-y-px hover:shadow-[0_0_25px_rgba(0,219,231,0.5)] shadow-[0_0_15px_rgba(0,219,231,0.3)]"
                >
                  Sign In
                </button>
              </form>

              <div className="mt-10 pt-8 border-t border-[var(--border-color)]/20 text-center">
                <p className="text-sm text-[var(--text-secondary)]">
                  New to Smart Expense?{' '}
                  <Link to="/register" className="text-[#00dbe7] font-bold hover:underline underline-offset-4 transition-all">
                    Create Account
                  </Link>
                </p>
              </div>

            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Login;
