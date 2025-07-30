const express = require("express")
const router = express.Router()
const invController = require("../controllers/invController")
const utilities = require("../utilities/index")

const{validateInventory} = require ("../utilities/inventory-validation")

// Route to build inventory by classification view
router.get("/type/:classification_id", invController.buildByClassificationId)

// Route to display detail view of a single vehicle
router.get("/detail/:inv_id", invController.buildVehicleDetail)

// Route to handle errors (for testing purposes)
router.get("/error", (req, res, next) => {
  throw new Error("Intentional error for testing")
})

//ASSIGNMENT UNIT 4
router.get("/", utilities.handleErrors(invController.buildManagement))
router.get("/add-classification", invController.buildAddClassification)
router.post("/inventory/add", validateInventory, invController.addInventory)

module.exports = router
