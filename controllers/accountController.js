const utilities = require("../utilities/")
const accountModel = require("../models/accountModel")

async function buildLogin(req, res) {
  let nav = await utilities.getNav()
  res.render("account/login", {
    title: "Login",
    nav,
    errors: [],
  })
}

async function loginAccount(req, res) {
    let nav = await utilities.getNav()
    const { account_email, account_password } = req.body

    const accountData = await accountModel.getAccountByEmail(account_email)
    if (!accountData) {
        return res.status(400).render("account/login", {
            title: "Login",
            nav,
            errors: ["Email not registered."],
        })
    }
    req.flash("notice", `Login successful. Welcome back!, ${accountData.account_firstname}`)
    res.redirect("/account/dashboard")
}


async function buildRegister(req, res) {
  let nav = await utilities.getNav()
  res.render("account/register", {
    title: "Register",
    nav,
    errors: [],
  })
}

async function registerAccount(req, res) {
  let nav = await utilities.getNav()
  const { account_firstname, account_lastname, account_email, account_password } = req.body

  const emailExists = await accountModel.getAccountByEmail(account_email)
  if (emailExists) {
    req.flash("notice", "Email already registered. Please log in or use another email.")
    return res.status(400).render("account/register", {
      title: "Register",
      nav,
      errors: ["Email already in use."],
    })
  }

  try {
    const regResult = await accountModel.registerNewAccount(
      account_firstname,
      account_lastname,
      account_email,
      account_password
    )

    req.flash(
      "notice",
      `Congratulations, you’re registered ${account_firstname}. Please log in.`
    )
    res.status(201).render("account/login", {
      title: "Login",
      nav,
      errors: [],
    })
  } catch (error) {
    console.error("Registration error:", error)
    req.flash("notice", "Sorry, the registration failed.")
    res.status(500).render("account/register", {
      title: "Register",
      nav,
      errors: ["Registration failed."],
    })
  }
}

module.exports = { buildLogin,loginAccount, buildRegister, registerAccount }
