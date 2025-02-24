import PropTypes from "prop-types";
import Login from "../components/auth/Login";
import { BrowserRouter, Route, Routes } from "react-router-dom";

function Auth({ loginAsAdmin }) {
  return (
    <div>
      <BrowserRouter basename="/cartonBoxAdmin">
        <Routes>
          <Route path="/" element={<Login loginAsAdmin={loginAsAdmin} />} />
          <Route path="*" element={<Login loginAsAdmin={loginAsAdmin} />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

Auth.propTypes = {
  loginAsAdmin: PropTypes.func.isRequired,
};

export default Auth;
