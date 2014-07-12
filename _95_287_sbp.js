"use strict";

var _95_287_sbp = {};

_95_287_sbp.setup = function () {
    var self = this, i;

    this.board = new Board({
        $frame: $("#_95_287_sbp"),
        height: _95_287_sbp.BOARD_HEIGHT,
        width: _95_287_sbp.BOARD_WIDTH,
        over: 2
    });
    
    this.next = new Board({
        $frame: $("#nextPiece"),
        height: 4,
        width: 5,
        over: 0
    });

    $("#nextPiece > tbody").prepend("<tr><td colspan=4>NEXT PIECE</td></tr>");

    this.nextPiece = new Piece();
    this.new_piece();

    $(window).keydown(function (evt) {
        if (evt.which === 38) { //up arrow
            if (self.currPiece.rotate_valid()) {
                self.board.clear_piece(self.currPiece);
                self.currPiece.direction = self.next_direction(self.currPiece.direction);
                self.board.set_piece(self.currPiece);
            }

            if (self.board.check_piece(self.currPiece)) {
                self.new_piece();
            }
        } else if (evt.which === 40) { //down arrow
            if (self.currPiece.down_valid()) {
                self.board.clear_piece(self.currPiece);
                self.currPiece.position.top++;
                self.board.set_piece(self.currPiece);   
            }

            if (!self.currPiece.down_valid() ||
                self.board.check_piece(self.currPiece)) {
                self.new_piece();
            }
        } else if (evt.which === 37) { //left arrow
            //need to make the snap value changable later!!!
            //self.snapL = setTimeout(function () { self.currPiece.snap_left(); }, 150);
            if (self.currPiece.left_valid()) {
                self.board.clear_piece(self.currPiece);
                self.currPiece.position.left--;
                self.board.set_piece(self.currPiece);
            }

            if (self.board.check_piece(self.currPiece)) {
                self.new_piece();
            }
            
        } else if (evt.which === 39) { //right arrow
            //need to make the snap value changable later!!!
            //self.snapR = setTimeout(function () { self.currPiece.snap_right(); }, 150);
            if (self.currPiece.right_valid()) {
                self.board.clear_piece(self.currPiece);
                self.currPiece.position.left++;
                self.board.set_piece(self.currPiece);
            }

            if (self.board.check_piece(self.currPiece)) {
                self.new_piece();
            }
        } else if (evt.which === 32) { //spacebar
            //while (!self.currPiece.move_down() && !self.board.check_piece(self.currPiece))
             //   ;
            //self.new_piece();
        } else if (evt.which == 81) { //'q'
            console.log("QUIT");
            self.end_game();
        }
    });

    /*$(window).keyup(function (evt) {
        if (evt.which === 37) { //left arrow
            clearTimeout(self.snapL);
            self.currPiece.move_left();
            if (self.board.check_piece(self.currPiece)) {
                self.new_piece();
            }
        } else if (evt.which === 39) { //right arrow
            clearTimeout(self.snapR);
            self.currPiece.move_right();
            if (self.board.check_piece(self.currPiece)) {
                self.new_piece();
            }
        }
    });*/
    
    _95_287_sbp.run_game();
};

//this is going to need to be fixed later
_95_287_sbp.run_game = function () {
    var self = this;

    this.runLoop = setInterval(function () {
        self.board.clear_piece(self.currPiece);
        self.currPiece.position.top++;
        self.board.set_piece(self.currPiece);

        if (!self.currPiece.down_valid ||
            self.board.check_piece(self.currPiece)) {
            self.new_piece();
        }
    }, 1000);
};

//obviously going to need to add more to this later
_95_287_sbp.end_game = function () {
    clearInterval(this.runLoop);
};

_95_287_sbp.new_piece = function () {
    if(this.currPiece) {
        this.board.write(this.currPiece);
    }

    this.next.clear_piece(this.nextPiece);
    this.currPiece = this.nextPiece;
    this.currPiece.set_position(2, 5); //fix later
    this.board.set_piece(this.currPiece);

    this.nextPiece = new Piece();
    this.next.set_piece(this.nextPiece);

    this.board.clear_lines();
};

_95_287_sbp.next_direction = function (direction) {
    switch(direction) {
    case "north": return "south";
    case "south": return "east";
    case "east" : return "west";
    case "west" : return "north";
    default:
        console.log("Bad direction!");
    }
};

_95_287_sbp.BOARD_WIDTH = 10; //width of the board in blocks
_95_287_sbp.BOARD_HEIGHT = 20; //height of the board in blocks
_95_287_sbp.NUM_BLOCKS = 4; //the number of blocks in a piece... remove later

//These are our _95_287_sbp "enums"
_95_287_sbp.types = Object.freeze(['i', 'j', 'l', 'o', 'z', 't', 's']);
_95_287_sbp.directions = Object.freeze(["north", "south", "east", "west"]);
_95_287_sbp.colors = Object.freeze({0: "white",
                               1: "green",
                               2: "blue",
                               3: "yellow",
                               4: "aqua",
                               5: "red",
                               6: "pink",
                               7: "grey"});
_95_287_sbp.maps = Object.freeze({
    i: {
        north: [[0, 0, 0, 0],
                [7, 7, 7, 7],
                [0, 0, 0, 0],
                [0, 0, 0, 0]],
        south: [[0, 0, 7, 0],
                [0, 0, 7, 0],
                [0, 0, 7, 0],
                [0, 0, 7, 0]],
        east : [[0, 0, 0, 0],
                [0, 0, 0, 0],
                [7, 7, 7, 7],
                [0, 0, 0, 0]],
        west : [[0, 7, 0, 0],
                [0, 7, 0, 0],
                [0, 7, 0, 0],
                [0, 7, 0, 0]]
    },
    j: {
        north: [[1, 0, 0],
                [1, 1, 1],
                [0, 0, 0]],
        south: [[0, 1, 1],
                [0, 1, 0],
                [0, 1, 0]],
        east : [[0, 0, 0],
                [1, 1, 1],
                [0, 0, 1]],
        west : [[0, 1, 0],
                [0, 1, 0],
                [1, 1, 0]],
    },
    l: {
        north: [[0, 0, 2],
                [2, 2, 2],
                [0, 0, 0]],
        south: [[0, 2, 0],
                [0, 2, 0],
                [0, 2, 2]],
        east : [[0, 0, 0],
                [2, 2, 2],
                [2, 0, 0]],
        west : [[2, 2, 0],
                [0, 2, 0],
                [0, 2, 0]],
    },
    o: {
        north: [[3, 3],
                [3, 3]],
        south: [[3, 3],
                [3, 3]],
        east : [[3, 3],
                [3, 3]],
        west : [[3, 3],
                [3, 3]],
    },
    z: {
        north: [[4, 4, 0],
                [0, 4, 4],
                [0, 0, 0]],
        south: [[0, 0, 4],
                [0, 4, 4],
                [0, 4, 0]],
        east : [[0, 0, 0],
                [4, 4, 0],
                [0, 4, 4]],
        west : [[0, 4, 0],
                [4, 4, 0],
                [4, 0, 0]],
    },
    t: {
        north: [[0, 5, 0],
                [5, 5, 5],
                [0, 0, 0]],
        south: [[0, 5, 0],
                [0, 5, 5],
                [0, 5, 0]],
        east : [[0, 0, 0],
                [5, 5, 5],
                [0, 5, 0]],
        west : [[0, 5, 0],
                [5, 5, 0],
                [0, 5, 0]],
    },
    s: {
        north: [[0, 6, 6],
                [6, 6, 0],
                [0, 0, 0]],
        south: [[0, 6, 0],
                [0, 6, 6],
                [0, 0, 6]],
        east : [[0, 0, 0],
                [0, 6, 6],
                [6, 6, 0]],
        west : [[6, 0, 0],
                [6, 6, 0],
                [0, 6, 0]],
    }
});
