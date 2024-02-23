
document.getElementById('userLogin').addEventListener('submit', async (e) => {
    e.preventDefault()
    const email = document.querySelector("#email").value
    const password = document.querySelector("#password").value

    const response = await fetch("/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log(data);
        if (data.token && data.user.role !== 'admin') 
        {
            window.location.href = '/products';
        } else {
            window.location.href = '/admin/dashboard';
        }
      } else {
        console.error("Error en el inicio de sesión");
      } 
})

