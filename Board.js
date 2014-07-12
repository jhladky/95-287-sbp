"use strict";

/**
 * @constructor Board
 * @param {Object} board - Configuration object.
 * @param {jQuery} board.$frame - Table element to construct the board in.
 * @param {number} board.height - Height of the board.
 * @param {number} board.width - Width of the board.
 * @param {number} board.over - Number of hidden overflow cells to add.
 */
var Board = function (board) {
    var i, j;

    this.$frame = board.$frame;
    this.$board = $("<tbody>").appendTo(this.$frame);
    this.rows = [];

    // these are pseudo-constants
    // the true dimensions of the board
    this._height = board.height + board.over;
    this._width = board.width + 2 * board.over;

    // indices denoting the visible board
    this._vis_w_start = board.over;
    this._vis_w_end = board.over + board.width;
    this._vis_h_start = board.over;
    this._vis_h_end = board.over + board.height;

    //board includes two non-visible rows at the top, where pieces start
    //and two non-visible columns on each side
    this._board = Board._blank_board(this._height, this._width);

    for (i = 0; i < this._height; i++) {
        var row = [], $row = $("<tr>");

        this.rows.push(row);
        this.$board.append($row);

        this._row($row, row)

        if (i < this._vis_h_start || i >= this._vis_h_end) {
            $row.children().addClass("hidden");
        }
    }
};

Board._blank_board = function (height, width) {
    var i, j, board = [], row;

    for (i = 0; i < height; i++) {
        row = [];

        for (j = 0; j < width; j++) {
            row.push(0);
        }
        board.push(row)
    }
    return board;
};

// fill out a row
Board.prototype._row = function ($row, row) {
    var i;

    for (i = 0; i < this._width; i++) {
        var $cell = $("<td>");

        if (i < this._vis_w_start || i >= this._vis_w_end) {
            $cell.addClass("hidden");
        }

        $row.append($cell);
        row.push($cell);
    }
};

// helper function
Board._piece_action = function (action) {
    return function (piece)  {
        var i, j, res;

        for (i = piece.position.top; i < piece.position.top + piece.dim; i++) {
            for (j = piece.position.left; j < piece.position.left + piece.dim; j++) {
                if (piece.map[piece.direction][i - piece.position.top][j - piece.position.left]) {
                    res = action.call(this, piece, i, j);
                    if (res) {
                        return true;
                    }
                }
            }
        }

        return false;
    };
};

// write a piece to the board, at the position in the piece
//SHOULD BE WRITE_PIECE, or change the others to remove _piece
Board.prototype.write = Board._piece_action(function (piece, i, j) {
    var pos = piece.position;

    this._board[i][j] =
        piece.map[piece.direction][i - pos.top][j - pos.left];
});

Board.prototype.set_piece = Board._piece_action(function (piece, i, j) {
    var pos = piece.position;

    this.rows[i][j].css("background-color", _95_287_sbp.colors[
        piece.map[piece.direction][i - pos.top][j - pos.left]
    ]);
});

//clear a square starting from position and going dim
Board.prototype.clear_piece = Board._piece_action(function (piece, i, j) {
    this.rows[i][j].css("background-color", _95_287_sbp.colors[0]);
});

Board.prototype.check_piece = Board._piece_action(function (piece, i, j) {
    return this._board[i + 1][j];
});

//remove full lines
//return the number of lines removed
Board.prototype.clear_lines = function () {
    var self = this;
    var cnt = 0, i, j, lines = [], full;

    for (i = 0; i < this._height; i++) {
        full = true;

        for (j = this._vis_w_start; j < this._vis_w_end; j++) {
            if (0 === this._board[i][j]) {
                full = false;
                break;
            }
        }

        if (full) {
            lines.push(i);
            cnt++;
        }
    }

    lines.forEach(function (line) {
        var row = [], $row = $("<tr>"), _row = [];

        self._row($row, row);

        $(self.$board.children()[line]).remove();
        $row.insertAfter(self.$board.children()[1]);
        self.rows.splice(line, 1, row);
        for (i = 0; i < self._width; i++) {
            self._board[line][i] = 0;
        }
    });

    return cnt;
};

// debuggging function
Board.prototype.print = function () {
    var i;

    for (i = 0; i < this._height; i++) {
        console.log(this._board[i]);
    }
};
