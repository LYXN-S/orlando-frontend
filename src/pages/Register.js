import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Alert, AlertDescription } from '../components/ui/alert';
import { AlertCircle, User, Mail, Lock } from 'lucide-react';

const getPasswordStrength = (password) => {
  let score = 0;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[a-z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[@$!%*?&]/.test(password)) score++;
  return score;
};

const strengthLabels = ['', 'Weak', 'Fair', 'Good', 'Strong', 'Excellent'];
const strengthColors = ['', 'bg-destructive', 'bg-orange-400', 'bg-yellow-400', 'bg-accent', 'bg-success'];

const Register = () => {
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const passwordStrength = getPasswordStrength(form.password);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (fieldErrors[e.target.name]) {
      setFieldErrors({ ...fieldErrors, [e.target.name]: '' });
    }
  };

  const validate = () => {
    const errors = {};
    if (!form.firstName.trim()) errors.firstName = 'First name is required';
    if (!form.lastName.trim()) errors.lastName = 'Last name is required';
    if (!form.email.trim()) errors.email = 'Email is required';
    if (form.password.length < 8)
      errors.password = 'Password must be at least 8 characters';
    else if (!/[A-Z]/.test(form.password))
      errors.password = 'Password must contain an uppercase letter';
    else if (!/[a-z]/.test(form.password))
      errors.password = 'Password must contain a lowercase letter';
    else if (!/[0-9]/.test(form.password))
      errors.password = 'Password must contain a digit';
    else if (!/[@$!%*?&]/.test(form.password))
      errors.password = 'Password must contain a special character (@$!%*?&)';
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const errors = validate();
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }
    setFieldErrors({});
    setLoading(true);

    try {
      await api.post('/auth/register', form);
      navigate('/login?registered=true');
    } catch (err) {
      if (err.response && err.response.data) {
        const data = err.response.data;
        setError(data.message || 'Registration failed. Please try again.');
        if (data.fieldErrors) {
          const errs = {};
          data.fieldErrors.forEach((fe) => {
            errs[fe.field] = fe.message;
          });
          setFieldErrors(errs);
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
            Create Account
          </h1>
          <p className="mb-8 text-sm text-muted-foreground">
            Join the Orlando family and start shopping.
          </p>

          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="firstName" className="text-espresso">
                  First Name
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-primary" />
                  <Input
                    id="firstName"
                    name="firstName"
                    placeholder="First"
                    value={form.firstName}
                    onChange={handleChange}
                    className="pl-10 border-sand focus-visible:ring-primary"
                    required
                    autoFocus
                  />
                </div>
                {fieldErrors.firstName && (
                  <p className="text-xs text-destructive">{fieldErrors.firstName}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName" className="text-espresso">
                  Last Name
                </Label>
                <Input
                  id="lastName"
                  name="lastName"
                  placeholder="Last"
                  value={form.lastName}
                  onChange={handleChange}
                  className="border-sand focus-visible:ring-primary"
                  required
                />
                {fieldErrors.lastName && (
                  <p className="text-xs text-destructive">{fieldErrors.lastName}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-espresso">
                Email
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-primary" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={handleChange}
                  className="pl-10 border-sand focus-visible:ring-primary"
                  required
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
                  name="password"
                  type="password"
                  placeholder="Min 8 characters"
                  value={form.password}
                  onChange={handleChange}
                  className="pl-10 border-sand focus-visible:ring-primary"
                  required
                />
              </div>
              {fieldErrors.password && (
                <p className="text-xs text-destructive">{fieldErrors.password}</p>
              )}

              {/* Password Strength */}
              {form.password.length > 0 && (
                <div className="mt-2">
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((level) => (
                      <div
                        key={level}
                        className={`h-1.5 flex-1 rounded-full transition-colors ${
                          level <= passwordStrength
                            ? strengthColors[passwordStrength]
                            : 'bg-sand'
                        }`}
                      />
                    ))}
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {strengthLabels[passwordStrength]}
                  </p>
                </div>
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
                  Creating account...
                </span>
              ) : (
                'CREATE ACCOUNT'
              )}
            </Button>
          </form>

          <p className="mt-8 text-center text-sm text-muted-foreground">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-primary hover:text-primary-hover hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>

      {/* Right Panel — Image */}
      <div
        className="relative hidden flex-1 lg:flex"
        style={{
          backgroundImage: `linear-gradient(135deg, rgba(45,31,20,0.6), rgba(107,127,58,0.4))`,
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
            Join the Family
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
