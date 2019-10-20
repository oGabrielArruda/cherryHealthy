$(document).ready(function () {
   start();

   $(".dia").click(function () {
      for (var i = 0; i < 7; i++) {
         $(".dia:eq(" + i + ")").removeClass("active");
      }
      $(this).addClass("active");
      var url = 'http://localhost:3000/dieta/';
      var dia = $(this).text().toLowerCase();
      var arr;
      $.getJSON(url, function (result) {
         arr = result;
         switch (dia) {
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
         M.textareaAutoResize($('#textarea1'));
      });
   });
});

function start() {
   var url = 'http://localhost:3000/dieta/';
   $.getJSON(url, function (result) {
      var arr = result;
      $("#textarea1").val(arr[0].seg);
   });
   M.textareaAutoResize($('#textarea1'));
}