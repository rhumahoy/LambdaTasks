import { FC, AllHTMLAttributes } from "react";

export const Input: FC<AllHTMLAttributes<HTMLInputElement>> = ({
  placeholder = "",
  ...attr
}) => {
  const label = placeholder.split("").map((letter, i) => (
    <span
      key={`${attr.name}-${placeholder}-${i}`}
      style={{ transitionDelay: `${i * 50}ms` }}
    >
      {letter}
    </span>
  ));

  return (
    <div className='input'>
      <input {...attr} />
      <label>{label}</label>
    </div>
  );
};
