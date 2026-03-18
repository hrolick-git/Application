import { useState } from 'react';
import { Link } from 'react-router-dom';
import { EnvelopeIcon, LockClosedIcon, UserIcon } from '@heroicons/react/24/outline';
import { PrimaryButton } from './PrimaryButton';
import { TextField } from './form/TextField';

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
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {!isLogin && (
        <TextField
          required
          type="text"
          placeholder="Full Name"
          leftIcon={<UserIcon />}
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        />
      )}

      <TextField
        required
        type="email"
        placeholder="Email Address"
        leftIcon={<EnvelopeIcon />}
        value={formData.email}
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
      />

      <TextField
        required
        type="password"
        placeholder="Password"
        leftIcon={<LockClosedIcon />}
        value={formData.password}
        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
      />

      <PrimaryButton type="submit" isLoading={isLoading}>
        {isLogin ? 'Sign In' : 'Create Account'}
      </PrimaryButton>

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