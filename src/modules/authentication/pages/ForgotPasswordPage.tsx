import React from "react";
import { FaEye } from "react-icons/fa";

const ForgotPasswordPage = () => {
  return (
    <div className="container">
      <div className="row justify-content-center auth-card h-100">
        <div className="col-5 my-auto">
          <div className="card p-3">
            <div className="card-body">
              <div className="d-flex align-items-center justify-content-center mb-3">
                <p className="auth-title mb-0 text-center">Change Password</p>
              </div>
              <hr />
              <form>
                <div className="row gy-3">
                  <div className="col-xl-12">
                    <label htmlFor="register-username" className="form-label text-default">
                      Current Password
                    </label>
                    <input
                      type="password"
                      className="form-control form-control"
                      id="register-username"
                      placeholder="Enter Current Password"
                    ></input>
                  </div>
                  <div className="col-xl-12">
                    <label htmlFor="register-password" className="d-block form-label text-default">
                      New Password
                    </label>
                    <div className="position-relative">
                      <input
                        type="password"
                        className="form-control form-control"
                        id="register-password"
                        placeholder="Enter New Password"
                      ></input>
                      <a className="show-password-button">
                        <FaEye />
                      </a>
                    </div>
                  </div>
                  <div className="col-xl-12">
                    <label htmlFor="register-password" className="d-block form-label text-default">
                      Confirm New Password
                    </label>
                    <div className="position-relative">
                      <input
                        type="password"
                        className="form-control form-control"
                        id="register-password"
                        placeholder="Enter Confirm Password"
                      ></input>
                      <a className="show-password-button">
                        <FaEye />
                      </a>
                    </div>
                  </div>
                </div>
                <div className="d-grid mt-4">
                  <button type="submit" className="btn btn-primary">
                    Continue
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
