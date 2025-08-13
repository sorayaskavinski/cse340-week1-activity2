const pool = require("../database/"); 

/* UNIT 6 - SORAYA SKAVINSKI PURCHASE IMPLEMENTATION */
async function insertPurchase(account_id, inv_id) {
  try {
    const sql = `
      INSERT INTO public.purchase (account_id, inv_id)
      VALUES ($1, $2)
      RETURNING purchase_id
    `;
    const data = await pool.query(sql, [account_id, inv_id]);
    return data.rows[0];
  } catch (error) {
    throw error;
  }
}

/* SEARCH PURCHASES BY USER */
async function getPurchasesByAccount(account_id) {
  try {
    const sql = `
      SELECT p.purchase_id, p.purchase_date,
             i.inv_make, i.inv_model, i.inv_price
      FROM public.purchase p
      JOIN public.inventory i ON p.inv_id = i.inv_id
      WHERE p.account_id = $1
      ORDER BY p.purchase_date DESC
    `;
    const data = await pool.query(sql, [account_id]);
    return data.rows;
  } catch (error) {
    throw error;
  }
}

module.exports = { insertPurchase, getPurchasesByAccount };

