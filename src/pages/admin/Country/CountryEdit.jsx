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
    social_links: Yup.string().url("Invalid URL"),
    address: Yup.string().required("Address is required*"),
    phone: Yup.string().required("Phone number is required*"),
    email: Yup.string().email("Invalid email").required("Email is required*"),
    color_code: Yup.string().required("Color code is required*"),
    country_code: Yup.string().required("Country code is required*"),
  });

  const formik = useFormik({
    initialValues: {
      country_name: "",
      flag: null,
      currency_symbol: "",
      currency_code: "",
      social_links: "",
      address: "",
      phone: "",
      email: "",
      color_code: "",
      country_code: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      setLoading(true);
      const formData = new FormData();
      formData.append("_method", "PUT");
      Object.keys(values).forEach((key) => {
        if (key === "flag" && !values.flag) return;
        formData.append(key, values[key]);
      });
      setLoadIndicator(true);
      try {
        const response = await api.post(`country/update/${id}`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        toast.success(response.data.message);
        navigate("/countries");
      } catch (error) {
        toast.error(error.response?.data?.message || "An error occurred");
      } finally {
        setLoading(false);
      }
    },
  });

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await api.get(`country/${id}`);
        const data = response.data.data;

        formik.setValues({
          country_name: data.country_name || "",
          flag: null,
          currency_symbol: data.currency_symbol || "",
          currency_code: data.currency_code || "",
          social_links: data.social_links || "",
          address: data.address || "",
          phone: data.phone || "",
          email: data.email || "",
          color_code: data.color_code || "",
          country_code: data.country_code || "",
        });

        if (data.flag_path) {
          setPreview(`${ImageURL}${data.flag_path}`);
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
              <div className="col-md-6 col-12 mb-3">
                <div className="mb-3">
                  <label className="form-label">Country Name</label>
                  <input
                    type="text"
                    className="form-control"
                    {...formik.getFieldProps("country_name")}
                  />
                  {formik.touched.country_name && formik.errors.country_name ? (
                    <div className="text-danger">
                      {formik.errors.country_name}
                    </div>
                  ) : null}
                </div>
              </div>
              <div className="col-md-6 col-12 mb-3">
                <label className="form-label">Flag</label>
                <input
                  type="file"
                  accept="image/*"
                  className="form-control"
                  onChange={(event) => {
                    const file = event.currentTarget.files[0];
                    formik.setFieldValue("flag", file);
                    setPreview(URL.createObjectURL(file)); // Set image preview
                  }}
                />
                {formik.touched.flag && formik.errors.flag && (
                  <div className="text-danger">{formik.errors.flag}</div>
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
              <div className="col-md-6 col-12 mb-3">
                <div className="mb-3">
                  <label className="form-label">Currency Symbol</label>
                  <input
                    type="text"
                    className="form-control"
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

              <div className="col-md-6 col-12 mb-3">
                <div className="mb-3">
                  <label className="form-label">Currency Code</label>
                  <input
                    type="text"
                    className="form-control"
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

              <div className="col-md-6 col-12 mb-3">
                <div className="mb-3">
                  <label className="form-label">Social Links</label>
                  <input
                    type="text"
                    className="form-control"
                    {...formik.getFieldProps("social_links")}
                  />
                  {formik.touched.social_links && formik.errors.social_links ? (
                    <div className="text-danger">
                      {formik.errors.social_links}
                    </div>
                  ) : null}
                </div>
              </div>

              <div className="col-md-6 col-12 mb-3">
                <div className="mb-3">
                  <label className="form-label">Address</label>
                  <input
                    type="text"
                    className="form-control"
                    {...formik.getFieldProps("address")}
                  />
                  {formik.touched.address && formik.errors.address ? (
                    <div className="text-danger">{formik.errors.address}</div>
                  ) : null}
                </div>
              </div>

              <div className="col-md-6 col-12 mb-3">
                <div className="mb-3">
                  <label className="form-label">Phone</label>
                  <input
                    type="text"
                    className="form-control"
                    {...formik.getFieldProps("phone")}
                  />
                  {formik.touched.phone && formik.errors.phone ? (
                    <div className="text-danger">{formik.errors.phone}</div>
                  ) : null}
                </div>
              </div>

              <div className="col-md-6 col-12 mb-3">
                <div className="mb-3">
                  <label className="form-label">Email</label>
                  <input
                    type="email"
                    className="form-control"
                    {...formik.getFieldProps("email")}
                  />
                  {formik.touched.email && formik.errors.email ? (
                    <div className="text-danger">{formik.errors.email}</div>
                  ) : null}
                </div>
              </div>

              <div className="col-md-6 col-12 mb-3">
                <div className="mb-3">
                  <label className="form-label">Color Code</label>
                  <input
                    type="text"
                    className="form-control"
                    {...formik.getFieldProps("color_code")}
                  />
                  {formik.touched.color_code && formik.errors.color_code ? (
                    <div className="text-danger">
                      {formik.errors.color_code}
                    </div>
                  ) : null}
                </div>
              </div>

              <div className="col-md-6 col-12 mb-3">
                <div className="mb-3">
                  <label className="form-label">Country Code</label>
                  <input
                    type="text"
                    className="form-control"
                    {...formik.getFieldProps("country_code")}
                  />
                  {formik.touched.country_code && formik.errors.country_code ? (
                    <div className="text-danger">
                      {formik.errors.country_code}
                    </div>
                  ) : null}
                </div>
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
