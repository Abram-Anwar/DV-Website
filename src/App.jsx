import { BrowserRouter, Routes, Route } from "react-router-dom";

import Apply from "./pages/Apply";
import Home from "./pages/Home";
import Form from "./pages/Form";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/apply" element={<Apply />} />
        <Route path="/form" element={<Form />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
