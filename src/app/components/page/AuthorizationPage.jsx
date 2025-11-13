import React, { useMemo, useState } from "react";
import "../../assets/styles/_authorization.scss";

function AuthorizationPage() {
  const [tab, setTab] = useState("register");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);

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

  function handleSubmit(e) {
    e.preventDefault();
    if (tab === "register" && !allOk) {
      console.log("Password does not meet requirements");
      return;
    }

    console.log("submit", { tab, email, username: tab === "register" ? username : undefined, password });
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
                placeholder="Wybierz unikalną nazwę"
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
        </form>
      </div>
    </div>
  );
}

export default AuthorizationPage;
