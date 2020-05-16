

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

    //Donation Page
    (function donateAmount(){
        var amountEntered = document.getElementsByClassName("amount").value;
        document.getElementsByClassName("donate-btn").innerHTML="Donate KES "+amountEntered;
    });

    //Admin Log in
    (function logInValidation(){
        var userName = document.getElementById("userName").value;
        var passWord = document.getElementById("password").value;
        var uName = /^([a-zA-Z0-9\.-_]+)@([a-zA-Z0-9-]+).([a-z]{2-10})(.[a-z]{2-10})?$/;
        if(uName.test(userName)){
            return true;
        }else{
            alert("Invalid UserName")
            return false;
        }
    });

    //Admin Side
    (function(){
        $('[data-toggle="tooltip"]').tooltip();
    });

    (function(d, s, id) {
        var js, fjs = d.getElementsByTagName(s)[0];
        if (d.getElementById(id)) return;
        js = d.createElement(s); js.id = id;
        js.src = "https://connect.facebook.net/en_US/sdk.js#xfbml=1&version=v3.0";
        fjs.parentNode.insertBefore(js, fjs);
      }(document, 'script', 'facebook-jssdk'));
});