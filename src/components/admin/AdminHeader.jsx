const AdminHeader = () => {
  return (
    <header
      className="border-bottom py-3 sticky-top-header"
      style={{ backgroundColor: "#cd8245" }}
    >
      <div className="container-fluid">
        <div className="mb-npx">
          <div className="row align-items-center">
            <div className="col-sm-6 col-12 mb-4 mb-sm-0 admin-settings"></div>
            <div className="col-sm-6 col-12 text-sm-end">
              <div className="mx-n1">
                <span className="User__icon">
                  <i className="fa-solid fa-user"></i>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
