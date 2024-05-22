import React, { useEffect } from "react";
import MyRouter from "routers/index";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getAuthorizedUser } from 'app/loginState/loginSlice';
import { useAppDispatch, useAppSelector } from "app/hooks";
import { selectLogState } from "app/LoginStateReducer";
import { useWallet } from "@terra-money/use-wallet";

function App() {
  const dispatch = useAppDispatch()
  const { disconnect } = useWallet();
  const { token } = useAppSelector(selectLogState)

  useEffect(() => {
    dispatch(getAuthorizedUser({token, disconnect}))
  }, [])

  return (
    <div className="bg-white text-base dark:bg-neutral-900 text-neutral-900 dark:text-neutral-200">
      <ToastContainer />
      <MyRouter />
    </div>
  );
}

export default App;
