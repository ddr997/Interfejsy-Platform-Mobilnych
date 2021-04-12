window.indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
window.IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.msIDBTransaction;
window.IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange || window.msIDBKeyRange

if (!window.indexedDB) {
    window.alert("Brak wsparcia IndexedDB na twoja przegladarke.")
}

const EmployeeData = [{id:"01", name:"Jan", age:"20", email:"example@wp.pl"}];
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