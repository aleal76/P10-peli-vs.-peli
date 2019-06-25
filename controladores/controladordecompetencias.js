var con = require('../servidor/conexionbd');
//console.log(con);

function buscacompetencias(req, res) {
    console.log("hola ya adentro",req.params);
    // var pagina = req.query.pagina;
    // var titulo = req.query.titulo;
    // var genero = req.query.genero;
    // var anio = req.query.anio;
    // var cantidad = req.query.cantidad;
    // var columna_orden = req.query.columna_orden;
    // var tipo_orden = req.query.tipo_orden;
    // //armado de las partes del query si no hay condición uso true para que siempre sea el mismo query independientemente de cuántos parámetros lleguen.
    // // si cantidad es 0 lo dejo en 52
    // var sqlcantidad = (cantidad) ? cantidad : 52;
    // var offset = sqlcantidad * (pagina - 1); //inicio de cada página a mostrar, aranca en 0 y se incrementa en n cantidades
    // if (titulo) {
    //     var sqltitulo = "titulo = '" + titulo + "'";
    // } else {
    //     var sqltitulo = " TRUE ";
    // }
    // if (genero != 0 && genero != undefined) { 
    //     var sqlgeneroid = " genero_id = " + genero;
    // } else {
    //     var sqlgeneroid = " TRUE ";
    // }
    // if (anio != 0 && anio != undefined) {
    //     var sqlanio = "anio = " + anio;
    // } else {
    //     var sqlanio = " TRUE ";
    // }

    // // multiple query habilitado en conexionbd
    // // hago una query mulitple para traer las peliculas buscadas y el total con otro query 
    // var sql1 = 'SELECT * FROM pelicula WHERE ' + sqltitulo + ' AND ' + sqlgeneroid + ' AND ' + sqlanio + ' ORDER BY ' + columna_orden + ' ' + tipo_orden + ' LIMIT ' + offset + ',' + sqlcantidad + ';'
    // var sql2 = 'SELECT COUNT(*) FROM pelicula WHERE ' + sqltitulo + ' AND ' + sqlgeneroid + ' AND ' + sqlanio + ';'
    // //console.log("\nbuscapelicula queries", sql1);
    // //se ejecuta la consulta
    // con.query(sql1 + sql2, [1, 2], function (error, resultado, fields) {
    //     //si hubo un error, se informa y se envía un mensaje de error
    //     if (error) {
    //         console.log("Hubo un error en la consulta películas", error);
    //         return res.status(404).send("Hubo un error en la consulta películas");
    //     }
    //     //si no hubo error, se crea el objeto respuesta con las canciones encontradas
    //     var response = {
    //         'peliculas': resultado[0],
    //         'total': Object.values(resultado[1][0])
    //     };
    //     //se envía la respuesta
    //     res.send(JSON.stringify(response));

    // });
}

// function buscageneros(req, res) {
//     // trae todo género, no hay filtro
//     var sql = 'select * from  genero';
//     //se ejecuta la consulta
//     con.query(sql, function (error, resultado, fields) {
//         //si hubo un error, se informa y se envía un mensaje de error
//         if (error) {
//             console.log("Hubo un error en la consulta géneros", error.message);
//             return res.status(404).send("Hubo un error en la consulta géneros");
//         }
//         //si no hubo error, se crea el objeto respuesta con las 
//         var response = {
//             'generos': resultado
//         };
//         //se envía la respuesta
//         res.send(JSON.stringify(response));
//     });
// }



module.exports = {
    buscacompetencias: buscacompetencias,
    
} // no olvidarse cabeza de foco
