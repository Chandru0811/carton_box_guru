import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { FiAlertTriangle } from "react-icons/fi";
import toast from "react-hot-toast";
// import Cropper from "react-easy-crop";
import api from "../../../config/URL";
import "../../../styles/admin.css";
// import ImageURL from "../../../config/ImageURL";

function CategoryGroupEdit() {
  const [loadIndicator, setLoadIndicator] = useState(false);
  const [loading, setLoading] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();
  const [allCountry, setAllCountry] = useState([]);
  // const [originalFileName, setOriginalFileName] = useState("");
  // const [originalFileType, setOriginalFileType] = useState("");
  // const [imageSrc, setImageSrc] = useState(null);
  // const [crop, setCrop] = useState({ x: 0, y: 0 });
  // const [zoom, setZoom] = useState(1);
  // const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  // const [showCropper, setShowCropper] = useState(false);
  // const [previewImage, setPreviewImage] = useState(null);
  // const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB
  // const SUPPORTED_FORMATS = [
  //   "image/png",
  //   "image/jpeg",
  //   "image/jpg",
  //   "image/svg+xml",
  //   "image/webp",
  // ];

  // const imageValidation = Yup.mixed()
  //   .nullable()
  //   .test("fileFormat", "Unsupported format", (value) => {
  //     return !value || (value && SUPPORTED_FORMATS.includes(value.type));
  //   })
  //   .test("fileSize", "File size is too large. Max 2MB.", (value) => {
  //     return !value || (value && value.size <= MAX_FILE_SIZE);
  //   });

  const validationSchema = Yup.object({
    name: Yup.string()
      .max(85, "Name must be 85 characters or less")
      .required("Name is required"),
    // image: imageValidation,
    icon: Yup.mixed().required("*Icon is required"),
    order: Yup.string().required("*Select an order"),
    // active: Yup.string().required("*Select an active"),
    description: Yup.string().max(825, "Maximum 825 characters allowed"),
    country_id: Yup.string().required("*Select a country"),
  });

  const formik = useFormik({
    initialValues: {
      name: "",
      slug: "",
      // icon: "",
      // image: null,
      order: "",
      active: "",
      description: "",
      country_id: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values, { resetForm }) => {
      const formData = new FormData();
      formData.append("_method", "PUT");

      formData.append("name", values.name);
      formData.append("slug", values.slug);
      // formData.append("icon", values.icon);
      formData.append("order", values.order);
      formData.append("active", values.active);
      formData.append("description", values.description);
      formData.append("country_id", values.country_id);
      // if (values.image) {
      //   formData.append("image", values.image);
      // }

      setLoadIndicator(true);
      try {
        const response = await api.post(
          `admin/categoryGroup/update/${id}`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        if (response.status === 200) {
          toast.success(response.data.message);
          navigate("/categorygroup");
          resetForm();
          // setPreviewImage(null);
        }
      } catch (error) {
        if (error.response && error.response.status === 422) {
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
          console.error("API Error", error);
          toast.error("An unexpected error occurred.");
        }
      } finally {
        setLoadIndicator(false);
      }
    },
  });

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await api.get(`admin/country`);

        setAllCountry(response.data.data);
      } catch (error) {
        toast.error("Error Fetching Data ", error);
      }
    };
    getData();
  }, []);

  useEffect(() => {
    const slug = formik.values.name
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "_")
      .replace(/[^\w]+/g, "");
    formik.setFieldValue("slug", slug);
  }, [formik.values.name]);

  useEffect(() => {
    const getData = async () => {
      setLoading(true);
      try {
        const response = await api.get(`admin/categoryGroup/${id}`);
        const categoryGroupData = response.data.data;
        formik.setValues({
          name: categoryGroupData.name || "",
          slug: categoryGroupData.slug || "",
          // icon: categoryGroupData.icon || "",
          order: categoryGroupData.order || "",
          active: categoryGroupData.active || "",
          description: categoryGroupData.description || "",
          country_id: categoryGroupData.country_id || "",
          // image: null,
        });
        // setPreviewImage(`${ImageURL}${categoryGroupData.image_path}`);
      } catch (error) {
        const errorMessage =
          error.response?.data?.message || "Error Fetching Data";
        toast.error(errorMessage);
      }
      setLoading(false);
    };
    getData();
  }, [id]);

  // const handleFileChange = (event) => {
  //   const file = event?.target?.files[0];
  //   if (file) {
  //     if (file.size > MAX_FILE_SIZE) {
  //       formik.setFieldError(`image`, "File size is too large. Max 2MB.");
  //       return;
  //     }
  //     formik.setFieldError(`image`, "");

  //     // Read file as data URL for cropping
  //     const reader = new FileReader();
  //     reader.onload = () => {
  //       setImageSrc(reader.result); // Set imageSrc for the cropper
  //       setOriginalFileName(file.name);
  //       setOriginalFileType(file.type);
  //       setShowCropper(true); // Show cropper when image is loaded
  //     };
  //     reader.readAsDataURL(file);

  //     if (file.size > MAX_FILE_SIZE) {
  //       formik.setFieldError(`image`, "File size is too large. Max 2MB.");
  //     }
  //   }
  // };

  // const onCropComplete = (croppedArea, croppedAreaPixels) => {
  //   setCroppedAreaPixels(croppedAreaPixels);
  // };

  // const getCroppedImg = (imageSrc, crop, croppedAreaPixels) => {
  //   return new Promise((resolve, reject) => {
  //     const image = new Image();
  //     image.src = imageSrc;
  //     image.onload = () => {
  //       const canvas = document.createElement("canvas");
  //       const ctx = canvas.getContext("2d");

  //       const targetWidth = 50;
  //       const targetHeight = 50;
  //       canvas.width = targetWidth;
  //       canvas.height = targetHeight;

  //       ctx.drawImage(
  //         image,
  //         croppedAreaPixels.x,
  //         croppedAreaPixels.y,
  //         croppedAreaPixels.width,
  //         croppedAreaPixels.height,
  //         0,
  //         0,
  //         targetWidth,
  //         targetHeight
  //       );

  //       canvas.toBlob((blob) => {
  //         if (!blob) {
  //           reject(new Error("Canvas is empty"));
  //           return;
  //         }
  //         blob.name = "croppedImage.jpeg";
  //         resolve(blob);
  //       }, "image/jpeg");
  //     };
  //   });
  // };

  // const handleCropSave = async () => {
  //   try {
  //     const croppedImageBlob = await getCroppedImg(
  //       imageSrc,
  //       crop,
  //       croppedAreaPixels
  //     );
  //     const file = new File([croppedImageBlob], originalFileName, {
  //       type: originalFileType,
  //     });

  //     formik.setFieldValue("image", file);
  //     // Create a URL for the cropped image and set it as the preview image
  //     const croppedImageURL = URL.createObjectURL(croppedImageBlob);
  //     setPreviewImage(croppedImageURL);

  //     setShowCropper(false);
  //   } catch (error) {
  //     console.error("Error cropping the image:", error);
  //   }
  // };

  // const handleCropCancel = () => {
  //   setShowCropper(false);
  //   setImageSrc(null);
  //   formik.setFieldValue("image", "");
  //   document.querySelector("input[type='file']").value = "";
  // };

  // useEffect(() => {
  //   return () => {
  //     if (previewImage && previewImage.startsWith("blob:")) {
  //       URL.revokeObjectURL(previewImage);
  //     }
  //   };
  // }, [previewImage]);

  return (
    <div className="container-fluid minHeight m-0">
      <form onSubmit={formik.handleSubmit}>
        {loading ? (
          <div className="loader-container">
            <div className="loader">
              <svg viewBox="0 0 80 80">
                <circle cx="40" cy="40" r="32"></circle>
              </svg>
            </div>
          </div>
        ) : (
          <>
            <div className="card shadow border-0 mb-2 top-header">
              <div className="container-fluid py-4">
                <div className="row align-items-center">
                  <div className="col">
                    <div className="d-flex align-items-center gap-4">
                      <h1 className="h4 ls-tight headingColor">
                        Edit Category Group
                      </h1>
                    </div>
                  </div>
                  <div className="col-auto">
                    <div className="hstack gap-2 justify-content-end">
                      <Link to="/categorygroup">
                        <button type="button" className="btn btn-light btn-sm">
                          Back
                        </button>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div
              className="card shadow border-0 my-2"
              style={{ minHeight: "80vh" }}
            >
              <div className="container mb-5">
                <div className="row py-4">
                  <div className="col-md-6 col-12 mb-3">
                    <label className="form-label">
                      Name<span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className={`form-control form-control-sm ${
                        formik.touched.name && formik.errors.name
                          ? "is-invalid"
                          : ""
                      }`}
                      {...formik.getFieldProps("name")}
                    />
                    {formik.touched.name && formik.errors.name && (
                      <div className="invalid-feedback">
                        {formik.errors.name}
                      </div>
                    )}
                  </div>

                  <div className="col-md-6 col-12 mb-3">
                    <label className="form-label">
                      Order<span className="text-danger">*</span>
                    </label>
                    <select
                      className={`form-select form-select-sm ${
                        formik.touched.order && formik.errors.order
                          ? "is-invalid"
                          : ""
                      }`}
                      {...formik.getFieldProps("order")}
                    >
                      <option value="">Select an order</option>
                      {Array.from({ length: 15 }, (_, i) => (
                        <option key={i + 1} value={i + 1}>
                          {i + 1}
                        </option>
                      ))}
                    </select>
                    {formik.touched.order && formik.errors.order && (
                      <div className="invalid-feedback">
                        {formik.errors.order}
                      </div>
                    )}
                  </div>

                  {/* <div className="col-md-6 col-12 mb-3">
                    <label className="form-label">
                      Icon<span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className={`form-control form-control-sm ${
                        formik.touched.icon && formik.errors.icon
                          ? "is-invalid"
                          : ""
                      }`}
                      {...formik.getFieldProps("icon")}
                    />
                    {formik.touched.icon && formik.errors.icon && (
                      <div className="invalid-feedback">
                        {formik.errors.icon}
                      </div>
                    )}
                  </div> */}
                  {/* <div className="col-md-6 col-12 mb-3">
                    <label className="form-label">
                      Image
                      <span className="text-danger">*</span>
                    </label>
                    <input
                      type="file"
                      accept=".png,.jpeg,.jpg,.svg,.webp"
                      className={`form-control form-control-sm ${
                        formik.touched.image && formik.errors.image
                          ? "is-invalid"
                          : ""
                      }`}
                      name="image"
                      onChange={handleFileChange}
                      onBlur={formik.handleBlur}
                    />
                    <p style={{ fontSize: "13px" }}>
                      Note: Maximum file size is 2MB. Allowed: .png, .jpg,
                      .jpeg, .svg, .webp.
                    </p>
                    {formik.touched.image && formik.errors.image && (
                      <div className="invalid-feedback">
                        {formik.errors.image}
                      </div>
                    )}

                    {previewImage && (
                      <div className="my-3">
                        <img
                          src={previewImage}
                          alt="Selected"
                          style={{ maxWidth: "100px", maxHeight: "100px" }}
                        />
                      </div>
                    )}
                    {showCropper && imageSrc && (
                      <div className="crop-container">
                        <Cropper
                          image={imageSrc}
                          crop={crop}
                          zoom={zoom}
                          aspect={50 / 50}
                          onCropChange={setCrop}
                          onZoomChange={setZoom}
                          onCropComplete={onCropComplete}
                          cropShape="rect"
                          showGrid={false}
                        />
                      </div>
                    )}

                    {showCropper && (
                      <div className="d-flex justify-content-start mt-3 gap-2">
                        <button
                          type="button"
                          className="btn btn-primary mt-3"
                          onClick={handleCropSave}
                        >
                          Save Cropped Image
                        </button>
                        <button
                          type="button"
                          className="btn btn-secondary mt-3"
                          onClick={handleCropCancel}
                        >
                          Cancel
                        </button>
                      </div>
                    )}
                  </div> */}
                  <div className="col-md-6 col-12 mb-3">
                    <label className="form-label">
                      Country<span className="text-danger">*</span>
                    </label>
                    <select
                      className={`form-select form-select-sm ${
                        formik.touched.country_id && formik.errors.country_id
                          ? "is-invalid"
                          : ""
                      }`}
                      {...formik.getFieldProps("country_id")}
                      onChange={(e) => {
                        formik.handleChange(e);
                      }}
                    >
                      <option value="">Select a Country</option>
                      {allCountry &&
                        allCountry.map((country) => (
                          <option key={country.id} value={country.id}>
                            {country.country_name}
                          </option>
                        ))}
                    </select>
                    {formik.touched.country_id && formik.errors.country_id && (
                      <div className="invalid-feedback">
                        {formik.errors.country_id}
                      </div>
                    )}
                  </div>
                  <div className="col-md-6 col-12 mb-3">
                    <label className="form-label">Description</label>
                    <textarea
                      rows={5}
                      className="form-control form-control-sm"
                      {...formik.getFieldProps("description")}
                      maxLength={825}
                    />
                    {formik.touched.description &&
                      formik.errors.description && (
                        <div className="invalid-feedback">
                          {formik.errors.description}
                        </div>
                      )}
                  </div>
                </div>
              </div>
              <div className="hstack p-2">
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
          </>
        )}
      </form>
    </div>
  );
}

export default CategoryGroupEdit;
