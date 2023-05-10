const fs = require("fs");

class ProductManager {
  constructor(path) {
    this.path = path;
  }
    async getProducts() {
      return await this.read(this.file);
    }
    
    async getProductById(id) {
      let allProductsArray = await this.read(this.file);
      const product = allProductsArray.find((product) => product.id == id);
      return product;
    }

    async addProduct(newProduct) {
      let allProductsArray = await this.read(this.file);
      let nextId = await this.getNextId(allProductsArray);
      newProduct.id = nextId;
      newProduct.status = true;
      allProductsArray.push(newProduct);
      await this.write(allProductsArray);
      return newProduct;
    }

    async updateProduct(id, newProduct) {
      let allProductsArray = await this.read(this.file);
      console.log("productos", allProductsArray);
      const productToUpdate = allProductsArray.find(
        (product) => product.id == id
      );
      if (!productToUpdate) {
        console.log("Product not found", productToUpdate);
        return {
          status: "error",
          message: "No product found by id: " + id,
          payload: {},
        };
      }
      newProduct = this.updateProductFields(productToUpdate, newProduct);
      const index = allProductsArray.indexOf(productToUpdate);
      allProductsArray[index] = newProduct;
      await this.write(allProductsArray);
      return newProduct;
    }

    async deleteProduct(id) {
      let allProductsArray = await this.read(this.file);
      const productToDelete = allProductsArray.find(
        (product) => product.id == id
      );
      if (!productToDelete) {
        return {
          status: "error",
          message: "No found by id: " + id,
          payload: {},
        };
      }
      const index = allProductsArray.indexOf(productToDelete);
      allProductsArray.splice(index, 1);
      await this.write(allProductsArray);
      return productToDelete;
    }

    updateProductFields(productToUpdate, newProduct) {
      const updatedProduct = {
        ...productToUpdate,
        ...newProduct,
      };
      return updatedProduct;
    }

    async read() {
      let allProductsArray = [];
      try {
        let allProductsString = await fs.promises.readFile(this.path, "utf-8");
        allProductsString.length > 0
          ? (allProductsArray = JSON.parse(allProductsString))
          : (allProductsArray = []);
      } catch (err) {
        console.log("File read error", err);
      }
      return allProductsArray;
    }

    async write(allProductsArray) {
      let allProductsString = JSON.stringify(allProductsArray, null, 2);
      try {
        await fs.promises.writeFile(this.path, allProductsString);
      } catch (err) {
        console.log("Typing error", err);
      }
    }

    async getNextId(allProductsArray) {
      let previousId = 0;
      const allIdsArray = allProductsArray.map((product) => product.id);
      allIdsArray.filter((id) => typeof id === "number");
      if (allIdsArray.length > 0) {
        previousId = Math.max(...allIdsArray);
      }
      return previousId + 1;
    }
}

module.exports = ProductManager;