//prefixes of implementation that we want to test
window.indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;

//prefixes of window.IDB objects
window.IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.msIDBTransaction;
window.IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange || window.msIDBKeyRange

if (!window.indexedDB) {
    window.alert("Brak wsparcia IndexedDB na twoja przegladarke.")
};

const employeeData = [{id:"01", name:"Jan", surname:"Kowalski", age:"20", nd:"CAY123456", postal:"22-550", email:"example@wp.pl", www:"https://krzak.pl", date:"10-10-2010"}];

var db;
var request = window.indexedDB.open("newDatabase", 1);

request.onerror = function (event) {
    console.log("error: ");
};

request.onsuccess = function (event) {
    db = request.result;
    console.log("success: ", db);
    loadTable();
};

request.onupgradeneeded = function (event) {
    var db = event.target.result;
    var objectStore = db.createObjectStore("employee", {
        keyPath: "id"
    });
    for (var i in employeeData) {
        objectStore.add(employeeData[i]);
    }
}

function loadTable() {
    var employees = "";
    $('.employee').remove();

    var objectStore = db.transaction("employee").objectStore("employee");
    objectStore.openCursor().onsuccess = function (event) {
        var cursor = event.target.result;
        if (cursor) {
            employees = employees.concat(
                '<tr class="employee">' +
                '<td class="ID">' + cursor.key + '</td>' +
                '<td class="Imie">' + cursor.value.name + '</td>' +
                '<td class="Nazwisko">' + cursor.value.surname + '</td>' +
                '<td class="Wiek">' + cursor.value.age + '</td>' +
                '<td class="numer_dowodu">' + cursor.value.nd + '</td>' +
                '<td class="kod_pocztowy">' + cursor.value.postal + '</td>' +
                '<td class="Email">' + cursor.value.email + '</td>' +
                '<td class="WWW">' + cursor.value.www + '</td>' +
                '<td class="Data">' + cursor.value.date + '</td>' +
                '<td><button onClick="deleteEmployee(\'' + cursor.key + '\')">X</button>' +
                '</tr>');
                
        } else {
            $('thead').after(employees); // no more events
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
    var email = $('#add_email').val();
    var www = $('#add_www').val();
    var date = $('#add_date').val();
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
            date: date
        });


    request.onsuccess = function (event) {
        loadTable();
        clearButtons();
    };

    request.onerror = function (event) {
        alert("error");
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
            if(cursor.value.id == $('#search').val() ||
             cursor.value.name == $('#search').val() || 
             cursor.value.surname == $('#search').val() || 
             cursor.value.age == $('#search').val() || 
             cursor.value.nd == $('#search').val() || 
             cursor.value.postal == $('#search').val() || 
             cursor.value.email == $('#search').val() ||
             cursor.value.www == $('#search').val() ||
             cursor.value.date == $('#search').val()){
                employees = employees.concat(
                    '<tr class="employee">' +
                    '<td class="ID">' + cursor.key + '</td>' +
                    '<td class="Imie">' + cursor.value.name + '</td>' +
                    '<td class="Nazwisko">' + cursor.value.surname + '</td>' +
                    '<td class="Wiek">' + cursor.value.age + '</td>' +
                    '<td class="numer_dowodu">' + cursor.value.nd + '</td>' +
                    '<td class="kod_pocztowy">' + cursor.value.postal + '</td>' +
                    '<td class="Email">' + cursor.value.email + '</td>' +
                    '<td class="WWW">' + cursor.value.www + '</td>' +
                    '<td class="Data">' + cursor.value.date + '</td>' +
                    '<td><button onClick="deleteEmployee(\'' + cursor.key + '\')">X</button>' +
                    '</tr>');
                } 
            }
            else {
                $('thead').after(employees); // no more events
            }         cursor.continue();
            
        };
    }