import PropTypes from "prop-types";

function Auth({ loginAsAdmin }) {
  return (
    <div>
      Auth
      <button className="btn btn-success" onClick={loginAsAdmin}>
        Login
      </button>
    </div>
  );
}
Auth.propTypes = {
  loginAsAdmin: PropTypes.func.isRequired, // Define prop validation
};

export default Auth;
