import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MaterialReactTable } from "material-react-table";
import { ThemeProvider, createTheme } from "@mui/material";
import api from "../../../config/URL";
import toast from "react-hot-toast";

function User() {
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
      { accessorKey: "name", header: "Name" },
      { accessorKey: "email", header: "Email" },
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
      const response = await api.get("admin/users");
      const sliderData = response.data.data;
      setData(sliderData);
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
          <h6>Users</h6>
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
                  updated_at: false,
                },
              }}
              muiTableBodyRowProps={({ row }) => ({
                onClick: () => navigate(`/user/view/${row.original.id}`),
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

User.propTypes = {
  row: PropTypes.shape({
    original: PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    }).isRequired,
  }).isRequired,
};

export default User;
