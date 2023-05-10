const { Router } = require("express");
const router = Router();
const ProductManager = require("../appmanagers/productManager.js");
const path = "src/db/products.json";
const myProductManager = new ProductManager(path);
const {
  checkRequest,
  checkNumberParams,
  checkCodeNotRepeated,
} = require("../middleware/validators.js");

router.get("/", async (req, res) => {
  try {
    const products = await myProductManager.getProducts();
    const limit = req.query.limit;
    const validateNumber = (number) => {
      return number && !isNaN(number) && number > 0;
    };    
    const checkValidLimit = validateNumber(limit);
    products
      ? checkValidLimit
        ? res.status(200).json({
            status: "success",
            payload: products.slice(0, limit),
          })
        : res.status(200).json({
            status: "success",
            payload: products,
          })
      : res.status(200).json({ status: "success", payload: [] });
  } catch (err) {
    res.status(err.status || 500).json({
      status: "error",
      payload: err.message,
    });
  }
});

router.get("/:id", checkNumberParams, async (req, res) => {
  try {
    const id = req.params.id;
    const product = await myProductManager.getProductById(id);
    product
      ? res.status(200).json({
          status: "success",
          payload: product,
        })
      : res.status(404).json({
          status: "error",
          message: "No product found by id: " + id,
          payload: {},
        });
  } catch (err) {
    res.status(err.status || 500).json({
      status: "error",
      payload: err.message,
    });
  }
});

router.post("/", checkRequest, checkCodeNotRepeated, async (req, res) => {
  try {
    const newProduct = req.body;
    const productCreated = await myProductManager.addProduct(newProduct);
    productCreated
      ? res.status(201).json({
          status: "success",
          payload: productCreated,
        })
      : res.json({
          status: "error",
        });
  } catch (err) {
    res.status(err.status || 500).json({
      status: "error",
      payload: err.message,
    });
  }
});

router.put("/:id", checkRequest, checkNumberParams, async (req, res) => {
  try {
    const id = req.params.id;
    const newProduct = req.body;
    const productUpdated = await myProductManager.updateProduct(id, newProduct);
    res.status(200).json({
      status: "success",
      payload: productUpdated,
    });
  } catch (err) {
    res.status(err.status || 500).json({
      status: "error",
      payload: err.message,
    });
  }
});

router.delete("/:id", checkNumberParams, async (req, res) => {
  try {
    console.log("delete");
    const id = req.params.id;
    const product = await myProductManager.getProductById(id);
    if (!product) {
      res.status(404).json({
        status: "error",
        message: "Product not found by id: " + id,
        payload: {},
      });
      return;
    }
    const productDeleted = await myProductManager.deleteProduct(id);
    res.status(200).json({
      status: "success",
      payload: productDeleted,
    });
  } catch (err) {
    res.status(err.status || 500).json({
      status: "error",
      payload: err.message,
    });
  }
});

module.exports = router;