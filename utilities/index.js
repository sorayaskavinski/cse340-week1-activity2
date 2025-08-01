const invModel = require("../models/inventory-model")
const jwt = require("jsonwebtoken")
require("dotenv").config()

const Util = {}

/* Nav builder */
Util.getNav = async function () {
  let data = await invModel.getClassifications()
  let list = "<ul class='nav'>"
  list += '<li><a href="/" title="Home page">Home</a></li>'
  data.forEach((row) => {
    list += "<li>"
    list += `<a href="/inv/type/${row.classification_id}" title="See our inventory of ${row.classification_name} vehicles">${row.classification_name}</a>`
    list += "</li>"
  })
  list += "</ul>"
  return list
}

/* Classification grid */
Util.buildClassificationGrid = async function (data) {
  let grid = ''
  if (data.length > 0) {
    grid = '<ul id="inv-display">'
    data.forEach((vehicle) => {
      grid += `<li>
        <a href="../../inv/detail/${vehicle.inv_id}" title="View ${vehicle.inv_make} ${vehicle.inv_model} details">
          <img src="${vehicle.inv_thumbnail}" alt="Image of ${vehicle.inv_make} ${vehicle.inv_model} on CSE Motors" />
        </a>
        <div class="namePrice">
          <hr />
          <h2><a href="../../inv/detail/${vehicle.inv_id}" title="View ${vehicle.inv_make} ${vehicle.inv_model} details">
            ${vehicle.inv_make} ${vehicle.inv_model}
          </a></h2>
          <span>$${new Intl.NumberFormat('en-US').format(vehicle.inv_price)}</span>
        </div>
      </li>`
    })
    grid += '</ul>'
  } else {
    grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
  }
  return grid
}

/* Vehicle detail view */
Util.buildVehicleDetail = async function (data) {
  let view = ''
  if (data.length > 0) {
    data.forEach((vehicle) => {
      view += `
      <section class="vehicle-container">
        <div class="vehicle-image">
          <img src="${vehicle.inv_image}" alt="Image of ${vehicle.inv_make} ${vehicle.inv_model} on CSE Motors" />
        </div>
        <div class="vehicle-info">
          <h2>${vehicle.inv_make} ${vehicle.inv_model}</h2>
          <p class="price">${new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(vehicle.inv_price)}</p>
          <p class="mileage">Mileage: ${vehicle.inv_miles}</p>
          <p>Color: ${vehicle.inv_color}</p>
          <p>Description: ${vehicle.inv_description}</p>
        </div>
      </section><hr>`
    })
  } else {
    view = '<p class="notice">Sorry, no vehicle details could be found.</p>'
  }
  return view
}

/* Error handler wrapper */
Util.handleErrors = function (fn) {
  return function (req, res, next) {
    return fn(req, res, next).catch(next)
  }
}

/* Classification select list */
Util.buildClassificationList = async function (classification_id = null) {
  let data = await invModel.getClassifications()
  let classificationList = '<select name="classification_id" id="classificationList" required>'
  classificationList += "<option value=''>Choose a Classification</option>"
  data.forEach((row) => {
    classificationList += `<option value="${row.classification_id}" ${classification_id == row.classification_id ? "selected" : ""}>${row.classification_name}</option>`
  })
  classificationList += "</select>"
  return classificationList
}

/* JWT check middleware (única e correta) */
Util.checkJWTToken = (req, res, next) => {
  const token = req.cookies.jwt
  if (!token) {
    return next()
  }
  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
    res.locals.accountData = decoded
    res.locals.loggedin = 1
    req.accountData = decoded
  } catch (err) {
    res.clearCookie("jwt")
  }
  next()
}

/* Middleware de proteção */
Util.checkLogin = (req, res, next) => {
  if (res.locals.loggedin) {
    return next()
  }
  req.flash("notice", "Please log in.")
  return res.redirect("/account/login")
}

module.exports = Util