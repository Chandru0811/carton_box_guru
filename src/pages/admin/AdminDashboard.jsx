import { useEffect, useState } from "react";
import Chart from "react-apexcharts";
import dashboardcard1 from "../../assets/dashboard card1.webp";
import dashboardcard2 from "../../assets/dashboard card2.webp";
import dashboardcard3 from "../../assets/dashboard card3.webp";
import dashboardcard4 from "../../assets/dashboard card4.webp";
import dashboardcard5 from "../../assets/dashboard card5.webp";
import toast from "react-hot-toast";
import api from "../../config/URL";
import { Link } from "react-router-dom";
import { MdAddBox } from "react-icons/md";

function AdminDashboard() {
  const [currentWeek, setCurrentWeek] = useState("");
  const [maxWeek, setMaxWeek] = useState("");
  const [data, setData] = useState(null);
  const [state, setState] = useState({
    options: {
      colors: ["#1A2E86", "#237BFF", "#FFB63A", "#eb4034", "#fb8b33"],
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
    series: [],
  });
  const [showProducts, setShowProducts] = useState(false);
  const [products, setProducts] = useState([]);
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
    const updatedProducts = products.map((product, i) =>
      i === index ? { ...product, selected: !product.selected } : product
    );
    setProducts(updatedProducts);

    const allSelected = updatedProducts.every((product) => product.selected);
    setSelectAll(allSelected);
  };

  const fetchDataForWeek = async (week) => {
    try {
      const response = await api.post("admin/dashboard", {
        week: week,
      });
      const { series } = response.data;

      // Update chart data
      setState((prevState) => ({
        ...prevState,
        series: series,
      }));
    } catch {
      toast.error("Error Fetching Chart Data");
    }
  };

  useEffect(() => {
    const getCurrentWeek = () => {
      const currentDate = new Date();

      currentDate.setHours(0, 0, 0, 0);

      const thursday = new Date(currentDate);
      thursday.setDate(
        currentDate.getDate() + (3 - ((currentDate.getDay() + 6) % 7))
      );

      const firstThursday = new Date(thursday.getFullYear(), 0, 1);
      firstThursday.setDate(
        firstThursday.getDate() + (3 - ((firstThursday.getDay() + 6) % 7))
      );

      const weekNumber =
        Math.floor((thursday - firstThursday) / (7 * 24 * 60 * 60 * 1000)) + 1;

      return `${thursday.getFullYear()}-W${String(weekNumber).padStart(
        2,
        "0"
      )}`;
    };

    setCurrentWeek(getCurrentWeek());
    setMaxWeek(getCurrentWeek());
  }, []);

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await api.get(`admin/dashboard`);
        const { data } = response.data;

        // Set initial chart data
        setState((prevState) => ({
          ...prevState,
          series: data.chatdata.series,
        }));

        // Set other data (total clicks, views, products)
        setData(data);
        setProducts(
          data.products.map((product) => ({
            ...product,
            selected: true, // Initially, all products selected
          }))
        );
      } catch {
        toast.error("Error Fetching Data");
      }
    };

    getData();
  }, []);

  const getCategories = () => {
    const width = window.innerWidth;
    if (width > 1200) {
      return [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
      ];
    } else if (width > 768) {
      return ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    } else {
      return ["M", "T", "W", "T", "F", "S", "S"];
    }
  };

  useEffect(() => {
    const handleResize = () => {
      setState((prevState) => ({
        ...prevState,
        options: {
          ...prevState.options,
          xaxis: {
            categories: getCategories(),
          },
        },
      }));
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const handleWeekChange = (e) => {
    const newWeek = e.target.value;
    setCurrentWeek(newWeek);
    if (newWeek) {
      fetchDataForWeek(newWeek); // Fetch data for the selected week
    }
  };

  return (
    <div className="card shadow border-0 mx-4" style={{ minHeight: "90vh" }}>
      <div className="d-flex justify-content-between pt-4 pe-5">
        <p className="px-5">
          You currently have{" "}
          {data?.totaldealcount === 0
            ? data.totaldealcount
            : data?.totaldealactivecount}
          {data?.totaldealcount === 0 ? " deals" : " active deals"} registered
          with us.
        </p>
        <Link to="/product/add">
          <button className="btn btn-sm btn-button shadow-none border-none py-3">
            <MdAddBox size={20} /> Add Deal
          </button>
        </Link>
      </div>
      <div className="row card-container p-5">
        <div className="col-12 col-md-6 col-lg-3 mb-4">
          <div
            className="card h-100"
            style={{
              background: "#1A2E86",
              borderRadius: "8px",
            }}
          >
            <div className="card-content p-2">
              <div className="d-flex justify-content-between">
                <h2 className="text-white">{data?.totaldealclicks}</h2>
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
            className="card h-100"
            style={{
              background: "#237BFF",
              borderRadius: "8px",
            }}
          >
            <div className="card-content p-2">
              <div className="d-flex justify-content-between">
                <h2 className="text-white">{data?.totaldealviews}</h2>
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
            className="card h-100"
            style={{
              background: "#FFB63A",
              borderRadius: "8px",
            }}
          >
            <div className="card-content p-2">
              <div className="d-flex justify-content-between">
                <h2 className="text-white">{data?.totaldiscountcopied}</h2>
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
            className="card h-100"
            style={{
              background: "#eb4034",
              borderRadius: "8px",
            }}
          >
            <div className="card-content p-2">
              <div className="d-flex justify-content-between">
                <h2 className="text-white">{data?.totaldealshared}</h2>
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
            className="card h-100"
            style={{
              background: "#fb8b33",
              borderRadius: "8px",
            }}
          >
            <div className="card-content p-2">
              <div className="d-flex justify-content-between">
                <h2 className="text-white">{data?.totaldealenquired}</h2>
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

        <div className="col-12 col-md-6 col-lg-3 mb-4">
          <div
            className="card h-100"
            style={{
              background: "#45c457",
              borderRadius: "8px",
            }}
          >
            <div className="card-content p-2">
              <div className="d-flex justify-content-between">
                <h2 className="text-white">{data?.totalorderscount}</h2>
                {/* <div>
                  <IoSettingsOutline className="text-white" />
                  <IoMdArrowDropdown className="text-white" />
                </div> */}
              </div>
              <p className="text-white">Order Counts</p>
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

        {/* Uncomment to add more cards */}
        {/* <div className="col-12 col-md-6 col-lg-3 mb-4">
    <Card
      style={{
        background: "#52ae55",
        borderRadius: "8px",
      }}
      className="h-100"
    >
      <div className="card-content p-2">
        <div className="d-flex justify-content-between">
          <h2 className="text-white">{data?.totalproductscount}</h2>
          <div>
            <IoSettingsOutline className="text-white" />
            <IoMdArrowDropdown className="text-white" />
          </div>
        </div>
        <p className="text-white mt-3">Active Products</p>
      </div>
    </Card>
  </div> */}
      </div>

      <div className="row">
        <input
          type="week"
          className="form-control week-input ms-5"
          style={{ boxShadow: "none", width: "250px" }}
          value={currentWeek}
          onChange={handleWeekChange} // Call function to fetch data for selected week
          max={maxWeek} // Disable selection for future weeks
        />
        <div className="col-12">
          {currentWeek ? (
            <Chart
              options={state.options}
              series={state.series}
              type="area"
              width="100%"
              height={350}
            />
          ) : (
            <p className="d-flex justify-content-center align-items-center py-5">
              A week has not yet been selected. Kindly select a week to view the
              chart.
            </p>
          )}
        </div>
        <div className="col-12">
          {products.length > 0 ? (
            <>
              <button
                onClick={toggleShowProducts}
                className="btn m-4"
                style={{
                  background: "#ef4444",
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
                          disabled
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
