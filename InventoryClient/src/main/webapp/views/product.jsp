<%@ page language="java" contentType="text/html; charset=UTF-8"
pageEncoding="UTF-8" %>
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>products</title>
    <%@ include file="header_link.jsp" %>
  </head>
  <body>
    <!-- Nav bar  -->
    <%@ include file="nav.jsp" %>

    <div class="container mt-5">
      <div id="productSection" class="container-fluid mt-4">
        <div class="row">
          <div class="col-md-6 mx-auto">
            <h2 class="text-center text-primary fw-bold">Product Form</h2>
            <form
              id="productForm"
              class="mb-4 p-4 rounded bg-white shadow-sm border"
            >
              <div class="mb-3">
                <label for="category" class="form-label fw-semibold"
                  >Category:</label
                >
                <select
                  id="category"
                  name="category"
                  class="form-select"
                  required
                >
                  <option value="" disabled selected>Select Category</option>
                </select>
              </div>

              <div class="mb-3">
                <label for="productName" class="form-label fw-semibold"
                  >Product Name:</label
                >
                <input
                  type="text"
                  id="productName"
                  name="productName"
                  class="form-control"
                  required
                />
              </div>

              <div class="mb-3">
                <label for="productPrice" class="form-label fw-semibold"
                  >Product Price:</label
                >
                <input
                  type="number"
                  id="productPrice"
                  name="productPrice"
                  class="form-control"
                  required
                />
              </div>

              <button
                id="productButton"
                type="submit"
                class="btn btn-primary w-100 fw-semibold"
              >
                Add Product
              </button>
            </form>
          </div>
        </div>

        <div id="product_details" class="row mt-5">
          <div class="col-12">
            <h2 class="text-center text-dark fw-bold">Product Details</h2>

            <div class="table-responsive rounded shadow-sm border">
              <table
                class="table table-hover table-bordered text-center align-middle"
              >
                <thead class="table-dark">
                  <tr>
                    <th class="py-3">Category</th>
                    <th class="py-3">Product Name</th>
                    <th class="py-3">Price</th>
                    <th class="py-3">Action</th>
                  </tr>
                </thead>
                <tbody id="tableBody"></tbody>
              </table>
            </div>

            <div class="d-flex justify-content-between mt-4">
              <button
                type="button"
                class="btn btn-outline-primary px-4 fw-semibold productPrev"
                onclick="productPage(event)"
              >
                Previous Page
              </button>
              <button
                type="button"
                class="btn btn-outline-primary px-4 fw-semibold productNext"
                onclick="productPage(event)"
              >
                Next Page
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <script src="<%=request.getContextPath()%>/js/products.js"></script>
    <%@ include file="footer_link.jsp" %>
  </body>
</html>
