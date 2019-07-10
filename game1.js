var config = {
  type: Phaser.WEBGL,
  width: 1200,
  height: 450,
  backgroundColor: '#bfcc00',
  parent: 'phaser-example',
  scene: {
      preload: preload,
      create: create,
      update: update
  }
};

const gameState = {}
var player;
var recurso;  // refatorar pra espadas
var recurso2; // refatorar pra diamantes
var cursors;
var sword = 0;
var diamond = 0;
var swordText;
var diamondText;
var soldado = 0;
var mage = 0;
var dragon= 0;
var soldadoText;
var mageText;
var dragonText;
var predio1;
var predio2;
var predio3;

//  Direction consts
var UP = 0;
var DOWN = 1;
var LEFT = 2;
var RIGHT = 3;

var game = new Phaser.Game(config);

function preload ()
{
  this.load.audio('incredible', 'https://s3.amazonaws.com/codecademy-content/courses/learn-phaser/incredible.mp3');
  this.load.audio('awesome', 'https://s3.amazonaws.com/codecademy-content/courses/learn-phaser/reallyawesome.mp3');
  this.load.image('recurso', 'https://image.flaticon.com/icons/png/512/95/95606.png');
  this.load.image('recurso2', 'https://img.icons8.com/ios/2x/minecraft-diamond-filled.png');
  this.load.image('body', 'https://2.bp.blogspot.com/_uPtndivHOEE/SWQMGvitR4I/AAAAAAAAAAs/Piyev2uWndI/S220/Link+NES.png');
}

function create ()
{
  
  var Recurso = new Phaser.Class({

      Extends: Phaser.GameObjects.Image,

      initialize:

      function Recurso (scene, x, y)
      {
          Phaser.GameObjects.Image.call(this, scene)

          this.setTexture('recurso').setScale(0.05);
          this.setPosition(x * 16, y * 16);
          this.setOrigin(0);

          this.total = 0;

          scene.children.add(this);
      },

      eat: function ()
      {
          sword++;
          swordText.setText('Swords: ' + sword);
          this.total++;
      }

  });

  var Recurso2 = new Phaser.Class({

    Extends: Phaser.GameObjects.Image,

    initialize:

    function Recurso2 (scene, x, y)
    {
        Phaser.GameObjects.Image.call(this, scene)

        this.setTexture('recurso2').setScale(0.2);
        this.setPosition(x * 16, y * 16);
        this.setOrigin(0);

        this.total = 0;

        scene.children.add(this);
    },

    eat: function ()
    {
        diamond++;
        diamondText.setText('Diamonds: ' + diamond);
        this.total++;
    }

});


// iniciando code do predio
/*var predio1 = new Phaser.Class({

  Extends: Phaser.GameObjects.Image,

  initialize:

  function predio1 (scene, x, y)
  {
      Phaser.GameObjects.Image.call(this, scene)

      this.setTexture('#photo').setScale(0.2);
      this.setPosition(x * 16, y * 16);
      this.setOrigin(0);

      this.total = 0;

      scene.children.add(this);
  },

  batalha: function ()
  {
  }

});*/

  var Player = new Phaser.Class({

      initialize:

      function Player (scene, x, y)
      {
          this.headPosition = new Phaser.Geom.Point(x, y);

          this.body = scene.add.group();

          this.head = this.body.create(x * 16, y * 16, 'body').setScale(0.35);
          this.head.setOrigin(0);
          this.alive = true;

          this.speed = 100;

          this.moveTime = 0;

          this.heading = RIGHT;
          this.direction = RIGHT;
      },

      update: function (time)
      {
          if (time >= this.moveTime)
          {
              return this.move(time);
          }
      },

      faceLeft: function ()
      {
          if (this.direction === UP || this.direction === DOWN)  // verifica rotacao do eixo invalido
          {
              this.heading = LEFT; // salva direcao
          }
      },

      faceRight: function ()
      {
          if (this.direction === UP || this.direction === DOWN) // verifica rotacao do eixo invalido
          {
              this.heading = RIGHT; // salva direcao
          }
      },

      faceUp: function ()
      {
          if (this.direction === LEFT || this.direction === RIGHT) // verifica rotacao do eixo invalido
          {
              this.heading = UP; // salva direcao
          }
      },

      faceDown: function ()
      {
          if (this.direction === LEFT || this.direction === RIGHT) // verifica rotacao do eixo invalido
          {
              this.heading = DOWN; // salva direcao
          }
      },

      move: function (time)
      {
          /**
          * Direcao
          */
          switch (this.heading)
          {
              case LEFT:
                  this.headPosition.x = Phaser.Math.Wrap(this.headPosition.x - 1, 0, 40); //
                  break;

              case RIGHT:
                  this.headPosition.x = Phaser.Math.Wrap(this.headPosition.x + 1, 0, 40);
                  break;

              case UP:
                  this.headPosition.y = Phaser.Math.Wrap(this.headPosition.y - 1, 0, 30);
                  break;

              case DOWN:
                  this.headPosition.y = Phaser.Math.Wrap(this.headPosition.y + 1, 0, 30);
                  break;
          }

          this.direction = this.heading;

          Phaser.Actions.ShiftPosition(this.body.getChildren(), this.headPosition.x * 16, this.headPosition.y * 16, 1, this.tail);


          var hitBody = Phaser.Actions.GetFirst(this.body.getChildren(), { x: this.head.x, y: this.head.y }, 1);

          // Autocolide
              //  Update pro prixmo frame
              this.moveTime = time + this.speed;

              return true;

      },

      collideWithRes: function (recurso)
      {
          if (this.head.x === recurso.x && this.head.y === recurso.y)
          {

              recurso.eat();
              return true;
          }
      },

      updateGrid: function (grid)
      {
          //  Remove all body pieces from valid positions list
          this.body.children.each(function (segment) {

              var bx = segment.x / 16;
              var by = segment.y / 16;

              grid[by][bx] = false;

          });

          return grid;
      }

  });

  recurso = new Recurso(this, 3, 4);
  recurso2 = new Recurso2(this, 8, 10);

  player = new Player(this, 10, 10);

  //  Intarface de Menu
  gameState.incredible = this.sound.add('incredible');
  gameState.awesome = this.sound.add('awesome');
  cursors = this.input.keyboard.createCursorKeys();
  gameState.box0 = this.add.rectangle(920, 225, 550, 430, 0xFFFFFF)
  gameState.box1 = this.add.rectangle(1000, 100, 150, 100, 0xdadaaa)
  gameState.incredibleText1 = this.add.text(935, 90, "Criar Soladado", { fill: "#222222", font: "16px Roboto Mono"})
  gameState.soldadoText = this.add.text(1090, 70, "Soldados: 0", { fill: "#222222", font: "14px Roboto Mono"})
  swordText = this.add.text(675, 100, 'Swords: 0', { fontSize: '30px', fill: '#000000' });
  diamondText = this.add.text(675, 200, 'Diamonds: 0', { fontSize: '30px', fill: '#000000' });
  gameState.box2 = this.add.rectangle(1000, 225, 150, 100, 0xdadaaa)
  gameState.incredibleText2 = this.add.text(950, 215, "Criar Mago", { fill: "#222222", font: "16px Roboto Mono"})
  gameState.mageText = this.add.text(1090, 200, "Magos: 0", { fill: "#222222", font: "14px Roboto Mono"})
  gameState.box3 = this.add.rectangle(1000, 350, 150, 100, 0xdadaaa)
  gameState.incredibleText3 = this.add.text(945, 340, "Criar Dragão", { fill: "#222222", font: "16px Roboto Mono"})
  gameState.dragonText = this.add.text(1090, 315, "Dragões: 0", { fill: "#222222", font: "14px Roboto Mono"})
  gameState.box0.setInteractive();
  gameState.box1.setInteractive();
  gameState.box2.setInteractive();
  gameState.box3.setInteractive();

  gameState.box1.on('pointerdown', function() {
    gameState.incredible.play();
    if (sword > 0) {
    sword--;
    swordText.setText('Swords: ' + sword);
    soldado++;
    gameState.soldadoText.setText('Soldados: ' + soldado);
    }
  })
  gameState.box2.on('pointerdown', function() {
    gameState.incredible.play();
    if (diamond > 0) {
      diamond--;
      diamondText.setText('Diamonds: ' + diamond);
      mage++;
      gameState.mageText.setText('Magos: ' + mage);
      }
  })
  gameState.box3.on('pointerdown', function() {
    gameState.awesome.play();
    if (diamond >= 3) {
      diamond = diamond - 3;
      diamondText.setText('Diamonds: ' + diamond);
      dragon++;
      gameState.dragonText.setText('Dragões: ' + dragon);
      }
  })
}
// Fim fa interface de menu

function update (time, delta)
{
  if (!player.alive)
  {
      return;
  }

  /**
  * Verifica clicks
  */
  if (cursors.left.isDown)
  {
      player.faceLeft();
  }
  else if (cursors.right.isDown)
  {
      player.faceRight();
  }
  else if (cursors.up.isDown)
  {
      player.faceUp();
  }
  else if (cursors.down.isDown)
  {
      player.faceDown();
  }

  if (player.update(time))
  {
      //  checa colisao

      if (player.collideWithRes(recurso))
      {
          repositionResource();
      }
      if (player.collideWithRes(recurso2))
      {
          repositionResource2();
      }
  }
}

/**

* Temos que dar respawn nos recurso, sem ser em cima do player
* @method repositionFood
* @return {boolean} true se o recurso for colocado
*/
function repositionResource ()
{
  var testGrid = [];

  for (var y = 0; y < 30; y++)
  {
      testGrid[y] = [];

      for (var x = 0; x < 40; x++)
      {
          testGrid[y][x] = true;
      }
  }

  player.updateGrid(testGrid);

  //  Tira posicoes falsas
  var validLocations = [];

  for (var y = 0; y < 30; y++)
  {
      for (var x = 0; x < 40; x++)
      {
          if (testGrid[y][x] === true)
          {
              validLocations.push({ x: x, y: y }); // Adicionamos na posicao 
          }
      }
  }

  if (validLocations.length > 0)
  {
      //  random
      var pos = Phaser.Math.RND.pick(validLocations);

      //  posiciona
      recurso.setPosition(pos.x * 16, pos.y * 16);

      return true;
  }
  else
  {
      return false;
  }
}

function repositionResource2 ()
{
  var testGrid = [];

  for (var y = 0; y < 30; y++)
  {
      testGrid[y] = [];

      for (var x = 0; x < 40; x++)
      {
          testGrid[y][x] = true;
      }
  }

  player.updateGrid(testGrid);

  //  Tira posicoes falsas
  var validLocations = [];

  for (var y = 0; y < 30; y++)
  {
      for (var x = 0; x < 40; x++)
      {
          if (testGrid[y][x] === true)
          {
              validLocations.push({ x: x, y: y }); // Adicionamos na posicao 
          }
      }
  }

  if (validLocations.length > 0)
  {
      //  random
      var pos = Phaser.Math.RND.pick(validLocations);

      //  posiciona
      recurso2.setPosition(pos.x * 16, pos.y * 16);

      return true;
  }
  else
  {
      return false;
  }
}

