
/* routes.js */

import { Router } from 'https://deno.land/x/oak@v6.3.2/mod.ts'
import { Handlebars } from 'https://deno.land/x/handlebars/mod.ts'
import { upload } from 'https://cdn.deno.land/oak_upload_middleware/versions/v2/raw/mod.ts'

// import { parse } from 'https://deno.land/std/flags/mod.ts'

import { login, register } from './modules/accounts.js'
import { addItem } from './modules/items.js'
// import img collector function
import { collector } from './modules/items.js'
import { privateCollector } from './modules/items.js'

const handle = new Handlebars({ defaultLayout: '' })

const router = new Router()

// the routes defined here
router.get('/', async context => {
	//const authorised = context.cookies.get('authorised')
	//const data = { authorised }
	const itemData = await collector()
	
	const body = await handle.renderView('home', itemData)
	context.response.body = body
	
})

router.get('/home', async context => {
	const authorised = context.cookies.get('authorised')
	if (authorised === undefined) context.response.redirect('/login')
	
	const itemData = await collector()
	itemData.authorised = authorised	
	//itemData.authorised = { authorised }
	console.log(itemData)
	
	const body = await handle.renderView('home', itemData)
	context.response.body = body
	
})


router.get('/login', async context => {
	const body = await handle.renderView('login')
	context.response.body = body
})

router.get('/register', async context => {
	const body = await handle.renderView('register')
	context.response.body = body
})

router.post('/register', async context => {
	console.log('POST /register')
	const body = context.request.body({ type: 'form' })
	console.log(body)
	const value = await body.value
	console.log(value)
	const user = value.get('user')
	const pass = value.get('pass')
	const pass2 = value.get('pass2')
	const phone = value.get('phone')
	const email = value.get('email')
	console.log(`${user} : ${pass}`)
	await register(user, pass, pass2, phone, email)
	context.response.redirect('/login')
})

router.get('/logout', context => {
  // context.cookies.set('authorised', null) // this does the same
  context.cookies.delete('authorised')
  context.response.redirect('/')
})

router.post('/login', async context => {
	console.log('POST /login')
	const body = context.request.body({ type: 'form' })
	const value = await body.value
	const user = value.get('user')
	const pass = value.get('pass')
	//console.log(`${user} : ${pass}`)
	console.log("In Successfully")
	try {
		await login(user, pass)
		context.cookies.set('authorised', user)
		context.response.redirect('/home')
	} catch(err) {
		console.log('ERROR CAUGHT IN ROUTE')
		context.response.redirect('/login')
	}
})

//form route
router.get('/new', async context => {
	console.log('GET /new')
	const authorised = context.cookies.get('authorised')
	if (authorised === undefined) context.response.redirect('/login')
	const body = await handle.renderView('new')
	context.response.body = body
})

//post form data
router.post('/new', async context => {
	console.log('POST /new')
	const body = await context.request.body({ type: 'form-data'})
	const data = await body.value.read()
	data.username = context.cookies.get('authorised')
	console.log(data)
	await addItem(data)
	
	context.response.redirect('/home')
})

//Item Details Page Router
router.get('/details/:id', async context => {
	const authorised = context.cookies.get('authorised')
	if (authorised === undefined) context.response.redirect('/login')
	const itemID = context.params.id
	console.log(context.params.id)
		
	const privateItemData = await privateCollector(itemID)
	privateItemData.authorised = authorised
	console.log(privateItemData)
	
	const body = await handle.renderView('details', privateItemData)
	context.response.body = body
})


export default router
