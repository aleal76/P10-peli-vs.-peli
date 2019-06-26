USE competencias;
CREATE TABLE competencia (
 id INT NOT NULL AUTO_INCREMENT,
 nombre VARCHAR(70) NOT NULL,
 PRIMARY KEY (id)
);
CREATE TABLE voto (
 id INT NOT NULL AUTO_INCREMENT,
 pelicula_id INT NOT NULL,
 competencia_id INT NOT NULL,
 PRIMARY KEY (id),
 FOREIGN KEY (competencia_id) REFERENCES competencia(id),
 FOREIGN KEY (pelicula_id) REFERENCES pelicula(id)
)
