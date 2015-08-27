(function () {
  if (typeof SG === "undefined") {
    window.SG = {};
  }

  var View = SG.View = function ($el, difficulty) {
    this.$el = $el;
    this.board = new SG.Board(40);
    this.setupGrid();
    this.gamePaused = false;

    this.welcome();
  };

  View.prototype.restart = function() {
    $(window).off();
    this.board = new SG.Board(40);
    this.welcome();
  };

  View.KEYS = {
    //arrow keys
    38: "N",
    39: "E",
    40: "S",
    37: "W",
    //WASD
    87: "N",
    68: "E",
    83: "S",
    65: "W"
  };

  View.SPEED = {"easy": 100, "medium": 65, "hard": 30 };

  View.prototype.welcome = function() {
    var $welcome = $('.welcome');
    $welcome.addClass('active');
    $('button').click(function(event) {
      $welcome.removeClass('active');
      $('button').unbind('click');
      var difficulty = event.target.className;
      this.difficulty = difficulty;
      this.startGame();
    }.bind(this));
  };

  View.prototype.startGame = function(difficulty) {
    this.intervalId = window.setInterval(
      this.step.bind(this),
      View.SPEED[this.difficulty]
    );
    $(window).on("keydown", this.handleKeyEvent.bind(this));
  };

  View.prototype.handleKeyEvent = function (event) {
    if (!this.gamePaused && View.KEYS[event.keyCode]) {
      this.board.snake.turn(View.KEYS[event.keyCode]);
    } else {
      if (event.keyCode === 80) {
        this.togglePause();
      }
    }
  };

  View.prototype.togglePause = function () {
    if (this.gamePaused) {
      $('.pause').removeClass('active');
      this.gamePaused = false;
      this.intervalId = window.setInterval(
        this.step.bind(this),
        View.SPEED[this.difficulty]
      );
    } else {
      $('.pause').addClass('active');
      this.gamePaused = true;
      window.clearInterval(this.intervalId);
    }
  };

  View.prototype.render = function () {
    this.updateClasses(this.board.snake.segments, "snake");
    this.updateClasses([this.board.snake.head()], "head");
    this.updateClasses([this.board.apple.position], "apple");

    $(document.getElementsByClassName('score')).html(
      "score: " + this.board.snake.score);

    if (SG.highScore) {
      $(document.getElementsByClassName('highScore')).html(
        "high score: " + SG.highScore
      );
    }
  };

  View.prototype.updateClasses = function(coords, className) {
    this.$li.filter("." + className).removeClass(className);

    if (coords && coords[0]) {
      coords.forEach(function(coord){
        var flatCoord = (coord.i * this.board.dimension) + coord.j;
        this.$li.eq(flatCoord).addClass(className);
      }.bind(this));
    }
  };

  View.prototype.setupGrid = function () {
    var html = "";

    for (var i = 0; i < this.board.dimension; i++) {
      html += "<ul>";
      for (var j = 0; j < this.board.dimension; j++) {
        html += "<li></li>";
      }
      html += "</ul>";
    }

    this.$el.html(html);
    this.$li = this.$el.find("li");
  };

  View.prototype.step = function () {
    if (this.board.snake.segments.length > 0) {
      this.board.snake.move();
      this.render();
    } else {
      SG.updateHighScore(this.board.snake.score);
      SG.gameOver(this.$el);

      window.clearInterval(this.intervalId);
    }
  };

  SG.gameOver = function($el) {
    var $gameOver = $('.gameover');
    $gameOver.addClass('active');
    $gameOver.find('.yesAgain').click(function() {
      $gameOver.removeClass('active');
      this.view.restart();
    }.bind(this));
  };

  SG.updateHighScore = function(score) {
    if (this.highScore) {
      if (score > this.highScore) {
        this.highScore = score;
      }
    } else {
      this.highScore = score;
    }
  };

})();
