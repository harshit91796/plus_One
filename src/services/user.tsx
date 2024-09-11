import { getRequest, postRequest } from "../utils/service";

// postRequest(endpoint, data)

export const createUser = async (userdata) => {
  return await postRequest("/user/create-user", userdata);
};

export const userLogin = async (data) => {
  return await postRequest("/user/user-login", data);
};

export const checkIfUserNameAvailable = async (username) => {
  return await postRequest("/user/username-check", username);
};

export const verifyOtp=async(data)=>{
  return await postRequest("/user/verify-otp", data);
}

export const getUserDetails=async()=>{
  return await getRequest("/user/getuserdetails")
}
export const updateUserDetails=async(data)=>{
  return await postRequest("/user/update-details", data);
}