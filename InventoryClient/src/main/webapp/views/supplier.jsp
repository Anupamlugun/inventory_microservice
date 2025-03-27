<%@ page language="java" contentType="text/html; charset=UTF-8"
pageEncoding="UTF-8" %>
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>supplier</title>
    <%@ include file="header_link.jsp" %>
  </head>
  <body>
    <!-- Nav bar  -->
    <%@ include file="nav.jsp" %>
    <div class="container mt-5">
      <div id="supplierSection" class="container-fluid mt-4">
        <h2 class="text-center mb-4 text-primary fw-bold">
          Supplier Management
        </h2>

        <div class="row">
          <div class="col-md-6 mx-auto">
            <!-- Supplier Form -->
            <div class="card shadow-sm border rounded-3">
              <div class="card-body">
                <form id="supplierForm">
                  <div class="mb-3">
                    <label class="form-label fw-semibold">Name</label>
                    <input
                      type="text"
                      class="form-control"
                      id="name"
                      placeholder="Enter supplier name"
                      required
                    />
                  </div>
                  <div class="mb-3">
                    <label class="form-label fw-semibold">Phone Number</label>
                    <input
                      type="tel"
                      class="form-control"
                      id="phone"
                      placeholder="Enter phone number"
                      required
                    />
                  </div>
                  <div class="mb-3">
                    <label class="form-label fw-semibold">Email ID</label>
                    <input
                      type="email"
                      class="form-control"
                      id="email"
                      placeholder="Enter email"
                      required
                    />
                  </div>
                  <div class="mb-3">
                    <label class="form-label fw-semibold">Address</label>
                    <textarea
                      class="form-control"
                      id="address"
                      rows="2"
                      placeholder="Enter address"
                      required
                    ></textarea>
                  </div>
                  <button
                    id="supplierButton"
                    type="submit"
                    class="btn btn-primary w-100 fw-semibold"
                  >
                    Add Supplier
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>

        <!-- Supplier Table -->
        <div class="row mt-5">
          <div class="col-12">
            <div class="card shadow-sm border rounded-3">
              <div
                class="card-header bg-primary text-white text-center fw-bold"
              >
                Supplier List
              </div>
              <div class="card-body">
                <div class="table-responsive">
                  <table
                    class="table table-hover table-bordered text-center align-middle"
                  >
                    <thead class="table-dark">
                      <tr>
                        <th class="py-3">Name</th>
                        <th class="py-3">Phone No</th>
                        <th class="py-3">Email ID</th>
                        <th class="py-3">Address</th>
                        <th class="py-3">Action</th>
                      </tr>
                    </thead>
                    <tbody id="supplierTable">
                      <!-- Dynamic Rows will be added here -->
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <script src="<%=request.getContextPath()%>/js/supplier.js"></script>
    <%@ include file="footer_link.jsp" %>
  </body>
</html>
