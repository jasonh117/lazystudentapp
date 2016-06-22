/**
 * Created by JasonHsieh on 6/14/16.
 */

var cards = [
    // {
    //     _id: _id++,
    //     title: "Homework 1",
    //     tags: ["Science", "Homework"],
    //     body: "Random notes about science homework.\nMore random notes on second line."
    // },
    // {
    //     _id: _id++,
    //     title: "Homework 2",
    //     tags: ["Math", "Homework"],
    //     body: "Random notes about Math homework.\nMore random notes on second line."
    // },
    // {
    //     _id: _id++,
    //     title: "Homework 3",
    //     tags: ["History", "Homework"],
    //     body: "Random notes about History homework.\nMore random notes on second line."
    // }
];
var tags = [];

function reset_add_card() {
    tags = [];
    $('#new_tag')[0].value = null;
    $('#temp_tags').empty();
    $('#new_card_title')[0].value = null;
    $('#new_card_notes')[0].value = null;
    $('.card').addClass('hide');
    $('#normal_card').data('_id', null);
    $('#edit_card').data('_id', null);
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
            <div class="preview_date">mm-dd-yyyy</div>
        </div>`;
    return $(new_card);
}

$(function() {

    // Loop through Preset random cards to display them

    // for (var card in cards) {
    //     var new_card = gen_preview_card(cards[card].title, cards[card].tags);
    //     new_card.data('_id', cards[card]._id);
    //     $("#main_container").prepend(new_card);
    // }

    // Retrieve Cards from server

    $.ajax({
        url: "http://thiman.me:1337/jasonh/",

        type: "GET"
    }).done(function(object) {

        for (var card in object.data) {
            cards.push(object.data[card]);
            var new_card = gen_preview_card(object.data[card].title, object.data[card].tags);
            new_card.data('_id', object.data[card]._id);
            $("#main_container").prepend(new_card);
        }

    }).fail(function(xhr, status, errorThrown) {
        console.log( "Error: " + errorThrown );
        console.log( "Status: " + status );
        console.dir( xhr );
    });

    // Open Edit Card

    $('#add_card_btn').on('click', function() {
        reset_add_card();
        $('.card').addClass('hide');
        $('#edit_card').removeClass('hide');
    });

    // Cancel the Edit or Normal Card

    $('.cancel_button').on('click', function() {
        reset_add_card();
    });

    // Save the card from the Edit Card

    $('.save_button').on('click', function() {
        if ($('#new_card_title')[0].value === "")
            $('#new_card_title')[0].value = "No Title";

        var id = $('#normal_card').data('_id');

        if ($('#edit_card').data('_id') === null || $('#edit_card').data('_id') === undefined) {
            $.ajax({
                url: "http://thiman.me:1337/jasonh/",

                data: {
                    title: $('#new_card_title')[0].value,
                    tags: tags,
                    body: $('#new_card_notes')[0].value
                },

                traditional: true,

                type: "POST"
            }).done(function (object) {

                // generate preview card

                var new_card = gen_preview_card(object.data.title, object.data.tags);

                // give the card an id number

                new_card.data('_id', object.data._id);

                // display the card

                $("#main_container").prepend(new_card);

                // update cards variable

                cards.push({
                    _id: object.data._id,
                    title: object.data.title,
                    tags: object.data.tags,
                    body: object.data.body,
                    author: object.data.author
                });
            }).fail(function (xhr, status, errorThrown) {
                console.log("Error: " + errorThrown);
                console.log("Status: " + status);
                console.dir(xhr);
            }).always(function () {
                // clean up fields and html
                reset_add_card();
            });

        } else {

            var card;
            for (var index in cards)
                if (cards[index]._id === id)
                    card = cards[index];

            var data = {};

            if ($('#new_card_title')[0].value != card.title)
                data.title = $('#new_card_title')[0].value;

            if ($('#new_card_notes')[0].value != card.body)
                data.body = $('#new_card_notes')[0].value;

            if (tags.length != card.tags.length)
                data.tags = tags;

            for (var index in tags)
                if (tags[index] != card.tags[index])
                    data.tags = tags;

            console.log(data);

            $.ajax({
                url: "http://thiman.me:1337/jasonh/" + id,

                data: data,

                traditional: true,

                type: "PATCH"
            }).done(function(object) {
                card.title = $('#new_card_title')[0].value;
                card.body = $('#new_card_notes')[0].value;
                card.tags = tags;

                $("#main_container").children().each(function() {
                    if ($(this).data('_id') === id) {
                        $(this).find('.title')[0].textContent = card.title;
                        $(this).find('.card-tags ul').empty();
                        for (var tag in card.tags)
                            $(this).find('.card-tags ul').append($('<li>').text(card.tags[tag]));
                    }
                });
            }).fail(function(xhr, status, errorThrown) {
                console.log( "Error: " + errorThrown );
                console.log( "Status: " + status );
                console.dir( xhr );
            }).always(function() {
                // clean up fields and html
                reset_add_card();
            });
        }
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
        reset_add_card();
        
        // get normal card
        
        var card = $('#normal_card');
        card.removeClass('hide');
        
        // get data from stored cards

        var data;
        for (var index in cards)
            if (cards[index]._id == $(this).data('_id'))
                data = cards[index];
        
        // update normal card with data

        card.data('_id', data._id);
        card.find('.title')[0].textContent = data.title;
        var notes = data.body.replace(/\n/g, "<br>");
        card.find('.text_content_container')[0].innerHTML = notes;
        card.find('.card-tags ul').empty();
        for (var tag in data.tags)
            card.find('.card-tags ul').append($('<li>').text(data.tags[tag]));
    });

    // Deleting Card from Normal Card

    $('.delete_button').on('click', function() {
        var id = $('#normal_card').data('_id');

        $.ajax({
            url: "http://thiman.me:1337/jasonh/" + id,

            type: "DELETE"
        }).done(function() {
            $('.card').addClass('hide');

            for (var card in cards)
                if (cards[card]._id === id)
                    cards.splice(card, 1);

            $("#main_container").children().each(function() {
                if ($(this).data('_id') === id)
                    $(this).remove();
            });

        }).fail(function(xhr, status, errorThrown) {
            console.log( "Error: " + errorThrown );
            console.log( "Status: " + status );
            console.dir( xhr );
        });
    });

    // Edit Card from Normal Card

    $('.edit_button').on('click', function() {
        var id = $('#normal_card').data('_id');
        var card;
        for (var index in cards)
            if (cards[index]._id === id)
                card = cards[index];


        // Open Edit Card

        $('.card').addClass('hide');
        $('#edit_card').removeClass('hide');


        // Update Edit Card with data

        $('#edit_card').data('_id', card._id);
        $('#new_card_title')[0].value = card.title;
        $('#new_card_notes')[0].value = card.body;

        for (var index in card.tags) {
            tags.push(card.tags[index]);
            var tag = $('<li>').addClass("temp_tag").text(card.tags[index]);
            $('#temp_tags').append(tag);
        }
    });

});