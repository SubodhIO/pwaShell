(function() {
  var _sessionId = -99;
  const _SERVER_URL = "https://komori.cloudio.io/api"; // can be parameterized along with username & password

  //const _SERVER_URL = "https://ebs.cloudio.io/api"; // can be parameterized along with username & password

  window.indexedDB =
    window.indexedDB ||
    window.mozIndexedDB ||
    window.webkitIndexedDB ||
    window.msIndexedDB;
  window.IDBTransaction = window.IDBTransaction ||
  window.webkitIDBTransaction ||
  window.msIDBTransaction || { READ_WRITE: "readwrite" };
  window.IDBKeyRange =
    window.IDBKeyRange || window.webkitIDBKeyRange || window.msIDBKeyRange;

  var idb = window.indexedDB;
  var idbt = window.IDBTransaction;
  var idbkr = window.IDBKeyRange;

  var initSession = function() {
    /* TODO | should be the first thing to get called*/
  };

  var getSession = function() {
    return new Promise(function(resolve, reject) {
      if (_sessionId !== -99) {
        resolve(_sessionId);
      } else {
        let xhttp = new XMLHttpRequest();
        let data = { username: "admin", password: "c2vc1970aeS" };
        xhttp.open("POST", "https://komori.cloudio.io/api/signin", true);

        xhttp.onload = function() {
          if (xhttp.readyState === 4) {
            if (xhttp.status === 200) {
              var response = JSON.parse(xhttp.responseText);
              console.log("*** OM LOGIN | " + JSON.stringify(response));

              _sessionId = response.sessionId;
              resolve(_sessionId);
            } else {
              console.log("*** OM LOGIN | " + JSON.stringify(xhttp.statusText));
              reject(" Invalid Response Status");
            }
          }
        };

        xhttp.ontimeout = function() {
          console.log("*** OM LOGIN | Request Timed Out");
          reject("getSession | Request Timed out");
        };

        xhttp.onerror = function() {
          console.log("*** OM LOGIN | " + JSON.stringify(xhttp.statusText));
          reject("getSession | Request Timed out");
        };

        xhttp.setRequestHeader("Content-type", "application/json");
        xhttp.send(JSON.stringify(data));
      }
    });
  };

  var testGetSession = function() {
    getSession().then(
      function(res) {
        console.log(" Session Id " + JSON.stringify(res));
      },
      function(err) {
        console.log(" getSession Error " + JSON.stringify(err));
      }
    );
  };

  var testGetDataSourceInfo = function(val) {
    getDataSourceInfo(val).then(
      function(res) {
        console.log(" Session Id " + JSON.stringify(res));
      },
      function(err) {
        console.log(" getSession Error " + JSON.stringify(err));
      }
    );
  };

  var getDataSourceInfo = function(dsName) {
    return new Promise(function(resolve, reject) {
      if (dsName) {
        getSession().then(
          function(res) {
            let payload = {
              sessionId: _sessionId,
              offset: 0,
              limit: 1,
              data: { objectName: "BFOEVENTS" },
              //orderBy: "",
              params: {
                executeCountSql: "N"
              }
            };

            let dsReq = new XMLHttpRequest();
            dsReq.open("POST", _SERVER_URL + "/" + dsName, true);

            dsReq.onload = function() {
              if (dsReq.readyState === 4) {
                if (dsReq.status === 200) {
                  let response = JSON.parse(dsReq.responseText);
                  console.log("### DS Response | " + JSON.stringify(response));
                  resolve(response);
                } else {
                  reject(" Response Invalid");
                }
              }
            };

            dsReq.onerror = function() {
              reject(" Response Error");
            };

            dsReq.ontimeout = function() {
              reject(" Response Timedout");
            };

            dsReq.setRequestHeader("Content-type", "application/json");
            dsReq.send(JSON.stringify(payload));
          },
          function(err) {}
        );
      } else {
        resolve(null);
      }
    });
  };

  /*********** TEST CALLS  */
  // testGetSession();
  /*testGetDataSourceInfo('GetObjectAttributes').then(function(response){

},function(err){

}); */

  var getDBInstance = function() {
    return new Promise(function(resolve, reject) {
      if ("indexedDB" in window) {
        console.log(" ### This browser supports IndexedDB");
        let dbRequest = idb.open("testDb1", 1);

        dbRequest.onerror = function(event) {
          reject(" ERROR | Could not open the DB | " + event.target.error);
        };
        dbRequest.onsuccess = function(event) {
          let db = event.target.result;
          resolve(db);
        };
        dbRequest.onupgradeneeded = function(event) {
          //The IDBDatabase interface
          /*TO DO | All the update changes */
          // var db = event.target.result;
          console.log(" IDB Open ON UPGRADE");

          createTable(event.target.result, "test").then(
            function(res) {
              console.log(
                "Creation of table successful " + JSON.stringify(res)
              );
            },
            function(err) {
              console.log(
                "Creation of table unsuccessful " + JSON.stringify(err)
              );
            }
          );
        };
      } else {
        console.log(" ### This browser doesn't support IndexedDB");
        reject(
          "ERROR | Could not open the DB | The browser does not support IndexedDB..please try with another browser"
        );
      }
    });
  };

  var insertRow = function(db, tableName, data) {
    return new Promise(function(resolve, reject) {
      if (db && tableName && data) {
        let tr = db.transaction([tableName], "readwrite");

        tr.oncomplete = function(event) {
          console.log("Transaction Completed");
          resolve();
        };

        tr.onerror = function(event) {
          console.log("Transaction Error");
          reject(event.target.error);
        };

        let obStore = tr.objectStore(tableName);
        let obStoreReq = obStore.add(data);

        obStoreReq.onsuccess = function(event) {
          console.log("Object Store Add Success");
        };

        obStoreReq.onerror = function(event) {
          console.log("Object Store Add Error | " + event.target.error);
        };
      } else {
        reject();
      }
    });
  };
  var createTable = function(db, table) {
    return new Promise(function(resolve, reject) {
      if (db && table) {
        let tbReq = db.createObjectStore("testTable", {
          keyPath: "idbId",
          autoIncrement: true
        });

        tbReq.onsuccess = function(event) {
          resolve(event.target.result);
        };
        tbReq.onerror = function(event) {
          reject(" ERROR | Could not create the table | " + event.target.error);
        };
      } else {
        reject("Please share the DB/Table Info required");
      }
    });
  };

  if ("serviceWorker" in navigator) {
    console.log(" ### Service Worker Supported.");

    navigator.serviceWorker.register("/sw.js").then(function(registration) {
      console.log(
        "### Service Worker Registration Successful!! | " +
          JSON.stringify(registration)
      );
    });
  } else {
    console.log(
      " ### Service Worker Not Supported. Please use the compatible browser "
    );
  }

  /* Test Methods */
  var testInsert = function() {
    let newItem = { col1: "data1", col2: "data2", col3: "data3" };

    getDBInstance().then(
      function(res) {
        console.log("Connection to db successful " + JSON.stringify(res));

        insertRow(res,'testTable',newItem).then(function(res){
          console.log('Insert Success');
        },function(err){
          console.log('Insert Failure | '+err);
        });
      },
      function(err) {
        console.log("Connection to db unsuccessful " + JSON.stringify(err));
      }
    );
  };



  /* EXECUTION SECTION */
  testInsert();
})();
