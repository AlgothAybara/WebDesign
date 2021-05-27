//  Author: Aaron Young 
//  Date:   05/27/2021
//  File:   scripts.js

//Character class, contains stat and position infor. 
class Character {
  constructor(type, health, positionX, positionY, attack, defense, plyrNum) {
    this.type = type;
    this.img = `images/${type}.jpg`
    this.health = health;
    this.attack = attack;
    this.defense = defense;
    this.positionX = positionX;
    this.positionY = positionY;
    this.plyrNum = plyrNum
  }
}

var moves = 0;
var players = [];
// array with character types
characterTypes = [
  ['Retiarius', 6, 4, 1],
  ['Thracian', 7, 2, 3],
  ['Bestiarus', 7, 3, 2]
];

//swaps image and caption when user changes character type.
document.getElementById("player1").addEventListener("change", function () {
  document.getElementById("display1").src = `images/${characterTypes[document.getElementById("player1").value][0]}.jpg`;
});
document.getElementById("player2").addEventListener("change", function () {
  document.getElementById("display2").src = `images/${characterTypes[document.getElementById("player2").value][0]}.jpg`;
});

//Function keeps track of completed turns
function turnCount() {  
  return turncount % 2;
}

//Function changes character info sheet based on player turn.
function updateDisplay(players) {
  if (turnCount() == 0) {
    document.getElementById("playerNum").innerHTML = "Player 1"
  } else {
    document.getElementById("playerNum").innerHTML = "Player 2"
  }
  document.getElementById('image').src = players[turnCount()].img;
  document.getElementById('type').innerHTML = `${players[turnCount()].type}`
  document.getElementById('health').innerHTML = `Health: ${players[turnCount()].health}`
  document.getElementById('attack').innerHTML = `Attack: ${players[turnCount()].attack}`
  document.getElementById('defense').innerHTML = `Defense: ${players[turnCount()].defense}`
}

//allows for movement of character
function move(e) {
  e = e || window.event;

  person = turnCount();
  console.log(person)
  Xposition = players[person].positionX;
  Yposition = players[person].positionY;

  (person == 0 ? other = 1 : other = 0);

  // up arrow
  if (e.keyCode == '38' && players[person].positionY > 1) {
    players[person].positionY--;
    moves--;
  }

  // down arrow
  else if (e.keyCode == '40' && players[person].positionY < height) {
    players[person].positionY++;
    moves--;
  }

  // left arrow
  else if (e.keyCode == '37' && players[person].positionX > 1) {
    players[person].positionX--;
    moves--;
  }

  // right arrow
  else if (e.keyCode == '39' && players[person].positionX < width) {
    players[person].positionX++;
    moves--;
  }

  //Prevents players from occupying the same space
  if (players[person].positionX == players[other].positionX && players[person].positionY == players[other].positionY) {
    players[person].positionX = Xposition;
    players[person].positionY = Yposition;
  } else {
    //updates player image html
    document.getElementById(`(${Xposition},${Yposition})`).innerHTML = `<img src='images/tile.jpg' class='tile'></th>`
    document.getElementById(`(${players[person].positionX},${players[person].positionY})`).innerHTML = `<img src='${players[person].img}' class='tile'/>`;
    console.log(players[person].positionX)
    console.log(players[person].positionY)

  }
  //Prevents movement if no moves are left.
  if (moves == 0) {
    document.onkeydown = "";
  }
}


//dice functions

//calls movement dice and updates global variable
document.getElementById("roll").addEventListener("click", function () {
  document.onkeydown = move;
  moves = moveDice()
  console.log(moves)
  document.getElementById("roll").style = "visibility: hidden";

  if (turnCount() == 0) {
    document.getElementById("message").innerHTML = `Player 1 rolled a/an ${moves}`
  } else {
    {
      document.getElementById("message").innerHTML = `Player 2 rolled a/an ${moves}`
    }
  }
})

//calculates rolls
function combatDice() {
  roll = Math.floor((Math.random() * 6) + 1);
  return roll % 2;
}

//rolls dice and updates img
function moveDice() {
  num1 = Math.floor((Math.random() * 6) + 1);
  num2 = Math.floor((Math.random() * 6) + 1);
  // console.log(num1, num2);
  document.getElementById("diceBottom").innerHTML = `<img class="diceImg" src="images/dice${num1}.png"><img class="diceImg" src="images/dice${num2}.png">`;
  return num1 + num2
}

//builds arena. thinking about separating into multiple functions...
document.getElementById("build").addEventListener("click", function () {
  turncount = 0;
  height = document.getElementById("height").value;
  width = document.getElementById("width").value;
  player1 = document.getElementById("player1").value;
  player2 = document.getElementById("player2").value;

  document.getElementById("setup").style = "display: none;"
  //builds gameboard html
  var gameBoard = `<table>`;
  for (var i = 0; i < height; i++) {
    gameBoard += "<tr>";
    for (var j = 0; j < width; j++) {
      gameBoard += `<th class='cell' id='(${j+1},${i+1})'><img src='images/tile.jpg' class='tile'></th>`;
    }
    gameBoard += "</tr>";
    // console.log(gameBoard);
  }
  gameBoard += "</table>"

  //sets player classes and adds to array
  p1Type = document.getElementById("player1").value;
  p2Type = document.getElementById("player2").value
  var plyr1 = new Character(characterTypes[p1Type][0], characterTypes[p1Type][1], 1, 1, characterTypes[p1Type][2], characterTypes[p1Type][3], 1);
  var plyr2 = new Character(characterTypes[p2Type][0], characterTypes[p2Type][1], height, width, characterTypes[p2Type][2], characterTypes[p2Type][3], 2);
  players = [plyr1, plyr2];

  //writes gameboard html
  document.getElementById("board").innerHTML = gameBoard;
  document.getElementById("(1,1)").innerHTML = `<img src='${plyr1.img}' class='tile'/>`;
  document.getElementById(`(${j},${i})`).innerHTML = `<img src='${plyr2.img}' class='tile'/>`;

  //various styles and html
  document.getElementById("endTurn").style = "display: block;"
  document.getElementById("dice").style = "display: initial;"
  document.getElementById("stuff").style = "display:flex;"
  document.getElementById("plyrDisp1").style = "display: initial";
  updateDisplay(players);

  //Ends turn when button pressed
  document.getElementById("endTurn").addEventListener("click", function () {
    if (plyr1.health > 0 && plyr2.health > 0) {
      turncount++;
      updateDisplay(players)

      //html changes
      document.getElementById("roll").style = "visibility: visible";
      document.getElementById("attackButton").style = "visibility: visible";

      document.getElementById("diceBottom").innerHTML = "";
      document.getElementById("attacker").innerHTML = "";
      document.getElementById("defender").innerHTML = "";


    } else {
      console.log("end game");
    }
  });

  //calls combat dice and calculates combat
  document.getElementById("attackButton").addEventListener("click", AttackButton())
});


//Creates the attack routine to execute when the attack button is clicked
function AttackButton(){
  //checks if players are adjacent
  if (plyr1.positionX == plyr2.positionX - 1 || plyr1.positionX == plyr2.positionX + 1 || plyr1.positionX == plyr2.positionX) {
    if (plyr1.positionY == plyr2.positionY - 1 || plyr1.positionY == plyr2.positionY + 1 || plyr1.positionY == plyr2.positionY) {
      attack = [];
      defense = [];
      totAttack = 0;
      totDefense = 0;
      AttackHTML = '';
      DefenseHTML = '';

      if (turnCount() == 0) //player1
        {
          Combat(plyr1, plyr2)        
        } 
      else //player2
        {
          Combat(plyr2, plyr1)
        }
      console.log("Attack", totAttack);
      console.log("Defense", totDefense);
      document.getElementById("attacker").innerHTML = AttackHTML;
      document.getElementById("defender").innerHTML = DefenseHTML;
      document.getElementById("attackButton").style = "visibility: hidden";
      document.getElementById("dice").style = "display:block;";

      if (plyr1.health <= 0) 
        {
          WinMessage(2)
        } 
      else if (plyr2.health <= 0) 
        {
          WinMessage(1)
        }
    }
  }
}

//Completes combat calculations. Receives attacking and defending players
function Combat(attacker, defender){
  //Rolls attacker and defender dice
  for (i = 0; i < attacker.attack; i++) { //rolls attacker attack dice
    dieAttack = combatDice();
    attack.push(dieAttack);
    totAttack += dieAttack;
    (dieAttack == 1 ? AttackHTML += '<img class="diceImg" src="images/diceSword.png">' : AttackHTML += '<img class="diceImg" src="images/diceShield.png">')
  }
  console.log(attack);
  for (i = 0; i < defender.defense; i++) { //rolls defender defense dice
    dieDefense = combatDice();
    defense.push(dieDefense);
    totDefense += dieDefense;
    (dieDefense == 1 ? DefenseHTML += '<img class="diceImg" src="images/diceShield.png">' : DefenseHTML += '<img class="diceImg" src="images/diceSword.png">')

  }

  //Calculates damage
  if (totAttack > totDefense) {
    totAttack -= totDefense;
    defender.health -= totAttack;
    document.getElementById("message").innerHTML = `Player ${defender.plyrNum} recieved ${totAttack} points of damage. <br>His health is now: ${defender.health}`
  } else {
    document.getElementById("message").innerHTML = `Player ${attacker.plyrNum}'s attack failed.`
  }
}

//displays win message when player is defeated
function WinMessage(winner){
  document.getElementById("message").innerHTML = `Player ${winner} wins!`;
  document.getElementById("message").style = "font-weight: bold;";
  document.getElementById("endTurn").style = "display: none;"
  document.getElementById("roll").style = "display: none;"
  document.getElementById("attackButton").style = "display: none;"
}