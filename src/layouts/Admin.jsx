import PropTypes from "prop-types";

function Admin({ handleLogout }) {
  return (
    <div>
      Admin{" "}
      <button className="btn btn-danger" onClick={handleLogout}>
        Logout
      </button>
    </div>
  );
}

Admin.propTypes = {
  handleLogout: PropTypes.func.isRequired, // Define prop validation
};

export default Admin;
