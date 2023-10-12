import React, { useContext } from "react";
import Select, { IOption } from "../../Select/Select";
import Area from "../../Area/Area";
import Input from "../../Input/Input";
import { IOrder, orderContext } from "../../../context/OrderContext";
import { TLangNames, TLangServices } from "../../../services/CalcTextService";

const serviceOpts: IOption<TLangServices>[] = [
  { title: "Редагування", value: "edit" },
];

const langOpts: IOption<TLangNames>[] = [
  { title: "Українська", value: "ua" },
  { title: "Російська", value: "ru" },
  { title: "Англійська", value: "eng" },
];

const Inputs = () => {
  const [order, updateOrder] = useContext(orderContext);

  const handleChange = <T extends keyof IOrder>(name: T, value: IOrder[T]) => {
    updateOrder({ [name]: value });
  };

  return (
    <>
      <Select<IOrder, TLangServices>
        options={serviceOpts}
        name='service'
        selected={order.service.title}
        onChange={handleChange}
        placeholder='Послуга'
      />
      <Area<IOrder> name='data' value={order.data} onChange={handleChange} />
      <Input<IOrder>
        name='email'
        value={order.email}
        onChange={handleChange}
        placeholder='Ваша електронна пошта'
      />
      <Input<IOrder>
        name='name'
        value={order.name}
        onChange={handleChange}
        placeholder="Ваше Ім'я"
      />
      <Input<IOrder>
        name='comment'
        value={order.comment}
        onChange={handleChange}
        placeholder='Комментар або покликання'
      />
      <Select<IOrder, TLangNames>
        options={langOpts}
        name='language'
        selected={order.language.title}
        onChange={handleChange}
        placeholder='Мова'
        disabled={!order.service.value}
      />
    </>
  );
};

export default Inputs;
