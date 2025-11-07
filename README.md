OBS: não rode o projeto com `bun`, pois o `bun` não suporta o kysely com o better-sqlite. Use yarn ou npm.

1. npm install
2. npm migrate-up
4. npm run build
5. npm start
6. npx kysely-codegen (opcional para desenvolvimento)


TODOS:

- Adicionar testes
- Adicionar Bayesian Rating: (v / (v + m)) * R + (m / (v + m)) * C

