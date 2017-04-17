'use strict';

// short name, version, display name, max size
var dbupeu = openDatabase('UPeU', '1.0', 'Ejemplo por caso Académico', 2 * 1024 * 1024);


dbupeu.transaction(function(tx) {
  //tx.executeSql('DROP TABLE IF EXISTS persona');
  //tx.executeSql('DROP TABLE IF EXISTS usuario');  
  tx.executeSql('CREATE TABLE IF NOT EXISTS persona(idPersona integer unique primary key AUTOINCREMENT, nombre varchar(100), apellidos varchar(100), dni varchar(10),telefono varchar(10), fechan varchar(10), \n\
  genero varchar(10), profesion varchar(100),gradoEstudio varchar(100), email varchar(10), usuario varchar(100), clave varchar(100))', [], null, handleError);
  //tx.executeSql('CREATE TABLE IF NOT EXISTS usuario(idUsuario integer unique primary key AUTOINCREMENT, usuario VARCHAR(30) NOT NULL,clave VARCHAR(60) NOT NULL, idPersona integer, FOREIGN KEY (idPersona) REFERENCES persona (idPersona))', [], null, handleError);
 
}, null, null); // error handler, success handler

function handleError(transaction, error) {
  transaction = null; // dummy statement to avoid jshint error...
  log('Something went wrong: ' + error.message + ', code: ' + error.code);
  return false;
}


function agregarPersona(nombre, apellidos, dni,telefono, fechan, genero, profesion, gradoEstudio,email, usuario, clave ) {
  dbupeu.transaction(function(tx) {
    tx.executeSql('INSERT INTO persona (nombre, apellidos, dni, telefono, fechan, genero, profesion, gradoEstudio, email, usuario, clave) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', [nombre, apellidos,
      dni,telefono, fechan, genero, profesion, gradoEstudio, email, usuario, clave
    ]);
    document.getElementById('nombre').value="";
    document.getElementById('apellidos').value="";
    document.getElementById('dni').value="";
    document.getElementById('telefono').value="";
    document.getElementById('fechan').value="";
    document.getElementById('genero').value="";
    document.getElementById('profesion').value="";
    document.getElementById('gradoEstudio').value="";
    document.getElementById('email').value="";
    document.getElementById('usuario').value="";
    document.getElementById('clave').value="";
    
    
  }, handleError, function() {        
    buscarPersona("");
    
  });
  
}





var storeButton = document.getElementById('storeButton');
var nombre = document.getElementById('nombre');
var apellidos = document.getElementById('apellidos');
var dni = document.getElementById('dni');
var telefono = document.getElementById('telefono');
var fechan = document.getElementById('fechan');
var genero = document.getElementById('genero');
var profesion = document.getElementById('profesion');
var gradoEstudio = document.getElementById('gradoEstudio');
var email = document.getElementById('email');
var usuario = document.getElementById('usuario');
var clave = document.getElementById('clave');
var idPersona = document.getElementById('idPersona');

storeButton.addEventListener('click', function() {
    agregarPersona(nombre.value, apellidos.value, dni.value, telefono.value, fechan.value, genero.value, profesion.value, gradoEstudio.value, email.value, usuario.value, clave.value);

  /*if(idPersona==""){
    agregarPersona(nombre.value, dni.value, telefono.value);
  }else{
   //actualizarPersona(nombre.value, dni.value, telefono.value, idPersona.value)   ;
  }
  */
 
});

var dataElement = document.getElementById('data');
function log(message) {
  //alert(message);
  console.log(message);
  dataElement.innerHTML =message;
}


function buscarPersona(text) {
  dbupeu.transaction(function(tx) { // readTransaction() is apparently faster
    var resulTRows="";  
    var statement = 'SELECT idPersona, nombre,apellidos, dni, telefono, fechan, genero, profesion, gradoEstudio, email, usuario, clave FROM persona WHERE nombre  like  "%'+text+'%"';
    //var statement = 'SELECT artist, song FROM songs WHERE artist LIKE "%' +text + '%" OR song like "%' + text + '%"';
    // array unused here: ? field values not used in query statement
    tx.executeSql(statement, [], function(thisTx, results) {
      var numRows = results.rows.length;
      
      for (var i = 0; i !== numRows; ++i) {
        var rows= results.rows.item(i);
        
        resulTRows+='<tr><td>' + rows.idPersona + '</td>'+'<td>' + rows.nombre + '</td>'+'<td>'+ rows.apellidos + '</td>'+'<td>' + rows.dni + '</td>'+'<td>'
        + rows.telefono +  '</td>'+'<td>' + rows.fechan + '</td>'+'<td>' + rows.genero + '</td>'+'<td>' + rows.profesion + '</td>'+'<td>' + rows.gradoEstudio +'</td>'+'<td>' + rows.email + '</td>'+'<td>'  + rows.usuario + '</td>'+'<td>' + rows.clave + '</td>'+'<td style="text-align: center"><a href="#" onclick="eliminarPersona('+rows.idPersona+')">X</a> <a href="#"  onclick="editarPersona('+rows.idPersona+')">E</a> </td></tr>';        
        console.log(resulTRows);
      }
      log(resulTRows);
    }, handleError);
  });
  return resulTRows;
}

// tx.executeSql("DELETE FROM songs WHERE SONG=?", [song], handleError, null);


function eliminarPersona(id){
  dbupeu.transaction(function(tx) {
    tx.executeSql("DELETE FROM persona WHERE idPersona=?", [id], handleError, null);
    var blnResultado=confirm("¿deseas borrar este registro?"); 
    if(blnResultado) 
        {alert("registro eliminado");} 
    else 
        {alert("registro NO eliminado");} 
  }, handleError, function() {        
    buscarPersona("");
    
  });    
}


function editarPersona(id) {

  dbupeu.transaction(function(tx) { // readTransaction() is apparently faster
    var resulTRows="";  
    var statement = 'SELECT idPersona, nombre, apellidos, dni, telefono,  fechan, genero, profesion, gradoEstudio, email, usuario, clave FROM persona WHERE idPersona = "'+id+'"';
    //var statement = 'SELECT artist, song FROM songs WHERE artist LIKE "%' +text + '%" OR song like "%' + text + '%"';
    // array unused here: ? field values not used in query statement
    tx.executeSql(statement, [], function(thisTx, results) {
      var numRows = results.rows.length;
         // alert(numRows);
      for (var i = 0; i !== numRows; ++i) {
        var rows= results.rows.item(i);
        nombre.value=rows.nombre;
        apellidos.value=rows.apellidos;
        dni.value=rows.dni;
        telefono.value=rows.telefono;
        fechan.value=rows.fechan;
        genero.value=rows.genero;
        profesion.value=rows.profesion;
        gradoEstudio.value=rows.gradoEstudio;
        email.value=rows.email;
        usuario.value=rows.usuario;
        clave.value=rows.clave;
        idPersona.value=rows.idPersona;
        
        
        
       // resulTRows+='<tr><td>' + rows.idPersona + '</td>'+'<td>' + rows.nombre + '</td>'+'<td>' + rows.dni + '</td>'+'<td>' + rows.telefono + '</td>'+'<td style="text-align: center"><a href="#" onclick="eliminarPersona('+rows.idPersona+')">X</a> <a href="#" onclick="eliminarPersona('+rows.idPersona+')">E</a> </td></tr>';        
      }
      buscarPersona("");
      //log(resulTRows);
      
    }, handleError);
  });
 // return resulTRows;
}


var findButton = document.getElementById('findButton');
var query = document.getElementById('queryx','dnix');

findButton.addEventListener('click', function() {
  buscarPersona(query.value,dnix.value);
  
});
