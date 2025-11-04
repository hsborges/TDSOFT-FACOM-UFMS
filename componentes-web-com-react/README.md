# Aprendendo Componentização com React

Aplicação com fins educativos para ensino de princípios de componentização de software usando React.

## 📚 Objetivo Educacional

Este projeto foi criado com o objetivo de demonstrar código **SEM componentização** para posteriormente ensinar os benefícios da componentização e reutilização de código.

## 🎯 Características

- ✅ Aplicação frontend simples com React + Vite + Tailwind CSS
- ✅ Não utiliza de biblioteca de componentes
- ✅ Duas páginas: Login e Cadastro
- ✅ Ambas páginas seguem o mesmo layout mas implementadas separadamente

## 🛠️ Stack Tecnológica

- **React** - Biblioteca JavaScript para construção de interfaces
- **Vite** - Build tool rápida e moderna
- **Tailwind CSS** - Framework CSS utilitário
- **React Router** - Navegação entre páginas

## 📦 Instalação

### Pré-requisitos

Certifique-se de ter instalado:

- Node.js (versão 18 ou superior)
- npm ou yarn

### Passos

1. Clone o repositório:

```bash
git clone <url-do-repositório>
cd componentes-web-com-react
```

2. Instale as dependências:

```bash
npm install
```

3. Execute o projeto em modo de desenvolvimento:

```bash
npm run dev
```

4. Abra o navegador em `http://localhost:5173`

## 📁 Estrutura do Projeto

```
componentes-web-com-react/
├── src/
│   ├── pages/
│   │   ├── Login.jsx       # Página de login (sem componentização)
│   │   └── Cadastro.jsx    # Página de cadastro (sem componentização)
│   ├── main.jsx            # Ponto de entrada da aplicação
│   └── index.css           # Estilos globais com Tailwind
├── index.html              # HTML principal
├── package.json            # Dependências do projeto
├── vite.config.js          # Configuração do Vite
├── tailwind.config.js      # Configuração do Tailwind CSS
└── postcss.config.js       # Configuração do PostCSS
```

## 🎨 Páginas

### Login (`/`)

- Formulário de login com email e senha
- Opção "Lembrar-me"
- Link para recuperação de senha
- Botões de login social (Google e Facebook)
- Link para página de cadastro

### Cadastro (`/cadastro`)

- Formulário de cadastro com nome, email, senha e confirmação
- Validação de campos
- Checkbox de aceitação de termos
- Botões de cadastro social (Google e Facebook)
- Link para página de login

## 🔍 Pontos de Aprendizado

Este projeto demonstra diversos problemas de código não componentizado:

1. **Duplicação de código**: O layout, header, footer e botões sociais estão duplicados em ambas as páginas
2. **Manutenção difícil**: Mudanças precisam ser feitas em múltiplos lugares
3. **Inconsistência**: Alto risco de divergências entre páginas similares
4. **Baixa reutilização**: Elementos comuns não são compartilhados

## 🚀 Scripts Disponíveis

- `npm run dev` - Inicia o servidor de desenvolvimento
- `npm run build` - Cria a build de produção
- `npm run preview` - Visualiza a build de produção localmente

## 📝 Notas Importantes

- Este código foi **intencionalmente** escrito sem componentização
- O objetivo é demonstrar os **problemas** dessa abordagem
- Este código deve ser **refatorado** para usar componentes reutilizáveis

## 🎓 Próximos Passos

Após analisar este código, os próximos passos seriam:

1. Identificar elementos duplicados entre as páginas
2. Extrair componentes reutilizáveis
3. Criar um layout compartilhado
4. Comparar a diferença em linhas de código e manutenibilidade

## 📄 Licença

Este projeto é de código aberto e está disponível para fins educacionais.

---

**Desenvolvido para fins educativos**
