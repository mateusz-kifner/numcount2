/// <reference path="./p5/p5.global-mode.d.ts" />
/*eslint no-undef: "off"*/

class CanvasObject {
  constructor(
    x = 0,
    y = 0,
    width = 100,
    height = 100,
    margin = 10,
    padding = 10
  ) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.margin = margin;
    this.padding = padding;
    this.background = "#FFFFFF";
    this.round_corners = 0;
  }
}

class SquareBoard extends CanvasObject {
  constructor(x = 0, y = 0, size = 600, margin = 20) {
    super(x + margin, y + margin, size, size, margin);
    this.size = size - 2 * margin;
    this.tiles_count = 9;
    this.tile_template = {
      x: -1,
      y: -1,
      margin: this.size * 0.03,
      padding: 10,
      size: undefined,
      row: -1,
      column: -1,
      color: undefined,
      number: -1,
      hover: false,
      pressed: false
    };
    this.text_size = 40;
    this.padding =
      (this.size -
        (this.tiles_count * this.tile_size +
          2 * this.tiles_count * this.margin)) /
      2;
    this.tiles = [];
    this.current_number = 0;
    this.round_corners = 4;
    this.animations = [];
    this.win_count = 50;
  }

  init() {
    this.tile_template.size =
      this.size / Math.sqrt(this.tiles_count) - 2 * this.tile_template.margin;
    this.current_number = 0;
    let tiles_sqrt = sqrt(this.tiles_count);
    for (let a = 0; a < tiles_sqrt; a++) {
      for (let b = 0; b < tiles_sqrt; b++) {
        this.tiles.push(Object.assign({}, this.tile_template));
        this.tiles[this.current_number].column = a;
        this.tiles[this.current_number].row = b;
        colorMode(HSB);
        this.tiles[this.current_number].color = color(
          floor(random() * 10) * 36,
          70,
          100,
          0.8
        );
        colorMode(RGB);
        this.current_number++;
      }
    }
    this.text_size = this.tile_template.size * 0.5;
  }

  reset() {
    this.current_number = this.tiles_count;
    /**
     * Shuffles array in place. ES6 version
     * @param {Array} a items An array containing the items.
     */
    let shuffle = a => {
      for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
      }
      return a;
    };

    let pre_numbers = [];
    for (let i = 0; i < this.tiles_count; i++) {
      pre_numbers.push(i + 1);
    }

    pre_numbers = shuffle(pre_numbers);

    for (let a = 0; a < this.tiles_count; a++) {
      this.tiles[a].number = pre_numbers[a];
      let x =
        this.x +
        this.tiles[a].column * (this.tiles[a].size + 2 * this.tiles[a].margin) +
        this.tiles[a].margin;
      let y =
        this.y +
        this.tiles[a].row * (this.tiles[a].size + 2 * this.tiles[a].margin) +
        this.tiles[a].margin;
      this.tiles[a].x = x;
      this.tiles[a].y = y;
      this.tiles[a].warn = false;
    }
  }

  draw() {
    //update animations
    // Array Remove - By John Resig (MIT Licensed)
    Array.prototype.remove = function(from, to) {
      var rest = this.slice((to || from) + 1 || this.length);
      this.length = from < 0 ? this.length + from : from;
      return this.push.apply(this, rest);
    };
    //draw board
    for (let a = 0; a < this.animations.length; a++) {
      if (this.animations[a].frame > 600) {
        this.animations.remove(a);
      } else {
        if (this.animations[a].stroke) {
          this.animations[a].color.setAlpha(
            (sin((this.animations[a].frame / 200) * TWO_PI - HALF_PI) + 1) / 2
          );
          noStroke();
          fill(this.animations[a].color);
          ellipse(
            this.animations[a].x + this.animations[a].size / 2,
            this.animations[a].y + this.animations[a].size / 2,
            this.animations[a].size + 50
          );
        }
        this.animations[a].frame += 1;
      }
    }

    colorMode(RGB);
    textSize(this.text_size);
    textAlign(CENTER);
    for (let a = 0; a < this.tiles_count; a++) {
      strokeWeight(this.size * 0.01);
      if (this.tiles[a].hover) {
        this.tiles[a].color.setAlpha(1);
        stroke(color(0, 255));
      } else {
        this.tiles[a].color.setAlpha(0.8);
        stroke(color(70, 255));
      }
      if (this.tiles[a].warn) {
        stroke(255, 0, 0);
        strokeWeight(this.size * 0.015);
      }
      fill(this.tiles[a].color);
      let text_top_padding = (this.tiles[a].size - this.text_size) / 2;
      let text_left_padding = 5;
      rect(
        this.tiles[a].x,
        this.tiles[a].y,
        this.tiles[a].size,
        this.tiles[a].size,
        this.round_corners
      );
      fill(0);
      stroke(0, 0, 0);
      strokeWeight(3);
      if (this.tiles[a].number <= this.win_count)
        text(
          this.tiles[a].number,
          this.tiles[a].x + text_left_padding,
          this.tiles[a].y + text_top_padding,
          this.tiles[a].size,
          this.tiles[a].size - text_top_padding
        );
    }

    for (let a = 0; a < this.animations.length; a++) {
      if (this.animations[a].frame > 1050) {
        this.animations.remove(a);
      } else {
        if (!this.animations[a].stroke) {
          this.animations[a].color.setAlpha(
            map(this.animations[a].frame, 0, 70, 0.8, 0.0, true)
          );
          stroke(color(0, map(this.animations[a].frame, 0, 70, 255, 0, true)));
          fill(this.animations[a].color);
          rect(
            this.animations[a].x + this.animations[a].frame,
            this.animations[a].y + this.animations[a].frame,
            max(this.animations[a].size - 2 * this.animations[a].frame, 0.001),
            max(this.animations[a].size - 2 * this.animations[a].frame, 0.001),
            this.round_corners + max(this.animations[a].frame, 20)
          );
        }
        this.animations[a].frame += 4;
      }
    }
  }

  check() {
    var collision = -1;
    for (let a = 0; a < this.tiles_count; a++) {
      let tile = this.tiles[a];
      if (
        mouseX > tile.x &&
        mouseX < tile.x + tile.size &&
        mouseY > tile.y &&
        mouseY < tile.y + tile.size
      ) {
        collision = a;
      }
    }
    return collision;
  }

  hover() {
    let coll = this.check();
    for (let a = 0; a < this.tiles_count; a++) {
      if (a === coll) this.tiles[a].hover = true;
      else this.tiles[a].hover = false;
    }
  }

  displayCollision() {
    let coll = this.check();
    if (coll !== -1) {
      let tile = this.tiles[coll];
      colorMode(RGB);
      fill(255, 0, 0, 100);
      rect(tile.x, tile.y, tile.size, tile.size);
    }
  }

  nextTile(tile) {
    this.animations.push(Object.assign({}, tile));
    this.animations[this.animations.length - 1].frame = 0;
    this.animations[this.animations.length - 1].stroke = false;
    colorMode(HSB);
    this.current_number++;
    tile.color = color(floor(random() * 10) * 36, 70, 100, 0.8);
    colorMode(RGB);
    tile.number = this.current_number;
  }
}

class Menu extends CanvasObject {
  constructor(
    x = 0,
    y = 0,
    width = 600,
    height = 400,
    margin = 0,
    padding = 0
  ) {
    super(x, y, width, height, margin, padding);
    this.round_corners = 4;
    this.background = "#FFAA44";
    this.image_template = {
      x: 0,
      y: 0,
      url: "assets/img/LOGO_shadow.png",
      img: undefined,
      width: 128,
      height: 128,
      disable: false,
      draw() {
        if (!this.disable)
          image(this.img, this.x, this.y, this.width, this.height);
      }
    };
    this.button_template = {
      x: 0,
      y: 0,
      width: 300,
      height: 60,
      text_size: 40,
      hover: false,
      color: "rgba(112,255,77,1)",
      hover_color: "rgba(51,255,0,1)",
      shadow: 60,
      round_corners: 4,
      pressed: false,
      text: "Start",
      action: () => {
        console.log("FUNCTION NOT SET");
      },
      draw() {
        if (this.shadow > 0) {
          fill(0, this.shadow);
          noStroke();
          rect(
            this.x + 6,
            this.y + 6,
            this.width,
            this.height,
            this.round_corners
          );
        }
        stroke(0);
        strokeWeight(3);
        if (this.hover) fill(this.hover_color);
        else fill(this.color);
        rect(this.x, this.y, this.width, this.height, this.round_corners);
        fill(0);
        if (this.hover) stroke(0);
        else stroke(0, 0);
        textSize(this.text_size);
        textAlign(CENTER);
        text(this.text, this.x + this.width / 2, this.y + this.height - 18);
      }
    };
    this.label_template = {
      x: 0,
      y: 0,
      width: 300,
      height: 60,
      text_size: 60,
      color: "rgba(112,255,77,1)",
      shadow: 70,
      text: "null",
      draw() {
        textSize(this.text_size);
        textAlign(CENTER);
        if (this.shadow > 0) {
          stroke(0, this.shadow);
          fill(0, this.shadow);
          text(this.text, this.x + 2, this.y + 2);
        }
        fill(this.color);
        text(this.text, this.x, this.y);
      }
    };
    this.buttons = [];
    this.images = [];
    this.labels = [];
  }

  draw() {
    noStroke();
    fill(this.background);
    rect(this.x, this.y, this.width, this.height, this.round_corners);
    for (let obj of this.buttons) {
      obj.draw();
    }
    for (let obj of this.images) {
      obj.draw();
    }
    for (let obj of this.labels) {
      obj.draw();
    }
  }

  init() {
    for (let obj of this.images) {
      obj.img = loadImage(obj.url);
    }
  }

  checkButtonHover() {
    let update = false;
    for (let obj of this.buttons) {
      if (
        mouseX < obj.x + obj.width &&
        mouseX > obj.x &&
        mouseY < obj.y + obj.height &&
        mouseY > obj.y
      ) {
        if (!obj.hover) {
          obj.hover = true;
          update = true;
        }
      } else {
        if (obj.hover) {
          obj.hover = false;
          update = true;
        }
      }
    }
    return update;
  }
}

class MainMenu extends Menu {
  constructor(
    x = 0,
    y = 0,
    width = 600,
    height = 400,
    margin = 0,
    padding = 0
  ) {
    super(x, y, width, height, margin, padding);
  }

  init() {
    this.buttons.push(Object.assign({}, this.button_template));
    this.images.push(Object.assign({}, this.image_template));
    this.labels.push(Object.assign({}, this.label_template));
    super.init();
    for (let obj of this.buttons) {
      obj.width = this.width * 0.7;
      obj.height = this.height * 0.15;
      obj.text_size = obj.height * 0.8;
      obj.x = this.x + this.width / 2 - obj.width / 2;
      obj.y = this.y + 0.75 * this.height - obj.height / 2;
    }
    for (let obj of this.images) {
      obj.width = this.height * 0.4;
      obj.height = this.height * 0.4;
      obj.x = this.x + this.width / 2 - obj.width / 2;
      obj.y = this.y + 0.45 * this.height - obj.height / 2;
    }
    for (let obj of this.labels) {
      obj.width = this.width * 0.6;
      obj.height = this.height * 0.15;
      obj.text_size = obj.height * 0.8;
      obj.x = this.x + this.width / 2;
      obj.y = this.y + 0.2 * this.height;
      obj.text = "Liczydełko";
    }
  }
}

class PauseMenu extends Menu {
  constructor() {
    super();
  }
}

class HeartUI extends Menu {
  constructor(
    x = 0,
    y = 0,
    width = 600,
    height = 400,
    margin = 0,
    padding = 0
  ) {
    super(x, y, width, height, margin, padding);
    this.count = 3;
    this.background = "rgba(0,0,0,0)";
  }

  init() {
    for (let i = 0; i < 3; i++) {
      this.images.push(Object.assign({}, this.image_template));
      this.images[i].url = "assets/img/heart.svg";
      this.images[i].y = i * 128 + this.y + this.margin;
      this.images[i].x = 0 + this.x;
      this.images[i].height = 100;
      this.images[i].width = 100;
    }
    super.init();
  }

  delete() {
    if (this.count > 0) {
      this.images[this.count - 1].disable = true;
      this.count--;
    }
  }

  reset() {
    for (let image of this.images) {
      image.disable = false;
    }
  }
}

class Timer extends CanvasObject {
  constructor(x = 600, y = 0, size = 200) {
    super(x, y, size, size, 30, 30);
    this.size = size;

    this.time_start = 420;
    this.time_ms = 0;
    this.time_ms_end = 0;
    this.time_s = 0;
    this.count_up = false;

    this.pause = true;
  }

  init() {
    this.time_ms_end = millis() + 1000;
    this.time_s = this.time_start;
    this.time_ms = this.time_ms_end - millis();
  }

  draw() {
    noStroke();
    strokeWeight((this.size / 200) * 7);
    for (let i = 0; i < 10; i++) {
      fill(0, 2 * i);
      ellipse(
        this.x + this.size / 2,
        this.y + this.size / 2,
        this.size - 2 * i
      );
    }
    fill(255);
    ellipse(
      this.x + this.size / 2,
      this.y + this.size / 2,
      this.size - this.margin
    );
    noFill();
    stroke(150);
    ellipse(
      this.x + this.size / 2,
      this.y + this.size / 2,
      this.size - 2 * this.margin
    );
    fill(70, 120, 255);
    noStroke();
    let offset_x =
      (this.size / 2 - this.margin) *
      sin(((this.time_ms - 1000 / 2) / 1000) * TWO_PI);
    let offset_y =
      (this.size / 2 - this.margin) *
      cos(((this.time_ms - 1000 / 2) / 1000) * TWO_PI);

    ellipse(
      this.x + this.size / 2 + offset_x,
      this.y + this.size / 2 + offset_y,
      (20 * this.size) / 200
    );
    for (let i = 0; i < 50; i++) {
      stroke(
        color(
          map(i, 0, 50, 70, 150),
          map(i, 0, 50, 120, 150),
          map(i, 0, 50, 255, 150),
          map(i, 0, 50, 255, 0)
        )
      );
      strokeWeight((this.size / 200) * 4);
      offset_x =
        (this.size / 2 - this.margin + (this.size / 200) * 3) *
        sin(
          ((this.time_ms -
            1000 / 2 +
            i * (1000 / 300) +
            (1 / this.size) * 200) /
            1000) *
            TWO_PI
        );
      offset_y =
        (this.size / 2 - this.margin + (this.size / 200) * 3) *
        cos(
          ((this.time_ms -
            1000 / 2 +
            i * (1000 / 300) +
            (1 / this.size) * 200) /
            1000) *
            TWO_PI
        );
      let offset_x2 =
        (this.size / 2 - this.margin - (this.size / 200) * 3) *
        sin(
          ((this.time_ms -
            1000 / 2 +
            i * (1000 / 300) +
            (1 / this.size) * 200) /
            1000) *
            TWO_PI
        );
      let offset_y2 =
        (this.size / 2 - this.margin - (this.size / 200) * 3) *
        cos(
          ((this.time_ms -
            1000 / 2 +
            i * (1000 / 300) +
            (1 / this.size) * 200) /
            1000) *
            TWO_PI
        );
      line(
        this.x + this.size / 2 + offset_x,
        this.y + this.size / 2 + offset_y,
        this.x + this.size / 2 + offset_x2,
        this.y + this.size / 2 + offset_y2
      );
    }
    fill(0);
    stroke(0);
    strokeWeight(3);
    textSize(this.size * 0.3);
    textAlign(CENTER);
    if (!this.pause) {
      this.time_ms = this.time_ms_end - millis();
      if (this.time_ms < 0) {
        this.time_s += this.count_up ? 1 : -1;
        this.time_ms_end += 1000;
      }
    } else {
      this.time_ms_end = millis() + this.time_ms;
    }
    let text_time =
      this.time_s < 3 && this.time_ms > 0
        ? (this.time_s + this.time_ms / 1000).toFixed(2)
        : this.time_s;
    text(text_time, this.x + this.size / 2, this.y + this.size * 0.65);
  }

  start() {
    this.init();
    this.pause = false;
  }

  pause() {
    this.pause = true;
  }
}

class Game {
  constructor() {
    this.states = {
      WAITING: 1,
      GAMELOOP: 2,
      MENU: 3,
      PAUSE: 4,
      COUNTING: 5,
      WIN: 6,
      LOSE: 7
    };
    this.state = this.states.MENU;
    this.update = 15;
    this.canvas = {
      width: 800,
      height: 600
    };
    this.shadows = true;
    this.hint_time = 0;

    this.main_menu = new MainMenu();
    this.pause_menu = new PauseMenu();
    this.win_menu = new MainMenu();
    this.lose_menu = new MainMenu();
    this.square_board = new SquareBoard();
    this.heartui = new HeartUI();
    this.gameloop_timer = new Timer();
    this.waiting_timer = new Timer();
  }

  draw() {
    if (this.update) {
      this.update--;
      background(235);
      switch (this.state) {
        case this.states.MENU:
          noStroke();
          this.drawSidebar();
          this.square_board.draw();
          this.gameloop_timer.draw();
          this.heartui.draw();
          fill(0, 128);
          rect(0, 0, this.canvas.width, this.canvas.height);
          this.main_menu.draw();
          break;
        case this.states.WAITING:
          {
            this.drawSidebar();
            this.square_board.draw();
            this.gameloop_timer.draw();
            this.heartui.draw();
            noStroke();
            if (
              this.waiting_timer.time_s == 0 &&
              this.waiting_timer.time_ms > 0
            ) {
              fill(0, map(this.waiting_timer.time_ms, 1000, 0, 128, 0, true));
            } else {
              fill(0, 128);
            }
            rect(0, 0, this.canvas.width, this.canvas.height);
            this.waiting_timer.draw();
            if (this.waiting_timer.time_s == -1) {
              this.state = this.states.GAMELOOP;
              this.gameloop_timer.start();
              this.heartui.count = 3;
              this.heartui.reset();
              this.hint_time = millis() + 10000;
            }
            this.update++;
          }
          break;
        case this.states.GAMELOOP:
          this.drawSidebar();
          this.gameloop_timer.draw();
          this.square_board.draw();
          this.square_board.hover();
          this.heartui.draw();
          if (
            this.square_board.current_number - this.square_board.tiles_count ==
            this.square_board.win_count
          ) {
            this.state = this.states.WIN;
            this.gameloop_timer.pause = true;
          }
          if (this.gameloop_timer.time_s == -1 || this.heartui.count == 0) {
            this.state = this.states.LOSE;
            this.gameloop_timer.pause = true;
          }
          if (this.hint_time < millis()) {
            for (let tile of this.square_board.tiles) {
              if (
                tile.number ==
                this.square_board.current_number -
                  this.square_board.tiles_count +
                  1
              ) {
                this.square_board.animations.push(Object.assign({}, tile));
                this.square_board.animations[
                  this.square_board.animations.length - 1
                ].frame = 0;
                this.square_board.animations[
                  this.square_board.animations.length - 1
                ].stroke = true;
              }
            }
            this.hint_time = millis() + 10000;
          }

          this.update += 1;
          break;
        case this.states.WIN:
          noStroke();
          this.drawSidebar();
          this.square_board.draw();
          this.gameloop_timer.draw();
          this.heartui.draw();
          fill(0, 128);
          rect(0, 0, this.canvas.width, this.canvas.height);
          this.win_menu.draw();
          break;
        case this.states.LOSE:
          noStroke();
          this.drawSidebar();
          this.square_board.draw();
          this.gameloop_timer.draw();
          this.heartui.draw();
          fill(0, 128);
          rect(0, 0, this.canvas.width, this.canvas.height);
          this.lose_menu.draw();
          break;
      }
    }
  }

  init() {
    game.canvas.height = windowHeight;
    game.canvas.width = (windowHeight * 8) / 6;
    if (this.canvas.width > windowWidth) {
      this.canvas.width = windowWidth;
      this.canvas.height = (windowWidth * 6) / 8;
    }
    createCanvas(this.canvas.width, this.canvas.height);
    this.main_menu.height = this.canvas.height * 0.8;
    this.main_menu.width = this.canvas.width * 0.8;
    this.win_menu.height = this.canvas.height * 0.8;
    this.win_menu.width = this.canvas.width * 0.8;
    this.lose_menu.height = this.canvas.height * 0.8;
    this.lose_menu.width = this.canvas.width * 0.8;
    this.main_menu.x = this.canvas.width / 2 - this.main_menu.width / 2;
    this.main_menu.y = this.canvas.height / 2 - this.main_menu.height / 2;
    this.main_menu.init();
    this.main_menu.buttons[0].action = () => {
      this.square_board.reset();
      this.state = this.states.WAITING;
      this.waiting_timer.start();
      this.heartui.count = 3;
      this.heartui.reset();
      this.update += 1;
    };
    this.win_menu.x = this.canvas.width / 2 - this.win_menu.width / 2;
    this.win_menu.y = this.canvas.height / 2 - this.win_menu.height / 2;
    this.win_menu.init();
    this.win_menu.buttons[0].action = () => {
      this.square_board.reset();
      this.state = this.states.WAITING;
      this.waiting_timer.start();
      this.heartui.count = 3;
      this.heartui.reset();
      this.update += 1;
    };
    this.win_menu.buttons[0].text = "Zagraj ponownie";
    this.win_menu.labels[0].text = "Wygrałeś !!!";
    this.lose_menu.x = this.canvas.width / 2 - this.lose_menu.width / 2;
    this.lose_menu.y = this.canvas.height / 2 - this.lose_menu.height / 2;
    this.lose_menu.init();
    this.lose_menu.buttons[0].action = () => {
      this.square_board.reset();
      this.state = this.states.WAITING;
      this.waiting_timer.start();
      this.heartui.count = 3;
      this.heartui.reset();
      this.update += 1;
    };
    this.lose_menu.buttons[0].text = "Zagraj ponownie";
    this.lose_menu.labels[0].text = "Przegrałeś :-(";
    this.square_board.width = this.canvas.width;
    this.square_board.height = this.canvas.height;
    this.square_board.size = this.canvas.height - 2 * this.square_board.margin;
    this.square_board.init();
    this.square_board.reset();
    this.gameloop_timer.init();
    this.waiting_timer.time_start = 3;
    this.waiting_timer.init();
    this.waiting_timer.x = (this.canvas.width - this.canvas.height * 0.5) / 2;
    this.waiting_timer.size = this.canvas.height / 2;
    this.waiting_timer.y = this.canvas.height / 2 - this.waiting_timer.size / 2;
    this.gameloop_timer.x = this.canvas.height;
    this.gameloop_timer.size = this.canvas.width - this.canvas.height;
    this.heartui.width = this.canvas.width - this.canvas.height;
    this.heartui.x = this.canvas.height + this.heartui.width / 2 - 50;
    this.heartui.y = this.gameloop_timer.y + this.gameloop_timer.size;
    this.heartui.init();
    this.heartui.count = 3;
    this.heartui.reset();
  }

  check() {
    switch (this.state) {
      case this.states.MENU:
        if (this.main_menu.checkButtonHover()) {
          this.update += 1;
        }
        break;
      case this.states.WIN:
        if (this.win_menu.checkButtonHover()) {
          this.update += 1;
        }
        break;
      case this.states.LOSE:
        if (this.lose_menu.checkButtonHover()) {
          this.update += 1;
        }
        break;
    }
  }

  touchStarted() {
    switch (this.state) {
      case this.states.MENU:
        for (let obj of this.main_menu.buttons) {
          if (obj.hover) obj.pressed = true;
          else obj.pressed = false;
        }
        break;
      case this.states.GAMELOOP:
        {
          let coll = this.square_board.check();
          if (coll != -1) {
            this.square_board.tiles[coll].pressed = true;
          }
        }
        break;
      case this.states.WIN:
        for (let obj of this.win_menu.buttons) {
          if (obj.hover) obj.pressed = true;
          else obj.pressed = false;
        }
        break;
      case this.states.LOSE:
        for (let obj of this.lose_menu.buttons) {
          if (obj.hover) obj.pressed = true;
          else obj.pressed = false;
        }
        break;
    }
  }

  touchEnded() {
    switch (this.state) {
      case this.states.MENU:
        for (let obj of this.main_menu.buttons) {
          if (obj.hover && obj.pressed) {
            obj.pressed = false;
            if (obj.action) {
              obj.action();
            }
          }
        }
        break;
      case this.states.GAMELOOP:
        for (let tile of this.square_board.tiles) {
          tile.warn = false;
          if (tile.pressed && tile.hover) {
            if (
              tile.number ==
              this.square_board.current_number -
                this.square_board.tiles_count +
                1
            ) {
              this.square_board.nextTile(tile);
            } else {
              this.heartui.delete();
              tile.warn = true;
            }
          }
          tile.pressed = false;
        }
        game.hint_time = millis() + 2000;
        break;
      case this.states.WIN:
        for (let obj of this.win_menu.buttons) {
          if (obj.hover && obj.pressed) {
            obj.pressed = false;
            if (obj.action) {
              obj.action();
            }
          }
        }
        break;
      case this.states.LOSE:
        for (let obj of this.lose_menu.buttons) {
          if (obj.hover && obj.pressed) {
            obj.pressed = false;
            if (obj.action) {
              obj.action();
            }
          }
        }
        break;
    }
  }

  drawSidebar() {
    let x = this.canvas.height;
    let shadow_width = 10;
    for (let i = 0; i < shadow_width; i++) {
      stroke(0, map(i, 0, shadow_width, 0, 70));
      line(x + i - shadow_width, 0, x + i - shadow_width, this.canvas.height);
    }
    noStroke();
    fill(200);
    rect(x, 0, this.canvas.width - this.canvas.height, this.canvas.height);
  }
}

/**************
 *    MAIN    *
 **************/

var game = new Game();

function setup() {
  game.init();
}

function draw() {
  game.check();
  game.draw();
}

function touchStarted() {
  game.touchStarted();
}

function touchEnded() {
  game.touchEnded();
}
