//something about an intro to astar method

export function astar(grid, startNode, finishNode){
    const orderedVisitedNodes = [];
    startNode.distance = 0;
    const unvisitedNodes = getAllNodes(grid);
    while(!!unvisitedNodes.length){
        sortByDistance(unvisitedNodes);
        const closestNode = unvisitedNodes.shift();
        // if it runs into a wall, then skip
        if(closestNode.isWall) continue;
        // if closestNode.distance is infinity, it is trapped
        if(closestNode.distance === Infinity) return orderedVisitedNodes;
        closestNode.isVisited = true;
        orderedVisitedNodes.push(closestNode);
        if(closestNode === finishNode) return orderedVisitedNodes;
        findUnvisitedNeighbors(closestNode, grid, finishNode, orderedVisitedNodes);
    }
}

function getAllNodes(grid){
    const nodes = [];
    for(const row of grid){
        for(const node of row){
            nodes.push(node);
        }
    }
    return nodes;
}

function sortByDistance(unvisitedNodes){
    unvisitedNodes.sort((nodeA, nodeB) => nodeA.distance - nodeB.distance);
}

function findUnvisitedNeighbors(node, grid, finishNode, orderedVisitedNodes){
    const neighborhood = [];
    const {col, row} = node;
    if(row > 0) neighborhood.push(grid[row - 1][col]);
    if(row < grid.length - 1) neighborhood.push(grid[row + 1][col]);
    if(col > 0) neighborhood.push(grid[row][col-1]);
    if(col < grid[0].length - 1) neighborhood.push(grid[row][col+1]);
    const neighbors =  neighborhood.filter(x => !x.isVisited && !x.isWall);
    var minDistance = 5000;
    for(const neighbor of neighbors){        
        var h = Math.abs(neighbor.col - finishNode.col) + Math.abs(neighbor.row - finishNode.row);
        neighbor.distance = node.distance + 1 + h;
        neighbor.previousNode = node;
        if(neighbor.distance < minDistance) minDistance = neighbor.distance;
    }
    for(const neighbor of neighbors){
        if(neighbor.distance> minDistance){
            orderedVisitedNodes.push(neighbor);
            neighbor.distance = 500000;
        }
    }
}