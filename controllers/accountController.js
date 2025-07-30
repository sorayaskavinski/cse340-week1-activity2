const utilities = require("../utilities/")

async function buildLogin(req, res) {
    let nav = await utilities.getNav()
    res.render("account/login", {
        title: "Login",
        nav,
        message: "Registration successful! Please log in.",
    })
}

// Build Register View 
async function buildRegister(req, res, next) {
    let nav = await utilities.getNav()
    res.render("account/register", {
        title: "Register",
        nav,
        errors: null,
    })
}

//Unit 4 - Register Account
async function registerAccount(req, res) {
  const { firstName, lastName, email, password } = req.body

  // Simples validação de back-end (além da regex no front)
  const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]).{12,}$/
  if (!passwordRegex.test(password)) {
    const nav = await utilities.getNav()
    return res.status(400).render("account/register", {
      title: "Register",
      nav,
      errors: ["Password does not meet requirements."],
    })
  }

  const nav = await utilities.getNav()
  res.render("account/login", {
    title: "Login",
    nav,
    message: "Registration successful! Please log in.",
  })
}

module.exports = {buildLogin, buildRegister, registerAccount}