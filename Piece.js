"use strict";

blocks.Piece = function () {
    //set the type of the piece
    this.type = blocks.types[Math.floor(Math.random() * blocks.types.length)];
    this.map = blocks.maps[this.type];
    this.position = {top: 0, left: 1};

    this.set_direction();
    this.dim = this.map[this.direction].length; //will never change as long as type doesn't change
};

blocks.Piece.prototype.set_direction = function (direction) {
    this.direction = direction ||
        blocks.directions[Math.floor(Math.random() * blocks.directions.length)];
};

blocks.Piece.prototype.set_position = function (top, left) {
    this.position.top = top;
    this.position.left = left;
};

blocks.Piece.prototype.leftmost = function (direction) {
    var maxLeft = 0, i, j;

    for (i = 0; i < this.dim; i++) {
        for (j = 0; j < this.dim; j++) {
            if (j > maxLeft && this.map[direction || this.direction][i][j]) {
                maxLeft = j;
            }
        }
    }

    return this.dim - 1 - maxLeft;
};

blocks.Piece.prototype.rightmost = function (direction) {
    var maxRight = this.dim - 1, i, j;

    for (i = 0; i < this.dim; i++) {
        for (j = 0; j < this.dim; j++) {
            if (j < maxRight && this.map[direction || this.direction][i][j]) {
                maxRight = j;
            }
        }
    }

    return this.dim - 1 - maxRight;
};

blocks.Piece.prototype.topmost = function (direction) {
    var i, j;

    for (i = 0; i < this.dim; i++) {
        for (j = 0; j < this.dim; j++) {
            if (this.map[direction || this.direction][i][j]) {
                return i;
            }
        }
    }
};

blocks.Piece.prototype.bottommost = function (direction) {
    var i, j;

    for (i = this.dim - 1; i >= 0; i--) {
        for (j = 0; j < this.dim; j++) {
            if (this.map[direction || this.direction][i][j]) {
                return i;
            }
        }
    }
};

blocks.Piece.prototype.rotate_valid = function () {
    var next = blocks.next_direction(this.direction);

    return this.position.left + this.leftmost(next) >= 0 &&
        this.position.left + this.rightmost(next) < blocks.BOARD_WIDTH;
};

//returns whether it hit bottom
blocks.Piece.prototype.down_valid = function () {
    return this.position.top + this.bottommost() + 1 - 2 < blocks.BOARD_HEIGHT;
};

blocks.Piece.prototype.left_valid = function () {
    //the 2 is a kludge
    return this.position.left + this.leftmost() - 1 - 2 >= 0;
};

blocks.Piece.prototype.right_valid = function () {
    //the 2 is a kludge
    return this.position.left + this.rightmost() + 1 - 2 < blocks.BOARD_WIDTH;
};

//blocks.Piece.prototype.snap_right = function () { while(!this.move_right()); };

//blocks.Piece.prototype.snap_left = function () { while(!this.move_left()); };

/*blocks.Piece.prototype.snap_down = function () {
    while(!this.move_down());
    return true;
};*/
