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

/* ***************************
 *  Assignment UNIT 4 Build Management View
 * ************************** */
const buildManagement = async function (req, res){
  const nav = await utilities.getNav()
  res.render("inventory/management", {
    title: "Inventory Management",
    nav,
    message: req.flash("notice"),
  })
}

invCont.buildAddClassification = async function (req, res) {
    res.render("inventory/add-classification", {
    title: "Add Classification",
    message: null,
    errors: [],
  })
}

invCont.addClassification = async function (req, res) {
  const { classification_name } = req.body
  try {
    const result = await invModel.addClassification(classification_name)
    if (result) {
      req.flash("notice", "Classification added successfully.")
      const nav = await utilities.getNav()
      res.redirect("/inv/management")
    } else {
      res.render('inventory/add-classification', {
        title: "Add Classification",
        message: "Failed to add classification.",
        errors: [],
      })
    }
  } catch (error) {
    console.error("❌ Error in addClassification:", error)
    res.status(500).render("inventory/add-classification", {
      title: "Add Classification",
      message: "Failed to add classification.",
      errors: [error.message],
    })
  }
}

invCont.buildAddInventory = async function (req, res) {
  const classificationList = await utilities.buildClassificationList()
  res.render("inventory/add-inventory", {
    title: "Add Vehicle",
    classificationList,
    errors: null,
    inv: {},
    message: null
  })
}

invCont.addInventory = async function (req, res) {
  const invData = req.body
  
  try {
    const result = await invModel.addInventory(invData)

    if (result) {
      req.flash("message", "✅ Vehicle added successfully!")
      res.redirect("/inv/management")
    } else {
      const classificationList = await utilities.buildClassificationList(invData.classification_id)
      res.render("inventory/add-inventory", {
        title: "Add Vehicle",
        classificationList,
        message: "❌ Failed to add vehicle.",
        inv: invData,
        errors: []
      })
    }
  } catch (error) {
    const classificationList = await utilities.buildClassificationList(invData.classification_id)
    console.error("❌ Error in addInventory:", error)
    res.status(500).render("inventory/add-inventory", {
      title: "Add Vehicle",
      classificationList,
      message: "❌ Something went wrong while adding the vehicle.",
      inv: invData,
      errors: [error.message]
    })
  }
}




module.exports = invCont
