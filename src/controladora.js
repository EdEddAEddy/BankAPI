const dados = require('./bancodedados')
const { format } = require('date-fns')

let id = 0

function gerarId() {
    id++
    return String(id)
}

const listarContas = (req, res) => {
    res.status(200).json(dados.contas)
}

const criarConta = (req, res) => {
    const info = req.body


    if (!info.nome) {
        return res.status(400).json({ mensagem: "Nome é um campo obrigatorio" })
    }

    if (info.nome.trim() === '') {
        return res.status(400).json({ mensagem: "Nome invalido" })
    }

    if (!info.data_nascimento) {
        return res.status(400).json({ mensagem: "Data de nascimento é um campo obrigatorio" })
    }

    if (info.data_nascimento.trim() === '') {
        return res.status(400).json({ mensagem: "Data de nascimento invalido" })
    }

    if (!info.telefone) {
        return res.status(400).json({ mensagem: "Telefone é um campo obrigatorio" })
    }

    if (info.telefone.trim() === '') {
        return res.status(400).json({ mensagem: "Telefone invalido" })
    }

    if (!info.senha) {
        return res.status(400).json({ mensagem: "Senha é um campo obrigatorio" })
    }

    if (info.senha.trim() === '') {
        return res.status(400).json({ mensagem: "Senha invalido" })
    }

    if (!info.cpf) {
        return res.status(400).json({ mensagem: "CPF é um campo obrigatorio" })
    }

    const cpfInvalido = dados.contas.some((el) => {
        return el.usuario.cpf === info.cpf
    })

    if (cpfInvalido) {
        return res.status(400).json({ mensagem: "CPF já utilizado" })
    }

    if (!info.email) {
        return res.status(400).json({ mensagem: "Email é um campo obrigatorio" })
    }

    const emailInvalido = dados.contas.some((el) => {
        return el.usuario.email === info.email
    })

    if (emailInvalido) {
        return res.status(400).json({ mensagem: "Email já utilizado" })
    }

    const novoUsuario = {
        numero: gerarId(),
        saldo: 0,
        usuario: {
            nome: info.nome,
            cpf: info.cpf,
            data_nascimento: info.data_nascimento,
            telefone: info.telefone,
            email: info.email,
            senha: info.senha
        }
    }

    dados.contas.push(novoUsuario)

    res.status(201).json(novoUsuario)
}

const atualizarUsuario = (req, res) => {
    const { numeroConta } = req.params
    const info = req.body

    if (Object.keys(info).length === 0) {
        return res.status(400).json({ mensagem: "Nenhuma informação adicionada" })
    }

    const conta = dados.contas.find((el) => {
        return el.numero === numeroConta
    })

    if (conta === undefined) {
        return res.status(400).json({ mensagem: "Nenhuma conta encontrada" })
    }

    if (info.cpf) {
        const cpfInvalido = dados.contas.some((el) => {
            return el.usuario.cpf === info.cpf
        })

        if (cpfInvalido) {
            return res.status(400).json({ mensagem: "CPF já utilizado" })
        }

        conta.usuario.cpf = info.cpf
    }

    if (info.email) {
        const emailInvalido = dados.contas.some((el) => {
            return el.usuario.email === info.email
        })

        if (emailInvalido) {
            return res.status(400).json({ mensagem: "Email já utilizado" })
        }

        conta.usuario.email = info.email
    }

    if (info.nome) {
        conta.usuario.nome = info.nome
    }

    if (info.data_nascimento) {
        conta.usuario.data_nascimento = info.data_nascimento
    }

    if (info.telefone) {
        conta.usuario.data_nascimento = info.telefone
    }

    if (info.senha) {
        conta.usuario.senha = info.senha
    }

    res.status(201).json({ mensagem: "Conta atualizada com sucesso" })

}

const excluirConta = (req, res) => {
    const { numeroConta } = req.params

    const indexConta = dados.contas.findIndex((el) => {
        return el.numero === numeroConta
    })

    if (indexConta === -1) {
        return res.status(400).json({ mensagem: "Nenhuma conta encontrada" })
    }

    if (dados.contas[indexConta].saldo !== 0) {
        return res.status(400).json({ mensagem: "Saldo deve estar zerado para excluir conta" })
    }

    dados.contas.splice(indexConta, 1)

    res.status(203).json({ mensagem: "Conta excluída com sucesso" })

}

const transicaoDepositar = (req, res) => {
    const { numero_conta, valor } = req.body

    if (!numero_conta) {
        return res.status(400).json({ mensagem: "Número da conta é obrigatorio" })
    }

    const indexConta = dados.contas.findIndex((el) => {
        return el.numero === numero_conta
    })

    if (indexConta === -1) {
        return res.status(400).json({ mensagem: "Número da conta informado não existe" })
    }

    if (!valor) {
        return res.status(400).json({ mensagem: "Valor do deposito é obrigatorio" })
    }

    if (valor <= 0) {
        return res.status(400).json({ mensagem: "Valor invalido" })
    }

    const novoDeposito = {
        data: format(new Date(), 'yyyy-MM-dd HH:mm:ss'),
        numero_conta: dados.contas[indexConta].numero,
        valor: Number(valor)
    }

    dados.contas[indexConta].saldo += Number(valor)

    dados.depositos.push(novoDeposito)

    return res.status(200).json({ mensagem: "Depósito realizado com sucesso" })

}

const transacaoSacar = (req, res) => {
    const { numero_conta, valor, senha } = req.body

    if (!numero_conta) {
        return res.status(400).json({ mensagem: "Número da conta é obrigatorio" })
    }

    if (!valor) {
        return res.status(400).json({ mensagem: "Valor de saque é obrigatio" })
    }

    if (!senha) {
        return res.status(400).json({ mensagem: "Senha da conta é obrigatorio" })
    }

    const indexConta = dados.contas.findIndex((el) => {
        return el.numero === numero_conta
    })

    if (indexConta === -1) {
        return res.status(400).json({ mensagem: "Número da conta informado não existe" })
    }

    if (senha !== dados.contas[indexConta].usuario.senha) {
        return res.status(400).json({ mensagem: "Senha invalida" })
    }

    if (valor > dados.contas[indexConta].saldo || valor <= 0) {
        return res.status(400).json({ mensagem: "Valor indisponivel" })
    }

    const novoSaque = {
        data: format(new Date(), 'yyyy-MM-dd HH:mm:ss'),
        numero_conta: dados.contas[indexConta].numero,
        valor: Number(valor)
    }

    dados.contas[indexConta].saldo -= Number(valor)

    dados.saques.push(novoSaque)

    return res.status(200).json({ mensagem: "Saque realizado com sucesso" })
}

const transacaoTransferir = (req, res) => {
    const { numero_conta_origem, numero_conta_destino, valor, senha } = req.body

    if (!numero_conta_origem) {
        return res.status(400).json({ mensagem: "Numero da conta de origem é obrigatorio" })
    }

    if (!numero_conta_destino) {
        return res.status(400).json({ mensagem: "Numero da conta de destino é obrigatorio" })
    }

    const indexContaOrigem = dados.contas.findIndex((el) => {
        return el.numero === numero_conta_origem
    })

    const indexContaDestino = dados.contas.findIndex((el) => {
        return el.numero === numero_conta_destino
    })

    if (indexContaOrigem === -1) {
        return res.status(400).json({ mensagem: "Conta de origem não existe" })
    }

    if (indexContaDestino === -1) {
        return res.status(400).json({ mensagem: "Conta de destino não existe" })
    }

    if (indexContaOrigem === indexContaDestino) {
        return res.status(400).json({ mensagem: "Conta de origem não pode ser a mesma de destino" })
    }

    if (senha !== dados.contas[indexContaOrigem].usuario.senha) {
        return res.status(400).json({ mensagem: "Senha invalida" })
    }

    if (valor > dados.contas[indexContaOrigem].saldo || valor <= 0) {
        return res.status(400).json({ mensagem: "Valor indisponivel" })
    }

    dados.contas[indexContaOrigem].saldo -= Number(valor)
    dados.contas[indexContaDestino].saldo += Number(valor)

    const novaTransferencia = {
        data: format(new Date(), 'yyyy-MM-dd HH:mm:ss'),
        numero_conta_origem: dados.contas[indexContaOrigem].numero,
        numero_conta_destino: dados.contas[indexContaDestino].numero,
        valor
    }

    dados.transferencias.push(novaTransferencia)

    return res.status(200).json({ mensagem: "Transferencia realizado com sucesso" })

}

const listarSaldo = (req, res) => {
    const { numero_conta, senha } = req.query

    if (!numero_conta) {
        return res.status(400).json({ mensagem: "Número da conta invalido" })
    }

    if (!senha) {
        return res.status(400).json({ mensagem: "Senha invalida" })
    }

    const indexConta = dados.contas.findIndex((el) => {
        return el.numero === numero_conta
    })

    if (indexConta === -1) {
        return res.status(400).json({ mensagem: "Conta não existe" })
    }

    if (senha !== dados.contas[indexConta].usuario.senha) {
        return res.status(400).json({ mensagem: "Senha invalida" })
    }

    res.status(200).json({ saldo: dados.contas[indexConta].saldo })
}

const extrato = (req, res) => {
    const { numero_conta, senha } = req.query

    if (!numero_conta) {
        res.status(400).json({ mensagem: "Número da conta é obrigatorio" })
    }

    if (!senha) {
        res.status(400).json({ mensagem: "Senha é obrigatorio" })
    }

    const indexConta = dados.contas.findIndex((el) => {
        return el.numero === numero_conta
    })

    if (indexConta === -1) {
        return res.status(400).json({ mensagem: "Conta não existe" })
    }

    if (senha !== dados.contas[indexConta].usuario.senha) {
        return res.status(400).json({ mensagem: "Senha invalida" })
    }

    const extratoDeposito = dados.depositos.filter((el) => {
        return el.numero_conta === numero_conta
    })

    const extratoSaque = dados.saques.filter((el) => {
        return el.numero_conta === numero_conta
    })

    const extratoTransferenciaEnviada = dados.transferencias.filter((el) => {
        return el.numero_conta_origem === numero_conta
    })

    const extratoTransferenciaRecebida = dados.transferencias.filter((el) => {
        return el.numero_conta_destino === numero_conta
    })


    const extrato = { 
        depositos: [...extratoDeposito], 
        saques: [...extratoSaque], 
        transferenciasEnviadas: [...extratoTransferenciaEnviada], 
        transferenciasRecebidas: [...extratoTransferenciaRecebida]
    }

    res.status(200).json(extrato)

}

module.exports = {
    listarContas,
    criarConta,
    atualizarUsuario,
    excluirConta,
    transicaoDepositar,
    transacaoSacar,
    transacaoTransferir,
    listarSaldo,
    extrato
}