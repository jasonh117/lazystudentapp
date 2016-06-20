/**
 * Created by JasonHsieh on 6/14/16.
 */

var editCardContainer;
var cards = [];

$(function() {
    editCardContainer = $('#edit_card');

    $('#add_card_btn').on('click', function() {
        editCardContainer.removeClass('hide');
    });

    $('.cancel_button').on('click', function() {
        $('.card').addClass('hide');
    });

    $('#save_button').on('click', function() {
        if ($('#new_card_title')[0].value === "")
            $('#new_card_title')[0].value = "No Title";
        
        var new_card=" ";
        new_card += "<div class=\"preview\">";
        new_card += "    <p class=\"title\">" + $('#new_card_title')[0].value + "<\/p>";
        new_card += "    <div class=\"card-tags\">";
        new_card += "    <ul>";
        new_card += "    <li>Homework<\/li>";
        new_card += "    <li>Science<\/li>";
        new_card += "    <li>PE<\/li>";
        new_card += "    <\/ul>";
        new_card += "    <\/div>";
        new_card += "    <img src=\"http:\/\/dummyimage.com\/250x220\/87CEFA\/fff\">";
        new_card += "    <div class=\"preview_date\">mm-dd-yyyy<\/div>";
        new_card += "    <\/div>";
        $("#main_container").prepend(new_card);
        
        cards.push({title: $('#new_card_title')[0].value, notes: $('#new_card_notes')[0].value});
        $('#new_card_title')[0].value = null;
        $('#new_card_notes')[0].value = null;
        editCardContainer.addClass('hide');
    });

});