const registerForm = document.querySelector('#registerForm');

if(registerForm){
    registerForm.addEventListener('submit', (evet)=>{
        evet.preventDefault();

        let name = document.querySelector('#username').value;
        let password = document.querySelector('#password').value;

        if(name === "" || password === ""){
            alert('Please Fill All Field')
            return;
        }

        let user = {
            name:name,
            password:password,
            currency: "INR",
            theme: "light",
            transactions: []
        };

        saveDataLS("fintrackUser", user)

        alert('Account Created Successfully')
        console.log(window)
        window.location.href = "index.html";
    })
}

const loginForm = document.querySelector('#loginForm');

if(loginForm){
    loginForm.addEventListener('submit', (evet)=>{
        evet.preventDefault();

        let name = document.querySelector('#loginName').value;
        let password = document.querySelector('#loginPassword').value;
        
        let user = getDataFromLs("fintrackUser")

        if(!user){
            alert('User Not Found')
            return;
        }

        if(name === user.name && password === user.password){
            saveDataLS("loggedIn", "true")
            window.location.href = "dashboard.html";
        }
        else{
            alert('Wrong Username Or Password')
        }

    })
}

const logoutBtn = document.querySelector('.logoutBtn');
if(logoutBtn){
    logoutBtn.addEventListener('click', ()=>{
        clearFinTrackData();
        Window.location.href = "index.html";
    })
}