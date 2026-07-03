"use client";

import { useState, Suspense } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  // Validation states
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const validate = () => {
    let isValid = true;
    
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
      const res = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      if (res?.error) {
        setError(res.error);
        setLoading(false);
      } else {
        router.push(callbackUrl);
        router.refresh();
      }
    } catch (err) {
      console.error(err);
      setError("An unexpected error occurred. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="auth-card">
      <div className="auth-header">
        <h2>Welcome Back</h2>
        <p>Login to place your order and track it live</p>
      </div>

      {error && <div className="form-error">{error}</div>}

      <form onSubmit={handleSubmit} noValidate>
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
            placeholder="••••••••"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              if (passwordError) setPasswordError("");
            }}
          />
        </div>

        <button
          type="submit"
          className="btn btn-primary auth-submit-btn btn-lg"
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login to CraveBite"}
        </button>
      </form>

      <div className="auth-footer">
        Don't have an account? <Link href="/register">Sign Up</Link>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="auth-card">
        <div className="auth-header">
          <h2>Loading...</h2>
          <p>Preparing login form</p>
        </div>
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}
