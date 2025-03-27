<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Total Profit</title>
    <%@ include file="header_link.jsp" %>
  </head>
  <body>
    <%@ include file="nav.jsp" %>
    <div class="container">
      <h2 class="text-center text-success my-4">Total Profit</h2>
      <button onclick="history.back()" class="btn btn-primary mb-3">
        Back
      </button>
      <div
        id="profitdescription"
        class="alert alert-success"
        role="alert"
      ></div>
    </div>
    <%@ include file="footer_link.jsp" %>
    <script src="<%=request.getContextPath()%>js/total_profit.js"></script>
  </body>
</html>
