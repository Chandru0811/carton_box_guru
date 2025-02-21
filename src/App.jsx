import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import "./styles/common.css";
import "./styles/custom.css";
import Admin from "./layouts/Admin";
// import Vendor from "./layouts/Vendor";
import Auth from "./layouts/Auth";

function App() {
  const [
    carton_box_guru_isAdminAuthenticated,
    setcarton_box_guru_isAdminAuthenticated,
  ] = useState(false);
  // const [carton_box_guru_isVendorAuthenticated, setcarton_box_guru_isVendorAuthenticated] =
  //   useState(false);

  const loginAsAdmin = () => {
    // alert("hii")
    localStorage.setItem("carton_box_guru_isAdminAuthenticated", true);
    setcarton_box_guru_isAdminAuthenticated(true);
  };

  // const loginAsVendor = () => {
  //   localStorage.setItem("carton_box_guru_isVendorAuthenticated", true);
  //   setcarton_box_guru_isVendorAuthenticated(true);
  // };

  const logout = async () => {
    try {
      toast.success("Logged out successfully");
      setcarton_box_guru_isAdminAuthenticated(false);
      // setcarton_box_guru_isVendorAuthenticated(false);
      localStorage.removeItem("carton_box_guru_isAdminAuthenticated");
      // localStorage.removeItem("carton_box_guru_isVendorAuthenticated");
      localStorage.removeItem("carton_box_guru_token");
      localStorage.removeItem("carton_box_guru_name");
      localStorage.removeItem("carton_box_guru_id");
      localStorage.removeItem("carton_box_guru_email");
      localStorage.removeItem("carton_box_guru_role");
      localStorage.removeItem("carton_box_guru_mobile");
      localStorage.removeItem("carton_box_guru_shop_id");
      localStorage.removeItem("carton_box_guru_active");
    } catch (e) {
      toast.error("Logout unsuccessful", e?.response?.data?.message);
    }
  };

  useEffect(() => {
    const isAdminAuthFromStorage = localStorage.getItem(
      "carton_box_guru_isAdminAuthenticated"
    );
    // const isVendorAuthFromStorage = localStorage.getItem(
    //   "carton_box_guru_isVendorAuthenticated"
    // );

    if (isAdminAuthFromStorage === "true") {
      setcarton_box_guru_isAdminAuthenticated(true);
    }
    // else if (isVendorAuthFromStorage === "true") {
    //   setcarton_box_guru_isVendorAuthenticated(true);
    // }
  }, []);

  return (
    <div>
      <Toaster
        toastOptions={{
          style: {
            background: "rgb(51 65 85)",
            color: "#fff",
          },
        }}
      />
      {carton_box_guru_isAdminAuthenticated ? (
        <Admin handleLogout={logout} />
      ) : (
        <Auth
          loginAsAdmin={loginAsAdmin}
          // loginAsVendor={loginAsVendor}
        />
      )}
    </div>
  );
}

export default App;
