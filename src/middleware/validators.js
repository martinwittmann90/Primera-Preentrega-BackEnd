const ProductManager = require("../appmanagers/productManager.js");
const path = "src/db/products.json";
const myProductManager = new ProductManager(path);

const checkRequest = (req, res, next) => {
  const keysBody = Object.keys(req.body);
  const requiredKeys = [
    "title",
    "description",
    "code",
    "price",
    "status",
    "stock",
    "category",
    "thumbnails",
  ];
  const validRequest = requiredKeys.every((key) => keysBody.includes(key));
  if (!validRequest) {
    res.status(400).json({
      status: "error",
      payload: "Invalid request. Missing Fields",
    });
    return;
  }
  next();
};

const checkCodeNotRepeated = async (req, res, next) => {
  const { code } = req.body;
  const allProducts = await myProductManager.getProducts();
  const product = allProducts.find((product) => product.code == code);
  if (product) {
    res.status(400).json({
      status: "error",
      payload: "Invalid request. Code already exists: " + code,
    });
    return;
  }
  next();
};

const checkNumberParams = (req, res, next) => {
  const { id } = req.params;
  if (!id || isNaN(id)) {
    res.status(400).json({
      status: "error",
      payload: "Invalid id: " + id,
    });
    return;
  }
  next();
};

module.exports = { checkRequest, checkNumberParams, checkCodeNotRepeated, };