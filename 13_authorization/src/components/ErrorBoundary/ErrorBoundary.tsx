import { Navigate, } from "react-router-dom";

export const ErrorBoundary = () => {
  return <Navigate to='/login' replace={true} />;
};
