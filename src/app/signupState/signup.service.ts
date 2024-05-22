import axios from "app/axios"
import { SignUpUserType } from "./signupTypes"

function SignUpUser(userCred: SignUpUserType) {
  return axios.post(`/api/user`, userCred);
}

function ResendVerifyToken(token:string) {
  return axios.get(`/api/user/resendVerifyToken`, {
    headers: {
      "Authorization": 'Bearer ' + token
    }
  });
}

const SignUpService = {
  SignUpUser,
  ResendVerifyToken
}

export default SignUpService