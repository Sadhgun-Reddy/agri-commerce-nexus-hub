import React, { useState } from 'react';
import { User, Mail, Lock, LogOut, Settings } from 'lucide-react';
import Header from '@/components/layout/Header.jsx';
import Footer from '@/components/layout/Footer.jsx';
import { Button } from '@/components/ui/button.jsx';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx';
import { Input } from '@/components/ui/input.jsx';
import { useApp } from '@/contexts/AppContext.jsx';
import { useNavigate } from 'react-router-dom';
import LoginDialog from '@/components/auth/LoginDialog.jsx';
import axios from 'axios';
import { URLS } from '@/Urls.jsx';
import { useToast } from '@/hooks/use-toast.js';

const ProfilePage = () => {
  const { user, isLoggedIn, logout, refreshUser } = useApp();
  const navigate = useNavigate();
  const [showLoginDialog, setShowLoginDialog] = useState(!isLoggedIn);
  const { toast } = useToast();

  // profile info
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [saving, setSaving] = useState(false);

  // password change
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [changingPassword, setChangingPassword] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Update Profile Info (name only)
  const handleProfileUpdate = async () => {
    setSaving(true);
    try {
      const token = localStorage.getItem('authToken');
      await axios.put(
        URLS.UpdateProfile,
        { name },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      await refreshUser();
      toast({ title: 'Profile updated successfully', variant: 'success' });
    } catch (err) {
      toast({
        title: 'Profile update failed',
        description: err.response?.data?.message || err.message,
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  // Change Password
  const handleChangePassword = async () => {
    if (!oldPassword || !newPassword || !confirmPassword) {
      return toast({ title: 'Please fill all password fields', variant: 'destructive' });
    }

    if (newPassword !== confirmPassword) {
      return toast({ title: 'Passwords do not match', variant: 'destructive' });
    }

    setChangingPassword(true);
    try {
      const token = localStorage.getItem('authToken');
      await axios.put(
        URLS.UpdateProfile,
        { oldPassword, newPassword },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
      toast({ title: 'Password changed successfully', variant: 'success' });
    } catch (err) {
      toast({
        title: 'Password update failed',
        description: err.response?.data?.message || err.message,
        variant: 'destructive',
      });
    } finally {
      setChangingPassword(false);
    }
  };

  // If not logged in
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-6">
            <User className="w-24 h-24 mx-auto text-grey-300" />
            <div>
              <h1 className="text-3xl font-bold text-grey-800 mb-2">Access Your Account</h1>
              <p className="text-grey-600">Please log in to view your profile</p>
            </div>
            <LoginDialog
              open={showLoginDialog}
              onOpenChange={setShowLoginDialog}
              trigger={<Button size="lg">Log In</Button>}
            />
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold text-grey-800 mb-8">My Profile</h1>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Profile Sidebar */}
            <div className="space-y-4">
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="w-20 h-20 bg-brand-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <User className="w-10 h-10 text-brand-primary-500" />
                  </div>
                  <h3 className="font-semibold text-grey-800 mb-1">{user?.name}</h3>
                  <p className="text-grey-600">{user?.email}</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <nav className="space-y-2">
                    <Button variant="ghost" className="w-full justify-start">
                      <User className="w-4 h-4 mr-2" />
                      Personal Info
                    </Button>
                    <Button variant="ghost" className="w-full justify-start">
                      <Settings className="w-4 h-4 mr-2" />
                      Account Settings
                    </Button>
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-red-600 hover:text-red-700"
                      onClick={handleLogout}
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Log Out
                    </Button>
                  </nav>
                </CardContent>
              </Card>
            </div>

            {/* Profile Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Personal Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-grey-700 mb-2">
                        Full Name
                      </label>
                      <Input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Enter your full name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-grey-700 mb-2">
                        Email Address
                      </label>
                      <Input value={email} disabled readOnly />
                    </div>
                  </div>
                  <Button disabled={saving} onClick={handleProfileUpdate}>
                    {saving ? 'Saving...' : 'Update Profile'}
                  </Button>
                </CardContent>
              </Card>

              {/* Security / Change Password */}
              <Card>
                <CardHeader>
                  <CardTitle>Change Password</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-grey-700 mb-2">
                      Current Password
                    </label>
                    <Input
                      type="password"
                      value={oldPassword}
                      onChange={(e) => setOldPassword(e.target.value)}
                      placeholder="Enter current password"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-grey-700 mb-2">
                      New Password
                    </label>
                    <Input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Enter new password"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-grey-700 mb-2">
                      Confirm New Password
                    </label>
                    <Input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm new password"
                    />
                  </div>
                  <Button disabled={changingPassword} onClick={handleChangePassword}>
                    {changingPassword ? 'Changing...' : 'Change Password'}
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ProfilePage;
