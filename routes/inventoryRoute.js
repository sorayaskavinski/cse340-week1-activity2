const express = require("express")
const router = express.Router()
const invController = require("../controllers/invController")
const utilities = require("../utilities/index")

const{validateInventory, validateClassification} = require ("../utilities/inventory-validation")

// Route to build inventory by classification view
router.get("/type/:classification_id", invController.buildByClassificationId)

// Route to display detail view of a single vehicle
router.get("/detail/:inv_id", invController.buildVehicleDetail)

// Route to handle errors (for testing purposes)
router.get("/error", (req, res, next) => {
  throw new Error("Intentional error for testing")
})

//ASSIGNMENT UNIT 4
router.get("/", utilities.handleErrors(invController.getManagementView))
router.get("/add-classification", utilities.handleErrors(invController.buildAddClassification))
router.get("/add-inventory",utilities.handleErrors(invController.buildAddInventory))

//ASSIGNMENT UNIT 5 - TEAM ACTIVITY - DELETE ROUTE
router.get("/delete/:inv_id", utilities.handleErrors(invController.buildDeleteInventory))

//post routes
router.post("/add-inventory", validateInventory, utilities.handleErrors(invController.addInventory))
router.post("/add-classification", validateClassification, utilities.handleErrors(invController.addClassification))

//ASSIGNMENT UNIT 5 - TEAM ACTIVTY - POST ROUTE DELETE INVENTORY
router.post("/delete", utilities.handleErrors(invController.deleteInventory))

module.exports = router
