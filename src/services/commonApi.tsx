import axios from "axios"

export const commonApi=async(method: string,url: string,data: any,headers: any)=>{
    const reConfig={
        method:method,
        url:url,
        data:data,
        headers:headers?headers :{"Content-Type":"application/json"}
    }

    try {
       const resut=await axios(reConfig)
       return resut 
    } catch (error) {
        return error
    }
}