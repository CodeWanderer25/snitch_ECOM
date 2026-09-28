import express from "express"
import authRouter from "../routes/auth.route.js";
import cookieParser from 'cookie-parser'
import productRoutes from "../routes/product.route.js"
import cartRoutes from "../routes/cart.route.js"
import cors from "cors";

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use(
    cors({
        origin: "http://localhost:5173",
        credentials: true,
    })
);

app.get("/", (req, res) => {
  res.send("Hello from app");
});

app.use("/api/auth", authRouter)
app.use("/api/products", productRoutes)
app.use("/api/cart" , cartRoutes)

export default app;
