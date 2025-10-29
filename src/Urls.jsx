const Url = "https://agri-tech-backend-07b8.onrender.com/";

//  const Url = "https://dg99c8r5-5000.inc1.devtunnels.ms/";


export const URLS = {
  // User Sign In 
  UserSignUp: Url + "api/auth/signup",
  UserLogin: Url + "api/auth/signin",
  GetProfile: Url + "api/auth/profile",
  UpdateProfile: Url + "api/auth/update-profile",
  UpdatePassword: Url + "api/auth/update-password",
  
  // Products
  Products: Url + "api/products",
  BestSellers: Url + "api/products/best-sellers",
  NewArrivals: Url + "api/products/new-arrivals",
  GetProductById: Url + "api/products",
  UpdateProduct: Url + "api/products/update",
  DeleteProduct: Url + "api/products/delete",
  AddProduct: Url + "api/products/upload",
  
  // Wishlist 
  WishlistAdd: Url + "api/wishlist/add",
  WishlistRemove: Url + "api/wishlist/remove",
  WishlistGet: Url + "api/wishlist",

  // Cart
  CartAdd: Url + "api/cart/add",
  CartUpdate: Url + "api/cart/update",
  CartGet: Url + "api/cart",
  CartRemove: (productId) => Url + `api/cart/remove/${productId}`,
  

    createOrder: Url + "api/orders/place-order",
   verifypayment: Url + "api/orders/verify-payment",
    UserOrders: Url + "api/orders/my-orders",

    
     UpdateStatus: (id) => Url + `api/orders/update-status/${id}`,
   Allorders: Url + "api/orders/all-orders",
    
};
