import express from "express";
import ServiceClient from "./ServiceClient";

const app = express();

app.get("/pode-participar", async (req, res) => {
  const { nome } = req.query;

  if (!nome) {
    res.status(400).json({ message: "Nome é obrigatório" });
    return;
  }

  const score = await ServiceClient.getInstance().consultaScore(
    nome.toString()
  );

  if (score < 0) {
    res
      .status(429)
      .json("Erro ao consultar score, tente novamente mais tarde.");
  } else if (score > 13500) {
    res.send("Pode participar");
  } else {
    res.send("Não pode participar");
  }
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
