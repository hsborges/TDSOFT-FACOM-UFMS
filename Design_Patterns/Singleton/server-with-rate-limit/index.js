// Importing required modules
import Express from "express";
import rateLimit from "express-rate-limit";

/**
 * Function to generate a fictitious value based on the name
 * @param {string} nome - The name for which to generate the fictitious value
 * @returns {number} The generated fictitious value
 */
function gerarValorFicticio(nome) {
  // Convert the name to lowercase
  var nomeMinusc = nome.toLowerCase();

  // Calculate the fictitious value based on different characteristics of the name
  var valor = 0;

  // Add the value of the sum of the ASCII codes of the characters
  for (var i = 0; i < nomeMinusc.length; i++) {
    valor += nomeMinusc.charCodeAt(i);
  }

  // Add the length of the name
  valor += nomeMinusc.length;

  // Multiply by the number of vowels in the name
  var vogais = nomeMinusc.match(/[aeiou]/g);
  if (vogais) {
    valor *= vogais.length;
  }

  // Return the fictitious value
  return valor;
}

// Creating an Express application
const app = Express();

// Applying rate limiting middleware
app.use(rateLimit({ windowMs: 500, max: 1 }));

// Defining a route handler for the home route
app.get("/", (req, res) => {
  res.send("I'm alive");
});

// Defining a route handler for the score route
app.get("/score", (req, res) => {
  const { nome } = req.query;

  if (!nome) return res.status(400).json({ message: "Nome é obrigatório" });

  const valor = gerarValorFicticio(nome);
  res.json({
    score: valor,
    message: `O valor fictício para ${nome} é ${valor}`,
  });
});

// Starting the server
app.listen(process.env.PORT || 3000, () => {
  console.log(`Server is running on port ${process.env.PORT || 3000}`);
});
