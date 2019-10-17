$(document).ready(function(){
    M.textareaAutoResize($('#textarea1'));


    $(".dia").click(function(){
        for(var i = 0; i < 7; i++){
            $(".dia:eq("+i+")").removeClass("active");
        }
        $(this).addClass("active");
        var url = 'http://localhost:3000/dieta/';
        var dia = $(this).text().toLowerCase();
        var arr;
        $.getJSON(url, function(result){
            arr = result;        
            switch(dia){
                case 'seg':
                   $("#textarea1").val(arr[0].seg);
                case 'ter':
                   $("#textarea1").val(arr[0].ter);
                case 'qua':
                   $("#textarea1").val(arr[0].qua);
                case 'qui':
                   $("#textarea1").val(arr[0].qui);
                case 'sex':
                   $("#textarea1").val(arr[0].sex);
                case 'sab':
                   $("#textarea1").val(arr[0].sab);
                case 'dom':
                   $("#textarea1").val(arr[0].dom);
            }
        });
    });
});