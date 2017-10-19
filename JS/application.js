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

/*bfs implementation similar to https://www.khanacademy.org/computing/computer-science/algorithms/breadth-first-search/p/challenge-implement-breadth-first-search*/
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

function filterEdgeGrid(i) {
    //nw, n, ne, e, se, s, sw, w
    var position = [i-9, i-8, i-7, i+1, i+9, i+8, i+7, i-1];
    
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
    return position;
}

function findNeighbours() {
    var listOfNeighboursArray = [];
    for(var i = 0; i < 64; i++) {
        var neighboursArray = [];
        if($('#' + i).children().length == 0) {
            var position = filterEdgeGrid(i);

            for(var j = 0; j < 8; j++) {
                if(position[j] >= 0 && ( $('#' + position[j]).children().length == 0 || $('#' + position[j]).children('p').length > 0)) {
                    neighboursArray.push(position[j]);
                }
            }
        }
        listOfNeighboursArray.push(neighboursArray.sort(function(a, b){return a - b;}));
    }
    return listOfNeighboursArray;
}

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

    //check around each box and place number in there
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
                    //console.log('yes!');
                    counter++;
                }
            }
        }
        if (counter > 0) {
            $('#' + i).append('<p>'+ counter +'</p>').find('p').addClass('hide-icon');
        }
    }

    var neighboursList = findNeighbours();

    //player click the box
    $('.board').on('click', '.box', function() {
        $(this).removeClass('box').addClass('opened-box');
        $(this).children().removeClass('hide-icon').addClass('show-icon');
        if($(this).children().length == 0) {
            var openList = bfs(neighboursList, this.id);
            for(var i = 0; i < openList.length; i++) {
                //console.log(openList[i].distance + ' ' + openList[i].parent);
                if(openList[i].distance != null && $('#' + i).hasClass('box')) {
                    $('#' + i).removeClass('box').addClass('opened-box');
                    $('#' + i).children().removeClass('hide-icon').addClass('show-icon');
                }
            }
        }
        
        //when one box is opened, it should propagate to related one
        //for empty box, it should open all the empty one around it until it hit a numbered box
        
    });

    //when player right click
    $('.board').on('contextmenu', '.box', function() {
        $(this).toggleClass('fa fa-flag fa-2x hide-icon');
        //prevent default menu appear
        return false;
    });

});