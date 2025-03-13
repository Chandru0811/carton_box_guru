import React, { useState } from "react";
import { Button } from "react-bootstrap";
import { Dialog, DialogActions, DialogTitle, Slide } from "@mui/material";
import PropTypes from "prop-types";
import toast from "react-hot-toast";
import { FiAlertTriangle } from "react-icons/fi";
import api from "../../config/URL";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="down" ref={ref} {...props} />;
});

function AdminDelete({ path, onDeleteSuccess, onOpen }) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [loadIndicator, setLoadIndicator] = useState(false);

  const handleOpenDialog = () => {
    setDeleteDialogOpen(true);
    document.body.style.overflow = "hidden";
  };

  const handleCloseDialog = () => {
    if (typeof onOpen === "function") onOpen();
    setDeleteDialogOpen(false);
    document.body.style.overflow = "";
  };

  const handleDelete = async () => {
    try {
      setLoadIndicator(true);
      const response = await api.delete(path);
      if (response.status === 200 || response.status === 201) {
        onDeleteSuccess();
        toast.success(response?.data?.message);
        if (typeof onOpen === "function") onOpen();
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
        toast.error("An error occurred while deleting the record.");
      }
    } finally {
      handleCloseDialog();
      setLoadIndicator(false);
    }
  };

  return (
    <>
      <p
        className="text-start mb-0 p-2"
        style={{ whiteSpace: "nowrap", width: "100%" }}
        onClick={handleOpenDialog}
      >
        <span className="px-2">
        Delete
        </span>
      </p>

      <Dialog
        open={deleteDialogOpen}
        onClose={handleCloseDialog}
        TransitionComponent={Transition}
        keepMounted
        sx={{
          "& .MuiDialog-paper": {
            margin: "0 auto",
            top: "10%",
            position: "absolute",
          },
        }}
      >
        <DialogTitle>Are you sure you want to delete this record?</DialogTitle>
        <DialogActions>
          <Button
            onClick={handleCloseDialog}
            className="btn btn-secondary btn-sm"
          >
            Cancel
          </Button>
          <Button
            onClick={handleDelete}
            disabled={loadIndicator}
            className="btn btn-button btn-sm"
          >
            {loadIndicator && (
              <span
                className="spinner-border spinner-border-sm me-2"
                aria-hidden="true"
              ></span>
            )}
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

AdminDelete.propTypes = {
  path: PropTypes.string.isRequired,
  onOpen: PropTypes.func.isRequired,
  onDeleteSuccess: PropTypes.func.isRequired,
};

export default AdminDelete;
