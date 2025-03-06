import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../../../config/URL";
import ImageURL from "../../../config/ImageURL";
import { FaRegCopy } from "react-icons/fa";
import { LuCopyCheck } from "react-icons/lu";

function ProductView() {
  const { id } = useParams();
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getData = async () => {
      setLoading(true);
      try {
        const response = await api.get(`product/${id}/get`);
        const { additional_details, ...rest } = response.data.data;
        console.log(response.data.data, "Response Data"); // Debugging

        const decodedAdditionalDetails = additional_details
          ? JSON.parse(additional_details)
          : [];

        setData({
          ...rest,
          additional_details: decodedAdditionalDetails,
        });
      } catch {
        toast.error("Error Fetching Data");
      }
      setLoading(false);
    };

    getData();
  }, [id]);

  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = async () => {
    try {
      if (data?.coupon_code) {
        await navigator.clipboard.writeText(data.coupon_code);
        setIsCopied(true); // Set the copied state to true
        setTimeout(() => setIsCopied(false), 2000);
      }
    } catch (err) {
      console.error("Failed to copy!", err);
    }
  };
  function extractVideoId(url) {
    const regExp =
      /(?:youtube\.com\/(?:[^/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/([a-zA-Z0-9_-]+))|youtu\.be\/([a-zA-Z0-9_-]+))/;
    const match = url?.match(regExp);
    return match ? match[1] || match[2] : null;
  }

  //   const numberWithCommas = (number) => {
  //     return number?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  //   };

  return (
    <section className="px-4">
      <>
        <div className="card shadow border-0 mb-3">
          <div className="row p-3">
            <div className="d-flex justify-content-between align-items-center">
              <h1 className="h4 ls-tight">View Deals</h1>
              <div>
                <Link to={`/products/edit/${id}`}>
                  <button type="button" className="btn btn-light btn-sm me-2">
                    <span>Edit</span>
                  </button>
                </Link>
                <Link to="/products">
                  <button type="button" className="btn btn-light btn-sm">
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
              <div className="d-flex justify-content-end align-items-center mt-2">
                <p>
                  <span>Coupon Code</span>&nbsp;&nbsp;:
                  <span className="text-muted" style={{ fontSize: "24px" }}>
                    {data?.coupon_code}
                  </span>
                </p>
                &nbsp;&nbsp;
                <span
                  onClick={handleCopy}
                  style={{ cursor: "pointer" }}
                  title={isCopied ? "Copied!" : "Click to copy"}
                >
                  {isCopied ? <LuCopyCheck /> : <FaRegCopy />}
                </span>
              </div>
              <div className="row mt-5 p-3">
                <div className="col-md-6 col-12">
                  <div className="row mb-3">
                    <div className="col-6 d-flex justify-content-start align-items-center">
                      <p className="text-sm">Category Group</p>
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
                      <p className="text-sm">Category</p>
                    </div>
                    <div className="col-6">
                      <p className="text-muted text-sm">
                        : {data?.categoryName}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="col-md-6 col-12">
                  <div className="row mb-3">
                    <div className="col-6 d-flex justify-content-start align-items-center">
                      <p className="text-sm">Deal Type</p>
                    </div>
                    <div className="col-6">
                      {console.log("Deal Type Value:", data?.deal_type)}{" "}
                      {/* Debugging */}
                      <p className="text-muted text-sm">
                        :{" "}
                        {data?.deal_type === 1 || data?.deal_type === "1"
                          ? "Product"
                          : data?.deal_type === 2 || data?.deal_type === "2"
                          ? "Service"
                          : data?.deal_type === 3 || data?.deal_type === "3"
                          ? "Product and Service"
                          : "Unknown"}
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
                {data?.deal_type !== 2 && data?.deal_type !== "2" && (
                  <>
                    <div className="col-md-6 col-12">
                      <div className="row mb-3">
                        <div className="col-6 d-flex justify-content-start align-items-center">
                          <p className="text-sm">Original Price</p>
                        </div>
                        <div className="col-6">
                          <p className="text-muted text-sm">
                            :{" "}
                            {data?.original_price &&
                              new Intl.NumberFormat("en-IN", {
                                minimumFractionDigits: 0,
                                maximumFractionDigits: 2,
                                useGrouping: true,
                              }).format(parseFloat(data?.original_price))}
                          </p>
                        </div>
                      </div>
                    </div>
                  </>
                )}
                {data?.deal_type !== 2 && data?.deal_type !== "2" && (
                  <div className="col-md-6 col-12">
                    <div className="row mb-3">
                      <div className="col-6 d-flex justify-content-start align-items-center">
                        <p className="text-sm">Discounted Price</p>
                      </div>
                      <div className="col-6">
                        <p className="text-muted text-sm">
                          :{" "}
                          {data?.discounted_price &&
                            new Intl.NumberFormat("en-IN", {
                              minimumFractionDigits: 0,
                              maximumFractionDigits: 2,
                              useGrouping: true,
                            }).format(parseFloat(data?.discounted_price))}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
                {data?.deal_type !== 2 && data?.deal_type !== "2" && (
                  <div className="col-md-6 col-12">
                    <div className="row mb-3">
                      <div className="col-6 d-flex justify-content-start align-items-center">
                        <p className="text-sm">Discounted Percentage</p>
                      </div>
                      <div className="col-6">
                        <p className="text-muted text-sm">
                          : {data?.discount_percentage}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
                {data?.deal_type !== 2 && data?.deal_type !== "2" && (
                  <div className="col-md-6 col-12">
                    <div className="row mb-3">
                      <div className="col-6 d-flex justify-content-start align-items-center">
                        <p className="text-sm">Variant</p>
                      </div>
                      <div className="col-6">
                        <p className="text-muted text-sm">
                          :{" "}
                          {data?.varient?.split(",").map((varient, index) => (
                            <span
                              key={index}
                              className="badge badge-success badge-outlined mx-1"
                            >
                              {varient.trim()}
                            </span>
                          ))}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
                {data?.deal_type !== 2 && data?.deal_type !== "2" && (
                  <div className="col-md-6 col-12">
                    <div className="row mb-3">
                      <div className="col-6 d-flex justify-content-start align-items-center">
                        <p className="text-sm">Delivery Days</p>
                      </div>
                      <div className="col-6">
                        <p className="text-muted text-sm">
                          :
                          {data?.delivery_days
                            ? ` ${data.delivery_days} Days`
                            : "N/A"}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
                {/* <div className="col-md-6 col-12">
                <div className="row mb-3">
                  <div className="col-6 d-flex justify-content-start align-items-center">
                    <p className="text-sm">
                      Stock
                    </p>
                  </div>
                  <div className="col-6">
                    <p className="text-muted text-sm">: {data?.stock}</p>
                  </div>
                </div>
              </div>
              <div className="col-md-6 col-12">
                <div className="row mb-3">
                  <div className="col-6 d-flex justify-content-start align-items-center">
                    <p className="text-sm">
                      SKU
                    </p>
                  </div>
                  <div className="col-6">
                    <p className="text-muted text-sm">: {data?.sku}</p>
                  </div>
                </div>
              </div> */}
                {/* <div className="col-md-6 col-12">
                <div className="row mb-3">
                  <div className="col-6 d-flex justify-content-start align-items-center">
                    <p className="text-sm">
                      Coupon Code
                    </p>
                  </div>
                  <div className="col-6">
                    <p className="text-muted text-sm">: {data?.coupon_code}</p>
                  </div>
                </div>
              </div> */}
                <div className="col-md-6 col-12">
                  <div className="row mb-3">
                    <div className="col-6 d-flex justify-content-start align-items-center">
                      <p className="text-sm">Pack</p>
                    </div>
                    <div className="col-6">
                      <p className="text-muted text-sm">: {data?.pack}</p>
                    </div>
                  </div>
                </div>
                <div className="col-md-6 col-12">
                  <div className="row mb-3">
                    <div className="col-6 d-flex justify-content-start align-items-center">
                      <p className="text-sm">Length</p>
                    </div>
                    <div className="col-6">
                      <p className="text-muted text-sm">: {data?.box_length}</p>
                    </div>
                  </div>
                </div>
                <div className="col-md-6 col-12">
                  <div className="row mb-3">
                    <div className="col-6 d-flex justify-content-start align-items-center">
                      <p className="text-sm">Width</p>
                    </div>
                    <div className="col-6">
                      <p className="text-muted text-sm">: {data?.box_width}</p>
                    </div>
                  </div>
                </div>
                <div className="col-md-6 col-12">
                  <div className="row mb-3">
                    <div className="col-6 d-flex justify-content-start align-items-center">
                      <p className="text-sm">Height</p>
                    </div>
                    <div className="col-6">
                      <p className="text-muted text-sm">: {data?.box_height}</p>
                    </div>
                  </div>
                </div>
                <div className="col-md-6 col-12">
                  <div className="row mb-3">
                    <div className="col-6 d-flex justify-content-start align-items-center">
                      <p className="text-sm">Stock In Quantity</p>
                    </div>
                    <div className="col-6">
                      <p className="text-muted text-sm">
                        : {data?.stock_quantity}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="col-md-6 col-12">
                  <div className="row mb-3">
                    <div className="col-6 d-flex justify-content-start align-items-center">
                      <p className="text-sm">Unit</p>
                    </div>
                    <div className="col-6">
                      <p className="text-muted text-sm">: {data?.unit}</p>
                    </div>
                  </div>
                </div>
                <div className="col-12">
                  <div className="row mb-3">
                    <div className="col-3 d-flex justify-content-start align-items-center">
                      <p className="text-sm">Description</p>
                    </div>
                    <div className="col-9">
                      <p className="text-muted text-sm">
                        : {data?.description}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="col-12">
                  <div className="row mb-3">
                    <div className="col-3 d-flex justify-content-start align-items-center">
                      <p className="text-sm">Specification</p>
                    </div>
                    <div className="col-9">
                      <p className="text-muted text-sm">
                        : {data?.specifications}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="row mt-5 p-3">
                  {data.product_media
                    ?.sort((a, b) => a.order - b.order)
                    .map((item, index) => (
                      <div className="col-md-4 col-12 mb-3" key={item.id}>
                        {item.type === "image" ? (
                          <>
                            <p className="text-sm">Thumbnail {index + 1}</p>
                            <img
                              src={`${ImageURL}${
                                item.resize_path.startsWith("/")
                                  ? item.resize_path
                                  : "/" + item.resize_path
                              }`}
                              alt={`Media ${index + 1}`}
                              style={{
                                maxWidth: "100%",
                                maxHeight: "100%",
                                objectFit: "cover",
                              }}
                            />
                          </>
                        ) : item.type === "video" ? (
                          <>
                            <p className="text-sm">Thumbnail {index + 1}</p>
                            <div
                              className="d-flex gap-4"
                              id={`video-container-${index}`}
                            >
                              {item.resize_path && (
                                <iframe
                                  src={`https://www.youtube.com/embed/${extractVideoId(
                                    item.resize_path
                                  )}`}
                                  width="280"
                                  height="213"
                                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                  allowFullScreen
                                  title={`Video ${index + 1}`}
                                ></iframe>
                              )}
                            </div>
                          </>
                        ) : null}
                      </div>
                    ))}
                </div>
              </div>
            </>
          )}
        </div>
      </>
    </section>
  );
}

export default ProductView;
