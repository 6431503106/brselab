import path from "path"
import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import connectDB from "./config/db.js"
import productRoutes from "./routes/productRoutes.js"
import userRoutes from "./routes/userRoutes.js"
import { errorHandler, notFound } from "./middleware/errorMiddleware.js"
import cookieParser from "cookie-parser"
import orderRoutes from "./routes/orderRoutes.js"
import uploadRoutes from "./routes/uploadRoutes.js"
import stripe from "./utils/stripe.js"
import generalRoutes from "./routes/generalRoutes.js";
import adminRoutes from './routes/adminRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import { fileURLToPath } from 'url';

dotenv.config()

connectDB()

const app = express()

// Set CORS headers
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:3000")
  next()
})

app.use(
  cors({
    origin: ["http://127.0.0.1:3000", "http://localhost:3000"],
    methods: "GET, POST, PATCH, DELETE, PUT",
    credentials: true,
  })
)

app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Stripe setup
stripe(app)

// API Routes
app.use("/api/products", productRoutes)
app.use('/api/categories', categoryRoutes)
app.use("/api/users", userRoutes)
app.use("/api/orders", orderRoutes)
app.use("/api/upload", uploadRoutes)
app.use("/api/general", generalRoutes)
app.use('/api/admin', adminRoutes)

// Resolve __dirname in ES6
/*const __filename = fileURLToPath(import.meta.url);*/
/*const __dirname = path.dirname(__filename);*/

// Serve static files from /uploads
const __dirname = path.resolve()
app.use("/uploads", express.static(path.join(__dirname, "uploads")))

if (process.env.NODE_ENV === "production") {
  const __dirname = path.resolve()
  app.use("/uploads", express.static(path.join(__dirname, "uploads")))
  app.use(express.static(path.join(__dirname, "/client/dist")))
  app.use("*", (req, res) =>
    res.sendFile(path.resolve(__dirname, "client", "dist", "index.html"))
  )
} else {
  app.use("/uploads", express.static(path.join(__dirname, "uploads")))
  app.get("/", (req, res) => {
    res.send("Api is running...")
  })
}

/*const __dirname = path.resolve()
app.use("/uploads", express.static(path.join(__dirname, "uploads")))

// Serve static files in production
  if (process.env.NODE_ENV === "production") {
    const __dirname = path.resolve()
    app.use("/uploads", express.static(path.join(__dirname, "uploads")))
    app.use(express.static(path.join(__dirname, "/client/dist")))
    app.use("*", (req, res) =>
      res.sendFile(path.resolve(__dirname, "client", "dist", "index.html"))
    )
  } else {
    app.use("/uploads", express.static(path.join(__dirname, "uploads")))
    app.get("/", (req, res) => {
      res.send("Api is running...")
    })
  }*/

// Error handling middleware
app.use(notFound)
app.use(errorHandler)

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})