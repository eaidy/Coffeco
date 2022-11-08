// Model Imports
import { RegisterFormModel } from '@/models/models'

const register = async (RegisterFormValues: RegisterFormModel) => {
    try {
        const response = await fetch("https://api.coffeco.com.tr/ui/UIntegration/CreateUser", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(RegisterFormValues)
        });
        const body = await response.json()
        console.log(body)

        return body

    } catch (error) {
        console.log(error)
    }
}


export { register };