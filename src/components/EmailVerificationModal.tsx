import { FC } from "react";
import { useAppDispatch, useAppSelector } from "app/hooks";
import { setLoginError } from "app/loginState/loginSlice";
import { resendVerifyToken, selectSignupState } from "app/signupState/signupSlice";
import ButtonPrimary from "shared/Button/ButtonPrimary";
import ButtonClose from "shared/ButtonClose/ButtonClose";
import { setVerificationPopup } from "app/signupState/signupSlice";
import { selectLogState } from "app/LoginStateReducer";

interface Props {
  login?: boolean
}

const EmailVerificationModal: FC<Props> = ({ login }) => {
  const dispatch = useAppDispatch()
  const { token } = useAppSelector(selectLogState)
  const { resendEmailLoading } = useAppSelector(selectSignupState)

  const handleClick = () => {
    if (!resendEmailLoading) {
      dispatch(resendVerifyToken(token))
    }
  }

  function onClose() {
    if (login) dispatch(setLoginError(''))
    dispatch(setVerificationPopup());
  }

  return (
    <div className="flex items-center justify-center min-h-screen p-5 bg-black bg-opacity-80 min-w-screen fixed top-0 w-full z-50">
      <div className="relative max-w-xl p-8 text-center text-gray-800 bg-white shadow-xl lg:max-w-3xl rounded-3xl lg:p-12 dark:bg-neutral-900 dark:text-neutral-200">
        <ButtonClose onClick={onClose} className="absolute top-3 right-3" />
        <h3 className="text-2xl">{login ? "Email is not verified" : "Thanks for signing up for Exodus Metaverse!"}</h3>
        <div className="flex justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-24 h-24 text-green-400" fill="none"
            viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1"
              d="M3 19v-8.93a2 2 0 01.89-1.664l7-4.666a2 2 0 012.22 0l7 4.666A2 2 0 0121 10.07V19M3 19a2 2 0 002 2h14a2 2 0 002-2M3 19l6.75-4.5M21 19l-6.75-4.5M3 10l6.75 4.5M21 10l-6.75 4.5m0 0l-1.14.76a2 2 0 01-2.22 0l-1.14-.76" />
          </svg>
        </div>
        {login ?
          <p>Please resend the activation link and check your email to verify it.</p> :
          <p>We're happy you're here. <br /> An email has been sent to you. Please check your inbox.</p>
        }
        <div className="mt-4">
          <ButtonPrimary
            type="submit"
            className={`mt-3 ${resendEmailLoading && 'cursor-no-drop'}`}
            onClick={handleClick}
          >
            Resend Email
          </ButtonPrimary>
        </div>
      </div>
    </div>
  );
};

export default EmailVerificationModal;
