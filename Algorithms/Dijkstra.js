
export function djikstra(grid, startNode, finishNode){
    const orderedVisitedNodes = [];
    startNode.distance = 0;
    const unvisitedNodes = getAllNodes(grid);
    while(!!unvisitedNodes.length){
        sortByDistance(unvisitedNodes);
        const closestNode = unvisitedNodes.shift();
        // if it runs into a wall, then skip
        if(closestNode.isWall) continue;
        // if closestNode.distance is infinity, it is trapped
        if(closestNode.distance === Infinity){
            alert("No Path available");
            return orderedVisitedNodes;
        }
        if(!closestNode.isWall) closestNode.isVisited = true;
        orderedVisitedNodes.push(closestNode);
        if(closestNode === finishNode) return orderedVisitedNodes;
        findUnvisitedNeighbors(closestNode, grid);
    }
}

function getAllNodes(grid){
    // nested loops may be causing the big memory problems
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

function findUnvisitedNeighbors(node, grid){
    const neighborhood = [];
    const {col, row} = node;
    if(row > 0) neighborhood.push(grid[row - 1][col]);
    if(row < grid.length - 1) neighborhood.push(grid[row + 1][col]);
    if(col > 0) neighborhood.push(grid[row][col-1]);
    if(col < grid[0].length - 1) neighborhood.push(grid[row][col+1]);
    const neighbors =  neighborhood.filter(x => !x.isVisited);
    for(const neighbor of neighbors){
        neighbor.distance = node.distance +1;
        neighbor.previousNode = node;
    }
}