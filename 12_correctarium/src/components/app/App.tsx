import React from "react";
import MakeOrder from "../MakeOrder/MakeOrder";

function App() {
  const handleSubmit = () => {};
  return (
    <main className='main'>
      <MakeOrder onSubmit={handleSubmit} />
    </main>
  );
}

export default App;
