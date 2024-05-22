import axios from "app/axios"
import { TUserCred } from "./loginTypes"

function loginUser(userCred: TUserCred) {
  return axios.post(`/api/user/login`, userCred)
}

function getAuthorizedUser(token: string) {
  return axios.get(`/api/user`, {
    headers: {
      "Authorization": 'Bearer ' + token
    }
  })
}

const LoginService = {
  loginUser,
  getAuthorizedUser
}

export default LoginService