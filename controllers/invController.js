const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")
const invCont = {}

// Build inventory by classification view
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

// Build vehicle detail view
invCont.buildVehicleDetail = async function (req, res) {
  let nav
  try {
    const inv_id = req.params.inv_id
    const vehicleData = await invModel.getInventoryById(inv_id)
    nav = await utilities.getNav()
    
    if (!vehicleData) {
      return res.status(404).render("errors/404", {
        title: "Vehicle Not Found",
        nav,
        message: "Sorry, the vehicle you're looking for does not exist.",
      })
    }

    const dataArray = Array.isArray(vehicleData) ? vehicleData : [vehicleData]
    const view = await utilities.buildVehicleDetail(dataArray)

    res.render("inventory/detail", {
      title: `${vehicleData.inv_make} ${vehicleData.inv_model}`,
      nav,
      view,
      vehicle: vehicleData      
  }) 
} catch (error) {
    console.error("❌ Error in buildVehicleDetail:", error)
    res.status(500).render("errors/500", {
      title: "Server Error",
      message: error.message,
      nav: nav || ""
    })
  }
}

/** Management View witha ALL vehicles */

invCont.getManagementView = async function (req, res) {
 
  try{
    const nav = await utilities.getNav()

    //UNIT 5 -- Constructing a classification list for <select> --- 
    const classificationSelect = await utilities.buildClassificationList()

    const itemData = await invModel.getAllInventory()

    let grid = "<table><tr><th>ID</th><th>Make</th><th>Model</th><th>Classification</th><th>Actions</th></tr>"
    itemData.forEach(vehicle => {
     grid += `<tr>
    <td>${vehicle.inv_id}</td>
    <td>${vehicle.inv_make}</td>
    <td>${vehicle.inv_model}</td>
    <td>${vehicle.classification_name}</td>
    <td>
      <a href="/inv/detail/${vehicle.inv_id}">View</a> |
      <a href="/inv/edit/${vehicle.inv_id}">Edit</a> |
      <a href="/inv/delete/${vehicle.inv_id}">Delete</a>
    </td>
  </tr>`
})
grid += "</table>"


    res.render("inventory/management", {
      title: "Inventory Management",
      nav,
      classificationSelect, //UNIT 5 - classification list - 
      errors: null,
      message: req.flash("message"),
      grid 
    })
  } catch (error) {
    console.error("Error loading management view:", error)
    res.render("inventory/management", {
      title: "Inventory Management",
      nav: "<nav><ul><li>Home</li></ul></nav>", // fallback básico
      classificationSelect: "",
      errors: [{ msg: "Error loading the page. Please try again later." }],
      message: null,
      grid: null
    })
  }
}

//UNIT 5 - Get Inventory by Classification
invCont.getInventoryByClassification = async function (req, res) {
  const classification_id = req.body.classification_id || req.query.classification_id
  const nav = await utilities.getNav()

  try {
     if (!classification_id) {
      throw new Error("Classification ID not provided.")
    }
    const data = await invModel.getInventoryByClassificationId(classification_id)
    const grid = await utilities.buildInventoryGrid(data)
    const classificationSelect = await utilities.buildClassificationList(classification_id)

    res.render("inventory/management", {
      title: "Inventory Management",
      nav,
      classificationSelect,
      grid,
      message: null,
      errors: null,      
    })
  } catch (error) {
    console.error("Error loading inventory by classification:", error)
    
    const classificationSelect = await utilities.buildClassificationList(classification_id)

    res.render("inventory/management", {
      title: "Inventory Management",
      nav,
      classificationSelect: "",
      message: null,
      grid: null,
      errors: [{ msg: "Error loading inventory for the selected classification." }]
    })
  }
}


// Add Classification View - assignment UNIT 4
invCont.buildAddClassification = async function (req, res) {
  try {
    const nav = await utilities.getNav()
    res.render("inventory/add-classification", {
      title: "Add New Classification",
      nav,
      message: null,
      errors: null,
    })
  } catch (error) {
    throw new Error("Failed to build Add Classification view: " + error.message)
  }
}

// Add Classification Handler - assignment UNIT 4
invCont.addClassification = async function (req, res) {
  const { classification_name } = req.body
  const nav = await utilities.getNav()
  try {
    const result = await invModel.addClassification(classification_name)
    if (result) {
      req.flash("message", "Classification added successfully.")
      res.redirect("/inv/")
    } else {
      req.flash("message", "Failed to add classification.")
      res.status(500).render("inventory/add-classification", {
        title: "Add Classification",
        nav,
        errors: null,
      })
    }
  } catch (error) {
    console.error(error)
    res.status(500).render("inventory/add-classification", {
      title: "Add Classification",
      nav,
      errors: null,
    })
  }
}

// Add Inventory View - assingment UNIT 4
invCont.buildAddInventory = async function (req, res) {
  const classificationList = await utilities.buildClassificationList()
  const nav = await utilities.getNav()
  res.render("inventory/add-inventory", {
    title: "Add Vehicle",
    classificationList,
    errors: null,
    inv: {},
    message: null
  })
}

// Add Inventory Assignment UNIT 4
invCont.addInventory = async function (req, res) {
  const invData = req.body  
  try {
    const nav = await utilities.getNav()
    const result = await invModel.addInventory(invData)

    if (result) {
      req.flash("message", "✅ Vehicle added successfully!")
      res.redirect("/inv/")
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

/* ***************************
 *  Return Inventory by Classification As JSON
 * ************************** */
invCont.getInventoryJSON = async (req, res, next) => {
  const classification_id = parseInt(req.params.classification_id)
  const invData = await invModel.getInventoryByClassificationId(classification_id)
  if (invData.length > 0 && invData[0].inv_id) {
    return res.json(invData)
  } else {
    next(new Error("No data returned"))
  }
}

/* ***************************
 *  Build edit inventory view
 * ************************** */
invCont.editInventoryView = async function (req, res, next) {
  const inv_id = parseInt(req.params.inv_id)
  let nav = await utilities.getNav()
  const itemData = await invModel.getInventoryById(inv_id)
  const classificationSelect = await utilities.buildClassificationList(itemData.classification_id)
  const itemName = `${itemData.inv_make} ${itemData.inv_model}`

  res.render("./inventory/edit-inventory", {
    title: "Edit " + itemName,
    nav,
    classificationSelect,
    errors: null,
    inv_id: itemData.inv_id,
    inv_make: itemData.inv_make,
    inv_model: itemData.inv_model,
    inv_year: itemData.inv_year,
    inv_description: itemData.inv_description,
    inv_image: itemData.inv_image,
    inv_thumbnail: itemData.inv_thumbnail,
    inv_price: itemData.inv_price,
    inv_miles: itemData.inv_miles,
    inv_color: itemData.inv_color,
    classification_id: itemData.classification_id
  })
}
/**BUILD EDIT INVENTORY */
invCont.buildEditInventory = async function (req, res, next) {
  const inv_id = req.params.inv_id
  const data = await invModel.getInventoryById(inv_id)
  const nav = await utilities.getNav()
  const classificationSelect = await utilities.buildClassificationList(data.classification_id)

  res.render("inventory/edit-inventory", {
    title: "Edit " + data.inv_make + " " + data.inv_model,
    nav,
    classificationSelect,
    errors: null,
    ...data
  })
}

/* ***************************
 *  Update Inventory Data
 * ************************** */
/* ***************************
 *  Update Inventory Data
 * ************************** */
invCont.editInventory = async function (req, res, next) {
  let nav = await utilities.getNav()
  const {
    inv_id,
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id,
  } = req.body

  const updateResult = await invModel.updateInventory(
    inv_id,
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id
  )

  if (updateResult) {
    const itemName = updateResult.inv_make + " " + updateResult.inv_model
    req.flash("notice", `The ${itemName} was successfully updated.`)
    res.redirect("/inv/")
  } else {
    const classificationSelect = await utilities.buildClassificationList(classification_id)
    const itemName = `${inv_make} ${inv_model}`
    req.flash("notice", "Sorry, the update failed.")
    res.status(501).render("inventory/edit-inventory", {
      title: "Edit " + itemName,
      nav,
      classificationSelect,
      errors: null,
      inv_id,
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color,
      classification_id
    })
  }
}

//BUILD DELETE INVENTORY VIEW
invCont.buildDeleteInventory = async function (req, res, next) {
  const inv_id = req.params.inv_id
  const itemData = await invModel.getInventoryById(inv_id)  
  if (!itemData) {
    req.flash("error", "Vehicle not found.")
    return res.redirect("/inv")
  }
  res.render("inventory/delete-confirm", {
    title: `Delete ${itemData.inv_make} ${itemData.inv_model}`,
    inv_id: itemData.inv_id,
    inv_make: itemData.inv_make,
    inv_model: itemData.inv_model,
    inv_year: itemData.inv_year,
    errors: null
  })
}

//DELETE INVENTORY
invCont.deleteInventory = async function (req, res) {
  try {
    const inv_id = req.body.inv_id || req.params.inv_id
    if (!inv_id) {
      if (req.xhr) {
        return res.status(400).json({ success: false, message: "Vehicle ID is required." })
      }
      req.flash("error", "Vehicle ID is required.")
      return res.redirect("/inv")
    }

    const result = await invModel.deleteInventory(inv_id)

    if (req.xhr) {
      // Resposta para AJAX
      return res.json({ success: result > 0 })
    }

    if (result > 0) {
      req.flash("notice", "Vehicle was successfully deleted.")
    } else {
      req.flash("error", "Vehicle could not be deleted.")
    }

    res.redirect("/inv")

  } catch (error) {
    console.error("Error deleting vehicle:", error)
    if (req.xhr) {
      return res.status(500).json({ success: false })
    }
    req.flash("error", "An error occurred while deleting the vehicle.")
    res.redirect("/inv")
  }
}

module.exports = invCont
