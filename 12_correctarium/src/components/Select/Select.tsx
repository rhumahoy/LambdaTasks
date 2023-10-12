import { useEffect, useRef, useState } from "react";
import ArrowIcon from "../icons/ArrowIcon";

export interface IOption<T = string> {
  title: string;
  value: T;
}

interface IOptionProps<T> extends IOption<T> {
  onClick: (title: IOption<T>["title"], value: IOption<T>["value"]) => void;
}

export interface ISelectProps<T, U> {
  options: IOption<U>[];
  placeholder: string;
  selected: string;
  name: keyof T;
  onChange: (name: ISelectProps<T, U>["name"], selected: IOption<U>) => void;
  disabled?: boolean;
}

const Select = <T extends object, U>({
  options,
  selected = "",
  name,
  onChange,
  placeholder,
  disabled,
}: ISelectProps<T, U>) => {
  const [isOpen, setIsOpen] = useState(false);
  const rootRef = useRef<HTMLFieldSetElement>(null);

  useEffect(() => {
    const handleClick = ({ target }: MouseEvent) => {
      if (target instanceof Node && !rootRef.current?.contains(target)) {
        setIsOpen(false);
      }
    };

    window.addEventListener("click", handleClick);

    return () => {
      window.removeEventListener("click", handleClick);
    };
  }, []);

  const handleOpen = () => {
    setIsOpen(!isOpen);
  };

  const handleSelect: IOptionProps<U>["onClick"] = (title, value) => {
    onChange(name, { title, value });
    setIsOpen(false);
  };

  const optionsList = (
    <ul className='field__select_options'>
      {options.map(({ title, value }) => (
        // <Option key={opt.title} onClick={handleSelect} {...opt} />
        <li key={title}>
          <button type='button' onClick={() => handleSelect(title, value)}>
            {title}
          </button>
        </li>
      ))}
    </ul>
  );

  return (
    <fieldset className='field field__select' ref={rootRef} disabled={disabled}>
      <legend className={selected ? "placeholder" : ""}>
        {selected && placeholder}
      </legend>
      <button
        className={selected ? "" : "placeholder"}
        data-open={isOpen}
        onClick={handleOpen}
        type='button'
      >
        {selected || placeholder}
        <ArrowIcon />
      </button>
      {isOpen && optionsList}
    </fieldset>
  );
};

export default Select;
