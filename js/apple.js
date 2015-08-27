(function () {
  if (typeof SG === "undefined") {
    window.SG = {};
  }

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

    this.position = new SG.Coord(i, j);
  };

})();
