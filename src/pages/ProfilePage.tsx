
import React, { useState } from 'react';
import { User, Mail, Lock, LogOut, Settings } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useApp } from '@/contexts/AppContext';
import { useNavigate } from 'react-router-dom';
import LoginDialog from '@/components/auth/LoginDialog';

const ProfilePage = () => {
  const { user, isLoggedIn, logout } = useApp();
  const navigate = useNavigate();
  const [showLoginDialog, setShowLoginDialog] = useState(!isLoggedIn);

  const handleLogout = () => {


    localStorage.removeItem('authToken'); // Clear token from local storage
    navigate('/');
  };

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
              trigger={
                <Button size="lg">
                  Log In
                </Button>
              }
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
                      <Input value={user?.name || ''} readOnly />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-grey-700 mb-2">
                        Email Address
                      </label>
                      <Input value={user?.email || ''} readOnly />
                    </div>
                  </div>
                  <Button>Update Profile</Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Security</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button variant="outline" className="w-full justify-start">
                    <Lock className="w-4 h-4 mr-2" />
                    Change Password
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Mail className="w-4 h-4 mr-2" />
                    Update Email
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
