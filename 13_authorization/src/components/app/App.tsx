import React from "react";
import {
  RouterProvider,
  createBrowserRouter,
  redirect,
} from "react-router-dom";
import AuthService from "../../services/AuthService";
import { ErrorBoundary } from "../ErrorBoundary/ErrorBoundary";
import { meLoader } from "../Me/Me";
import { Loading } from "../Loading";

const SignupForm = React.lazy(() => import("../SignupForm"));
const LoginForm = React.lazy(() => import("../LoginForm"));
const Me = React.lazy(() => import("../Me"));

const appLoader = async () => {
  try {
    await AuthService.getUser();
    return redirect("/me");
  } catch (e) {
    return redirect("login");
  }
};

const router = createBrowserRouter([
  {
    path: "/",
    loader: appLoader,
  },
  {
    path: "signup",
    element: <SignupForm />,
  },
  {
    path: "login",
    element: <LoginForm />,
  },
  {
    path: "me",
    loader: meLoader,
    element: <Me />,
    errorElement: <ErrorBoundary />,
  },
]);

function App() {
  return (
    <main className='main'>
      <div className='container'>
        <React.Suspense fallback={<Loading />}>
          <RouterProvider router={router} fallbackElement={<Loading />} />
        </React.Suspense>
      </div>
    </main>
  );
}

export default App;
