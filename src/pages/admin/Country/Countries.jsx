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

function Countries() {
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
      { accessorKey: "country_name", header: "Country Name" },
      { accessorKey: "email", header: "Email" },
      { accessorKey: "phone", header: "Phone" },
      { accessorKey: "address", header: "Address" },
      {
        accessorKey: "created_at",
        header: "Created At",
        Cell: ({ cell }) => cell.getValue()?.substring(0, 10),
      },
      {
        accessorKey: "updated_at",
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
      const response = await api.get("country");
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

  const handleMenuClose = () => setMenuAnchor(null);

  return (
    <div className="p-2">
      <div className="card my-3">
        <div className="d-flex justify-content-between align-items-center p-2">
          <h6>Country</h6>
          <Link to="/country/add" className="btn btn-sm add_btn">
            Add Country
          </Link>
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
              enableColumnActions={false}
              enableColumnFilters={false}
              enableDensityToggle={false}
              enableFullScreenToggle={false}
              muiTableBodyRowProps={({ row }) => ({
                onClick: () => navigate(`/country/view/${row.original.id}`),
                style: { cursor: "pointer" },
              })}
            />
          </ThemeProvider>
        )}
        <Menu
          anchorEl={menuAnchor}
          open={Boolean(menuAnchor)}
          onClose={handleMenuClose}
        >
          <MenuItem onClick={() => navigate(`/country/edit/${selectedId}`)}>
            Edit
          </MenuItem>
          <MenuItem>
            <AdminDelete
              path={`country/${selectedId}`}
              onDeleteSuccess={getData}
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

Countries.propTypes = {
  row: PropTypes.shape({
    original: PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    }).isRequired,
  }).isRequired,
};

export default Countries;
