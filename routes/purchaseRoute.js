//*** UNIT 6 - SORAYA SKAVINSKI PURCHASE ROUTE ****/

const express = require("express");
const router = express.Router();
const purchaseController = require("../controllers/purchaseController");
const utilities = require("../utilities/");

router.post("/buy/:inv_id", utilities.checkLogin, purchaseController.buyVehicle);
router.get("/my-purchases", utilities.checkLogin, purchaseController.showMyPurchases);

module.exports = router;
