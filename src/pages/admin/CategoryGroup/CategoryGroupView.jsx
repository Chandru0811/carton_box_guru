import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../../../config/URL";
import toast from "react-hot-toast";
import ImageURL from "../../../config/ImageURL";

function CategoryGroupView() {
  const { id } = useParams();
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(false);

  const getData = async () => {
    setLoading(true);
    try {
      const response = await api.get(`admin/categoryGroup/${id}`);
      setData(response.data.data);
    } catch {
      toast.error("Error Fetching Data");
    }
    setLoading(false);
  };

  useEffect(() => {
    getData();
  }, [id]);

  return (
    <div className="container-fluid minHeight">
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
          <div className="card shadow border-0 mb-3">
            <div className="row p-3">
              <div className="d-flex justify-content-between align-items-center w-100">
                <div>
                  <h3 className="mb-0 ls-tight">View Category Group</h3>
                </div>
                <div>
                  <Link to="/categorygroup">
                    <button type="button" className="btn btn-light btn-sm me-2">
                      <span>Back</span>
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </div>

          <div
            className="card shadow border-0 my-2"
            style={{ minHeight: "80vh" }}
          >
            <div className="container">
              <div className="row mt-5 p-3">
                <div className="col-md-6 col-12">
                  <div className="row mb-3">
                    <div className="col-6 d-flex justify-content-start align-items-center">
                      <p className="text-sm">Name</p>
                    </div>
                    <div className="col-6">
                      <p className="text-muted text-sm">: {data.name}</p>
                    </div>
                  </div>
                </div>

                <div className="col-md-6 col-12">
                  <div className="row mb-3">
                    <div className="col-6 d-flex justify-content-start align-items-center">
                      <p className="text-sm">Order</p>
                    </div>
                    <div className="col-6">
                      <p className="text-muted text-sm">: {data.order}</p>
                    </div>
                  </div>
                </div>

                <div className="col-md-6 col-12">
                  <div className="row mb-3">
                    <div className="col-6 d-flex justify-content-start align-items-center">
                      <p className="text-sm">Icon</p>
                    </div>
                    <div className="col-6">
                      <p className="text-muted text-sm">: {data.icon}</p>
                    </div>
                  </div>
                </div>

                <div className="col-md-6 col-12">
                  <div className="row mb-3">
                    <div className="col-6 d-flex justify-content-start align-items-center">
                      <p className="text-sm">Image</p>
                    </div>
                    <div className="col-6">
                      {data.image_path && (
                        <p className="text-muted text-sm">
                          :{" "}
                          <img
                            src={`${ImageURL}${data.image_path}`}
                            alt="Category Image"
                            style={{ maxWidth: "100px", maxHeight: "100px" }}
                          />
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="col-12">
                  <div className="row mb-3">
                    <div className="col-3 d-flex justify-content-start align-items-center">
                      <p className="text-sm">Description</p>
                    </div>
                    <div className="col-9">
                      <p className="text-muted text-sm">: {data.description}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default CategoryGroupView;
