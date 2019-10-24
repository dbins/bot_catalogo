const util = require("../util/util");

class CPFController {
  async validar(req, res) {
    //var CPF = "44444444444";
    var CPF = req.params.cpf;
    var resposta = "CPF";
    if (util.checaCPF(CPF)) {
      resposta = "CPF válido";
    } else {
      resposta = "CPF inválido";
    }
    res.send(resposta);
  }

  async saldo(req, res) {
    var CPF = req.params.cpf;
    var resposta = "CPF";
    if (util.checaCPF(CPF)) {
      var valor_inicial = 1000;
      var valor_final = 8000;
      var pontos = Math.floor(
        Math.random() * (valor_final - valor_inicial) + valor_inicial
      );
      resposta = "Sua pontuacao atual e de " + pontos + " pontos";
    } else {
      resposta = "CPF inválido";
    }
    res.send(resposta);
  }
}

module.exports = new CPFController();
