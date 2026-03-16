# Contexto e Regras de Engenharia: Aplicação de Controle Financeiro (Mobile-First)

## 1. Visão Geral do Projeto

Aplicativo web mobile-first para gestão financeira pessoal. O usuário poderá registrar entradas, saídas diárias, categorizar gastos, visualizar resumos mensais/anuais em cards e detalhar transações em tabelas expansíveis.

## 2. Stack Tecnológico

- **Front-end:** React Router 7 (configuração SPA com data loaders), React 19, Tailwind CSS v4, Lucide React (ícones).
- **Gerenciamento de Estado:** Zustand (para estado global leve e evitar prop drilling) + React Query (para cache e sincronização com backend).
- **Back-end:** Nenhum. A aplicação agora opera 100% no Client-side.
- **Banco de Dados:** Web Storage API (Local Storage). Todos os dados ficam no dispositivo do usuário, garantindo privacidade e funcionando offline.

## 3. Funcionalidades Core & Agregadoras de Valor

- **Core:**
  - Entrada diária de despesas e receitas.
  - Visualização baseada em Cards de Resumo (Mês/Ano).
  - Drill-down: Clique no card abre uma tabela detalhada (Data, Categoria, Valor, Descrição opcional).
  - Filtros anuais e mensais com atualização automática da UI.
- **Agregadoras de Valor (Propostas):**
  - _Orçamentos (Budgets):_ Definir limites por categoria e ver uma barra de progresso (inspirado no dashboard de referência).
  - _Despesas Recorrentes:_ Automação para lançar assinaturas mensais.
  - _Gráficos Visuais:_ Recharts para gráficos de pizza (gastos por categoria) e barras (receitas vs despesas).
  - _Exportação e Impressão:_ Baixar dados localmente (JSON/CSV) e impressão otimizada.

## 4. Arquitetura e Padrões de Design (Mandatórios)

- **DDD (Domain-Driven Design):** Organize pastas por domínios (ex: `/transactions`, `/categories`, `/reports`) e não por tipo de arquivo (evite pastas gigantes de `/components` misturados).
- **Princípios SOLID:**
  - _(S)_ Componentes de UI apenas renderizam; lógicas de fetch ficam em hooks customizados.
  - _(D)_ Dependa de abstrações. Crie interfaces TypeScript explícitas para os retornos da API.
- **DRY (Don't Repeat Yourself):** Centralize a formatação de moeda (ex: `formatCurrency(value)`), datas e instâncias do Axios/Fetch.
- **KISS (Keep It Simple, Stupid):** Evite overengineering. Comece com a solução mais direta.

## 5. Regras Estritas de Clean Code

1. **Nomenclatura Explícita e em Inglês (camelCase):** \* _Ruim:_ `const d = new Date()`, `calc()`, `user_id`.
   - _Bom:_ `const currentDate = new Date()`, `calculateMonthlyTotal()`, `userId`.
2. **Proibido Prop Drilling:** Use Zustand ou React Context para estados que cruzam múltiplas camadas (ex: Tema, Usuário logado, Filtro de Ano global).
3. **Proibido Ternários Aninhados:** \* _Ruim:_ `isTrue ? a : isFalse ? b : c`
   - _Bom:_ Use early returns, `if/else` claros ou dicionários de mapeamento.
4. **Tratamento de Erros Robusto (Try/Catch):** Toda chamada assíncrona deve ser envolta em `try/catch`. O `catch` deve registrar o erro e disparar um Toast amigável ao usuário.
5. **Sem "Magic Numbers" ou Hardcoded:** Qualquer valor fixo (taxas, IDs padrão, chaves de API) deve vir de variáveis de ambiente (`.env`) ou constantes globais (`constants.ts`).
6. **Segurança e DOM:** É estritamente proibido o uso de `dangerouslySetInnerHTML`. Faça sanitização no backend e garanta o escape de strings no React (o que já é padrão).
7. **Performance:** \* Evite complexidade $O(n^2)$ em loops de renderização e cálculos no frontend. Use map/reduce em $O(n)$.
   - Memoize componentes pesados com `React.memo` e funções de callback com `useCallback` somente quando houver gargalos reais de renderização.

## 6. Padrão de Componente (Exemplo a seguir)

```tsx
import { useState } from 'react';
import { useTransactions } from '@/domains/transactions/hooks/useTransactions';

export function TransactionList() {
	// Estado e Fetching isolados (Responsabilidade Única)
	const { data: transactions, isLoading, error } = useTransactions();

	if (isLoading) return <LoadingSpinner />;
	if (error) return <ErrorMessage message='Failed to load transactions.' />;
	if (!transactions.length) return <EmptyState message='No transactions found.' />;

	return (
		<ul className='flex flex-col gap-4'>
			{transactions.map((transaction) => (
				<TransactionCard
					key={transaction.id}
					data={transaction}
				/>
			))}
		</ul>
	);
}
```

---

### 2. A Explicação

Aqui está o detalhamento técnico e as justificativas para as escolhas feitas na elaboração do seu plano de arquitetura.

**O quê:**

- A transição para **Local Storage**, eliminando a dependência de um Back-end tradicional.
- A escolha do ecossistema moderno focado em performance (React Router 7, Tailwind v4, Zustand, React Query).
- A estruturação do documento baseada em domínios (DDD) e a imposição de regras de linting/estilo arquitetural (sem ternários, tratamento de erro obrigatório, nomes semânticos).
- A adição de funcionalidades como _Budgets_, _Despesas Recorrentes_, _Visualização_, _Impressão_ e _Exportação_ de dados.

**Por quê:**

- **Armazenamento Local:** Elimina custos de servidor, aumenta a privacidade (dados não saem do dispositivo) e funciona perfeitamente para um app de controle pessoal focado no modelo Mobile-first Offline. Optou-se por Local Storage em vez de Session Storage para garantir que os dados não sejam perdidos ao fechar a aba do navegador.
- **Tech Stack:** O React Router 7 integra o roteamento com a busca de dados (_loaders_), reduzindo o tempo de carregamento em SPAs. O Tailwind agiliza a construção "Mobile-first", e o Zustand elimina a complexidade e a verbosidade clássica do Redux, evitando o _prop drilling_ que você mencionou.
- **Regras de Código:** Exigir o fim de ternários aninhados e de strings "hardcoded" melhora a manutenção drásticamente. Qualquer engenheiro ou IA que ler o código entenderá o fluxo sem precisar decifrar condicionais complexas.
- **Agregadores de Valor:** Baseado na imagem de referência enviada (um dashboard de contratos com barras de progresso), adicionei o conceito de "Orçamentos" (Budgets). Isso cria uma experiência visual engajadora, onde o usuário vê uma barra de progresso encher conforme o gasto se aproxima do limite definido, maximizando o valor do seu app.

**Conceitos:**

- **DDD (Domain-Driven Design):** Em vez de agrupar todos os componentes em uma pasta só, agrupamos por contexto de negócio (`/transactions`, `/reports`). Isso facilita escalar a equipe e o código.
- **Princípio da Responsabilidade Única (SOLID - SRP):** No exemplo final do arquivo MD, a UI apenas consome o hook `useTransactions()`. A responsabilidade de bater na API, tratar cache, loading e parsing de dados está abstraída no hook, deixando o componente React limpo e focado apenas em desenhar os elementos na tela.
- **Complexidade Algorítmica e Big-O:** Explicitamos a regra para evitar loops duplos ($O(n^2)$) na manipulação dos arrays de transações, incentivando o uso otimizado de listas ($O(n)$) para que o aplicativo não trave em celulares mais antigos à medida que o histórico financeiro do usuário cresce ao longo dos anos.
- **Princípio DRY:** Centralizar formatações (moeda, data) previne que você tenha que alterar 20 arquivos diferentes no dia que decidir mudar a exibição de `R$ 1.000,00` para `BRL 1.000,00`.
