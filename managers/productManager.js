import fs from "fs/promises";
import crypto from "crypto";
import path from "path";

export default class ProductManager {
  constructor(filePath) {
    this.path = filePath;
  }

  async _readFile() {
    try {
      const content = await fs.readFile(this.path, "utf-8");
      return JSON.parse(content);
    } catch (err) {
      if (err.code === "ENOENT") {
        await this._writeFile([]);
        return [];
      }
      throw err;
    }
  }

  async _writeFile(data) {
    await fs.mkdir(path.dirname(this.path), { recursive: true });
    await fs.writeFile(this.path, JSON.stringify(data, null, 2), "utf-8");
  }

  _generateId() {
    return crypto.randomUUID();
  }

  async getAll() {
    return await this._readFile();
  }

  async getById(id) {
    const products = await this._readFile();
    return products.find((p) => String(p.id) === String(id)) || null;
  }

  async addProduct(productData) {
    const required = ["title", "description", "code", "price", "status", "stock", "category", "thumbnails"];
    for (const field of required) {
      if (!(field in productData)) throw new Error(`Falta campo requerido: ${field}`);
    }

    const products = await this._readFile();
    const newProduct = {
      id: this._generateId(),
      title: productData.title,
      description: productData.description,
      code: productData.code,
      price: Number(productData.price),
      status: Boolean(productData.status),
      stock: Number(productData.stock),
      category: productData.category,
      thumbnails: Array.isArray(productData.thumbnails) ? productData.thumbnails : []
    };

    products.push(newProduct);
    await this._writeFile(products);
    return newProduct;
  }

  async updateProduct(id, updateData) {
    const products = await this._readFile();
    const idx = products.findIndex((p) => String(p.id) === String(id));
    if (idx === -1) return null;

    // nunca actualiza el id
    const { id: _ignore, ...rest } = updateData;
    const updated = { ...products[idx], ...rest };
    products[idx] = updated;
    await this._writeFile(products);
    return updated;
  }

  async deleteProduct(id) {
    const products = await this._readFile();
    const idx = products.findIndex((p) => String(p.id) === String(id));
    if (idx === -1) return false;
    products.splice(idx, 1);
    await this._writeFile(products);
    return true;
  }
}
