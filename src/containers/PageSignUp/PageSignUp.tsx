import React, { FC, useState, ChangeEvent, FormEvent } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import facebookSvg from "images/Facebook.svg";
import twitterSvg from "images/Twitter.svg";
import googleSvg from "images/Google.svg";
import { Helmet } from "react-helmet";
import Input from "shared/Input/Input";
import ButtonPrimary from "shared/Button/ButtonPrimary";
import { Link } from "react-router-dom";
import EmailVerificationModal from "components/EmailVerificationModal";
import {
  registerUser,
  selectSignupState,
  setEmail,
  setSignupError,
  setFirstName,
  setLastName,
  setPassword,
  setConfirmPassword
} from "app/signupState/signupSlice";
import { useAppDispatch, useAppSelector } from "app/hooks";

export interface PageSignUpProps {
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

const PageSignUp: FC<PageSignUpProps> = ({ className = "" }) => {
  const dispatch = useAppDispatch()
  const {
    firstName,
    lastName,
    email,
    password,
    confirm_password,
    error,
    verificationPopup
  } = useAppSelector(selectSignupState)
  const [isCaptchaVerified, setIsCaptchaVerified] = useState(false);

  const handleFirstName = (event: ChangeEvent<HTMLInputElement>) => {
    dispatch(setFirstName(event.target.value))
  }

  const handleLastName = (event: ChangeEvent<HTMLInputElement>) => {
    dispatch(setLastName(event.target.value))
  }

  const handleEmail = (event: ChangeEvent<HTMLInputElement>) => {
    dispatch(setEmail(event.target.value))
  }

  const handlePassword = (event: ChangeEvent<HTMLInputElement>) => {
    dispatch(setPassword(event.target.value))
  }

  const handleConfirmPassword = (event: ChangeEvent<HTMLInputElement>) => {
    dispatch(setConfirmPassword(event.target.value))
  }

  const onSubmit = (event: FormEvent) => {
    event.preventDefault()
    if (!email || !password || !confirm_password) {
      dispatch(setSignupError(`Email and passwords are required`))
      return;
    }
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      dispatch(setSignupError(`Invalid email address`))
      return;
    }
    else if(password !== confirm_password){
      dispatch(setSignupError(`Passwords are not the same`))
      return;
    }
    else if (!isCaptchaVerified) {
      dispatch(setSignupError(`Select "I'm not a robot"`))
      return;
    }
    dispatch(setSignupError(''))
    const userCred = { 
      firstName, 
      lastName, 
      username: email, 
      password, 
      confirm_password
    }
    dispatch(registerUser(userCred))
  }

  return (
    <div className={`nc-PageSignUp  ${className}`} data-nc-id="PageSignUp">
      <Helmet>
        <title>Sign up || Exodus Metaverse React Template</title>
      </Helmet>
      <div className="container mb-24 lg:mb-32">
        <h2 className="mt-20 mb-10 flex items-center text-3xl leading-[115%] md:text-5xl md:leading-[115%] font-semibold text-neutral-900 dark:text-neutral-100 justify-center">
          Signup
        </h2>
        <div className="max-w-md mx-auto space-y-6 ">
          {/* <div className="grid gap-3">
            {loginSocials.map((item, index) => (
              <a
                key={index}
                href={item.href}
                className=" flex w-full rounded-lg bg-primary-50 dark:bg-neutral-800 px-4 py-3 transform transition-transform sm:px-6 hover:translate-y-[-2px]"
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
          <form className="grid grid-cols-1 gap-6" action="#" method="post" onSubmit={onSubmit}>
            <div className="-mx-2 flex items-end">
              <label className="block px-2 w-1/2">
                <span className="text-neutral-800 dark:text-neutral-200">
                  First Name
                </span>
                <Input
                  type="text"
                  placeholder="John"
                  className="mt-1"
                  onChange={handleFirstName}
                />
              </label>
              <label className="block px-2 w-1/2">
                <span className="text-neutral-800 dark:text-neutral-200">
                  Last Name
                </span>
                <Input
                  type="text"
                  placeholder="Smith"
                  className="mt-1"
                  onChange={handleLastName}
                />
              </label>
            </div>
            <label className="block">
              <span className="text-neutral-800 dark:text-neutral-200">
                Email address
              </span>
              <Input
                type="email"
                placeholder="example@example.com"
                className="mt-1"
                onChange={handleEmail}
              />
            </label>
            <label className="block">
              <span className="flex justify-between items-center text-neutral-800 dark:text-neutral-200">
                Password
              </span>
              <Input
                type="password"
                placeholder="password"
                className="mt-1"
                onChange={handlePassword}
              />
            </label>
            <label className="block">
              <span className="flex justify-between items-center text-neutral-800 dark:text-neutral-200">
                Confirm Password
              </span>
              <Input
                type="password"
                placeholder="confirm password"
                className="mt-1"
                onChange={handleConfirmPassword}
              />
            </label>
            <div className="flex justify-center">
              <ReCAPTCHA
                sitekey="6LeGu1wkAAAAABYXU66HZ9qJvKHaRTtHiMGv9NdR"
                onChange={(res) => setIsCaptchaVerified(!!res)}
              />
            </div>
            {error && <div className="text-sm text-rose-500 flex justify-center items-center w-full mt-[-15px] mb-[-15px]">{error}</div>}
            <ButtonPrimary type="submit">Continue</ButtonPrimary>
          </form>

          {/* ==== */}
          <span className="block text-center text-neutral-700 dark:text-neutral-300">
            Already have an account? {` `}
            <Link to="/login" className="text-green-600">
              Sign in
            </Link>
          </span>
        </div>
      </div>

      {verificationPopup && <EmailVerificationModal />}
    </div>
  );
};

export default PageSignUp;
