import React, { useState, useContext } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Alert, AlertDescription } from '../components/ui/alert';
import { Separator } from '../components/ui/separator';
import { Mail, Lock, AlertCircle, Eye, EyeOff } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get('redirect') || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setFieldErrors({});
    setLoading(true);

    try {
      const response = await api.post('/auth/login', { email, password });
      await login(response.data);
      const role = response.data.role;
      // Admin users → /admin, customers → redirect param or /
      if (role === 'ROLE_STAFF' || role === 'ROLE_SUPER_ADMIN') {
        navigate('/admin');
      } else {
        navigate(redirectTo);
      }
    } catch (err) {
      if (err.response && err.response.data) {
        const data = err.response.data;
        setError(data.message || 'Login failed. Please try again.');
        if (data.fieldErrors) {
          const errors = {};
          data.fieldErrors.forEach((fe) => {
            errors[fe.field] = fe.message;
          });
          setFieldErrors(errors);
        }
      } else {
        setError('Unable to connect to the server. Please try again later.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-64px)]">
      <Helmet>
        <title>Login — Orlando Prestige</title>
        <meta name="description" content="Sign in to your Orlando Prestige account to order premium Italian products." />
        <link rel="canonical" href="/login" />
      </Helmet>
      {/* Left Panel — Form */}
      <div className="relative z-10 flex w-full items-center justify-center bg-white px-6 py-12 lg:w-[45%] lg:min-w-[480px]">
        {/* Curved edge overlay */}
        <div className="pointer-events-none absolute inset-y-0 right-0 hidden w-24 translate-x-12 lg:block">
          <svg
            viewBox="0 0 100 800"
            preserveAspectRatio="none"
            className="h-full w-full"
            fill="white"
          >
            <path d="M0,0 L100,0 C60,200 80,400 40,600 C20,700 60,750 100,800 L0,800 Z" />
          </svg>
        </div>

        <div className="relative z-20 w-full max-w-sm">
          <h1 className="mb-1 font-serif text-3xl font-bold tracking-tight text-espresso">
            Welcome Back
          </h1>
          <p className="mb-8 text-sm text-muted-foreground">
            Sign in to your account to continue shopping.
          </p>

          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-espresso">
                Email
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-primary" />
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 border-sand focus-visible:ring-primary"
                  required
                  autoFocus
                />
              </div>
              {fieldErrors.email && (
                <p className="text-xs text-destructive">{fieldErrors.email}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-espresso">
                Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-primary" />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 pr-10 border-sand focus-visible:ring-primary"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-espresso transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {fieldErrors.password && (
                <p className="text-xs text-destructive">{fieldErrors.password}</p>
              )}
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full rounded-full bg-primary hover:bg-primary-hover text-white font-bold tracking-wider shadow-lg shadow-primary/30 transition-all hover:shadow-xl hover:shadow-primary/40 hover:-translate-y-0.5"
              size="lg"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Signing in...
                </span>
              ) : (
                'SIGN IN'
              )}
            </Button>
          </form>

          <div className="mt-8">
            <div className="relative">
              <Separator className="bg-sand" />
            </div>
          </div>

          <p className="mt-8 text-center text-sm text-muted-foreground">
            Don't have an account?{' '}
            <Link to="/register" className="font-semibold text-primary hover:text-primary-hover hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </div>

      {/* Right Panel — Image */}
      <div
        className="relative hidden flex-1 lg:flex"
        style={{
          backgroundImage: `linear-gradient(135deg, rgba(45,31,20,0.6), rgba(139,94,60,0.4))`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2240%22%20height%3D%2240%22%3E%3Cpath%20d%3D%22M20%200L40%2020L20%2040L0%2020Z%22%20fill%3D%22none%22%20stroke%3D%22rgba(255%2C255%2C255%2C0.04)%22%2F%3E%3C%2Fsvg%3E')]" />
        <div className="flex w-full flex-col items-center justify-end pb-16">
          <h2 className="font-serif text-5xl font-bold tracking-wide text-white drop-shadow-lg">
            ORLANDO
          </h2>
          <p className="mt-2 text-lg font-medium tracking-[0.2em] text-white/80 drop-shadow-md">
            Authentic Italian Flavors
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
