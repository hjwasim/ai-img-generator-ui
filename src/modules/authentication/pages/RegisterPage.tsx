import { useState } from "react";
import { FieldValues, useForm } from "react-hook-form";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { instance } from "../../../config,axios";
import { toast } from "react-toastify";

const RegisterPage = () => {

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    watch,
    handleSubmit,
    formState: { errors, isSubmitted },
  } = useForm();

  const onSubmit = (data: FieldValues) => {
    const { email, username, password } = data;

    instance
      .post("/auth/register", { email, username, password })
      .then((response) => {

        toast.success(response.data.msg, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: false,
          draggable: true,
          progress: undefined,
          theme: "light",
        })

        navigate("/login");
      })
      .catch((error) => {
        (() =>
          toast.error(error.response.data.msg, {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: false,
            pauseOnHover: false,
            draggable: true,
            progress: undefined,
            theme: "light",
          }))();
      });
  };

  const password = watch("password");

  return (
    <div className="container">
      <div className="row justify-content-center auth-card h-100">
        <div className="col-5 my-auto">
          <div className="card p-3">
            <div className="card-body">
              <div className="d-flex align-items-center justify-content-center mb-3">
                <p className="auth-title mb-0 text-center">Register</p>
              </div>
              <hr />
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="row gy-3">
                  <div className="col-xl-12">
                    <label
                      htmlFor="register-username"
                      className="form-label text-default"
                    >
                      Username
                    </label>
                    <input
                      type="text"
                      {...register("username", { required: true })}
                      className="form-control form-control"
                      id="register-username"
                      placeholder="Enter Username"
                    ></input>
                  </div>
                  <div className="col-xl-12">
                    <label
                      htmlFor="register-username"
                      className="form-label text-default"
                    >
                      Email
                    </label>
                    <input
                      type="text"
                      className="form-control form-control"
                      id="register-email"
                      {...register("email", {
                        required: true,
                        pattern: {
                          value:
                            /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                          message: "Enter a valid email address",
                        },
                      })}
                      placeholder="Enter Email"
                    ></input>
                    {isSubmitted && errors.email && (
                      <p>{errors.email.message}</p>
                    )}
                  </div>
                  <div className="col-xl-12">
                    <label
                      htmlFor="register-password"
                      className="form-label text-default"
                    >
                      Password
                    </label>
                    <div className="position-relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        className="form-control form-control"
                        id="register-password"
                        {...register("password", { required: true })}
                        placeholder="Enter Password"
                      ></input>
                      <a
                        className="show-password-button"
                        onClick={() => setShowPassword((prev) => !prev)}
                      >
                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                      </a>
                    </div>
                  </div>
                  <div className="col-xl-12">
                    <label
                      htmlFor="register-cpassword"
                      className="form-label text-default"
                    >
                      Confirm Password
                    </label>
                    <div className="position-relative">
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        className="form-control form-control"
                        id="register-cpassword"
                        {...register("cpassword", {
                          required: true,
                          validate: (value) =>
                            value === password || "Password doesnt match",
                        })}
                        placeholder="Enter Confirm Password"
                      ></input>
                      <a
                        className="show-password-button"
                        onClick={() => setShowConfirmPassword((prev) => !prev)}
                      >
                        {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                      </a>
                      {isSubmitted && errors.cpassword && (
                        <p>{errors.cpassword.message}</p>
                      )}
                    </div>
                  </div>
                </div>
                <div className="d-grid mt-4">
                  <button type="submit" className="btn btn-primary">
                    Create Account
                  </button>
                </div>
              </form>
              <div className="text-center mb-0">
                <p className="text-muted mt-3  mb-0">
                  Already have an account?
                  <Link to="/login" className="text-primary">
                    Login
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
