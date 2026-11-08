import { useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/auth-context";
import "./login.css";

const APP_URL = import.meta.env.APP_URL || "http://localhost:5000";

const Login = () => {
  const { admin, loading: authLoading, login } = useAuth();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    // Stop the browser from reloading page
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response = await fetch(`${APP_URL}/api/admin/login`, {
        method: "POST",
        credentials: "include", // lets the browser save the cookie
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        login(await response.json()); // saves the admin in the Context
        return;
      }

      // The server answered with an error
      if (response.status === 401) {
        setError("اسم المستخدم أو كلمة المرور غير صحيحة");
      } else if (response.status === 429) {
        setError("محاولات كثيرة، حاول مرة أخرى بعد قليل");
      } else {
        setError("حدث خطأ، حاول مرة أخرى");
      }

      setPassword("");
    } catch (err) {
      // The server could not be reached at all
      console.error(err);
      setError("تعذر الاتصال بالسيرفر");
    } finally {
      setLoading(false);
    }
  };

  // Wait for the session check, and skip this page if already logged in
  if (authLoading) return null;
  if (admin) return <Navigate to="/" replace />;

  return (
    <main className="login-page">
      <div className="login-container">
        <div className="login-brand">
          <img src="/logo.png" alt="ELMNAHRY" />
          <h1>ELMNAHRY</h1>
          <p>تسجيل دخول المسؤول</p>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          {error && <p className="login-error">{error}</p>}
          {/* Username */}
          <div className="form-field">
            <label htmlFor="username">اسم المستخدم</label>
            <input
              id="username"
              type="text"
              autoComplete="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          {/* Password */}
          <div className="form-field">
            <label htmlFor="password">كلمة المرور</label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button type="submit" className="login-button" disabled={loading}>
            {loading ? "جاري الدخول..." : "دخول"}
          </button>
        </form>
      </div>
    </main>
  );
};

export default Login;
