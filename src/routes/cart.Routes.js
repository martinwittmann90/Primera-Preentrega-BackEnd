const { Router } = require("express");
const router = Router();
const CartManager = require("../appmanagers/cartManager.js");
const path = "./src/db/carts.json";
const myCartsManager = new CartManager(path);

//EMPTY CART
router.post("/", async (req, res) => {
  try {
    const newCart = req.body;
    const cartCreated = await myCartsManager.addCart(newCart);
    cartCreated
      ? res.status(201).json({
          status: "success",
          payload: cartCreated,
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

//ALL CARTS
router.get("/", async (req, res) => {
  try {
    const allCarts = await myCartsManager.read();
    allCarts
      ? res.status(200).json({
          status: "success",
          payload: allCarts,
        })
      : res.status(200).json({
          status: "success",
          payload: [],
        });
  } catch (err) {
    res.status(err.status || 500).json({
      status: "error",
      payload: err.message,
    });
  }
});

//ALL PRODUCTS IN CART
router.get("/:idCart/products", async (req, res) => {
  try {
    const idCart = req.params.idCart;
    const allCarts = await myCartsManager.read();
    const cart = allCarts.find((cart) => cart.id == idCart);
    cart
      ? res.status(200).json({
          status: "success",
          payload: cart.products,
        })
      : res.status(404).json({
          status: "error",
          message: "Cart not found by id: " + idCart,
          payload: {},
        });
  } catch (err) {
    res.status(err.status || 500).json({
      status: "error",
      payload: err.message,
    });
  }
});

//ADD PRODUCT TO CART
router.put("/:idCart/products/:idProduct", async (req, res) => {
  try {
    const idCart = req.params.idCart;
    const idProduct = req.params.idProduct;
    const cartUpdated = await myCartsManager.addProductToCart(
      idCart,
      idProduct
    );
    cartUpdated
      ? res.status(200).json({
          status: "success",
          payload: cartUpdated,
        })
      : res.status(404).json({
          status: "error",
          message: "Could not add product to cart",
          payload: {},
        });
  } catch (err) {
    res.status(err.status || 500).json({
      status: "error",
      payload: err.message,
    });
  }
});

module.exports = router;