const { banco } = require('./bancodedados');

const validarSenha = (req, res, next) => {
    const { senha_banco } = req.query
    
    if (!senha_banco) {
        return res.status(400).json({ mensagem: "Senha é obrigatoria"})
    }

    if (senha_banco !== banco.senha) {
        return res.status(400).json({ mensagem: "Senha invalida"})
    }

    next()
}

module.exports = {
   validarSenha
}