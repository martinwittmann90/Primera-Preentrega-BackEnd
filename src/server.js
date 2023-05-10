const express = require("express");
const app = express();
const PORT = 8080 || process.env.PORT;
const productRoutes = require("./routes/product.Routes.js");
const cartRoutes = require("./routes/cart.Routes.js");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.use("/api/products", productRoutes);
app.use("/api/carts", cartRoutes);

try {
  app.listen(PORT, () =>
    console.log(
      `Server started on PORT ${PORT} at ${new Date().toLocaleString()}`
    )
  );
} catch (error) {
  console.log("Error starting server", error);
}