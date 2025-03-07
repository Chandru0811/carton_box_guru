import { useState } from "react";
import { useFormik } from "formik";
import { Form, Button } from "react-bootstrap";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import * as Yup from "yup";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import headerlogo from "../../assets/images/cb_logo.png";
import toast from "react-hot-toast";
import api from "../../config/URL";

const Login = ({ loginAsAdmin }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [loadIndicator, setLoadIndicator] = useState(false);
  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const validationSchema = Yup.object({
    email: Yup.string()
      .email("Invalid email format")
      .required("Email is required"),
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
  });

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      setLoadIndicator(true);
      try {
        const payload =
          values.email === "admin@gmail.com"
            ? { ...values, role: "1" }
            : values;
        const response = await api.post("admin/login", payload);

        if (response.status === 200) {
          const userDetails = response.data.data.userDetails;

          if (userDetails.role === "1") {
            toast.success(response.data.message);
            loginAsAdmin(values);
            localStorage.setItem(
              "carton_box_guru_token",
              response.data.data.token
            );
            localStorage.setItem("carton_box_guru_name", userDetails.name);
            localStorage.setItem("carton_box_guru_id", userDetails.id);
            localStorage.setItem("carton_box_guru_email", userDetails.email);
            localStorage.setItem("carton_box_guru_role", userDetails.role);
            localStorage.setItem("carton_box_guru_active", userDetails.active);
            localStorage.setItem(
              "carton_box_guru_shop_id",
              userDetails.shop_id
            );
            navigate("/");
          } else {
            toast.error("You are not a Vendor");
          }
        } else {
          toast.error(response.data.message);
        }
      } catch {
        toast.error("Login failed. Invalid Email or Password.");
      } finally {
        setLoadIndicator(false);
      }
    },
  });

  return (
    <div
      className="container-fluid m-0 vh-100"
      style={{ minHeight: "fit-content", backgroundColor: "#cd8245" }}
    >
      <div
        className="d-flex justify-content-center align-items-center pt-5"
        style={{ backgroundColor: "#cd8245" }}
      >
        <img
          src={headerlogo}
          className="img-fluid mt-5"
          alt="Logo"
          style={{ height: "70px" }}
        />
      </div>
      <div className="d-flex justify-content-center align-items-center mt-5">
        <div
          className="card shadow-lg p-3 mb-5 rounded"
          style={{ width: "100%", maxWidth: "400px" }}
        >
          <h3
            className="text-center py-2"
            style={{ borderBottom: "2px solid #cd8245", color: "#cd8245" }}
          >
            Login
          </h3>
          <Form onSubmit={formik.handleSubmit}>
            <Form.Group controlId="formEmail" className="mb-3 pt-4">
              <Form.Label>Email Address</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email"
                {...formik.getFieldProps("email")}
                isInvalid={formik.touched.email && !!formik.errors.email}
              />
              <Form.Control.Feedback type="invalid">
                {formik.errors.email}
              </Form.Control.Feedback>
            </Form.Group>

            <div className="d-flex justify-content-between align-items-center py-2">
              <Form.Label>Password</Form.Label>
            </div>
            <Form.Group controlId="formPassword" className="mb-3">
              <div style={{ position: "relative" }}>
                <Form.Control
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter password"
                  {...formik.getFieldProps("password")}
                  isInvalid={
                    formik.touched.password && !!formik.errors.password
                  }
                />
                {formik.values.password && (
                  <span
                    onClick={togglePasswordVisibility}
                    style={{
                      position: "absolute",
                      right: "10px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      cursor: "pointer",
                    }}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </span>
                )}
                <Form.Control.Feedback type="invalid">
                  {formik.errors.password}
                </Form.Control.Feedback>
              </div>
            </Form.Group>

            <Button
              type="submit"
              className="w-100 mt-4 border-0"
              style={{ backgroundColor: "#cd8245" }}
              disabled={loadIndicator}
            >
              {loadIndicator && (
                <span
                  className="spinner-border spinner-border-sm me-2"
                  aria-hidden="true"
                ></span>
              )}
              Login
            </Button>
          </Form>
        </div>
      </div>
    </div>
  );
};

Login.propTypes = {
  loginAsAdmin: PropTypes.func.isRequired,
};

export default Login;
