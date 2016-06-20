/**
 * Created by JasonHsieh on 6/14/16.
 */

var id = 0;
var cards = [
    {
        id: id++,
        title: "Homework 1",
        tags: ["Science", "Homework"],
        notes: "Random notes about science homework."
    },
    {
        id: id++,
        title: "Homework 2",
        tags: ["Math", "Homework"],
        notes: "Random notes about Math homework."
    },
    {
        id: id++,
        title: "Homework 3",
        tags: ["History", "Homework"],
        notes: "Random notes about History homework."
    }
];
var tags = [];

function reset_add_card() {
    tags = [];
    $('#new_tag')[0].value = null;
    $('#temp_tags').empty();
    $('#new_card_title')[0].value = null;
    $('#new_card_notes')[0].value = null;
    $('.card').addClass('hide');
}

function gen_preview_card(title, mytags) {
    var new_card =
        `<div class="preview preview_cards">
                <p class="title">${title}</p>
                <div class="card-tags">
                    <ul>`;
    for (var tag in mytags)
        new_card += `<li>${mytags[tag]}</li>`;
    new_card +=
        `</ul>
                </div>
                <img src="http://dummyimage.com/250x220/87CEFA/fff">
                <div class="preview_date">mm-dd-yyyy</div>
            </div>`;
    return $(new_card);
}

$(function() {

    // Loop through Preset random cards to display them

    for (var card in cards) {
        var new_card = gen_preview_card(cards[card].title, cards[card].tags);
        new_card.data('id', cards[card].id);
        $("#main_container").prepend(new_card);
    }

    // Open Edit Card

    $('#add_card_btn').on('click', function() {
        $('#edit_card').removeClass('hide');
    });

    // Cancel the Edit or Normal Card

    $('.cancel_button').on('click', function() {
        reset_add_card();
    });

    // Save the card from the Edit Card

    $('#save_button').on('click', function() {
        if ($('#new_card_title')[0].value === "")
            $('#new_card_title')[0].value = "No Title";

        // generate preview card

        var new_card = gen_preview_card($('#new_card_title')[0].value, tags);

        // give the card an id number

        new_card.data('id', id);

        // display the card

        $("#main_container").prepend(new_card);

        // update card variable

        cards.push({
            id: id++,
            title: $('#new_card_title')[0].value,
            tags: tags,
            notes: $('#new_card_notes')[0].value
        });

        // clean up fields and html
        reset_add_card();
    });

    // Add new tags in Edit Card

    $('#new_tag').keypress(function(e) {
        if((e.keyCode || e.which) == 13 && this.value != "") {
            var tag = $('<li>').addClass("temp_tag").text(this.value);
            $('#temp_tags').append(tag);
            tags.push(this.value);
            this.value = null;
        }
    });

    // Removing tags in Edit Card

    $('#temp_tags').on('click', '.temp_tag', function() {
        tags.splice(tags.indexOf(this.textContent), 1);
        this.remove();
    });

    // Open Normal Card when Preview Card pressed

    $('#main_container').on('click', '.preview_cards', function() {
        
        // get normal card
        
        var card = $('#normal_card');
        card.removeClass('hide');
        
        // get data from stored cards

        var data;
        for (var index in cards)
            if (cards[index].id == $(this).data('id'))
                data = cards[index];
        
        // update normal card with data

        card.find('.title')[0].textContent = data.title;
        card.find('.text_content_container')[0].textContent = data.notes;
        card.find('.card-tags ul').empty();
        for (var tag in data.tags)
            card.find('.card-tags ul').append($('<li>').text(data.tags[tag]));
    });

});