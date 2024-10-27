const show_pw_btn = document.querySelector('#show-password')
const show_pw_btn_check = document.querySelector('#show-password-check')
const show_pw_icon1 = show_pw_btn.querySelector('img')
const show_pw_icon2 = show_pw_btn_check.querySelector('img')
const pw_input = document.querySelector('#password')
const pw_input_check = document.querySelector('#password-check')
const btnSubmit = document.getElementById('btn_submit')

show_pw_btn.addEventListener('click', (event) => {

	event.preventDefault()

	pw_input.type = pw_input.type === 'password' ? 'text' : 'password'


	show_pw_icon1.src = show_pw_icon1.src.includes('open') 
		? '/assets/FrontPage/eye_closed.svg' 
		: '/assets/FrontPage/eye_open.svg'
})
show_pw_btn_check.addEventListener('click', (event) => {
	
	event.preventDefault()

	
	pw_input_check.type = pw_input_check.type === 'password' ? 'text' : 'password'


	show_pw_icon2.src = show_pw_icon2.src.includes('open') 
		? '/assets/FrontPage/eye_closed.svg' 
		: '/assets/FrontPage/eye_open.svg'
})
btnSubmit.onclick = function() {
    if (pw_input.value !== "") {
        if (pw_input.value === pw_input_check.value) {
            window.location.href = "profile.html"; 
        } else {
            alert("Password don't match");
        }
    } else {
        alert("Password can't be empty!");
    }
};
