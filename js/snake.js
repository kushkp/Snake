(function () {
  if (typeof SG === "undefined") {
    window.SG = {};
  }

  var Snake = SG.Snake = function (board) {
    this.direction = "N";
    this.turning = false;
    this.board = board;
    this.score = 0;

    var center = new SG.Coord(Math.floor(board.dimension/2), Math.floor(board.dimension/2));
    this.segments = [center];

    this.growSegments = 0;
  };

  Snake.DIFFS = {
    "N": new SG.Coord(-1, 0),
    "E": new SG.Coord(0, 1),
    "S": new SG.Coord(1, 0),
    "W": new SG.Coord(0, -1)
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
})();
