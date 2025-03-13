import  { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { PiPlusSquareFill } from "react-icons/pi";
import * as Yup from "yup";
import { useFormik } from "formik";
import Select from "react-select";
import api from "../../../config/URL";
import toast from "react-hot-toast";
import { FiAlertTriangle } from "react-icons/fi";

const validationSchema = Yup.object().shape({
  orders: Yup.array().of(Yup.string().required("Order selection is required")),
});

function ProductOrder() {
  const [options, setOptions] = useState([]);
  const [initialOrders, setInitialOrders] = useState([]);
  const [loadIndicator, setLoadIndicator] = useState(false);
  const [loading, setLoading] = useState([]);

  const formik = useFormik({
    initialValues: { orders: initialOrders },
    enableReinitialize: true,
    validationSchema,
    onSubmit: async (values) => {
      const formattedOrders = values.orders.map((product_id, index) => ({
        order: index + 1,
        product_id: parseInt(product_id, 10),
      }));

      setLoadIndicator(true);

      try {
        const response = await api.post(
          `admin/update-product-order`,
          formattedOrders
        );
        if (response.status === 200) {
          toast.success(response.data.message);
          getOrderedProducts();
        } else {
          toast.error(response.data.message);
        }
      } catch (error) {
        if (error.response && error.response.status === 422) {
          const errors = error.response.data.errors;
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

  const addOrder = () => {
    formik.setValues({
      ...formik.values,
      orders: [...formik.values.orders, ""],
    });
  };

  const getProductList = async () => {
    try {
      const response = await api.get("admin/getAllProductList");
      setOptions(response.data.data);
    } catch (e) {
      console.log("Error Fetching Data");
    }
  };

  const getOrderedProducts = async () => {
    setLoading(true);
    try {
      const response = await api.get("admin/getOrderedProducts");
      const orderedData = response.data.data.map((product) => product.value);
      setInitialOrders(orderedData);
    } catch (e) {
      console.log("Error Fetching Ordered Products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getProductList();
    getOrderedProducts();
  }, []);

  const removeOrder = (index) => {
    const updatedOrders = [...formik.values.orders];
    updatedOrders.splice(index, 1);

    formik.setValues({
      ...formik.values,
      orders: updatedOrders.length > 0 ? updatedOrders : [""], 
    });
  };


  return (
    <section>
      {loading ? (
        <div className="loader-container">
          <div className="loader">
            <svg viewBox="0 0 80 80">
              <circle cx="40" cy="40" r="32"></circle>
            </svg>
          </div>
        </div>
      ) : (
        <form onSubmit={formik.handleSubmit}>
          <section className="px-4">
            <div className="card shadow border-0 mb-2 top-header">
              <div className="container-fluid py-0">
                <div className="row align-items-center">
                  <div className="col">
                    <h1 className="h4 ls-tight headingColor">Select Order</h1>
                  </div>
                  <div className="col-auto">
                    <div className="hstack gap-2 justify-content-end">
                      <Link to="/products">
                        <button type="button" className="btn btn-light btn-sm">
                          Back
                        </button>
                      </Link>
                      <button
                        type="submit"
                        className="btn btn-sm btn-button shadow-none border-0"
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
                </div>
              </div>
            </div>

            <div className="card shadow border-0 py-4 mb-2 top-header" style={{ minHeight: "70vh" }}>
              <div className="container-fluid py-0">
                <div className="row py-4">
                  {formik.values.orders.map((_, index) => (
                    <div
                      className="col-md-6 col-12 mb-3 d-flex align-items-end"
                      key={index}
                    >
                      <div className="flex-grow-1">
                        <label className="form-label">Order {index + 1}</label>

                        {/* React-Select Dropdown */}
                        <Select
                          options={options}
                          name={`orders.${index}`}
                          value={options.find(
                            (option) =>
                              option.value === formik.values.orders[index]
                          )}
                          onChange={(selectedOption) =>
                            formik.setFieldValue(
                              `orders.${index}`,
                              selectedOption?.value || ""
                            )
                          }
                          placeholder="Search & select product..."
                          isSearchable
                        />

                        {formik.errors.orders &&
                          formik.errors.orders[index] && (
                            <div className="text-danger">
                              {formik.errors.orders[index]}
                            </div>
                          )}
                      </div>

                      {/* Delete Button (Hidden if only one order remains) */}
                      {formik.values.orders.length > 1 && (
                        <button
                          type="button"
                          className="btn btn-sm"
                          onClick={() => removeOrder(index)}
                        >
                          ❌
                        </button>
                      )}
                    </div>
                  ))}

                  <div className="col-12 d-flex justify-content-end">
                    <button
                      type="button"
                      className="btn btn-sm btn-primary shadow-none border-0"
                      onClick={addOrder}
                    >
                      <PiPlusSquareFill size={20} /> Add More
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </form>
      )}
    </section>
  );
}

export default ProductOrder;
