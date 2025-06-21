import React, { useEffect, useState } from "react";
import { Footer, Navbar } from "../components";
import { useDispatch } from "react-redux";
import { addCart, delCart } from "../redux/action";
import { Link } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import axios from "axios";

const Cart = () => {
  const dispatch = useDispatch();
  const { user,isAuthenticated } = useAuth0();
  const [cartData, setCartData] = useState([]);

  useEffect(() => {
    const fetchCartItems = async () => {
      if (user.email && isAuthenticated) {
        try {
          const response = await axios.get(`http://15.206.163.163:8080/cart/allcartitem`, {
            params: { email: user.email }, // Query parameter
          });
          setCartData(response.data);
          console.log(response.data);
        } catch (error) {
          console.error("Error fetching cart:", error);
        }
      }
    };

    fetchCartItems();
  }, [user.email, isAuthenticated]); // Include isAuthenticated in dependencies


  const addItem = async (item) => {
    try {
      const response = await axios.post("http://15.206.163.163:8080/product/plus", {
        email: user.email,
        productId: item.product.id, // Send product ID
      });

      if (response.status === 200) {
        setCartData((prevCart) =>
          prevCart.map((cartItem) =>
            cartItem.id === item.id ? { ...cartItem, quantity: cartItem.quantity + 1 } : cartItem
          )
        );
      }
    } catch (error) {
      console.error("Error adding item to cart:", error);
    }
  };

  const removeItem = async (item) => {
    try {
      const response = await axios.post("http://15.206.163.163:8080/product/remove", {
        email: user.email,
        productId: item.product.id,
      });

      if (response.status === 200) {
        setCartData((prevCart) =>
          prevCart
            .map((cartItem) =>
              cartItem.id === item.id ? { ...cartItem, quantity: cartItem.quantity - 1 } : cartItem
            )
            .filter((cartItem) => cartItem.quantity > 0) // Remove item if quantity reaches 0
        );
      }
    } catch (error) {
      console.error("Error removing item from cart:", error);
    }
  };

  const EmptyCart = () => (
    <div className="container">
      <div className="row">
        <div className="col-md-12 py-5 bg-light text-center">
          <h4 className="p-3 display-5">Your Cart is Empty</h4>
          <Link to="/" className="btn btn-outline-dark mx-4">
            <i className="fa fa-arrow-left"></i> Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );

  const ShowCart = () => {
    let subtotal = cartData.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
    let shipping = 30.0;
    let totalItems = cartData.reduce((sum, item) => sum + item.quantity, 0);

    return (
      <section className="h-100 gradient-custom">
        <div className="container py-5">
          <div className="row d-flex justify-content-center my-4">
            <div className="col-md-8">
              <div className="card mb-4">
                <div className="card-header py-3">
                  <h5 className="mb-0">Item List</h5>
                </div>
                <div className="card-body">
                  {cartData.map((item) => (
                    <div key={item.id}>
                      <div className="row d-flex align-items-center">
                        <div className="col-lg-3 col-md-12">
                          <img src={item.product.image} alt={item.product.title} width={100} height={75} />
                        </div>
                        <div className="col-lg-5 col-md-6">
                          <p><strong>{item.product.title}</strong></p>
                        </div>
                        <div className="col-lg-4 col-md-6">
                          <div className="d-flex mb-4" style={{ maxWidth: "300px" }}>
                            <button className="btn px-3" onClick={() => removeItem(item)}>
                              <i className="fas fa-minus"></i>
                            </button>
                            <p className="mx-5">{item.quantity}</p>
                            <button className="btn px-3" onClick={() => addItem(item)}>
                              <i className="fas fa-plus"></i>
                            </button>
                          </div>
                          <p className="text-start text-md-center">
                            <strong>{item.quantity} x {'\u20B9'}{item.product.price}</strong>
                          </p>
                        </div>
                      </div>
                      <hr className="my-4" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card mb-4">
                <div className="card-header py-3 bg-light">
                  <h5 className="mb-0">Order Summary</h5>
                </div>
                <div className="card-body">
                  <ul className="list-group list-group-flush">
                    <li className="list-group-item d-flex justify-content-between align-items-center border-0 px-0 pb-0">
                      Products ({totalItems}) <span>{'\u20B9'}{Math.round(subtotal)}</span>
                    </li>
                    <li className="list-group-item d-flex justify-content-between align-items-center px-0">
                      Shipping <span>{'\u20B9'}{shipping}</span>
                    </li>
                    <li className="list-group-item d-flex justify-content-between align-items-center border-0 px-0 mb-3">
                      <div><strong>Total amount</strong></div>
                      <span><strong>{'\u20B9'}{Math.round(subtotal + shipping)}</strong></span>
                    </li>
                  </ul>
                  <Link to="/checkout" className="btn btn-dark btn-lg btn-block">
                    Go to checkout
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  };


  return (
    <>
      <Navbar />
      <div className="container my-3 py-3">
        <h1 className="text-center">Cart</h1>
        <hr />
        {cartData.length > 0 ? <ShowCart /> : <EmptyCart />}
      </div>
      <Footer />
    </>
  );
};

export default Cart;
