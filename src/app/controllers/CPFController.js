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
}

module.exports = new CPFController();
