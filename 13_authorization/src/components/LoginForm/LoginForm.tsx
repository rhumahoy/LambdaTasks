import { useState } from "react";
import { Form } from "../Form";
import AuthService from "../../services/AuthService";
import { Link, useNavigate } from "react-router-dom";

export const LoginForm = () => {
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (email: string, password: string) => {
    AuthService.login(email, password)
      .then(() => {
        setError("");
        navigate('/me');
      })
      .catch((msg) => {
        console.log(msg);
        setError(msg);
      });
  };

  return (
    <div>
      <h1>Please Login</h1>
      <Form submitText='Login' onSubmit={handleSubmit} error={error} />
      <p>
        Don't have an account ? <Link to={'/signup'}>Sign up</Link>
      </p>
    </div>
  );
};
