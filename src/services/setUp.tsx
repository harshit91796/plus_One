import { getRequest, postRequest } from "../utils/service";

// postRequest(endpoint, data)

export const getPrefrence = async (data) => {
  return await postRequest("/setup/getprefrence",{"title":data});
};


export const updatePrefrence=async(data)=>{
    return await postRequest("/setup/updateprefrence",data);
}