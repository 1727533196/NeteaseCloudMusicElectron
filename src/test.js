
var num = 0;
outPoint:
    for (var i = 0 ; i < 10 ; i++){
        for (var j = 0 ; j < 10 ; j++){
            if( i == 5 && j == 5 ){
                break outPoint; // 在 i = 5，j = 5 时，跳出所有循环，
                                // 返回到整个 outPoint 下方，继续执行
            }
            num++;
        }
    }
    console.log(11)

alert(num); // 输出 55