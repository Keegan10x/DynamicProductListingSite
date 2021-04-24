
/* main.js */

import {file2DataURI} from './util.js'

window.addEventListener('DOMContentLoaded', () => {
	console.log('DOMContentLoaded')
	document.querySelector('input[type="file"]').addEventListener('change', (event) => showItem(event))
})

//switch image placeholder
async function showItem(event){
	console.log('ADD FILE')
	const files = event.target.files
		const file = files[0]
		if (file){
			const data = await file2DataURI(file)
			const img = document.querySelector('form img')
			img.src = data
		}
}

//show silder value
window.addEventListener('DOMContentLoaded', event => {
	console.log('DOM CONTENT LOADED')
	//document.forms.<forname>.elements
	const elements = document.forms.aItems.elements
	console.log(elements)
	const sliderInput = elements[3]
	console.log(sliderInput)
	document.querySelector('form').addEventListener('input', event => {
		console.log('INPUT CHANGED!')
		console.log(event.target)
		console.log(event.target.value)
		elements.price_val.value = elements.price.value
	})
})

