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
    var cantidadpeliculas;
    var sqlq = 'select count(*) from pelicula';
    con.query(sqlq, function (error, resultado, fields) {
        //si hubo un error, se informa y se envía un mensaje de error
        if (error) {
            console.log("Hubo un error en la consulta cantidad peliculas", error.message);
            return res.status(404).send("Hubo un error en la consulta cantidad peliculas");
        }
        //se envía la respuesta
        cantidadpeliculas = parseInt(Object.values(resultado[0]));
        // trae todo género, no hay filtro
        var sql1 = 'select nombre from  competencia where id = ' + req.params.id + ';';
        var random1 = Math.round(Math.random() * cantidadpeliculas);
        var random2 = Math.round(Math.random() * cantidadpeliculas);
        var sql2 = 'select * from pelicula where id = ' + random1 + ' or id = ' + random2 + ';'
        //se ejecuta la consulta
        con.query(sql1 + sql2, [1, 2], function (error, resultado, fields) {
            //si hubo un error, se informa y se envía un mensaje de error
            if (error) {
                console.log("Hubo un error en la consulta opciones", error.message);
                return res.status(404).send("Hubo un error en la consulta opciones");
            }
            if (resultado == '') {
                console.log("Hubo un error en la consulta opciones, competencia inexistente");
                return res.status(404).send("Hubo un error en la consulta opciones, competencia inexistente");
            }

            //se envía la respuesta si la competencia existe
            var response = JSON.stringify({
                'competencia': resultado[0][1],
                'peliculas': resultado[1]
            });
            res.send(response);
        });
    });
}

function cargavoto(req, res) {
    var idcompetencia = req.params.id;
    var idpelicula = req.body.idPelicula;
    //primero veo si ya tiene algún voto esa película, de ser así incremento el contador cantidad 

    var sql = 'select votos from voto where pelicula_id = ' + idpelicula + ';';
    con.query(sql, function (error, resultado, fields) {
        //si hubo un error, se informa y se envía un mensaje de error
        if (error) {
            console.log("Hubo un error en la consulta resultado", error.message);
            return res.status(404).send("Hubo un error en la consulta competencias");
        }
        //se envía la respuesta
        if (resultado[0] == undefined) {
            //creo nuevo registro con votos 1
            var sql = 'insert into voto (competencia_id, pelicula_id, votos) values (' + idcompetencia + ',' + idpelicula + ', 1 );';
            // ejecutamos la inserción
            con.query(sql, function (error, resultado, fields) {
                //si hubo un error, se informa y se envía un mensaje de error
                if (error) {
                    console.log("Hubo un error en cargavoto", error.message);
                    return res.status(404).send("Hubo un error en cargavoto");
                }
                return res.status(200).send("Voto registrado");
            });
        } else {
            //solamente incremento votos en el registro actual
            var votosprevios = parseInt(Object.values(resultado[0]));
            var sql = 'UPDATE voto SET votos = ' + (votosprevios + 1) + ' WHERE pelicula_id = ' + idpelicula + ';';
            // ejecutamos la inserción
            con.query(sql, function (error, resultado, fields) {
                //si hubo un error, se informa y se envía un mensaje de error
                if (error) {
                    console.log("Hubo un error en cargavoto", error.message);
                    return res.status(404).send("Hubo un error en cargavoto");
                }
                return res.status(200).send("Voto registrado");
            });
        }
    });
}

function buscaresultados(req, res) {
    // veo si existe la competencia
    var sql = 'select nombre from  competencia where id = ' + req.params.id + ';';
    con.query(sql, function (error, resultado, fields) {
        //si hubo un error, se informa y se envía un mensaje de error
        if (error) {
            console.log("Hubo un error en la consulta de resultados", error.message);
            return res.status(404).send("Hubo un error en la consulta de resultados");
        }
        if (resultado == '') {
            console.log("Hubo un error en la consulta de resultados, competencia inexistente");
            return res.status(404).send("Hubo un error en la consulta de resultados, competencia inexistente");
        }
        //sin existe la competencia se buscan los resultados
        var sql = 'select * from pelicula join voto on pelicula.id = voto.pelicula_id where competencia_id = ' + req.params.id + ' order by votos desc limit 3;';
        //se ejecuta la consulta
        con.query(sql, function (error, resultado, fields) {
            //si hubo un error, se informa y se envía un mensaje de error
            if (error) {
                console.log("Hubo un error en la consulta competencias", error.message);
                return res.status(404).send("Hubo un error en la consulta competencias");
            }
            //se envía la respuesta
            response = {
                resultados: resultado
            }
            res.send(JSON.stringify(response));

        });
    });
}


function creacompetencias(req, res) {
    var nombre = req.body.nombre;
    var sql1 = 'select * from competencia where nombre = "' + nombre + '";';
    var sql = 'insert into competencia (nombre) values ("' + nombre + '");';
    //se ejecuta la consulta
    con.query(sql1, function (error, resultado, fields) {
        //si hubo un error, se informa y se envía un mensaje de error
        if (error) {
            console.log("Hubo un error en la creacion de competencias", error.message);
            return res.status(404).send("Hubo un error en la consulta competencias");
        }
        if (resultado != '') {
            console.log("Hubo un error en la creación, la competencia ya existe");
            return res.status(404).send("Hubo un error en la creación, la competencia ya existe");
        }
        con.query(sql, function (error, resultado, fields) {
            //si hubo un error, se informa y se envía un mensaje de error
            if (error) {
                console.log("Hubo un error en la creacion de competencias", error.message);
                return res.status(404).send("Hubo un error en la consulta competencias");
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
            return res.status(404).send("Hubo un error en la consulta generos");
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
            return res.status(404).send("Hubo un error en la consulta actores");
        }
        //se envía la respuesta
        res.send(JSON.stringify(resultado));

    });
}

function buscaunacompetencia(req, res) {
    // trae una competencias, no hay filtro
    var sql = 'select * from  competencia where id = ' + req.params.id + ';';
    //se ejecuta la consulta
    con.query(sql, function (error, resultado, fields) {
        //si hubo un error, se informa y se envía un mensaje de error
        if (error) {
            console.log("Hubo un error en la consulta competencia", error.message);
            return res.status(404).send("Hubo un error en la consulta competencias");
        }
        //se envía la respuesta
        res.send(JSON.stringify(resultado[0]));
    });
}

function eliminacompetencia(req, res) {
    console.log(req.params.id);
    competenciaid = req.params.id;
    var sql = 'delete from voto where competencia_id = ' + competenciaid + ';';
    //se ejecuta el query
    con.query(sql, function (error, resultado, fields) {
        //si hubo un error, se informa y se envía un mensaje de error
        if (error) {
            console.log("Hubo un error en la eliminación de la competencia", error.message);
            return res.status(404).send("Hubo un error en la eliminación de la competencia");
        }
        //se envía la respuesta
        var sql = 'delete from competencia where id = ' + competenciaid + ';';
        //se ejecuta el query
        con.query(sql, function (error, resultado, fields) {
            //si hubo un error, se informa y se envía un mensaje de error
            if (error) {
                console.log("Hubo un error en eliminación de competencias", error.message);
                return res.status(404).send("Hubo un error en la eliminación de competencias");
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
            return res.status(404).send("Hubo un error en el reinicio de competencia");
        }
        //se envía la respuesta
        return res.status(200).send("Competencia Reiniciada");
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
    reiniciacompetencia: reiniciacompetencia
} 