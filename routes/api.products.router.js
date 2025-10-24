import { Router } from "express";
import Product from "../models/product.model.js";

export default function buildProductsRouter() {
  const router = Router();

  // paginate
  router.get("/", async (req, res) => {
    try {
      const limit = Math.max(1, Number(req.query.limit) || 10);
      const page  = Math.max(1, Number(req.query.page)  || 1);

      const { docs, ...data } = await Product.paginate(
        {},
        { limit, page, lean: true }
      );

      return res.json({ status: "success", payload: docs, ...data });
    } catch (e) {
      return res.status(500).json({ status: "error", message: "error al recuperar los productos" });
    }
  });

  //GET 

  router.get("/:id", async (req, res) => {
    const p = await Product.findById(req.params.id).lean();
    if (!p) return res.status(404).json({ error: "Producto no encontrado" });
    res.json(p);
  });

  //POST 

  router.post("/", async (req, res) => {
    try {
      const created = await Product.create(req.body);
      res.status(201).json(created);
    } catch (e) {
      res.status(400).json({ error: e.message });
    }
  });

  //PUT

  router.put("/:id", async (req, res) => {
    const updated = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true, lean: true });
    if (!updated) return res.status(404).json({ error: "Producto no encontrado" });
    res.json(updated);
  });

  //DELETE 
  
  router.delete("/:id", async (req, res) => {
    const deleted = await Product.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: "Producto no encontrado" });
    res.status(204).send();
  });

  return router;
};



