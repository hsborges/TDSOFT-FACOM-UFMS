import express from "express";
import ServiceClient from "./ServiceClient.js";

const app = express();
const client = new ServiceClient();

app.get("/pode-participar", async (req, res) => {
  // preciso fazer uma consulta ao serviço externo
  // se score > 13500, pode participar
  // se score < 13500, não pode participar
  const score = await client.consultaScore(req.query.nome);

  if (score > 13500) {
    res.send("Pode participar");
  } else {
    res.send("Não pode participar");
  }
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
