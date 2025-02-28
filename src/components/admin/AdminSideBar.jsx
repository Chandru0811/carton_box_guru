import PropTypes from "prop-types";
import { useState } from "react";
import { NavLink } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { BiLogOut, BiSolidCategory, BiSolidCategoryAlt } from "react-icons/bi";
import { TbShoppingCartFilled, TbWorld } from "react-icons/tb";
import { BsBarChartFill } from "react-icons/bs";
import headerlogo from "../../assets/images/cb_logo.png";
import { FaBoxOpen, FaSliders } from "react-icons/fa6";
import { MdCategory } from "react-icons/md";

function AdminSideBar({ handleLogout }) {
  const navigate = useNavigate();
  const handelLogOutClick = () => {
    handleLogout();
    navigate("/");
  };

  const [leadMenuOpen] = useState(false);

  const [activeSubmenu] = useState(null);

  return (
    <nav
      className="navbar show navbar-vertical navbar-expand-lg p-0 navbar-light border-bottom border-bottom-lg-0 border-end-lg"
      id="navbarVertical"
      style={{ backgroundColor: "#cd8245" }}
    >
      <div className="container-fluid">
        <button
          className="navbar-toggler mx-2 p-1"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#sidebarCollapse"
          aria-controls="sidebarCollapse"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <NavLink
          className={`navbar-brand nav-logo logo_ats py-lg-2 px-lg-6 m-0 d-flex align-items-center justify-content-center gap-3 ${
            leadMenuOpen || activeSubmenu ? "active" : ""
          }`}
          to="/"
          // style={{position:"fixed",top:"0", minWidth:'18.1%'}}
        >
          <img
            src={headerlogo}
            alt="deals"
            className="img-fluid"
            style={{
              background: "#fff",
            }}
          />
        </NavLink>
        <div
          className="collapse navbar-collapse"
          id="sidebarCollapse"
          // style={{ marginTop: "5rem" }}
        >
          <ul className="navbar-nav">
            <li className="nav-item">
              <NavLink className="nav-link title_nav" to="/dashboard">
                <BsBarChartFill /> Dashboard
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link title_nav" to="/countries">
                <TbWorld />
                Countries
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link title_nav" to="/slider">
                <FaSliders />
                Slider
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link title_nav" to="/categorygroup">
                <BiSolidCategoryAlt />
                Category Groups
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link title_nav" to="/categories">
                <BiSolidCategory />
                Categories
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link title_nav" to="/dealcategories">
                <MdCategory />
                Deal Categories
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link title_nav" to="/products">
                <TbShoppingCartFilled />
                Deals
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link title_nav" to="/orders">
                <FaBoxOpen />
                Oders
              </NavLink>
            </li>
          </ul>
          <div className=" mt-auto w-100 mb-1">
            <div className="navbar-nav">
              <div className="nav-item">
                <button
                  to={"#"}
                  style={{ width: "100%" }}
                  className="nav-link ps-6 logout_button title_nav"
                  onClick={handelLogOutClick}
                >
                  <BiLogOut />
                  &nbsp;&nbsp; Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
AdminSideBar.propTypes = {
  handleLogout: PropTypes.func.isRequired,
};

export default AdminSideBar;
