import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import api from "../../../config/URL";
import toast from "react-hot-toast";
import { FiAlertTriangle } from "react-icons/fi";

function CountryAdd() {
  const [preview, setPreview] = useState(null);
  const [loadIndicator, setLoadIndicator] = useState(false);
  const navigate = useNavigate();

  const validationSchema = Yup.object({
    country_name: Yup.string().required("Country name is required*"),
    image: Yup.mixed()
      .required("Flag is required*")
      .test(
        "fileFormat",
        "Unsupported file format (Only .jpg, .png, .gif)",
        (value) =>
          value && ["image/jpeg", "image/png", "image/gif"].includes(value.type)
      )
      .test(
        "fileSize",
        "File size must be less than 2MB",
        (value) => value && value.size <= 2 * 1024 * 1024
      ),
    currency_symbol: Yup.string().required("Currency symbol is required*"),
    currency_code: Yup.string().required("Currency code is required*"),
    address: Yup.string().required("Address is required*"),
    phone: Yup.string()
      .min(8, "Phone number must be at least 8 digits*")
      .required("Phone number is required*"),
    email: Yup.string().email("Invalid email").required("Email is required*"),
    color_code: Yup.string().required("Color code is required*"),
    country_code: Yup.string().required("Country code is required*"),
    phone_number_code: Yup.string().required("Phone number code is required*"),
    social_links: Yup.array().of(Yup.string().url("Invalid URL")),
  });

  const formik = useFormik({
    initialValues: {
      country_name: "",
      image: null,
      currency_symbol: "",
      currency_code: "",
      social_links: [""],
      address: "",
      phone: "",
      email: "",
      color_code: "",
      country_code: "",
      phone_number_code: "",
    },
    validationSchema,
    onSubmit: async (values, { resetForm }) => {
      const formData = new FormData();
      Object.keys(values).forEach((key) => {
        if (key === "social_links") {
          formData.append(key, values[key].join(",")); // Join social links as a comma-separated string
        } else {
          formData.append(key, values[key]);
        }
      });

      setLoadIndicator(true);

      try {
        const response = await api.post(`admin/country`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        if (response.status === 201) {
          toast.success(response.data.message);
          navigate("/countries");
          resetForm();
        } else {
          toast.error(response.data.message);
        }
      } catch (error) {
        if (error.response) {
          if (error.response.status === 422) {
            const errors = error.response.data.error;
            if (errors) {
              Object.keys(errors).forEach((key) => {
                errors[key].forEach((errorMsg) => {
                  toast(errorMsg, {
                    icon: <FiAlertTriangle className="text-warning" />,
                  });
                });
              });
            }
          } else {
            toast.error(
              error.response.data.message || "An unexpected error occurred."
            );
          }
        } else {
          toast.error("An unexpected error occurred.");
        }
      } finally {
        setLoadIndicator(false);
      }
    },
  });

  const addSocialLink = () => {
    formik.setFieldValue("social_links", [...formik.values.social_links, ""]);
  };

  const handleSocialLinkChange = (index, value) => {
    const newSocialLinks = [...formik.values.social_links];
    newSocialLinks[index] = value;
    formik.setFieldValue("social_links", newSocialLinks);
  };

  const deleteSocialLink = (index) => {
    const newSocialLinks = formik.values.social_links.filter(
      (_, i) => i !== index
    );
    formik.setFieldValue("social_links", newSocialLinks);
  };

  return (
    <section className="px-4">
      <form onSubmit={formik.handleSubmit}>
        <div className="card shadow border-0 mb-3">
          <div className="row p-3">
            <div className="d-flex justify-content-between align-items-center">
              <h1 className="h4 ls-tight">Add Country</h1>
              <Link to="/countries">
                <button type="button" className="btn btn-light btn-sm">
                  <span>Back</span>
                </button>
              </Link>
            </div>
          </div>
        </div>
        <div className="container card shadow border-0 pb-5 p-3">
          <div className="row mt-3">
            <div className="col-md-4 col-12 mb-3">
              <div className="mb-3">
                <label className="form-label">Country Name</label>
                <input
                  type="text"
                  className="form-control form-control-sm"
                  {...formik.getFieldProps("country_name")}
                />
                {formik.touched.country_name && formik.errors.country_name && (
                  <div className="text-danger">
                    {formik.errors.country_name}
                  </div>
                )}
              </div>
            </div>

            <div className="col-md-4 col-12 mb-3">
              <div className="mb-3">
                <label className="form-label">Phone Code</label>
                <input
                  type="text"
                  className="form-control form-control-sm"
                  {...formik.getFieldProps("phone_number_code")}
                  onInput={(event) => {
                    event.target.value = event.target.value.replace(
                      /[^0-9]/g,
                      ""
                    );
                    formik.setFieldValue(
                      "phone_number_code",
                      event.target.value
                    );
                  }}
                />
                {formik.touched.phone_number_code &&
                  formik.errors.phone_number_code && (
                    <div className="text-danger">
                      {formik.errors.phone_number_code}
                    </div>
                  )}
              </div>
            </div>

            <div className="col-md-4 col-12 mb-3">
              <div className="mb-3">
                <label className="form-label">Phone</label>
                <input
                  type="text"
                  className="form-control form-control-sm"
                  {...formik.getFieldProps("phone")}
                  onInput={(event) => {
                    event.target.value = event.target.value.replace(
                      /[^0-9]/g,
                      ""
                    );
                    formik.setFieldValue("phone", event.target.value);
                  }}
                />
                {formik.touched.phone && formik.errors.phone && (
                  <div className="text-danger">{formik.errors.phone}</div>
                )}
              </div>
            </div>

            <div className="col-md-4 col-12 mb-3">
              <div className="mb-3">
                <label className="form-label">Country Code</label>
                <input
                  type="text"
                  className="form-control form-control-sm"
                  {...formik.getFieldProps("country_code")}
                />
                {formik.touched.country_code && formik.errors.country_code && (
                  <div className="text-danger">
                    {formik.errors.country_code}
                  </div>
                )}
              </div>
            </div>

            <div className="col-md-4 col-12 mb-3">
              <div className="mb-3">
                <label className="form-label">Currency Symbol</label>
                <input
                  type="text"
                  className="form-control form-control-sm"
                  {...formik.getFieldProps("currency_symbol")}
                />
                {formik.touched.currency_symbol &&
                  formik.errors.currency_symbol && (
                    <div className="text-danger">
                      {formik.errors.currency_symbol}
                    </div>
                  )}
              </div>
            </div>

            <div className="col-md-4 col-12 mb-3">
              <div className="mb-3">
                <label className="form-label">Currency Code</label>
                <input
                  type="text"
                  className="form-control form-control-sm"
                  {...formik.getFieldProps("currency_code")}
                />
                {formik.touched.currency_code &&
                  formik.errors.currency_code && (
                    <div className="text-danger">
                      {formik.errors.currency_code}
                    </div>
                  )}
              </div>
            </div>

            <div className="col-md-4 col-12 mb-3">
              <div className="mb-3">
                <label className="form-label">Address</label>
                <input
                  type="text"
                  className="form-control form-control-sm"
                  {...formik.getFieldProps("address")}
                />
                {formik.touched.address && formik.errors.address && (
                  <div className="text-danger">{formik.errors.address}</div>
                )}
              </div>
            </div>

            <div className="col-md-4 col-12 mb-3">
              <div className="mb-3">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  className="form-control form-control-sm"
                  {...formik.getFieldProps("email")}
                />
                {formik.touched.email && formik.errors.email && (
                  <div className="text-danger">{formik.errors.email}</div>
                )}
              </div>
            </div>

            <div className="col-md-4 col-12 mb-3">
              <div className="mb-3">
                <label className="form-label">Color Code</label>
                <div className="d-flex align-items-center">
                  <input
                    type="color"
                    className="form-control form-control-sm me-2"
                    value={formik.values.color_code}
                    onChange={(e) =>
                      formik.setFieldValue("color_code", e.target.value)
                    }
                    style={{ width: "50px", height: "38px", padding: "2px" }}
                  />
                  <input
                    type="text"
                    className="form-control form-control-sm"
                    {...formik.getFieldProps("color_code")}
                  />
                </div>
                {formik.touched.color_code && formik.errors.color_code && (
                  <div className="text-danger">{formik.errors.color_code}</div>
                )}
              </div>
            </div>

            <div className="col-md-6 col-12 mb-3">
              <label className="form-label">Flag</label>
              <input
                type="file"
                accept="image/*"
                className="form-control form-control-sm"
                onChange={(event) => {
                  const file = event.currentTarget.files[0];
                  if (file) {
                    formik.setFieldValue("image", file);
                    setPreview(URL.createObjectURL(file));
                  }
                }}
              />
              {formik.touched.image && formik.errors.image && (
                <div className="text-danger">{formik.errors.image}</div>
              )}

              {preview && (
                <img
                  src={preview}
                  alt="Flag Preview"
                  className="img-fluid mt-2"
                  style={{ maxHeight: "100px" }}
                />
              )}
            </div>

            {formik.values.social_links.map((link, index) => (
              <div className="col-md-6 col-12 mb-3" key={index}>
                <label className="form-label">Social Links</label>
                <div className="mb-2 d-flex align-items-center">
                  <input
                    type="text"
                    className="form-control form-control-sm me-2"
                    value={link}
                    onChange={(e) =>
                      handleSocialLinkChange(index, e.target.value)
                    }
                    placeholder="Enter social link"
                  />
                  <button
                    type="button"
                    className="btn btn-cbg-primary btn-sm"
                    onClick={() => deleteSocialLink(index)}
                  >
                    Delete
                  </button>
                </div>
                {formik.touched.social_links &&
                  formik.errors.social_links &&
                  formik.errors.social_links[index] && (
                    <div className="text-danger">
                      {formik.errors.social_links[index]}
                    </div>
                  )}
              </div>
            ))}

            <div className="d-flex justify-content-end align-items-center">
              <button
                type="button"
                className="btn btn-sm btn-cbg-primary-outline mt-2"
                onClick={addSocialLink}
              >
                Add More
              </button>
            </div>

            <div className="hstack p-2 mt-5">
              <button
                type="submit"
                className="btn btn-sm btn-button"
                disabled={loadIndicator}
              >
                {loadIndicator && (
                  <span
                    className="spinner-border spinner-border-sm me-2"
                    aria-hidden="true"
                  ></span>
                )}
                Submit
              </button>
            </div>
          </div>
        </div>
      </form>
    </section>
  );
}

export default CountryAdd;
