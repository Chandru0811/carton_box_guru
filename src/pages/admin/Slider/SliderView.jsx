import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../../../config/URL";
import toast from "react-hot-toast";
import ImageURL from "../../../config/ImageURL";

function SliderView() {
  const { id } = useParams();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const getData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token"); // Retrieve token from local storage
      if (!token) {
        toast.error("Authentication token is missing");
        setLoading(false);
        return;
      }

      const response = await api.get(`slider/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`, // Add token to request
        },
      });

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
    <section className="px-4">
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
                  <h3 className="ls-tight">View Slider</h3>
                </div>
                <div>
                  <Link to="/slider">
                    <button type="button" className="btn btn-light btn-sm me-2">
                      <span>Back</span>
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
          <div
            className="container card shadow border-0"
            style={{ minHeight: "80vh" }}
          >
            <div className="row mt-5 p-3">
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
                    <p className="text-sm">Image</p>
                  </div>
                  <div className="col-6">
                    <p className="text-muted text-sm">
                      :
                      <img
                        src={`${ImageURL}${data.image_path}`}
                        alt="icon"
                        style={{ maxWidth: "100px", maxHeight: "100px" }}
                      />
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </section>
  );
}

export default SliderView;
