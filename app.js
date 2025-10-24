import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import handlebars from "express-handlebars";
import { Server } from "socket.io";
import dotenv from "dotenv";
import connectMongoDB from "./config/db.js";


import buildViewsRouter from "./routes/views.router.js";
import BuildProductsRouter from "./routes/api.products.router.js";
import ProductManager from "./managers/productManager.js"; 

//inicializamos las variables de entorno

dotenv.config()

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT;

connectMongoDB();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));



//handlebars
app.engine("handlebars", handlebars.engine({
  layoutsDir: path.join(__dirname, "views", "layout"),
  defaultLayout: "main",
}));
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "handlebars");


export const productsDAO = new ProductManager(path.join(__dirname, "data", "products.json"));

// endpoint de api 
app.use("/api/products", BuildProductsRouter());
//endpoint de vistas 
app.use("/", buildViewsRouter(productsDAO));


const httpServer = app.listen(PORT, () => {
  console.log(`Servidor en http://localhost:${PORT}`);
});
export const io = new Server(httpServer);

// tiempo real
io.on("connection", async (socket) => {
  
  socket.emit("updateProducts", await productsDAO.getAll());

  
  socket.on("newProduct", async (data) => {
    try {
      await productsDAO.addProduct(data);
      io.emit("updateProducts", await productsDAO.getAll());
    } catch (e) {
      socket.emit("formError", e.message);
    }
  });

  // eliminar
  socket.on("deleteProduct", async (id) => {
    await productsDAO.deleteProduct(id);
    io.emit("updateProducts", await productsDAO.getAll());
  });
});
