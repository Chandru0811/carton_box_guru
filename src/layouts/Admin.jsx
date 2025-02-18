import PropTypes from "prop-types";
import AdminDashboard from "../pages/admin/AdminDashboard";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import AdminSideBar from "../components/admin/AdminSideBar";
import AdminHeader from "../components/admin/AdminHeader";
import AdminFooter from "../components/admin/AdminFooter";
import Slider from "../pages/admin/Slider/Slider";
import SliderAdd from "../pages/admin/Slider/SliderAdd";
import SliderEdit from "../pages/admin/Slider/SliderEdit";
import SliderView from "../pages/admin/Slider/SliderView";
import CategoryGroup from "../pages/admin/CategoryGroup/CategoryGroup";
import CategoryGroupAdd from "../pages/admin/CategoryGroup/CategoryGroupAdd";
import CategoryGroupEdit from "../pages/admin/CategoryGroup/CategoryGroupEdit";
import CategoryGroupView from "../pages/admin/CategoryGroup/CategoryGroupView";
import Categories from "../pages/admin/Categories/Categories";
import CategoryAdd from "../pages/admin/Categories/CategoryAdd";
import CategoryView from "../pages/admin/Categories/CategoryView";
import CategoryEdit from "../pages/admin/Categories/CategoryEdit";

function Admin({ handleLogout }) {
  return (
    <div>
      <div>
        <BrowserRouter>
          <div className="d-flex flex-column flex-lg-row bg-surface-secondary ">
            <AdminSideBar handleLogout={handleLogout} />

            <div className="flex-grow-1 h-screen overflow-y-lg-auto">
              <AdminHeader />
              <main className="pt-2" style={{ backgroundColor: "#f2f2f2" }}>
                <div style={{ minHeight: "90vh" }}>
                  <Routes>
                    <Route path="/" element={<AdminDashboard />} />
                    <Route path="*" element={<AdminDashboard />} />

                    {/* {/ Slider /} */}
                    <Route path="/slider" element={<Slider />} />
                    <Route path="/slider/add" element={<SliderAdd />} />
                    <Route path="/slider/edit/:id" element={<SliderEdit />} />
                    <Route path="/slider/view/:id" element={<SliderView />} />

                    {/* Category Groups */}
                    <Route path="/categorygroup" element={<CategoryGroup />} />
                    <Route
                      path="/categorygroup/add"
                      element={<CategoryGroupAdd />}
                    />
                    <Route
                      path="/categorygroup/edit/:id"
                      element={<CategoryGroupEdit />}
                    />
                    <Route
                      path="/categorygroup/view/:id"
                      element={<CategoryGroupView />}
                    />

                    {/* Categories  */}
                    {/* Categories */}
                    <Route path="/categories" element={<Categories />} />
                    <Route path="/categories/add" element={<CategoryAdd />} />
                    <Route
                      path="/categories/view/:id"
                      element={<CategoryView />}
                    />
                    <Route
                      path="/categories/edit/:id"
                      element={<CategoryEdit />}
                    />
                  </Routes>
                </div>
                <AdminFooter />
              </main>
            </div>
          </div>
        </BrowserRouter>
      </div>
    </div>
  );
}

Admin.propTypes = {
  handleLogout: PropTypes.func.isRequired,
};

export default Admin;
