const express = require('express');
const controles = require('./controladora')
const { validarSenha } = require('./intermediario')

const rotas = express()

rotas.get('/contas', validarSenha, controles.listarContas)
rotas.post('/contas', controles.criarConta)
rotas.put('/contas/:numeroConta/usuario', controles.atualizarUsuario)
rotas.delete('/contas/:numeroConta', controles.excluirConta)
rotas.post('/transacoes/depositar', controles.transicaoDepositar)
rotas.post('/transacoes/sacar', controles.transacaoSacar)
rotas.post('/transacoes/transferir', controles.transacaoTransferir)
rotas.get('/contas/saldo', controles.listarSaldo)
rotas.get('/contas/extrato', controles.extrato)

module.exports = {
    rotas
}