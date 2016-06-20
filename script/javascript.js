/**
 * Created by JasonHsieh on 6/14/16.
 */

var editCardContainer;
var cards = [];
var tags = [];

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

        // generate preview card

        var new_card =
            `<div class="preview">
                <p class="title">${$('#new_card_title')[0].value}</p>
                <div class="card-tags">
                    <ul>`;
        for (var tag in tags)
            new_card += `<li>${tags[tag]}</li>`;
        new_card +=
                    `</ul>
                </div>
                <img src="http://dummyimage.com/250x220/87CEFA/fff">
                <div class="preview_date">mm-dd-yyyy</div>
            </div>`;
        $("#main_container").prepend(new_card);


        // update card variable

        cards.push({title: $('#new_card_title')[0].value, tags: tags, notes: $('#new_card_notes')[0].value});
        console.log(cards);

        // clean up fields and html

        tags = [];
        $('#new_tag')[0].value = null;
        $('#temp_tags').empty();
        $('#new_card_title')[0].value = null;
        $('#new_card_notes')[0].value = null;
        editCardContainer.addClass('hide');
    });

    $('#new_tag').keypress(function(e) {
        if((e.keyCode || e.which) == 13 && $('#new_tag')[0].value != "") {
            var tag = $('<li>').addClass("temp_tag").text(this.value);
            $('#temp_tags').append(tag);
            tags.push(this.value);
            $('#new_tag')[0].value = null;
        }
    });

    $('#temp_tags').on('click', '.temp_tag', function(e) {
        tags.splice(tags.indexOf(e.target.textContent), 1);
        e.target.remove();
    });

});