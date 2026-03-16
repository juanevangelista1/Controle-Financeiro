# Controle Financeiro

Aplicação mobile-first para gestão financeira pessoal. 100% offline — todos os dados ficam no **localStorage** do browser, sem backend ou banco de dados.

## Stack

- **Frontend:** React 19 + React Router 7 + Tailwind CSS v4 + Zustand + Recharts
- **Armazenamento:** Web Storage API (localStorage) — 100% offline e client-side
- **Validação:** Zod

## Funcionalidades

- Transações: criar, editar, excluir e filtrar por mês/ano
- Categorias padrão criadas automaticamente no primeiro acesso
- Orçamentos por categoria com barra de progresso e alerta de excesso
- Relatórios com gráfico de pizza (despesas por categoria) e gráfico de barras (visão anual)
- Exportar transações em **CSV**, backup completo em **JSON** e **imprimir**
- Modo escuro com persistência
- Limpar todos os dados nas configurações

## Como rodar

```bash
npm install
npm run dev
```

Acesse: <http://localhost:5173>

## Estrutura

```text
apps/
  web/                  # Aplicação React (único app)
    src/
      domains/
        transactions/   # Repositório, serviço, store, hooks, componentes
        categories/     # Repositório, serviço, store, hooks
        budgets/        # Repositório, serviço, store, hooks, componentes
        reports/        # Serviços de relatório e exportação, hooks, componentes
        settings/       # Página de configurações
      shared/
        storage/        # storageKeys + storageService (camada localStorage)
        stores/         # filterStore, themeStore
        utils/          # formatters, idGenerator
        components/     # Modal, EmptyState, LoadingSpinner, etc.
        layouts/        # MainLayout com bottom navigation
packages/
  shared/               # Schemas Zod + tipos compartilhados
```

## Scripts

| Script            | Descrição                                |
| ----------------- | ---------------------------------------- |
| `npm run dev`     | Inicia o app em modo desenvolvimento     |
| `npm run build`   | Gera o build de produção                 |
| `npm run lint`    | Verifica o código com ESLint             |
