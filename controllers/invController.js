const invModel = require("../models/inventory-model")
const utilities = require("../utilities")
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
invCont.getManagementView = async function (req, res) {
  const nav = await utilities.getNav(req, res)
  res.render("inventory/management", {
    title: "Inventory Management",
    nav,
    errors: null,
    message: req.flash("message")
  })
}

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
      res.status(500).render("/inv/add-classification", {
        title: "Add Classification",
        nav,
        errors: null,
      })
    }
  } catch (error) {
    console.error(error)
    res.status(500).render("/inv/add-classification", {
      title: "Add Classification",
      nav,
      errors: null,
    })
  }
}

invCont.insertClassification = async function (req, res) {
  const { classification_name } = req.body;
  try {
    const result = await invModel.addClassification(classification_name);
    if (result) {
      req.flash("message", "Classification added successfully!");
      res.redirect("/inv/");
    } else {
      req.flash("message", "Failed to add classification.");
      res.redirect("/inv/add-classification");
    }
  } catch (error) {
    console.error("Error adding classification:", error);
    res.status(500).render("inventory/add-classification", {
      title: "Add Classification",
      errors: ["Server error. Try again later."],
    });
  }
};


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
      res.redirect("inv/")
    } else {
      const classificationList = await utilities.buildClassificationList(invData.classification_id)
      res.render("inv/add-inventory", {
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
    res.status(500).render("inv/add-inventory", {
      title: "Add Vehicle",
      classificationList,
      message: "❌ Something went wrong while adding the vehicle.",
      inv: invData,
      errors: [error.message]
    })
  }
}

invCont.insertInventory = async function (req, res) {
  const {
    classification_id,
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
  } = req.body;

  try {
    const result = await invModel.addInventory(
      classification_id,
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color
    );

    if (result) {
      req.flash("message", "New inventory item added successfully!");
      res.redirect("/inv/");
    } else {
      req.flash("message", "Failed to add inventory item.");
      res.redirect("/inv/add-inventory");
    }
  } catch (error) {
    console.error("Error adding inventory:", error);
    res.status(500).render("inventory/add-inventory", {
      title: "Add Inventory",
      errors: ["Server error. Try again later."],
    });
  }
};

module.exports = invCont
