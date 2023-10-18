import { ChangeEvent, FC, FormEvent, useState } from "react";
import { Input } from "../Input";

interface IForm {
  submitText: string;
  onSubmit: (email: string, password: string) => void;
  error?: string;
}

export const Form: FC<IForm> = ({ onSubmit, submitText, error }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSubmit(email, password);
  };

  return (
    <form onSubmit={handleSubmit} className={error ? "invalid" : ""}>
      <Input
        type='text'
        value={email}
        placeholder='Email'
        onChange={(e: ChangeEvent<HTMLInputElement>) =>
          setEmail(e.target.value)
        }
        required
      />
      <Input
        type='password'
        value={password}
        onChange={(e: ChangeEvent<HTMLInputElement>) =>
          setPassword(e.target.value)
        }
        placeholder='Password'
        autoComplete='on'
        required
      />
      {error && <p className='error'>{error}</p>}
      <button className='btn'>{submitText}</button>
    </form>
  );
};
