/** Cambié el modo en que se busca el estado de las casillas.
 * Antes usaba un identificador de fila y columna como propiedades de cada casilla
 * y con un array.find() de dos entradas buscaba cada casilla.
 * Ahora usé array anidados y la ubicación de las casillas se da por el índice del array grande y el índice del array anidado.
 * Se me hizo un poco más fácil de lo que esperaba cambiar todo el código. 
 */

const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");

// Tamaño del lado de las casillas
const tile = 20;
const borde = 1;

// Casillas
// Cantidad de casillas por lado (cuadrado = casillas x casillas).
const casillas = 30;
const casillaColor = "rgba(255, 255, 255, 0.9)";
const casillaColorVacia = "rgba(240, 240, 240, 0.05)";

// Canvas
const canvasWidth = casillas*(tile+borde) + borde;
const canvasHeight = casillas*(tile+borde) + borde;
canvas.width = canvasWidth;
canvas.height = canvasHeight;
canvas.style = "background-color: rgba(5, 10, 20, 1)";

// Casillas vacías
function casillasVacias(){
    for(c = 0; c < casillas; c++){
        for(f = 0; f < casillas; f++){
            context.beginPath();
            context.rect((tile+borde)*c + borde, (tile+borde)*f + borde, tile, tile);
            context.fillStyle = casillaColorVacia;
            context.fill();
        }
    }
}
//casillasVacias();

// Función constructora de casillas
// Incluye el estado de viva/muerta con boolean y dos identificadores, de fila y columna
function Casilla(x, y, alive){
    this.x = x;
    this.y = y;
    this.alive = alive;
    this.dibujar = function(){
        context.beginPath();
        context.rect(x, y, tile, tile);
        context.fillStyle = casillaColor;
        context.fill();
    }
}

// Array de casillas
let casillasArray = [];
casillasArray.length = casillas;
for(f = 0; f < casillas; f++){
    casillasArray[f] = [];
    casillasArray[f].length = casillas;
    for(c = 0; c < casillas; c++){
        let casilla = new Casilla((tile+borde)*c + borde, (tile+borde)*f + borde, false);
        casillasArray[f][c] = casilla;
    }
}

// Dibujado del array
function dibujarArray(){
    context.clearRect(0, 0, canvas.width, canvas.height);
    //casillasVacias();
    // Dibujar casillas vivas
    for(idxf in casillasArray){
        for(idxc in casillasArray[idxf]){
            if(casillasArray[idxf][idxc].alive == true)
                {
                    casillasArray[idxf][idxc].dibujar();
                }
            }

        }
    }

// Cambiar estado de la casilla con un click del mouse
canvas.addEventListener("mousedown", click);
function click(event){
    let mouseX = event.pageX - canvas.offsetLeft;
    let mouseY = event.pageY - canvas.offsetTop;
    for(idxf in casillasArray){
        for(idxc in casillasArray[idxf]){
            if(casillasArray[idxf][idxc].x < mouseX && casillasArray[idxf][idxc].x + tile > mouseX && casillasArray[idxf][idxc].y < mouseY && casillasArray[idxf][idxc].y + tile > mouseY)
                {
                    if (casillasArray[idxf][idxc].alive == false){
                        casillasArray[idxf][idxc].alive = true;
                    }
                    else if (casillasArray[idxf][idxc].alive == true){
                        casillasArray[idxf][idxc].alive = false;
                    }
                }
        }
    }        
    dibujarArray();

}

// FUNCIÓN PRINCIPAL - ITERACIONES 
// Actualizar con la tecla espaciadora
document.addEventListener("keyup", actualizar);
function actualizar(event){
    if(event.code == "Space"){
        comparar();
        dibujarArray();
    }
}

// Comparar estados entre casillas y cambiar estados
// Podría dividir esta función, porque contiene demasiados pasos intermedios
function comparar(){    
    let array = [];
    array.length = casillas;
    for(f=0;f<casillas;f++){ 
        array[f] = [];
        array[f].length = casillas;
        for(c=0;c<casillas;c++){   
            let casilla = new Casilla(casillasArray[f][c].x, casillasArray[f][c].y, casillasArray[f][c].alive);
            let contadorAlive = 0;
            if (casillasArray[f][c].alive == true){
                contadorAlive-= 1;
            }   
            for(i = -1; i <= 1; i++){
                for(j = -1; j <= 1; j++){
                    if(f + i< 0 || f + i >= casillas || c + j < 0 || c + j >= casillas){
                        contadorAlive+= 0;
                    } 
                    else if(casillasArray[f + i][c + j].alive == true){
                        contadorAlive+= 1;
                    }
                }
            }
            switch(true){
            case (contadorAlive <= 1):
                casilla.alive = false;
                break;
            case (contadorAlive >= 4):
                casilla.alive = false;
                break;
            case (contadorAlive == 3):
                casilla.alive = true;
                break;        
            case (contadorAlive == 2 && casillasArray[i].alive == true):
                casilla.alive = true;
                break;
            case (contadorAlive == 2 && casillasArray[i].alive == false):
                casilla.alive = false;
                break;
            }
        
            array[f][c] = casilla;
        }        
    }
    for(f = 0; f < casillas; f++){
        for(c = 0; c < casillas; c++){
            casillasArray[f][c].alive = array[f][c].alive;
        }
    }
}




//*******Pruebas
// Qué pasa si tengo un array y quiero usar un índice de array fuera de rango.
// Puedo asignarle un valor neutro a los casos fuera de rango.
// let pip = [2, 3, 4];
// let pop = 5;
// function prueba(){
// if(pop < 0 || pop > pip.length){
//     pip[pop] = 0;
// }
//     console.log(pip[1] + pip[pop]);
// }
// prueba();
////////////////////////////
// Forma de duplicar un array. con .concat se pueden unir dos array, 
// creando un tercero nuevo e independiente.
// Si el primer array se deja vacío, hará una duplicación del array del argumento.
// Si la copia se realiza en un array con elementos, los elementos antiguos se reemplazan
// por los nuevos.

// let apip = [1, 2, 3, 4];
// let bpip = [9, 8, 7, 6, 5];
// bpip = [].concat(apip);
// console.log(bpip);
///////////////////////////////
// .find para buscar elementos en un array que coincidan con la descripción
// const vecino = casillasArray.find(({idFil, idCol}) => idFil === 5 && idCol === 6);
// console.log(vecino);