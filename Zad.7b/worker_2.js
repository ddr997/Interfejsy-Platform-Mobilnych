onmessage = function (e){
    function CountNumer(str){
        var temp = 0;
        var i = 0;
        var sum = 0;
        while (i < str.length){
            var l = str.charAt(i);
            if(l == l.toUpperCase()){
                temp = str.charCodeAt(i) -64;
            }else{
                temp = str.charCodeAt(i) -96;
            }   
            i += 1;
            sum += temp;
        }
        var r,g,b;
        r = sum % 255;
        g = 255 - (r);
        b = (0.5*r>125)?99:199;
        return "rgb("+r+","+g+","+b+")";
    }
    var data_2 = e.data;
    var data_2= CountNumer(data_2);
    self.postMessage(data_2);
}