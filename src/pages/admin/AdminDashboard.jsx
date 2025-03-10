import { useEffect, useState } from "react";
import Chart from "react-apexcharts";
import dashboardcard1 from "../../assets/dashboard card1.webp";
import dashboardcard2 from "../../assets/dashboard card2.webp";
import dashboardcard3 from "../../assets/dashboard card3.webp";
import dashboardcard4 from "../../assets/dashboard card4.webp";
import dashboardcard5 from "../../assets/dashboard card5.webp";

function AdminDashboard() {
  const [currentWeek, setCurrentWeek] = useState("");
  const [state] = useState({
    options: {
      colors: ["#9349ff", "#FFB63A", "#74aef0"],
      chart: {
        id: "basic-bar",
        toolbar: {
          show: true,
          tools: {
            download: true,
            selection: false,
            zoom: true,
            zoomin: true,
            zoomout: true,
            pan: true,
            reset: true,
            customIcons: [],
          },
        },
      },
      dataLabels: {
        style: {
          fontFamily: "Kanit, sans-serif",
        },
      },
      legend: {
        labels: {
          style: {
            fontFamily: "Kanit, sans-serif",
          },
        },
      },
      xaxis: {
        categories: [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
          "Sunday",
        ],
        labels: {
          style: {
            fontFamily: "Kanit, sans-serif",
          },
        },
      },
      yaxis: {
        labels: {
          style: {
            fontFamily: "Kanit, sans-serif",
          },
        },
      },
      title: {
        style: {
          fontFamily: "Kanit, sans-serif",
        },
      },
    },
    series: [
      {
        name: "series-1",
        data: [30, 40, 45, 50, 49, 60, 70],
      },
      {
        name: "series-2",
        data: [3, 70, 5, 30, 22, 50, 80],
      },
      {
        name: "series-3",
        data: [30, 40, 45, 30, 49, 60, 70],
      },
    ],
  });
  const [showProducts, setShowProducts] = useState(false);
  const [products, setProducts] = useState([
    { name: "Laptop", selected: true },
    { name: "Mobile", selected: true },
    { name: "TV", selected: true },
    { name: "Product 4", selected: true },
    { name: "Product 5", selected: true },
    { name: "Product 6", selected: true },
    { name: "Product 7", selected: true },
    { name: "Product 8", selected: true },
    { name: "Product 9", selected: true },
  ]);
  const [selectAll, setSelectAll] = useState(true);

  const toggleShowProducts = () => {
    setShowProducts(!showProducts);
  };

  const handleSelectAll = () => {
    const newSelectAll = !selectAll;
    setSelectAll(newSelectAll);
    setProducts(
      products.map((product) => ({ ...product, selected: newSelectAll }))
    );
  };

  const handleProductSelect = (index) => {
    const updatedProducts = [...products];
    updatedProducts[index].selected = !updatedProducts[index].selected;
    setProducts(updatedProducts);

    const allSelected = updatedProducts.every((product) => product.selected);
    setSelectAll(allSelected);
  };
  useEffect(() => {
    const getCurrentWeek = () => {
      const currentDate = new Date();
      const firstDayOfYear = new Date(currentDate.getFullYear(), 0, 1);
      const pastDaysOfYear =
        (currentDate - firstDayOfYear) / (24 * 60 * 60 * 1000);
      const weekNumber = Math.ceil(
        (pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7
      );
      return `${currentDate.getFullYear()}-W${String(weekNumber).padStart(
        2,
        "0"
      )}`;
    };

    setCurrentWeek(getCurrentWeek());
  }, []);

  return (
    <div className="card shadow border-0 mx-4" style={{ minHeight: "90vh" }}>
      <div className="row card-container p-5">
        <div className="col-12 col-md-6 col-lg-3 mb-4">
          <div
            style={{
              background: "#1A2E86",
              borderRadius: "8px",
            }}
            className="card h-100"
          >
            <div className="card-content p-2">
              <div className="d-flex justify-content-between">
                <h2 className="text-white">9.823</h2>
                {/* <div>
                  <IoSettingsOutline className="text-white" />
                  <IoMdArrowDropdown className="text-white" />
                </div> */}
              </div>
              <p className="text-white">Deal Clicks</p>
              <div className="flex-grow-1">
                <img
                  src={dashboardcard1}
                  alt=""
                  className="img-fluid"
                  style={{ width: "100%" }}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="col-12 col-md-6 col-lg-3 mb-4">
          <div
            style={{
              background: "#237BFF",
              borderRadius: "8px",
            }}
            className="card h-100"
          >
            <div className="card-content p-2">
              <div className="d-flex justify-content-between">
                <h2 className="text-white">9.823</h2>
                {/* <div>
                  <IoSettingsOutline className="text-white" />
                  <IoMdArrowDropdown className="text-white" />
                </div> */}
              </div>
              <p className="text-white">Deal Views</p>
              <div className="flex-grow-1">
                <img
                  src={dashboardcard4}
                  alt=""
                  className="img-fluid"
                  style={{ width: "100%" }}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="col-12 col-md-6 col-lg-3 mb-4">
          <div
            style={{
              background: "#FFB63A",
              borderRadius: "8px",
            }}
            className="card h-100"
          >
            <div className="card-content p-2">
              <div className="d-flex justify-content-between">
                <h2 className="text-white">9.823</h2>
                {/* <div>
                  <IoSettingsOutline className="text-white" />
                  <IoMdArrowDropdown className="text-white" />
                </div> */}
              </div>
              <p className="text-white">Discount Copied</p>
              <div className="flex-grow-1">
                <img
                  src={dashboardcard3}
                  alt=""
                  className="img-fluid"
                  style={{ width: "100%" }}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="col-12 col-md-6 col-lg-3 mb-4">
          <div
            style={{
              background: "#eb4034",
              borderRadius: "8px",
            }}
            className="card h-100"
          >
            <div className="card-content p-2">
              <div className="d-flex justify-content-between">
                <h2 className="text-white">9.823</h2>
                {/* <div>
                  <IoSettingsOutline className="text-white" />
                  <IoMdArrowDropdown className="text-white" />
                </div> */}
              </div>
              <p className="text-white">Deal Shares</p>
              <div className="flex-grow-1">
                <img
                  src={dashboardcard5}
                  alt=""
                  className="img-fluid"
                  style={{ width: "100%" }}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="col-12 col-md-6 col-lg-3 mb-4">
          <div
            style={{
              background: "#fb8b33",
              borderRadius: "8px",
            }}
            className="card h-100"
          >
            <div className="card-content p-2">
              <div className="d-flex justify-content-between">
                <h2 className="text-white">9.823</h2>
                {/* <div>
                  <IoSettingsOutline className="text-white" />
                  <IoMdArrowDropdown className="text-white" />
                </div> */}
              </div>
              <p className="text-white">Deal Enquiries</p>
              <div className="flex-grow-1">
                <img
                  src={dashboardcard2}
                  alt=""
                  className="img-fluid"
                  style={{ width: "100%" }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* <div className="col-12 col-md-6 col-lg-3 mb-4">
          <div
            style={{
              background: "#52ae55",
              borderRadius: "8px",
            }}
            className="card h-100"
          >
            <div className="card-content p-2">
              <div className="d-flex justify-content-between">
                <h2 className="text-white">9.823</h2>
                <div>
                  <IoSettingsOutline className="text-white" />
                  <IoMdArrowDropdown className="text-white" />
                </div>
              </div>
              <p className="text-white">Members Online</p>
              <div className="flex-grow-1">
                <img
                  src={graph7}
                  alt=""
                  className="img-fluid"
                  style={{ width: "100%"}}
                />
              </div>
            </div>
          </div>
        </div> */}
      </div>
      <div className="row">
        <input
          type="week"
          className="form-control week-input  ms-5"
          style={{ boxShadow: "none", width: "250px" }}
          value={currentWeek}
          onChange={(e) => setCurrentWeek(e.target.value)}
        />
        <div className="col-12">
          <Chart
            options={state.options}
            series={state.series}
            type="area"
            width="100%"
            height="350"
          />
        </div>
        <div className="col-12">
          {products.length > 0 ? (
            <>
              <button
                onClick={toggleShowProducts}
                className="btn btn-sm m-2"
                style={{
                  background: "#cd8245",
                  color: "#fff",
                  boxShadow: "none",
                }}
              >
                {showProducts ? "Hide Products" : "View Products"}
              </button>
              {showProducts && (
                <div className="m-3">
                  <div className="mb-2">
                    <input
                      type="checkbox"
                      checked={selectAll}
                      onChange={handleSelectAll}
                      id="selectAll"
                      disabled
                    />
                    <label htmlFor="selectAll" className="ms-2 fw-medium">
                      Select All
                    </label>
                  </div>
                  <div className="row">
                    {products.map((product, index) => (
                      <div className="col-md-4 mb-2" key={index}>
                        <input
                          type="checkbox"
                          checked={product.selected}
                          onChange={() => handleProductSelect(index)}
                          id={`product-${index}`}
                        />
                        <label
                          htmlFor={`product-${index}`}
                          className="ms-3 fw-medium"
                        >
                          {product.name}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          ) : (
            <p className="m-4">There is nothing to show at the moment here</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
