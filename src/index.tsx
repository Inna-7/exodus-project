import React from "react";
import ReactDOM from "react-dom/client";
//
import "./styles/index.scss";
import "./index.css";
import "./fonts/line-awesome-1.3.0/css/line-awesome.css";
import "rc-slider/assets/index.css";

//
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { getChainOptions, WalletProvider } from "@terra-money/wallet-provider";
import { Provider } from "react-redux";
import { persistor, store } from "app/store";

import { PersistGate } from "redux-persist/integration/react";
import { User } from "UserService";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
getChainOptions().then((chainOptions) => {
  root.render(
    // <React.StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <WalletProvider {...chainOptions}>
          <App />
        </WalletProvider>
      </PersistGate>
    </Provider>
    // </React.StrictMode>
  );
  User.init()
})

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
