"use client"

import { useState, useEffect } from "react"
import { Footer, Navbar } from "../components"
import { useSelector } from "react-redux"
import { Link } from "react-router-dom"

const Checkout = () => {
  const state = useSelector((state) => state.handleCart)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [paymentSuccess, setPaymentSuccess] = useState(false)
  const [scriptLoaded, setScriptLoaded] = useState(false)

  // Load Razorpay script
  useEffect(() => {
    const loadRazorpayScript = () => {
      const script = document.createElement("script")
      script.src = "https://checkout.razorpay.com/v1/checkout.js"
      script.async = true
      script.onload = () => {
        setScriptLoaded(true)
        console.log("Razorpay script loaded successfully")
      }
      script.onerror = () => {
        console.error("Failed to load Razorpay script")
        setError("Failed to load payment gateway. Please try again later.")
      }
      document.body.appendChild(script)
    }

    if (!window.Razorpay) {
      loadRazorpayScript()
    } else {
      setScriptLoaded(true)
    }

    return () => {
      // Cleanup if needed
    }
  }, [])

  const EmptyCart = () => {
    return (
      <div className="container">
        <div className="row">
          <div className="col-md-12 py-5 bg-light text-center">
            <h4 className="p-3 display-5">No item in Cart</h4>
            <Link to="/" className="btn btn-outline-dark mx-4">
              <i className="fa fa-arrow-left"></i> Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const ShowCheckout = () => {
    let subtotal = 0
    const shipping = 30.0
    let totalItems = 0

    state.map((item) => {
      return (subtotal += item.price * item.qty)
    })

    state.map((item) => {
      return (totalItems += item.qty)
    })

    // Verify payment with the server
    const verifyPayment = async (response) => {
      try {
        const verificationData = {
          razorpayOrderId: response.razorpay_order_id,
          razorpayPaymentId: response.razorpay_payment_id,
          razorpaySignature: response.razorpay_signature,
        }

        const verificationResponse = await fetch("http://localhost:8080/api/verify-payment", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(verificationData),
        })

        const verificationResult = await verificationResponse.json()

        if (verificationResult.status === "success") {
          setPaymentSuccess(true)
          // Here you would typically redirect to a success page or clear the cart
        } else {
          setError("Payment verification failed. Please try again.")
        }
      } catch (err) {
        console.error("Error verifying payment:", err)
        setError("Error verifying payment. Please contact support.")
      } finally {
        setLoading(false)
      }
    }

    // Handling Razorpay Payment
    const handlePayment = async () => {
      if (!scriptLoaded) {
        setError("Payment gateway is still loading. Please try again in a moment.")
        return
      }

      try {
        setLoading(true)
        setError(null)

        // Call the server to create a Razorpay order
        const response = await fetch("http://localhost:8080/api/create-razorpay-order", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            amount: Math.round(subtotal + shipping),
            currency: "INR",
          }),
        })

        if (!response.ok) {
          throw new Error("Failed to create order")
        }

        const data = await response.json()
        const orderData = JSON.parse(data.orderData)

        // Get Razorpay key from environment or use fallback
        const razorpayKeyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_test_YOUR_TEST_KEY"

        // Initialize Razorpay
        const options = {
          key: razorpayKeyId,
          amount: orderData.amount,
          currency: orderData.currency,
          name: "Your Store Name",
          description: "Order Payment",
          image: "https://your-store-logo-url", // Your logo URL here
          order_id: orderData.id,
          handler: (response) => {
            verifyPayment(response)
          },
          prefill: {
            name: "John Doe", // Add dynamic values for the user here
            email: "johndoe@example.com",
            contact: "+919876543210",
          },
          notes: {
            address: "Razorpay Address",
            is_test: "true",
          },
          theme: {
            color: "#F37254",
          },
          // Enable this for test mode
          modal: {
            ondismiss: () => {
              setLoading(false)
              console.log("Payment modal closed")
            },
          },
          // For testing failed payments
          config: {
            display: {
              blocks: {
                utib: {
                  // Axis Bank Test Cards
                  name: "Test Payment Methods",
                  instruments: [
                    {
                      method: "card",
                      issuers: ["UTIB"],
                    },
                  ],
                },
              },
              sequence: ["block.utib"],
              preferences: {
                show_default_blocks: false,
              },
            },
          },
        }

        const razorpay = new window.Razorpay(options)

        // For testing, you can use these test card details:
        // Card Number: 4111 1111 1111 1111
        // Expiry: Any future date
        // CVV: Any 3 digits
        // Name: Any name

        razorpay.on("payment.failed", (response) => {
          setLoading(false)
          setError(`Payment failed: ${response.error.description}`)
        })

        razorpay.open()
      } catch (error) {
        console.error("Error creating Razorpay order:", error)
        setError("Failed to initialize payment. Please try again.")
        setLoading(false)
      }
    }

    return (
      <>
        <div className="container py-5">
          {paymentSuccess && (
            <div className="alert alert-success" role="alert">
              Payment successful! Thank you for your order.
            </div>
          )}

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
                      Products ({totalItems})<span>${Math.round(subtotal)}</span>
                    </li>
                    <li className="list-group-item d-flex justify-content-between align-items-center px-0">
                      Shipping
                      <span>${shipping}</span>
                    </li>
                    <li className="list-group-item d-flex justify-content-between align-items-center border-0 px-0 mb-3">
                      <div>
                        <strong>Total amount</strong>
                      </div>
                      <span>
                        <strong>${Math.round(subtotal + shipping)}</strong>
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="col-md-7 col-lg-8">
              <div className="card mb-4">
                <div className="card-header py-3">
                  <h4 className="mb-0">Billing address</h4>
                </div>
                <div className="card-body">
                  <form className="needs-validation" noValidate>
                    {/* Your billing address fields here */}
                    <hr className="my-4" />
                    <h4 className="mb-3">Payment</h4>

                    <button
                      className="w-100 btn btn-primary"
                      type="button"
                      onClick={handlePayment}
                      disabled={loading || !scriptLoaded}
                    >
                      {loading ? (
                        <>
                          <span
                            className="spinner-border spinner-border-sm me-2"
                            role="status"
                            aria-hidden="true"
                          ></span>
                          Processing...
                        </>
                      ) : !scriptLoaded ? (
                        "Loading payment gateway..."
                      ) : (
                        "Continue to checkout"
                      )}
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <Navbar />
      <div className="container my-3 py-3">
        <h1 className="text-center">Checkout</h1>
        <hr />
        {state.length ? <ShowCheckout /> : <EmptyCart />}
      </div>
      <Footer />
    </>
  )
}

export default Checkout

