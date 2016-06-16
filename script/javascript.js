/**
 * Created by JasonHsieh on 6/14/16.
 */

var editCardContainer;
var cards = [
    {
        title: 'My new card',
        notes: "My notes"
    }
];



$(function() {
    editCardContainer = $('#edit_card');

    $('#add_card_btn').on('click', function() {
        editCardContainer.removeClass('hide');
    });

    $('.cancel_button').on('click', function() {
        $('.card').addClass('hide');
    });

    $('#save_button').on('click', function() {
        cards.push({title: $('#new_card_title')[0].value, notes: $('#new_card_notes')[0].value});
        $('#new_card_title')[0].value = null;
        $('#new_card_notes')[0].value = null;
        editCardContainer.addClass('hide');
        console.log(cards);
    });

});