import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import toast from "react-hot-toast";
import axios from 'axios';

const Navbar = () => {
    const { loginWithRedirect, logout, user, isAuthenticated } = useAuth0();
    const [showDropdown, setShowDropdown] = useState(false);
    const navigate = useNavigate();
    const [cartCount, setCartCount] = useState(0);
    useEffect(() => {
        const fetchCartCount = async () => {
            if (user?.email) {  // ✅ Safe check
                try {
                    const response = await axios.get(`http://15.206.163.163:8080/cart/noofproduct/${user.email}`);
                    console.log("Cart count response:", response.data); // Debugging log
                    setCartCount(response.data); // ✅ Properly update state
                } catch (error) {
                    console.error("Error fetching cart data:", error);
                }
            }
        };

        fetchCartCount(); // Call the async function
    }, [user]);  // ✅ Runs when 'user' changes


    const handleCartClick = () => {
        if (!isAuthenticated) {
            toast.error("Please log in to add items to the cart.");
        } else {
            navigate('/cart');
        }
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light py-3 sticky-top">
            <div className="container">
                <NavLink className="navbar-brand fw-bold fs-4 px-2" to="/">ShopEase</NavLink>
                <button className="navbar-toggler mx-2" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul className="navbar-nav m-auto my-2 text-center">
                        <li className="nav-item"><NavLink className="nav-link" to="/">Home</NavLink></li>
                        <li className="nav-item"><NavLink className="nav-link" to="/product">Products</NavLink></li>
                        <li className="nav-item"><NavLink className="nav-link" to="/about">About</NavLink></li>
                        <li className="nav-item"><NavLink className="nav-link" to="/contact">Contact</NavLink></li>
                    </ul>

                    <div className="buttons text-center d-flex align-items-center">
                        {!isAuthenticated ? (
                            <button onClick={loginWithRedirect} className="btn btn-outline-dark m-2">
                                <i className="fa fa-sign-in-alt mr-1"></i> Login
                            </button>
                        ) : (
                            <div className="position-relative">
                                <img
                                    src={user.picture}
                                    alt={user.name}
                                    className="rounded-circle"
                                    style={{ width: "40px", height: "40px", cursor: "pointer" }}
                                    onClick={() => setShowDropdown(!showDropdown)}
                                />
                                {showDropdown && (
                                    <div className="position-absolute bg-white shadow rounded p-3" style={{ right: 0, top: "50px", width: "200px", zIndex: 1000 }}>
                                        <p className="mb-1"><strong>{user.name}</strong></p>
                                        <p className="text-muted small mb-2">{user.email}</p>
                                        <button
                                            onClick={() => logout({ returnTo: window.location.origin })}
                                            className="btn btn-outline-dark m-2"
                                        >
                                            <i className="fa fa-sign-out-alt mr-1"></i> Logout
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* ✅ Cart Button: Prevents navigation if not logged in */}
                        <button onClick={handleCartClick} className="btn btn-outline-dark m-2">
                            <i className="fa fa-cart-shopping mr-1"></i> Cart ({cartCount})
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
