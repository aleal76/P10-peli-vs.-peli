
function buscaunacompetencia(req, res) {
    var sql = 'select * from competencia WHERE competencia.id = ' + req.params.id + ';';
    console.log("sisisisi", sql);
    var data;
    var competencia = {};
    var respuesta = { nombre: 'a', genero: 'b', actor: 'c', director: 'd' };
    var nombre, genero, actor, director;
    con.query(sql, function (error, resultado, fields) {
        //si hubo un error, se informa y se envía un mensaje de error
        if (error) {
            console.log("Hubo un error en buscando opciones datos competencia", error.message);
            return res.status(404).send("Hubo un error en la buscando opciones datos competencia ");
        }
        data = Object.values(resultado[0]);
        console.log(data);
        competencia = {
            id: data[0],
            nombre: data[1],
            generoid: data[2],
            actorid: data[3],
            directorid: data[4]
        };
        competencia.generoid = 3;
        competencia.directorid = 3210;
        competencia.actorid = 9;


        console.log(competencia.nombre, competencia.generoid, competencia.actorid, competencia.directorid);


        if (competencia.generoid != null) {
            var sql1 = 'select nombre from genero where id = ' + competencia.generoid + ';';
        }
        else {
            var sql1 = ' ;';
        }

        if (competencia.actorid != null) {
            var sql2 = 'select nombre from actor where id = ' + competencia.actorid + ';';
        }
        else {
            var sql2 = '; ';
        }

        if (competencia.directorid != null) {
            var sql3 = 'select nombre from director where id = ' + competencia.directorid + ';';
        }
        else {
            var sql3 = '';
        }

        console.log(sql1+sql2+sql3);
        con.query(sql1 + sql2+ sql3, function (error, resultado, fields) {
            //si hubo un error, se informa y se envía un mensaje de error
            if (error) {
                console.log("Hubo un error en buscagenero", error.message);
                return res.status(404).send("Hubo un error en la consulta genero");
            }
            //armo respuesta con todo junto
            resultado= object.values(resultado)
            console.log(JSON.stringify(resultado));
            resultado.push({ nombre: competencia.nombre});

            console.log(resultado);
            console.log(JSON.stringify(resultado));
            // var datazo = Object.values(resultado[0][0])[0];
            // console.log(datazo);
            // var genero = Object.values(resultado[0][0])[0];
            // var actor = Object.values(resultado[1][0])[0];
            // var director = Object.values(resultado[2][0])[0];
            //console.log("saliedas...",genero,actor,director);

            // var respuesta = {
            //     nombre: competencia.nombre,
            //     genero_nombre: Object.values(resultado[0][0])[0],
            //     actor_nombre: Object.values(resultado[1][0])[0],
            //     director_nombre: Object.values(resultado[2][0])[0]
            // };

            // console.log("respu", respuesta);
            // res.send(JSON.stringify(respuesta));


        });
    });
}
// var sql = 'select nombre from  actor where actor.id = ' + actor + ';';
// console.log("sql1", sql);
// //se ejecuta la consulta
// con.query(sql, function (error, resultado, fields) {
//     //si hubo un error, se informa y se envía un mensaje de error
//     if (error) {
//         console.log("Hubo un error en la consulta actores", error.message);
//         return res.status(404).send("Hubo un error en la consulta actores");
//     }
//     //se envía la respuesta
//     nombre = res.send(JSON.stringify(resultado));



//     //console.log("todo junto",data[1]);
//     console.log("datos", id, nombre, genero, actor, director);

//     if (genero == null) { genero = 'TRUE'; }
//     else {
//         genero = 'pelicula.genero_id = ' + genero;
//     }
//     console.log(genero);

//     if (actor == null) { actor = 'TRUE'; }
//     else {
//         actor = 'actor_pelicula.actor_id = ' + actor;
//     }
//     console.log(actor);

//     if (director == null) { director = 'TRUE'; }
//     else {
//         director = ' director_pelicula.director_id = ' + director;
//     }
//     console.log(director);
