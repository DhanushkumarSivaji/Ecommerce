import React, { Fragment } from "react";
import { Link, withRouter } from "react-router-dom";
import axios from "axios";
import { isAuthenticated } from "../auth/index";
import {API} from '../../config'

// const isActive = path => {
//   if (this.props.location.pathname === path) {
//     return { color: "white" };
//   } else {
//     return { color: "yellow" };
//   }
// };

function Navbar(props) {
  const SignOut = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("jwt");
      localStorage.removeItem('token')
    }
    axios
      .get(`${API}/signout`)
      .then(res => {
        if (res.status === 200) {
          props.history.push("/");
        }
      })
      .catch(err => {
        console.log(err);
      });
  };
  return (
    <div>
      <div>
        <nav className="navbar navbar-expand-lg navbar-light bg-primary">
          <div className="container">
            <Link className="navbar-brand" to="/">
              Home
            </Link>
           
            <button
              className="navbar-toggler"
              type="button"
              data-toggle="collapse"
              data-target="#navbarNav"
              aria-controls="navbarNav"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span className="navbar-toggler-icon" />
            </button>
            <div className="collapse navbar-collapse" id="navbarNav">
              <ul className="navbar-nav ml-auto">

                 <li className="nav-item">
                    <Link className="nav-link" to="/shop">
                      Shop
                    </Link>
                 </li>

                  {isAuthenticated()&&isAuthenticated().user.role===0 && (
                    <li className="nav-item">
                      <Link className="nav-link" to="/user/dashboard">
                        Dashboard
                      </Link>
                    </li>
                  )}

                {isAuthenticated()&&isAuthenticated().user.role===1 && (
                    <li className="nav-item">
                      <Link className="nav-link" to="/admin/dashboard">
                        Dashboard
                      </Link>
                    </li>
                  )}
                  
                {!isAuthenticated() && (
                  <Fragment>
                    <li className="nav-item">
                      <Link className="nav-link" to="/signin">
                        SignIn
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link className="nav-link" to="/signup">
                        SignUp
                      </Link>
                    </li>
                  </Fragment>
                )}
                {isAuthenticated() && (
                  <div>
                    <li className="nav-item">
                      <span
                        className="nav-link"
                        onClick={SignOut}
                        style={{ cursor: "pointer" }}
                      >
                        SignOut
                      </span>
                    </li>
                  </div>
                )}
              </ul>
            </div>
          </div>
        </nav>
      </div>
    </div>
  );
}

export default withRouter(Navbar);
