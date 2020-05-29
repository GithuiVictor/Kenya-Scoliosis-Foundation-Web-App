$(document).ready(function(){
    $("#creditCardAmount").keyup(function(){
        $('#creditCardDonate-btn').html('Donate $' +$('#creditCardAmount').val())
    });

    $('#amount').keyup(function(){
        $('#mpesaAmount').html('"KES ' +$('#amount').val()+'"')
    });

    
});