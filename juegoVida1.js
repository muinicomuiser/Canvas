/** Prueba primera de creación de el juego de la vida.
 * Supongo que necesitaré dos eventos: un click para cambiar el estado de cada casilla
 * y otro evento, como la tecla espacio, para avanzar a la iteración siguiente 
 * 
 */

const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");

// Tamaño del lado de las casillas
const tile = 16;
const borde = 1;

// Casillas
// Cantidad de casillas por lado (cuadrado = casillas x casillas).
const casillas = 40;
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
function Casilla(x, y, alive, idFil, idCol){
    this.x = x;
    this.y = y;
    this.idFil = idFil;
    this.idCol = idCol;
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
for(f = 0; f < casillas; f++){
    for(c = 0; c < casillas; c++){
        let casilla = new Casilla((tile+borde)*c + borde, (tile+borde)*f + borde, false, f+1, c+1);
        casillasArray.push(casilla);
        //casilla.dibujar();
        
    }
}
function dibujarArray(){
    context.clearRect(0, 0, canvas.width, canvas.height);
    //casillasVacias();
    // Dibujar casillas vivas
    for(idx in casillasArray){
        if(casillasArray[idx].alive == true)
            {
                casillasArray[idx].dibujar();
            }
        }
}

// Cambiar estado de la casilla con un click del mouse
canvas.addEventListener("mousedown", click);
function click(event){
    let mouseX = event.pageX - canvas.offsetLeft;
    let mouseY = event.pageY - canvas.offsetTop;
    for(idx in casillasArray){
        if(casillasArray[idx].x < mouseX && casillasArray[idx].x + tile > mouseX && casillasArray[idx].y < mouseY && casillasArray[idx].y + tile > mouseY)
            {
                if (casillasArray[idx].alive == false){
                    casillasArray[idx].alive = true;
                    console.log("fila", casillasArray[idx].idFil, "columna", casillasArray[idx].idCol);
                }
                else if (casillasArray[idx].alive == true){
                    casillasArray[idx].alive = false;
                    console.log("fila", casillasArray[idx].idFil, "columna", casillasArray[idx].idCol);
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
let array = [];
function comparar(){    
    array = [];
    for(i=0;i<casillasArray.length;i++){    
        let casilla = new Casilla(casillasArray[i].x, casillasArray[i].y, casillasArray[i].alive, casillasArray[i].idFil, casillasArray[i].idCol);
        let contadorAlive = 0;
        if (casillasArray[i].alive == true){
            contadorAlive-= 1;
        }   
            
        for(f = -1; f <= 1; f++){
            for(c = -1; c <= 1; c++){
                if(buscar(casillasArray[i].idFil + f, casillasArray[i].idCol + c)){
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
        array.push(casilla);

    }
    for(idx in casillasArray){
        casillasArray[idx].alive = array[idx].alive;
    }
}

// Busca una casilla en el array a partir de dos propiedades: fila y columna. 
// Si existe, retorna su estado, y si no, retorna false 
function buscar(fil, col){    
    if(fil > 0 && fil <= casillas && col > 0 && col <= casillas){
        let vecino = casillasArray.find(({idFil, idCol}) => idFil === fil && idCol === col);
        return vecino.alive;
    } else {
        return false;
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