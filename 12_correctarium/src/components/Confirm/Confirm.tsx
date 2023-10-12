import React, { FC } from "react";

interface IConfirm {
  service: string;
  language: string;
  price: number;
  deadline: string;
  onConfirm: (confirm: boolean) => void;
}

const Confirm: FC<IConfirm> = ({
  service,
  language,
  price,
  deadline,
  onConfirm,
}) => {
  const [date, time] = deadline.split(", ");

  return (
    <section className='confirm'>
      <h3 className='title'>Ваше замовлення</h3>
      <div className='confirm__text'>
        Завдання: {service} {language}
      </div>
      <div className='confirm__text'>
        Вартість: <b>{price} грн</b>
      </div>
      <div className='confirm__text'>
        Термін здавання: <b>{date}</b> о <b>{time}</b>
      </div>
      <div className='confirm__controls'>
        <button className='btn' onClick={() => onConfirm(true)}>
          Замовити
        </button>
        <button className='btn btn--cancel' onClick={() => onConfirm(false)}>
          Скасувати
        </button>
      </div>
    </section>
  );
};

export default Confirm;
