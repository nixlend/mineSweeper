/* 
 * A Queue object for arrays.
 * methods:
 * [queueOdj].enqueue(item) - enqueue @param {obj} item to the end of the queue array
 * [queueObj].dequeue() - dequeue item from the beginning of the queue array, @return {obj} item
 * [queueObj].isEmpty() - check whether the queue is empty or not, @return {bool} true if it is empty
 */
class Queue {
    constructor() {
        this.q = [];
    }
    enqueue(obj){
        this.q.push(obj);
    };
    dequeue(){
        return this.q.shift();
    };
    isEmpty(){
        return this.q.length === 0;
    };
}

/*
 * update the information of the info-display bar according to the current board.
 * including how many grids are opened, flags player setted and unopened bomb
 */
function updateInfo() {
    var openedGrid = $('.board > .opened-box').length;
    var flag = $('.board .fa-flag').length;
    var bomb = $('.board .fa-bomb.hide-icon').length - flag;
    $('.info-bar .info-opened-box').closest('.top-icon').find('span:last').text(openedGrid);
    $('.info-bar .fa-flag').closest('.top-icon').find('span:last').text(flag);
    $('.info-bar .fa-bomb').closest('.top-icon').find('span:last').text(bomb);
}

/* bfs implementation similar to https://www.khanacademy.org/computing/computer-science/algorithms/breadth-first-search/p/challenge-implement-breadth-first-search
 * @param {array} graph
 * @param {number} id
 * @return {array} Array of objects for each id in the form of [distance:_, parent:_]
 */
function bfs(graph, id) {
    var bfsInfo = [];

    //initialization
    for(var i = 0; i < graph.length; i++) {
        bfsInfo[i] = {
            distance: null,
            parent: null
        }
    }
    bfsInfo[id].distance = 0;

    var bfsQueue = new Queue();
    bfsQueue.enqueue(id);
    while(!bfsQueue.isEmpty()) {
        var currentId = bfsQueue.dequeue();
        for(var i = 0; i < graph[currentId].length; i++) {
            var neighbour = graph[currentId][i];
            if(bfsInfo[neighbour].distance === null) {
                bfsInfo[neighbour].distance = bfsInfo[currentId].distance + 1;
                bfsInfo[neighbour].parent = currentId;
                bfsQueue.enqueue(neighbour);
            }
        }
    }
    return bfsInfo;
}

/*
 * calculate every grid around and 
 * perform filtering to the edge of around all the grid,
 * so the grids of the edge will not be included inside the 8 by 8 board.
 * For example, around grid id 0, left and top should be excluded
 * @param {number} id - id of the grid on the board
 * @return {array} position - array of 8 ids the input id in format of numbers
 */
function filterEdgeGrid(id) {
    //nw, n, ne, e, se, s, sw, w
    var position = [id-9, id-8, id-7, id+1, id+9, id+8, id+7, id-1];
    
    /* position filtering (around the edge)
     * size of the board 8x8 so we use 8
     */
    if(id % 8 == 0) { // left
        position[0] = -1;
        position[7] = -1;
        position[6] = -1;
    }
    if((id+1) % 8 == 0) { // right
        position[2] = -1;
        position[3] = -1;
        position[4] = -1;
    }
    if(id >= 0 && id <= 7) { // top
        position[0] = -1;
        position[1] = -1;
        position[2] = -1;
    }
    if(id >= 56 && id <= 63) { // bottom
        position[6] = -1;
        position[5] = -1;
        position[4] = -1;
    }
    return position;
}

/* 
 * Perform search around each grid id to find their neihhbours, if the the grid is empty.
 * @reutrn {array} listOfNeighboursArray - array of 64 with each indicate who are their empty 
 * neighbours if they are empty.
 */
function findNeighbours() {
    var listOfNeighboursArray = [];
    for(var i = 0; i < 64; i++) {
        var neighboursArray = [];
        if($('#' + i).children().length == 0 || $('#' + i).children('i:last').hasClass('')) {
            var position = filterEdgeGrid(i);

            for(var j = 0; j < 8; j++) {
                if( position[j] >= 0 && ( $('#' + position[j]).children().length == 0 ||
                ($('#' + position[j]).children('i:last').hasClass('')) || 
                $('#' + position[j]).children('p').length > 0) &&
                !($('#' + position[j]).children('i:last').hasClass('fa-flag')) ) {
                    neighboursArray.push(position[j]);
                }
            }
        }
        listOfNeighboursArray.push(neighboursArray.sort(function(a, b){return a - b;}));
    }
    return listOfNeighboursArray;
}

function isWon() {
    var openedGrid = $('.board > .opened-box').length;
    var flag = $('.board .fa-flag').length;
    var bomb = $('.board .fa-bomb.hide-icon').length - flag;
    if (openedGrid == 57 && flag == 7 && bomb == 0) {
        // display won message
        $('.restart').text('Congratulations, you won! Play again');
        $('.restart').css({
            'display': 'inline-block',
            'background': '#84f883'
        });
    }    
}

function setup() {

    var mines = [];

     //generate mines: 7
     for(var i = 0; i < 7; i++) {
        let ran = Math.floor(Math.random()*64);
        if(mines.indexOf(ran) !== -1) {
            i--;
            continue;
        }
        mines.push(ran);
    }

    //generate boxes and append mines into div
    for(var i = 0; i < 64; i++) {
        var div = $('<div></div>');
        $('.board').append(div).find('div:last').attr({
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

    //check each box around and place a number in there if there are related bombs around
    for(var i = 0; i < 64; i++) {
        //if the grid has the bomb
        if($('#' + i).children('i.fa-bomb').length > 0)
            continue;

        //increment if we found 1 mine around the grid
        let counter = 0;
        var position = filterEdgeGrid(i);
            
        //check how many bombs around the grid, then add it to counter
        for (var j = 0; j < 8; j++) {
            //console.log(i + ':' + position[j]);
            if(position[j] >= 0) {
                if($('#' + position[j]).children('i.fa-bomb').length > 0) {
                    counter++;
                }
            }
        }
        if (counter > 0) {
            $('#' + i).append('<p>'+ counter +'</p>').find('p').addClass('hide-icon');
        }
    }

    var neighboursList = findNeighbours();
    updateInfo();

    return [mines, neighboursList];
}

function padZero( val ) {
    if(val <= 9)
        val = "0" + val;
    return val;
} 

/*
 * Timer should start when player press any grid; stopped when player opened any bomb;
 * reset to all zero when player press restart. 
 */
function runTimer(time) {
    second = padZero(time % 60);
    minute = padZero(parseInt(time/60));
    $('#timing').text(minute + ":" + second);
}

$(document).ready(function() {
    var mines = [];
    var timer = 0;
    var interval;
    var timeRunning = false;
    var neighboursList;
    
    var starting = setup();
    mines = starting[0];
    neighboursList = starting[1];

    //Listening when player click the box
    $('.board').on('click', '.box', function() {
        /*
         * if the timer has not started yet, start the timer
         * use function call
         */
        if(!timeRunning) {
            timeRunning = true;
            interval = setInterval(function() {runTimer(++timer)}, 1000);
        }

        // player opened a non-flagged grid
        if(!($(this).children().hasClass('fa-flag'))) {
            
            // player has opened a bomb, display the replay and stop the counter
            if($(this).children().hasClass('fa-bomb')) {
                clearInterval(interval);
                $('.restart').css("display", "inline-block");
            }

            // player has opened an empty grid
            if($(this).children().length == 0 || ($(this).children().length == 1 && $(this).children('i:last').hasClass(''))) {
                var openList = bfs(neighboursList, this.id);
                for(var i = 0; i < openList.length; i++) {
                    //console.log(openList[i].distance + ' ' + openList[i].parent);
                    if(openList[i].distance != null && $('#' + i).hasClass('box')) {
                        $('#' + i).removeClass('box').addClass('opened-box');
                        $('#' + i).children().removeClass('hide-icon').addClass('show-icon');
                    }
                }
            }
            $(this).removeClass('box').addClass('opened-box');
            $(this).children().removeClass('hide-icon').addClass('show-icon');
            updateInfo();
        }
        isWon();
    });

    //Listening when player right click, the grid is flagged if it isn't opened
    $('.board').on('contextmenu', '.box', function() {
        if($(this).children().length == 0 || ($(this).children().length == 1 && $(this).find('p').length) ||
            ($(this).children().length == 1 && $(this).find('i:last').hasClass('fa-bomb'))) {
            $(this).append('<i></i>').find('i:last').toggleClass('fa fa-flag fa-2x');
        } else if ($(this).children().length == 2 || ($(this).children().length == 1 && !($(this).find('i').hasClass('fa-bomb')))) {
            $(this).find('i:last').toggleClass('fa fa-flag fa-2x');
        }
        // Since the flagged grid will not be opened by propagation, we have to calculate
        // the new neighbours of each grid
        neighboursList = findNeighbours();
        updateInfo();
        isWon();
        //prevent default menu appear
        return false;
    });

    // player click restart to reset the board
    $('.restart').on('click', function(){
        timer = 0;
        interval = null;
        timeRunning = false;
        $('#timing').text('00:00');
        $('.restart').text('You lose, play again');
        $('.restart').css({
            'display': 'none',
            'background': '#f88383'
        });
        $('.board').empty();
        starting = setup();
        mines = starting[0];
        neighboursList = starting[1];
    });

});