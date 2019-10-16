$(document).ready(function(){
    M.textareaAutoResize($('#textarea1'));


    $(".dia").click(function(){
        for(var i = 0; i < 7; i++){
            $(".dia:eq("+i+")").removeClass("active");
        }
        $(this).addClass("active");

        var url = 'http://localhost:3000/dieta';
        var dia = $(this).text().toLowerCase();
        console.log(dia);
        $.getJSON(url, function(result){
            var arr = result;
            $("#textarea1").val(arr[0].dia);
        });
        
        switch(dia){
            case 'seg':
        }
    });
});