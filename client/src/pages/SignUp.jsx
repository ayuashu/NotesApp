import React, { useState } from "react";
import PasswordInput from "../components/PasswordInput";
import { Link, useNavigate } from "react-router-dom";
import Toast from "../components/Toast";

const SignUp = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [toast, setToast] = useState({ isShown: false, message: "", type: "" });

  const navigate = useNavigate();

  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    if (!name) {
      setError("Please enter your name.");
      return;
    }
    if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    if (!password) {
      setError("Please enter your password.");
      return;
    }
    setError("");

    try {
      const response = await fetch("http://localhost:8000/user/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: name,
          email: email,
          password: password,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Response Error:", errorData);
        throw new Error(
          errorData.message || "Sign up failed. Please try again."
        );
      }

      const data = await response.json();
      console.log("API Response:", data); // Log the full response from the server

      if (data.token) {
        localStorage.setItem("token", data.token);
        setToast({
          isShown: true,
          message: "SignUp Successful",
          type: "success",
        });
        setTimeout(() => {
          navigate("/dashboard");
        }, 200);
      } else {
        console.log("No token found in response", data);
        throw new Error("Sign up failed. Please try again.");
      }
    } catch (error) {
      console.error("Caught error:", error);
      setError(
        error.message || "An unexpected error occurred. Please try again."
      );
    }
  };

  return (
    <div className="flex items-center justify-center">
      <div className="mt-28">
        <div className="w-96 border rounded-2xl bg-[#17202a] dark:bg-[#ecf0f1] px-7 py-10 hover:shadow-xl hover:shadow-[#1b1b1c] dark:hover:shadow-[#dadade]">
          <form onSubmit={handleSignUp}>
            <h4 className="text-3xl text-center mb-7 font-bold text-[#ecf0f1] dark:text-[#17202a]">Lets Connect</h4>
            <input
              type="text"
              placeholder="name"
              className="input-box rounded-full bg-[#17202a] dark:bg-[#ecf0f1] text-[#ecf0f1] dark:text-[#17202a] border-2 dark:border-[#17202a] border-[#ecf0f1]"  
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

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
              SignUp
            </button>

            <p className="text-sm text-center mt-4 text-white dark:text-[#17202a]">
              Already connected?{" "}
              <Link to="/login" className="font-medium text-primary underline">
                Welcome Back
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

export default SignUp;
