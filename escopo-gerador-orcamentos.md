# Escopo do Projeto — Gerador de Mensagens de Orçamento

## 1. Objetivo

Criar uma ferramenta web simples (HTML + JavaScript, sem backend, roda direto no navegador) para agilizar a geração de mensagens a serem enviadas por WhatsApp aos hóspedes. A ferramenta terá **três abas**:

1. **Orçamento — Padrão**: gera a mensagem de orçamento com horário normal de entrada/saída
2. **Orçamento — Day Use com Chalé**: gera a mensagem de orçamento com horário de Day Use
3. **Day Use — Solicitação de Dados**: gera uma mensagem pedindo os dados dos hóspedes (nome, CPF, nascimento), usada depois que o Day Use já foi confirmado

**O sistema NÃO calcula valores** nas abas de orçamento — apenas organiza campos de seleção/preenchimento e monta uma mensagem de texto pronta para copiar e colar. Já na aba de Day Use — Solicitação de Dados, existe um cálculo automático do valor total (ver seção 11).

## 2. Contexto

Hoje os orçamentos são consultados manualmente no sistema Foco (channel manager), que é lento para esse fim: é preciso inserir datas, quantidade de pessoas, etc., para obter os valores. Depois disso, os valores são copiados manualmente para uma mensagem padrão que é enviada ao hóspede.

Esta ferramenta substitui apenas a etapa de **montagem da mensagem final**, não a consulta de valores no Foco (que continua sendo feita manualmente, à parte).

## 3. Cliente incluído nesta versão

- **Chalés Senhor dos Trilhos** (único cliente nesta primeira versão)
- Estrutura do código deve ser organizada de forma que **novos clientes possam ser adicionados no futuro** (cada um com seu próprio template de mensagem e tabela de preços), mesmo que isso não seja implementado agora — ou seja: evitar hardcode que misture tudo, mas sem se preocupar em construir uma interface de cadastro de clientes agora.

## 4. Fluxo de uso

1. Usuário consulta os valores no sistema Foco (fora desta ferramenta)
2. Abre a ferramenta e preenche:
   - **Tipo de orçamento**: Padrão ou Day Use
   - Data de check-in
   - Data de check-out
   - **Quantidade de adultos**
   - **Quantidade de crianças**
3. O sistema calcula automaticamente o **total de pessoas** (adultos + crianças) e a **quantidade de diárias** (a partir da diferença entre check-in e check-out) — usados para os avisos de ocupação, a exibição de "{qtd_pessoas} pessoas" na mensagem, e o preenchimento automático (ver item 4)
4. **Preenchimento automático (secundário/padrão)**: quando o total de pessoas for **1 ou 2** e a quantidade de diárias for **1 ou 2**, os 3 campos de valor são preenchidos automaticamente com um valor padrão (ver seção 7.1). Fora dessas combinações, os campos ficam vazios e o preenchimento é manual (com o datalist de sugestão, seção 7)
5. **Política de crianças**: se a quantidade de crianças for maior que zero, os campos "Vista do lago" e "Hortênsia" ficam **automaticamente bloqueados**, exibindo "Não permite crianças" no lugar do valor — isso tem prioridade sobre o preenchimento automático do item 4. O campo "Sem hidro" não é afetado.
6. **Limites de ocupação**: cada chalé tem uma capacidade máxima (ver seção 5.1). Se o total de pessoas (adultos + crianças) ultrapassar a capacidade de um chalé, exibe-se um **aviso rápido** (toast) próximo ao campo, algo como "Passou da quantidade de pessoas". Esse aviso **não bloqueia** o campo — o usuário pode prosseguir mesmo assim, é só um alerta pra evitar erro.
7. Usuário preenche (ou ajusta, se já veio auto-preenchido) os 3 campos de valor, digitando o valor visto na Foco. Cada campo tem uma **lista de valores comuns pra seleção rápida** (datalist), pra agilizar quando o valor for um dos preços padrão (ver seção 7)
8. Para cada tipo de chalé, o usuário também pode marcar **"Indisponível"** em vez de informar um valor — nesse caso a mensagem mostra "Indisponível" no lugar do preço
9. **Exceção à política de crianças**: se o usuário tentar editar/desbloquear manualmente um chalé com hidro que foi bloqueado pela política de crianças, um aviso rápido (toast/tooltip) aparece confirmando a ação, para evitar erro. Após confirmar, o campo fica editável normalmente.
10. A mensagem é montada automaticamente em tempo real (preview) conforme os campos são preenchidos, usando o template correspondente ao tipo de orçamento selecionado
11. Usuário clica em **"Copiar mensagem"** e cola no WhatsApp

## 5. Campos do formulário

| Campo | Tipo | Observação |
|---|---|---|
| Tipo de orçamento | Select/radio | "Padrão" ou "Day Use" — define horários e cabeçalho da mensagem |
| Data de check-in | Date picker | Formato dd/mm; usada também para calcular a quantidade de diárias |
| Data de check-out | Date picker | Formato dd/mm; usada também para calcular a quantidade de diárias |
| Quantidade de adultos | Number/select | Junto com crianças, define o total pro preenchimento automático, limites de ocupação e política de crianças |
| Quantidade de crianças | Number/select | Se > 0, bloqueia automaticamente os chalés com hidro (ver política de crianças) |
| Valor — Vista do lago (hidro maior) | Number/text com datalist + checkbox "Indisponível" | Auto-preenchido só quando 1-2 pessoas e 1-2 diárias (ver seção 7.1); fora disso, manual; bloqueado com "Não permite crianças" se houver criança; capacidade máx. 2 pessoas (aviso, sem bloqueio) |
| Valor — Hortênsia (hidro menor) | Number/text com datalist + checkbox "Indisponível" | Auto-preenchido só quando 1-2 pessoas e 1-2 diárias (ver seção 7.1); fora disso, manual; bloqueado com "Não permite crianças" se houver criança; capacidade máx. 2 pessoas (aviso, sem bloqueio) |
| Valor — Chalés sem hidro | Number/text com datalist + checkbox "Indisponível" | Auto-preenchido só quando 1-2 pessoas e 1-2 diárias (ver seção 7.1); fora disso, manual; não é afetado pela política de crianças; capacidade máx. 4 pessoas (aviso, sem bloqueio) |

Horários de entrada/saída são fixos conforme o tipo de orçamento selecionado (ver seção 6), não precisam de campo próprio.

### 5.1 Limites de ocupação por chalé

| Chalé | Capacidade máxima |
|---|---|
| Vista do lago (hidro maior) | 2 pessoas |
| Hortênsia (hidro menor) | 2 pessoas |
| Sem hidro | 4 pessoas (comporta de 3 a 4) |

Comportamento: é apenas um **aviso visual (toast/tooltip) informativo**, exibido quando o total de pessoas (adultos + crianças) excede a capacidade daquele chalé específico. **Não bloqueia** o preenchimento nem impede a geração da mensagem — é só um alerta pra chamar atenção do usuário antes de enviar um orçamento errado.

## 6. Templates da mensagem (reais, fornecidos pelo cliente)

Existem **dois tipos de orçamento**, com cabeçalho e horários diferentes, mas mesma estrutura de chalés.

### 6.1 Tipo "Padrão"

```
*ORÇAMENTO*

{data_checkin} a {data_checkout} ({qtd_pessoas} pessoas)
➡️Entrada: 14h
⬅️Saída: 12h

*CHALÉS COM HIDRO:*
*Vista do lago (hidro maior):* R$ {valor_vista_lago}
*Hortênsia (hidro menor):* R$ {valor_hortensia}

*CHALÉS SEM HIDRO:* R$ {valor_sem_hidro}
```

### 6.2 Tipo "Day Use com Chalé"

```
*ORÇAMENTO - DAY USE COM CHALÉ*

{data_checkin} a {data_checkout} ({qtd_pessoas} pessoas)
➡️Entrada: 09h
⬅️Saída: 17h

*CHALÉS COM HIDRO:*
*Vista do lago (hidro maior):* R$ {valor_vista_lago}
*Hortênsia (hidro menor):* R$ {valor_hortensia}

*CHALÉS SEM HIDRO:* R$ {valor_sem_hidro}
```

### 6.3 Regra de indisponibilidade

Quando um chalé é marcado como indisponível, o valor `R$ {valor}` daquela linha é substituído pela palavra **"Indisponível"**. Exemplo:

```
*Vista do lago (hidro maior):* Indisponível
```

### 6.4 Política de crianças

Chalés com hidro (Vista do lago e Hortênsia) **não são recomendados para crianças**. Regra:

- Se a quantidade de crianças informada for maior que zero, os campos "Vista do lago" e "Hortênsia" são **automaticamente bloqueados**
- Na mensagem final, o valor é substituído por **"Não permite crianças"** (em vez de "Indisponível"):

```
*Vista do lago (hidro maior):* Não permite crianças
```

- Essa é uma trava automática, não manual — diferente do checkbox "Indisponível" da seção 6.3
- O campo "Chalés sem hidro" nunca é afetado por essa regra
- **Exceção**: o usuário pode editar manualmente o campo mesmo bloqueado (para casos excepcionais). Ao tentar fazer isso, a interface deve mostrar um **aviso rápido (toast/tooltip)** alertando que aquele chalé foi bloqueado pela política de crianças, exigindo confirmação antes de liberar a edição

Observações de formatação:
- `*texto*` = negrito no WhatsApp (manter os asteriscos no texto final)
- Quantidade de pessoas exibida com 2 dígitos (ex: "02 pessoas") — soma de adultos + crianças
- Valores no formato R$ 850,00 (vírgula decimal, sem casas decimais desnecessárias além de duas)

## 7. Lista de valores predefinidos (datalist)

Não há mais tabela de preços por quantidade de pessoas. Em vez disso, os 3 campos de valor (Vista do lago, Hortênsia, Sem hidro) usam a **mesma lista de valores comuns**, exibida como sugestão rápida (datalist/autocomplete) — o usuário digita ou seleciona, e pode digitar qualquer outro valor não listado se necessário.

**Lista final, em ordem crescente:**

```
350, 490, 590, 700, 710, 750, 850, 980, 990, 1050, 1180, 1370, 1470, 1500, 1700, 1770, 2250, 2550
```

Origem dos valores (referência interna, não precisa aparecer no sistema):
- Base: 350, 490, 590, 750, 850
- Base × 2: 700, 980, 1180, 1500, 1700
- Base × 3: 1050, 1470, 1770, 2250, 2550
- Valores variados adicionais: 710, 980 (repetido), 990, 1370

### 7.1 Preenchimento automático (secundário)

Além do datalist, existe um **atalho de preenchimento automático** pros casos mais comuns. Ele só se aplica quando:

- Total de pessoas (adultos + crianças) = **1 ou 2**, **E**
- Quantidade de diárias (calculada a partir de check-in/check-out) = **1 ou 2**

Nesses casos, os 3 campos de valor são preenchidos automaticamente assim:

| Diárias | Sem hidro | Hortênsia | Vista do lago |
|---|---|---|---|
| 1 diária | R$ 490,00 | R$ 750,00 | R$ 850,00 |
| 2 diárias | R$ 980,00 | R$ 1.500,00 | R$ 1.700,00 |

Regras importantes:
- Fora dessas combinações (3+ pessoas ou 3+ diárias), **nenhum valor é preenchido automaticamente** — os campos ficam vazios, preenchimento manual via datalist
- O valor auto-preenchido continua **totalmente editável**
- Se houver criança (política de crianças), o bloqueio de "Vista do lago" e "Hortênsia" com "Não permite crianças" **tem prioridade** e sobrescreve o preenchimento automático
- Se o usuário marcar "Indisponível" manualmente, isso também sobrescreve o valor auto-preenchido

## 8. Requisitos técnicos

- HTML + CSS + JavaScript puro (sem frameworks, sem build step) — arquivo único ou poucos arquivos, fácil de abrir direto no navegador
- Sem backend, sem banco de dados
- Sem envio automático de WhatsApp (fora de escopo)
- Sem cálculo de preço "sob medida" (nada de fórmulas de precificação) nas abas de orçamento — o único cálculo automático delas é a quantidade de diárias (a partir das datas) e, com base nela, o preenchimento automático dos valores só no caso de 1-2 pessoas e 1-2 diárias (ver seção 7.1); fora disso, os valores são sempre digitados manualmente pelo usuário, com um datalist de sugestões rápidas. Na aba Day Use — Solicitação de Dados, há sim um cálculo automático de valor total (ver seção 11.3)
- Preview da mensagem atualizado em tempo real conforme o usuário preenche os campos
- Botão "Copiar mensagem" usando a Clipboard API do navegador
- Interface simples, funcional, pode ser usada no celular também (responsivo é desejável, não obrigatório)

## 9. Fora de escopo (nesta versão)

- Cadastro de múltiplos clientes via interface (estrutura de código deve permitir, mas não a UI)
- Envio automático de mensagem
- Cálculo automático de valores com regras de temporada/promoção
- Persistência de dados (histórico de orçamentos gerados)
- Autenticação de usuário

## 10. Prompt sugerido para o Antigravity

```
Crie uma ferramenta web (HTML + CSS + JS puro, sem backend, sem frameworks)
para gerar mensagens de orçamento formatadas para WhatsApp.

Campos do formulário:
- Tipo de orçamento: select/radio com duas opções, "Padrão" e "Day Use"
- Data de check-in (date picker)
- Data de check-out (date picker)
- Quantidade de adultos (number input ou select)
- Quantidade de crianças (number input ou select)
- Três campos de valor: "Vista do lago", "Hortênsia", "Sem hidro"
  (number/text, preenchimento manual, com um <datalist> de valores
  comuns pra sugestão/seleção rápida), cada um com um checkbox
  "Indisponível" ao lado

Lista de valores comuns pro datalist (mesma lista pros três campos,
em ordem crescente):
350, 490, 590, 700, 710, 750, 850, 980, 990, 1050, 1180, 1370, 1470,
1500, 1700, 1770, 2250, 2550

Comportamento:
- Calcular automaticamente a quantidade de diárias a partir da
  diferença entre check-in e check-out.
- PREENCHIMENTO AUTOMÁTICO (SECUNDÁRIO): quando o total de pessoas
  (adultos + crianças) for 1 ou 2 E a quantidade de diárias for 1 ou
  2, preencher automaticamente os três campos de valor:
    - 1 diária: Sem hidro = 490, Hortênsia = 750, Vista do lago = 850
    - 2 diárias: Sem hidro = 980, Hortênsia = 1500, Vista do lago = 1700
  Fora dessas combinações (3+ pessoas ou 3+ diárias), os campos
  ficam vazios (preenchimento manual via datalist). O valor
  auto-preenchido continua totalmente editável pelo usuário.
- Se o checkbox "Indisponível" de um chalé for marcado, a mensagem
  final mostra a palavra "Indisponível" no lugar do valor naquela
  linha (isso sobrescreve o preenchimento automático).

- POLÍTICA DE CRIANÇAS: se a quantidade de crianças for maior que
  zero, os campos "Vista do lago" e "Hortênsia" (chalés com hidro)
  devem ficar automaticamente bloqueados para edição — isso tem
  prioridade sobre o preenchimento automático — e a mensagem final
  deve mostrar "Não permite crianças" no lugar do valor naquela
  linha (em vez de "Indisponível"). O campo "Sem hidro" nunca é
  afetado por essa regra. Se o usuário tentar editar manualmente um
  campo bloqueado por essa política, mostrar um aviso rápido (toast)
  pedindo confirmação antes de liberar a edição (para casos de
  exceção).

- LIMITES DE OCUPAÇÃO: cada chalé tem uma capacidade máxima —
  "Vista do lago": 2 pessoas, "Hortênsia": 2 pessoas, "Sem hidro":
  4 pessoas. Se o total de pessoas (adultos + crianças) ultrapassar
  a capacidade de um chalé específico, exibir um aviso rápido (toast)
  próximo ao campo, algo como "Passou da quantidade de pessoas". Esse
  aviso é apenas informativo — NÃO bloqueia o campo nem impede a
  geração da mensagem.

- Um preview da mensagem final deve ser atualizado em tempo real
  conforme os campos são preenchidos, usando o template correspondente
  ao tipo de orçamento selecionado (Padrão ou Day Use).
- Um botão "Copiar mensagem" deve copiar o texto formatado para a
  área de transferência (Clipboard API).

Templates exatos das mensagens a serem geradas (manter formatação
markdown do WhatsApp com asteriscos para negrito):

--- Tipo "Padrão" ---
*ORÇAMENTO*

{data_checkin} a {data_checkout} ({qtd_pessoas} pessoas)
➡️Entrada: 14h
⬅️Saída: 12h

*CHALÉS COM HIDRO:*
*Vista do lago (hidro maior):* R$ {valor_vista_lago}
*Hortênsia (hidro menor):* R$ {valor_hortensia}

*CHALÉS SEM HIDRO:* R$ {valor_sem_hidro}

--- Tipo "Day Use com Chalé" ---
*ORÇAMENTO - DAY USE COM CHALÉ*

{data_checkin} a {data_checkout} ({qtd_pessoas} pessoas)
➡️Entrada: 09h
⬅️Saída: 17h

*CHALÉS COM HIDRO:*
*Vista do lago (hidro maior):* R$ {valor_vista_lago}
*Hortênsia (hidro menor):* R$ {valor_hortensia}

*CHALÉS SEM HIDRO:* R$ {valor_sem_hidro}

Regras de substituição do valor:
- Se marcado como indisponível: "R$ {valor}" vira "Indisponível"
- Se bloqueado pela política de crianças: "R$ {valor}" vira "Não
  permite crianças"

{qtd_pessoas} = total de adultos + crianças.

Formato de datas: dd/mm. Quantidade de pessoas com dois dígitos
(ex: "02 pessoas"). Valores no formato R$ 850,00.

Estruture o código de forma organizada (ex: separar dados/config de
lógica/UI) para facilitar a adição de outros clientes/templates no
futuro, mesmo que a interface de cadastro não seja implementada agora.

Interface simples e limpa, utilizável também em celular.
```

## 11. Aba 3 — "Day Use: Solicitação de Dados"

### 11.1 Objetivo

Diferente das duas abas de orçamento (que servem pra cotar valores pro hóspede), esta aba gera uma mensagem de **solicitação de dados**, enviada **depois** que o Day Use já foi confirmado — pra coletar nome, CPF e data de nascimento de cada pessoa da reserva.

### 11.2 Campos do formulário

| Campo | Tipo | Observação |
|---|---|---|
| Data | Date picker | Editável, formato dd/mm |
| Valor por pessoa | Select/radio | R$ 65,00 ou R$ 80,00 — **padrão: R$ 65,00** |
| Quantidade de adultos | Number/select | Inclui o titular (bloco 01) |
| Quantidade de crianças | Number/select | Dispara campos de idade (ver 11.4) |
| Idade de cada criança | Number, um campo por criança | Aparece dinamicamente conforme a "quantidade de crianças" é preenchida |
| Telefone (TEL) | Text, opcional | Fica abaixo dos campos acima; se preenchido, aparece no campo TEL: da mensagem; se vazio, o campo TEL: fica em branco (igual está hoje) |

### 11.3 Cálculo automático do valor total

```
VALOR = (quantidade de adultos + quantidade de crianças pagantes) × valor por pessoa
```

Esse é o único cálculo automático de valor em toda a ferramenta (as abas de orçamento não calculam nada). Ele deve recalcular em tempo real conforme adultos, crianças e idades são preenchidos.

### 11.4 Política de crianças (específica desta aba — diferente da política de crianças das abas de orçamento)

- **Adulto**: sempre paga o valor cheio (valor por pessoa selecionado)
- **Criança de 0 a 7 anos**: não paga (isenta) — **limitado a no máximo 2 crianças isentas por reserva**
- **A partir da 3ª criança de até 7 anos** (se houver): essa criança passa a ser **pagante**, como se fosse adulto
- **Criança de 8 anos ou mais**: sempre pagante, valor integral
- O status pagante/não pagante de cada criança é calculado **automaticamente** a partir da idade informada (respeitando o limite de 2 isentas), mas deve poder ser **alterado manualmente** pelo usuário se necessário (mesmo padrão de exceção editável usado nas outras políticas do sistema)
- Critério de desempate quando há mais de 2 crianças de até 7 anos: as **2 primeiras crianças inseridas** (na ordem dos campos) ficam isentas; as demais de até 7 anos ficam pagantes

### 11.5 Estrutura dos blocos numerados na mensagem

- **Bloco 01**: sempre o titular (adulto) — único bloco com campo EMAIL
- **Blocos seguintes de adultos**: NOME, CPF, NASCIMENTO (sem EMAIL)
- **Blocos de crianças**: aparecem **por último**, depois de todos os adultos, com estrutura reduzida:
  ```
  *NN - Criança*
  Pagante
  ```
  ou
  ```
  *NN - Criança*
  Não pagante
  ```
  (sem campos de NOME, CPF ou NASCIMENTO — esses dados de crianças não são coletados nesta mensagem)
- A numeração (01, 02, 03...) é sequencial considerando todos os blocos, adultos primeiro, crianças por último

### 11.6 Template exato da mensagem

```
*DADOS PARA DAY-USE*

DATA: {data}
VALOR: R$ {valor_total}
VALOR PAGO: 
TEL: {tel}

*01*
NOME:
CPF:
NASCIMENTO:
EMAIL:

*02*
NOME:
CPF:
NASCIMENTO:

*03 - Criança*
Não pagante

*04 - Criança*
Pagante
```

(Exemplo acima: 2 adultos + 2 crianças, sendo a primeira isenta e a segunda pagante — apenas ilustrativo, a quantidade de blocos varia conforme os campos preenchidos)

Observações:
- Os campos NOME, CPF, NASCIMENTO e EMAIL dos adultos ficam **sempre em branco** — são preenchidos manualmente pelo hóspede depois, o sistema só gera a estrutura
- VALOR PAGO fica **sempre em branco**
- TEL fica em branco se o campo não for preenchido no formulário; caso contrário, mostra o valor digitado
- Formato do valor: R$ 850,00 (vírgula decimal)

## 12. Prompt adicional para a aba Day Use — Solicitação de Dados

Este prompt complementa o da seção 10 (que cobre as duas abas de orçamento) — a ferramenta final deve ter as três abas juntas.

```
Adicione uma terceira aba chamada "Day Use - Solicitação de Dados" a essa
mesma ferramenta, com um formulário e uma mensagem completamente diferentes
das abas de orçamento (esta aba não é uma cotação, é uma coleta de dados
pós-confirmação).

Campos do formulário desta aba:
- Data (date picker)
- Valor por pessoa: select/radio com duas opções, R$ 65,00 e R$ 80,00
  (padrão: R$ 65,00)
- Quantidade de adultos (number input)
- Quantidade de crianças (number input) — ao preencher, exibir
  dinamicamente um campo de idade para cada criança
- Telefone (text, opcional) — posicionado abaixo dos campos acima

Comportamento:
- Calcular automaticamente o valor total em tempo real:
  VALOR = (quantidade de adultos + quantidade de crianças pagantes) ×
  valor por pessoa

- POLÍTICA DE CRIANÇAS DESTA ABA (diferente da política de crianças
  das abas de orçamento):
    - Adulto sempre paga o valor cheio
    - Criança de 0 a 7 anos não paga (isenta), limitado a no máximo
      2 crianças isentas por reserva — as duas primeiras crianças
      inseridas (na ordem dos campos) com idade até 7 anos ficam
      isentas; crianças adicionais de até 7 anos (3ª em diante)
      ficam pagantes
    - Criança de 8 anos ou mais sempre paga o valor cheio
    - O status pagante/não pagante de cada criança é calculado
      automaticamente a partir da idade, mas deve ser editável
      manualmente pelo usuário se necessário

- Gerar blocos numerados (01, 02, 03...) na mensagem, nesta ordem:
  primeiro todos os adultos (bloco 01 é sempre o titular), depois
  todas as crianças por último.
    - Bloco do titular (01): campos NOME, CPF, NASCIMENTO, EMAIL
      (todos em branco, para o hóspede preencher depois)
    - Blocos de outros adultos: campos NOME, CPF, NASCIMENTO (sem
      EMAIL), também em branco
    - Blocos de crianças: formato reduzido, apenas o rótulo
      "NN - Criança" seguido de "Pagante" ou "Não pagante" (sem
      NOME/CPF/NASCIMENTO)

- Preview da mensagem atualizado em tempo real
- Botão "Copiar mensagem" (Clipboard API), igual às outras abas

Template exato da mensagem (manter formatação markdown do WhatsApp
com asteriscos para negrito):

*DADOS PARA DAY-USE*

DATA: {data}
VALOR: R$ {valor_total}
VALOR PAGO: 
TEL: {tel}

*01*
NOME:
CPF:
NASCIMENTO:
EMAIL:

*02*
NOME:
CPF:
NASCIMENTO:

[... blocos de adultos adicionais no mesmo formato do bloco 02 ...]

*NN - Criança*
Pagante ou Não pagante

[... um bloco desses por criança ...]

Regras de formatação:
- Campo TEL: fica em branco se o telefone não for preenchido no
  formulário; caso contrário, mostra o valor digitado
- VALOR PAGO fica sempre em branco
- Valor no formato R$ 850,00 (vírgula decimal)
- Data no formato dd/mm
```

---

**Pendências:** nenhuma — escopo fechado. As três abas (Orçamento Padrão, Orçamento Day Use, e Day Use — Solicitação de Dados) estão completamente especificadas, com todas as regras de negócio, políticas de crianças e limites definidos.
