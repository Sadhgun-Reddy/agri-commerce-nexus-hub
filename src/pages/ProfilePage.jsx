import React, { useState, useEffect } from "react";
import { User, Lock, LogOut, Settings } from "lucide-react";
import Header from "@/components/layout/Header.jsx";
import Footer from "@/components/layout/Footer.jsx";
import { Button } from "@/components/ui/button.jsx";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card.jsx";
import { Input } from "@/components/ui/input.jsx";
import { useApp } from "@/contexts/AppContext.jsx";
import { useNavigate } from "react-router-dom";
import LoginDialog from "@/components/auth/LoginDialog.jsx";
import axios from "axios";
import { URLS } from "@/Urls.jsx";
import { useToast } from "@/hooks/use-toast.js";

const ProfilePage = () => {
  const { user, isLoggedIn, logout, refreshUser } = useApp();
  const navigate = useNavigate();
  const [showLoginDialog, setShowLoginDialog] = useState(!isLoggedIn);
  const { toast } = useToast();

  const [name, setName] = useState("");
  const [email, setEmail] = useState(""); // disabled
  const [phone, setPhone] = useState(""); // editable
  const [saving, setSaving] = useState(false);
  const [changePassword, setChangePassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Prefetch user details (name, email, phone)
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem("authToken");
        if (!token) return;

        const res = await axios.get(URLS.GetProfile, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const userData = res.data?.data?.user;
        if (userData) {
          setName(userData.name || "");
          setEmail(userData.email || "");
          setPhone(userData.phone || "");
        }
      } catch (err) {
        console.error("Failed to fetch profile:", err);
      }
    };

    fetchUserProfile();
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleUpdate = async () => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        toast({
          title: "Not authorized",
          description: "Please log in again",
          variant: "destructive",
        });
        return;
      }

      let didRequest = false;

      // Password update
      if (changePassword) {
        if (!currentPassword || !newPassword || !confirmPassword) {
          toast({
            title: "Missing fields",
            description: "Please fill current, new, and confirm password",
            variant: "destructive",
          });
          return;
        }
        if (newPassword !== confirmPassword) {
          toast({
            title: "Password mismatch",
            description: "New and confirm password do not match",
            variant: "destructive",
          });
          return;
        }

        setSaving(true);
        await axios.put(
          URLS.UpdatePassword,
          { currentPassword, newPassword },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        toast({
          title: "Password updated",
          description: "Your password was changed successfully",
          variant: "success",
        });

        didRequest = true;
        setChangePassword(false);
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      }

      // Profile update
      const profilePayload = {};
      if (name && name !== user?.name) profilePayload.name = name.trim();
      if (phone && phone !== user?.phone) profilePayload.phone = phone.trim();

      if (Object.keys(profilePayload).length > 0) {
        setSaving(true);
        const res = await axios.put(URLS.UpdateProfile, profilePayload, {
          headers: { Authorization: `Bearer ${token}` },
        });

        toast({
          title: "Profile updated",
          description: res.data?.message || "Your profile was updated successfully",
          variant: "success",
        });

        didRequest = true;
      }

      if (!didRequest) {
        toast({
          title: "No changes",
          description: "You haven’t made any updates",
          variant: "default",
        });
        return;
      }

      await refreshUser();
    } catch (err) {
      toast({
        title: "Update failed",
        description: err.response?.data?.message || err.message,
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-6">
            <User className="w-24 h-24 mx-auto text-gray-300" />
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                Access Your Account
              </h1>
              <p className="text-gray-600">Please log in to view your profile</p>
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
          <h1 className="text-3xl font-bold text-gray-800 mb-8">My Profile</h1>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Sidebar */}
            <div className="space-y-4">
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="w-20 h-20 bg-brand-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <User className="w-10 h-10 text-brand-primary-500" />
                  </div>
                  <h3 className="font-semibold text-gray-800 mb-1">{name}</h3>
                  <p className="text-gray-600">{email}</p>
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

            {/* Main Profile Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Personal Info */}
              <Card>
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name
                      </label>
                      <Input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Enter your name"
                      />
                    </div>
                <div>
  <label className="block text-sm font-medium text-gray-700 mb-2">
    Email Address
  </label>
  <Input
    type="email"
    value={email}
    disabled
    className="bg-gray-100 cursor-not-allowed"
  />
</div>
<div className="md:col-span-2">
  <label className="block text-sm font-medium text-gray-700 mb-2">
    Phone Number
  </label>
  <Input
    type="tel"
    value={phone}
    disabled
    className="bg-gray-100 cursor-not-allowed"
  />
</div>

                  </div>
                </CardContent>
              </Card>

              {/* Security */}
              <Card>
                <CardHeader>
                  <CardTitle>Security</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Button
                      variant="outline"
                      className="w-full justify-start"
                      onClick={() => setChangePassword(!changePassword)}
                    >
                      <Lock className="w-4 h-4 mr-2" />
                      {changePassword ? "Cancel Password Change" : "Change Password"}
                    </Button>

                    {changePassword && (
                      <div className="mt-4 space-y-3">
                        <label className="block text-sm font-medium text-gray-700">
                          Current Password
                        </label>
                        <Input
                          type="password"
                          value={currentPassword}
                          onChange={(e) => setCurrentPassword(e.target.value)}
                        />
                        <label className="block text-sm font-medium text-gray-700">
                          New Password
                        </label>
                        <Input
                          type="password"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                        />
                        <label className="block text-sm font-medium text-gray-700">
                          Confirm Password
                        </label>
                        <Input
                          type="password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                      </div>
                    )}
                  </div>

                  <Button disabled={saving} onClick={handleUpdate}>
                    {saving ? "Saving..." : "Update Profile"}
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
