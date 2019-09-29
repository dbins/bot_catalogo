const data = require("../../database/lista_produtos.json");
class ProdutosController {
  async categoria(req, res) {
    var resultado = "categoria";
    var categoria_selecionada = req.params.nome;
    categoria_selecionada = categoria_selecionada.toLowerCase();
    var nome_categoria_resposta = "";
    var tmp_array = [];
    var total = 0;
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
    var item = data[(data.length * Math.random()) | 0];
    var resposta = item.pro_descricao + " por " + item.pontos + " pontos!";
    return res.status(200).json(resposta);
  }

  async produto(req, res) {
    var resultado = "produto";
    var nome_produto_selecionado = req.params.nome;
    nome_produto_selecionado = nome_produto_selecionado.toLowerCase();
    var tmp_array = [];
    var total = 0;
    for (var i = 0; i < data.length; i++) {
      var nome_produto = data[i].pro_descricao.toLowerCase();
      if (nome_produto.includes(nome_produto_selecionado)) {
        resultado = data[i].pro_descricao;
        tmp_array.push(data[i]);
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

    return res.status(200).json(resultado);
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
        nome_produto = data[i].pro_descricao;
        var tmp = {
          card: {
            title: data[i].pro_descricao,
            subtitle: data[i].pontos + " pontos",
            imageUri:
              "http://www.plataformaomnion.com.br/catalogo/padrao/" +
              data[i].imagem
          }
        };
        messages.push(tmp);
      }
    }
    var retorno = { text: nome_produto, messages: messages };
    res.send(retorno);
  }
}

module.exports = new ProdutosController();
