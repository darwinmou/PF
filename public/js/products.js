

document.getElementById("add-message-form").addEventListener("submit", async (e) => {
    e.preventDefault()

    const userName = document.getElementById("message-user")
    const messageInput = document.getElementById("message-text")

    const user = userName.value
    const message = messageInput.value

    try {
        const response = await fetch("/api/messages", {
            method: "POST",
            headers: {
                "Content-type": "application/json",
            },
            body: JSON.stringify({user, message}),
        })
        if (response.ok) {
            const responseData = await response.json()
            const successmessage = responseData.message
        }
    } catch (error) {
        
    }
})