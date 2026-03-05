import { useState } from 'react';
import { Link } from 'react-router-dom';
import { EnvelopeIcon, LockClosedIcon, UserIcon } from '@heroicons/react/24/outline';

interface AuthFormProps {
  type: 'login' | 'register';
  onSubmit: (data: any) => void;
  isLoading: boolean;
}

export function AuthForm({ type, onSubmit, isLoading }: AuthFormProps) {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
  });

  const isLogin = type === 'login';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted with data:", formData);
    onSubmit(formData);
  };

  const inputClasses = "w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all outline-none font-medium";

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {!isLogin && (
        <div className="relative">
          <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            required
            type="text"
            placeholder="Full Name"
            className={inputClasses}
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
        </div>
      )}

      <div className="relative">
        <EnvelopeIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
        <input
          required
          type="email"
          placeholder="Email Address"
          className={inputClasses}
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        />
      </div>

      <div className="relative">
        <LockClosedIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
        <input
          required
          type="password"
          placeholder="Password"
          className={inputClasses}
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
        />
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-black text-lg hover:bg-indigo-700 shadow-xl shadow-indigo-200 transition-all active:scale-95 disabled:opacity-50"
      >
        {isLoading ? 'Processing...' : isLogin ? 'Sign In' : 'Create Account'}
      </button>

      <p className="text-center text-slate-500 font-medium mt-6">
        {isLogin ? "Don't have an account?" : "Already have an account?"}
        <Link 
          to={isLogin ? '/register' : '/login'} 
          className="ml-2 text-indigo-600 font-bold hover:underline"
        >
          {isLogin ? 'Sign Up' : 'Log In'}
        </Link>
      </p>
    </form>
  );
}