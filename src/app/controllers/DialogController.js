const axios = require("axios");
class DialogController {
  async dialog(req, res) {
    var host = "http://" + req.headers.host;
    //Intents e parametros:

    var intent = "Sugestões";
    var parametro = "";

    //Categoria - categorias;
    //CEP_participante - CEP;
    //Codigo_Produto - CodigoInterno;
    //CPF_participante - CPF;
    //Produtos - produtos;
    //Sugestões - sem parametros

    if (req.body.queryResult) {
      //const {
      //  intent,
      //  parameters,
      //  outputContexts,
      //  queryText
      //} = req.body.queryResult;
      intent = req.body.queryResult.intent.displayName;
      parametro = req.body.queryResult.parameters;
    }
    try {
      var payload = {};
      var resposta = "TESTE DE RESPOSTA";
      var mensagens = [];
      var response;

      if (intent == "CPF_participante") {
        var valor_CPF = parametro.CPF;
        response = await axios.get(`${host}/CPF/${valor_CPF}`);
        resposta = response.data;
      }

      if (intent == "Categoria") {
        var nome_categoria = parametro.categorias;
        response = await axios.get(`${host}/categoria/${nome_categoria}`);
        resposta = response.data;
      }

      if (intent == "Codigo_Produto") {
        //var codigo_produto = "902006683";
        var codigo_produto = parametro.CodigoInterno;
        response = await axios.get(`${host}/codigo/${codigo_produto}`);
        resposta = response.data;
      }

      if (intent == "Produtos") {
        //var nome_produto = "max steel";
        var nome_produto = parametro.produtos;
        response = await axios.get(`${host}/produto/${nome_produto}`);
        resposta = response.data;
      }

      if (intent == "Sugestões") {
        response = await axios.get(`${host}/sugestao`);
        resposta = response.data.text;
        mensagens = response.data.messages;
      }

      if (intent == "CEP_participante") {
        var valor_cep = parametro.CEP;
        response = await axios.get(`${host}/CEP/${valor_cep}`);
        resposta = response.data;
      }

      var retorno = { fulfillmentText: resposta, payload: payload };
      if (mensagens.length > 0) {
        retorno.fulfillmentMessages = mensagens;
      }

      return res.status(200).json(retorno);
    } catch (err) {
      //console.log("err: ", err);
      return res.status(200).json({
        fulfillmentText: "Desculpe, no momento nosso sistema está indisponível"
      });
    }
  }
}

module.exports = new DialogController();
