import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../../../config/URL";
import toast from "react-hot-toast";
import ImageURL from "../../../config/ImageURL";

function CategoryView() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [shopStatus, setShopStatus] = useState("");

  // Fetch category data by id
  const getData = async () => {
    try {
      const response = await api.get(`admin/categories/${id}`);

      console.log("Category data response:", response);
      setData(response.data.data);
      setShopStatus(response.data.data.active);
    } catch (error) {
      toast.error("Error Fetching Data");
      console.error("Fetch Error:", error);
      if (error.response && error.response.status === 401) {
        toast.error("Unauthorized: Please login again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleActivate = async () => {
    setLoading(true);
    try {
      const response = await api.post(`admin/category/${id}/approve`, {});

      if (response.status === 200) {
        getData();
        toast.success("Category activated successfully!");
      } else {
        toast.error("Failed to activate Category.");
      }
    } catch (error) {
      toast.error("An error occurred while activating the Category.");
      console.error("Activation Error:", error);
      if (error.response && error.response.status === 401) {
        toast.error("Unauthorized: Please login again.");
      }
    } finally {
      setLoading(false);
    }
  };

  // useEffect hook to fetch data when component is mounted
  useEffect(() => {
    getData();
  }, [id]);

  if (loading) {
    return (
      <div className="loader-container">
        <div className="loader">
          <svg viewBox="0 0 80 80">
            <circle cx="40" cy="40" r="32"></circle>
          </svg>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid">
      <div className="card shadow border-0 mb-3">
        <div className="row p-3">
          <div className="d-flex justify-content-between align-items-center w-100">
            <div>
              <h3 className="ls-tight">View Category</h3>
            </div>
            <div>
              <Link to="/categories">
                <button type="button" className="btn btn-light btn-sm me-2">
                  Back
                </button>
              </Link>
              {shopStatus === 0 && (
                <button
                  type="button"
                  onClick={handleActivate}
                  className="btn btn-success btn-sm me-2"
                  disabled={loading}
                >
                  {loading && (
                    <span
                      className="spinner-border spinner-border-sm me-2"
                      aria-hidden="true"
                    ></span>
                  )}
                  Activate
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="card shadow border-0 my-2" style={{ minHeight: "80vh" }}>
        <div className="container">
          <div className="row mt-5 p-3">
            <div className="col-md-6 col-12">
              <div className="row mb-3">
                <div className="col-6 d-flex justify-content-start align-items-center">
                  <p className="text-sm">Category Group Name</p>
                </div>
                <div className="col-6">
                  <p className="text-muted text-sm">
                    : {data?.categoryGroupName}
                  </p>
                </div>
              </div>
            </div>
            <div className="col-md-6 col-12">
              <div className="row mb-3">
                <div className="col-6 d-flex justify-content-start align-items-center">
                  <p className="text-sm">Name</p>
                </div>
                <div className="col-6">
                  <p className="text-muted text-sm">: {data?.name}</p>
                </div>
              </div>
            </div>
            <div className="col-md-6 col-12">
              <div className="row mb-3">
                <div className="col-6 d-flex justify-content-start align-items-center">
                  <p className="text-sm">Slug</p>
                </div>
                <div className="col-6">
                  <p className="text-muted text-sm">: {data?.slug}</p>
                </div>
              </div>
            </div>
            <div className="col-md-6 col-12">
              <div className="row mb-3">
                <div className="col-6 d-flex justify-content-start align-items-center">
                  <p className="text-sm">Icon</p>
                </div>
                <div className="col-6">
                  <p className="text-muted text-sm">
                    :{" "}
                    <img
                      src={`${ImageURL}${data?.icon}`}
                      alt="Category Icon"
                      style={{ maxWidth: "100px", maxHeight: "100px" }}
                    />
                  </p>
                </div>
              </div>
            </div>
            <div className="col-12">
              <div className="row mb-3">
                <div className="col-3 d-flex justify-content-start align-items-center">
                  <p className="text-sm">Description</p>
                </div>
                <div className="col-9">
                  <p className="text-muted text-sm">: {data?.description}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CategoryView;
