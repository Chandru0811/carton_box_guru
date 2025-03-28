import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import api from "../../../config/URL";
import toast from "react-hot-toast";
import { FiAlertTriangle } from "react-icons/fi";
import Cropper from "react-easy-crop";
import "../../../styles/admin.css";

function SliderAdd() {
  const [loadIndicator, setLoadIndicator] = useState(false);
  const [imageSrc, setImageSrc] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [showCropper, setShowCropper] = useState(false);
  const [originalFileName, setOriginalFileName] = useState("");
  const [originalFileType, setOriginalFileType] = useState("");
  const navigate = useNavigate();
  const [allCountry, setAllCountry] = useState([]);

  const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB
  const SUPPORTED_FORMATS = [
    "image/png",
    "image/jpeg",
    "image/jpg",
    "image/svg+xml",
    "image/webp",
  ];

  const imageValidation = Yup.mixed()
    .required("*Image is required")
    .test("fileFormat", "Unsupported format", (value) => {
      return !value || (value && SUPPORTED_FORMATS.includes(value.type));
    })
    .test("fileSize", "File size is too large. Max 2MB.", (value) => {
      return !value || (value && value.size <= MAX_FILE_SIZE);
    });

  const validationSchema = Yup.object({
    order: Yup.string().required("*Select an Order"),
    image: imageValidation,
    country_id: Yup.string().required("*Select a Country"),
  });

  const formik = useFormik({
    initialValues: {
      order: "",
      image: null,
      country_id: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values, { resetForm }) => {
      const formData = new FormData();
      formData.append("order", values.order);
      formData.append("image", values.image);
      formData.append("country_id", values.country_id);

      setLoadIndicator(true);

      try {
        const response = await api.post(`admin/slider`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        if (response.status === 200) {
          toast.success(response.data.message);
          navigate("/slider");
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

  const handleFileChange = (event) => {
    const file = event?.target?.files[0];
    if (file) {
      if (file.size > MAX_FILE_SIZE) {
        toast.error("File size is too large. Max 2MB.");
        event.target.value = null;
        formik.setFieldValue("image", null);
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        setImageSrc(reader.result);
        setOriginalFileName(file.name);
        setOriginalFileType(file.type);
        setShowCropper(true);
      };
      reader.readAsDataURL(file);

      if (file.size > MAX_FILE_SIZE) {
        formik.setFieldError(`image`, "File size is too large. Max 2MB.");
      }
    }
  };

  const onCropComplete = (croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  };

  const getCroppedImg = (imageSrc, crop, croppedAreaPixels) => {
    return new Promise((resolve, reject) => {
      const image = new Image();
      image.src = imageSrc;
      image.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        const targetWidth = 900;
        const targetHeight = 400;
        canvas.width = targetWidth;
        canvas.height = targetHeight;

        ctx.drawImage(
          image,
          croppedAreaPixels.x,
          croppedAreaPixels.y,
          croppedAreaPixels.width,
          croppedAreaPixels.height,
          0,
          0,
          targetWidth,
          targetHeight
        );

        canvas.toBlob((blob) => {
          if (!blob) {
            reject(new Error("Canvas is empty"));
            return;
          }
          blob.name = "croppedImage.jpeg";
          resolve(blob);
        }, "image/jpeg");
      };
    });
  };

  const handleCropSave = async () => {
    try {
      const croppedImageBlob = await getCroppedImg(
        imageSrc,
        crop,
        croppedAreaPixels
      );
      const fileName = originalFileName;

      const file = new File([croppedImageBlob], fileName, {
        type: originalFileType,
      });

      formik.setFieldValue("image", file);
      setOriginalFileType(file.type);
      setShowCropper(false);
    } catch (error) {
      console.error("Error cropping the image:", error);
    }
  };

  const handleCropCancel = () => {
    setShowCropper(false);
    setImageSrc(null);
    formik.setFieldValue("image", "");
    document.querySelector("input[type='file']").value = "";
  };
  return (
    <section className="px-4">
      <form onSubmit={formik.handleSubmit}>
        <div className="card card-shadow py-1">
          <div className="row p-3">
            <div className="d-flex justify-content-between align-items-center">
              <h1 className="h4 ls-tight">Add Slider</h1>
              <Link to="/slider">
                <button type="button" className="btn btn-light btn-sm">
                  <span>Back</span>
                </button>
              </Link>
            </div>
          </div>
        </div>
        <div className="container card card-shadow form-container">
          <div className="row py-4">
            <div className="col-md-6 col-12 mb-3">
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
                Note: Maximum file size is 2MB. Allowed: .png, .jpg, .jpeg,
                .svg, .webp.
              </p>
              {formik.touched.image && formik.errors.image && (
                <div className="invalid-feedback">{formik.errors.image}</div>
              )}

              {showCropper && imageSrc && (
                <div className="crop-container">
                  <Cropper
                    image={imageSrc}
                    crop={crop}
                    zoom={zoom}
                    aspect={900 / 400}
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
            </div>
            <div className="col-md-6 col-12 file-input mb-5">
              <label className="form-label">
                Order<span className="text-danger">*</span>
              </label>
              <select
                aria-label="Default select example"
                className={`form-select form-select-sm ${
                  formik.touched.order && formik.errors.order
                    ? "is-invalid"
                    : ""
                }`}
                {...formik.getFieldProps("order")}
              >
                <option value="">Select an order</option>
                {Array.from({ length: 8 }, (_, i) => (
                  <option key={i + 1} value={i + 1}>
                    {i + 1}
                  </option>
                ))}
              </select>
              {formik.touched.order && formik.errors.order && (
                <div className="invalid-feedback">{formik.errors.order}</div>
              )}
            </div>
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
          </div>
          <div className="hstack p-2 mt-5">
            <button
              type="submit"
              className="btn btn-sm btn-button mt-5"
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
      </form>
    </section>
  );
}

export default SliderAdd;
