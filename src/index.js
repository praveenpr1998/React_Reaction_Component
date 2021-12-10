import React from "react";
import ReactDOM from "react-dom";
import "./resources/scss/index.scss";
import Home from "./components/Home/Home";
import { Provider } from "react-redux";
import { store } from "./Store/store";
import "antd/dist/antd.css";

// function App() {
//   return <Home />;
// }

ReactDOM.render(
  <Provider store={store}>
    <React.StrictMode>
      <Home />
    </React.StrictMode>
  </Provider>,
  document.getElementById("root")
);
