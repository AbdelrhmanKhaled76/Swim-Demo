// import { StrictMode } from 'react'
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";
import Home from "./pages/home/home";
import History from "./pages/history/history";
import Inventory from "./pages/inventory/inventory";
import Order from "./pages/order/order";
import Profile from "./pages/profile/profile";
import Reciept from "./pages/reciept/reciept";
import SignIn from "./pages/signin/signin";
import SignUp from "./pages/signup/signup";
import Statistics from "./pages/statistics/statistics";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./store";
import { Toaster } from "react-hot-toast";
import ForgotPassword from "./pages/Auth/ForgotPassword";
import ResetPassword from "./pages/Auth/ResetPassword";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "home",
        element: <Home />,
      },
      {
        path: "history",
        element: <History />,
      },
      {
        path: "inventory",
        element: <Inventory />,
      },
      {
        path: "order",
        element: <Order />,
      },
      {
        path: "profile",
        element: <Profile />,
      },
      {
        path: "reciept",
        element: <Reciept />,
      },
      {
        path: "signin",
        element: <SignIn />,
      },
      {
        path: "signup",
        element: <SignUp />,
      },
      {
        path: "statistics",
        element: <Statistics />,
      },
      {
  path: "forgot-password",
  element: <ForgotPassword />, 
},
{
  path: "reset-password/:resettoken", 
  element: <ResetPassword />, 
},
      // {
      //   path: "popups",
      //   element: <Popups/>
      // },
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  // <StrictMode>
  <Provider store={store}>
    <RouterProvider router={router} />
    <Toaster
      position="top-center"
      containerStyle={{
        top: 80,
      }}
      toastOptions={{
        success: {
          duration: 4000,
          style: {
            background: "#04162A",
            color: "#fff",
            fontFamily: '"Inter", sans-serif',
            letterSpacing: "0.5px",
            padding: "20px 40px",
            fontSize: "18px",
            fontWeight: "bold",
            borderRadius: "10px",
          },
          iconTheme: {
            primary: "#22c55e",
            secondary: "#04162A",
          },
        },
        error: {
          duration: 4000,
          style: {
            background: "#fff",
            color: "#FF383C",
            border: "2px solid #FF383C",
            fontFamily: '"Inter", sans-serif',
            letterSpacing: "0.5px",
            padding: "20px 40px",
            fontSize: "18px",
            fontWeight: "bold",
            borderRadius: "10px",
            boxShadow: "0 10px 25px -5px rgba(255, 56, 60, 0.2)",
          },
        },
      }}
    />
  </Provider>,
  // </StrictMode>,
);
