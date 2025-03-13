import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MaterialReactTable } from "material-react-table";
import {
  ThemeProvider,
  createTheme,
  Menu,
  MenuItem,
  IconButton,
} from "@mui/material";
import { MoreVert as MoreVertIcon } from "@mui/icons-material";
import api from "../../../config/URL";
import toast from "react-hot-toast";

function Products() {
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [selectedId, setSelectedId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const navigate = useNavigate();

  const columns = useMemo(
    () => [
      {
        accessorFn: (row, index) => index + 1,
        header: "S.NO",
        size: 40,
        cell: ({ cell }) => (
          <span style={{ textAlign: "center" }}>{cell.getValue()}</span>
        ),
      },
      {
        accessorKey: "id",
        header: "Actions",
        size: 50,
        Cell: ({ row }) => (
          <IconButton
            onClick={(e) => {
              e.stopPropagation();
              setMenuAnchor(e.currentTarget);
              setSelectedId(row.original.id);
            }}
          >
            <MoreVertIcon />
          </IconButton>
        ),
      },
      { accessorKey: "name", header: "Title" },
      {
        accessorKey: "original_price",
        header: "Original Price",
        Cell: ({ cell }) => {
          const value = parseFloat(cell.getValue());
          return value % 1 === 0 ? value.toFixed(0) : value.toFixed(2);
        },
      },
      {
        accessorKey: "discounted_price",
        header: "Discount Price",
        Cell: ({ cell }) => {
          const value = parseFloat(cell.getValue());
          return value % 1 === 0 ? value.toFixed(0) : value.toFixed(2);
        },
      },
      {
        accessorKey: "country",
        header: "Country",
        Cell: ({ row }) => row.original.country?.country_name || "N/A",
      },
      {
        accessorKey: "description",
        header: "Description",
        Cell: ({ cell }) => (
          <div className="truncate-text" title={cell.getValue()}>
            {cell.getValue()}
          </div>
        ),
      },
      {
        accessorKey: "created_at",
        header: "Created At",
        enableHiding: true,
        Cell: ({ cell }) => cell.getValue()?.substring(0, 10),
      },
      {
        accessorKey: "updated_at",
        header: "Updated At",
        enableHiding: true,
        Cell: ({ cell }) => cell.getValue()?.substring(0, 10) || "",
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
  const getData = async (shopId) => {
    try {
      setLoading(true);
      const response = await api.get(`admin/product/${shopId}`);
      const productData = response.data.data;
      setData(productData);
      console.log("productData: ", productData);
    } catch (e) {
      toast.error(e.response?.data?.message || "Error Fetching Data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const shopId = 1;
    getData(shopId);
  }, []);

  const handleMenuClose = () => setMenuAnchor(null);

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, []);

  return (
    <div className="p-2">
      <div className="card my-3">
        <div className="d-flex justify-content-between align-items-center p-2">
          <h6>Deals</h6>
          <div className="d-flex gap-2">
            <Link to="/products/order">
              <button className="btn btn-sm add_btn">Select Order</button>
            </Link>
            <Link to="/products/add" className="btn btn-sm add_btn">
              Add Deal
            </Link>
          </div>
        </div>
      </div>
      <div className="card border-0 p-3" style={{ minHeight: "90vh" }}>
        <ThemeProvider theme={theme}>
          {loading ? (
            <div className="loader-container">
              <div className="loader">
                <svg viewBox="0 0 80 80">
                  <circle cx="40" cy="40" r="32"></circle>
                </svg>
              </div>
            </div>
          ) : (
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
                  updated_at: false,
                },
              }}
              muiTableBodyRowProps={({ row }) => ({
                onClick: () => navigate(`/products/view/${row.original.id}`),
                style: { cursor: "pointer" },
              })}
            />
          )}
        </ThemeProvider>
        <Menu
          anchorEl={menuAnchor}
          open={Boolean(menuAnchor)}
          onClose={handleMenuClose}
        >
          <MenuItem onClick={() => navigate(`/products/edit/${selectedId}`)}>
            <span className="px-4">Edit</span>
          </MenuItem>
          <MenuItem>
            <AdminDelete
              path={`admin/product/${selectedId}/delete`}
              onDeleteSuccess={() => getData(1)}
              onOpen={handleMenuClose}
            />
          </MenuItem>
        </Menu>
      </div>
    </div>
  );
}

import PropTypes from "prop-types";
import AdminDelete from "../../../components/admin/AdminDelete";

Products.propTypes = {
  row: PropTypes.shape({
    original: PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    }).isRequired,
  }).isRequired,
  cell: PropTypes.shape({
    getValue: PropTypes.func.isRequired,
  }).isRequired,
};

export default Products;
