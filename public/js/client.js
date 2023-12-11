document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.querySelector("#loginForm")

    loginForm.addEventListener("submit", async(e) => {
        e.preventDefault()

        const email = document.querySelector("#email").value
        const password = document.querySelector("#password").value

        //Realizar la solicitud de inicio de sesion 
        const response = await fetch("/login", {
            method: "POST",
            body: JSON.stringify({email, password}),
            headers: {
                "Content-Type": "application/json"
            }
        })

        if (response.ok) {
            const data = await response.json()
            console.log(data);
            localStorage.setItem("token", data.token)
        }else {
            console.error("Error en el inicio de sesion");
        }
    })
})