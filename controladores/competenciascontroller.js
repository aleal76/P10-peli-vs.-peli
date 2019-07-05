var con = require('../servidor/conexionbd');

function buscacompetencias(req, res) {
    // trae las competencias, no hay filtro
    var sql = 'select * from  competencia';
    //se ejecuta la consulta
    con.query(sql, function (error, resultado, fields) {
        //si hubo un error, se informa y se envía un mensaje de error
        if (error) {
            console.log("Hubo un error en la consulta competencias", error.message);
            return res.status(404).send("Hubo un error en la consulta competencias");
        }
        //se envía la respuesta
        res.send(JSON.stringify(resultado));
    });
}
//primero busca la cantidad de pelíuclas para generar el aleatorio entre todas las películas en la tabla, recién ahí hace el 2do query para traer dos pelís.
function buscaopciones(req, res) {
    var competencia = req.params.id;
    var sql = 'select * from competencia WHERE competencia.id = ' + req.params.id + ';';
    console.log(sql);
    con.query(sql, function (error, resultado, fields) {
        //si hubo un error, se informa y se envía un mensaje de error
        if (error) {
            console.log("Hubo un error en buscando opciones datos competencia", error.message);
            return res.status(500).send("Hubo un error en la buscando opciones datos competencia ");
        }

        console.log(resultado);

        var data = Object.values(resultado[0]);
        var id = data[0];
        var nombre = data[1];
        var genero = data[2];
        var actor = data[3];
        var director = data[4];


        //console.log("todo junto",data[1]);
        console.log("datos", id, nombre, genero, actor, director);
        if (genero == null) { genero = 'TRUE'; }
        else {
            genero = 'pelicula.genero_id = ' + genero;
        }
        console.log(genero);
        if (actor == null) { actor = 'TRUE'; }
        else {
            actor = 'actor_pelicula.actor_id = ' + actor;
        }
        console.log(actor);
        if (director == null) { director = 'TRUE'; }
        else {
            director = ' director_pelicula.director_id = ' + director;
        }
        console.log(director);
        var sql2 = 'SELECT  pelicula.id, poster, titulo FROM pelicula JOIN director_pelicula ON pelicula.id = director_pelicula.pelicula_id JOIN actor_pelicula on pelicula.id = actor_pelicula.pelicula_id WHERE ' + genero + ' AND ' + actor + ' AND ' + director + ' ORDER BY RAND() LIMIT 2;';
        console.log("buscaopciones", sql2);
        con.query(sql2, function (error, resultado, fields) {
            //si hubo un error, se informa y se envía un mensaje de error
            if (error) {
                console.log("Hubo un error en la consulta cantidad peliculas", error.message);
                return res.status(500).send("Hubo un error en la consulta cantidad peliculas");
            }
            if (resultado == '') {
                console.log("Hubo un error en la consulta opciones, competencia inexistente");
                return res.status(404).send("Hubo un error en la consulta opciones, competencia inexistente");
            }

            //se envía la respuesta si la competencia existe
            var response = JSON.stringify({
                'competencia': nombre,
                'peliculas': resultado
            });
            res.send(response);
            console.log("aqui mostrando opciones de peliculas", response);
        });
    });
}

function cargavoto(req, res) {
    var idcompetencia = req.params.id;
    var idpelicula = req.body.idPelicula;
    console.log(req.body);
    console.log("idpeli", idpelicula);
    //primero veo si ya tiene algún voto esa película, de ser así incremento el contador cantidad 
    var sql = 'select votos from voto where pelicula_id = ' + idpelicula + ';';
    console.log("veo si ya tiene votos", sql)
    con.query(sql, function (error, resultado, fields) {
        //si hubo un error, se informa y se envía un mensaje de error
        if (error) {
            console.log("Hubo un error en la consulta resultado", error.message);
            return res.status(500).send("Hubo un error en la consulta competencias");
        }
        //se envía la respuesta
        if (resultado[0] == undefined) {
            //creo nuevo registro con votos 1
            var sql = 'insert into voto (competencia_id, pelicula_id, votos) values (' + idcompetencia + ',' + idpelicula + ', 1 );';
            // ejecutamos la inserción
            console.log("si no hay votos  ", sql);
            con.query(sql, function (error, resultado, fields) {
                //si hubo un error, se informa y se envía un mensaje de error
                if (error) {
                    console.log("Hubo un error en cargavoto", error.message);
                    return res.status(500).send("Hubo un error en cargavoto");
                }
                return res.status(200).send("Voto registrado");
            });
        } else {
            //solamente incremento votos en el registro actual
            var votosprevios = parseInt(Object.values(resultado[0]));
            var sql = 'UPDATE voto SET votos = ' + (votosprevios + 1) + ' WHERE pelicula_id = ' + idpelicula + ';';
            // ejecutamos la inserción
            console.log("si ya tenía votos  ", sql);
            con.query(sql, function (error, resultado, fields) {
                //si hubo un error, se informa y se envía un mensaje de error
                if (error) {
                    console.log("Hubo un error en cargavoto", error.message);
                    return res.status(500).send("Hubo un error en cargavoto");
                }
                return res.status(200).send("Voto registrado");
            });
        }
    });
}

function buscaresultados(req, res) {
    // veo si existe la competencia
    var sql = 'select nombre from  competencia where id = ' + req.params.id + ';';
    console.log("buscando results para ", req.params.id, sql);
    con.query(sql, function (error, resultado, fields) {
        //si hubo un error, se informa y se envía un mensaje de error
        if (error) {
            console.log("Hubo un error en la consulta de resultados", error.message);
            return res.status(500).send("Hubo un error en la consulta de resultados");
        }
        if (resultado == '') {
            console.log("Hubo un error en la consulta de resultados, competencia inexistente");
            return res.status(404).send("Hubo un error en la consulta de resultados, competencia inexistente");
        }
        var nombre = Object.values(resultado[0]);
        //sin existe la competencia se buscan los resultados
        var sql = 'select pelicula.id, pelicula.poster, pelicula.titulo, voto.votos from pelicula join voto on pelicula.id = voto.pelicula_id where competencia_id = ' + req.params.id + ' order by voto.votos desc limit 3;';
        //se ejecuta la consulta
        //console.log(sql);
        con.query(sql, function (error, resultado, fields) {
            //si hubo un error, se informa y se envía un mensaje de error
            if (error) {
                console.log("Hubo un error en la consulta competencias", error.message);
                return res.status(500).send("Hubo un error en la consulta competencias");
            }
            //se envía la respuesta
            response = {
                competencia: nombre,
                resultados: resultado
            }
            console.log(JSON.stringify(response));
            res.send(JSON.stringify(response));

        });
    });
}

function creacompetencias(req, res) { // primero veo si existe
    console.log(req.body);
    if (req.body.nombre == "")
     { 
        console.log("Error, se necesita un nombre para crear la competencia", error.message);
        return res.status(422).send("Hubo un error en la creación de la competencia (sin nombre");
        
     }
    if (req.body.actor == 0) {
        req.body.actor = null;
    }
    if (req.body.director == 0) {
        req.body.director = null;
    }
    if (req.body.genero == 0) {
        req.body.genero = null;
    }
    var sql1 = 'select * from competencia where nombre = "' + req.body.nombre + '";';
    var sql2 = 'insert into competencia (nombre,actor_id,director_id,genero_id) values ("' + req.body.nombre + '",' + req.body.actor + ',' + req.body.director + ',' + req.body.genero + ');';
    //se ejecuta la consulta
    console.log("aquí creando compe", sql2);
    con.query(sql1, function (error, resultado, fields) {
        //si hubo un error, se informa y se envía un mensaje de error
        if (error) {
            console.log("Hubo un error en la creacion de competencias1", error.message);
            return res.status(500).send("Hubo un error en la consulta competencias antes de crearla");
        }
        if (resultado != '') {
            console.log("Hubo un error en la creación, la competencia ya existe");
            return res.status(422).send("Hubo un error en la creación, la competencia ya existe");
        }
        con.query(sql2, function (error, resultado, fields) {
            //si hubo un error, se informa y se envía un mensaje de error
            if (error) {
                console.log("Hubo un error en la creacion de competencias creando", error.message);
                return res.status(500).send("Hubo un error en la consulta competencias creando");
            }
            //se envía la respuesta
            return res.status(200).send("Competencia Creada");
        });
    });
}

function buscageneros(req, res) {
    // trae todo género, no hay filtro
    var sql = 'select * from  genero';
    //se ejecuta la consulta
    con.query(sql, function (error, resultado, fields) {
        //si hubo un error, se informa y se envía un mensaje de error
        if (error) {
            console.log("Hubo un error en la consulta generos", error.message);
            return res.status(500).send("Hubo un error en la consulta generos");
        }
        //se envía la respuesta
        res.send(JSON.stringify(resultado));
    });
}

function buscadirectores(req, res) {
    // trae todos los directores, no hay filtro
    var sql = 'select * from  director';
    //se ejecuta la consulta
    con.query(sql, function (error, resultado, fields) {
        //si hubo un error, se informa y se envía un mensaje de error
        if (error) {
            console.log("Hubo un error en la consulta directores", error.message);
            return res.status(404).send("Hubo un error en la consulta irectores");
        }
        //se envía la respuesta
        res.send(JSON.stringify(resultado));
    });
}

function buscaactores(req, res) {
    // trae todos los actores, no hay filtro
    var sql = 'select * from  actor';
    //se ejecuta la consulta
    con.query(sql, function (error, resultado, fields) {
        //si hubo un error, se informa y se envía un mensaje de error
        if (error) {
            console.log("Hubo un error en la consulta actores", error.message);
            return res.status(500).send("Hubo un error en la consulta actores");
        }
        //se envía la respuesta
        res.send(JSON.stringify(resultado));
    });
}

function buscaunacompetencia(req, res) {
    //primero busco todos los datos de la competencia para hacer las búsquedas
    var sql = 'select * from competencia WHERE competencia.id = ' + req.params.id + ';';
    console.log("sisisisi", sql);
    var data; //objeto que guardará los parámetros a buscar que vienen del query
    var competencia = {};
    var respuesta = {    //objeto que recolectará los resultados 
        nombre: ' ',
        genero_nombre: ' ',
        actor_nombre: ' ',
        director_nombre: ' '
    };
    con.query(sql, function (error, resultado, fields) {
        //si hubo un error, se informa y se envía un mensaje de error
        if (error) {
            console.log("Hubo un error en buscando opciones datos competencia", error.message);
            return res.status(500).send("Hubo un error en la buscando opciones datos competencia ");
        }
        data = Object.values(resultado[0]);
        console.log(data);
        competencia = { //objeto que tiene todos los id para buscar la info e las otras tablas
            id: data[0],
            nombre: data[1],
            generoid: data[2],
            actorid: data[3],
            directorid: data[4]
        };
        console.log(competencia.nombre, competencia.generoid, competencia.actorid, competencia.directorid);
        var sql1 = 'select nombre from genero where id = ' + competencia.generoid + ';';
        var sql2 = 'select nombre from actor where id = ' + competencia.actorid + ';';
        var sql3 = 'select nombre from director where id = ' + competencia.directorid + ';';
        console.log(sql1 + sql2 + sql3);
        con.query(sql1, function (error, resultado, fields) {
            //si hubo un error, se informa y se envía un mensaje de error
            if (error) {
                console.log("Hubo un error en busca genero", error.message);
                return res.status(500).send("Hubo un error en la consulta genero");
            }
            if (resultado == '') {
                console.log("NO TIENE GENERO");
                respuesta.genero_nombre = "";
            }
            else {
                respuesta.genero_nombre = Object.values(resultado[0]);
            }
            con.query(sql2, function (error, resultado, fields) {
                //si hubo un error, se informa y se envía un mensaje de error
                if (error) {
                    console.log("Hubo un error en busca actor", error.message);
                    return res.status(500).send("Hubo un error en la consulta actor");
                }
                if (resultado == '') {
                    console.log("NO TIENE director");
                    respuesta.actor_nombre = "";
                } else {
                    respuesta.actor_nombre = Object.values(resultado[0]);
                }

                con.query(sql3, function (error, resultado, fields) {
                    //si hubo un error, se informa y se envía un mensaje de error
                    if (error) {
                        console.log("Hubo un error en busca3", error.message);
                        return res.status(500).send("Hubo un error en la consulta director");
                    }
                    if (resultado == '') {
                        console.log("NO TIENE director");
                        respuesta.director_nombre = "";
                    } else {
                        //DESDE AQUI ENVIAR RESPUESTA
                        respuesta.director_nombre = Object.values(JSON.stringify(resultado));
                    }
                    respuesta.nombre = competencia.nombre;
                    console.log("respuesta competencia", respuesta);
                    res.send(JSON.stringify(respuesta));
                });
            });
        });
    });
}



function eliminacompetencia(req, res) {
    console.log(req.params.id);
    competenciaid = req.params.id;
    // primero eleimino los votos de esa competencia
    var sql = 'delete from voto where competencia_id = ' + competenciaid + ';';
    //se ejecuta el query
    con.query(sql, function (error, resultado, fields) {
        //si hubo un error, se informa y se envía un mensaje de error
        if (error) {
            console.log("Hubo un error en la eliminación de votos de la competencia", error.message);
            return res.status(500).send("Hubo un error en la eliminación de vptos de la competencia");
        }
        //se envía la respuesta
        var sql = 'delete from competencia where id = ' + competenciaid + ';';
        //se ejecuta el query
        con.query(sql, function (error, resultado, fields) {
            //si hubo un error, se informa y se envía un mensaje de error
            if (error) {
                console.log("Hubo un error en eliminación de competencias", error.message);
                return res.status(500).send("Hubo un error en la eliminación de competencias");
            }
            //se envía la respuesta
            return res.status(200).send("Competencia Eliminada");

        });
    });
}

function reiniciacompetencia(req, res) {
    //competenciaid = req.params.id;
    var sql = 'delete from voto where competencia_id = ' + req.params.id + ';';
    //se ejecuta el query
    con.query(sql, function (error, resultado, fields) {
        //si hubo un error, se informa y se envía un mensaje de error
        if (error) {
            console.log("Hubo un error en el reinicio de competencia", error.message);
            return res.status(500).send("Hubo un error en el reinicio de competencia");
        }
        //se envía la respuesta
        return res.status(200).send("Competencia Reiniciada");
    });
}


function editacompetencia(req, res) {

    console.log("edidtando", req.body);
    var sql1 = 'update competencia set nombre = "' + req.body.nombre + '" where id = ' + req.params.id + ';';
    //se ejecuta la  actualización
    console.log("aquí editando", sql1);
    con.query(sql1, function (error, resultado, fields) {
        //si hubo un error, se informa y se envía un mensaje de error
        if (error) {
            console.log("Hubo un error en la edición de competencias", error.message);
            return res.status(500).send("Hubo un error en la consulta competencias edición de competencias");
        }
        //se envía la respuesta
        return res.status(200).send("Competencia editada");
    });
}

module.exports = {

    buscacompetencias: buscacompetencias,
    buscaopciones: buscaopciones,
    cargavoto: cargavoto,
    buscaresultados: buscaresultados,
    creacompetencias: creacompetencias,
    buscageneros: buscageneros,
    buscadirectores: buscadirectores,
    buscaactores: buscaactores,
    buscaunacompetencia: buscaunacompetencia,
    eliminacompetencia: eliminacompetencia,
    reiniciacompetencia: reiniciacompetencia,
    editacompetencia: editacompetencia
} 