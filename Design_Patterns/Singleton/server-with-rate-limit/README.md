# Aplicação Express com Limitação de Taxa

Esta é uma aplicação Express simples que demonstra o uso de limitação de taxa. Também inclui uma função que gera um valor fictício com base em um nome dado.

## Instalação

1. Clone o repositório
2. Instale as dependências com `npm install`
3. Inicie o servidor com `npm start`

## Uso

A aplicação tem duas rotas:

1. `/` - Retorna uma mensagem simples para indicar que o servidor está em execução.
2. `/score` - Aceita um parâmetro de consulta `nome` e retorna uma pontuação fictícia com base no nome.

## Limitação de Taxa

A aplicação usa o middleware `express-rate-limit` para limitar pedidos repetidos à API. A configuração atual permite 1 pedido a cada 500 milissegundos.
