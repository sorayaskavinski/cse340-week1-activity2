const pool = require("../database")

async function registerNewAccount(account_firstname, account_lastname, account_email, account_password) {
  try {
    const sql = `INSERT INTO account 
      (account_firstname, account_lastname, account_email, account_password, account_type) 
      VALUES ($1, $2, $3, $4, 'Client') RETURNING *`
    const result = await pool.query(sql, [account_firstname, account_lastname, account_email, account_password])
    return result.rows[0]
  } catch (error) {
    throw error
  }
}

/* *****************************
* Return account data using email address
* ***************************** */
async function getAccountByEmail (account_email) {
  try {
    const result = await pool.query(
      'SELECT account_id, account_firstname, account_lastname, account_email, account_type, account_password FROM account WHERE account_email = $1',
      [account_email])
    return result.rows[0]
  } catch (error) {
    return new Error("No matching email found")
  }
}

/* *****************************
* Return account by ID - UNIT 5 TASK 3
* ***************************** */
async function getAccountById(account_id) {
  try {
    const result = await pool.query(
      "SELECT account_id, account_firstname, account_lastname, account_email FROM public.account WHERE account_id = $1",
      [account_id]
    )
    return result.rows[0]
  } catch (error) {
    console.error("getAccountById error:", error)
  }
}

/* UPDATE info - UNIT 5 TASK 3 */
async function updateAccountInfo(account_id, firstname, lastname, email) {
  try {
    const sql = `
      UPDATE public.account
      SET account_firstname = $1,
          account_lastname = $2,
          account_email = $3
      WHERE account_id = $4
      RETURNING *;
    `
    const data = await pool.query(sql, [firstname, lastname, email, account_id])
    return data.rows[0]
  } catch (error) {
    console.error("updateAccountInfo error:", error)
    return null
  }
}

/* UPDATE PASSWORD - UNIT 5 TASK 3 */
async function updateAccountPassword(account_id, hashedPassword) {
  try {
    const sql = `
      UPDATE public.account
      SET account_password = $1
      WHERE account_id = $2
      RETURNING *;
    `
    const data = await pool.query(sql, [hashedPassword, account_id])
    return data.rows[0]
  } catch (error) {
    console.error("updateAccountPassword error:", error)
    return null
  }
}


module.exports = { registerNewAccount, getAccountByEmail, getAccountById, updateAccountInfo, updateAccountPassword, updateAccountInfo, updateAccountPassword}
