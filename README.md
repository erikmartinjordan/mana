![License](https://img.shields.io/github/license/erikmartinjordan/nomoresheet)
![Test](https://img.shields.io/github/workflow/status/erikmartinjordan/nomoresheet/deployToFirebase)

# Nomoresheet

![Nomoresheet logo](https://github.com/erikmartinjordan/Screenshots/blob/master/Captura_de_pantalla_2021-05-26_a_las_10.32.53-removebg-preview.png?raw=true)

Nomoresheet es una comunidad abierta de preguntas y respuestas donde cualquier tema es bienvenido. Los usuarios pueden ganar reputación a medida que consiguen puntos en la comunidad.

Nomoresheet es de código abierto, cualquier usuario puede crear una réplica de la comunidad y modificarla a su antojo.

Nomoresheet es una comunidad sin ánimo de lucro; todos los beneficios que se recogen a través de Nomoresheet, se reinvierten de nuevo en la compañía, de tal forma que nadie puede venderla en el futuro. 

## Puntuación

Los usuarios obtienen mayores privilegios a medida que aumenta su reputación en la web. 

La reputación se consigue sumando puntos que están repartidos del siguiente modo:

| Tipo        | Puntos |
|-------------|--------|
| Publicación | 30     |
| Respuesta   | 40     |
| Picante     | 50     |
| Aplauso     | 60     |

Por publicaciones nuevas, un usuario obtiene 30 puntos, por una respuesta 40, si la publicación recibe picante, se obtienen 50 y, por un aplauso, se obtienen 60 puntos.

## Niveles

Los niveles dependen del número de puntos y siguen una curva logarítmica:

<img src="https://render.githubusercontent.com/render/math?math=level=\lfloor{log_1.5(points%2B1)}\rfloor">


Por ejemplo, vamos a ver unos cuantos valores:

| Nivel | Puntos         |
|-------|----------------|
| 25    | 25250,16829    |
| 50    | 637621499,2    |
| 75    | 16100687809804 |
| 100   | 4,06561E+17    |


## Copyright y licencia

Copyright (c) 2015 — 2021 Nomoresheet — Licencia [MIT](https://github.com/erikmartinjordan/nomoresheet/blob/master/LICENSE).
