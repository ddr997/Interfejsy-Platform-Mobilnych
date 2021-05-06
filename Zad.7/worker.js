onmessage = function (e){
    function LetterSize(str){
        var temp = '';
        var i = 0;
        while (i < str.length){
            var l = str.charAt(i);
            if(l == l.toUpperCase()){
                l = l.toLowerCase();
            }else{
                l = l.toUpperCase();
            }
            i += 1;
            temp += l;
        }
        return temp;
    }
    var data = JSON.parse(e.data);
    Object.keys(data).forEach(function (key){
        data[key] = LetterSize(data[key]);
    })

    self.postMessage(JSON.stringify(data));
}