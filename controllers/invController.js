const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classification_id
  const data = await invModel.getInventoryByClassificationId(classification_id)
  const grid = await utilities.buildClassificationGrid(data)
  let nav = await utilities.getNav()

   if (!data || data.length === 0) {
    res.render("./inventory/classification", {
      title: "No vehicles found",
      nav,
      grid,
    })
    return
  }

  const className = data[0].classification_name
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
  })
}

/* ***************************
 *  Build vehicle detail view
 * ************************** */
invCont.buildVehicleDetail = async function (req, res, next) {
  const inv_id = req.params.inv_id
  const data = await invModel.getInventoryById(inv_id)
  const nav = await utilities.getNav()

  if (!data) {
    res.render("errors/error", {
      title: "Vehicle Not Found",
      nav,
      message: "Sorry, the vehicle you're looking for does not exist.",
    })
    return
  }

  const detailView = await utilities.buildVehicleDetail(data)
  res.render("./inventory/detail", {
    title: `${data.inv_make} ${data.inv_model}`,
    nav,
    vehicleDetail: detailView,
  })
}

module.exports = invCont
