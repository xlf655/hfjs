//战舰位置
var randomLoc =Math.floor(Math.random()*5);
var location1 = randomLoc;
var location2 = location1+1;
var location3 = location2+1;

var guess;//用户猜测位置
var hits = 0;//击中数
var guesses = 0;//猜测次数
//定义未击沉
var isSunk = false;

while (isSunk==false) { //循环：只要战舰未被击沉
  guess = prompt("Ready,aim,fire!(enter a number 0-6:)"); //获取用户的猜测
  if (guess<0 || guess>6) {
    alert("Please enter a valid cell number!");
  } else {
    guesses=guesses+1;
    if (guess == location1 || guess == location2 || guess == location3) {
      hits=hits+1;
      alert("HITS!")
      if (hits==3) {
        isSunk=true;
        alert("You sank my battleship!");
      }
    } else {
      alert ("MISS!")
    }
  }
}
var stats="You took"+guesses+"guesses to sink the battleship,"+"which means your shooting accuracy was "+(3/guesses);
alert(stats);
