const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res) {
  try {
    const classification_id = req.params.classification_id
    const data = await invModel.getInventoryByClassificationId(classification_id)
    const nav = await utilities.getNav()

    if (!data || data.length === 0) {
      return res.render("inventory/classification", {
        title: "No vehicles found",
        nav,
        grid: "<p>No vehicles found for this classification.</p>",
      })
    }

    const grid = await utilities.buildClassificationGrid(data)
    const className = data[0].classification_name

    res.render("inventory/classification", {
      title: `${className} vehicles`,
      nav,
      grid,
    })
  } catch (error) {
    console.error("❌ Error in buildByClassificationId:", error)
    res.status(500).render("errors/500", {
      title: "Server Error",
      message: error.message,
    })
  }
}

/* ***************************
 *  Build vehicle detail view
 * ************************** */
invCont.buildVehicleDetail = async function (req, res) {
  try {
    const inv_id = req.params.inv_id
    const vehicleData = await invModel.getInventoryById(inv_id)
    const nav = await utilities.getNav()
    
    if (!vehicleData) {
      return res.status(404).render("errors/404", {
        title: "Vehicle Not Found",
        nav,
        message: "Sorry, the vehicle you're looking for does not exist.",
      })
    }

    const dataArray = Array.isArray(vehicleData) ? vehicleData : [vehicleData];
    const view = await utilities.buildVehicleDetail(dataArray);

    res.render("inventory/detail", {
      title: `${vehicleData.inv_make} ${vehicleData.inv_model}`,
      nav,
      view,
    });
  } catch (error) {
    console.error("❌ Error in buildVehicleDetail:", error)
    res.status(500).render("errors/500", {
      title: "Server Error",
      message: error.message,
      nav,
    });
  }
};

module.exports = invCont
