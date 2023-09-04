
# Bank API

O Bank API é uma aplicação que simula um banco virtual com um banco de dados fictício. Ele fornece endpoints para criar contas bancárias, realizar transações, verificar saldos e obter extratos de contas.


## Pré-requisitos

Antes de começar, você precisa ter o Node.js instalado em sua máquina.
## Instalação

1. Clone o repositório para a sua máquina local:

```bash
git clone git@github.com:EdEddAEddy/BankAPI.git
```

2. Navegue até o diretório do projeto:

3. Instale as dependências do projeto:
```bash
npm install
```

4. Inicie o servidor:
```bash
npm run dev
```
O servidor estará em execução na porta 3000.

## Endpoints

#### `GET` `/contas` - `Listar Contas`
Retorna a lista de todas as contas bancárias.
#### `POST` `/contas` - `Criar Conta`
Cria uma nova conta bancária. Deve fornecer os detalhes do titular da conta, como nome, data de nascimento, telefone, senha, CPF e email.
#### `PUT` `/contas/:numeroConta/usuario` - `Atualizar Usuário`
Atualiza as informações do titular da conta com base no número da conta fornecido nos parâmetros. Você pode atualizar o nome, CPF, data de nascimento, telefone, email e senha.
#### `DELETE` `/contas/:numeroConta` - `Excluir Conta`
Exclui uma conta bancária com base no número da conta fornecido nos parâmetros. A conta deve ter um saldo zero para ser excluída.
#### `POST` `/transacoes/depositar` - `Realizar Depósito`
Realiza um depósito em uma conta bancária. Você deve fornecer o número da conta e o valor do depósito.
#### `POST` `/transacoes/sacar` - `Realizar Saque`
Realiza um saque de uma conta bancária. Você deve fornecer o número da conta, o valor do saque e a senha da conta.
#### `POST` `/transacoes/transferir` - `Realizar Transferência`
Realiza uma transferência entre duas contas bancárias. Você deve fornecer o número da conta de origem, o número da conta de destino, o valor da transferência e a senha da conta de origem.
#### `GET` `/contas/saldo` - `Listar Saldo`
Retorna o saldo de uma conta bancária. Você deve fornecer o número da conta e a senha da conta nos parâmetros.
#### `GET` `/contas/extrato` - `Obter Extrato`
Retorna o extrato de uma conta bancária. Você deve fornecer o número da conta e a senha da conta nos parâmetros

## Como Usar
Você pode usar uma ferramenta como o Postman ou realizar chamadas HTTP diretas para interagir com a API e realizar operações bancárias simuladas.
