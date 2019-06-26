var con = require('../servidor/conexionbd');
//console.log(con);

function buscacompetencias(req, res) {
    // trae todo género, no hay filtro
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
    console.log("enopciones", Object.values(req.params.id[0]));
    con.query(sqlq, function (error, resultado, fields) {
        //si hubo un error, se informa y se envía un mensaje de error
        if (error) {
            console.log("Hubo un error en la consulta cantidad peliculas", error.message);
            return res.status(404).send("Hubo un error en la consulta cantidad peliculas");
        }
        //se envía la respuesta
        cantidadpeliculas = parseInt(Object.values(resultado[0]));
        //console.log(cantidadpeliculas);
        // trae todo género, no hay filtro
        var sql1 = 'select nombre from  competencia where id = ' + req.params.id + ';';
        var random1 = Math.round(Math.random() * cantidadpeliculas);
        var random2 = Math.round(Math.random() * cantidadpeliculas);
        var sql2 = 'select * from pelicula where id = ' + random1 + ' or id = ' + random2 + ';'
        //console.log("sql", sql1+sql2);
        //se ejecuta la consulta
        con.query(sql1 + sql2, [1, 2], function (error, resultado, fields) {
            //si hubo un error, se informa y se envía un mensaje de error
            if (error) {
                console.log("Hubo un error en la consulta opciones", error.message);
                return res.status(404).send("Hubo un error en la consulta opciones");
            }
            if (resultado[0] == '') {
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
// Request URL: http://127.0.0.1:8080/competencias/2/voto

function cargavoto(req, res) {
    // trae todo género, no hay filtro
    console.log("aquí en cargavoto",req.params);
   
    //se ejecuta la consulta
    // con.query(sql, function (error, resultado, fields) {
    //     //si hubo un error, se informa y se envía un mensaje de error
    //     if (error) {
    //         console.log("Hubo un error en la consulta competencias", error.message);
    //         return res.status(404).send("Hubo un error en la consulta competencias");
    //     }
    //     //se envía la respuesta
    //     res.send(JSON.stringify(resultado));

    // });
}



module.exports = {
    buscacompetencias: buscacompetencias,
    buscaopciones: buscaopciones,
    cargavoto : cargavoto
} 