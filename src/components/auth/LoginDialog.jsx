import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useApp } from '@/contexts/AppContext.jsx';
import { useToast } from '@/hooks/use-toast.js';
import { URLS } from '../../Urls';

const LoginDialog = ({ open, onOpenChange, trigger }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [username, setUsername] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { loginWithGoogle, setUser, setToken } = useApp();
  const { toast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (isSignUp) {
      // Handle sign up
      if (password !== confirmPassword) {
        toast({
          title: "Password mismatch",
          description: "Passwords do not match. Please try again.",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch(`${URLS.UserSignUp}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: username,
            email: email,
            password: password
          }),
        });

        const data = await response.json();

        if (response.ok) {
          toast({
            title: "Account created!",
            description: "Your account has been created successfully. Please sign in now.",
          });
          // Switch to sign in mode and clear form
          setIsSignUp(false);
          resetForm();
        } else {
          toast({
            title: "Sign up failed",
            description: data.message || "Failed to create account. Please try again.",
            variant: "destructive",
          });
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "Something went wrong. Please try again.",
          variant: "destructive",
        });
        console.error("Sign up error:", error);
      }
    } else {
      // Handle sign in - Direct API integration
      try {
        const response = await fetch(`${URLS.UserLogin}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: email,
            password: password
          }),
        });

        const data = await response.json();

        if (response.ok) {
          // Store token in localStorage for persistence
          localStorage.setItem('authToken', data.token);
          
          // Set user data in context/state
          if (setUser) {
            setUser(data.user);
          }
          
          // Set token in context if available
          if (setToken) {
            setToken(data.token);
          }

          // Set up axios default headers for future requests
          if (window.axios) {
            window.axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
          }

          toast({
            title: "Welcome back!",
            description: `Hello ${data.user.name}, you have been successfully logged in.`,
          });

          // Close dialog and reset form
          if (onOpenChange) onOpenChange(false);
          resetForm();
        } else {
          toast({
            title: "Login failed",
            description: data.message || "Invalid email or password. Please try again.",
            variant: "destructive",
          });
        }
      } catch (error) {
        toast({
          title: "Connection Error",
          description: "Unable to connect to server. Please check your internet connection and try again.",
          variant: "destructive",
        });
        console.error("Sign in error:", error);
      }
    }
    
    setIsLoading(false);
  };

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setUsername('');
  };

  const toggleMode = () => {
    setIsSignUp(!isSignUp);
    resetForm();
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    try {
      const success = await loginWithGoogle();
      
      if (success) {
        toast({
          title: "Welcome!",
          description: "You have been successfully logged in with Google.",
        });
        if (onOpenChange) onOpenChange(false);
      }
    } catch (error) {
      toast({
        title: "Google Login Error",
        description: "Failed to login with Google. Please try again.",
        variant: "destructive",
      });
    }
    
    setIsLoading(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{isSignUp ? 'Create Account' : 'Sign In'}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <Button 
            onClick={handleGoogleLogin} 
            variant="outline" 
            className="w-full"
            disabled={isLoading}
          >
            Continue with Google
          </Button>
          
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">Or</span>
            </div>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            {isSignUp && (
              <div>
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter your username"
                  required
                />
              </div>
            )}
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
              />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
              />
            </div>
            {isSignUp && (
              <div>
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm your password"
                  required
                />
              </div>
            )}
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading 
                ? (isSignUp ? 'Creating account...' : 'Signing in...') 
                : (isSignUp ? 'Create Account' : 'Sign In')
              }
            </Button>
            
            {!isSignUp && (
              <p className="text-sm text-grey-600 text-center">
                Demo: Use admin@agri.com for admin access, or any email/password for user
              </p>
            )}
            
            <div className="text-center">
              <Button 
                type="button" 
                variant="link" 
                onClick={toggleMode}
                className="text-sm"
              >
                {isSignUp 
                  ? "Already have an account? Sign In" 
                  : "Don't have an account? Sign Up"
                }
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LoginDialog;
