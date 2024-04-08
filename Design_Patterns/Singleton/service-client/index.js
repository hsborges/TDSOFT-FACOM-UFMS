import express from "express";

const app = express();

app.get("/pode-participar", async (req, res) => {
  // preciso fazer uma consulta ao serviço externo
  // se score > 13500, pode participar
  // se score < 13500, não pode participar
  const data = await fetch(
    `https://rate-limit.tdsoft.hsborges.dev/score?nome=${req.query.nome}`
  ).then((response) => response.json());

  if (data.score > 13500) {
    res.send("Pode participar");
  } else {
    res.send("Não pode participar");
  }
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
