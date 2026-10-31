import { BrowserRouter, Routes, Route } from "react-router-dom";

import Apply from "./pages/Apply";
import Home from "./pages/Home";
import Form from "./pages/Form";
import Payment from "./pages/Payment";

//? Define the application's routes and map each URL to its component.
function App() {
  return (
    <BrowserRouter>
      {/* Enable client-side routing throughout the application. */}

      {/* Register all available application routes. */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/apply" element={<Apply />} />
        <Route path="/form" element={<Form />} />
        <Route path="/payment" element={<Payment />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
