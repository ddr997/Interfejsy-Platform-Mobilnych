//prefixes of implementation that we want to test
window.indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;

//prefixes of window.IDB objects
window.IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.msIDBTransaction;
window.IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange || window.msIDBKeyRange

if (!window.indexedDB) {
    window.alert("Brak wsparcia IndexedDB na twoja przegladarke.")
};

const employeeData = [{id:"01", name:"Jan", surname:"Kowalski", age:"20", nd:"CAYXYZ", postal:"22-550", email:"example@wp.pl", www:"https://krzak.pl", date:"10-10-2010"},
{id:"02", name:"Marian", surname:"Pazdzioch", age:"70", nd:"CAYXYZ", postal:"22-550", email:"cojest@wp.pl", www:"https://onet.pl", date:"2-02-1950"}];

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
                '</tr>');
            cursor.continue(); // wait for next event
        } else {
            $('thead').after(employees); // no more events
        }
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

function deleteEmployee() {
    var employeeID = $('#delete_id').val();
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
    $('delete_id').val("");
};

function searchTable() {
				
    var employees = "";
    $('.employee').remove();

    var objectStore = db.transaction("employee").objectStore("employee");
    objectStore.openCursor().onsuccess = function (event) {
    var cursor = event.target.result;
        if (cursor) {
            if(cursor.key == $('#search_id').val() ||
            cursor.value.name == $('#search_id').val() ||
            cursor.value.surname == $('#search_id').val() ||
            cursor.value.age == $('#search_id').val() ||
            cursor.value.nd == $('#search_id').val() ||
            cursor.value.postal == $('#search_id').val() ||
            cursor.value.email == $('#search_id').val() ||
            cursor.value.www == $('#search_id').val() ||
            cursor.value.date == $('#search_id').val()){
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
                    '</tr>');
                cursor.continue(); // wait for next event
            }
            else {
                $('thead').after(employees); // no more events
            }
            
        };
    }}