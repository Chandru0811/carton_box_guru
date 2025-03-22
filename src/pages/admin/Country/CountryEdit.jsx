import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import api from "../../../config/URL";
import toast from "react-hot-toast";
import ImageURL from "../../../config/ImageURL";

function CountryEdit() {
  const { id } = useParams();
  const [loadIndicator, setLoadIndicator] = useState(false);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const validationSchema = Yup.object({
    country_name: Yup.string().required("Country name is required*"),
    flag: Yup.mixed()
      .test(
        "fileFormat",
        "Unsupported file format (Only .jpg, .png, .gif)",
        (value) =>
          !value ||
          (value instanceof File &&
            ["image/jpeg", "image/png", "image/gif"].includes(value.type))
      )
      .test(
        "fileSize",
        "File size must be less than 2MB",
        (value) =>
          !value || (value instanceof File && value.size <= 2 * 1024 * 1024)
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
    social_links: Yup.array().of(
      Yup.object().shape({
        s_icon: Yup.string().required("Icon is required*"),
        s_link: Yup.string().url("Invalid URL").required("Link is required*"),
      })
    ),
  });

  const formik = useFormik({
    initialValues: {
      country_name: "",
      flag: null,
      currency_symbol: "",
      currency_code: "",
      social_links: [{ s_icon: "", s_link: "" }],
      address: "",
      phone: "",
      email: "",
      color_code: "",
      country_code: "",
      phone_number_code: "",
      default: false,
    },
    validationSchema,
    onSubmit: async (values) => {
      setLoading(true);
      const formData = new FormData();
      formData.append("_method", "PUT");

      // Append all fields to formData
      Object.keys(values).forEach((key) => {
        if (key === "flag" && values.flag instanceof File) {
          formData.append("flag", values.flag);
        } else if (key === "social_links") {
          formData.append(key, JSON.stringify(values[key]));
        } else if (key === "default") {
          formData.append(key, values[key] ? "1" : "0");
        } else if (values[key] !== undefined && values[key] !== null) {
          formData.append(key, values[key]);
        }
      });

      setLoadIndicator(true);
      try {
        const response = await api.post(
          `admin/country/update/${id}`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        toast.success(response.data.message);
        navigate("/countries");
      } catch (error) {
        const errorMessage =
          error.response?.data?.message || "An error occurred";
        toast.error(errorMessage);
      } finally {
        setLoadIndicator(false);
        setLoading(false);
      }
    },
  });

  const addSocialLink = () => {
    formik.setFieldValue("social_links", [
      ...formik.values.social_links,
      { s_icon: "", s_link: "" },
    ]);
  };

  const handleSocialLinkChange = (index, field, value) => {
    const newSocialLinks = [...formik.values.social_links];
    newSocialLinks[index][field] = value;
    formik.setFieldValue("social_links", newSocialLinks);
  };

  const deleteSocialLink = (index) => {
    const newSocialLinks = formik.values.social_links.filter(
      (_, i) => i !== index
    );
    formik.setFieldValue("social_links", newSocialLinks);
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await api.get(`admin/country/${id}`);
        const data = response.data.data;

        // Initialize social_links as an array of objects
        let socialLinksArray = [];
        if (typeof data.social_links === "string") {
          try {
            socialLinksArray = JSON.parse(data.social_links);
          } catch (error) {
            console.error("Error parsing social_links:", error);
            socialLinksArray = [{ s_icon: "", s_link: "" }];
          }
        } else if (Array.isArray(data.social_links)) {
          socialLinksArray = data.social_links;
        } else {
          socialLinksArray = [{ s_icon: "", s_link: "" }];
        }

        formik.setValues({
          country_name: data.country_name || "",
          image: null,
          currency_symbol: data.currency_symbol || "",
          currency_code: data.currency_code || "",
          social_links: socialLinksArray,
          address: data.address || "",
          phone: data.phone || "",
          email: data.email || "",
          color_code: data.color_code || "",
          country_code: data.country_code || "",
          phone_number_code: data.phone_number_code || "",
          default: data.default || false,
        });

        if (data.flag) {
          setPreview(data.flag ? `${ImageURL}${data.flag}` : data.flag);
        }
      } catch (error) {
        toast.error(error.response?.data?.message || "Error Fetching Data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  return (
    <section className="px-4">
      <form onSubmit={formik.handleSubmit}>
        <div className="card shadow border-0 mb-3">
          <div className="row p-3">
            <div className="d-flex justify-content-between align-items-center">
              <h1 className="h4 ls-tight">Edit Country</h1>
              <Link to="/countries">
                <button type="button" className="btn btn-light btn-sm">
                  <span>Back</span>
                </button>
              </Link>
            </div>
          </div>
        </div>
        <div className="container card shadow border-0 pb-5 p-3">
          {loading ? (
            <div className="loader-container">
              <div className="loader">
                <svg viewBox="0 0 80 80">
                  <circle cx="40" cy="40" r="32"></circle>
                </svg>
              </div>
            </div>
          ) : (
            <div className="row mt-3">
              <div className="col-md-4 col-12 mb-3">
                <div className="mb-3">
                  <label className="form-label">Country Name</label>
                  <input
                    type="text"
                    className="form-control form-control-sm"
                    {...formik.getFieldProps("country_name")}
                  />
                  {formik.touched.country_name && formik.errors.country_name ? (
                    <div className="text-danger">
                      {formik.errors.country_name}
                    </div>
                  ) : null}
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
                  formik.errors.phone_number_code ? (
                    <div className="text-danger">
                      {formik.errors.phone_number_code}
                    </div>
                  ) : null}
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
                  {formik.touched.phone && formik.errors.phone ? (
                    <div className="text-danger">{formik.errors.phone}</div>
                  ) : null}
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
                  {formik.touched.country_code && formik.errors.country_code ? (
                    <div className="text-danger">
                      {formik.errors.country_code}
                    </div>
                  ) : null}
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
                  formik.errors.currency_symbol ? (
                    <div className="text-danger">
                      {formik.errors.currency_symbol}
                    </div>
                  ) : null}
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
                  formik.errors.currency_code ? (
                    <div className="text-danger">
                      {formik.errors.currency_code}
                    </div>
                  ) : null}
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
                  {formik.touched.address && formik.errors.address ? (
                    <div className="text-danger">{formik.errors.address}</div>
                  ) : null}
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
                  {formik.touched.email && formik.errors.email ? (
                    <div className="text-danger">{formik.errors.email}</div>
                  ) : null}
                </div>
              </div>

              <div className="col-md-4 col-12 mb-3">
                <div className="mb-3">
                  <label className="form-label">Color Code</label>
                  <div className="d-flex align-items-center">
                    <input
                      type="color"
                      className="form-control form-control-sm form-control form-control-sm-sm me-2"
                      value={formik.values.color_code}
                      onChange={(e) =>
                        formik.setFieldValue("color_code", e.target.value)
                      }
                      style={{ width: "50px", height: "38px", padding: "2px" }}
                    />
                    <input
                      type="text"
                      className="form-control form-control-sm form-control form-control-sm-sm"
                      {...formik.getFieldProps("color_code")}
                    />
                  </div>
                  {formik.touched.color_code && formik.errors.color_code ? (
                    <div className="text-danger">
                      {formik.errors.color_code}
                    </div>
                  ) : null}
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
                      formik.setFieldValue("flag", file);
                      setPreview(URL.createObjectURL(file)); // Set preview for the new file
                    }
                  }}
                />
                {formik.touched.flag && formik.errors.flag && (
                  <div className="text-danger">{formik.errors.flag}</div>
                )}

                {/* Display preview */}
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
                      value={link.s_icon}
                      onChange={(e) =>
                        handleSocialLinkChange(index, "s_icon", e.target.value)
                      }
                      placeholder="Enter icon (e.g., fa-solid fa-user)"
                    />
                    <input
                      type="text"
                      className="form-control form-control-sm me-2"
                      value={link.s_link}
                      onChange={(e) =>
                        handleSocialLinkChange(index, "s_link", e.target.value)
                      }
                      placeholder="Enter social link (e.g., https://www.youtube.com)"
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
                        {formik.errors.social_links[index].s_icon ||
                          formik.errors.social_links[index].s_link}
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

              <div className="hstack d-flex justify-content-between p-2 mt-5">
                <div className="my-3">
                  <div className="form-check">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      id="default"
                      checked={formik.values.default}
                      onChange={(e) =>
                        formik.setFieldValue("default", e.target.checked)
                      }
                    />
                    <label className="form-check-label" htmlFor="default">
                      Set as Default Country
                    </label>
                  </div>
                </div>
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
                  Update
                </button>
              </div>
            </div>
          )}
        </div>
      </form>
    </section>
  );
}

export default CountryEdit;
