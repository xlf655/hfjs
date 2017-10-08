//如何设计这款游戏
//分为三个部分 用三个对象
//Controller 整合各个部分，获取玩家的输入以及实现游戏逻辑。
//Model 跟踪战舰：在什么地方，是否被击中以及是否被击沉。
//View 更新界面，指出玩家是否击中了战舰以及向用户显示消息。

//实现View对象 采用三个方法
//dispalyMessage,displayHit,displayMiss.
var view ={//定义View对象
  displayMessage:function (msg) {//实现displayMessage方法：使用DOM来获取id为messageArea的元素。将这个元素的innerHTML设置为传入的消息。
    //方法displayMessage接受一个参数msg。
    var messageArea=document.getElementById("messageArea");//获取网页中的元素messageArea
    messageArea.innerHTML=msg;//将元素messageArea的innerHTML设置为msg，以更改元素的文本。
  },
  //displayHit和displayMiss的工作原理：获取一个由两个数字组成的字符串id，它指出了要将哪个单元格的class特性设置为hit或miss。使用DOM来获取id为指定值的元素。在displayHit方法中，将该元素class特性设置为hit，在方法displauMiss中，将该元素的id设置为miss。
  displayHit:function (location) {
    var cell=document.getElementById(location);//使用根据玩家猜测生成的id来获取更新的元素
    cell.setAttribute("class","hit");//然后将这个元素的class特性设置为hit
  },
  displayMiss:function (location) {
    var cell=document.getElementById(location);//使用根据玩家猜测生成的id来获取更新的元素
    cell.setAttribute("class","miss");//然后将这个元素的class特性设置为miss
  }
};

//Model用于存储游戏的状态，通常还包含一些有管如何修改状态的逻辑。
var model={//定义Model对象
  boardSize:7,//游戏板网格的大小
  numShips:3,//游戏包含的战舰数
  shipsSunk:0,//有多少战舰已被击沉
  shipLength:3,//每艘战舰占据多少单元格

  ships:[//战舰所处的位置以及被击中的位置，将一个数组赋给变量ships，这个数组存储了全部三艘战舰
    {locations:[0,0,0],hits:["","",""]},//每艘战舰都是一个对象，包含了属性location和hits
    {locations:[0,0,0],hits:["","",""]},//location属性存储了战舰占据的游戏板单元格，注意到我们使用俩个数字来表示战舰占据的单元格，其中0对应于A，1对应于B，以此类推。
    {locations:[0,0,0],hits:["","",""]}],//hits属性也是一个数组，指出了战舰的各个部位是否被击中。我们将该数组的每个元素都初始化为空字符串，并在战舰的某个部位被击中的时候将相应元素改为“hit”。

    fire:function (guess) {//一个处理玩家向战舰开火的方法，它判断战舰是否被击中
      //实现fire方法：检查每艘战舰，看它是否占据了这个位置。如果是，就说明被击中了，因此需要设置数组hits的相应元素，并让视图知道击中了。为了指出击中了战舰，还需从方法fire返回true。如果没有战舰位于猜测的位置，就没有击中，我们让视图知道这一点，并从方法fire返回false。
      //方法fire接受一个参数guess
      for (var i = 0; i < this.numShips; i++) {//迭代数组ships，每次检查一艘战舰
        var ship=this.ships[i];//获得一艘战舰，接下来需要检擦guess是否是该战舰占据的位置之一
        var index=ship.locations.indexOf(guess);//indexOf() 方法可返回某个指定的字符串值在字符串中首次出现的位置。
        //如果guess包含在数组locations中，就说明击中了该战舰
        if (ship.hits[index] === "hit") {
  				view.displayMessage("Oops, you already hit that location!");
  				return true;
  			} else if (index >= 0) {
  				ship.hits[index] = "hit";
  				view.displayHit(guess);
  				view.displayMessage("HIT!");

  				if (this.isSunk(ship)) {
  					view.displayMessage("You sank my battleship!");
  					this.shipsSunk++;
  				}
  				return true;
  			}
  		}
  		view.displayMiss(guess);
  		view.displayMessage("You missed.");
  		return false;
  	},
    isSunk:function(ship) {//方法isSunk，接受一艘战舰作为参数，在该战舰被击沉是返回true，还浮在水面是返回false
      for (var i = 0; i < this.shipLength; i++) {//将一艘战舰作为参数，并检查是否每个部位都被击中。
       if (ship.hits[i]!=="hit") {
         return false;//只要任何部位未被击中，战舰就还浮在水面上，因此返回false
       }
     }
     return true;//否则，战舰已被击沉，因此返回true
   },

   //如何放置战舰
   //generateShipLocations： 这是主方法，它创建model对象中的ships数组，其中包含的战舰数由model对象的属性numShips指定。
   //generateShip： 这个方法创建一艘战舰，并指定其在游戏板中的位置。指定的位置可能与其他战舰重叠，也可能不重叠
   //collision： 这个方法将一艘战舰作为参数，并判断它是否与游戏板中既有的战舰重叠
   generateShipLocations:function () {
     var locations;
     for (var i = 0; i < this.numShips; i++) {//循环次数为要生成位置的战舰数相同
       do {
         locations=this.generateShip();//生成战舰占据的一系列位置
       } while (this.collision(locations));//并检查这些位置与游戏板中既有战舰的位置是否重叠。如果重叠，就需要再次尝试，不断地生成新位置，直到不重叠为止
       this.ships[i].locations=locations;//生成可行的位置后，将其赋给数组Model.ships中相应战舰的属性locations
     }
     console.log("Ships array: ");
     console.log(this.ships);
   },
   generateShip:function() {
     var direction=Math.floor(Math.random()*2);
     var row,col;
     if (direction===1) {
       row=Math.floor(Math.random()*this.boardSize);
       col=Math.floor(Math.random()*(this.boardSize-this.shipLength+1));
     } else {
       row=Math.floor(Math.random()*(this.boardSize-this.shipLength+1));
       col=Math.floor(Math.random()*this.boardSize);
     }
     var newShipLocations=[];
     for (var i = 0; i < this.shipLength; i++) {
       if (direction===1) {
         newShipLocations.push(row+""+(col+i));
       } else {
         newShipLocations.push((row+i)+""+col);
       }

      }
      return newShipLocations;
   },
   collision:function(locations) {
     for (var i = 0; i < this.numShips; i++) {
       var ship =this.ships[i];
       for (var j = 0; j < locations.length; j++) {
         if (ship.locations.indexOf(locations[j])>=0) {
           return true;
         }
       }
     }
     return false;
   }
   };



//实现控制器：获取玩家处理的猜测。纪录猜测的次数。让模型根据当前猜测更新自己。判断游戏是否结束


var controller={   //定义Controller对象
  guesses:0,//纪录猜测次数。
  processGuess:function(guess) {//对猜测位置进行处理，再将结果交给模型，检测游戏是否结束
    var location=parseGuess(guess);//使用paresGuess来验证玩家猜测的有效性。
    if (location) {//只要返回的不是null，就说明获得的位置是有效的
      this.guesses++;//如果猜测有效，guesses+1
      var hit=model.fire(location);//以字符串形式将行号和列号传递给model方法中的fire
      if (hit&&model.shipsSunk===model.numShips) {//如果击中战舰，且击沉的战舰数与有戏包含的战舰数相等，就向晚间显示一条消息，击沉了全部的战舰。
        view.displayMessage("你通过"+this.guesses+" 次,击沉了我的全部战舰。")//指出通过多少次的猜测击沉了全部的战舰。
      }
    }
  }
}

//简单的转换函数 将字母转换为相应的数字
function parseGuess(guess) {//将猜测的位置给形参guess
  var alphabet=["A","B","C","D","E","F","G"];//一个数组，包含可出现在有效猜测中的所有字母
  if (guess===null||guess.length!==2) {//检查guess不为null且长度为2
    alert("请输入游戏板上的字母和数字。");//如果不是，提醒玩家。
  } else {
    firstChar=guess.charAt(0);//获取guess中的第一个字符
    var row =alphabet.indexOf(firstChar);//使用indexof获取一个0-6的数字，它是这个字母在数组中的位置，
    var column=guess.charAt(1);
    if (isNaN(row)||isNaN(column)) {//使用isNaN函数检查row和cilumn是否都是数字。
      alert("哦不，输入不在游戏板上。");
    } else if (row<0||row>=model.boardSize||column<0||column>=model.boardSize) {
      alert("输入超出范围了。");
    }else {
      return row+column;
    }
  }
  return null;//如果执行到这里，说明有检查是失败的，因此返回null
}

function handleFireButton() {
  var guessInput=document.getElementById("guessInput");
  var guess=guessInput.value.toUpperCase();
  controller.processGuess(guess);//将玩家的猜测交给控制器
  guessInput.value="";//将输入的元素重置为空字符串。

}

function handleKeyPress(e) {//只用按回车键就可提交输入
  var fireButton=document.getElementById("fireButton");
  e = e || window.event;
  if (e.keyCode===13) {
    fireButton.click();
    return false;
  }
}
window.onload =init;
//获取玩家的猜测：玩家输入猜测并单击fire按钮，fire按钮被单击时，将调用一个预先制定的事件处理程序，这个事件处理程序获取表单中玩家的输入，并将其交给控制器。

function init () {
  //给Fire！按钮添加事件处理程序
  var fireButton=document.getElementById("fireButton");//首先，是有Fire！按钮的id获取一个指向它的引用。
  fireButton.onclick=handleFireButton;//然后，这个按钮添加单击事件处理程序handleFireButton
  //获取表单中玩家的caice
  var guessInput=document.getElementById("guessInput");//首先，使用这个表单元素的id来获取一个指向它的引用
  guessInput.onkeypress=handleKeyPress;//然后，从这个表单元素中获取猜测，它存储在这个表单元素的属性value中
  model.generateShipLocations();
}
