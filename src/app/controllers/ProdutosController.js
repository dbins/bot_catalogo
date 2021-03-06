const axios = require("axios");
const FormData = require("form-data");
const data = require("../../database/lista_produtos.json");
class ProdutosController {
  async categoria(req, res) {
    var resultado = "categoria";
    var categoria_selecionada = req.params.nome;
    categoria_selecionada = categoria_selecionada.toLowerCase();
    var nome_categoria_resposta = "";
    var tmp_array = [];
    for (var i = 0; i < data.length; i++) {
      var nome_categoria = data[i].categoria.toLowerCase();
      if (nome_categoria.includes(categoria_selecionada)) {
        nome_categoria_resposta = nome_categoria;
        tmp_array.push(data[i]);
      }
    }
    if (tmp_array.length == 0) {
      resultado = "Não existem resultados para a categoria informada";
    } else {
      resultado =
        "Existem " +
        tmp_array.length +
        " produtos na categoria " +
        nome_categoria_resposta;
    }
    res.send(resultado);
  }

  async sugestao(req, res) {
    var messages = [];
    var item = data[(data.length * Math.random()) | 0];
    var resposta = item.pro_descricao + " por " + item.pontos + " pontos!";
    var tmp = {
      text: {
        text: [item.pro_descricao + " - " + item.pontos + " pontos"]
      }
    };
    var tmp2 = {
      card: {
        title: item.pro_descricao,
        subtitle: item.pontos + " pontos",
        imageUri:
          "http://www.plataformaomnion.com.br/catalogo/padrao/" + item.imagem
      }
    };
    messages.push(tmp);
    messages.push(tmp2);
    var retorno = { text: resposta, messages: messages };
    return res.status(200).json(retorno);
  }

  async produto(req, res) {
    var resultado = "produto";
    var messages = [];
    var nome_produto_selecionado = req.params.nome;
    nome_produto_selecionado = nome_produto_selecionado.toLowerCase();
    var tmp_array = [];
    for (var i = 0; i < data.length; i++) {
      var nome_produto = data[i].pro_descricao.toLowerCase();
      if (nome_produto.includes(nome_produto_selecionado)) {
        resultado = data[i].pro_descricao + " - " + data[i].pontos + " pontos";
        tmp_array.push(data[i]);
        var tmp = {
          text: {
            text: [data[i].pro_descricao + " - " + data[i].pontos + " pontos"]
          }
        };
        var tmp2 = {
          card: {
            title: data[i].pro_descricao,
            subtitle: data[i].pontos + " pontos",
            imageUri:
              "http://www.plataformaomnion.com.br/catalogo/padrao/" +
              data[i].imagem
          }
        };
        messages.push(tmp);
        messages.push(tmp2);
      }
    }
    if (tmp_array.length == 0) {
      resultado = "Não existem produtos com o critério informado";
    } else {
      if (tmp_array.length == 1) {
        //O nome já foi selecionado...
      } else {
        resultado =
          "Existem " +
          tmp_array.length +
          " produtos. Por favor melhor a sua pesquisa";
      }
    }

    const nomes_produtos = tmp_array.map(({ pro_descricao }) => pro_descricao);
    if (tmp_array.length > 1) {
      resultado +=
        "Os produtos encontrados foram: " + nomes_produtos.join(", ");
    }
    var resposta = { text: resultado, messages: messages };
    return res.status(200).json(resposta);
  }

  async codigo(req, res) {
    //var codigo = "902006683";
    var codigo = req.params.codigo_produto;
    var messages = [];
    //"card": {
    //  "title": "card title",
    //  "subtitle": "card text",
    //  "imageUri": "https://assistant.google.com/static/images/molecule/Molecule-Formation-stop.png",
    //  "buttons": [
    //    {
    //      "text": "button text",
    //      "postback": "https://assistant.google.com/"
    //    }
    //  ]
    //}
    var nome_produto = "Produto não encontrado";
    for (var i = 0; i < data.length; i++) {
      if (data[i].pro_cod_ext1 == codigo) {
        nome_produto =
          data[i].pro_descricao + " - " + data[i].pontos + " pontos";
        var tmp = {
          text: {
            text: [data[i].pro_descricao + " - " + data[i].pontos + " pontos"]
          }
        };
        var tmp2 = {
          card: {
            title: data[i].pro_descricao,
            subtitle: data[i].pontos + " pontos",
            imageUri:
              "http://www.plataformaomnion.com.br/catalogo/padrao/" +
              data[i].imagem
          }
        };
        messages.push(tmp);
        messages.push(tmp2);
      }
    }
    var retorno = { text: nome_produto, messages: messages };
    res.send(retorno);
  }
  async reclamacao(req, res) {
    var email = req.body.email;
    var mensagem = req.body.mensagem;
    var params = new FormData();
    params.append("email", email);
    params.append("mensagem", mensagem);
    const headers = {
      ...params.getHeaders(),
      "Content-Length": params.getLengthSync()
    };
    var response = await axios.post(
      "http://www.dbins.com.br/ferramentas/botcatalogo/index.php",
      params,
      { headers }
    );
    var retorno = "Sua mensagem foi enviada com sucesso!";
    if (response.data == "OK") {
      retorno = "Sua mensagem foi enviada com sucesso!";
    }
    res.status(200).send(retorno);
  }
  async faixa(req, res) {
    console.log("rota faixa");
    var number1 = "";
    var number2 = "";
    var number3 = "";
    var number4 = "";

    if (req.body.number1) {
      number1 = req.body.number1;
    }
    if (req.body.number2) {
      number2 = req.body.number2;
    }
    if (req.body.number3) {
      number3 = req.body.number3;
    }
    if (req.body.number4) {
      number4 = req.body.number4;
    }
    var tipo_pesquisa = "";
    var resultado = "";

    if (number1 != "") {
      if (number2 != "") {
        tipo_pesquisa = "INTERVALO";
      }
    }

    if (number3 != "") {
      tipo_pesquisa = "MENOR";
    }

    if (number4 != "") {
      tipo_pesquisa = "MAIOR";
    }

    var tmp_array = [];
    for (var i = 0; i < data.length; i++) {
      if (tipo_pesquisa === "INTERVALO") {
        if (parseInt(data[i].pontos) > parseInt(number1)) {
          if (parseInt(data[i].pontos) < parseInt(number2)) {
            tmp_array.push(data[i]);
          }
        }
      }
      if (tipo_pesquisa === "MENOR") {
        if (parseInt(data[i].pontos) < parseInt(number3)) {
          tmp_array.push(data[i]);
        }
      }
      if (tipo_pesquisa === "MAIOR") {
        if (parseInt(data[i].pontos) > parseInt(number4)) {
          tmp_array.push(data[i]);
        }
      }
    }

    if (tmp_array.length == 0) {
      resultado = "Não existem produtos com os valores de pontos solicitados";
    } else {
      if (tmp_array.length == 1) {
        resultado =
          "Com a pontuação solicitada eu encontrei o produto " +
          tmp_array[0].pro_descricao +
          " " +
          tmp_array[0].pontos;
      } else {
        resultado =
          "Existem " +
          tmp_array.length +
          " produtos com a pontuação informada. Por favor melhore a sua pesquisa";
      }
    }
    res.status(200).send(resultado);
  }
  async contato(req, res) {
    var email = req.body.email;
    var mensagem = req.body.mensagem;
    var params = new FormData();
    params.append("email", email);
    params.append("mensagem", mensagem);
    const headers = {
      ...params.getHeaders(),
      "Content-Length": params.getLengthSync()
    };
    var response = await axios.post(
      "http://www.dbins.com.br/ferramentas/botcatalogo/index.php",
      params,
      { headers }
    );
    var retorno = "Sua mensagem foi enviada com sucesso!";
    if (response.data == "OK") {
      retorno = "Sua mensagem foi enviada com sucesso!";
    }
    res.status(200).send(retorno);
  }
}

module.exports = new ProdutosController();
