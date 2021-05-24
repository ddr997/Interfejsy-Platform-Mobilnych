//prefixes of implementation that we want to test
window.indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;

//prefixes of window.IDB objects
window.IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.msIDBTransaction;
window.IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange || window.msIDBKeyRange;

if (!window.indexedDB) {
    window.alert("Brak wsparcia IndexedDB na twoja przegladarke.")
};

const employeeData = [{id:"01", name:"Jan", surname:"Kowalski", age:"20", nd:"CAY123456", postal:"22-550", email:"example@wp.pl", www:"https://krzak.pl", date:"Thu Apr 29 2021"}];

var db;
var request = window.indexedDB.open("newDatabase", 1);

request.onerror = function (event) {
    console.log("Nie udało się połączyć z bazą");
};

request.onsuccess = function (event) {
    db = request.result;
    console.log("Udało się polączyć z bazą: ", db);
    loadTable();
};

request.onupgradeneeded = function (event) {
    var db = event.target.result;
    var objectStore = db.createObjectStore("employee", {keyPath: "id", autoIncrement: true});
    for (var i in employeeData) {
        objectStore.add(employeeData[i]);
    }
}

$(function(){
    $('#search').keyup(function() {
      searchtable();
    });
  });

window.onerror = function(){
    return true;
 }

function loadTable() {
    var employees = "";
    $('.employee').remove();

    var objectStore = db.transaction("employee",  "readwrite").objectStore("employee");
    objectStore.openCursor().onsuccess = function (event) {
    var cursor = event.target.result;
    if (cursor) {
            employees = employees.concat(
                '<tr class="employee">' +
                '<td class="ID" onblur="greeting(this.id,'+cursor.key+',1)" contenteditable="true" id="id'+ cursor.key +'">' + cursor.key + '</td>' +
                '<td class="Imie" onblur="greeting(this.id,'+cursor.key+',2)" contenteditable="true" id="imie'+ cursor.key +'">' + cursor.value.name + '</td>' +
                '<td class="Nazwisko" onblur="greeting(this.id,'+cursor.key+',3)" contenteditable="true" id="nazwisko'+ cursor.key +'">' + cursor.value.surname + '</td>' +
                '<td class="Wiek" onblur="greeting(this.id,'+cursor.key+',4)" contenteditable="true" id="wiek'+ cursor.key +'">' + cursor.value.age + '</td>' +
                '<td class="numer_dowodu" onblur="greeting(this.id,'+cursor.key+',5)" contenteditable="true" id="numer_dowodu'+ cursor.key +'">' + cursor.value.nd + '</td>' +
                '<td class="kod_pocztowy" onblur="greeting(this.id,'+cursor.key+',6)" contenteditable="true" id="kod_pocztowy'+ cursor.key +'">' + cursor.value.postal + '</td>' +
                '<td class="Email" onblur="greeting(this.id,'+cursor.key+',7)" contenteditable="true" id="email'+ cursor.key +'">' + cursor.value.email + '</td>' +
                '<td class="WWW" onblur="greeting(this.id,'+cursor.key+',8)"  contenteditable="true" id="www'+ cursor.key +'">' + cursor.value.www + '</td>' +
                '<td class="Data" onblur="greeting(this.id,'+cursor.key+',9)"  contenteditable="true" id="data'+ cursor.key +'">' + cursor.value.date + '</td>' +
                '<td class="Image"><img src="' + cursor.value.img + '" width="100" height="100"></td>' +
                '<td><button style="background-color:red;" onClick="deleteEmployee(\'' + cursor.key + '\')">X</button>' +
                '</tr>');
                } else {
            $('thead').after(employees);
                  }
    cursor.continue();
    };
}

function addEmployee() {
    var employeeID = $('#add_id').val();
    var name = $('#add_name').val();
    var surname = $('#add_surname').val();
    var age = $('#add_age').val();
    var nd = $('#add_nd').val();
    var postal = $('#add_postal').val();
    var email = $('#add_email').val()
    var www = $('#add_www').val();
    var date = $('#add_date').val();
    var img = document.getElementById('myCanvas').toDataURL('image/jpeg', 1.0);

    var request = db.transaction(["employee"], "readwrite")
        .objectStore("employee")
        .add({
            id: employeeID,
            name: name,
            surname: surname,
            age: age,
            nd: nd,
            postal: postal,
            email: email,
            www: www,
            date: date,
            img: img
        });    
    request.onsuccess = function (event) {
        loadTable();
        clearButtons();
    };

    request.onerror = function (event) {
        var request = db.transaction(["employee"], "readwrite").objectStore("employee").delete(employeeID);
        var request = db.transaction(["employee"], "readwrite")
        .objectStore("employee")
        .add({
            id: employeeID,
            name: name,
            surname: surname,
            age: age,
            nd: nd,
            postal: postal,
            email: email,
            www: www,
            date: date,
            img: img
        });
        loadTable();
        clearButtons();
    }
}

function deleteEmployee(x) {
    var employeeID = x;
    var request = db.transaction(["employee"], "readwrite")
        .objectStore("employee")
        .delete(employeeID);

    request.onsuccess = function (event) {
        loadTable();
        clearButtons();
    };
};

function clearButtons() {
    $('#add_id').val("");
    $('#add_name').val("");
    $('#add_surname').val("");
    $('#add_age').val("");
    $('#add_nd').val("");
    $('#add_postal').val("");
    $('#add_email').val("");
    $('#add_www').val("");
    $("#add_date").val("");
};

function searchtable() {
    var employees = "";
    $('.employee').remove();
    var objectStore = db.transaction("employee").objectStore("employee");
    objectStore.openCursor().onsuccess = function (event) {
    var cursor = event.target.result;
        if (cursor) {
            if((cursor.value.id.toString() +
                cursor.value.name.toLowerCase() +
                cursor.value.surname.toLowerCase() +
                cursor.value.age.toString() + 
                cursor.value.nd.toLowerCase() + 
                cursor.value.postal.toString() +
                cursor.value.email.toLowerCase() +
                cursor.value.www.toLowerCase() +
                cursor.value.date.toLowerCase()).includes($('#search').val().toLowerCase().replace(/ /g,''))){
                    employees = employees.concat(
                    '<tr class="employee">' +
                    '<td class="ID" onblur="greeting(this.id,'+cursor.key+',1)" contenteditable="true" id="id'+ cursor.key +'">' + cursor.key + '</td>' +
                    '<td class="Imie" onblur="greeting(this.id,'+cursor.key+',2)" contenteditable="true" id="imie'+ cursor.key +'">' + cursor.value.name + '</td>' +
                    '<td class="Nazwisko" onblur="greeting(this.id,'+cursor.key+',3)" contenteditable="true" id="nazwisko'+ cursor.key +'">' + cursor.value.surname + '</td>' +
                    '<td class="Wiek" onblur="greeting(this.id,'+cursor.key+',4)" contenteditable="true" id="wiek'+ cursor.key +'">' + cursor.value.age + '</td>' +
                    '<td class="numer_dowodu" onblur="greeting(this.id,'+cursor.key+',5)" contenteditable="true" id="numer_dowodu'+ cursor.key +'">' + cursor.value.nd + '</td>' +
                    '<td class="kod_pocztowy" onblur="greeting(this.id,'+cursor.key+',6)" contenteditable="true" id="kod_pocztowy'+ cursor.key +'">' + cursor.value.postal + '</td>' +
                    '<td class="Email" onblur="greeting(this.id,'+cursor.key+',7)" contenteditable="true" id="email'+ cursor.key +'">' + cursor.value.email + '</td>' +
                    '<td class="WWW" onblur="greeting(this.id,'+cursor.key+',8)"  contenteditable="true" id="www'+ cursor.key +'">' + cursor.value.www + '</td>' +
                    '<td class="Data" onblur="greeting(this.id,'+cursor.key+',9)"  contenteditable="true" id="data'+ cursor.key +'">' + cursor.value.date + '</td>' +
                    '<td class="Image"><img src="' + cursor.value.img + '" width="100" height="100"></td>' +
                    '<td><button style="background-color:red;" onClick="deleteEmployee(\'' + cursor.key + '\')">X</button>' +
                    '</tr>');
                } 
        }
         else{
            $('thead').after(employees); // no more events
        }
    cursor.continue();
    };
}

function randomDate(start, end) {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
                                }

function randomText(textArray) {
    var randomIndex = Math.floor(Math.random() * textArray.length); 
    var randomElement = textArray[randomIndex];
    return randomElement;
                                }

function getRandomString(length) {
    var randomChars = 'abcdefghijklmnopqrstuvwxyz';
    var result = '';
    for ( var i = 0; i < length; i++ ) {
        result += randomChars.charAt(Math.floor(Math.random() * randomChars.length));
    }
    return result;
}

function generateData(){
    document.getElementById("add_id").value = Math.floor(Math.random() * 101).toString();
    document.getElementById("add_name").value = randomText(["Jan","Tomasz","Maciej","Marcin","Andrzej","Adam","Robert","Jakub","Kamil","Dominik"]);
    document.getElementById("add_surname").value = randomText(["Ryba","Lok","Papa","Corleone","Stalone","Torino","Polanski","Psikut","Nowak","Kowalski"]);
    document.getElementById("add_age").value = Math.floor((Math.random() * 89)+10).toString();
    document.getElementById("add_nd").value = 'CAY' + Math.floor((Math.random() * 899999) + 100000).toString();
    document.getElementById("add_postal").value = Math.floor((Math.random() * 89) + 10).toString() + '-' + Math.floor((Math.random() * 899) + 100).toString();
    document.getElementById("add_email").value = Math.random().toString(36).substring(2, 5) + Math.random().toString(36).substring(2, 5) + '@gmail.com';         
    document.getElementById("add_www").value = 'https://' + getRandomString(Math.floor((Math.random() * 12) + 5)) + '.com';
    document.getElementById("add_date").value = randomDate(new Date(2021, 4, 4), new Date()).toString().substring(0, 16);     
}

function trig_Worker(){
    const worker = new Worker('./worker.js');

    var temp_id = document.getElementById("add_id").value;
    var temp_name = document.getElementById("add_name").value;
    var temp_surname = document.getElementById("add_surname").value;
    var temp_age = document.getElementById("add_age").value;
    var temp_nd = document.getElementById("add_nd").value;
    var temp_postal = document.getElementById("add_postal").value;
    var temp_email = document.getElementById("add_email").value;         
    var temp_www = document.getElementById("add_www").value;
    var temp_date = document.getElementById("add_date").value; 
    const data_toWorker = {
        id: temp_id,
        name: temp_name,
        surname: temp_surname,
        age: temp_age,
        nd: temp_nd,
        postal: temp_postal,
        email: temp_email,
        www: temp_www,
        date: temp_date
      }
    worker.postMessage(JSON.stringify(data_toWorker));
    worker.addEventListener('message',MessageFromWorker);
}

function MessageFromWorker(e){
    data_fromWorker = JSON.parse(e.data);
    document.getElementById("add_id").value = data_fromWorker['id'];
    document.getElementById("add_name").value = data_fromWorker['name'];
    document.getElementById("add_surname").value = data_fromWorker['surname'];
    document.getElementById("add_age").value = data_fromWorker['age'];
    document.getElementById("add_nd").value = data_fromWorker['nd'];
    document.getElementById("add_postal").value = data_fromWorker['postal'];
    document.getElementById("add_email").value = data_fromWorker['email'];       
    document.getElementById("add_www").value = data_fromWorker['www'];
    document.getElementById("add_date").value = data_fromWorker['date'];
}

function refresh(){
    loadTable();
    document.getElementById('search').value = '';
}

//////////////////////////////////////////////////////Zad7b

function trig_Worker_2(){
    const worker = new Worker('./worker_2.js');
    var temp_id = document.getElementById("add_id").value;
    var temp_name = document.getElementById("add_name").value;
    var temp_surname = document.getElementById("add_surname").value;
    var temp_age = document.getElementById("add_age").value;
    var temp_nd = document.getElementById("add_nd").value;
    var temp_postal = document.getElementById("add_postal").value;
    var temp_email = document.getElementById("add_email").value;         
    var temp_www = document.getElementById("add_www").value;
    var temp_date = document.getElementById("add_date").value; 
    var data_toWorker = 
        temp_id+
        temp_name+
        temp_surname+
        temp_age+
        temp_nd+
        temp_postal+
        temp_email+
        temp_www+
        +temp_date;
        
    worker.postMessage(data_toWorker);
    worker.addEventListener('message',MessageFromWorker_2);
}

function MessageFromWorker_2(e){
    data_fromWorker = e.data;
    document.getElementById("rgb_val").value = data_fromWorker;
    document.getElementById('layer').style.backgroundColor =  data_fromWorker;
}

function drawCanvas(){
    var c = document.getElementById('myCanvas');
    var ctx = c.getContext("2d");
    var img = new Image;
    img.setAttribute('crossOrigin', 'anonymous');
    img.onload=function() {
        ctx.drawImage(img,0,0, myCanvas.width, myCanvas.height);
        ctx.fillStyle = document.getElementById('rgb_val').value;
        ctx.fillRect(0, 0, myCanvas.width, myCanvas.height);
    }
    img.src = document.getElementById('add_image').value;
}

function resetFilter(){
    document.getElementById('rgb_val').value = "rgba(0,0,0,0)"
}

// document.addEventListener("DOMContentLoaded", () => {
//     $("#tabela td").click(function() {
//         x = $("#imie12").text();
//         alert(x);
//         // alert( "Handler for .click() called." );
//       });
//   });

function greeting(val, id, col){ //wartosc td, id wiersza, kolumna
    x = document.getElementById(val).innerText;
    console.log("Wartosc",x);
    console.log("Id",id);
    console.log("Col",col);

    const objectStore = db.transaction(['employee'], 'readwrite').objectStore('employee');
    objectStore.openCursor().onsuccess = function(event) {
        const cursor = event.target.result;
        if (cursor) {
            if (cursor.value.id == id) {
                const updateData = cursor.value;
                switch(col){
                    case 1:
                    updateData.id = x;
                    break;

                    case 2:
                    updateData.name = x;
                    break;

                    case 3:
                    updateData.surname = x;
                    break;

                    case 4:
                    updateData.age = x;
                    break;

                    case 5:
                    updateData.nd = x;
                    break;

                    case 6:
                    updateData.postal = x;
                    break;

                    case 7:
                    updateData.email = x;
                    break;

                    case 8:
                    updateData.www = x;
                    break;

                    case 8:
                    updateData.date = x;
                    break;

                    default:
                    return;
                }
                const request = cursor.update(updateData);
                request.onsuccess = function() {
                    console.log('data updated');
                };
            };
            cursor.continue();
        }
    };
}