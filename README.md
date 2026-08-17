# 🏡 Gerador de Mensagens de Orçamento — Chalés Senhor dos Trilhos

> Ferramenta web para gerar mensagens formatadas de orçamento e solicitação de dados para WhatsApp de forma rápida e sem erros.

---

## ✨ Sobre o Projeto

Esta ferramenta substitui o processo manual de montar mensagens de orçamento para hóspedes. O usuário consulta os valores no sistema de channel manager (Foco) e usa esta ferramenta para organizar os dados e gerar uma mensagem pronta para copiar e colar no WhatsApp.

**Sem backend. Sem banco de dados. Abre direto no navegador.**

---

## 🚀 Funcionalidades

### 📋 Três Abas de Geração de Mensagem

| Aba | Descrição |
|---|---|
| **Orçamento Padrão** | Gera cotação com entrada 14h e saída 12h |
| **Orçamento Day Use com Chalé** | Gera cotação com entrada 09h e saída 17h |
| **Day Use — Solicitação de Dados** | Gera mensagem pós-confirmação para coleta de nome, CPF e nascimento dos hóspedes |

### 🧠 Inteligência Automática

- **Preenchimento automático**: Para reservas de 1 a 2 pessoas e 1 a 2 diárias, os valores dos chalés são preenchidos automaticamente com os preços padrão
- **Cálculo de diárias**: Calculado automaticamente a partir das datas de check-in e check-out
- **Política de crianças**: Chalés com hidromassagem são bloqueados automaticamente quando há crianças na reserva, exibindo *"Não permite crianças"* na mensagem
- **Exceção com confirmação**: O usuário pode desbloquear um chalé com hidro em casos excepcionais, com um modal de confirmação para evitar erros
- **Alertas de capacidade**: Aviso informativo (não bloqueante) quando o número de hóspedes excede a capacidade do chalé

### 💳 Cálculo do Day Use

- Regra automática de isenção: crianças de 0 a 7 anos não pagam (limite de **2 crianças isentas por reserva**)
- Crianças adicionais de até 7 anos (3ª em diante) são cobradas normalmente
- Crianças de 8+ anos sempre pagam valor integral
- Status pagante/isento pode ser **editado manualmente** pelo usuário

### 📱 Preview em Tempo Real

- Painel lateral estilizado como uma conversa do WhatsApp
- Mensagem atualizada instantaneamente a cada campo preenchido
- Botão **"Copiar Mensagem"** com feedback visual de confirmação

---

## 🏗️ Estrutura do Projeto

```
📦 PROJETO2/
├── 📄 index.html                        # Interface principal (abas, formulários, preview WhatsApp)
├── 📁 css/
│   └── 🎨 style.css                     # Design system moderno e responsivo
├── 📁 js/
│   ├── ⚙️  config.js                    # Dados do cliente, chalés, preços e templates
│   ├── 🔧 utils.js                      # Utilitários: formatação de moeda, datas, clipboard
│   └── 🧠 app.js                        # Lógica principal da aplicação
└── 📋 escopo-gerador-orcamentos.md      # Documento de especificação do projeto
```

---

## 🛠️ Tecnologias

- **HTML5** — Estrutura semântica e acessível
- **CSS3 Vanilla** — Design system com variáveis CSS, animações e responsividade total
- **JavaScript ES6+** — Módulos nativos (`type="module"`), sem frameworks, sem build step
- **Clipboard API** — Cópia com um clique com fallback para navegadores antigos
- **Google Fonts** — Tipografia `Plus Jakarta Sans` para visual premium

---

## ▶️ Como Usar

1. **Clone ou baixe** este repositório
2. **Abra o `index.html`** em qualquer navegador moderno

> ⚠️ Por usar módulos ES6 (`type="module"`), é necessário abrir via servidor local (não direto como arquivo `file://`). Use a extensão **Live Server** do VS Code ou rode:
> ```bash
> python -m http.server 8080
> ```
> Em seguida acesse `http://localhost:8080`

---

## 🎯 Fluxo de Uso

```
1. Consulta o valor no sistema Foco (externo)
        ↓
2. Abre a ferramenta e seleciona o tipo de mensagem
        ↓
3. Preenche datas, quantidade de adultos e crianças
        ↓
4. Confere/ajusta os valores dos chalés (ou usa o preenchimento automático)
        ↓
5. Visualiza o preview em tempo real
        ↓
6. Clica em "Copiar Mensagem" e cola no WhatsApp ✅
```

---

## 🏠 Chalés Disponíveis

| Chalé | Tipo | Capacidade Máx. |
|---|---|---|
| **Vista do lago** | Com hidromassagem (maior) | 2 pessoas |
| **Hortênsia** | Com hidromassagem (menor) | 2 pessoas |
| **Sem hidro** | Padrão | 4 pessoas |

---

## 📐 Arquitetura e Extensibilidade

O código está organizado para facilitar a **adição de novos clientes no futuro**. Toda a configuração do cliente (chalés, preços, templates) está isolada em [`js/config.js`](./js/config.js) — bastará adicionar um novo objeto ao mapa de clientes para suportar uma segunda pousada ou resort, sem alterar a lógica da aplicação.

---

## 📌 Escopo e Decisões de Projeto

- Não há cálculo automático de preços por temporada/promoção nas abas de orçamento — os valores são sempre inseridos manualmente pelo usuário (com sugestões via datalist)
- O único cálculo automático de valor é o total do Day Use (Aba 3)
- Sem autenticação, sem histórico de orçamentos, sem envio automático de WhatsApp

> Consulte o [escopo completo do projeto](./escopo-gerador-orcamentos.md) para mais detalhes sobre as regras de negócio.

---

*Desenvolvido para uso interno — Chalés Senhor dos Trilhos*
