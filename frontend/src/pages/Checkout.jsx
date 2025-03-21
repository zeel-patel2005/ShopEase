"use client"

import { useState, useEffect } from "react"
import { Footer, Navbar } from "../components"
import { useSelector, useDispatch } from "react-redux"
import { useLocation, Link } from "react-router-dom"
import { useAuth0 } from "@auth0/auth0-react"
import axios from "axios"

const Checkout = () => {
  const state = useSelector((state) => state.handleCart)
  const dispatch = useDispatch()
  const location = useLocation()
  const { user, isAuthenticated } = useAuth0()
  const [cartData, setCartData] = useState(location.state?.cartItems || [])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [scriptLoaded, setScriptLoaded] = useState(false)
  const [paymentSuccess, setPaymentSuccess] = useState(false)

  useEffect(() => {
    if (state.length > 0) {
      setCartData(state)
    } else if (cartData.length === 0 && user?.email && isAuthenticated) {
      const fetchCartItems = async () => {
        try {
          const response = await axios.get("http://localhost:8080/cart/allcartitem", {
            params: { email: user.email },
          })
          setCartData(response.data)
        } catch (error) {
          console.error("Error fetching cart:", error)
        }
      }
      fetchCartItems()
    }
  }, [state, user, isAuthenticated])

  useEffect(() => {
    const script = document.createElement("script")
    script.src = "https://checkout.razorpay.com/v1/checkout.js"
    script.async = true
    script.onload = () => setScriptLoaded(true)
    document.body.appendChild(script)
  }, [])

  // Function to clear cart items
  const clearCart = async () => {
    try {
      if (user?.email && isAuthenticated) {
        // Clear cart in the database
        await axios.delete("http://localhost:8080/cart/clearcart", {
          params: { email: user.email },
        })
      }
      // Clear cart in Redux store
      if (dispatch) {
        // Assuming you have an action to clear the cart
        dispatch({ type: "CLEAR_CART" })
      }
      // Clear local state
      setCartData([])
    } catch (error) {
      console.error("Error clearing cart:", error)
    }
  }

  const handlePayment = async () => {
    if (!scriptLoaded) {
      setError("Payment gateway is still loading. Please try again.")
      return
    }

    try {
      setLoading(true)
      setError(null)

      const { data } = await axios.post("http://localhost:8080/api/create-razorpay-order", {
        amount: cartData.reduce((sum, item) => sum + item.product.price * item.quantity, 0) * 100,
        currency: "INR",
        receipt: `order_${Date.now()}`,
      })

    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_test_QxyrmX1GnoDsRg",
      amount: data.amount,
      currency: data.currency,
      name: "ShopEase",
      order_id: data.id,
      handler: async (response) => {
        try {
          await axios.post("http://localhost:8080/api/verify-payment", {
            razorpayOrderId: response.razorpay_order_id,
            razorpayPaymentId: response.razorpay_payment_id,
            razorpaySignature: response.razorpay_signature,
          })

          // After successful payment verification, clear the cart
          await clearCart()

          alert("Payment Successful!")
          setPaymentSuccess(true)
          setLoading(false)
        } catch {
          alert("Payment verification failed!")
          setLoading(false)
        }
      },
    }

    const razorpay = new window.Razorpay(options)
    razorpay.open()
  } catch (error) {
    setError("Payment failed. Try again.")
    setLoading(false)
  }
}

const EmptyCart = () => (
  <div className="container">
    <div className="row">
      <div className="col-md-12 py-5 bg-light text-center">
        <h4 className="p-3 display-5">No items in Cart</h4>
        <Link to="/" className="btn btn-outline-dark mx-4">
          <i className="fa fa-arrow-left"></i> Continue Shopping
        </Link>
      </div>
    </div>
  </div>
)

const ShowCheckout = () => {
  const subtotal = cartData.reduce((sum, item) => sum + item.product.price * item.quantity, 0)
  const shipping = 30.0
  const totalItems = cartData.reduce((sum, item) => sum + item.quantity, 0)

  // If payment is successful, show success message and back to products link
  if (paymentSuccess) {
    return (
      <div className="container py-5">
        <div className="row my-4">
          <div className="col-md-12 text-center">
            <div className="card p-5">
              <div className="card-body">
                <i className="fa fa-check-circle text-success" style={{ fontSize: "5rem" }}></i>
                <h2 className="my-4 text-success">Payment Successful!</h2>
                <p className="mb-4">Thank you for your purchase. Your order has been processed successfully.</p>
                <Link to="/" className="btn btn-primary">
                  <i className="fa fa-arrow-left me-2"></i>Back to Products
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container py-5">
      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      <div className="row my-4">
        <div className="col-md-5 col-lg-4 order-md-last">
          <div className="card mb-4">
            <div className="card-header py-3 bg-light">
              <h5 className="mb-0">Order Summary</h5>
            </div>
            <div className="card-body">
              <ul className="list-group list-group-flush">
                <li className="list-group-item d-flex justify-content-between align-items-center border-0 px-0 pb-0">
                  Products ({totalItems}){" "}
                  <span>
                    {"\u20B9"}
                    {Math.round(subtotal)}
                  </span>
                </li>
                <li className="list-group-item d-flex justify-content-between align-items-center px-0">
                  Shipping{" "}
                  <span>
                    {"\u20B9"}
                    {shipping}
                  </span>
                </li>
                <li className="list-group-item d-flex justify-content-between align-items-center border-0 px-0 mb-3">
                  <div>
                    <strong>Total amount</strong>
                  </div>
                  <span>
                    <strong>
                      {"\u20B9"}
                      {Math.round(subtotal + shipping)}
                    </strong>
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="col-md-7 col-lg-8">
          <div className="card mb-4">
            <div className="card-header py-3">
              <h4 className="mb-0">Billing Information</h4>
            </div>
            <div className="card-body">
              <form className="needs-validation" noValidate>
                <h4 className="mb-3">Payment</h4>
                <button
                  className="w-100 btn btn-primary"
                  type="button"
                  onClick={handlePayment}
                  disabled={loading || !scriptLoaded}
                >
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Processing...
                    </>
                  ) : !scriptLoaded ? (
                    "Loading payment gateway..."
                  ) : (
                    "Proceed to Payment"
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

return (
  <>
    <Navbar />
    <div className="container my-3 py-3">
      <h1 className="text-center">Checkout</h1>
      <hr />
      {cartData.length > 0 ? <ShowCheckout /> : <EmptyCart />}
    </div>
    <Footer />
  </>
)
}

export default Checkout
