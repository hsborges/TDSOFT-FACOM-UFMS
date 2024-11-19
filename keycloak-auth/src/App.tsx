import "./App.css";

import { useCallback, useState } from "react";

export default function App() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [token, setToken] = useState("");

  const login = useCallback(async (event: any) => {
    event.preventDefault();
    
    if (!email || !password) return alert("Email e senha são obrigatorios");

    const response = await fetch(
      "https://tdsoft-auth.hsborges.dev/realms/trabalho-pratico/protocol/openid-connect/token",
      {
        method: "POST",
        body: new URLSearchParams({
          client_id: "public-cli",
          username: email,
          password: password,
          grant_type: "password",
          scope: "openid",
        }),
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      },
    );

    const data: any = await response.json();

    console.log(data);

    if (!response.ok)
      alert(data.error_description || data.error || "Erro ao logar");
    else setToken(data.access_token);
  }, [email, password]);

  return (
    <main>
      <form onSubmit={login}>
        <div>
          <label htmlFor="email">Email</label><br/>
          <input
            id="email"
            type="text"
            placeholder="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="pass">Password</label><br/>
          <input
            id="pass"
            type="password"
            placeholder="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <br/>
        <div>
          <button type="submit">Login</button>
        </div>
      </form>
      <br />
      <div>
        {token ? (
          <span>
            <b>Seu access_token:</b> {token}
          </span>
        ) : (
          <b>Não Autenticado</b>
        )}
      </div>
      <br />
    </main>
  );
}
