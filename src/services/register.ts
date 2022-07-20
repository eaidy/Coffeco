

const register = async (Phone: string, Email: string) => {
    try {
        const response = await fetch("https://api.entegre.pro/ui/UIntegration/CreateUser", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({Phone: Phone,Email : Email}),
        });
        console.log("burası")
        const body = await response.json()
        console.log(body)

    } catch (error){
        console.log(error)
    }
}


export { register };