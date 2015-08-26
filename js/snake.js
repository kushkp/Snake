(function () {
  if (typeof SG === "undefined") {
    window.SG = {};
  }

  // var Game = SG.Game = function() {
  //   this.snakeGame = new
  // };

  var Coord = SG.Coord = function (i, j) {
    this.i = i;
    this.j = j;
  };

  Coord.prototype.equals = function (coord2) {
    return (this.i == coord2.i) && (this.j == coord2.j);
  };

  Coord.prototype.isOpposite = function (coord2) {
    return (this.i == (-1 * coord2.i)) && (this.j == (-1 * coord2.j));
  };

  Coord.prototype.plus = function (coord2) {
    return new Coord(this.i + coord2.i, this.j + coord2.j);
  };

  var Apple = SG.Apple = function (board) {
    this.board = board;
    this.replace();
  };

  Apple.prototype.replace = function () {
    var i = Math.floor(Math.random() * this.board.dimension);
    var j = Math.floor(Math.random() * this.board.dimension);

    // Don't place an apple where there is a snake
    while (this.board.snake.isOccupying([i, j])) {
      i = Math.floor(Math.random() * this.board.dimension);
      j = Math.floor(Math.random() * this.board.dimension);
    }

    this.position = new Coord(i, j);
  };

  var Snake = SG.Snake = function (board) {
    this.direction = "N";
    this.turning = false;
    this.board = board;
    this.score = 0;

    var center = new Coord(Math.floor(board.dimension/2), Math.floor(board.dimension/2));
    this.segments = [center];

    this.growSegments = 0;
  };

  Snake.DIFFS = {
    "N": new Coord(-1, 0),
    "E": new Coord(0, 1),
    "S": new Coord(1, 0),
    "W": new Coord(0, -1)
  };

  Snake.SYMBOL = "S";
  Snake.GROW_SEGMENTS = 5;

  Snake.prototype.eatApple = function () {
    if (this.head().equals(this.board.apple.position)) {
      this.score += 10;
      this.growSegments += Snake.GROW_SEGMENTS;
      return true;
    } else {
      return false;
    }
  };

  Snake.prototype.isOccupying = function (array) {
    var result = false;
    this.segments.forEach(function (segment) {
      if (segment.i === array[0] && segment.j === array[1]) {
        result = true;
        return result;
      }
    });
    return result;
  };

  Snake.prototype.head = function () {
    return this.segments[this.segments.length - 1];
  };

  Snake.prototype.isValid = function () {
    var head = this.head();

    if (!this.board.validPosition(this.head())) {
      return false;
    }

    for (var i = 0; i < this.segments.length - 1; i++) {
      if (this.segments[i].equals(head)) {
        return false;
      }
    }

    return true;
  };

  Snake.prototype.move = function () {
    // move snake forward
    this.segments.push(this.head().plus(Snake.DIFFS[this.direction]));

    // allow turning again
    this.turning = false;

    // maybe eat an apple
    if (this.eatApple()) {
      this.board.apple.replace();
    }

    // if not growing, remove tail segment
    if (this.growSegments > 0) {
      this.growSegments -= 1;
    } else {
      this.segments.shift();
    }

    // destroy snake if it eats itself or runs off grid
    if (!this.isValid()) {
      this.segments = [];
    }
  };

  Snake.prototype.turn = function (direction) {
    // avoid turning directly back on yourself
    if (Snake.DIFFS[this.direction].isOpposite(Snake.DIFFS[direction]) ||
      this.turning) {
      return;
    } else {
      this.turning = true;
      this.direction = direction;
    }
  };

  var Board = SG.Board = function (dimension) {
    this.dimension = dimension;

    this.snake = new Snake(this);
    this.apple = new Apple(this);
  };

  Board.prototype.validPosition = function (coord) {
    return (coord.i >= 0) && (coord.i < this.dimension) &&
      (coord.j >= 0) && (coord.j < this.dimension);
  };
})();
