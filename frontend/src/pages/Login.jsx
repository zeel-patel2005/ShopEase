import React from "react";
import { Link } from "react-router-dom";
import { Footer, Navbar } from "../components";
import { useAuth0 } from "@auth0/auth0-react";

const Login = () => {

  const { user, loginWithRedirect, isAuthenticated } = useAuth0();
  const { logout } = useAuth0();

  console.log(user)

  return (
    <>
      <Navbar />
      <div className="container my-3 py-3">
        <h1 className="text-center">Login</h1>
        <hr />
        <div className="row my-4 h-100">
          <div className="col-md-4 col-lg-4 col-sm-8 mx-auto">
            <form>
              <div className="my-3">
                <label htmlFor="email">Email address</label>
                <input
                  type="email"
                  className="form-control"
                  id="email"
                  placeholder="name@example.com"
                />
              </div>
              <div className="my-3">
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  className="form-control"
                  id="password"
                  placeholder="Password"
                />
              </div>
              <div className="my-3">
                <p>New Here? <Link to="/register" className="text-decoration-underline text-info">Register</Link></p>
              </div>
              <div className="text-center">
                <button className="my-2 mx-auto btn btn-dark" type="submit" disabled>
                  Login
                </button>
              </div>
              {isAuthenticated && (
                <div>
                  <img src={user.picture} alt={user.name} />
                  <h2>{user.name}</h2>
                  <p>{user.email}</p>
                </div>
              )
              }
              <div className="text-center mt-3">
                {
                  isAuthenticated ? (
                    <button onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}>Logout</button>
                  ): (
                      <button className = "btn btn-light border d-flex align-items-center mx-auto" onClick = { () => loginWithRedirect() }>
                  <img src = "https://m250app.b-cdn.net/assets/oauth/google/logo.png" alt = "Google Logo" width = "20" height = "20" className = "me-2" />
                 With Google
              </button>
                  )
                }
                
              </div>
            </form>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Login;
