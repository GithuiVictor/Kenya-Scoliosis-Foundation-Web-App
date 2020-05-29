

$(document).ready(function(){

    window.sr = ScrollReveal({duration : 1000});
        sr.reveal('.carousel-indicators, .carousel-inner .active .carousel-caption');

    //Home Page
    $('.section-5 .details').hide();    

    $('.section-5 .card-1').mouseenter(function(){
        $('.section-5 .card-1 .card-img-top').slideUp();
        $('.section-5 .card-1 .details').slideDown();
        $('.section-5 .card-1 .details').show();
    });

    $('.section-5 .card-1').mouseleave(function(){
        $('.section5 .card-1 .details').slideUp();
        $('.section-5 .card-1 .details').hide();
        $('.section-5 .card-1 .card-img-top').slideDown();
    });

    $('.section-5 .card-2').mouseenter(function(){
        $('.section-5 .card-2 .card-img-top').slideUp();
        $('.section-5 .card-2 .details').slideDown();
        $('.section-5 .card-2 .details').show();
    });

    $('.section-5 .card-2').mouseleave(function(){
        $('.section5 .card-2 .details').slideUp();
        $('.section-5 .card-2 .details').hide();
        $('.section-5 .card-2 .card-img-top').slideDown();
        
    });

    $('.section-5 .card-3').mouseenter(function(){
        $('.section-5 .card-3 .card-img-top').slideUp();
        $('.section-5 .card-3 .details').slideDown();
        $('.section-5 .card-3 .details').show();
    });

    $('.section-5 .card-3').mouseleave(function(){
        $('.section5 .card-3 .details').slideUp();
        $('.section-5 .card-3 .details').hide();
        $('.section-5 .card-3 .card-img-top').slideDown();
    });

});  