const Url = "http://127.0.0.1:5000/"

export const URLS = {

    //User Sign In 
    UserSignUp : Url + "api/auth/signup",
    UserLogin : Url + "api/auth/signin",
    GetProfile : Url + "api/auth/profile",
    UpdateProfile : Url + "api/auth/update-profile",
    // Products
    Products: Url + "api/products",
    BestSellers: Url + "api/products/best-sellers",
    NewArrivals: Url + "api/products/new-arrivals",
    // Wishlist
    WishlistAdd: Url + "api/wishlist/add",
    WishlistRemove: Url + "api/wishlist/remove",
    WishlistGet: Url + "api/wishlist",
} 