/* ******************************************
 * This server.js file is the primary file of the 
 * application. It is used to control the project.
 *******************************************/
/* ***********************
 * Require Statements
 *************************/
const express = require("express")
const expressLayouts = require('express-ejs-layouts')
const env = require("dotenv").config()
const app = express()
const static = require("./routes/static")
const baseController = require("./controllers/baseController")
const inventoryRoute = require("./routes/inventoryRoute")

/* ***********************
 * View Engine and Templates
 *************************/
app.set("view engine", "ejs")
app.use(expressLayouts)
app.set("layout", "layouts/layout") //not at views root


app.use((req, res, next) => {
  res.locals.year = new Date().getFullYear()
  next()
})



/* ***********************
 * Routes
 *************************/
app.use(express.static("public"))
app.use(static)

//Index route
app.get("/", baseController.buildHome)

// Inventory Routes
app.use("/inv", inventoryRoute)


/* ***********************
 * ERROR Handling middleware
 *************************/
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).render("errors/500", {
    title: "Server Error",
    message: "Something went wrong on our end.",
    year: res.locals.year
  })
})


/* ***********************
 * Local Server Information
 * Values from .env (environment) file
 *************************/
const port = process.env.PORT || 5500;
const host = process.env.HOST || "localhost";

/* ***********************
 * Log statement to confirm server operation
 *************************/
app.listen(port, () => {
  console.log(`app listening on ${host}:${port}`)
})
