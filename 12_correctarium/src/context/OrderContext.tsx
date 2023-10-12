import React, {
  FC,
  PropsWithChildren,
  createContext,
  useEffect,
  useState,
} from "react";
import {
  TLangNames,
  TLangServices,
  calcCost,
  calcDeadline,
} from "../services/CalcTextService";
import { IOption } from "../components/Select/Select";

export interface IOrderData {
  text: string;
  mimeType: string;
}

export interface IOrder {
  service: IOption<TLangServices | "">;
  data: IOrderData;
  email: string;
  name: string;
  comment: string;
  language: IOption<TLangNames | "">;
  price: number;
  deadline: string;
}

const initOpts: IOption<""> = {
  title: "",
  value: "",
};

export const initOrder: IOrder = {
  comment: "",
  email: "",
  name: "",
  data: {
    text: "",
    mimeType: "none",
  },
  service: initOpts,
  language: initOpts,
  price: 0,
  deadline: "",
};

type TOrderContext = [
  order: IOrder,
  setOrder: (newOrder: Partial<IOrder>) => void
];

const NOOP = () => {};

export const orderContext = createContext<TOrderContext>([initOrder, NOOP]);

export const OrderContextProvider: FC<PropsWithChildren> = ({ children }) => {
  const [order, setOrder] = useState<IOrder>(initOrder);

  useEffect(() => {
    if (order.service.value && order.data.text && order.language.value) {
      const deadline = calcDeadline(
        order.language.value,
        order.data.text.length,
        order.service.value
      ).deadline_date;

      const price = calcCost(
        order.language.value,
        order.data.text,
        order.data.mimeType
      );
      updateOrder({ price, deadline });
    } else {
      updateOrder({ price: 0, deadline: "" });
    }
  }, [
    order.service.value,
    order.data.text,
    order.data.mimeType,
    order.language.value,
  ]);

  const updateOrder = (newOrder: Partial<IOrder>) => {
    setOrder((oldOrder) => ({
      ...oldOrder,
      ...newOrder,
    }));
  };

  return (
    <orderContext.Provider value={[order, updateOrder]}>
      {children}
    </orderContext.Provider>
  );
};
