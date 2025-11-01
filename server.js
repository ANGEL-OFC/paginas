// server.js
import express from "express";
import bodyParser from "body-parser";
import session from "express-session";

const app = express();
app.use(bodyParser.json());
app.use(express.static("public"));

app.use(
  session({
    secret: "clave-secreta-ultra",
    resave: false,
    saveUninitialized: true,
  })
);

// Guardará usuarios temporalmente
const usuarios = [];

// Registro
app.post("/api/register", (req, res) => {
  const { username, password } = req.body;
  if (!username || !password)
    return res.status(400).json({ error: "Faltan datos" });

  if (usuarios.find((u) => u.username === username))
    return res.status(400).json({ error: "Usuario ya existe" });

  usuarios.push({ username, password });
  res.json({ ok: true });
});

// Login
app.post("/api/login", (req, res) => {
  const { username, password } = req.body;
  const user = usuarios.find(
    (u) => u.username === username && u.password === password
  );
  if (!user) return res.status(401).json({ error: "Credenciales inválidas" });

  req.session.user = user;
  res.json({ ok: true });
});

// Verificación de sesión
app.get("/api/session", (req, res) => {
  if (req.session.user) return res.json({ logged: true, user: req.session.user });
  res.json({ logged: false });
});

// Logout
app.get("/api/logout", (req, res) => {
  req.session.destroy();
  res.redirect("/login.html");
});

app.listen(3000, () => console.log("✅ Servidor listo en http://localhost:3000"));