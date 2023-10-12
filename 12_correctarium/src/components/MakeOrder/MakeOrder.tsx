import { FC, FormEvent, useContext, useEffect, useState } from "react";
import Inputs from "./Inputs/Inputs";
import Submit from "./Submit/Submit";
import { orderContext } from "../../context/OrderContext";

interface IMakeOrder {
  onSubmit: () => void;
}

const MakeOrder: FC<IMakeOrder> = ({ onSubmit }) => {
  const [isFilled, setIsFilled] = useState(false);
  const [{ service, data, language }] = useContext(orderContext);

  useEffect(() => {
    if (service.value && data.text && language.value) {
      setIsFilled(true);
    } else {
      setIsFilled(false);
    }
  }, [service.value, data.text, language.value]);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (service.value && data.text && language.value) {
      onSubmit();
    }
  };

  return (
    <form className='makeOrder' onSubmit={handleSubmit}>
      <div className='makeOrder__item inputs'>
        <h3 className='title'>Замовити переклад або редагування</h3>
        <Inputs />
      </div>
      <div className='makeOrder__item'>
        <Submit disabled={!isFilled} />
      </div>
    </form>
  );
};

export default MakeOrder;
