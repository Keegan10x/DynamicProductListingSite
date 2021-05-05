
/* items.js */

import { db } from './db.js'

export async function addItem(data){
	console.log('addItem()')
	data.fields.username = data.username
	data.files[0].username = data.username
	data.fields.Item = await saveItem(data.files[0])
	await addItemDetails(data.fields)
	
	
}


//gets the image
async function saveItem(file){
	let filename = ''
	if(file.contentType !== 'application/octet-stream'){
		const ext = file.filename.split('.').pop()
		filename = `${file.username}-${Date.now()}.${ext}`
		await Deno.rename(file.filename, `${Deno.cwd()}/public/uploads/${filename}`)
	}
	return filename
}


async function addItemDetails(data){
	console.log(data)
	let sql = `SELECT id FROM accounts WHERE user = "${data.username}"`
	const result = await db.query(sql)
	const userid = result[0].id
	const sale = true
	const now = new Date().toISOString()
	const date = now.slice(0,19).replace('T', ' ')
	console.log(date)
	
	// is user description blank ? basically redundant
	//var user_description = data.description
	//if (user_description === undefined || user_description === ''){
	//	user_description = 'NULL'
	//}
	//console.log(user_description)	
	
	// new html description 
	let htmldesc = data.html
	if (htmldesc === undefined || htmldesc === ''){
		htmldesc = 'NULL'
	}
	console.log(htmldesc)
	
	//redundant doesn't work
	//convert user description to html
	//let converter
	//converter = new showdown.Converter()
	//const htmlDescription = converter.makeHtml(user_description)
	//console.log(htmlDescription)

	try{
		//wrap this around a try block
		//description cant be > than 2500 characters.
		sql = `INSERT INTO items(userid, item_name, image, description, price, added, for_sale)\
		VALUES(${userid}, '${data.name}', '${data.Item}', '${htmldesc}', ${data.price}, '${date}', ${sale})`
		
		console.log(sql)
		await db.query(sql);
	} catch (error) {
		console.log(error)
		console.log('some thing went wrong in the INSERT statment, hint: Description must be less than 2500 characters')
	} finally {
		console.log ('ran function: addItemDetails')
	}
	
}

export async function collector(){
	const sql = `SELECT item_id, item_name, image, price FROM items ORDER BY item_id DESC`
	const result = await db.query(sql)
	const data = {
		items:result
	}
	return data
	
}


export async function privateCollector(ID){
	const id = ID
	const sql = `SELECT items.item_id, items.userid, accounts.user, accounts.tel, accounts.email, items.item_name, items.image, items.description, items.price, DATE_FORMAT(items.added, '%d-%M-%Y') AS date\
	FROM items INNER JOIN accounts ON items.userid=accounts.id WHERE items.item_id = ${id}` 
	console.log(sql)
	const result = await db.query(sql)
	const data = {
		items:result
	}
	console.log(data)
	return data
	
}

export async function canDisplayForm(auth, user){
	if (auth != user){
		return true
	} else {
		return false
	}
}

export async function makeOffer(user, item, offer){
	const sql = `INSERT INTO offers(user, item, offer)\
	VALUES(${user}, ${item}, ${offer})`
	console.log(sql)
	await db.query(sql)
	console.log("offer made")
}
 
//check to see if user has already made an offer for a given item
export async function hasMadeOffer(itemid, userid){
	const sql = `SELECT * FROM offers WHERE item = ${itemid}`
	const record = await db.query(sql)
	const offersObj = { offer:record }
	try{
		console.log(offersObj)
	}
	catch(err) {
		console.log(err)
	}
	
	try{
		const userRecord = offersObj.offer[0].user
		
		console.log(userRecord)
		
		if (userRecord === userid){
			return true
		}else{
			return false
		}
	}
	catch(err) {
		console.log(err)
		return false
	}
	
}


export async function getBuyerId(user){
	const sql = `SELECT id FROM accounts WHERE user='${user}'`
	const result = await db.query(sql)
	const data = { buyer:result }
	return data
}


export async function updateOffer(buyerId, itemId, updatedOffer){
	console.log('//////////SHOWING//THE///DATA///////////')
	console.log(buyerId)
	console.log(itemId)
	console.log(updatedOffer)
	console.log('////////////////////////////////////////')
	
	
	//delete old record
	//const dropOldRecord = `DELETE FROM offers WHERE user = ${buyerId} AND item = ${itemId}`
	//console.log(dropOldRecord)
	//await db.query(dropOldRecord)
	
	//add new record
	//const addNewRecord = `INSERT INTO offers(user, item, offer) VALUES(${buyerId}, ${itemId}, ${updatedOffer})`
	//console.log(addNewRecord)
	//await db.query(addNewRecord)
	
	console.log('updateOffer is running')
	const sql = `UPDATE offers SET offer = ${updatedOffer}\ 
	WHERE user = ${buyerId} AND item = ${itemId}`
	console.log(sql)
	await db.query(sql)	
}

