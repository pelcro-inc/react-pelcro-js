import React from "react";
import { Login, Register } from "./components";

function App() {
  return (
    <div className="App">
      <h2>Pelcro Elements Demo</h2>
      <div style={{ border: "1px solid black" }}>
        <h3>Login Component</h3>
        <Login />
      </div>
      <div style={{ border: "1px solid black" }}>
        <h3>Registeration Component</h3>
        <Register />
      </div>
    </div>
  );
}

export default App;
