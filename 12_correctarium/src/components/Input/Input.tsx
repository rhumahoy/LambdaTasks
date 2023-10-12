import React, { ChangeEvent } from "react";

interface IInputProps<T> {
  type?: "text" | "email";
  name: keyof T;
  placeholder: string;
  value: string;
  onChange: (
    name: IInputProps<T>["name"],
    value: IInputProps<T>["value"]
  ) => void;
}

const Input = <T extends object>({
  type = "text",
  name,
  placeholder = "",
  value,
  onChange,
}: IInputProps<T>) => {
  const handleOnChange = (e: ChangeEvent<HTMLInputElement>) => {
    onChange(name, e.target.value);
  };

  return (
    <fieldset className='field'>
      <legend className={value ? "placeholder" : ""}>
        {value ? placeholder : ""}
      </legend>
      <input
        type={type}
        name={name as string}
        placeholder={placeholder}
        onChange={handleOnChange}
        value={value}
      />
    </fieldset>
  );
};

export default Input;
