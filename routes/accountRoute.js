const express = require("express")
const router =new express.Router()
const accountController = require("../controllers/accountController")
const utilities = require("../utilities")
const regValidate = require("../utilities/account-validation")

const { validationResult } = require("express-validator")

/* ******************************
 * Check data and return errors or continue to registration
 * *****************************/
async function checkRegData(req, res, next){
    const errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    return res.status(400).render("account/register", {
      errors: errors.array(), // manda array de erros para a view
      title: "Register",
      nav,
      account_firstname: req.body.account_firstname,
      account_lastname: req.body.account_lastname,
      account_email: req.body.account_email,
    })
  }
  next()
}

/* ROUTES*/
router.get("/login", utilities.handleErrors(accountController.buildLogin))
router.get("/register", utilities.handleErrors(accountController.buildRegister))

/** ROUTER POST */
router.post("/register", regValidate.registationRules(),
checkRegData, utilities.handleErrors(accountController.registerAccount))

module.exports = router