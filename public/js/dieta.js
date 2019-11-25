$(document).ready(function () {
   start(); // ajusta o design para quando entrar na página

   $(".dia").click(function () { // click do dia
      for (var i = 0; i < 7; i++) {
         $(".dia:eq(" + i + ")").removeClass("active");
      } // remove-se o ativo dos botões de dia
      $(this).addClass("active"); // adiciona o efeito de ativo só para o botão clickado
      var url = 'http://localhost:3000/dieta/';
      var dia = $(this).text().toLowerCase();
      var arr;
      $.getJSON(url, function (result) { // pega-se o json com todas as dietas
         arr = result;
         switch (dia) { // switch para cada dia foi selecionado -> para cada dia diferente, exibe a dieta do respecitivo dia
            case 'seg':
               $("#textarea1").val(arr[0].seg);
               break;
            case 'ter':
               $("#textarea1").val(arr[0].ter);
               break;
            case 'qua':
               $("#textarea1").val(arr[0].qua);
               break;
            case 'qui':
               $("#textarea1").val(arr[0].qui);
               break;
            case 'sex':
               $("#textarea1").val(arr[0].sex);
               break;
            case 'sab':
               $("#textarea1").val(arr[0].sab);
               break;
            case 'dom':
               $("#textarea1").val(arr[0].dom);
         }
         M.textareaAutoResize($('#textarea1')); // ao inserir os valores, ajustamos o tamanho da textarea
      });
   });
});

function start() { // exibe o valor da dieta na segunda feira, que é o dia inicial exibido
   var url = 'http://localhost:3000/dieta/';
   $.getJSON(url, function (result) {
      var arr = result;
      $("#textarea1").val(arr[0].seg);
   });
   M.textareaAutoResize($('#textarea1'));
}