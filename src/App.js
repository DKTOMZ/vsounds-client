import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { Footer } from "./pages/Footer";
import { Home } from "./pages/home/Home";
import { NavBar } from "./pages/Navbar";
import { Login } from "./pages/auth/Login";
import { SignUp } from "./pages/auth/Signup";
import { Cart } from "./pages/core/Cart"; 
import { Category } from "./pages/home/Category";
import { Accessory } from "./pages/home/Accessories";
import { Payment } from "./pages/core/Payment";
import { ResetPassword } from "./pages/auth/ResetPassword";
import { UserProfile } from "./pages/auth/Profile";
import { useAuth } from "./contexts/AuthContext";
import { NotFound } from "./pages/utilities/404";
import { Product } from "./pages/home/Product";
import { OrderComplete } from "./pages/core/OrderComplete";
import { UserOrders } from "./pages/auth/UserOrders";
import { Order } from "./pages/auth/Order";

const ProtectedRoute = ({ children, props }) => {
    const {currentUser} = useAuth();
    if (!currentUser) {return <Navigate to='/Login' replace state={{route:props.initial}}/>}
    return children;
};

export const App = () => {
    return (
        <div id="App">
            <NavBar />
            <Routes>
                <Route index path="/" element={<Home/>}/>
                <Route path="category/?" element={<Category />}/>
                <Route path="accessory/?" element={<Accessory />}/>
                <Route path="product/?" element={<Product />}/>
                <Route path="Profile" element={
                    <ProtectedRoute props={{initial:'/Profile'}}>
                        <UserProfile />
                    </ProtectedRoute>
                }/>
                <Route path="UserOrders" element={
                    <ProtectedRoute props={{initial:'/UserOrders'}}>
                        <UserOrders/>
                    </ProtectedRoute>
                }/>
                <Route path="Order/?" element={
                    <ProtectedRoute props={{initial:'/OrderedProducts'}}>
                        <Order />
                    </ProtectedRoute>
                }/>
                <Route path="Payment" element={
                    <ProtectedRoute props={{initial:'/Payment'}}>
                        <Payment />
                    </ProtectedRoute>
                }/>
                <Route path="OrderComplete" element={
                    <ProtectedRoute props={{initial:'/OrderComplete'}}>
                        <OrderComplete />
                    </ProtectedRoute>
                }/>
                <Route path="Login" element={<Login />}/>
                <Route path="Signup" element={<SignUp />}/>
                <Route path="ResetPassword" element={<ResetPassword />}/>
                <Route path="Cart" element={<Cart />}/>
                <Route path="*" element={<NotFound />} />
            </Routes>
            <Footer />
        </div>
    );
};