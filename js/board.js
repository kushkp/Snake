(function () {
  if (typeof SG === "undefined") {
    window.SG = {};
  }

  var Board = SG.Board = function (dimension) {
    this.dimension = dimension;

    this.snake = new SG.Snake(this);
    this.apple = new SG.Apple(this);
  };

  Board.prototype.validPosition = function (coord) {
    return (coord.i >= 0) && (coord.i < this.dimension) &&
      (coord.j >= 0) && (coord.j < this.dimension);
  };



})();
