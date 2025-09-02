// Importing required modules
import Express from "express";
import rateLimiter from "./middlewares/rateLimiter.js";
import clientIdentificator from "./middlewares/clientIdentificator.js";
import { cpf as cpfValidator } from "cpf-cnpj-validator";
import YAML from "yaml";
import swaggerUi from "swagger-ui-express";
import fs from "node:fs";
import { z } from "zod";

const env = z
  .object({
    PORT: z.coerce.number().int().default(3000),
    BASE_URL: z.string().optional(),
  })
  .transform((value) => ({
    ...value,
    BASE_URL: value.BASE_URL || `http://localhost:${value.PORT}`,
  }))
  .parse(process.env);

/**
 * Calcula um score fictício com base na soma ponderada dos dígitos do CPF.
 */
function calcularScore(cpf) {
  // Remove caracteres não numéricos do CPF
  cpf = cpf.replace(/\D/g, "");

  // Converte o CPF em um array de números
  let cpfArray = cpf.split("").map(Number);

  // Calcula um score fictício com base na soma ponderada dos dígitos
  let score = 0;
  for (let i = 0; i < cpfArray.length; i++) {
    score += cpfArray[i] * (i + 1);
  }

  // Gera um score final entre 0 e 1000
  score = score % 1000;

  return score;
}

//
const app = Express();

// Serve swagger
const file = fs.readFileSync("./swagger.yaml", "utf8");
const swaggerDocument = YAML.parse(file);
app.use(
  "/docs",
  swaggerUi.serve,
  swaggerUi.setup({
    ...swaggerDocument,
    servers: [{ url: `${env.BASE_URL}/api` }],
  })
);

// Defining a route handler for the home route
app.get("/", (req, res) => {
  res.send("I'm alive");
});

// Defining a route handler for the score route
app.get("/api/score", clientIdentificator, rateLimiter, (req, res) => {
  const { cpf } = req.query;

  if (!cpf) return res.status(400).json({ message: "CPF é obrigatório" });
  else if (!cpfValidator.isValid(cpf))
    return res.status(400).json({ message: "CPF inválido" });

  const formattedValue = cpfValidator.format(cpf);
  const valor = calcularScore(formattedValue);

  res.json({
    cpf: formattedValue,
    score: valor,
    message: `O score de ${formattedValue} é ${valor}`,
  });
});

// Starting the server
app.listen(env.PORT, () => {
  console.log(`Server is running on port ${env.PORT}`);
});
