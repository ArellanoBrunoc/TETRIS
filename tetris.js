class JuegoTetris {
    constructor() {
        this.tetrisContainer = document.getElementById("tetrisContainer");

        // Inicializa el display de las celdas en 21x10, agrengado una fila más de las 20 para tener la fila oculta que decide cuando alguien pierde la partida
        this.displayGrid = this.initializeDisplayGrid(22, 10);
        // Inicializa una matriz de iguales dimensiones a la matriz del display
        this.filledGrid = this.initializeEmptyMatrix(22, 10);
        // Inicializa las posibles piezas jugables
        this.pieces = this.initializePieces();
        // Lleva el registro de si hay una ficha jugable en pantalla para evitar 2 fichas simultaneas
        this.displayingPiece = false;
        //La matriz de la pieza actual
        this.actualPiece;
        // variable que lleva el registro de las dimensiones verticales de la pieza
        this.rowDimensions;
        // variable que lleva el registro de las dimensiones horizontales de la pieza
        this.columnDimensions;
        //Contador que lleva registro de la fila en la que está la ficha
        this.pieceRow = 0;
        //Contador que lleva registro de la columna en la que está la ficha
        this.pieceColumn = 3;

        //LLeva el registro de si hay un game over y el estado de nivel y puntuacion del jugador
        this.gameOver = false;
        this.gameScore = 0;
        this.gameLevel = 1;

        this.gameSpeed = 300;
        this.uniquePieceHandler();
        this.pieceFall();

    }

    rotateEventHandler() {
        document.addEventListener('keydown', (event) => {
            if ((event.key === 'ArrowUp' || event.key === 'W') && this.displayingPiece && !this.gameOver) {
                this.rotatePiece('wise');
                this.updateDisplay(false);
            } else if ((event.key === 'ArrowDown' || event.key === 'S') && this.displayingPiece && !this.gameOver) {
                this.rotatePiece();
                this.updateDisplay(false);

            }
        });
    }


    inicializar() {
        this.playButton = document.getElementById("ButtonJugar");
        this.textOption = document.getElementById("textOption");
        this.gameOverElement = document.getElementById("gameOverMessage");
        document.addEventListener("DOMContentLoaded", () => {
            this.rotateEventHandler();
        });
    }


    //METODOS QUE INICIALIZAN EL JUEGO --------------------------------------------------

    //Metodo que regula la aparición de una pieza individual, cual pieza es y su caida hasta la siguiente pieza
    uniquePieceHandler() {
        if (!this.gameOver) {
            this.pieceRow = 0;
            this.pieceColumn = 3;
            if (!this.displayingPiece) {
                //TRAE UNA PIEZA ALEATORIA DE LAS POSIBLES
                let choosedPiece = this.generateRandomPiece();
                //LLAMA AL METODO QUE LA INICIALIZA EN EL DISPLAY Y EN LA MATRIX NUMERICA
                this.pieceDisplay(choosedPiece);
                //LLAMA AL METODO DE CAIDA DE LA PIEZA



            } else {//...

            }

        } else {


        }


    }

    //METODO QUE CREA LAS CELDAS MEDIANTE BUCLE Y RETORNA UNA MATRIZ DE LA CANTIDAD DE CELDAS CREADAS
    initializeDisplayGrid(rows, columns) {


        var matrix = Array.from({ length: rows }, () => Array(columns).fill(null));

        // BUCLE QUE CREA LAS CELDAS AL DISPLAYGRID
        for (let i = 0; i < rows * columns; i++) {
            const nuevaCelda = document.createElement("div");
            if (i < 20) {
                nuevaCelda.className = "cell topside";

            } else {

                nuevaCelda.className = "cell";

            }



            nuevaCelda.setAttribute('cellPosition', i + 1);
            this.tetrisContainer.appendChild(nuevaCelda);
        }



        var contador = 1;


        for (let i = 0; i < matrix.length; i++) {
            for (let j = 0; j < matrix[i].length; j++) {
                var selector = '.cell[cellPosition="' + contador + '"]';
                var celda = document.querySelector(selector);
                matrix[i][j] = celda;
                contador++;
            }
        }

        // RETORNAR LA MATRIZ 
        return matrix;
    }

    //METODO QUE CREA MATRIZ LLENA DE 0 CON LAS DIMENSIONES ESPECIFICADAS
    initializeEmptyMatrix(rows, columns) {


        var matrix = Array.from({ length: rows }, () => Array(columns).fill(null));

        for (let i = 0; i < matrix.length; i++) {
            for (let j = 0; j < matrix[i].length; j++) {

                matrix[i][j] = 0;

            }
        }

        // RETORNAR LA MATRIZ 
        return matrix;
    }

    // CREA UNA MATRIZ 3D QUE CONTIENE CADA PIEZA CON SUS DIMENSIONES Y LA DEVUELVE
    initializePieces() {
        const pieces = [
            [[1, 1, 1, 1]],         // I
            [[1, 1, 1], [1, 0, 0]], // L
            [[1, 1, 1], [0, 0, 1]], // J
            [[1, 1], [1, 1]],       // CUADRADO
            [[1, 1, 1], [0, 1, 0]], // T
            [[0, 1, 1], [1, 1, 0]], // Z Invertida
            [[1, 1, 0], [0, 1, 1]] // Z

            // Agrega más formas según sea necesario
        ];
        return pieces;
    }

    //TOMA UNA PIEZA ALEATORIA DE LAS PIEZAS DISPONIBLES 
    generateRandomPiece() {
        var PieceIndex = Math.floor(Math.random() * this.pieces.length);


        var choosedPiece = this.pieces[PieceIndex];
        this.rowDimensions = this.pieces[PieceIndex].length;
        this.columnDimensions = this.pieces[PieceIndex][0].length;

        this.actualPiece = this.pieces[PieceIndex];

        return (choosedPiece);

    }

    // FIN DE METODOS QUE INICIALIZAN EL JUEGO------------------------------------------------------------------------------



    //METODOS QUE REGULAN LA CARGA DEL DISPLAY --------------------------------------------------------------


    //METODO QUE DIBUJA LA PIEZA ALEATORIA EN EL DISPLAY
    pieceDisplay(piece) {
        // OBTIENE LA COORDENADA PARA UBICAR LA PIEZA SIEMPRE EN LA PARTE SUPERIOR MEDIA DEL DISPLAY


        // ITERA SOBRE LAS DIMENSIONES DE LA PIEZA
        for (let i = 0; i < piece.length; i++) {
            //ITERA SOBRE LOS VALORES DE LA DIMENSION ACTUAL
            for (let j = 0; j < piece[i].length; j++) {
                //CALCULA LA POSICION DONDE SE PINTARA VALOR CUADRO DE LA PIEZA
                const gridRow = this.pieceRow + i;
                const gridCol = this.pieceColumn + j;

                // SE ASEGURA DE QUE LA PIEZA ESTE DENTRO DEL LIMITE DEL DISPLAY
                if (gridRow >= 0 && gridRow < this.displayGrid.length && gridCol >= 0 && gridCol < this.displayGrid[0].length) {
                    // OBTIENE EL OBJETO CELDA GUARDADO ANTERIORMENTE EN LA MATRIZ
                    const gridCell = this.displayGrid[gridRow][gridCol];

                    //SI EL VALOR EN ESA POSICION DE LA PIEZA ES 1, RELLENA EL CUADRO, SI NO, LO DEJA VACIO
                    if (piece[i][j] == 1) {

                        if (gridRow == 0 && this.filledGrid[gridRow][gridCol] == 3) {

                        } else {
                            gridCell.classList.add('piece');
                            this.filledGrid[gridRow][gridCol] = 1;

                        }

                    } else {

                        this.filledGrid[gridRow][gridCol] = 0;
                    }
                }
            }
        }
        //BLOQUEA LA APARICION DE UNA NUEVA PIEZA
        this.displayingPiece = true;

    }

    //METODO QUE ACTUALIZA EL DISPLAY
    updateDisplay(colapse) {

        if (!colapse) {
            for (let i = 0; i < this.filledGrid.length; i++) {
                for (let j = 0; j < this.filledGrid[i].length; j++) {
                    if (this.filledGrid[i][j] == 1) {

                        this.displayGrid[i][j].classList.add('piece');

                    } else if (this.filledGrid[i][j] == 0) {
                        this.displayGrid[i][j].classList.remove('piece');
                        this.displayGrid[i][j].classList.remove('filled');
                        this.displayGrid[i][j].classList.remove('transition');
                    }
                }
            }
        } else {
            for (let i = 0; i < this.filledGrid.length; i++) {
                for (let j = 0; j < this.filledGrid[i].length; j++) {
                    if (this.filledGrid[i][j] == 1 || this.filledGrid[i][j] == 3) {
                        this.filledGrid[i][j] = 3;
                        this.displayGrid[i][j].classList.add('filled');
                        this.displayGrid[i][j].classList.remove('piece');
                    } else if (this.filledGrid[i][j] == 0) {
                        this.displayGrid[i][j].classList.remove('piece');
                        this.displayGrid[i][j].classList.remove('filled');
                    }
                }
            }


            this.displayingPiece = false;
            this.pieceRow = 0;
            this.gameOverHandler();
            this.uniquePieceHandler();



        }



    }


    // FIN DED METODOS QUE REGULAN LA CARGA DEL DISPLAY -----------------------------------------------------------------



    //METODOS QUE REALIZAN LOS CALCULOS EN LA MATRIZ NUMERICA


    //METODO QUE REGULA LA CAIDA DE UNA PIEZA
    pieceFall() {

        // Establece un temporizador para simular la caída de la pieza
        setTimeout(() => {

            // Verificar colisiones y detener la caída si es necesario
            if (this.checkCollision()) {
                // Detener la caída si hay colisión

                this.updateDisplay(true);
                this.scoreAndClean();
            } else {
                // Mover la pieza hacia abajo
                this.movePieceDown();

                this.updateDisplay(false);
                this.scoreAndClean();
            }

            // Resuelve la promesa después de completar la caída

            this.pieceFall();







        }, this.gameSpeed);




    }
    pieceFallFORCED() {


        // Verificar colisiones y detener la caída si es necesario
        if (this.checkCollision()) {
            // Detener la caída si hay colisión

            this.updateDisplay(true);
            this.scoreAndClean();
        } else {
            // Mover la pieza hacia abajo
            this.movePieceDown();

            this.updateDisplay(false);
            this.scoreAndClean();
        }

        // Resuelve la promesa después de completar la caída

    }
    //METODO QUE MUEVE LA MATRIZ NUMERICA
    movePieceDown() {

        // Mover la pieza hacia abajo

        //REVISA SI LA PIECE ROW ESTA EN RANGO
        if (this.pieceRow < 22) {
            //Itera sobre la matriz de abajo para arriba buscando los 1 que contienen la pieza y moviendolos hacia abajo
            for (let i = this.filledGrid.length - 1; i > 0; i--) {
                for (let j = 0; j < this.filledGrid[0].length; j++) {
                    if (this.filledGrid[i - 1][j] == 1) {
                        this.filledGrid[i - 1][j] = 0;
                        this.filledGrid[i][j] = 1;
                    }

                }
            }
        }

        this.pieceRow++;
    }

    //METODO QUE REVISA POR COLISIONES VERTICALES
    checkCollision() {

        // Calcula la fila en la que esta la ultima posicion de la ficha, sumando pieceRow que es la primera fila de la ficha y las dimensiones de la ficha -1 
        this.pieceRow;
        // Crea la variable que controla la colision, asume que es falsa
        let collision = false;
        let contador = 0;
        //La verificación se hace solo si la ultima fila de la ficha esta dentro del rango de filas de la matriz
        if (this.pieceRow < this.filledGrid.length - this.rowDimensions) {
            // Se asegura que los index sean dentro del rango de columnas de la matriz
            for (let i = 0; i < this.filledGrid.length - 1; i++) {
                // Se asegura que los index sean dentro del rango de columnas de la matriz
                for (let j = 0; j < this.filledGrid[i].length; j++) {
                    //Para poder caer una pieza, la cantidad de 1's con un 0 en la fila proxima debe ser igual a la cantidad de dimensiones horizontales de la pieza
                    if (this.filledGrid[i][j] == 1 && this.filledGrid[i + 1][j] == 0) {
                        contador++;

                    }

                }

            }

            if (contador >= this.columnDimensions) {
                collision = false;

            } else {
                collision = true;
            }

        } else {
            collision = true;


        }


        return collision;
    }

    // -----------------------------------------------------




    //METODO PARA PERMITIR LOS COMANDOS DEL JUGADOR Y LA ACELERACION DE LA CAIDA DE LA PIEZA
    horizontalMoveHandler() {
        // Agregar un evento de teclado al documento
        document.addEventListener('keydown', (event) => {
            // Verificar si la tecla presionada es la flecha derecha o la tecla "D"
            if (event.key === 'ArrowRight' || event.key === 'D') {

                // Realizar acciones correspondientes al movimiento a la derecha
                if (!this.rightCheckCollision()) {
                    // Lógica para mover la ficha a la derecha si no hay colisión
                    // Llamada a la función que realiza el movimiento a la derecha
                    this.movePieceRight();
                    // Actualizar la visualización del juego después del movimiento
                    this.updateDisplay();
                }


            } else if (event.key === 'ArrowLeft' || event.key === 'A') {

                // Realizar acciones correspondientes al movimiento a la derecha
                if (!this.LeftCheckCollision()) {
                    // Lógica para mover la ficha a la derecha si no hay colisión
                    // Llamada a la función que realiza el movimiento a la derecha
                    this.movePieceLeft();
                    // Actualizar la visualización del juego después del movimiento
                    this.updateDisplay();
                }




            } else if (event.key == 'Q' || event.key == 'q') {
                this.pieceFallFORCED();


            }
        });
    }

    //Metodo para rotar la pieza , recibo el sentido en el que se quiere rotar
    async rotatePiece(clock) {
        // Verifica si hay una pieza en pantalla y si el juego no ha terminado
        if (clock == 'wise') {
            if (this.displayingPiece && !this.gameOver) {
                // Realiza la rotación de la pieza en sentido horario
                const rotatedPiece = this.rotateMatrixClockwise(this.actualPiece);

                // Verifica si la rotación es válida (sin colisiones)
                if (!this.checkRotationCollision(rotatedPiece)) {
                    // Elimina la pieza actual del display y la matriz numérica
                    this.removePieceFromDisplay();

                    // Actualiza la pieza actual con la pieza rotada
                    this.actualPiece = rotatedPiece;
                    [this.rowDimensions, this.columnDimensions] = [this.columnDimensions, this.rowDimensions];
                    // Dibuja la nueva posición de la pieza en el display y la matriz numérica
                    this.pieceDisplay(this.actualPiece);
                }
            }
        } else {
            if (this.displayingPiece && !this.gameOver) {
                // Realiza la rotación de la pieza en sentido horario
                const rotatedPiece = this.rotateMatrixCounterclockwise(this.actualPiece);

                // Verifica si la rotación es válida (sin colisiones)
                if (!this.checkRotationCollision(rotatedPiece)) {
                    // Elimina la pieza actual del display y la matriz numérica
                    this.removePieceFromDisplay();

                    // Actualiza la pieza actual con la pieza rotada
                    this.actualPiece = rotatedPiece;
                    [this.rowDimensions, this.columnDimensions] = [this.columnDimensions, this.rowDimensions];
                    // Dibuja la nueva posición de la pieza en el display y la matriz numérica
                    this.pieceDisplay(this.actualPiece);
                }
            }





        }



    }

    // Método para verificar si la rotación causa colisiones
    checkRotationCollision(rotatedPiece) {
        // Crea una copia temporal de la matriz numérica para simular la rotación
        const tempFilledGrid = JSON.parse(JSON.stringify(this.filledGrid));

        // Elimina la pieza actual de la copia temporal
        this.removePieceFromGrid(tempFilledGrid);

        // Verifica si hay colisiones con la nueva posición de la pieza rotada
        return this.checkCollisionWithGrid(rotatedPiece, tempFilledGrid);
    }

    // Método para eliminar la pieza actual de la matriz numérica
    removePieceFromGrid(grid) {
        for (let i = 0; i < this.rowDimensions; i++) {
            for (let j = 0; j < this.columnDimensions; j++) {
                if (this.actualPiece[i][j] === 1) {
                    grid[this.pieceRow + i][this.pieceColumn + j] = 0;
                }
            }
        }
    }

    // Método para verificar colisiones con la matriz numérica
    checkCollisionWithGrid(piece, grid) {
        for (let i = 0; i < piece.length; i++) {
            for (let j = 0; j < piece[i].length; j++) {
                const gridRow = this.pieceRow + i;
                const gridCol = this.pieceColumn + j;

                if (piece[i][j] === 1) {
                    // Verifica si la nueva posición de la pieza colisiona con la matriz numérica
                    if (gridRow < 0 || gridRow >= grid.length || gridCol < 0 || gridCol >= grid[0].length || grid[gridRow][gridCol] === 1 || grid[gridRow][gridCol] === 3) {
                        return true;
                    }
                }
            }
        }
        return false;
    }

    // Método para eliminar la pieza actual del display y la matriz numérica
    removePieceFromDisplay() {
        for (let i = 0; i < this.rowDimensions; i++) {
            for (let j = 0; j < this.columnDimensions; j++) {
                if (this.actualPiece[i][j] === 1) {
                    this.filledGrid[this.pieceRow + i][this.pieceColumn + j] = 0;
                    this.displayGrid[this.pieceRow + i][this.pieceColumn + j].classList.remove('piece');
                }
            }
        }
    }

    rotateMatrixClockwise(matrix) {
        // Lógica para rotar una matriz 90 grados en sentido horario
        const rows = matrix.length;
        const columns = matrix[0].length;
        const rotatedMatrix = Array.from({ length: columns }, () => Array(rows).fill(null));

        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < columns; j++) {
                rotatedMatrix[j][rows - 1 - i] = matrix[i][j];
            }
        }

        return rotatedMatrix;
    }
    // Función para rotar una matriz 90 grados en sentido antihorario
    rotateMatrixCounterclockwise(matrix) {
        const rows = matrix.length;
        const columns = matrix[0].length;
        const rotatedMatrix = Array.from({ length: columns }, () => Array(rows).fill(null));

        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < columns; j++) {
                rotatedMatrix[columns - 1 - j][i] = matrix[i][j];
            }
        }

        return rotatedMatrix;
    }

    //METODO QUE VERIFICA CHOQUES HACIA LA DERECHA
    rightCheckCollision() {

        // Calcula la fila en la que esta la ultima posicion de la ficha, sumando pieceRow que es la primera fila de la ficha y las dimensiones de la ficha -1 
        this.pieceRow;
        // Crea la variable que controla la colision, asume que es falsa
        let collision = false;
        let contador = 0;

        //La verificación se hace solo si la ultima fila de la ficha esta dentro del rango de filas de la matriz
        if (this.pieceColumn + this.columnDimensions + 1 <= this.filledGrid[0].length + 1) {
            // Se asegura que los index sean dentro del rango de columnas de la matriz
            for (let i = this.filledGrid.length - 1; i > 0; i--) {
                // Se asegura que los index sean dentro del rango de columnas de la matriz
                for (let j = 0; j < this.filledGrid[0].length; j++) {
                    //Para poder caer una pieza, la cantidad de 1's con un 0 en la fila proxima debe ser igual a la cantidad de dimensiones horizontales de la pieza
                    if (this.filledGrid[i][j] == 1 && this.filledGrid[i][j + 1] == 0) {
                        contador++;

                    }

                }

            }

            if (contador >= this.rowDimensions) {
                collision = false;

            } else {
                collision = true;
            }

        } else {

            collision = true;


        }


        return collision;




    }

    //METODO QUE VERIFICA CHOQUES A LA IZQUIERDA
    LeftCheckCollision() {

        // Calcula la fila en la que esta la ultima posicion de la ficha, sumando pieceRow que es la primera fila de la ficha y las dimensiones de la ficha -1 
        this.pieceRow;
        // Crea la variable que controla la colision, asume que es falsa
        let collision = false;
        let contador = 0;

        //La verificación se hace solo si la ultima fila de la ficha esta dentro del rango de filas de la matriz
        if (this.pieceColumn - 1 >= 0) {
            // Se asegura que los index sean dentro del rango de columnas de la matriz
            for (let i = this.filledGrid.length - 1; i >= 0; i--) {
                // Se asegura que los index sean dentro del rango de columnas de la matriz
                for (let j = 0; j < this.filledGrid[0].length; j++) {
                    //Para poder caer una pieza, la cantidad de 1's con un 0 en la fila proxima debe ser igual a la cantidad de dimensiones horizontales de la pieza
                    if (this.filledGrid[i][j] == 1 && this.filledGrid[i][j - 1] == 0) {
                        contador++;

                    }

                }

            }

            if (contador >= this.rowDimensions) {
                collision = false;

            } else {
                collision = true;
            }

        } else {

            collision = true;


        }


        return collision;




    }

    //METODO PARA MOVER LA PIEZA A LA DEDRECHA
    async movePieceRight() {


        if (this.pieceColumn < this.filledGrid[0].length) {
            // Itera sobre la matriz de abajo para arriba buscando los 1 que contienen la pieza y moviéndolos hacia la derecha
            for (let i = this.filledGrid[0].length - 1; i > 0; i--) {
                for (let j = 0; j < this.filledGrid.length; j++) {
                    if (this.filledGrid[j][i - 1] == 1) {
                        this.filledGrid[j][i] = 1;
                        this.filledGrid[j][i - 1] = 0;
                    }
                }
            }
        }

        this.pieceColumn++;

    }

    //METODO PARA MOVER LA PIEZA A LA IZQUIERDA
    async movePieceLeft() {


        if (this.pieceColumn > 0) {
            // Itera sobre la matriz de abajo para arriba buscando los 1 que contienen la pieza y moviéndolos hacia la derecha
            for (let i = 0; i < this.filledGrid[0].length; i++) {
                for (let j = 0; j < this.filledGrid.length; j++) {
                    if (this.filledGrid[j][i + 1] == 1) {
                        this.filledGrid[j][i] = 1;
                        this.filledGrid[j][i + 1] = 0;
                    }
                }
            }
        }

        this.pieceColumn--;

    }

    //ESTE METODO CREA UN NUEVO ARRAY Y DENTRO DE EL VA A ALMANCENAR LOS INDICES DE CADA FILA QUE ESTE COMPLETAMENTE LLENA Y LOS ENVIA A SORTING LINES
    scoreAndClean() {
        let cleanLines = new Array();
        for (let i = 0; i < this.filledGrid.length; i++) {

            if (this.filledGrid[i][0] == 3 && this.filledGrid[i][1] == 3 && this.filledGrid[i][2] == 3 && this.filledGrid[i][3] == 3 && this.filledGrid[i][4] == 3 &&
                this.filledGrid[i][5] == 3 && this.filledGrid[i][6] == 3 && this.filledGrid[i][7] == 3 && this.filledGrid[i][8] == 3 && this.filledGrid[i][9] == 3) {


                cleanLines.push(i);

            }
        }

        this.sortingLines(cleanLines);


    }

    // ESTE METODO ACTUALIZA A 0 EN LA MATRIZ NUMERICA TODAS LAS FILAS ENVIADAS POR scoreAndClean
    sortingLines(lines) {


        let score = lines.length;
        while (lines.length > 0) {

            for (let i = 0; i < 1; i++) {
                for (let j = 0; j < this.filledGrid[0].length; j++) {

                    this.filledGrid[lines[0]][j] = 0;




                }

                this.cleaningLines(lines[0]);
            }
            lines.splice(0, 1);



        }
        this.scoreUpdate(score);

    }

    // ESTE METODO ACTUALIZA VALORES Y CLASES DE LAS FILAS LIMPIADAS Y/O MOVIDAS
    cleaningLines(line) {

        for (let i = line; i > 0; i--) {

            for (let j = 0; j < this.filledGrid[0].length; j++) {

                if (this.filledGrid[i][j] == 0 && this.filledGrid[i - 1][j] == 3) {
                    this.filledGrid[i][j] = 3;
                    this.filledGrid[i - 1][j] = 0;

                    this.displayGrid[i][j].className = 'cell filled';
                    this.displayGrid[i - 1][j].className = 'cell filled';

                    this.updateDisplay(false);


                }

            }

        }




    }

    scoreUpdate(score) {
        const lanesDiv = document.getElementById('lanes');
        const scoreDiv = document.getElementById('score');
        let actualScore = parseInt(scoreDiv.innerText);
        let actualLanes = parseInt(lanesDiv.innerText);

        actualScore += (score * 100);
        this.gameScore = actualScore;
        actualLanes += (score);
        scoreDiv.innerText = actualScore;
        lanesDiv.innerText = actualLanes;
        if (this.gameScore == 100) {

            this.gameLevel = 1;

        } else if (this.gameScore == 500) {
            this.gameLevel = 2;
         } else if (this.gameScore == 1000) {
            this.gameLevel = 3;
          }else if (this.gameScore == 1500) {
            this.gameLevel = 4;
          }else if (this.gameScore == 2000) {
            this.gameLevel = 5;
          }else if (this.gameScore == 2500) {
            this.gameLevel = 6;
          }else if (this.gameScore == 3000) {
            this.gameLevel = 7;
          }else if (this.gameScore == 3500) {
            this.gameLevel = 8;
          }else if (this.gameScore == 4000) {
            this.gameLevel = 9;
          }else if (this.gameScore == 4500) {
            this.gameLevel = 10;
          }
          this.speedUp();

    }


    speedUp() {
    const levelDiv = document.getElementById('level');


        if(this.gameLevel == 1){
            this.gameSpeed = 300;
            levelDiv.innerText = '1';

        } if(this.gameLevel == 2){
            this.gameSpeed = 280;
            levelDiv.innerText = '2';

        } if(this.gameLevel == 3){
            this.gameSpeed = 260;

            levelDiv.innerText = '3';
        } if(this.gameLevel == 4){
            this.gameSpeed = 240;
            levelDiv.innerText = '4';

        } if(this.gameLevel == 5){
            this.gameSpeed = 220;

            levelDiv.innerText = '5';
        } if(this.gameLevel == 6){
            this.gameSpeed = 210;
            levelDiv.innerText = '6';

        } if(this.gameLevel == 7){
            this.gameSpeed = 190;

            levelDiv.innerText = '7';
        } if(this.gameLevel == 8){
            this.gameSpeed = 180;
            levelDiv.innerText = '8';

        } if(this.gameLevel == 9){
            this.gameSpeed = 170;

            levelDiv.innerText = '9';
        } if(this.gameLevel == 10){
            this.gameSpeed = 150;

            levelDiv.innerText = '10';
        }
 
        console.log(this.gameLevel + ''+ this.gameSpeed);

    }

    //METODO PARA ORDENAR UN ARREGLO DE MAYOR A MENOR
    sortHighToLow(a, b) {
        return b - a;
    }





    gameOverHandler() {
        for (let i = 0; i < 2; i++) {
            for (let j = 0; j < this.filledGrid[i].length; j++) {
                if (this.filledGrid[i][j] == 3) {
                    this.gameOver = true;
                    this.showGameOverMessage();
                    return;
                }
            }
        }
    }

    showGameOverMessage() {

        
        this.gameOverElement.style.display = 'flex';    
    
         this.gameOverElement.style.opacity = '1';
 
         for (let i = 0; i < this.displayGrid.length; i++) {
             for (let j = 0; j < this.displayGrid[0].length; j++) {
                 this.displayGrid[i][j].style.opacity = '0';
             }
             
         }
 
 
         this.disableUserInput();
 
         this.textOption.innerText = 'GAME OVER';
         this.playButton.style.opacity = '0'
 
         setTimeout(() => {
             window.location.reload();
         }, 3000);
 
 
 
 
 
     }
 

    disableUserInput() {
        document.removeEventListener('keydown', this.rotateEventHandler);
        document.removeEventListener('keydown', this.horizontalMoveHandler);
    }





}


const buttonJugar = document.getElementById('ButtonJugar');
const gameOverMessage = document.getElementById('gameOverMessage');


buttonJugar.addEventListener('click', (event) => {
    gameOverMessage.style.opacity = '0';


    setTimeout(() => {
        gameOverMessage.style.display = 'none';
    }, 1500);


    const jugarTetris = new JuegoTetris();
    jugarTetris.inicializar();
    jugarTetris.horizontalMoveHandler();
    jugarTetris.rotateEventHandler();



});
