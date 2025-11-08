## ESTE README É TEMPORÁRIO, APENAS PARA REFERÊNCIA

Acesse o projeto em: [https://indie-list.frali.com.br/](https://indie-list.frali.com.br/)

Documentação: [https://indie-list.frali.com.br/api-docs](https://indie-list.frali.com.br/api-docs)

Design Figma (URL): [https://www.figma.com/design/ATekGRJ9sfZWazYlUZxBTr/IndieList?node-id=5109-250&t=5AQxTCJakzKKtolt-1](https://www.figma.com/design/ATekGRJ9sfZWazYlUZxBTr/IndieList?node-id=5109-250&t=5AQxTCJakzKKtolt-1)
Design Figma (PDF): [docs/figma.pdf](docs/figma.pdf)

Deploy:
- NGINX (Servidor HTTP)
- PM2 (Gerenciador de processos)


OBS: não rode o projeto com `bun`, pois o `bun` não suporta o kysely com o better-sqlite. Use yarn ou npm.

1. npm install
2. npm migrate-up
4. npm run build
5. npm start
6. npx kysely-codegen (opcional para desenvolvimento)


TODOS (longo prazo):
- Adicionar testes
- Adicionar Bayesian Rating: `(v / (v + m)) * R + (m / (v + m)) * C`
- Adição de categorias
- Cadastro facilitado sem senha
- Separação dos streamings em uma tabela separada controlada pelos admins
- Adicionar Typesense (Search Engine) para melhorar a busca quando tiver mais features. Atualmente a busca é altamente eficiente e rápida.
- Adicionar Storybook (UI component library) para melhorar a experiência de desenvolvimento ao escalar o projeto. Atualmente o projeto já tem um Figma definido com um design system, porém a longo prazo isso pode ser substituído pelo Storybook.

TECNOLOGIAS:
## Backend
- SQLite (Banco de Dados)
- Kysely (Query Builder)
- Swagger (Documentação)

## Frontend
- Next.js v16
- Tailwindcss v4 (Estilização)
- Biome (Linter e Formatador de código)
- Shadcn (Componentes)
