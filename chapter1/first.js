var word="酸梅汤";
var count=54;
while (count>0) {
  console.log(count+"瓶"+word+"在桌子上。")
  console.log("喝了一瓶，还剩几瓶？");
  count=count-1;
  if (count>0) {
    console.log("还剩"+count+"瓶。");
  } else {
    console.log("没有了，都喝完啦。");
  }
}
