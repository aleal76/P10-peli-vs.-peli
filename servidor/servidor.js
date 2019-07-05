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



app.get('/competencias/:id/peliculas',controladordecompetencias.buscaopciones); // muestra las 2 pelis al azar con criterios para votar

app.get('/competencias',controladordecompetencias.buscacompetencias);
// trae todas las competencias

app.get('/competencias/:id',controladordecompetencias.buscaunacompetencia); //trae toda la info de una coompetencia de las otras tablas con criterios variables

app.post('/competencias/:id/voto',controladordecompetencias.cargavoto);

app.get('/competencias/:id/resultados',controladordecompetencias.buscaresultados); 

app.post('/competencias',controladordecompetencias.creacompetencias);

app.get('/generos', controladordecompetencias.buscageneros);

app.get('/directores', controladordecompetencias.buscadirectores);

app.get('/actores', controladordecompetencias.buscaactores);

app.delete('/competencias/:id/votos',controladordecompetencias.reiniciacompetencia); //borra los votos de una competencia nada mas

app.delete('/competencias/:id',controladordecompetencias.eliminacompetencia); //

app.put('/competencias/:id',controladordecompetencias.editacompetencia) // editar competencias

//seteamos el puerto en el cual va a escuchar los pedidos la aplicación



var puerto = '8080';

app.listen(puerto, function () {
  console.log( "Escuchando en el puerto " + puerto );
});

