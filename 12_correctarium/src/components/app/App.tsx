import React, { useContext, useState } from "react";
import MakeOrder from "../MakeOrder/MakeOrder";
import { initOrder, orderContext } from "../../context/OrderContext";
import Confirm from "../Confirm/Confirm";

function App() {
  const [showConfirm, setShowConfirm] = useState(false);
  const [{ service, language, price, deadline }, updateOrder] =
    useContext(orderContext);

  const handleSubmit = () => {
    setShowConfirm(true);
  };

  const handleConfirm = (confirm: boolean) => {
    if (confirm) {
      updateOrder(initOrder);
    }
    setShowConfirm(false);
  };

  return (
    <main className='main'>
      {showConfirm ? (
        <Confirm
          price={price}
          service={service.title}
          language={language.title}
          deadline={deadline}
          onConfirm={handleConfirm}
        />
      ) : (
        <MakeOrder onSubmit={handleSubmit} />
      )}
    </main>
  );
}

export default App;
