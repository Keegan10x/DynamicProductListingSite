
let converter
let timeout
const delay = 450

//window.addEventListener('DOMContentLoaded', async event => {
window.addEventListener('DOMContentLoaded', event => {
  console.log('DOMContentLoaded')
	converter = new showdown.Converter({'tables': true, 'tasklists': true, 'strikethrough': true})
  const options = converter.getOptions()
  console.log(options)
	
	//check to see if they user has inputted something
	document.querySelector('textarea').addEventListener('input', event => {
		clearTimeout(timeout)
		timeout = setTimeout( event => {
			
			//this here is getting the text to be converted to mark down
			const markdown = document.querySelector('textarea').value
			console.log(markdown)
			
			//convets the markdown into html
			const html = converter.makeHtml(markdown)
			console.log(html)
			document.querySelector('article').innerHTML = html
			document.querySelector('input#html').value = html
    }, delay)
	})
})






