var con = require('../servidor/conexionbd');
//console.log(con);

function buscacompetencias(req, res) {
    // trae todo género, no hay filtro
    var sql = 'select * from  competencias';
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



module.exports = {
    buscacompetencias: buscacompetencias,
    
} 