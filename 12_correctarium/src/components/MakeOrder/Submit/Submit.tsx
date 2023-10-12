import React, { useContext } from "react";
import { orderContext } from "../../../context/OrderContext";

const Submit = ({ disabled }: { disabled: boolean }) => {
  const [{ price, deadline }] = useContext(orderContext);
  const [date, time] = deadline.split(", ");
  const isDeadline = date && time;

  return (
    <div className='submit'>
      <div className='submit__content'>
        <span className='price'>{price}</span>
        <sub className='currency'>грн</sub>
        {isDeadline ? (
          <div className='deadline'>
            Термін здавання: <b>{date}</b> о <b>{time}</b>
          </div>
        ) : (
          <div className='deadline'></div>
        )}
        <div>
          <button className='btn' type='submit' disabled={disabled}>
            Замовити
          </button>
        </div>
      </div>
    </div>
  );
};

export default Submit;
