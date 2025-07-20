import useApiService from "@/services/axios.config"
import { accountApi } from "./account"
import { authApi } from "./auth"
import { businessApi } from "./business"
import { uploadApi } from "./upload"
import { menuApi } from "./menu"
import { staffApi } from "./staff"


export function useApi(){
    const { platterApi } = useApiService()

    return {
        accountApi: accountApi(platterApi),
        authApi: authApi(platterApi),
        businessApi: businessApi(platterApi),
        uploadApi: uploadApi(platterApi),
        menuApi: menuApi(platterApi),
        staffApi: staffApi(platterApi)
        // Add other API services here
    }   
}