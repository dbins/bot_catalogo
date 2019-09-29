const axios = require("axios");
const xml2js = require("xml2js");
const util = require("../util/util");
class CEPController {
  async pesquisar(req, res) {
    //var CEP_Digitado = "01532001";
    var CEP_Digitado = req.params.cep;
    var regiao = util.CEP(CEP_Digitado);
    var response = await axios.get(
      `http://cep.republicavirtual.com.br/web_cep.php?cep=${CEP_Digitado}`
    );
    //"resultado":"1","resultado_txt":"sucesso - cep completo","uf":"RS","cidade":"Porto Alegre","bairro":"Passo D'Areia","tipo_logradouro":"Avenida","logradouro":"Assis Brasil"}
    var resposta =
      "Parece que você digitou um CEP.... Não localizei este número....";
    var parser = new xml2js.Parser();
    var objeto_cep = await new Promise((resolve, reject) =>
      parser.parseString(response.data, (err, result) => {
        if (err) reject(err);
        else resolve(result);
      })
    );
    var resposta_cep = objeto_cep.webservicecep;

    if (resposta_cep.uf) {
      var logradouro = "";
      var bairro = "";
      var estado = resposta_cep.uf[0];
      var cidade = resposta_cep.cidade[0];
      if (resposta_cep.bairro[0]) {
        bairro = resposta_cep.bairro[0];
      }
      if (resposta_cep.logradouro[0]) {
        logradouro = resposta_cep.logradouro[0];
      }

      var retorno_cep = "Os dados localizados foram:" + "\n";
      retorno_cep += "Logradouro:" + logradouro + "\n";
      retorno_cep += "Bairro:" + bairro + "\n";
      retorno_cep += "Cidade:" + cidade + "\n";
      retorno_cep += "UF:" + estado + "\n";
      resposta =
        "Parece que você digitou um CEP... Este CEP parece ser da " +
        regiao +
        "..." +
        retorno_cep;
    }
    res.send(resposta);
  }
}

module.exports = new CEPController();
