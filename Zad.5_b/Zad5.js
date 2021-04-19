//prefixes of implementation that we want to test
window.indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;

//prefixes of window.IDB objects
window.IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.msIDBTransaction;
window.IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange || window.msIDBKeyRange

if (!window.indexedDB) {
    window.alert("Brak wsparcia IndexedDB na twoja przegladarke.")
};

const employeeData = [{id:"01", name:"Jan", surname:"Kowalski", age:"20", email:"example@wp.pl", postal:"22-550"}];

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
                '<td class="strona_www">' + cursor.value.www + '</td>' +
                '<td class="data">' + cursor.value.date + '</td>' +
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
    var nd = $('add_ns').val();
    var postal = $('#add_postal').val();
    var email = $('#add_email').val();
    var www = $('add_www').val()
    var date = $('add_date').val()
    var request = db.transaction(["employee"], "readwrite")
        .objectStore("employee")
        .add({
            id: employeeID,
            name: name,
            surname: surname,
            age: age,
            numerdowodu: nd,
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
    $('#add_email').val("");
    $('#add_postal').val("");
    $('delete_id').val("");
};

remove(id, index) {
    var vm = this 
    var request =  db.transaction(["employee"], "readwrite")
    .objectStore("employee")
    .delete(id);
    vm.employees.splice(index, 1)
}