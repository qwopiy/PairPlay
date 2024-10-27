const show_pw_btn = document.querySelector('#show-password')
const show_pw_icon1 = show_pw_btn.querySelector('img')
const pw_input = document.querySelector('#password')
const btnSubmit = document.getElementById('btn_submit')

show_pw_btn.addEventListener('click', (event) => {

	event.preventDefault()

	pw_input.type = pw_input.type === 'password' ? 'text' : 'password'


	show_pw_icon1.src = show_pw_icon1.src.includes('open') 
		? '/assets/FrontPage/eye_closed.svg' 
		: '/assets/FrontPage/eye_open.svg'
})