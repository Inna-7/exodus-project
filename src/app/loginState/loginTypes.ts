import { NavigateFunction } from "react-router-dom";

export interface LoginUserType {
  userCred: TUserCred;
  navigate: NavigateFunction;
}

export interface TUserCred {
  username: string;
  password: string;
};
