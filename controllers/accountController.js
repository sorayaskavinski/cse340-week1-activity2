const utilities = require("../utilities/")
const accountModel = require("../models/accountModel")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
require("dotenv").config()


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
    const { account_email, account_password } = req.body || {}

    const accountData = await accountModel.getAccountByEmail(account_email)
    if (!accountData) {
      req.flash("notice", "Please check your credentials and try again.")  
      return res.status(400).render("account/login", {
            title: "Login",
            nav,
            errors: null,
            account_email,
        })
        return
      }
    try {
    if (await bcrypt.compare(account_password, accountData.account_password)) {
      delete accountData.account_password
      const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 * 1000 })
      if(process.env.NODE_ENV === 'development') {
        res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 })
      } else {
        res.cookie("jwt", accessToken, { httpOnly: true, secure: true, maxAge: 3600 * 1000 })
      }
      return res.redirect("/account/management")
    }
    else {
      req.flash("message notice", "Please check your credentials and try again.")
      res.status(400).render("account/login", {
        title: "Login",
        nav,
        errors: null,
        account_email,
      })
    }
  } catch (error) {
    throw new Error('Access Forbidden')
  }
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
    // Hash the password before storing
  let hashedPassword
  try {
    
    hashedPassword = await bcrypt.hashSync(account_password, 10)
  } catch (error) {
    req.flash("notice", 'Sorry, there was an error processing the registration.')
    res.status(500).render("account/register", {
      title: "Registration",
      nav,
      errors: null,
    })
  }
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
      hashedPassword
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

async function buildAccountManagement(req, res) {
  const nav = await utilities.getNav()
  const accountData = res.locals.accountData
  res.render("account/management", {
    title: "Account Management",
    nav,
    errors: [],
    accountFirstname: accountData.account_firstname,
    accountId: accountData.account_id,
    accountType: accountData.account_type,
  })
}
//LOGOUT - UNIT 5 ASSIGNMENT -- task 6
function logout(req, res) {
  res.clearCookie("jwt", {httpOnly: true, secure: true})
  req.flash("notice", "You have been logged out.")
  res.redirect("/")
}

//UNIT 5 TASK 3 - update ACCOUNT INFORMATION - UNIT 5 TASK 3

async function buildUpdateAccount(req, res) {
  const account_id = req.params.account_id
  const accountData = await accountModel.getAccountById(account_id)
  
  const nav = await utilities.getNav()

  res.render("account/update", {
    title: "Update Account",
    nav,
    errors: null,
    account_id: accountData.account_id,
    account_firstname: accountData.account_firstname,
    account_lastname: accountData.account_lastname,
    account_email: accountData.account_email    
  })
}

/* ======== Update account info - UNIT 5 TASK 3 ======== */
async function updateAccountInfo(req, res) {
  const { account_id, account_firstname, account_lastname, account_email } = req.body

  const updateResult = await accountModel.updateAccountInfo(
    account_id,
    account_firstname,
    account_lastname,
    account_email
  )

  const nav = await utilities.getNav()
  if (updateResult) {
    req.flash("notice", "Account information updated successfully.")
    res.redirect("/account/management")
  } else {
    req.flash("notice", "Sorry, the update failed.")
    res.status(501).render("account/update", {
      title: "Update Account",
      nav,
      errors: null,
      account_id,
      account_firstname,
      account_lastname,
      account_email
    })
  }
}

/* ======== Update password - UNIT 5 TASK 3======== */
async function updateAccountPassword(req, res) {
  const { account_id, account_password } = req.body
  let hashedPassword

  try {
    hashedPassword = await bcrypt.hash(account_password, 10)
  } catch (error) {
    req.flash("notice", "Password hashing failed.")
    return res.redirect(`/account/update/${account_id}`)
  }

  const updateResult = await accountModel.updateAccountPassword(account_id, hashedPassword)

  if (updateResult) {
    req.flash("notice", "Password updated successfully.")
    res.redirect("/account/management")
  } else {
    req.flash("notice", "Password update failed.")
    res.redirect(`/account/update/${account_id}`)
  }
}

module.exports = { buildLogin,loginAccount, buildRegister, registerAccount, buildAccountManagement, logout, buildUpdateAccount, updateAccountInfo, updateAccountPassword }
