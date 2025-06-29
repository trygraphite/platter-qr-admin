import useApiService from "@/services/axios.config"
import { accountApi } from "./account"
import { authApi } from "./auth"


export function useApi(){
    const { platterApi } = useApiService()

    return {
        accountApi: accountApi(platterApi),
        authApi: authApi(platterApi),
        // Add other API services here
    }   
}