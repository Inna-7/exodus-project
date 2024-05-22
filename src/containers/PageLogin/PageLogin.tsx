import React, { FC, useEffect, FormEvent, ChangeEvent } from "react";
import facebookSvg from "images/Facebook.svg";
import twitterSvg from "images/Twitter.svg";
import googleSvg from "images/Google.svg";
import { Helmet } from "react-helmet";
import Input from "shared/Input/Input";
import { Link, useNavigate } from "react-router-dom";
import ButtonPrimary from "shared/Button/ButtonPrimary";
import {
  loginUser,
  selectLoginState,
  setLoginError,
  setPassword,
  setUserName
} from 'app/loginState/loginSlice';
import { useAppDispatch, useAppSelector } from "app/hooks";
import { selectSignupState, setVerificationPopup } from "app/signupState/signupSlice";
import EmailVerificationModal from "components/EmailVerificationModal";

export interface PageLoginProps {
  className?: string;
}

const loginSocials = [
  {
    name: "Continue with Facebook",
    href: "#",
    icon: facebookSvg,
  },
  {
    name: "Continue with Twitter",
    href: "#",
    icon: twitterSvg,
  },
  {
    name: "Continue with Google",
    href: "#",
    icon: googleSvg,
  },
];

const PageLogin: FC<PageLoginProps> = ({ className = "" }) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate()
  const { username, password, error } = useAppSelector(selectLoginState)
  const { verificationPopup } = useAppSelector(selectSignupState)

  useEffect(() => {
    if(error === "Email is not verified"){
      dispatch(setVerificationPopup())
    }
  },[error]);

  let handleEmail = (event: ChangeEvent<HTMLInputElement>) => {
    dispatch(setUserName(event.target.value))
  };

  let handlePassword = (event: ChangeEvent<HTMLInputElement>) => {
    dispatch(setPassword(event.target.value))
  };

  let handleLogin = (event: FormEvent) => {
    event.preventDefault();
    if (!username || !password) {
      dispatch(setLoginError(`Email and password are required`))
      return;
    }
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(username)) {
      dispatch(setLoginError(`Invalid email address`))
      return;
    }
    let userCred = { username, password };
    dispatch(loginUser({ userCred, navigate }))
  };

  return (
    <div className={`nc-PageLogin ${className}`} data-nc-id="PageLogin">
      <Helmet>
        <title>Login || Booking React Template</title>
      </Helmet>
      <div className="container mb-24 lg:mb-32">
        <h2 className="mt-20 mb-10 flex items-center text-3xl leading-[115%] md:text-5xl md:leading-[115%] font-semibold text-neutral-900 dark:text-neutral-100 justify-center">
          Login
        </h2>
        <div className="max-w-md mx-auto space-y-6">
          {/* <div className="grid gap-3">
            {loginSocials.map((item, index) => (
              <a
                key={index}
                href={item.href}
                className="flex w-full rounded-lg bg-primary-50 dark:bg-neutral-800 px-4 py-3 transform transition-transform sm:px-6 hover:translate-y-[-2px]"
              >
                <img
                  className="flex-shrink-0"
                  src={item.icon}
                  alt={item.name}
                />
                <h3 className="flex-grow text-center text-sm font-medium text-neutral-700 dark:text-neutral-300 sm:text-sm">
                  {item.name}
                </h3>
              </a>
            ))}
          </div> */}
          {/* OR */}
          {/* <div className="relative text-center">
            <span className="relative z-10 inline-block px-4 font-medium text-sm bg-white dark:text-neutral-400 dark:bg-neutral-900">
              OR
            </span>
            <div className="absolute left-0 w-full top-1/2 transform -translate-y-1/2 border border-neutral-100 dark:border-neutral-800"></div>
          </div> */}
          {/* FORM */}
          <form className="grid grid-cols-1 gap-6" onSubmit={handleLogin}>
            <label className="block">
              <span className="text-neutral-800 dark:text-neutral-200">
                Email address
              </span>
              <Input
                type="email"
                value={username}
                onChange={handleEmail}
                placeholder="example@example.com"
                className="mt-1"
              />
            </label>
            <label className="block">
              <span className="flex justify-between items-center text-neutral-800 dark:text-neutral-200">
                Password
                {/* <Link to="/forgot-pass" className="text-sm text-green-600">
                  Forgot password?
                </Link> */}
              </span>
              <Input
                type="password"
                value={password}
                onChange={handlePassword}
                placeholder="password"
                className="mt-1"
              />
            </label>
            {error &&
              <div className="text-sm text-rose-500 flex justify-center items-center w-full mt-[-15px] mb-[-15px]">{error}</div>
            }
            <ButtonPrimary type="submit">Continue</ButtonPrimary>
          </form>

          {/* ==== */}
          <span className="block text-center text-neutral-700 dark:text-neutral-300">
            New user? {` `}
            <Link to="/signup" className="text-green-600">
              Create an account
            </Link>
          </span>
        </div>
      </div>
      {verificationPopup && <EmailVerificationModal login={true} />}
    </div>
  );
};

export default PageLogin;
