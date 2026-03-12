'use client';

import { useMemo, useState } from "react";

type ScoreField = "atendimento" | "seguranca" | "prazo" | "qualidade";

type MonthlyScore = {
  atendimento: number;
  seguranca: number;
  prazo: number;
  qualidade: number;
};

type Scores = Record<string, MonthlyScore>;

type UserType = {
  cs: string;
  name: string;
  passwordCreated: boolean;
  password: string;
  scores: Scores;
};

const initialUsers: UserType[] = [
  {
    cs: "CS443916",
    name: "Murilo",
    passwordCreated: false,
    password: "",
    scores: {
      "2026-01": {
        atendimento: 82,
        seguranca: 95,
        prazo: 76,
        qualidade: 88,
      },
      "2026-02": {
        atendimento: 90,
        seguranca: 91,
        prazo: 85,
        qualidade: 93,
      },
    },
  },
  {
    cs: "CS551100",
    name: "Gasista 2",
    passwordCreated: false,
    password: "",
    scores: {
      "2026-02": {
        atendimento: 78,
        seguranca: 89,
        prazo: 80,
        qualidade: 84,
      },
    },
  },
];

function average(obj: Record<string, number>) {
  const values = Object.values(obj || {});
  if (!values.length) return 0;
  return Math.round(values.reduce((a, b) => a + b, 0) / values.length);
}

function monthLabel(month: string) {
  const [year, m] = month.split("-");
  const names = [
    "Janeiro",
    "Fevereiro",
    "Março",
    "Abril",
    "Maio",
    "Junho",
    "Julho",
    "Agosto",
    "Setembro",
    "Outubro",
    "Novembro",
    "Dezembro",
  ];
  return `${names[Number(m) - 1]} / ${year}`;
}

function cardStyle(): React.CSSProperties {
  return {
    background: "#fff",
    borderRadius: 18,
    padding: 20,
    boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
    border: "1px solid #e5e7eb",
  };
}

function inputStyle(): React.CSSProperties {
  return {
    width: "100%",
    padding: "12px 14px",
    borderRadius: 12,
    border: "1px solid #9ca3af",
    outline: "none",
    fontSize: 14,
    boxSizing: "border-box",
    color: "#111827",
    background: "#ffffff",
  };
}

function buttonStyle(): React.CSSProperties {
  return {
    width: "100%",
    padding: "12px 14px",
    border: "none",
    borderRadius: 12,
    background: "#111827",
    color: "#fff",
    fontWeight: 600,
    cursor: "pointer",
  };
}

export default function Page() {
  const [users, setUsers] = useState<UserType[]>(initialUsers);
  const [tab, setTab] = useState<"login" | "create">("login");

  const [loginCS, setLoginCS] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  const [createCS, setCreateCS] = useState("");
  const [createPassword, setCreatePassword] = useState("");
  const [createPassword2, setCreatePassword2] = useState("");

  const [currentCS, setCurrentCS] = useState<string | null>(null);
  const [message, setMessage] = useState("");

  const currentUser = useMemo(
    () => users.find((u) => u.cs === currentCS) || null,
    [users, currentCS]
  );

  const matchedLoginUser = useMemo(
    () => users.find((u) => u.cs.toUpperCase() === loginCS.trim().toUpperCase()) || null,
    [users, loginCS]
  );

  const matchedCreateUser = useMemo(
    () => users.find((u) => u.cs.toUpperCase() === createCS.trim().toUpperCase()) || null,
    [users, createCS]
  );

  function handleCreatePassword() {
    setMessage("");

    if (!matchedCreateUser) {
      setMessage("CS não encontrado ou sem acesso.");
      return;
    }

    if (matchedCreateUser.passwordCreated) {
      setMessage("Esse CS já criou senha. Faça login.");
      return;
    }

    if (createPassword.length < 4) {
      setMessage("A senha precisa ter pelo menos 4 caracteres.");
      return;
    }

    if (createPassword !== createPassword2) {
      setMessage("As senhas não coincidem.");
      return;
    }

    setUsers((prev) =>
      prev.map((u) =>
        u.cs === matchedCreateUser.cs
          ? { ...u, passwordCreated: true, password: createPassword }
          : u
      )
    );

    setMessage("Senha criada com sucesso. Agora faça login.");
    setCreatePassword("");
    setCreatePassword2("");
    setTab("login");
  }

  function handleLogin() {
    setMessage("");

    if (!matchedLoginUser) {
      setMessage("CS não encontrado ou sem acesso.");
      return;
    }

    if (!matchedLoginUser.passwordCreated) {
      setMessage("Primeiro acesso: crie sua senha.");
      return;
    }

    if (matchedLoginUser.password !== loginPassword) {
      setMessage("Senha incorreta.");
      return;
    }

    setCurrentCS(matchedLoginUser.cs);
    setLoginPassword("");
    setMessage("");
  }

  function handleLogout() {
    setCurrentCS(null);
    setLoginCS("");
    setLoginPassword("");
    setMessage("");
  }

  function updateScore(
    cs: string,
    month: string,
    field: ScoreField,
    value: string
  ) {
    const numericValue = Number(value) || 0;

    setUsers((prev) =>
      prev.map((u) =>
        u.cs === cs
          ? {
              ...u,
              scores: {
                ...u.scores,
                [month]: {
                  atendimento: u.scores[month]?.atendimento ?? 0,
                  seguranca: u.scores[month]?.seguranca ?? 0,
                  prazo: u.scores[month]?.prazo ?? 0,
                  qualidade: u.scores[month]?.qualidade ?? 0,
                  [field]: numericValue,
                },
              },
            }
          : u
      )
    );
  }

  if (currentUser) {
    const months = Object.keys(currentUser.scores).sort().reverse();
    const latestMonth = months[0];
    const currentScores = currentUser.scores[latestMonth];
    const media = average(currentScores);

    return (
      <div
        style={{
        minHeight: "100vh",
        background: "#f3f4f6",
        padding: 24,
        fontFamily: "Arial, sans-serif",
        color: "#111827"
      }}
     >
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div
            style={{
              ...cardStyle(),
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 20,
              gap: 16,
              flexWrap: "wrap",
            }}
          >
            <div>
              <div style={{ fontSize: 14, color: "#374151" }}>Portal de Pontuação</div>
              <h1 style={{ margin: "6px 0", fontSize: 32, color: "#111827" }}>Olá, {currentUser.name}</h1>
              <div style={{ color: "#4b5563" }}>
                Você está vendo somente a sua pontuação.
              </div>
            </div>

            <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
              <div
                style={{
                  background: "#e5e7eb",
                  padding: "8px 14px",
                  borderRadius: 999,
                  fontWeight: 600,
                }}
              >
                {currentUser.cs}
              </div>
              <button
                onClick={handleLogout}
                style={{
                  padding: "10px 14px",
                  borderRadius: 12,
                  border: "1px solid #d1d5db",
                  background: "#fff",
                  cursor: "pointer",
                }}
              >
                Sair
              </button>
            </div>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: 16,
              marginBottom: 20,
            }}
          >
            <div style={cardStyle()}>
              <div style={{ color: "#6b7280", fontSize: 14 }}>Mês atual</div>
              <div style={{ marginTop: 8, fontWeight: 700 }}>{monthLabel(latestMonth)}</div>
              <div style={{ marginTop: 12, fontSize: 34, fontWeight: 700 }}>{media} pts</div>
            </div>

            <div style={cardStyle()}>
              <div style={{ color: "#6b7280", fontSize: 14 }}>Segurança</div>
              <div style={{ marginTop: 12, fontSize: 34, fontWeight: 700 }}>
                {currentScores.seguranca ?? 0}
              </div>
            </div>

            <div style={cardStyle()}>
              <div style={{ color: "#6b7280", fontSize: 14 }}>Atendimento</div>
              <div style={{ marginTop: 12, fontSize: 34, fontWeight: 700 }}>
                {currentScores.atendimento ?? 0}
              </div>
            </div>
          </div>

          <div style={{ ...cardStyle(), marginBottom: 20 }}>
            <h2 style={{ marginTop: 0 }}>Histórico de metas</h2>

            <div style={{ display: "grid", gap: 16 }}>
              {months.map((month) => {
                const monthScores = currentUser.scores[month];
                return (
                  <div
                    key={month}
                    style={{
                      border: "1px solid #e5e7eb",
                      borderRadius: 16,
                      padding: 16,
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        gap: 12,
                        flexWrap: "wrap",
                        marginBottom: 14,
                      }}
                    >
                      <strong>{monthLabel(month)}</strong>
                      <span
                        style={{
                          background: "#f3f4f6",
                          padding: "6px 10px",
                          borderRadius: 999,
                        }}
                      >
                        Média: {average(monthScores)} pts
                      </span>
                    </div>

                    <div style={{ display: "grid", gap: 14 }}>
                      {Object.entries(monthScores).map(([label, value]) => (
                        <div key={label}>
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              marginBottom: 6,
                              fontSize: 14,
                            }}
                          >
                            <span style={{ textTransform: "capitalize" }}>{label}</span>
                            <strong>{value}</strong>
                          </div>

                          <div
                            style={{
                              width: "100%",
                              height: 12,
                              background: "#e5e7eb",
                              borderRadius: 999,
                              overflow: "hidden",
                            }}
                          >
                            <div
                              style={{
                                width: `${value}%`,
                                height: "100%",
                                background: "#111827",
                              }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div style={cardStyle()}>
            <h2 style={{ marginTop: 0 }}>Admin - alterar pontuação</h2>
            <p style={{ color: "#6b7280", marginTop: 0 }}>
              Aqui está só como demonstração.
            </p>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
                gap: 12,
              }}
            >
              <input
                type="number"
                style={inputStyle()}
                value={currentScores.atendimento}
                onChange={(e) =>
                  updateScore(currentUser.cs, latestMonth, "atendimento", e.target.value)
                }
              />
              <input
                type="number"
                style={inputStyle()}
                value={currentScores.seguranca}
                onChange={(e) =>
                  updateScore(currentUser.cs, latestMonth, "seguranca", e.target.value)
                }
              />
              <input
                type="number"
                style={inputStyle()}
                value={currentScores.prazo}
                onChange={(e) =>
                  updateScore(currentUser.cs, latestMonth, "prazo", e.target.value)
                }
              />
              <input
                type="number"
                style={inputStyle()}
                value={currentScores.qualidade}
                onChange={(e) =>
                  updateScore(currentUser.cs, latestMonth, "qualidade", e.target.value)
                }
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f3f4f6",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 430,
          background: "#fff",
          borderRadius: 20,
          padding: 24,
          boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
          border: "1px solid #e5e7eb",
        }}
      >
        <h1 style={{ marginTop: 0, marginBottom: 8, color: "#111827" }}>Portal Gasistas</h1>
        <p style={{ color: "#6b7280", marginTop: 0 }}>
          Cada gasista entra com o próprio CS e vê apenas a sua pontuação.
        </p>

        <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
          <button
            onClick={() => setTab("login")}
            style={{
              flex: 1,
              padding: 12,
              borderRadius: 12,
              border: "1px solid #d1d5db",
              background: tab === "login" ? "#111827" : "#fff",
              color: tab === "login" ? "#fff" : "#111827",
              cursor: "pointer",
              fontWeight: 600,
            }}
          >
            Entrar
          </button>

          <button
            onClick={() => setTab("create")}
            style={{
              flex: 1,
              padding: 12,
              borderRadius: 12,
              border: "1px solid #d1d5db",
              background: tab === "create" ? "#111827" : "#fff",
              color: tab === "create" ? "#fff" : "#111827",
              cursor: "pointer",
              fontWeight: 600,
            }}
          >
            Primeiro acesso
          </button>
        </div>

        {tab === "login" && (
          <div style={{ display: "grid", gap: 12 }}>
            <div>
              <label style={{ display: "block", marginBottom: 6, fontSize: 14 }}>Senha</label>
              <input
                style={inputStyle()}
                placeholder="CS123456"
                value={loginCS}
                onChange={(e) => setLoginCS(e.target.value)}
              />
            </div>

            <div>
              <label style={{ display: "block", marginBottom: 6, fontSize: 14 }}>Senha</label>
              <input
                style={inputStyle()}
                type="password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
              />
            </div>

            <button style={buttonStyle()} onClick={handleLogin}>
              Entrar
            </button>
          </div>
        )}

        {tab === "create" && (
          <div style={{ display: "grid", gap: 12 }}>
            <div>
              <label style={{ display: "block", marginBottom: 6, fontSize: 14, color: "#374151" }}>CS</label>
              <input
                style={inputStyle()}
                placeholder="CS123456"
                value={createCS}
                onChange={(e) => setCreateCS(e.target.value)}
              />
            </div>

            <div>
              <label style={{ display: "block", marginBottom: 6, fontSize: 14 }}>
                Criar senha
              </label>
              <input
                style={inputStyle()}
                type="password"
                value={createPassword}
                onChange={(e) => setCreatePassword(e.target.value)}
              />
            </div>

            <div>
              <label style={{ display: "block", marginBottom: 6, fontSize: 14 }}>
                Confirmar senha
              </label>
              <input
                style={inputStyle()}
                type="password"
                value={createPassword2}
                onChange={(e) => setCreatePassword2(e.target.value)}
              />
            </div>

            <button style={buttonStyle()} onClick={handleCreatePassword}>
              Criar senha
            </button>
          </div>
        )}

        {message && (
          <p style={{ marginTop: 16, color: "#dc2626", textAlign: "center" }}>{message}</p>
        )}
      </div>
    </div>
  );
}