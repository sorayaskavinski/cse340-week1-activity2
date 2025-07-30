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

async function getAccountByEmail(account_email) {
  try {
    const sql = "SELECT * FROM account WHERE account_email = $1"
    const result = await pool.query(sql, [account_email])
    return result.rows.length > 0
  } catch (error) {
    throw error
  }
}

module.exports = { registerNewAccount, getAccountByEmail }
