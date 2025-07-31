const { addClassification, addInventory } = require("../controllers/invController")
const pool = require("../database/")

const invModel = {}

/* ***************************
 *  Get all classification data
 * ************************** */
async function getClassifications(){
  return await pool.query("SELECT * FROM public.classification ORDER BY classification_name")
}

/* ***************************
 *  Get all inventory items and classification_name by classification_id
 * ************************** */


async function getInventoryByClassificationId(classification_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory AS i 
      JOIN public.classification AS c 
      ON i.classification_id = c.classification_id 
      WHERE i.classification_id = $1`,
      [classification_id]
    )
    return data.rows
  } catch (error) {
    console.error("getclassificationsbyid error " + error)
  }
}

/* ***************************
 *  Get Vehicles by inventory ID
 * ************************** */
async function getInventoryById(inv_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory WHERE inv_id = $1`,
      [inv_id]
    )
    return data.rows[0]
  } catch (error) {
    console.error("getInventoryById error:", error)
  }
}

/* ***************************
 * Assignment UNIT 4 ADD CLASSIFICATION
 * ************************** */
invModel.getClassifications = async function () {
  try {
    const data = await pool.query("SELECT * FROM classification ORDER BY classification_name")
    return data.rows
  } catch (error) {
    throw new Error("Erro ao buscar classificações: " + error)
  }
}

invModel.addClassification = async function (classification_name) {
  try {
    const sql = `INSERT INTO public.classification (classification_name) 
                 VALUES ($1) RETURNING *`
    const result = await pool.query(sql, [classification_name])
    return result.rowCount
  } catch (error) {
    console.error("Error adding classification:", error)
    return null
  }
}

invModel.addInventory = async function (invData) {
  try {
    const sql = `
      INSERT INTO public.inventory 
      (inv_make, inv_model, inv_year, inv_description, inv_price, inv_miles, inv_color, classification_id)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *
    `
    const values = [
      invData.inv_make,
      invData.inv_model,
      invData.inv_year,
      invData.inv_description,
      invData.inv_price,
      invData.inv_miles,
      invData.inv_color,
      invData.classification_id,
    ]
    const result = await pool.query(sql, values)
    return result.rowCount
  } catch (error) {
    console.error("Error adding inventory item:", error)
    return null
  }
}


module.exports = {getClassifications, getInventoryByClassificationId, getInventoryById, addClassification, addInventory};
