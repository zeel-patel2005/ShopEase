import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { addCart } from "../redux/action";
import axios from "axios";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth0 } from "@auth0/auth0-react";

const Products = () => {
  const [data, setData] = useState([]);
  const [filter, setFilter] = useState([]);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const { user, isAuthenticated } = useAuth0(); // Get user details

  const addProduct = async (product) => {
    try {
      const response = await axios.post("http://localhost:8080/cart/add", null, {
        params: {
          userEmail: user.email,
          productId: product.id,
          quantity: 1,
        },
      });

      console.log("Response:", response);

      if (response.status === 201) {
        toast.success("Added to cart!");
      } else if (response.data === "Item already in cart") {
        toast.error("Item already in cart!");
      } else if (response.data === "Product not found") {
        toast.error("Product not found!");
      } else {
        toast.error("Unexpected response!");
      }
    } catch (error) {
      console.error("Error:", error.response ? error.response.data : error.message);
    }
  };

  useEffect(() => {
    let isMounted = true; // Track component mount state

    const getProducts = async () => {
      try {
        setLoading(true);
        const response = await axios.get("http://localhost:8080/product/getallproduct");

        if (isMounted) {
          setData(response.data); // Axios stores response in `response.data`
          setFilter(response.data);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    getProducts();

    return () => {
      isMounted = false; // Cleanup function
    };
  }, []);

  const Loading = () => (
    <div className="row">
      {[...Array(6)].map((_, index) => (
        <div key={index} className="col-md-4 col-sm-6 col-xs-8 col-12 mb-4">
          <Skeleton height={592} />
        </div>
      ))}
    </div>
  );

  const filterProduct = (cat) => {
    const updatedList = data.filter((item) => item.category === cat);
    setFilter(updatedList);
  };

  const ShowProducts = () => {
    return (
      <>
        <div className="buttons text-center py-5">
          <button className="btn btn-outline-dark btn-sm m-2" onClick={() => setFilter(data)}>All</button>
          <button className="btn btn-outline-dark btn-sm m-2" onClick={() => filterProduct("men's clothing")}>Men's Clothing</button>
          <button className="btn btn-outline-dark btn-sm m-2" onClick={() => filterProduct("women's clothing")}>Women's Clothing</button>
          <button className="btn btn-outline-dark btn-sm m-2" onClick={() => filterProduct("jewelery")}>Jewelry</button>
          <button className="btn btn-outline-dark btn-sm m-2" onClick={() => filterProduct("electronics")}>Electronics</button>
        </div>

        <div className="row">
          {filter.map((product,index) => {
          

            return (
              <div key={product.id || index} className="col-md-4 col-sm-6 col-xs-8 col-12 mb-4">
                <div className="card text-center h-100">
                  <img className="card-img-top p-3" src={product.image || "default-image.jpg"} alt={product.title || "No Title"} height={300} />
                  <div className="card-body">
                    <h5 className="card-title">
                      {product.title ? product.title.substring(0, 12) + "..." : "No Title"}
                    </h5>
                    <p className="card-text">
                      {product.description ? product.description.substring(0, 90) + "..." : "No Description Available"}
                    </p>
                  </div>
                  <ul className="list-group list-group-flush">
                    <li className="list-group-item lead">$ {product.price || "N/A"}</li>
                  </ul>
                  <div className="card-body">
                    {/* Buy Now Button - Prevents Unauthorized Access */}
                    <Link
                      to={isAuthenticated ? `/product/${product.id}` : "#"}
                      className="btn btn-dark m-1"
                      onClick={(e) => {
                        if (!isAuthenticated) {
                          e.preventDefault(); // Prevents navigation
                          toast.error("Please log in to purchase this product.");
                        }
                      }}
                    >
                      Buy Now
                    </Link>

                    {/* Add to Cart Button - Requires Login */}
                    <button
                      className="btn btn-dark m-1"
                      onClick={() => {
                        if (!isAuthenticated) {
                          toast.error("Please log in to add items to the cart.");
                          return;
                        }
                        toast.success("Added to cart");
                        addProduct(product);
                      }}
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </>
    );
  };


  return (
    <div className="container my-3 py-3">
      <div className="row">
        <div className="col-12">
          <h2 className="display-5 text-center">Latest Products</h2>
          <hr />
        </div>
      </div>
      <div className="row justify-content-center">{loading ? <Loading /> : <ShowProducts />}</div>
    </div>
  );
};

export default Products;
