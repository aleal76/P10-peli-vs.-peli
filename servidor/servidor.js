//paquetes necesarios para el proyecto
var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');
var controladordecompetencias = require('../controladores/competenciascontroller');
var app = express();

app.use(cors());

app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(bodyParser.json());

app.get('/competencias/:id/peliculas',controladordecompetencias.buscaopciones);

app.get('/competencias',controladordecompetencias.buscacompetencias);

app.post('/competencias/:id/voto',controladordecompetencias.cargavoto);

app.get('/competencias/:id/resultados',controladordecompetencias.buscaresultados);

//seteamos el puerto en el cual va a escuchar los pedidos la aplicación
var puerto = '8080';

app.listen(puerto, function () {
  console.log( "Escuchando en el puerto " + puerto );
});

