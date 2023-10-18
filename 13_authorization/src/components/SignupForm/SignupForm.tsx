import { useState } from "react";
import { Form } from "../Form";
import AuthService from "../../services/AuthService";

export const SignupForm = () => {
  const [error, setError] = useState("");

  const handleSubmit = (email: string, password: string) => {
    AuthService.registration(email, password)
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
      <h1>Please Sign up</h1>
      <Form submitText='Login' onSubmit={handleSubmit} error={error} />
      <p>
        Already have an account ? <a href='#'>Login</a>
      </p>
    </div>
  );
};
