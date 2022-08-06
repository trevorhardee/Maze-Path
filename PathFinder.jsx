import React, {Component} from 'react';
import { Fireworks } from 'fireworks-js'
import Node from './Node/Node';
import './PathFinder.css';
import {astar} from '../Algorithms/aStar';
import {djikstra} from '../Algorithms/Dijkstra';
import {recursiveDivision} from '../Algorithms/recursiveDivision';
const numCols = 18;
const numRows = 50;
var timesClicked = 0;
var START_ROW;
var START_COL;
var FINISH_ROW;
var FINISH_COL;
var mazeDrawn = false;
var searchCalled = false;
var searchStarted = false;



export default class PathFinder extends Component{
    constructor(props) {
        super(props);
        this.state = {
            grid: [],
            mouseIsPressed: false,
        };
    }

    componentDidMount(){
        const grid = drawGrid();
        this.setState({grid: grid});
        window.addEventListener('keydown', this.onkeydown);
    }

    handleMouseDown(row, col){
        //check times clicked
        if(timesClicked === 0){
            //set start
            START_ROW = row;
            START_COL = col;
            const newGrid = this.state.grid.slice()
            const node = newGrid[row][col];
            const newNode = {
                ...node,
                isStart: true,
            };
            newGrid[node.row][node.col] = newNode;
            this.setState({grid: newGrid});
            timesClicked++;
        } else if(timesClicked === 1){
            //set finish
            FINISH_ROW = row;
            FINISH_COL = col;
            const newGrid = this.state.grid.slice()
            const node = newGrid[row][col];
            const newNode = {
                ...node,
                isFinish: true,
            };
            newGrid[node.row][node.col] = newNode;
            this.setState({grid: newGrid});
            timesClicked++;
        } else {
            const newGrid = checkIfWall(this.state.grid, row, col);
            this.setState({grid: newGrid, mouseIsPressed: true});
        }
    }

    handleMouseEnter(row, col){
        if(!this.state.mouseIsPressed) return;
        const newGrid = checkIfWall(this.state.grid, row, col);
        this.setState({grid: newGrid});
    }

    handleMouseUp(){
        this.setState({mouseIsPressed: false});
    }

    displaySearches(){
        document.getElementById("searchDropdown").classList.toggle("show");
    }
  
    initiateAStar(){
        // hide dropdowns
        document.getElementById("searchDropdown").classList.toggle("show");
        try{
            const {grid} = this.state;
            const startNode = grid[START_ROW][START_COL];
            const finishNode = grid[FINISH_ROW][FINISH_COL];
            const orderedVisitedNodes = astar(grid, startNode, finishNode);
            const orderedShortestPath = this.getShortestPath(finishNode);
            this.animatePathfinder(orderedVisitedNodes, orderedShortestPath);
        }
        catch{
            alert("Select Start & Finish before beginning search");
        }
    }

    initiateDjikstra(){
        // hide dropdowns
        document.getElementById("searchDropdown").classList.toggle("show");
        try{
            const {grid} = this.state;
            const startNode  = grid[START_ROW][START_COL];
            const finishNode = grid[FINISH_ROW][FINISH_COL];
            const orderedVisitedNodes = djikstra(grid, startNode, finishNode);
            const orderedShortestPath = this.getShortestPath(finishNode);
            this.animatePathfinder(orderedVisitedNodes, orderedShortestPath);
        }
        catch{
            alert("Select Start & Finish before beginning search");
        }
    }
    getShortestPath(finishNode){
        const orderedShortestPath = [];
        let currentNode = finishNode;
        while(currentNode !== null){
            orderedShortestPath.unshift(currentNode);
            currentNode = currentNode.previousNode;
        }
        return orderedShortestPath;
    }
    
    animatePathfinder(orderedVisitedNodes, orderedShortestPath){
        for(let i = 0; i <=orderedVisitedNodes.length; i++){
            if(i === orderedVisitedNodes.length){
                setTimeout(() => {
                    this.animateShortestPath(orderedShortestPath);
                }, 5 * i);
                return;
            }
            setTimeout(() => {
                const node = orderedVisitedNodes[i];
                document.getElementById(`node-${node.row}-${node.col}`).className = 'node node-visited';
            }, 5 * i);
        }
    }

    //addEventListener('keydown', (event) => {});
    animateShortestPath(orderedShortestPath){
        searchStarted = true;
        for(let i = 0; i < orderedShortestPath.length; i++){
            setTimeout(() => {
                const node = orderedShortestPath[i];
                document.getElementById(`node-${node.row}-${node.col}`).className = 'node node-shortest-path';
            }, 40 *i);
        }
    }
    initiateRecursiveDivision(){
        if(!mazeDrawn){
            const {grid} = this.state;
            const rowStart = 1;
            const colStart = 1;
            const nodes = [];
            recursiveDivision(grid, rowStart, numRows - 1, colStart, numCols - 1, nodes, false);
            mazeDrawn = true;
        }
    }
    

    clearGrid(){
        // todo: make sure everything is cleared so that it cannot draw path after it was cleared
        // Reset Start and Finish
        START_COL = null;
        START_ROW = null;
        FINISH_COL = null;
        FINISH_ROW = null;
        searchCalled = false;
        searchStarted = false;
        mazeDrawn = false;
        const newGrid = this.state.grid.slice();   
        timesClicked = 0;
        // Set all nodes to transparent, distances to infinity, and clear visited flag
        for(let row = 0; row < numRows; row++){
            for(let col = 0; col < numCols; col++){
                const node = newGrid[row][col];
                document.getElementById(`node-${node.row}-${node.col}`).className = 'node node-empty';
                node.isStart= false;
                node.isFinish= false;
                node.distance= Infinity;
                node.isVisited= false;
                node.isWall= false;
                node.previousNode= null;
                node.isDrawn = false;
            }
        }
        // Push all changes
        this.setState({grid: newGrid});
    }
    clearWalls(){
        const newGrid = this.state.grid.slice();
        for(let row = 0; row < numRows; row++){
            for(let col = 0; col < numCols; col++){
                let node = newGrid[row][col];
                if(node.isWall){
                    document.getElementById(`node-${node.row}-${node.col}`).className = 'node node-empty';
                    node.isWall = false;
                }
            }
        }
        this.setState({grid: newGrid});
        mazeDrawn = false;
    }
    clearPath(){
        START_COL = null;
        START_ROW = null;
        FINISH_COL = null;
        FINISH_ROW = null;
        timesClicked = 0;
        searchCalled = false;
        searchStarted = false;
        const newGrid = this.state.grid.slice();
        for(let row = 0; row < numRows; row++){
            for(let col = 0; col < numCols; col++){
                let node = newGrid[row][col];
                if(!node.isWall){
                    document.getElementById(`node-${node.row}-${node.col}`).className = 'node node-empty';
                    node.isVisited = false;
                    node.distance = Infinity;
                    node.isDrawn = false;
                    node.previousNode = null;
                }
            }
        }
        this.setState({grid: newGrid});
    }
    onkeydown = (event) => { 
        // allows user to draw path once maze is drawn
        var keyPressed = event.key;
        if((keyPressed === 'a' || keyPressed === 'w' || keyPressed === 's' || keyPressed === 'd') && mazeDrawn){
            let {grid} = this.state;
            let nodes = this.getAllNodes(grid);
            // find if any are drawn, if not draw from 0,0
            let drawnNode = nodes.filter(x => x.isDrawn);
            if(drawnNode.length === 0){
                let node = grid[0][0];
                node.isDrawn = true;
                document.getElementById(`node-${node.row}-${node.col}`).className = 'node node-chosen';
            } else {
                if(!searchStarted){
                    this.checkToDraw(drawnNode.shift(), grid, keyPressed);
                }
            }
            // call A* search after some time
            if(!searchCalled){
                START_ROW = 0;
                START_COL = 0;
                FINISH_ROW = 49;
                FINISH_COL = 17;
                searchCalled = true;
                setTimeout(() => {
                    this.initiateAStar(); document.getElementById("searchDropdown").classList.toggle("show");
                }, 9500);
            }
        }
        
    };
    getAllNodes(grid){
        // nested loops may be cause big memory problems
        const nodes = [];
        for(const row of grid){
            for(const node of row){
                nodes.push(node);
            }
        }
        return nodes;
    }

    confettiCheck(node){
        if(node.row === 49 && node.col === 17){
            const container = document.querySelector("div.showtime");
            document.getElementById("winner").classList.toggle("showWinner");
            const fireworks = new Fireworks(container, { /* options */ });
            fireworks.start();
            //alert('You Win!');
            setTimeout(() => {
                fireworks.stop(); document.getElementById("winner").classList.toggle("showWinner");
            }, 5000);
            
        }
    } 
    checkToDraw(drawnNode, grid, keyPressed){
        const {col, row} = drawnNode;
        // I programmed this kinda funky, it probably has to do with the row/column order
        if(keyPressed === 'w' && drawnNode.col > 0){
            // check that it makes sense to draw up
            let checkNodeVar = col - 1;
            let node = grid[drawnNode.row][checkNodeVar];
            var check = (drawnNode.col > 0 && !node.isWall);
            if(check){
                document.getElementById(`node-${node.row}-${node.col}`).className = 'node node-chosen';
                drawnNode.isDrawn = false;
                node.isDrawn = true;
                this.confettiCheck(node);
            } 
        } else if(keyPressed === 'a' && drawnNode.row > 0){
            // check that can draw left
            let checkNodeVar = row - 1;
            let node = grid[checkNodeVar][drawnNode.col];
            let check = (drawnNode.row > 0 && !node.isWall);
            if(check){
                document.getElementById(`node-${node.row}-${node.col}`).className = 'node node-chosen';
                drawnNode.isDrawn = false;
                node.isDrawn = true;
                this.confettiCheck(node);
            } 
        } else if(keyPressed === 'd' && drawnNode.row < numRows - 1){
            // check that it can be drawn right
            let checkNodeVar = row + 1;
            let node = grid[checkNodeVar][drawnNode.col];
            let check = (!node.isWall);
            if(check){
                document.getElementById(`node-${node.row}-${node.col}`).className = 'node node-chosen';
                drawnNode.isDrawn = false;
                node.isDrawn = true;
                this.confettiCheck(node);
            } 
        } else {
            // check that it can be drawn down
            if(drawnNode.col < numCols - 1){
                let checkNodeVar = col + 1;
                let node = grid[drawnNode.row][checkNodeVar];
                let check = (!node.isWall);
                if(check){
                    document.getElementById(`node-${node.row}-${node.col}`).className = 'node node-chosen';
                    drawnNode.isDrawn = false;
                    node.isDrawn = true;
                    this.confettiCheck(node);
                }
            } 
        }   
    }
    
    toggleInstructions(){
        document.getElementById("instructions").classList.toggle("showInstructions");
    }
    render() {
        const {grid, mouseIsPressed} = this.state;

        return (
            <>
                <header className='header'>
                    <button className='headerButton' onClick={() => this.toggleInstructions()}>Maze Run</button>
                    <div className='dropdown'>
                        <a className='button' onClick={() => this.displaySearches()}>Search</a>
                        <ul id='searchDropdown' className='searches'>
                            <a href='#A*' onClick={() => this.initiateAStar()}>A* Search</a>
                            <a href='#Djikstra' onClick={() => this.initiateDjikstra()}>Dijkstra Search</a>
                        </ul>
                    </div>
                    <button className="button" onClick={() => this.clearGrid()}>Clear Grid</button>
                    <button className="button" onClick={() => this.clearWalls()}>Clear Walls</button>
                    <button className="button" onClick={() => this.clearPath()}>Clear Path</button>
                    <button className="button" onClick={() => this.initiateRecursiveDivision()}>Draw Maze</button>
                </header>
                <meta name="viewport" content="width=device-width, initial-scale=1.0"></meta>
                <div id='instructions'>
                    <h3>What is Maze Run?</h3><p>This is a pathfinder project that includes a few features along with a maze game.</p>
                    <h3>Pathfinding</h3><p>Click on the grid to place your path beginning and end. Select a search algorithm to find the path.</p>
                    <h3>Add Walls</h3><p>Place walls that the path will have to go around by clicking and dragging the grid. Walls can be added after the beginning and end nodes have been chosen.</p>
                    <h3>Mazes</h3><p>Click Draw Maze to draw a maze and find a path within the maze. You can remove walls by clicking them.</p>
                    <h3>Maze Run</h3><p>Finally, maneuver through the maze before time runs out. W, A, S and D represent up, left, down and right, respectively. Maneuver only if a maze has been drawn.</p>
                    <button className='close' onClick={() => this.toggleInstructions()}><h2>Close</h2></button>
                </div>
                <div id='winner' className='showtime'><h1>You Win!</h1></div>
                <div className="grid">
                    {grid.map((row, rowIdx) => {
                        return (
                            <div key={rowIdx}>
                                {row.map((node, nodeIdx) => {
                                    const {row, col, isWall, isStart, isFinish, isDrawn} = node;
                                    return (
                                        <Node
                                            key={nodeIdx}
                                            col={col}
                                            row={row}
                                            isStart={isStart}
                                            isFinish={isFinish}
                                            isWall={isWall}
                                            isDrawn={isDrawn}
                                            mouseIsPressed={mouseIsPressed}
                                            onMouseDown={(row, col) => this.handleMouseDown(row,col)}
                                            onMouseEnter={(row, col) => this.handleMouseEnter(row, col)}
                                            onMouseUp={() => this.handleMouseUp()}
                                            ></Node>
                                    );
                                })}
                            </div>
                        );
                    })}
                </div>
                
                <script></script>
                </>
        );
    }
}

const drawGrid = () => {
    let grid = [];
    for(let row = 0; row < numRows; row++){
        let currentRow = [];
        for(let col = 0; col < numCols; col++){
            currentRow.push(createNode(col,row));
        }
        grid.push(currentRow);
    }
    return grid;
};

const createNode = (col, row) => {
    return {
        col,
        row,
        isStart: false,
        isFinish: false,
        distance: Infinity,
        isVisited: false,
        isWall: false,
        previousNode: null,
        isDrawn: false,
    };
};

const checkIfWall = (grid, row, col) => {
    const newGrid = grid.slice();
    const node = newGrid[row][col];
    const newNode = {
        ...node,
        isWall: !node.isWall,
    };
    newGrid[row][col] = newNode;
    return newGrid;
}
