import Express from "express";
import rateLimit from "express-rate-limit";

function gerarValorFicticio(nome) {
  // Converter o nome para minúsculas
  var nomeMinusc = nome.toLowerCase();

  // Calcular o valor fictício baseado em diferentes características do nome
  var valor = 0;

  // Adicionar o valor da soma dos códigos ASCII dos caracteres
  for (var i = 0; i < nomeMinusc.length; i++) {
    valor += nomeMinusc.charCodeAt(i);
  }

  // Adicionar o comprimento do nome
  valor += nomeMinusc.length;

  // Multiplicar pelo número de vogais no nome
  var vogais = nomeMinusc.match(/[aeiou]/g);
  if (vogais) {
    valor *= vogais.length;
  }

  // Retornar o valor fictício
  return valor;
}

const app = Express();

app.use(rateLimit({ windowMs: 500, max: 1 }));

app.get("/", (req, res) => {
  res.send("I'm alive");
});

app.get("/score", (req, res) => {
  const { nome } = req.query;

  if (!nome) return res.status(400).json({ message: "Nome é obrigatório" });

  const valor = gerarValorFicticio(nome);
  res.json({
    score: valor,
    message: `O valor fictício para ${nome} é ${valor}`,
  });
});

app.listen(process.env.PORT || 3000, () => {
  console.log(`Server is running on port ${process.env.PORT || 3000}`);
});
