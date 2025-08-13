const purchaseModel = require("../models/purchaseModel");

/********* UNIT 6 SORAYA SKAVINSKI - PURCHASE BUTTON - REGISTER PURCHASE ********/
async function buyVehicle(req, res) {
  try {
    const account_id = res.locals.accountData.account_id; // Já vem do login
    const inv_id = req.params.inv_id;

    await purchaseModel.insertPurchase(account_id, inv_id);

    req.flash("notice", "Vehicle purchased successfully!");
    res.redirect("/purchase/my-purchases");
  } catch (error) {
    console.error("Error buying vehicle:", error);
    req.flash("notice", "Error purchasing vehicle. Please try again.");
    res.redirect("back");
  }
}

/* List purchases to clients */
async function showMyPurchases(req, res) {
  try {
    const account_id = res.locals.accountData.account_id;
    const purchases = await purchaseModel.getPurchasesByAccount(account_id);

    res.render("purchase/my-purchases", {
      title: "My Purchases",
      purchases,
      accountData: res.locals.accountData,
      year: new Date().getFullYear(),
    });
  } catch (error) {
    console.error("Error fetching purchases:", error);
    req.flash("notice", "Error loading purchases.");
    res.redirect("/");
  }
}

module.exports = { buyVehicle, showMyPurchases };
