// import React, { useState } from 'react';
// import { Search, ShoppingCart, User, Menu, X, Heart } from 'lucide-react';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Badge } from '@/components/ui/badge';
// import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
// import { Link, useNavigate } from 'react-router-dom';
// import { useApp } from '@/contexts/AppContext.jsx';
// import LoginDialog from '@/components/auth/LoginDialog.jsx';

// const Header = () => {
//   const [isSearchOpen, setIsSearchOpen] = useState(false);
//   const { cartCount, wishlistItems, isLoggedIn, searchQuery, setSearchQuery, user, isAuthLoading, isLoginDialogOpen, openLoginDialog, closeLoginDialog } = useApp();
//   const navigate = useNavigate();

//   const handleSearch = (e) => {
//     e.preventDefault();
//     if (searchQuery.trim()) {
//       navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
//       setIsSearchOpen(false);
//     }
//   };

//   const handleProfileClick = () => {
//     if (isLoggedIn) {
//       navigate('/profile');
//     } else {
//       openLoginDialog();
//     }
//   };

  

//   // Show loading state while checking auth
//   if (isAuthLoading) {
//     return (
//       <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
//         <div className="container mx-auto flex h-16 items-center px-4">
//           <div className="h-8 w-8 rounded-lg bg-brand-primary-500 animate-pulse"></div>
//           <div className="ml-2 h-6 w-24 bg-gray-200 rounded animate-pulse"></div>
//           <div className="ml-auto flex items-center space-x-2">
//             <div className="h-8 w-8 bg-gray-200 rounded-full animate-pulse"></div>
//             <div className="h-8 w-8 bg-gray-200 rounded-full animate-pulse"></div>
//           </div>
//         </div>
//       </header>
//     );
//   }

//   const navigation = [
//     { name: 'Products', href: '/products' },
//     { name: 'About', href: '/about' },
//     { name: 'Contact', href: '/contact' },
//     ...(user?.isAdmin ? [{ name: 'Admin', href: '/admin' }] : []),
//     ...(isLoggedIn ? [{ name: 'My Orders', href: '/orders' }] : [])
//   ];


//   return (
//     <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
//       <div className="container mx-auto flex h-16 items-center px-4">
//         {/* Logo */}
//         <Link to="/" className="flex items-center space-x-2">
//           <div className="h-8 w-8 rounded-lg bg-brand-primary-500 flex items-center justify-center">
//             <span className="text-white font-bold text-lg">A</span>
//           </div>
//           <span className="hidden font-bold sm:inline-block text-xl">
//             Agri-Commerce
//           </span>
//         </Link>

//         {/* Desktop Navigation */}
//         <nav className="hidden md:flex mx-6 space-x-6">
//           {navigation.map((item) => (
//             <Link
//               key={item.name}
//               to={item.href}
//               className="text-sm font-medium transition-colors hover:text-brand-primary-500"
//             >
//               {item.name}
//             </Link>
//           ))}
//         </nav>

//         {/* Search Bar */}
//         <div className="hidden md:flex flex-1 max-w-md mx-4">
//           <form onSubmit={handleSearch} className="relative w-full">
//             <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
//             <Input
//               placeholder="Search for farming equipment..."
//               className="pl-10 pr-4"
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//             />
//           </form>
//         </div>

//         {/* Right side actions */}
//         <div className="flex items-center space-x-2 ml-auto">
//           {/* Mobile search toggle */}
//           <Button
//             variant="ghost"
//             size="icon"
//             className="md:hidden"
//             onClick={() => setIsSearchOpen(!isSearchOpen)}
//           >
//             <Search className="h-5 w-5" />
//           </Button>

//           {/* Account */}
//           <Button variant="ghost" size="icon" onClick={handleProfileClick}>
//             <User className="h-5 w-5" />
//           </Button>

          

//           {/* Wishlist */}
//           <Link to="/wishlist">
//             <Button variant="ghost" size="icon" className="relative">
//               <Heart className="h-5 w-5" />
//               {wishlistItems?.length > 0 && (
//                 <Badge
//                   variant="destructive"
//                   className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
//                 >
//                   {wishlistItems.length}
//                 </Badge>
//               )}
//             </Button>
//           </Link>

//           {/* Cart */}
//           <Link to="/cart">
//             <Button variant="ghost" size="icon" className="relative">
//               <ShoppingCart className="h-5 w-5" />
//               {cartCount > 0 && (
//                 <Badge
//                   variant="destructive"
//                   className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
//                 >
//                   {cartCount}
//                 </Badge>
//               )}
//             </Button>
//           </Link>

//           {/* Mobile menu */}
//           <Sheet>
//             <SheetTrigger asChild>
//               <Button variant="ghost" size="icon" className="md:hidden">
//                 <Menu className="h-5 w-5" />
//               </Button>
//             </SheetTrigger>
//             <SheetContent side="right" className="w-[300px] sm:w-[400px]">
//               <nav className="flex flex-col space-y-4 mt-6">
//                 {navigation.map((item) => (
//                   <Link
//                     key={item.name}
//                     to={item.href}
//                     className="text-lg font-medium transition-colors hover:text-brand-primary-500"
//                   >
//                     {item.name}
//                   </Link>
//                 ))}
                
//               </nav>
//             </SheetContent>
//           </Sheet>
//         </div>
//       </div>

//       {/* Mobile search bar */}
//       {isSearchOpen && (
//         <div className="border-t bg-background p-4 md:hidden">
//           <form onSubmit={handleSearch} className="relative">
//             <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
//             <Input
//               placeholder="Search for farming equipment..."
//               className="pl-10 pr-4"
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//             />
//           </form>
//         </div>
//       )}

//       <LoginDialog 
//         open={isLoginDialogOpen} 
//         onOpenChange={(v) => v ? openLoginDialog() : closeLoginDialog()}
//       />
//     </header>
//   );
// };

// export default Header;


import React, { useState } from 'react';
import { Search, ShoppingCart, User, Menu, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '@/contexts/AppContext.jsx';
import LoginDialog from '@/components/auth/LoginDialog.jsx';
import logo from "/logo.jpg"

const Header = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const {
    cartCount,
    wishlistItems,
    isLoggedIn,
    searchQuery,
    setSearchQuery,
    isAuthLoading,
    isLoginDialogOpen,
    openLoginDialog,
    closeLoginDialog,
  } = useApp();

  const navigate = useNavigate();

  // ✅ Get user role from local storage
  const userRole = localStorage.getItem('userRole');

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchOpen(false);
    }
  };

  const handleProfileClick = () => {
    if (isLoggedIn) {
      navigate('/profile');
    } else {
      openLoginDialog();
    }
  };

  // Loading skeleton
  if (isAuthLoading) {
    return (
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-16 items-center px-4">
          <div className="h-8 w-8 rounded-lg bg-brand-primary-500 animate-pulse"></div>
          <div className="ml-2 h-6 w-24 bg-gray-200 rounded animate-pulse"></div>
          <div className="ml-auto flex items-center space-x-2">
            <div className="h-8 w-8 bg-gray-200 rounded-full animate-pulse"></div>
            <div className="h-8 w-8 bg-gray-200 rounded-full animate-pulse"></div>
          </div>
        </div>
      </header>
    );
  }

  const navigation = [
    { name: 'Products', href: '/products' },
    { name: 'About', href: '/about' },
    { name: 'Contact', href: '/contact' },
    ...(isLoggedIn ? [{ name: 'My Orders', href: '/orders' }] : []),
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center px-4">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2">
          {/* <div className="h-8 w-8 rounded-lg bg-brand-primary-500 flex items-center justify-center">
            <span className="text-white font-bold text-lg">A</span>
          </div>
          <span className="hidden font-bold sm:inline-block text-xl">
            Agri-Commerce
          </span> */}
          <img 
            className='w-28'
            src={logo}
            alt='logo'
          />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex mx-6 space-x-6">
          {navigation.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className="text-sm font-medium transition-colors hover:text-brand-primary-500"
            >
              {item.name}
            </Link>
          ))}
        </nav>

        {/* Search Bar */}
        <div className="hidden md:flex flex-1 max-w-md mx-4">
          <form onSubmit={handleSearch} className="relative w-full">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search for farming equipment..."
              className="pl-10 pr-4"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </form>
        </div>

        {/* ✅ Dashboard link visible only for admin users */}
        {userRole === 'admin' && (
          <Link
            to="/admin"
            className="hidden md:inline-block text-sm font-semibold text-black-600 hover:underline ml-2"
          >
            Dashboard
          </Link>
        )}

        {/* Right side actions */}
        <div className="flex items-center space-x-2 ml-auto">
          {/* Mobile search toggle */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsSearchOpen(!isSearchOpen)}
          >
            <Search className="h-5 w-5" />
          </Button>

          {/* Account */}
          <Button variant="ghost" size="icon" onClick={handleProfileClick}>
            <User className="h-5 w-5" />
          </Button>

          {/* Wishlist */}
          <Link to="/wishlist">
            <Button variant="ghost" size="icon" className="relative">
              <Heart className="h-5 w-5" />
              {wishlistItems?.length > 0 && (
                <Badge
                  variant="destructive"
                  className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
                >
                  {wishlistItems.length}
                </Badge>
              )}
            </Button>
          </Link>

          {/* Cart */}
          <Link to="/cart">
            <Button variant="ghost" size="icon" className="relative">
              <ShoppingCart className="h-5 w-5" />
              {cartCount > 0 && (
                <Badge
                  variant="destructive"
                  className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
                >
                  {cartCount}
                </Badge>
              )}
            </Button>
          </Link>

          {/* Mobile menu */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <nav className="flex flex-col space-y-4 mt-6">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className="text-lg font-medium transition-colors hover:text-brand-primary-500"
                  >
                    {item.name}
                  </Link>
                ))}
                {userRole === 'admin' && (
                  <Link
                    to="/admin"
                    className="text-lg font-semibold text-brand-primary-600 hover:underline"
                  >
                    Dashboard
                  </Link>
                )}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Mobile search bar */}
      {isSearchOpen && (
        <div className="border-t bg-background p-4 md:hidden">
          <form onSubmit={handleSearch} className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search for farming equipment..."
              className="pl-10 pr-4"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </form>
        </div>
      )}

      <LoginDialog
        open={isLoginDialogOpen}
        onOpenChange={(v) => (v ? openLoginDialog() : closeLoginDialog())}
      />
    </header>
  );
};

export default Header;
