# Cidadão Ligado

Aplicação web responsiva em Next.js para consultar e visualizar dados de despesas e transferências públicas a partir de dados oficiais do governo federal. O projeto foi pensado para tornar mais acessível ao cidadão o acompanhamento de informações oficiais, com foco em legibilidade e navegação simples.

## O que a aplicação faz

- Exibe uma dashboard com contexto sobre transparência pública.
- Permite buscar recursos repassados pelo Governo por período e página.
- Apresenta os resultados em uma lista organizada.
- Agrupa os dados por tipo de entidade beneficiária e exibe gráfico circular para mostrar uma visão resumida dos valores.
- Usa uma rota interna da API para buscar os dados de forma segura no servidor.

## Tecnologias

- Next.js 16
- React 19
- TypeScript
- Axios
- CSS Modules
- ESLint

## Estrutura do projeto

- src/app/components/Dashboard: tela principal e componentes do painel.
- src/app/api/recursos: rota interna que recebe a requisição do frontend e consulta os dados.
- src/lib/api: camada de integração com o serviço externo.
- src/types: interfaces TypeScript usadas para tipar os dados.

## Pré-requisitos

- Node.js 18+
- npm, pnpm, yarn ou bun

## Como executar localmente

1. Instale as dependências:

```bash
npm install
```

2. Inicie o servidor de desenvolvimento:

```bash
npm run dev
```


3. Acesse no navegador:

https://cidadao-ligado.vercel.app/

## Scripts disponíveis

```bash
npm run dev
npm run build
npm run start
npm run lint
```

## Observações

A aplicação consulta dados oficiais do governo federal por meio de uma integração server-side. O funcionamento depende de uma conexão válida com a API configurada no projeto.

- Acesse a versão online da aplicação clicando no link abaixo:

https://cidadao-ligado.vercel.app/
