let maze = document.querySelector(".maze");
let ctx = maze.getContext("2d");

let current;
let goal;
class Maze{
    constructor(size, rows, columns){
        this.size = size;
        this.rows = rows;
        this.columns = columns;
        this.grid = [];
        this.stack = [];
    }
    setup(){
        for(let r = 0; r < this.rows; r++){
            let row=[];
            for(let c=0; c< this.columns; c++){
                let cell = new Cell(r, c, this.grid, this.size);
                row.push(cell);
            }
            this.grid.push(row);
        }
        current = this.grid[0][0];
    }

    draw(){
        maze.width = this.size;
        maze.height = this.size;
        maze.style.background = "black";
        current.visited = true;

        for(let r=0; r<this.rows; r++){
            for(let c=0; c<this.columns; c++){
                let grid = this.grid;
                grid[r][c].show(this.size, this.rows, this.columns);
            }
        }

        let next = current.checkNeighbours();
        if(next){
            next.visited = true;
            this.stack.push(current);
            current.highlight(this.columns);
            current.removeWall(current, next);
            current = next;
        }
        else if(this.stack.length > 0){
            let cell = this.stack.pop();
            current = cell;
            current.highlight(this.columns);
        }

        if(this.stack.length == 0){
            return;
        }
        window.requestAnimationFrame(()=>{
            this.draw();
        });
    }
}

class Cell{
    constructor(rowNum, colNum, parentGrid, parentSize){
        this.rowNum = rowNum;
        this.colNum = colNum;
        this.parentGrid = parentGrid;
        this.parentSize = parentSize;
        this.visited = false;
        this.walls = {
            topwall : true,
            rifhtwall : true,
            bottomwall : true,
            leftwall : true,
        };

    }

    checkNeighbours(){
        let grid = this.parentGrid;
        let row = this.rowNum;
        let col = this.colNum;
        let neighbours = [];

        let top     = row != 0              ? grid[row-1][col] : undefined;
        let right   = col != grid.length-1  ? grid[row][col+1] : undefined;
        let bottom  = row != grid.length-1  ? grid[row+1][col] : undefined;
        let left    = col != 0              ? grid[row][col-1] : undefined;

        if(top && !top.visited)         neighbours.push(top);
        if(right && !right.visited)     neighbours.push(right);
        if(bottom && !bottom.visited)   neighbours.push(bottom);
        if(left && !left.visited)       neighbours.push(left);

        if(neighbours.length != 0){
            let random = Math.floor(Math.random() * neighbours.length);
            return neighbours[random];
        }
        else{
            return undefined;
        }
    }
    drawtopwall(x, y, size, columns, rows){
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x+size/columns, y);
        ctx.stroke();
    }
    drawrightwall(x, y, size, columns, rows){
        ctx.beginPath();
        ctx.moveTo(x + size/columns, y);
        ctx.lineTo(x+size/columns, y+size/rows);
        ctx.stroke();
    }
    drawbottomwall(x, y, size, columns, rows){
        ctx.beginPath();
        ctx.moveTo(x, y + size / rows);
        ctx.lineTo(x+size/columns, y+size/rows);
        ctx.stroke();
    }
    drawleftwall(x, y, size, columns, rows){
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x, y+size/rows);
        ctx.stroke();
    }

    highlight(columns){
        let x = (this.colNum * this.parentSize) / columns + 1;
        let y = (this.rowNum * this.parentSize) / columns + 1;
        ctx.fillStyle = "purple";
        ctx.fillRect(x, y, this.parentSize / columns - 3, this.parentSize / columns - 3);
    }

    removeWall(cell1, cell2){
        let x = (cell1.colNum - cell2.colNum);
        if(x == 1){
            cell1.walls.leftwall = false;
            cell2.walls.rightwall = false;
        }
        else if(x == -1){
            cell1.walls.rightwall = false;
            cell2.walls.leftwall = false;
        }
        
        let y = cell1.rowNum - cell2.rowNum;
        if(y == 1){
            cell1.walls.topwall = false;
            cell2.walls.bottomwall = false;
        }
        else if(y == -1){
            cell1.walls.bottomwall = false;
            cell2.walls.topwall = false;
        }
    }

    show(size, rows,columns){
        let x = (this.colNum * size)/ columns;
        let y = (this.rowNum * size)/ rows;

        ctx.strokeStyle = "white";
        ctx.fillStyle = "black";
        ctx.lineWidth = 2;

        if(this.walls.topwall)  this.drawtopwall(x, y, size, columns, rows);
        if(this.walls.rightwall)  this.drawrightwall(x, y, size, columns, rows);
        if(this.walls.bottomwall)  this.drawbottomwall(x, y, size, columns, rows);
        if(this.walls.leftwall)  this.drawleftwall(x, y, size, columns, rows);
        if(this.visited){
            ctx.fillRect(x+1, y+1, size/columns - 2, size/rows - 2);
        }
    }
}

// let newmaze = new Maze(700, 10, 10);
// newmaze.setup();
// newmaze.draw();