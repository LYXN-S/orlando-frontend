import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/button';
import Footer from '../components/Footer';
import { User, Mail, MapPin, Phone, Edit2, ShieldCheck } from 'lucide-react';

const Profile = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-3xl px-4 py-8 md:px-8 md:py-12">
        <h1 className="font-serif text-3xl font-bold text-espresso md:text-4xl">
          Your Profile
        </h1>
        <p className="mt-1 text-muted-foreground">
          Manage your account information
        </p>

        {/* Profile Card */}
        <div className="mt-8 rounded-2xl border border-border bg-white p-6 shadow-sm md:p-8">
          {/* Avatar & Name */}
          <div className="flex items-start gap-5">
            <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary-hover text-3xl font-bold text-white">
              {user?.firstName?.[0] || user?.email?.[0]?.toUpperCase() || 'U'}
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="font-serif text-xl font-semibold text-espresso">
                {user?.firstName && user?.lastName
                  ? `${user.firstName} ${user.lastName}`
                  : 'Orlando Customer'}
              </h2>
              <p className="mt-0.5 flex items-center gap-1.5 text-sm text-muted-foreground">
                <ShieldCheck className="h-4 w-4 text-accent" />
                Verified Account
              </p>
            </div>
          </div>

          {/* Info Rows */}
          <div className="mt-8 divide-y divide-border">
            <InfoRow icon={Mail} label="Email" value={user?.email || '—'} />
            <InfoRow icon={User} label="Username" value={user?.username || '—'} />
            <InfoRow icon={Phone} label="Phone" value={user?.phone || 'Not set'} />
            <InfoRow icon={MapPin} label="Address" value={user?.address || 'Not set'} />
          </div>

          {/* Actions */}
          <div className="mt-8 flex flex-wrap gap-3">
            <Button
              variant="outline"
              className="gap-2 rounded-full border-border text-espresso hover:bg-cream"
              disabled
            >
              <Edit2 className="h-4 w-4" />
              Edit Profile
            </Button>
            <Button
              variant="outline"
              className="gap-2 rounded-full border-wine/30 text-wine hover:bg-wine/5"
              onClick={handleLogout}
            >
              Log Out
            </Button>
          </div>
        </div>

        {/* Account Details */}
        <div className="mt-6 rounded-2xl border border-border bg-white p-6 shadow-sm md:p-8">
          <h3 className="font-serif text-lg font-semibold text-espresso">
            Account Details
          </h3>
          <div className="mt-4 grid gap-4 text-sm md:grid-cols-2">
            <div>
              <span className="text-muted-foreground">Member Since</span>
              <p className="mt-0.5 font-medium text-espresso">
                {user?.createdAt
                  ? new Date(user.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })
                  : 'N/A'}
              </p>
            </div>
            <div>
              <span className="text-muted-foreground">Account Type</span>
              <p className="mt-0.5 font-medium text-espresso">Standard</p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

/* Small reusable row */
const InfoRow = ({ icon: Icon, label, value }) => (
  <div className="flex items-center gap-4 py-4">
    <Icon className="h-5 w-5 shrink-0 text-primary/50" />
    <div className="min-w-0 flex-1">
      <p className="text-xs uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="mt-0.5 truncate font-medium text-espresso">{value}</p>
    </div>
  </div>
);

export default Profile;
