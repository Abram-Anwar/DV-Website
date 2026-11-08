import { BrowserRouter, Routes, Route } from "react-router-dom";
import AuthProvider from "./context/AuthProvider";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";

import Overview from "./pages/Overview/Overview";
import Applications from "./pages/Applications/Applications";
import Payments from "./pages/Payments/Payments";
import ApplicationsDetails from "./pages/ApplicationDetails/ApplicationDetails";
import Layout from "./components/Layout/Layout";
import Login from "./pages/Login/Login";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />

          <Route element={<ProtectedRoute />}>
            <Route element={<Layout />}>
              <Route path="/" element={<Overview />} />
              <Route path="/applications" element={<Applications />} />
              <Route path="/payments" element={<Payments />} />
              <Route
                path="/applications/:id"
                element={<ApplicationsDetails />}
              />
            </Route>
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
