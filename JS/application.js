$(document).ready(function() {
    var mines = [];
    
    //generate mines: 7
    for(var i = 0; i < 7; i++) {
        let ran = Math.floor(Math.random()*64);
        mines.push(ran);
    }

    //generate boxes and append mines into div
    for(var i = 0; i < 64; i++) {
        var div = $('<div></div>');
        $('.board').append(div).find('div:last').addClass('box');
        $('.board').find('div:last').attr({
            class: 'box',
            id: i
        });
        if(($.inArray(i, mines)) !== -1) {
            $('.board').find('div:last').append('<i></i>').find('i').attr({
                class: 'fa fa-bomb fa-2x hide-icon',
                ariaHidden: true
            });
        }
    }

    //check around each box and place number in there
    for(var i = 0; i < 64; i++) {
        //if the grid has the bomb
        if($('#' + i).children('i.fa-bomb').length > 0)
            continue;

        //increment if we found 1 mine around the grid
        let counter = 0;
        //nw, n, ne, e, se, s, sw, w
        position = [i-9, i-8, i-7, i+1, i+9, i+8, i+7, i-1];

        //position filtering (around the edge)
        //size of the board 8x8 so we use 8
        if(i % 8 == 0) {
            position[0] = -1;
            position[7] = -1;
            position[6] = -1;
        }
        if((i+1) % 8 == 0) {
            position[2] = -1;
            position[3] = -1;
            position[4] = -1;
        }
        if(i >= 0 && i <= 7) {
            position[0] = -1;
            position[1] = -1;
            position[2] = -1;
        }
        if(i >= 56 && i <= 63) {
            position[6] = -1;
            position[5] = -1;
            position[4] = -1;
        }
            
        //console.log(position);
        for (var j = 0; j < 8; j++) {
            //console.log(i + ':' + position[j]);
            if(position[j] >= 0) {
                if($('#' + position[j]).children('i.fa-bomb').length > 0) {
                    //console.log('yes!');
                    counter++;
                }
            }
        }
        if (counter > 0) {
            $('#' + i).append('<p>'+ counter +'</p>').find('p').addClass('hide-icon');
        }
    }

    //user click the box
    $('.board').on('click', '.box', function() {
        $(this).removeClass('box').addClass('opened-box');
        $(this).children().removeClass('hide-icon').addClass('show-icon');
    });

});