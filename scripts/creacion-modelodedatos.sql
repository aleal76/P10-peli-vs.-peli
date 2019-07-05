USE competencias;
//PASO 1 se agrega tabla competencias
CREATE TABLE competencia (
 id INT UNSIGNED NOT NULL AUTO_INCREMENT,
 nombre VARCHAR(70) NOT NULL,
 PRIMARY KEY (id)
);

//PASO 2 se agrega tabla votos con las referencias a competencia y película
CREATE TABLE voto (
 id INT UNSIGNED NOT NULL AUTO_INCREMENT,
 pelicula_id INT UNSIGNED NOT NULL,
 competencia_id INT UNSIGNED NOT NULL,
 votos INT UNSIGNED NOT NULL,
 PRIMARY KEY (id),
 FOREIGN KEY (competencia_id) REFERENCES competencia(id),
 FOREIGN KEY (pelicula_id) REFERENCES pelicula(id)
);
// se agrega genero, actor y director a competencias las con referencia a sus tablas de origen

ALTER TABLE competencia ADD genero_id INT UNSIGNED;
ALTER TABLE competencia ADD actor_id INT UNSIGNED;
ALTER TABLE competencia ADD director_id INT UNSIGNED;
ALTER TABLE competencia ADD FOREIGN KEY (actor_id) REFERENCES actor(id);
ALTER TABLE competencia ADD FOREIGN KEY (director_id) REFERENCES director(id);
ALTER TABLE competencia ADD FOREIGN KEY (genero_id) REFERENCES genero(id);