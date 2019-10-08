$(document).ready(function(){
    M.textareaAutoResize($('#textarea1'));


    $(".dia").click(function(){
        for(var i = 0; i < 7; i++){
            $(".dia:eq("+i+")").removeClass("active");
        }
        $(this).addClass("active");

        /* node */
    });
});