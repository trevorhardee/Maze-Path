/*
build at random points two walls that are perpendicular to each other. 
These two walls divide the large chamber into four smaller chambers separated by four walls. 
Choose three of the four walls at random, and open a one cell-wide hole at a random point 
in each of the three. Continue in this manner recursively, until every chamber has a width 
of one cell in either of the two directions.
*/
// it works! could make maze a bit tighter

export function recursiveDivision(grid, rowStart, rowFinish, colStart, colFinish, orderedVisitedNodes, outerBorder){
    // exit
    if(rowFinish <= rowStart  || colFinish <= colStart){
        animateMaze(orderedVisitedNodes);
        return;
    }
    // draw outer border
    if(!outerBorder){
        const borderWalls = [];
        // left row
        for(let i = 18; i > 0; i--){
            borderWalls.push(grid[0][i]);
        }
        // top column
        for(let i = 2; i < 50; i++){
            borderWalls.push(grid[i][0]);
        }
        // right row
        for(let i = 1; i < 16; i++){
            borderWalls.push(grid[49][i]);
        }
        // bottom column
        for(let i = 48; i >= 1; i--){
            borderWalls.push(grid[i][17]);
        }
        for(let i = 1; i < borderWalls.length; i++){
            setTimeout(() => {
                const node = borderWalls[i];
                node.isWall = true;
                document.getElementById(`node-${node.row}-${node.col}`).className = 'node node-wall';
            }, 5 * i);
        }
        outerBorder = true;
    }
    
    // every other row/column is possible to draw maze on
    const openRows = [];
    for(let i = rowStart; i < rowFinish; i+=2){
        openRows.push(i);
    }
    const openCols = [];
    for(let i = colStart; i < colFinish; i+=2){
        openCols.push(i);
    }

    var rowIndx = Math.floor(Math.random() * openRows.length);
    var colIndx = Math.floor(Math.random() * openCols.length);
    var randomRow = openRows[rowIndx];
    var randomCol = openCols[colIndx];
    // two random walls in chamber
    //var randomCol = Math.floor(Math.random() * (colFinish - colStart) + colStart + 1);
    //var randomRow = Math.floor(Math.random() * (rowFinish - rowStart) + rowStart + 1);
    // four random holes
    const hole1 = Math.floor(Math.random() * (rowFinish - rowStart) + rowStart);
    const hole2 = Math.floor(Math.random() * (rowFinish - rowStart) + rowStart);
    const hole3 = Math.floor(Math.random() * (colFinish - colStart) + colStart);
    const hole4 = Math.floor(Math.random() * (colFinish - colStart) + colStart);
    // add walls to list to animate
    // get list of nodes in random column
    const col = [];
    for(let i = rowStart; i < rowFinish - 1; i++){
        col.push(grid[i][randomCol]);
    }
    // get list of nodes in random row
    const row = [];
    for(let i = colStart; i < colFinish - 1; i++){
        row.push(grid[randomRow][i]);
    }
    // add columns to visited if within bounds and not a hole
    for(const node of col){
        if((node.row !== hole1 && node.row !== hole2) && (node.row < rowFinish && node.row > rowStart) && node.row < 50){
        //if((node.row != hole1) && (node.row < rowFinish && node.row > rowStart) && node.row < 50){
            node.isWall = true;
            orderedVisitedNodes.push(node);
        }
    }
    
    // add rows to visited if within bounds and not a hole
    for(const node of row){
        if((node.col !== hole3 && node.col !== hole4) && (node.col < colFinish && node.col > colStart) && node.col < 18){
        //if((node.col != hole3) && (node.col < colFinish && node.col > colStart) && node.col < 18){
            node.isWall = true;
            orderedVisitedNodes.push(node);
        }
    }
    

    // recursive callback for each quadrant with added gaps so theres a space between
    // top left aka quadrant 4
    var tempRow = randomRow - 1;
    var tempCol = randomCol - 1;
    recursiveDivision(grid, rowStart, tempRow, colStart, tempCol, orderedVisitedNodes, outerBorder);
    
    // bottom right aka quadrant 2
    tempCol = randomCol + 1;
    tempRow = randomRow + 1;
    recursiveDivision(grid, tempRow, rowFinish, tempCol, colFinish, orderedVisitedNodes, outerBorder);

    // top right aka quadrant 1
    tempRow = randomRow - 1;
    tempCol = randomCol + 1;
    recursiveDivision(grid, rowStart, tempRow, tempCol, colFinish, orderedVisitedNodes, outerBorder);

    // bottom left aka quadrant 3
    tempRow = randomRow + 1;
    tempCol = randomCol - 1;
    recursiveDivision(grid, tempRow, rowFinish, colStart, tempCol, orderedVisitedNodes, outerBorder);
}

function animateMaze(orderedWalledNodes){
    for(let i = 0; i < orderedWalledNodes.length; i++){
        let node = orderedWalledNodes[i];
        setTimeout(() => {
            document.getElementById(`node-${node.row}-${node.col}`).className = 'node node-wall';
        }, 5 * i);
    }
}