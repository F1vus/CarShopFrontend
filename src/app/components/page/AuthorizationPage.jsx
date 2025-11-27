import React, { useMemo, useState } from "react";
import "styles/_authorization.scss";
import authService from "services/auth.service.js";
import VerificationPage from "./VerificationPage";
import { useNavigate } from "react-router-dom";

function AuthorizationPage() {
  const navigate = useNavigate();
  const [tab, setTab] = useState("register");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [showVerification, setShowVerification] = useState(false);
  const [isCreated, setIsCreated] = useState(false);
  const [isLogged, setIsLogged] = useState(true);

  const pwdChecks = useMemo(
    () => [
      { key: "length", label: "9 lub więcej znaków", ok: password.length >= 9 },
      { key: "upper", label: "Wielka litera", ok: /[A-ZĄĆĘŁŃÓŚŻŹ]/.test(password) },
      { key: "lower", label: "Mała litera", ok: /[a-ząćęłńóśżź]/.test(password) },
      { key: "digit", label: "Co najmniej jedna cyfra", ok: /\d/.test(password) },
    ],
    [password]
  );

  const allOk = pwdChecks.every((c) => c.ok);

  function sendSignUpRequest(event){
    event.preventDefault();

    authService
        .register(
            {
              "username": username,
              "email": email,
              "password": password
            }
        )
        .then(() => {
            setShowVerification(true);
        })
        .catch((err) => {
          console.error("Fetch error:", err);
          setIsCreated(false);
        })
  }

  function sendLoginRequest(event){
    event.preventDefault();
    authService
        .login(
            {
              "email": email,
              "password": password
            }
        )
        .then((data) => {
          localStorage.setItem("token", data)
          navigate("/profile");
        })
        .catch((err) => {
          console.error("Fetch error:", err);
          setIsLogged(false);
        })
  }

  function handleSubmit(e) {
    e.preventDefault();
      if(tab === "register" && !allOk){
        return
      }
      if(tab === "register" && allOk){
          sendSignUpRequest(e)
      }
      if(tab === "login"){
          sendLoginRequest(e)
      }
      console.log("submit", { tab, email, username: tab === "register" ? username : undefined, });
  }

  if (showVerification) {
    return (
      <VerificationPage 
        email={email}
      />
    );
  }

  return (
    <div className="authorization-page">
      <div className="auth-card">
        <div className="auth-tabs">
          <button
            type="button"
            className={`tab ${tab === "login" ? "active" : ""}`}
            onClick={() => setTab("login")}
          >
            Zaloguj się
          </button>
          <button
            type="button"
            className={`tab ${tab === "register" ? "active" : ""}`}
            onClick={() => setTab("register")}
          >
            Załóż konto
          </button>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <label className="field-label">
            E-mail
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>

          {tab === "register" && (
            <label className="field-label">
              Nazwa użytkownika
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </label>
          )}

          <label className="field-label">
            Hasło
            <div className="password-wrap">
              <input
                type={showPwd ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="eye-btn"
                onClick={() => setShowPwd((s) => !s)}
                aria-label="toggle password visibility"
              >
                <span className={`eye ${showPwd ? "open" : ""}`}></span>
              </button>
            </div>
          </label>

          {tab === "register" && (
            <div className="pw-requirements">
              <div className="pw-heading">Twoje hasło musi mieć</div>
              <ul>
                  {pwdChecks.map((c) => (
                    <li key={c.key} className={c.ok ? "ok" : ""}>
                      <span className={`check ${c.ok ? "dot" : ""}`} aria-hidden>
                        {c.ok ? "" : "—"}
                      </span>
                      <span className="text">{c.label}</span>
                    </li>
                  ))}
              </ul>
            </div>
          )}

          <button className="submit-btn" type="submit">
            {tab === "login" ? "Zaloguj" : "Utwórz konto indywidualne"}
          </button>
          {
            isCreated && (
                  <div className="alert alert-success text-center" role="alert">
                    Account created!
                  </div>
              )
          }
          {
              !isLogged && (
                  <div className="alert alert-danger text-center" role="alert">
                    An error occurred while attempting to log in.
                  </div>
              )
          }
        </form>
      </div>
    </div>
  );
}

export default AuthorizationPage;
