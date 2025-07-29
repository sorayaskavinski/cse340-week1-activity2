const express = require("express")
const router = express.Router()
const invController = require("../controllers/invController")

// Route to build inventory by classification view
router.get("/type/:classification_id", invController.buildByClassificationId)

// Route to display detail view of a single vehicle
router.get("/detail/:inv_id", invController.buildVehicleDetail)

// Route to handle errors (for testing purposes)
router.get("/error", (req, res, next) => {
  throw new Error("Intentional error for testing")
})

module.exports = router
