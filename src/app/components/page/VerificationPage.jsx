import React, { useEffect, useState, useRef } from "react";
import "../../assets/styles/_verification.scss";
import logo from "../../assets/img/logo-large.svg";
import authService from "app/services/auth.service.js";
import { useNavigate, useLocation } from "react-router-dom";

function VerificationPage() {
  const [code, setCode] = useState(["", "", "", "", "", ""]);

  const [timeLeft, setTimeLeft] = useState(15);
  const [canResend, setCanResend] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [error, setError] = useState("");
  
  const inputRefs = useRef([]);
  const navigate = useNavigate();
  const location = useLocation();

  // ==========pobieranie email z location state=============
  const email = location.state?.email;

  useEffect(() => {
    if (!email) navigate("/auth/register");
  }, [email, navigate]);

  useEffect(() => {
    if (timeLeft <= 0) {
      setCanResend(true);
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleCodeChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);
    setError(""); // Wyczyść błędy przy zmianie

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }

    if (e.key === "ArrowRight" && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
    if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").replace(/\D/g, "");
    const newCode = [...code];

    for (let i = 0; i < Math.min(pastedData.length, 6); i++) {
      newCode[i] = pastedData[i];
    }

    setCode(newCode);
    setError("");
    
    if (pastedData.length === 6) {
      inputRefs.current[5]?.focus();
    }
  };

  function sendVerifyRequest(code) {
    setIsVerifying(true);
    authService
      .verify({
        token: code,
        email: email,
      })
      .then(() => {
        setIsVerified(true);

        const timer = setTimeout(() => {
          navigate("/auth/login", { replace: true });
        }, 2000);

        return () => clearTimeout(timer);
      })
      .catch((err) => {
        console.error("Fetch error:", err);
        setError("Podany kod jest nie prawidłowy!");
      });
    setIsVerifying(false);
  }

  function sendResetVerifyRequest() {
    authService
      .resetVerify({
        email: email,
      })
      .then(() => {
        setTimeLeft(15);
      })
      .catch((err) => {
        console.error("Fetch error:", err);
        setError(err.response.data.message);
      });
  }

  const handleVerify = (e) => {
    e.preventDefault();
    const fullCode = code.join("");

    if (fullCode.length !== 6) {
      setError("Kod musi mieć 6 cyfr");
      return;
    }

    sendVerifyRequest(fullCode);
  };

  // Ponowne wysłanie kodu
  const handleResend = () => {
    // Sprawdź czy można wysłać ponownie
    if (!canResend || timeLeft > 0) return;

    // Resetuj stan
    setTimeLeft(63);
    setCanResend(false);
    setCode(["", "", "", "", "", ""]);
    setError("");
    inputRefs.current[0]?.focus(); // Focus na pierwsze pole

    sendResetVerifyRequest();
    console.log("Resending code to:", email);
  };

  return (
    <div className="verification-page">
      <div className="verification-card">
        {/* Sekcja logo */}
        <div className="verification-logo">
          <img src={logo} alt="Logo" />
        </div>

        {/* Nagłówek z informacjami */}
        <div className="verification-header">
          <h1 className="verification-title">Weryfikacja e-maila</h1>
          <p className="verification-subtitle">
            Wysłaliśmy kod weryfikacyjny na adres <br />
            <span className="email-highlight">{email}</span>
          </p>
        </div>

        {/* Formularz weryfikacji */}
        <form className="verification-form" onSubmit={handleVerify}>
          {/* Pola wprowadzania kodu */}
          <div className="code-input-group">
            <label className="code-label">Wprowadź 6-znakowy kod</label>
            <div className="code-inputs" onPaste={handlePaste}>
              {code.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => (inputRefs.current[index] = el)}
                  type="text"
                  inputMode="numeric"
                  maxLength="1"
                  value={digit}
                  onChange={(e) => handleCodeChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className={`code-input ${digit ? "filled" : ""} ${
                    error ? "error" : ""
                  }`}
                  aria-label={`Cyfrę ${index + 1}`}
                />
              ))}
            </div>
            {/* Wyświetlanie błędów */}
            {error && <div className="error-message">{error}</div>}
          </div>

          {/* Sekcja timera i ponownego wysłania */}
          {!isVerified && (
            <div className="timer-section">
              {timeLeft > 0 && (
                <div className="timer-info">
                  <div className="timer-display">
                    <span className="timer-icon">⏱️</span>
                    <span className="timer-text">
                      Możesz wysłać nowy kod za:{" "}
                      <strong>{formatTime(timeLeft)}</strong>
                    </span>
                  </div>
                </div>
              )}
              {/* Przycisk ponownego wysłania */}
              <button
                type="button"
                className={`resend-btn ${canResend ? "active" : "disabled"}`}
                onClick={handleResend}
                disabled={!canResend}
              >
                {timeLeft > 0 ? "Wyślij kod ponownie" : "Wyślij kod ponownie"}
              </button>
            </div>
          )}

          {/* Przycisk weryfikacji */}
          {!isVerified && (
            <button
              className="verify-btn"
              type="submit"
              disabled={isVerifying || code.join("").length !== 6}
            >
              {isVerifying ? (
                <>
                  <span className="spinner"></span>
                  Weryfikowanie...
                </>
              ) : (
                "Zweryfikuj"
              )}
            </button>
          )}
        </form>

        {isVerified && (
          <div className="alert alert-success text-center" role="alert">
            Adres e-mail został aktywowany!
          </div>
        )}
      </div>
    </div>
  );
}

export default VerificationPage;
