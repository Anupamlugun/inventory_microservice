<%@ page language="java" contentType="text/html; charset=UTF-8"
pageEncoding="UTF-8" %>

<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Inventory</title>

    <%@ include file="header_link.jsp" %>
  </head>
  <body>
    <!-- Nav bar  -->
    <%@ include file="nav.jsp" %>

    <!-- <div class="container mt-4">
      <div id="categorySection" class="container-fluid mt-4">
        <div class="row">
          <div class="col-md-6 mx-auto">
            <h2 class="text-center text-primary">Category Form</h2>
            <form id="categoryForm" class="mb-3 shadow p-4 rounded bg-light">
              <div class="mb-3">
                <label for="categoryName" class="form-label fw-bold"
                  >Category Name:</label
                >
                <input
                  type="text"
                  id="categoryName"
                  name="categoryName"
                  class="form-control"
                  required
                />
              </div>
              <button
                id="categoryButton"
                type="submit"
                class="btn btn-primary w-100"
              >
                Add Category
              </button>
            </form>
          </div>
        </div>

        <div class="row mt-4">
          <div class="col-12">
            <h2 class="text-center">Category Details</h2>
            <div class="table-responsive">
              <table class="table table-bordered text-center">
                <thead class="table-dark">
                  <tr>
                    <th>Category Name</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody id="CategoryTableBody"></tbody>
              </table>
            </div>
            <div class="d-flex justify-content-between mt-3">
              <button
                id="LoadCategoryPrev"
                type="button"
                class="btn btn-outline-primary"
                onclick="loadMore(event)"
              >
                Prev Page
              </button>
              <button
                id="LoadCategoryNext"
                type="button"
                class="btn btn-outline-primary"
                onclick="loadMore(event)"
              >
                Next Page
              </button>
            </div>
          </div>
        </div>
      </div>
    </div> -->
    <div class="container mt-5">
      <div id="categorySection" class="container-fluid mt-4">
        <div class="row">
          <div class="col-md-6 mx-auto">
            <h2 class="text-center text-primary fw-bold">Category Form</h2>
            <form
              id="categoryForm"
              class="mb-4 p-4 rounded bg-white shadow-sm border"
            >
              <div class="mb-3">
                <label for="categoryName" class="form-label fw-semibold"
                  >Category Name:</label
                >
                <input
                  type="text"
                  id="categoryName"
                  name="categoryName"
                  class="form-control"
                  required
                />
              </div>
              <button
                id="categoryButton"
                type="submit"
                class="btn btn-primary w-100 fw-semibold"
              >
                Add Category
              </button>
            </form>
          </div>
        </div>

        <div class="row mt-5">
          <div class="col-12">
            <h2 class="text-center text-dark fw-bold">Category Details</h2>
            <div class="table-responsive rounded shadow-sm border">
              <table
                class="table table-hover table-bordered text-center align-middle"
              >
                <thead class="table-dark">
                  <tr>
                    <th class="py-3">Category Name</th>
                    <th class="py-3">Action</th>
                  </tr>
                </thead>
                <tbody id="CategoryTableBody"></tbody>
              </table>
            </div>
            <div class="d-flex justify-content-between mt-4">
              <button
                id="LoadCategoryPrev"
                type="button"
                class="btn btn-outline-primary px-4 fw-semibold"
                onclick="loadMore(event)"
              >
                Prev Page
              </button>
              <button
                id="LoadCategoryNext"
                type="button"
                class="btn btn-outline-primary px-4 fw-semibold"
                onclick="loadMore(event)"
              >
                Next Page
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <script src="<%=request.getContextPath()%>js/category.js"></script>
    <%@ include file="footer_link.jsp" %>
  </body>
</html>
