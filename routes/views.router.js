import { Router } from "express";

export default function buildViewsRouter(productsDAO) {
  const router = Router();

  router.get("/", async (req, res) => {
    const products = await productsDAO.getAll();
    res.render("home", { products, title: "Home" });
  });

  router.get("/realtimeproducts", (req, res) => {
    res.render("realTimeProducts", { title: "Tiempo real" });
  });

  return router;
}

