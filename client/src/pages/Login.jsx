import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import PasswordInput from "../components/PasswordInput";
import Toast from "../components/Toast";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [toast, setToast] = useState({ isShown: false, message: "", type: "" });

  const navigate = useNavigate();

  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    if (!password) {
      setError("Please enter the password");
      return;
    }
    setError("");

    try {
      const response = await fetch("http://localhost:8000/user/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error("Invalid Credentials. Please try again.");
      }

      const data = await response.json();
      if (data?.token) {
        localStorage.setItem("token", data.token);
        setToast({
          isShown: true,
          message: "Login Successful",
          type: "success",
        });
        setTimeout(() => {
          navigate("/dashboard");
        }, 200);
      } else {
        throw new Error(data?.message || "Login failed. Please try again.");
      }
    } catch (error) {
      setError(
        error.message || "An unexpected error occurred. Please try again."
      );
    }
  };

  return (
    <div className="flex items-center justify-center">
      <div className="mt-28">
        <div className="w-96 border rounded-2xl bg-[#17202a] dark:bg-[#ecf0f1] px-7 py-10 hover:shadow-xl hover:shadow-[#1b1b1c] dark:hover:shadow-[#dadade]">
          <form onSubmit={handleLogin}>
            <h4 className="text-3xl text-center mb-7 font-bold text-[#ecf0f1] dark:text-[#17202a]">Welcome Back</h4>
            <input
              type="text"
              placeholder="email"
              className="input-box rounded-full bg-[#17202a] dark:bg-[#ecf0f1] text-[#ecf0f1] dark:text-[#17202a] border-2 dark:border-[#17202a] border-[#ecf0f1]"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <PasswordInput
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            {error && <p className="text-red-500 text-xs pb-1">{error}</p>}

            <button type="submit" className="btn-primary">
              Login
            </button>

            <p className="text-sm text-center mt-4 text-[#ecf0f1] dark:text-[#17202a]">
              Not registered yet?{" "}
              <Link to="/signup" className="font-medium text-primary underline">
                Create an Account
              </Link>
            </p>
          </form>
        </div>
        {toast.isShown && (
          <Toast
            isShown={toast.isShown}
            message={toast.message}
            type={toast.type}
            onClose={() => setToast({ ...toast, isShown: false })}
          />
        )}
      </div>
    </div>
  );
};

export default Login;
