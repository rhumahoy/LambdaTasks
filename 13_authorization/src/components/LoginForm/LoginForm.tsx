import { useState } from "react";
import { Form } from "../Form";
import AuthService from "../../services/AuthService";

export const LoginForm = () => {
  const [error, setError] = useState("");

  const handleSubmit = (email: string, password: string) => {
    AuthService.login(email, password)
      .then(() => {
        setError("");
        console.log("Login");
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
        Don't have an account ? <a href='#'>Sign up</a>
      </p>
    </div>
  );
};
