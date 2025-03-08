import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../../../config/URL";
import toast from "react-hot-toast";
import ImageURL from "../../../config/ImageURL";

function CountryView() {
  const { id } = useParams();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const getData = async () => {
    setLoading(true);
    try {
      const response = await api.get(`admin/country/${id}`);
      setData(response.data.data);
      // console.log( "responseData",response.data.data);
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
      <div className="card shadow border-0 mb-3">
        <div className="row p-3">
          <div className="d-flex justify-content-between align-items-center w-100">
            <h3 className="mb-0 ls-tight">View Country</h3>
            <Link to="/countries">
              <button type="button" className="btn btn-light btn-sm me-2">
                <span>Back</span>
              </button>
            </Link>
          </div>
        </div>
      </div>

      <div className="card shadow border-0 my-2" style={{ minHeight: "80vh" }}>
        {loading ? (
          <div className="loader-container">
            <div className="loader">
              <svg viewBox="0 0 80 80">
                <circle cx="40" cy="40" r="32"></circle>
              </svg>
            </div>
          </div>
        ) : (
          <div className="container">
            <div className="row mt-5 p-3">
              <div className="col-md-6 col-12 mb-3">
                <div className="row">
                  <div className="col-6 d-flex justify-content-start align-items-center">
                    <p className="text-sm">Country Name</p>
                  </div>
                  <div className="col-6">
                    <p className="text-muted text-sm">: {data.country_name}</p>
                  </div>
                </div>
              </div>
              <div className="col-md-6 col-12 mb-3">
                <div className="row">
                  <div className="col-6 d-flex justify-content-start align-items-center">
                    <p className="text-sm">Flag</p>
                  </div>
                  <div className="col-6">
                    <img
                      src={
                        data.flag
                          ? `${ImageURL}${data.flag}`
                          : "/default-flag.png"
                      }
                      alt="Country Flag"
                      style={{ maxWidth: "100px", maxHeight: "100px" }}
                    />
                  </div>
                </div>
              </div>
              <div className="col-md-6 col-12 mb-3">
                <div className="row">
                  <div className="col-6 d-flex justify-content-start align-items-center">
                    <p className="text-sm">Currency Symbol</p>
                  </div>
                  <div className="col-6">
                    <p className="text-muted text-sm">
                      : {data.currency_symbol}
                    </p>
                  </div>
                </div>
              </div>
              <div className="col-md-6 col-12 mb-3">
                <div className="row">
                  <div className="col-6 d-flex justify-content-start align-items-center">
                    <p className="text-sm">Currency Code</p>
                  </div>
                  <div className="col-6">
                    <p className="text-muted text-sm">: {data.currency_code}</p>
                  </div>
                </div>
              </div>
              <div className="col-md-6 col-12 mb-3">
                <div className="row">
                  <div className="col-6 d-flex justify-content-start align-items-center">
                    <p className="text-sm">Social Links</p>
                  </div>
                  <div className="col-6">
                    <p className="text-muted text-sm">: {data.social_links}</p>
                  </div>
                </div>
              </div>
              <div className="col-md-6 col-12 mb-3">
                <div className="row">
                  <div className="col-6 d-flex justify-content-start align-items-center">
                    <p className="text-sm">Address</p>
                  </div>
                  <div className="col-6">
                    <p className="text-muted text-sm">: {data.address}</p>
                  </div>
                </div>
              </div>
              <div className="col-md-6 col-12 mb-3">
                <div className="row">
                  <div className="col-6 d-flex justify-content-start align-items-center">
                    <p className="text-sm">Phone Code</p>
                  </div>
                  <div className="col-6">
                    <p className="text-muted text-sm">
                      : {data.phone_number_code}
                    </p>
                  </div>
                </div>
              </div>
              <div className="col-md-6 col-12 mb-3">
                <div className="row">
                  <div className="col-6 d-flex justify-content-start align-items-center">
                    <p className="text-sm">Phone</p>
                  </div>
                  <div className="col-6">
                    <p className="text-muted text-sm">: {data.phone}</p>
                  </div>
                </div>
              </div>
              <div className="col-md-6 col-12 mb-3">
                <div className="row">
                  <div className="col-6 d-flex justify-content-start align-items-center">
                    <p className="text-sm">Email</p>
                  </div>
                  <div className="col-6">
                    <p className="text-muted text-sm">: {data.email}</p>
                  </div>
                </div>
              </div>
              <div className="col-md-6 col-12 mb-3">
                <div className="row">
                  <div className="col-6 d-flex justify-content-start align-items-center">
                    <p className="text-sm">Color Code</p>
                  </div>
                  <div className="col-6">
                    <p className="text-muted text-sm">: {data.color_code}</p>
                  </div>
                </div>
              </div>

              <div className="col-md-6 col-12 mb-3">
                <div className="row">
                  <div className="col-6 d-flex justify-content-start align-items-center">
                    <p className="text-sm">Country Code</p>
                  </div>
                  <div className="col-6">
                    <p className="text-muted text-sm">: {data.country_code}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default CountryView;
