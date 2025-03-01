import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MaterialReactTable } from "material-react-table";
import { ThemeProvider, createTheme } from "@mui/material";
import api from "../../../config/URL";
import toast from "react-hot-toast";

function Orders() {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const navigate = useNavigate();
  const shopId = localStorage.getItem("carton_box_guru_shop_id");

  const columns = useMemo(
    () => [
      {
        accessorFn: (row, index) => index + 1,
        header: "S.NO",
        size: 40,
      },
      { accessorKey: "item_number", header: "Order Number" },
      {
        accessorFn: (row) => row.order.customer.name,
        header: "Customer Name",
      },
      {
        accessorKey: "unit_price",
        header: "Total",
        Cell: ({ cell }) => {
          const value = parseFloat(cell.getValue());
          return value % 1 === 0 ? value.toFixed(0) : value.toFixed(2);
        },
      },      
      { accessorKey: "item_description", header: "Proudct Name" ,Cell: ({ cell }) => (
        <div className="truncate-text" title={cell.getValue()}>
          {cell.getValue()}
        </div>
      ),},
      {
        accessorFn: (row) => row.shop.legal_name,
        header: "Shop Name",
        Cell: ({ cell }) => (
          <div className="truncate-text" title={cell.getValue()}>
            {cell.getValue()}
          </div>
        ),
      },
      {
        accessorKey: "created_at",
        enableHiding: true,
        header: "Created At",
        Cell: ({ cell }) => cell.getValue()?.substring(0, 10),
      },
      {
        accessorKey: "updated_at",
        enableHiding: true,
        header: "Updated At",
        Cell: ({ cell }) =>
          cell.getValue() ? cell.getValue().substring(0, 10) : "",
      },
    ],
    []
  );

  const theme = createTheme({
    components: {
      MuiTableCell: {
        styleOverrides: {
          head: {
            color: "#535454",
            backgroundColor: "#e6edf7",
            fontWeight: 400,
            fontSize: "13px",
            textAlign: "center",
          },
        },
      },
    },
  });

  const getData = async () => {
    try {
      setLoading(true);
      const response = await api.get(`orders/${shopId}`);
      setData(response.data.data);
    } catch (e) {
      toast.error(e.response?.data?.message || "Error Fetching Data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <div className="p-2">
      <div className="card my-3">
        <div className="d-flex justify-content-between align-items-center p-2">
          <h6>Country</h6>
        </div>
      </div>
      <div className="card border-0 p-3" style={{ minHeight: "90vh" }}>
        {loading ? (
          <div className="loader-container">
            <div className="loader">
              <svg viewBox="0 0 80 80">
                <circle cx="40" cy="40" r="32"></circle>
              </svg>
            </div>
          </div>
        ) : (
          <ThemeProvider theme={theme}>
            <MaterialReactTable
              columns={columns}
              data={data}
              enableColumnActions={true}
              enableColumnFilters={false}
              enableDensityToggle={false}
              enableFullScreenToggle={false}
              initialState={{
                columnVisibility: {
                  created_at: false,
                  updated_at: false
                },
              }}
              muiTableBodyRowProps={({ row }) => ({
                onClick: () =>
                  navigate(
                    `/order/${row.original.order_id}/${row.original.product_id}`
                  ),
                style: { cursor: "pointer" },
              })}
            />
          </ThemeProvider>
        )}
      </div>
    </div>
  );
}

import PropTypes from "prop-types";

Orders.propTypes = {
  row: PropTypes.shape({
    original: PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    }).isRequired,
  }).isRequired,
};

export default Orders;
