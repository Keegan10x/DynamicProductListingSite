
/* accounts.js */

import { compare, genSalt, hash } from 'https://deno.land/x/bcrypt@v0.2.4/mod.ts'

import { db } from './db.js'

const saltRounds = 10
const salt = await genSalt(saltRounds)

export async function login(username, password) {
	let sql = `SELECT count(id) AS count FROM accounts WHERE user="${username}";`
	let records = await db.query(sql)
	if(!records[0].count) throw new Error(`username "${username}" not found`)
	sql = `SELECT pass FROM accounts WHERE user = "${username}";`
	records = await db.query(sql)
	const valid = await compare(password, records[0].pass)
	if(valid === false) throw new Error(`invalid password for account "${username}"`)
	return username
}

export async function register(username, password, pasword2, phone, userEmail) {
	password = await hash(password, salt)
	const sql = `INSERT INTO accounts(user, pass, tel, email) VALUES("${username}", "${password}", "${phone}", "${userEmail}")`
	console.log(sql)
	const records = await db.query(sql)
	console.log(records)
	return true
}