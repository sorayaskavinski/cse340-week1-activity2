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
//MANAGEMENT VIEW - UPDATE UNIT 5 TASK 2 
router.get("/", utilities.checkJWTToken, utilities.checkLogin, utilities.checkAccountType, utilities.handleErrors(invController.getManagementView))

router.get("/add-classification",  utilities.checkJWTToken, utilities.checkLogin,  utilities.checkAccountType, utilities.handleErrors(invController.buildAddClassification))
router.get("/add-inventory",  utilities.checkJWTToken, utilities.checkLogin, utilities.checkAccountType, utilities.handleErrors(invController.buildAddInventory))
router.get("/getInventory/:classification_id", utilities.handleErrors(invController.getInventoryJSON) )
router.get("/edit/:inv_id",  utilities.checkJWTToken, utilities.checkLogin, utilities.checkAccountType, utilities.handleErrors(invController.buildEditInventory))

//ASSIGNMENT UNIT 5 - TEAM ACTIVITY - DELETE ROUTE
router.get("/delete/:inv_id", utilities.handleErrors(invController.buildDeleteInventory))

//post routes
router.post("/add-inventory",  utilities.checkJWTToken, utilities.checkLogin, utilities.checkAccountType, validateInventory, utilities.handleErrors(invController.addInventory))
router.post("/add-classification", utilities.checkJWTToken, utilities.checkLogin, utilities.checkAccountType, validateClassification, utilities.handleErrors(invController.addClassification))
router.post("/by-classification", utilities.handleErrors(invController.getInventoryByClassification))

//ASSIGNMENT UNIT 5 - TEAM ACTIVTY - POST ROUTE DELETE INVENTORY
router.post("/delete", utilities.checkJWTToken, utilities.checkLogin, utilities.checkAccountType, utilities.handleErrors(invController.deleteInventory))
router.post("/edit", utilities.checkJWTToken, utilities.checkLogin, utilities.checkAccountType, validateInventory, utilities.handleErrors(invController.editInventory))

//Delete via AJAX
router.delete("/delete/:inv_id", utilities.checkJWTToken, utilities.checkLogin, utilities.checkAccountType, utilities.handleErrors(invController.deleteInventory))

//Inventary in JSON 
router.post("/by-classification", utilities.handleErrors(invController.getInventoryByClassification))

module.exports = router
