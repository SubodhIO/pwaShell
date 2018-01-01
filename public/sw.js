var SW_VERSION = "0.0.0.0";
var _CACHE_VERSION = Date.now();
var _CACHE_NAME = "io-pwa-shell-v" + SW_VERSION;

var urlsToCache = [];
console.log("### SW");

/*

var dbRequest = indexedDB.open("testDb1", 3);

dbRequest.onsuccess = function(event) {
  let db = event.target.result;
  console.log("### PWA SHELL SW | IDB Open SUCCESS");
};

dbRequest.onerror = function(event) {
  console.log("### PWA SHELL SW | IDB Open ERROR | " + event.target.error);
};

dbRequest.onupgradeneeded = function(event) {
  let db = event.target.result;
  console.log("### PWA SHELL SW | IDB Open ON UPGRADE");
};

*/

self.addEventListener("install", function(event) {
  console.log("### PWA SHELL SW | INSTALLATION ");
});

self.addEventListener("activate", function(event) {
  console.log("### PWA SHELL SW | ACTIVATION ");
});

self.addEventListener("fetch", function(event) {
  console.log("### PWA SHELL SW | FETCH ");
});

function createDB() {
  indexedDB.open("testDB1", 1, function(upgradeDB) {
    var store = upgradeDB.createObjectStore("beverages", {
      keyPath: "id"
    });
    store.put({ id: 123, name: "coke", price: 10.99, quantity: 200 });
    store.put({ id: 321, name: "pepsi", price: 8.99, quantity: 100 });
    store.put({ id: 222, name: "water", price: 11.99, quantity: 300 });
  });
}

function createTable(table) {}

function addData(tableName, data) {}
