import { useState } from "react";
import { Form } from "../Form";
import AuthService from "../../services/AuthService";
import { Link, useNavigate } from "react-router-dom";

export const SignupForm = () => {
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (email: string, password: string) => {
    AuthService.registration(email, password)
      .then(() => {
        setError("");
        navigate('/login');
      })
      .catch((msg) => {
        console.log(msg);
        setError(msg);
      });
  };

  return (
    <div>
      <h1>Please Sign up</h1>
      <Form submitText='Sign up' onSubmit={handleSubmit} error={error} />
      <p>
        Already have an account ? <Link to={"/login"}>Login</Link>
      </p>
    </div>
  );
};
