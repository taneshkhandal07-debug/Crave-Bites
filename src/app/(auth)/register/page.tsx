"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [defaultAddress, setDefaultAddress] = useState("");

  // Validation states
  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const validate = () => {
    let isValid = true;

    if (!name) {
      setNameError("Name is required");
      isValid = false;
    } else if (name.length < 2) {
      setNameError("Name must be at least 2 characters");
      isValid = false;
    } else {
      setNameError("");
    }

    if (!email) {
      setEmailError("Email is required");
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError("Please enter a valid email");
      isValid = false;
    } else {
      setEmailError("");
    }

    if (!password) {
      setPasswordError("Password is required");
      isValid = false;
    } else if (password.length < 6) {
      setPasswordError("Password must be at least 6 characters");
      isValid = false;
    } else {
      setPasswordError("");
    }

    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!validate()) return;

    setLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
          phone: phone || null,
          defaultAddress: defaultAddress || null,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Something went wrong during registration.");
        setLoading(false);
        return;
      }

      // Automatically sign user in
      const signRes = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      if (signRes?.error) {
        setError("Account created, but auto-login failed. Please log in manually.");
        setLoading(false);
      } else {
        router.push("/dashboard");
        router.refresh();
      }
    } catch (err) {
      console.error(err);
      setError("An unexpected error occurred. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="auth-card" style={{ maxWidth: "480px" }}>
      <div className="auth-header">
        <h2>Create Account</h2>
        <p>Register today to order delicious foods</p>
      </div>

      {error && <div className="form-error">{error}</div>}

      <form onSubmit={handleSubmit} noValidate>
        <div className="auth-input-group">
          <label htmlFor="name">
            Full Name
            {nameError && <span className="error-text">{nameError}</span>}
          </label>
          <input
            id="name"
            type="text"
            className={`auth-input ${nameError ? "error" : ""}`}
            placeholder="John Doe"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              if (nameError) setNameError("");
            }}
          />
        </div>

        <div className="auth-input-group">
          <label htmlFor="email">
            Email Address
            {emailError && <span className="error-text">{emailError}</span>}
          </label>
          <input
            id="email"
            type="email"
            className={`auth-input ${emailError ? "error" : ""}`}
            placeholder="name@example.com"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (emailError) setEmailError("");
            }}
          />
        </div>

        <div className="auth-input-group">
          <label htmlFor="password">
            Password
            {passwordError && <span className="error-text">{passwordError}</span>}
          </label>
          <input
            id="password"
            type="password"
            className={`auth-input ${passwordError ? "error" : ""}`}
            placeholder="•••••••• (Min 6 chars)"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              if (passwordError) setPasswordError("");
            }}
          />
        </div>

        <div className="auth-input-group">
          <label htmlFor="phone">Phone Number (Optional)</label>
          <input
            id="phone"
            type="tel"
            className="auth-input"
            placeholder="9876543210"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>

        <div className="auth-input-group">
          <label htmlFor="address">Delivery Address (Optional)</label>
          <input
            id="address"
            type="text"
            className="auth-input"
            placeholder="Flat 101, Food Street, City"
            value={defaultAddress}
            onChange={(e) => setDefaultAddress(e.target.value)}
          />
        </div>

        <button
          type="submit"
          className="btn btn-primary auth-submit-btn btn-lg"
          disabled={loading}
        >
          {loading ? "Registering..." : "Create Account"}
        </button>
      </form>

      <div className="auth-footer">
        Already have an account? <Link href="/login">Log In</Link>
      </div>
    </div>
  );
}
