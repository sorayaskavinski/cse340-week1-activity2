const pool = require("../database/")
const invModel = {}

/* ***************************
 *  Get all classification data
 * ************************** */
invModel.getClassifications = async function () {
  try {
    const data = await pool.query("SELECT * FROM classification ORDER BY classification_name")
    return data.rows
  } catch (error) {
    throw new Error("Erro ao buscar classificações: " + error)
  }
}

/* ***************************
 *  Get all inventory items and classification_name by classification_id
 * ************************** */
invModel.getInventoryByClassificationId = async function (classification_id) {
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
    console.error("getInventoryByClassificationId error:", error)
    return null
  }
}

/* ***************************
 *  Get Vehicles by inventory ID
 * ************************** */
invModel.getInventoryById = async function (inv_id) {
  try {
     const sql = "SELECT * FROM public.inventory WHERE inv_id = $1"
    const data = await pool.query(sql, [inv_id])
    return data.rows[0] // retorna o primeiro registro
  } catch (error) {
    console.error("getInventoryById error", error)
    throw error
  }
}

/* ***************************
 *  Add a new classification
 * ************************** */
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

/* ***************************
 *  Add a new inventory item
 * ************************** */
invModel.addInventory = async function (invData) {
  try {
    const sql = `
      INSERT INTO public.inventory 
      (inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING *
    `
    const values = [
      invData.inv_make,
      invData.inv_model,
      invData.inv_year,
      invData.inv_description,
      invData.inv_image,
      invData.inv_thumbnail,
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

/* ***************************
 *  DELETE inventory item
 * ************************** */
invModel.deleteInventory = async function (inv_id) {
   try {
    const sql = "DELETE FROM public.inventory WHERE inv_id = $1"
    const data = await pool.query(sql, [inv_id])
    return data.rowCount // retorna o número de linhas afetadas
  } catch (error) {
    console.error("deleteInventory error", error)
    throw error
  }
}

/* ***************************
 *  Get all inventory items
 * ************************** */
invModel.getAllInventory = async function () {
  try {
    const sql = `
      SELECT inv_id, inv_make, inv_model, classification_name
      FROM public.inventory
      JOIN public.classification
      ON inventory.classification_id = classification.classification_id
      ORDER BY inv_id
    `
    const data = await pool.query(sql)
    return data.rows
  } catch (error) {
    console.error("getAllInventory error", error)
    throw error
  }
}

/*  UPDATE INVENTORY*/
invModel.updateInventory = async function (
  inv_id,
  inv_make,
  inv_model,
  inv_description,
  inv_image,
  inv_thumbnail,
  inv_price,
  inv_year,
  inv_miles,
  inv_color,
  classification_id
) {
  try {
    const sql = `
      UPDATE public.inventory
      SET
        inv_make = $1,
        inv_model = $2,
        inv_description = $3,
        inv_image = $4,
        inv_thumbnail = $5,
        inv_price = $6,
        inv_year = $7,
        inv_miles = $8,
        inv_color = $9,
        classification_id = $10
      WHERE inv_id = $11
      RETURNING *;
    `
    const data = await pool.query(sql, [
      inv_make,
      inv_model,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_year,
      inv_miles,
      inv_color,
      classification_id,
      inv_id
    ])
    return data.rows[0]
  } catch (error) {
    console.error("Erro no updateInventory:", error)
    return null
  }
}

module.exports = invModel
