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
import DealCategoryView from "../pages/admin/DealCategory/DealCategoryView";
import DealCategory from "../pages/admin/DealCategory/DealCategory";
import DealCategoryAdd from "../pages/admin/DealCategory/DealCategoryAdd";
import DealCategoryEdit from "../pages/admin/DealCategory/DealCategoryEdit";
import Products from "../pages/admin/Products/Products";
import ProductAdd from "../pages/admin/Products/ProductAdd";
import ProductView from "../pages/admin/Products/ProductView";
import ProductEdit from "../pages/admin/Products/ProductEdit";
import Countries from "../pages/admin/Country/Countries";
import CountryAdd from "../pages/admin/Country/CountryAdd";
import CountryEdit from "../pages/admin/Country/CountryEdit";
import CountryView from "../pages/admin/Country/CountryView";
import Orders from "../pages/admin/Orders/Orders";
import OrderView from "../pages/admin/Orders/OrderView";
import User from "../pages/admin/User/User";
import UserView from "../pages/admin/User/UserView";
import ProductOrder from "../pages/admin/Products/ProductOrder";
import ScrollToTop from "../pages/ScrollToTop";

function Admin({ handleLogout }) {
  return (
    <div>
      <div>
        <BrowserRouter basename="/cartonBoxAdmin">
          <ScrollToTop />
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

                    {/* Deal Categories */}
                    <Route path="/dealcategories" element={<DealCategory />} />
                    <Route
                      path="/dealcategories/add"
                      element={<DealCategoryAdd />}
                    />
                    <Route
                      path="/dealcategories/edit/:id"
                      element={<DealCategoryEdit />}
                    />
                    <Route
                      path="/dealcategories/view/:id"
                      element={<DealCategoryView />}
                    />

                    {/* Products  */}
                    <Route path="/products" element={<Products />} />
                    <Route path="/products/add" element={<ProductAdd />} />
                    <Route
                      path="/products/view/:id"
                      element={<ProductView />}
                    />
                    <Route
                      path="/products/edit/:id"
                      element={<ProductEdit />}
                    />
                    <Route path="/products/order" element={<ProductOrder />} />

                    {/* countries  */}
                    <Route path="/countries" element={<Countries />} />
                    <Route path="/country/add" element={<CountryAdd />} />
                    <Route path="/country/edit/:id" element={<CountryEdit />} />
                    <Route path="/country/view/:id" element={<CountryView />} />

                    {/* Orders */}
                    <Route path="/orders" element={<Orders />} />
                    <Route
                      path="/order/:order_id/:product_id"
                      element={<OrderView />}
                    />

                    {/* {/ Slider /} */}
                    <Route path="/user" element={<User />} />
                    <Route path="/user/view/:id" element={<UserView />} />
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
