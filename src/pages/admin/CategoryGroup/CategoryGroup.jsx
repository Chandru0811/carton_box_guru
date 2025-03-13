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

function CategoryGroup() {
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
      { accessorKey: "name", header: "Name" },
      { accessorKey: "order", header: "Order" },
      {
        accessorKey: "country",
        header: "Country",
        Cell: ({ row }) => row.original.country?.country_name || "N/A",
      },
      {
        accessorKey: "active",
        enableHiding: false,
        header: "Status",
        Cell: ({ row }) =>
          row.original.active === 1 ? (
            <span className="badge cb_badges_status1 fw-light">Active</span>
          ) : row.original.active === 0 ? (
            <span className="badge cb_badges_status2  fw-light">In Active</span>
          ) : null,
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

  const getData = async () => {
    try {
      setLoading(true);
      const response = await api.get("admin/categoryGroup");
      const categoryGroupData = response.data.data;
      setData(categoryGroupData);
      // console.log("categoryGroupData: ", categoryGroupData);
    } catch (e) {
      toast.error(e.response?.data?.message || "Error Fetching Data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getData();
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
          <h6>Category Group</h6>
          <Link to="/categorygroup/add" className="btn btn-sm add_btn">
            Add Category Group
          </Link>
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
                onClick: () =>
                  navigate(`/categorygroup/view/${row.original.id}`),
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
          <MenuItem
            onClick={() => navigate(`/categorygroup/edit/${selectedId}`)}
          >
            <span className="px-4">Edit</span>
          </MenuItem>
          {/* <MenuItem>
            <AdminDelete
              path={`categoryGroup/${selectedId}`}
              onDeleteSuccess={getData}
              onOpen={handleMenuClose}
            />
          </MenuItem> */}
        </Menu>
      </div>
    </div>
  );
}

import PropTypes from "prop-types";
// import AdminDelete from "../../../components/admin/AdminDelete";

CategoryGroup.propTypes = {
  row: PropTypes.shape({
    original: PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      active: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    }).isRequired,
  }).isRequired,
};

export default CategoryGroup;
