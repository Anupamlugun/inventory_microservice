<%@ page language="java" contentType="text/html; charset=UTF-8"
pageEncoding="UTF-8" %>
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>stock</title>
    <%@ include file="header_link.jsp" %>
  </head>
  <body>
    <!-- Nav bar  -->
    <%@ include file="nav.jsp" %>
    <div class="container mt-5">
      <div id="stockSection" class="container-fluid">
        <h2 class="text-center text-primary fw-bold mb-4">Stock Overview</h2>

        <div
          id="stockUnderSection"
          class="table-responsive bg-white p-4 rounded shadow-sm border"
        >
          <table class="table table-bordered table-striped text-center">
            <thead class="table-dark">
              <tr>
                <th>Category</th>
                <th>Product Name</th>
                <th>Price</th>
                <th>Purchased</th>
                <th>Sold</th>
                <th class="text-success">Stock Available</th>
              </tr>
            </thead>
            <tbody id="stockTable">
              <!-- Dynamic Data Will Be Inserted Here -->
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <script src="<%=request.getContextPath()%>/js/stock.js"></script>
    <%@ include file="footer_link.jsp" %>
  </body>
</html>
