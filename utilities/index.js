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

/* Middleware of protection */
Util.checkLogin = (req, res, next) => {
  if (res.locals.accountData) {
    next()
  } else {
    req.flash("error", "Please log in.")
    return res.status(403).render("account/login", {
      title: "Login",
      nav: res.locals.nav,
      errors: [],
    })
  }
}

/**UNIT 5- ASSIGNMENT TASK 2 MIDDLEWARE TO VERIFY TYPE OF ACCOUNT */
Util.checkAccountType = (req, res, next) => {
  const accountData = res.locals.accountData
  if (
    !accountData ||
    (accountData.account_type !== "Employee" && accountData.account_type !== "Admin")
  ) {
  req.flash("error", "You do not have permission to access that page.")
    return res.status(403).render("account/login", {
      title: "Login",
      nav: res.locals.nav,
      errors: [],
    })
  }

  next()
}  


/*UNIT 5 - GET INVENTORY BY CLASSIFICATION*/
Util.buildInventoryGrid = async function (data) {
  let grid = '<table class="inventory-grid">'
  grid += '<thead><tr><th>Make</th><th>Model</th><th>Price</th><th>&nbsp;</th></tr></thead>'
  grid += '<tbody>'
  data.forEach(vehicle => {
    grid += `<tr>
      <td>${vehicle.inv_make}</td>
      <td>${vehicle.inv_model}</td>
      <td>$${vehicle.inv_price.toLocaleString()}</td>
      <td><a href="/inv/detail/${vehicle.inv_id}">View</a></td>
    </tr>`
  })
  grid += '</tbody></table>'
  return grid
}


module.exports = Util