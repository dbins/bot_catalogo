class Util {
  CEP(str) {
    var regiao = [
      "Grande São Paulo",
      "Interior de São Paulo",
      "Rio de Janeiro e Espírito Santo",
      "Minas Gerais",
      "Bahia e Sergipe",
      "Pernambuco, Alagoas, Paraíba e Rio Grande do Norte",
      "Ceará, Piauí, Maranhão, Pará, Amazonas, Acre, Amapá e Roraima",
      "Distrito Federal, Goiás, Tocantins, Mato Grosso, Mato Grosso do Sul e Rondônia",
      "Paraná e Santa Catarina",
      "Rio Grande do Sul"
    ];
    var posicao = str.charAt(0);
    return regiao[posicao];
  }

  checaCPF(CPF) {
    if (
      CPF.length !== 11 ||
      CPF === "00000000000" ||
      CPF === "11111111111" ||
      CPF === "22222222222" ||
      CPF === "33333333333" ||
      CPF === "44444444444" ||
      CPF === "55555555555" ||
      CPF === "66666666666" ||
      CPF === "77777777777" ||
      CPF === "88888888888" ||
      CPF === "99999999999" ||
      CPF === "01234567890"
    )
      return false;
    var soma = 0;
    for (var i = 0; i < 9; i++) soma += parseInt(CPF.charAt(i)) * (10 - i);
    var resto = 11 - (soma % 11);
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(CPF.charAt(9))) return false;
    soma = 0;
    for (i = 0; i < 10; i++) soma += parseInt(CPF.charAt(i)) * (11 - i);
    resto = 11 - (soma % 11);
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(CPF.charAt(10))) return false;

    return true;
  }
}

module.exports = new Util();
