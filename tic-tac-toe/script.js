var initcls = "game-tile",
    empty = "empty",
    notempty = "notempty",
    notrans = "notrans",
    notplayable = 'notplayable',
    hidden = 'hidden',
    minor = 'minor',
    x = "X",
    o = "O",
    turn = x,
    turnCounter = 0,
    playerNum = 1,
    nextTurnBtn = document.getElementById("nextTurnBtn"),
    myLog = document.getElementById("sdfgsdj"),
    myLogResult = document.getElementById("dpwogmm"),
    myConsole = document.getElementById("ceojmds"),
    canPlay = true,
    idxX = 0,
    idxY = 0,
    counter = 0,
    win = false,
    chkPosStr = "",
    idxI = 0,
    idxJ = 0,
    rowSize = 0,
    tile = null,
    board = null, //array
    boardUlId = 'kVUqnvP',
    boardUl = document.getElementById(boardUlId),
    addTilesForm = document.forms.addtiles,
    minRowSize = parseInt(addTilesForm.elements.sizefield.getAttribute("min")),
    maxRowSize = parseInt(addTilesForm.elements.sizefield.getAttribute("max"));
addTilesForm.elements.sizebtn.addEventListener("click", addTiles);

function addTiles() {
    rowSize = parseInt(addTilesForm.elements.sizefield.value);
    if (isNaN(rowSize)) {
        newConsoleItem('ERROR! Input is NaN!', 'e');
    } else if (rowSize < minRowSize) {
        newConsoleItem('ERROR! Input is too small!', 'e');
    } else if (rowSize > maxRowSize) {
        newConsoleItem('ERROR! Input is too big!', 'e');
    } else {
        newConsoleItem('function addTiles(', rowSize, ') is executing');
        var tileHtml = null,
            cls = initcls + ' ' + empty + ' ' + notrans + ' ' + turn.toLowerCase(),
            styleTag = document.createElement('style');
        styleTag.innerHTML = '.ixigool {' + '\n' +
            '\t' + '--row-size: ' + rowSize + ';' + '\n' +
            '}' + '\n' +
            '.ixigool .ul-ctr {' + '\n' +
            '\t' + 'display: inline-block;' + '\n' +
            '\t' + 'width: calc(var(--row-size) * var(--tile-size));' + '\n' +
            '\t' + 'height: calc(var(--row-size) * var(--tile-size));' + '\n' +
            '}';
        document.head.appendChild(styleTag);
        for (let i = 1; i <= rowSize; i++) {
            for (let j = 0; j < rowSize; j++) {
                tileHtml = document.createElement('LI');
                tileHtml.className = cls;
                tileHtml.addEventListener("click", makeAMove);
                tileHtml.innerText = String.fromCharCode('A'.charCodeAt(0) + j) + i;
                boardUl.appendChild(tileHtml);
            }

        }
        board = new Array(rowSize);
        for (let i = 0; i < rowSize; i++) {
            board[i] = new Array(rowSize);
            board[i] = board[i].fill('-');
        }

        addTilesForm.elements.sizebtn.disabled = true;
        addTilesForm.elements.sizefield.disabled = true;
        addTilesForm.style.transition = "opacity 0.5s";
        addTilesForm.style.opacity = 0;
    }
}

function printBoard(board) {
    let buff = '',
        sap = ' | ';
    for (let i = 0; i < rowSize; i++) {
        if (i > 0) buff += '\n';
        for (let j = 0; j < board[i].length; j++) {
            if (j > 0) buff += sap;
            buff += board[j][i];
        }
    }
    console.log(buff);
}

function makeAMove() {
    tile = event.target;
    idxXStr = tile.innerText.charAt(0);
    idxYStr = tile.innerText.charAt(1);
    idxX = idxXStr.charCodeAt(0) - 'A'.charCodeAt(0);
    idxY = idxYStr.charCodeAt(0) - '1'.charCodeAt(0);
    flushConsole();

    if (tile.classList.contains(empty) && !tile.classList.contains(notplayable) && canPlay) {
        tile.className = initcls + " " + empty + " " + turn.toLowerCase();
        tile.classList.replace(empty, notempty);
        canPlay = false;
        nextTurnBtn.disabled = false;
        newLogItem(turn + " was placed in tile " + tile.innerText + ".", 0, 0);

        // The next line stores the player's move in a js readable way - an array.

        board[idxX][idxY] = turn;

        printBoard(board);

        //check whether anybody won, if the minimal number of moves required to win was made

        if (turnCounter >= (rowSize * 2 - 1) - 1) { //column check
            chkPosStr = "column " + idxXStr;
            for (counter = 0, idxI = idxX, idxJ = 0; //
                idxJ < rowSize; //
                idxJ++) //
            {
                if (board[idxI][idxJ] == turn) counter++;
            }
            chkWin();

            if (!win) { //row check
                chkPosStr = "row " + idxYStr;
                for (counter = 0, idxI = 0, idxJ = idxY; //
                    idxI < rowSize; //
                    idxI++) //
                {
                    if (board[idxI][idxJ] == turn) counter++;
                }
                chkWin();

                if (!win && idxX == idxY) { //first diagonal check
                    chkPosStr = "diagonal '\\'";
                    for (counter = 0, idxI = 0, idxJ = 0; //
                        idxI < rowSize && idxJ < rowSize; //
                        idxI++, idxJ++) //
                    {
                        if (board[idxI][idxJ] == turn) counter++;
                    }
                    chkWin();
                }

                if (!win && idxX == (rowSize - 1) - idxY) { //second diagonal check
                    chkPosStr = "diagonal '/'";
                    for (counter = 0, idxI = 0, idxJ = rowSize - 1; //
                        idxI < rowSize && idxJ >= 0; //
                        idxI++, idxJ--) //
                    {
                        if (board[idxI][idxJ] == turn) counter++;
                    }
                    chkWin();
                }
            }

            //if someone won display details
            if (win) {
                canPlay = false;
                nextTurnBtn.disabled = true;
                nextTurnBtn.parentElement.style.transition = "opacity 0.5s";
                nextTurnBtn.parentElement.style.opacity = "0";
                tile.classList.add(notplayable);
                for (let i = 0; i < boardUl.childElementCount; i++) {
                    boardUl.children[i].removeEventListener("click", makeAMove);
                }
                newConsoleItem("Player " + turn + " won by occupying " + chkPosStr + "!", 'r');
            }
        }
    } else {
        if (tile.classList.contains(notempty) && !tile.classList.contains(notplayable) && tile.classList.contains(turn.toLowerCase())) {
            nextTurnBtn.disabled = true;
            board[idxX][idxY] = '-';
            tile.className = initcls + " " + empty + " " + turn.toLowerCase();
            newLogItem(turn + " was deleted from tile " + tile.innerText + ".", 0, 0, 1);
            canPlay = true;
        } else if (turnCounter == rowSize * rowSize) {
            canPlay = false;
            nextTurnBtn.disabled = true;
            nextTurnBtn.parentElement.style.transition = "opacity 0.5s";
            nextTurnBtn.parentElement.style.opacity = "0";
            newConsoleItem("TIE. Nobody won nor lost.", 'r');
        } else {
            console.log("ILLEGAL MOVE.");
            newConsoleItem("Illegal move!", 'e')
        }
    }
}


function nextTurn() {
    nextTurnBtn.disabled = true;
    turnCounter++;
    canPlay = true;
    if (turn == x) turn = o;
    else turn = x;
    flushConsole();
    for (let i = 0; i < boardUl.childElementCount; i++) {
        if (boardUl.children[i].classList.contains(notempty)) {
            boardUl.children[i].classList.add(notplayable);
        }
    }
}

function newLogItem(str, isStrong, isItalic, isMinor) {
    let newLi = document.createElement("li");
    let newTxt = document.createTextNode(str);
    newLi.appendChild(newTxt);
    if (isStrong) newLi.style.fontWeight = "bold";
    if (isItalic) newLi.style.fontStyle = "italic";
    if (isMinor) newLi.className = minor;
    myLog.appendChild(newLi);
}

function newConsoleItem(str, resultOrError) {
    if (String(resultOrError).toLowerCase() == 'result' || String(resultOrError).toLowerCase() == 'res' || String(resultOrError).toLowerCase() == 'r') {
        myConsole.getElementsByClassName('result')[0].innerText = str;
        myConsole.getElementsByClassName('result')[0].classList.remove(hidden);
    } else if (String(resultOrError).toLowerCase() == 'error' || String(resultOrError).toLowerCase() == 'err' || String(resultOrError).toLowerCase() == 'e') {
        myConsole.getElementsByClassName('error')[0].innerText = str;
        myConsole.getElementsByClassName('error')[0].classList.remove(hidden);
    }
}

function flushConsole() {
    let arr = myConsole.children;
    for (let i = 0; i < arr.length; i++) {
        arr[i].classList.add(hidden);
        arr[i].innerText = '';
    }
}

function chkWin() {
    if (counter == rowSize) win = true;
}

document.getElementById('baierhma').addEventListener("click", toggleMinors)

function toggleMinors() {
    for (let i = 0; i < myLog.getElementsByTagName('li').length; i++) {
        if (myLog.getElementsByTagName('li')[i].classList.contains(minor)) {
            if (myLog.getElementsByTagName('li')[i].style.display == 'none') {
                myLog.getElementsByTagName('li')[i].style.display = "list-item";
            } else myLog.getElementsByTagName('li')[i].style.display = 'none';
        }
    }
}