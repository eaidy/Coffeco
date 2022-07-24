import { UserState } from '@/models/models'

const login = async (phoneNumber: string, password: string) => {

    let body: UserState

    try {
        const response = await fetch("https://api.entegre.pro/ui/UIntegration/Login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ Cep: phoneNumber, password: password }),
        });
        body = await response.json()

        return body

    } catch (error) {
        console.log(error)
    }
}


export { login };