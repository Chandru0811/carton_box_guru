import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import noImage from "../../../assets/images/noImage.png";
import toast from "react-hot-toast";
import api from "../../../config/URL";
import ImageURL from "../../../config/ImageURL";

function OrderView() {
  const { order_id, product_id } = useParams();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const getData = async () => {
    setLoading(true);
    try {
      const response = await api.get(`admin/order/${order_id}/${product_id}`);
      setData(response.data.data);
    } catch (error) {
      toast.error("Error Fetching Data ", error);
    }
    setLoading(false);
  };

  const calculateDeliveryDate = (createdAt, deliveryDays) => {
    if (!createdAt || !deliveryDays || deliveryDays === "N/A") return "N/A";
    const createdDate = new Date(createdAt);
    createdDate.setDate(createdDate.getDate() + parseInt(deliveryDays, 10));
    return createdDate.toISOString().split("T")[0];
  };

  useEffect(() => {
    getData();
  }, [order_id, product_id]);

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
        <div>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div className="d-flex align-items-center mb-4">
              <p className="d-flex justify-content-center text-dark">
                Order ID: {data?.item_number ?? "N/A"}&nbsp;
              </p>
              &nbsp;
              <span
                className={`badge-warning text-capitalize ${
                  data?.order?.payment_status === "1"
                    ? "badge_warning"
                    : "badge_warning"
                }`}
              >
                {data?.order?.payment_status === "1"
                  ? "Not Paid"
                  : data?.order?.payment_status === "2"
                  ? "Pending"
                  : data?.order?.payment_status === "3"
                  ? "Paid"
                  : data?.order?.payment_status === "4"
                  ? "Refund Initiated"
                  : data?.order?.payment_status === "5"
                  ? "Refunded"
                  : data?.order?.payment_status === "6"
                  ? "Refund Error"
                  : "Unknown Status"}
              </span>
              &nbsp;&nbsp;
              <span
                className={
                  data?.deal_type === "1"
                    ? "badge_payment text-capitalize"
                    : "badge_payment text-capitalize"
                }
              >
                {data?.deal_type === "1" ? "Product" : "Service"}
              </span>
            </div>

            <Link to="/order">
              <button className="btn btn-light btn-sm">Back</button>
            </Link>
          </div>

          <div className="row">
            {/* Left Column: Order Item & Order Summary */}
            <div className="col-md-8">
              <div className="card mb-4">
                <div className="card-header m-0 p-2 d-flex justify-content-between gap-2 align-items-center">
                  <div>
                    <p className="mb-0">
                      Order Item &nbsp;
                      <span className="badge_danger text-capitalize">
                        {data?.order?.status === "1"
                          ? "Created"
                          : data?.order?.status === "2"
                          ? "Payment Error"
                          : data?.order?.status === "3"
                          ? "Confirmed"
                          : data?.order?.status === "4"
                          ? "Awaiting Delivery"
                          : data?.order?.status === "5"
                          ? "Delivered"
                          : data?.order?.status === "6"
                          ? "Returned"
                          : data?.order?.status === "7"
                          ? "Cancelled"
                          : "Unknown Status"}
                      </span>
                      &nbsp;
                      <span className="badge_payment">
                        <span>{data?.coupon_code}</span>
                      </span>
                    </p>
                  </div>
                  <div>
                    <span>
                      Date :{" "}
                      {data?.created_at
                        ? new Date(data.created_at).toISOString().split("T")[0]
                        : ""}
                    </span>{" "}
                    &nbsp;
                    {/* <span>
                      Time :{" "}
                      <span className="text-uppercase">
                        {" "}
                        {data?.created_at
                          ? new Date(data.created_at).toLocaleString("en-IN", {
                            hour: "2-digit",
                            minute: "2-digit",
                            hour12: true,
                          })
                          : ""}
                      </span>
                    </span> */}
                  </div>
                </div>
                <div className="card-body m-0 p-4">
                  <div className="row align-items-center ">
                    <div className="col-md-3">
                      <img
                        src={
                          data?.product?.product_media[0]?.type === "image"
                            ? `${ImageURL}${data.product.product_media[0].resize_path}`
                            : noImage
                        }
                        alt={data?.product?.name || "Product Image"}
                        style={{ width: "100%" }}
                      />
                    </div>
                    <div className="col">
                      <h3 className="text-muted text-capitalize">
                        {data?.item_description}
                      </h3>
                      <p>
                        {data?.product?.description?.length > 200
                          ? `${data.product.description.slice(0, 200)}...`
                          : data?.product?.description}
                      </p>
                      <p>
                        <del>
                          ₹
                          {new Intl.NumberFormat("en-IN", {
                            maximumFractionDigits: 0,
                          }).format(parseFloat(data?.unit_price))}
                        </del>
                        &nbsp;&nbsp;
                        <span style={{ color: "#dc3545" }}>
                          ₹
                          {new Intl.NumberFormat("en-IN", {
                            maximumFractionDigits: 0,
                          }).format(parseFloat(data?.discount))}
                        </span>
                        &nbsp;&nbsp;
                        <span className="badge_danger">
                          {parseFloat(data?.discount_percent).toFixed(0)}% saved
                        </span>
                      </p>
                      {/* <p>Name : {items?.shop?.name ?? ""}</p>
                      <p>Email : {items?.shop?.email ?? ""}</p>
                      <p>Phone : {items?.shop?.mobile ?? ""}</p> */}
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-md-3"></div>
                    <div className="col-md-9">
                      {data?.deal_type === "2" ? (
                        <div className="d-flex gap-4">
                          <p>Service Date: {data?.service_date ?? "N/A"}</p>
                          <p>
                            Service Time:{" "}
                            {data?.service_time
                              ? (() => {
                                  const [hours, minutes] = data.service_time
                                    .split(":")
                                    .map(Number);
                                  const period = hours >= 12 ? "PM" : "AM";
                                  const adjustedHours = hours % 12 || 12;
                                  return `${adjustedHours}:${minutes
                                    .toString()
                                    .padStart(2, "0")} ${period}`;
                                })()
                              : "N/A"}
                          </p>
                        </div>
                      ) : (
                        <div className="d-flex gap-4">
                          <p>Quantity: {data?.quantity ?? " "}</p>
                          <p>
                            Delivery Date:{" "}
                            {calculateDeliveryDate(
                              data?.created_at,
                              data?.product?.delivery_days ?? "N/A"
                            )}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="card mb-4">
                <div className="card-header m-0 p-2 d-flex justify-content-between align-items-center">
                  <p className="mb-0">Order Summary</p>
                  <p>
                    <span
                      className={
                        (data?.order?.payment_type?.replace(/_/g, " ") ??
                          "Pending") === "online payment"
                          ? "badge_default text-capitalize"
                          : "badge_payment text-capitalize"
                      }
                    >
                      {data?.order?.payment_type?.replace(/_/g, " ") ??
                        "Pending"}
                    </span>
                    &nbsp;
                    <span className="badge_warning text-capitalize">
                      {data?.order?.payment_status === "1"
                        ? "Not Paid"
                        : data?.order?.payment_status === "2"
                        ? "Pending"
                        : data?.order?.payment_status === "3"
                        ? "Paid"
                        : data?.order?.payment_status === "4"
                        ? "Refund Initiated"
                        : data?.order?.payment_status === "5"
                        ? "Refunded"
                        : data?.order?.payment_status === "6"
                        ? "Refund Error"
                        : "Unknown Status"}
                    </span>
                  </p>
                </div>
                <div className="card-body  m-0 p-4">
                  <div className="d-flex justify-content-between">
                    <span>
                      Subtotal&nbsp;
                      {data?.quantity !== 1 && (
                        <span style={{ fontSize: "smaller" }}>
                          (x{data.quantity})
                        </span>
                      )}
                    </span>
                    <span>
                      ₹
                      {new Intl.NumberFormat("en-IN", {
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 2,
                        useGrouping: true,
                      }).format(
                        parseFloat(data?.unit_price || 0) *
                          parseFloat(data?.quantity || 0)
                      )}
                    </span>
                  </div>
                  <div className="d-flex justify-content-between">
                    <span>
                      Discount&nbsp;
                      {data?.quantity !== 1 && (
                        <span style={{ fontSize: "smaller" }}>
                          (x{data.quantity})
                        </span>
                      )}
                    </span>
                    <span>
                      ₹
                      {new Intl.NumberFormat("en-IN", {
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 2,
                        useGrouping: true,
                      }).format(
                        parseFloat(data?.unit_price || 0) *
                          parseFloat(data?.quantity || 0) -
                          parseFloat(data?.discount || 0) *
                            parseFloat(data?.quantity || 0)
                      )}
                    </span>
                  </div>

                  <hr />
                  <div className="d-flex justify-content-between pb-3">
                    <span>
                      Total{" "}
                      {data?.quantity !== 1 && (
                        <span style={{ fontSize: "smaller" }}>
                          (x{data.quantity})
                        </span>
                      )}
                    </span>
                    <span>
                      ₹
                      {new Intl.NumberFormat("en-IN", {
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 2,
                        useGrouping: true,
                      }).format(
                        parseFloat(data?.discount || 0) *
                          parseFloat(data?.quantity || 0)
                      )}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-md-4">
              {/* <div className="card mb-2">
                <div className="card-header m-0 p-2">
                  <p className="mb-0">Notes</p>
                </div>
                <div className="card-body  m-0 p-4">
                  <p>{data.notes ?? "No notes available"}</p>
                </div>
              </div> */}

              <div className="card mb-2">
                <div className="card-header m-0 p-2">
                  <p className="mb-0">Customer</p>
                </div>
                <div className="card-body  m-0 p-4">
                  <p>Name : {data?.order?.customer?.name ?? "N/A"}</p>
                  <p>Email : {data?.order?.customer?.email ?? "N/A"}</p>
                </div>
              </div>

              {/* <div className="card mb-2">
                <div className="card-header m-0 p-2">
                  <p className="mb-0">Contact Information</p>
                </div>
                <div className="card-body  m-0 p-4">
                  <p>
                    Name :{" "}
                    {data?.order?.address?.first_name
                      ? `${data?.order?.address?.first_name} ${
                          data?.order?.address?.last_name || ""
                        }`
                      : "N/A"}
                  </p>
                  <p>
                    Email : {data?.order?.address?.email ?? "No Email provided"}
                  </p>
                  <p>
                    Phone :{" "}
                    {data?.order?.address?.phone ?? "No phone number provided"}
                  </p>
                </div>
              </div> */}

              <div className="card mb-2">
                <div className="card-header m-0 p-2">
                  <p className="mb-0">Contact Information</p>
                </div>
                <div className="card-body m-0 p-4">
                  {data?.order?.delivery_address &&
                    (() => {
                      try {
                        const deliveryAddress = JSON.parse(
                          data.order.delivery_address
                        );
                        return (
                          <>
                            <p>
                              Name: {deliveryAddress.first_name}{" "}
                              {deliveryAddress.last_name || ""}
                            </p>
                            <p>
                              Email:{" "}
                              {deliveryAddress.email || "No Email provided"}
                            </p>
                            <p>
                              Phone:{" "}
                              {deliveryAddress.phone ||
                                "No phone number provided"}
                            </p>
                          </>
                        );
                      } catch {
                        return <p>Invalid delivery address format</p>;
                      }
                    })()}
                </div>
              </div>

              <div className="card mb-2">
                <div className="card-header m-0 p-2">
                  <p className="mb-0">Address</p>
                </div>
                <div className="card-body m-0 p-4">
                  {data?.order?.delivery_address &&
                    (() => {
                      try {
                        const deliveryAddress = JSON.parse(
                          data.order.delivery_address
                        );
                        return (
                          <p>
                            {deliveryAddress.address},
                            {deliveryAddress.postalcode}{" "}
                            {deliveryAddress.unit &&
                              deliveryAddress.unit !== "null" &&
                              deliveryAddress.unit.trim() !== "" &&
                              ` - ${deliveryAddress.unit}`}
                          </p>
                        );
                      } catch {
                        return <p>Invalid delivery address format</p>;
                      }
                    })()}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export default OrderView;
