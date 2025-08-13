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
const static = require("./routes/static")
const baseController = require("./controllers/baseController")
const inventoryRoute = require("./routes/inventoryRoute")
const session = require("express-session")
const pool = require("./database/")
const bodyParser = require("body-parser")
const cookieParser = require("cookie-parser")
const utilities = require("./utilities")

/***UNIT 6 - SORAYA SKAVINSKI PURCHASE BUTTON */
const purchaseRoute = require("./routes/purchaseRoute")

const app = express()
/* ***********************
 * Middleware
 * ************************/
 app.use(session({
  store: new (require('connect-pg-simple')(session))({
    createTableIfMissing: true,
    pool,
  }),
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: true,
  name: 'sessionId',
}))

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

//UNIT 5 - login activity cookie parser
app.use(cookieParser())

//UNIT 5, Login Process activity checkJWTTOKEN

// Express Messages Middleware
app.use(require('connect-flash')())
app.use(function(req, res, next){
  res.locals.messages = require('express-messages')(req, res)
  next()
})

//UNI 5 - JWT Middleware
app.use(utilities.checkJWTToken)

/**UNIT 6 - SORAYA SKAVINSKI - PURCHASE BUTTON */
app.use("/purchase", purchaseRoute)


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

// Inventory Routes - unit 3 activity
app.use("/inv", inventoryRoute)

//Account routes - unit 4 activity
app.use("/account", require("./routes/accountRoute"))


/* ***********************
 * ERROR Handling middleware
    *Unit 3
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
