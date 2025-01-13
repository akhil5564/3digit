import axios from "axios"

export const commonApi=async(method,url,data,headers)=>{
    const reConfig={
        method:method,
        url:url,
        data:data,
        headers:headers?headers :{"Content-Type":"application/json"}
    }

    try {
       const resut=await axios
       return resut 
    } catch (error) {
        return error
    }
}