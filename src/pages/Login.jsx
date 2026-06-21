import React, { useState } from 'react';
import { toast, Toaster } from 'sonner';
import { Lock, Mail, Shield, CheckCircle, Award, Eye, EyeOff, HelpCircle } from 'lucide-react';
// Assuming your RTK Query API slice is imported here. Adjust the path as necessary.
import { useLoginMutation } from '../features/auth/authApi';
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setCredentials } from "../features/auth/authSlice";

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
// Inside your Login component, replace handleSubmit:
const navigate = useNavigate();
const dispatch = useDispatch();
  // Hook placeholder for your RTK Query mutation
  const [login, { isLoading }] = useLoginMutation();
//   const isLoading = false; // Mock loading state for UI demonstration

const handleSubmit = async (e) => {
  e.preventDefault();

  if (!email || !password) {
    toast.error("Please fill in all fields.");
    return;
  }

  try {
    const response = await login({ email, password }).unwrap();

    // Your backend should return { token, user }
    dispatch(setCredentials({ token: response.token, user: response.user }));

    toast.success("Successfully authenticated!");
    navigate("/dashboard");

  } catch (err) {
    const errorMessage = err?.data?.message || "Authentication failed. Please try again.";
    toast.error(errorMessage);
  }
};

  return (
    <div className="flex min-h-screen w-full bg-white font-sans text-slate-800 antialiased">
      <Toaster position="top-right" richColors />

      {/* Left Side: Branding & Info Banner */}
      <div className="relative hidden w-1/2 flex-col justify-between bg-[#04432e] p-12 text-white lg:flex xl:p-16">
        {/* Subtle decorative grid background overlay */}
        <div 
          className="absolute inset-0 opacity-10 pointer-events-none" 
          style={{
            backgroundImage: `linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)`,
            backgroundSize: '40px 40px'
          }}
        />
        {/* Decorative subtle arc line */}
        <div className="absolute bottom-0 left-0 h-64 w-64 rounded-tr-full border-t border-r border-white/10 pointer-events-none" />

        {/* Top Header / Logo */}
        <div className="relative z-10 flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10 backdrop-blur-sm border border-white/20">
            <div className="h-4 w-4 rounded border-2 border-white rotate-45 flex items-center justify-center">
              <div className="h-1 w-1 bg-white rounded-full" />
            </div>
          </div>
          <span className="text-xl font-bold tracking-tight">Whatsy</span>
        </div>

        {/* Middle Main Message */}
        <div className="relative z-10 my-auto max-w-md space-y-6">
          <div className="space-y-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#d4af37]">
              Enterprise Platform
            </span>
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
              Whatsy <br />
              <span className="text-white/90 font-normal">for Business</span>
            </h1>
          </div>
          
          <p className="text-sm leading-relaxed text-emerald-100/80">
            Connect your enterprise infrastructure via WhatsApp Cloud API. Secure, scalable, and fully compliant.
          </p>

          {/* Value Propositions / Badges */}
          <div className="space-y-3 pt-4">
            <div className="flex items-center gap-3 rounded-xl bg-white/5 border border-white/10 p-3.5 backdrop-blur-sm">
              <Shield className="h-5 w-5 text-emerald-400 shrink-0" />
              <span className="text-xs font-medium text-emerald-50">End-to-end encrypted messaging</span>
            </div>
            <div className="flex items-center gap-3 rounded-xl bg-white/5 border border-white/10 p-3.5 backdrop-blur-sm">
              <CheckCircle className="h-5 w-5 text-emerald-400 shrink-0" />
              <span className="text-xs font-medium text-emerald-50">99.9% uptime SLA guarantee</span>
            </div>
            <div className="flex items-center gap-3 rounded-xl bg-white/5 border border-white/10 p-3.5 backdrop-blur-sm">
              <Award className="h-5 w-5 text-emerald-400 shrink-0" />
              <span className="text-xs font-medium text-emerald-50">ISO 27001 & GDPR compliant</span>
            </div>
          </div>
        </div>

        {/* Bottom Footer Details */}
        <div className="relative z-10 text-xs text-emerald-200/50">
          © 2026 Whatsy Inc. All rights reserved.
        </div>
      </div>

      {/* Right Side: Sign-In Workspace Container */}
      <div className="flex w-full flex-col justify-between p-6 sm:p-12 lg:w-1/2 xl:p-16">
        {/* Mobile Logo View Header */}
        <div className="flex items-center justify-between lg:justify-end">
          <div className="flex items-center gap-2 lg:hidden">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#04432e]">
              <div className="h-4 w-4 rounded border-2 border-white rotate-45 flex items-center justify-center">
                <div className="h-1 w-1 bg-white rounded-full" />
              </div>
            </div>
            <span className="text-lg font-bold text-[#04432e]">Whatsy</span>
          </div>
          
          <button className="flex items-center gap-1.5 text-xs font-medium text-slate-400 transition hover:text-slate-600">
            <HelpCircle className="h-4 w-4" />
            <span>Need help?</span>
          </button>
        </div>

        {/* Central Auth Interface Form Block */}
        <div className="mx-auto my-auto w-full max-w-sm space-y-6 py-8">
          <div className="space-y-1.5 text-center sm:text-left">
            <h2 className="text-2xl font-bold tracking-tight text-slate-900">
              Welcome back
            </h2>
            <p className="text-xs  text-slate-500">
              Enter your corporate credentials to manage your platform
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Form Field Block */}
            <div className="space-y-1.5">
              <label htmlFor="email" className="text-xs font-medium text-slate-600">
                Business Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-400">
                  <Mail className="h-4 w-4" />
                </div>
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#04432e]/20 focus:border-[#04432e] transition duration-150"
                />
              </div>
            </div>

            {/* Password Form Field Block */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="text-xs font-medium text-slate-600">
                  Password
                </label>
                <a href="#forgot" className="text-xs font-medium text-[#04432e] hover:underline focus:outline-none">
                  Forgot password?
                </a>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-400">
                  <Lock className="h-4 w-4" />
                </div>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#04432e]/20 focus:border-[#04432e] transition duration-150"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600 focus:outline-none"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* UI Custom Switch Replacement: Keep me signed in */}
            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2.5 cursor-pointer select-none">
                <div className="relative">
                  <input
                    type="checkbox"
                    className="sr-only"
                    checked={rememberMe}
                    onChange={() => setRememberMe(!rememberMe)}
                  />
                  <div className={`w-9 h-5 rounded-full transition-colors duration-200 ease-in-out ${rememberMe ? 'bg-[#04432e]' : 'bg-slate-200'}`}>
                    <div className={`w-3.5 h-3.5 bg-white rounded-full absolute top-0.75 transition-transform duration-200 ease-in-out ${rememberMe ? 'transform translate-x-4.5 left-0.5' : 'left-0.5'}`} style={{ top: '3px' }} />
                  </div>
                </div>
                <span className="text-xs font-medium text-slate-600">Keep me signed in</span>
              </label>
            </div>

            {/* Action Submit Control Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 flex items-center justify-center py-2.5 px-4 rounded-xl text-sm font-medium text-white bg-[#04432e] hover:bg-[#033424] active:bg-[#02261a] transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#04432e] disabled:opacity-60 disabled:cursor-not-allowed shadow-sm"
            >
              {isLoading ? (
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
              ) : (
                'Sign In with Password'
              )}
            </button>
          </form>

          {/* Alternative Actions / Navigation Splitting */}
          {/* <div className="relative flex py-1 items-center">
            <div className="flex-grow border-t border-slate-100"></div>
            <span className="flex-shrink mx-3 text-2xl font-light text-slate-200">OR</span>
            <div className="flex-grow border-t border-slate-100"></div>
          </div> */}

      
        </div>

        {/* Mobile View copyright disclaimer */}
        <div className="text-center text-xs text-slate-400 lg:hidden">
          © 2026 Whatsy Inc. All rights reserved.
        </div>
      </div>
    </div>
  );
};

export default Login;