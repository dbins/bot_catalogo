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
    //CodigoTroca - codigo
    //StatusTroca - codigo
    //Cancelamento - codigo
    //Reclamacao - reclamacao - email
    //Faixa de Pontos - number1 - number2 - number3 - number4
    //Saldo - CPF
    //Contato - mensagem - email
    //Pesquisa - pesquisa
    //Valor - number1 - number 2
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

      if (intent == "Saldo") {
        var valor_CPF2 = parametro.CPF;
        response = await axios.get(`${host}/saldo/${valor_CPF2}`);
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
        resposta = response.data.text;
        mensagens = response.data.messages;
      }

      if (intent == "Produtos") {
        //var nome_produto = "max steel";
        var nome_produto = parametro.produtos;
        response = await axios.get(`${host}/produto/${nome_produto}`);
        resposta = response.data.text;
        mensagens = response.data.messages;
      }

      if (intent == "Pesquisa") {
        //var nome_produto = "max steel";
        var produto_informado = parametro.pesquisa;
        response = await axios.get(`${host}/produto/${produto_informado}`);
        resposta = response.data.text;
        mensagens = response.data.messages;
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

      if (intent == "Reclamacao") {
        var mensagem = parametro.reclamacao;
        var email = parametro.email;
        response = await axios.post(`${host}/reclamacao`, {
          mensagem: mensagem,
          email: email
        });
        resposta = response.data;
      }

      if (intent == "Contato") {
        var mensagem_contato = parametro.mensagem;
        var email_contato = parametro.email;
        response = await axios.post(`${host}/contato`, {
          mensagem: mensagem_contato,
          email: email_contato
        });
        resposta = response.data;
      }

      if (intent == "Valor") {
        var p_number1 = "";
        var p_number2 = "";
        var p_number3 = "";
        var p_number4 = "";

        if (parametro.number1) {
          p_number1 = parametro.number1;
        }
        if (parametro.number2) {
          p_number2 = parametro.number2;
        }
        response = await axios.post(`${host}/faixa`, {
          number1: p_number1,
          number2: p_number2,
          number3: p_number3,
          number4: p_number4
        });
        resposta = response.data;
      }

      if (intent == "Faixa de Pontos") {
        var number1 = "";
        var number2 = "";
        var number3 = "";
        var number4 = "";

        if (parametro.number1) {
          number1 = parametro.number1;
        }
        if (parametro.number2) {
          number2 = parametro.number2;
        }
        if (parametro.number3) {
          number3 = parametro.number3;
        }
        if (parametro.number4) {
          number4 = parametro.number4;
        }
        response = await axios.post(`${host}/faixa`, {
          number1: number1,
          number2: number2,
          number3: number3,
          number4: number4
        });
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
