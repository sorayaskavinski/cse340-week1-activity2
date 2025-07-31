const { body, validationResult } = require("express-validator");

const validateInventory = [
  body("inv_make")
    .trim()
    .notEmpty()
    .withMessage("Vehicle make is required."),

  body("inv_model")
    .trim()
    .notEmpty()
    .withMessage("Vehicle model is required."),

  body("inv_year")
    .trim()
    .isLength({ min: 4, max: 4 })
    .withMessage("Year must be 4 characters (e.g., 2023).")
    .isNumeric()
    .withMessage("Year must be a number."),

  body("inv_description")
    .trim()
    .notEmpty()
    .withMessage("Description is required."),

  body("inv_image")
    .trim()
    .notEmpty()
    .withMessage("Image path is required."),

  body("inv_thumbnail")
    .trim()
    .notEmpty()
    .withMessage("Thumbnail path is required."),

  body("inv_price")
    .trim()
    .notEmpty()
    .withMessage("Price is required.")
    .isNumeric()
    .withMessage("Price must be a number."),

  body("inv_miles")
    .trim()
    .notEmpty()
    .withMessage("Miles is required.")
    .isNumeric()
    .withMessage("Miles must be a number."),

  body("inv_color")
    .trim()
    .notEmpty()
    .withMessage("Color is required."),

  body("classification_id")
    .notEmpty()
    .withMessage("Classification is required.")
    .isInt({ min: 1 })
    .withMessage("Classification must be a valid ID."),

  // Middleware para tratar os erros
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      req.flash("error", errors.array().map(err => err.msg).join(" "));
      return res.redirect("back"); // ou renderizar a view com os dados preenchidos
    }
    next();
  }
];

const validateClassification = [
  body("classification_name")
    .trim()
    .notEmpty()
    .withMessage("Classification name is required.")
    .isLength({ min: 3 })
    .withMessage("Classification name must be at least 3 characters long.")
    .matches(/^[a-zA-Z\s]*$/)
    .withMessage("Classification name must contain only letters and spaces."),
  
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      req.flash("error", errors.array().map(err => err.msg).join(" "));
      return res.redirect("back");
    }
    next();
  }
];

module.exports = { validateInventory, validateClassification };
