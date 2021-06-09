import {Graph} from "./graph.mjs";

export class Grid extends Graph {

    #width;
    #height;

    constructor(edges, nodes) {
        let dimensions = Grid.getGridDimensions(new Graph(edges, nodes));
        if (dimensions) {
            super(edges, nodes);
            [this.#width, this.#height] = dimensions;
            // this.#height += [...Array(this.#width)].some((x, i) => graph.hasNode(this.#width * (this.#height - 1) + i)); // add full wall in last line if needed
        } else {
            throw Error('Grid constructor() : graph cannot be converted to grid');
        }
    }


    /******************** GETTERS ********************/

    get width() {
        return this.#width;
    }

    get height() {
        return this.#height;
    }

    get grid() {
        return [...Array(this.#height)].map((_, y) => [...Array(this.#width)].map((_, x) => this.hasNode(node) ? ' ' : '#').join(''));
    }


    /******************** GRID CONVERSIONS ********************/

    static euclideanDistance([[x1, y1], [x2, y2]]) {
        let edge = [[x1, y1], [x2, y2]];
        if (Graph.isEdgeCoord(edge)) {
            return Math.abs(x2 - x1) + Math.abs(y2 - y1);
        } else {
            throw Error('Graph euclideanDistance() : invalid coordinates argument');
        }
    }

    static manhattanDistance([[x1, y1], [x2, y2]]) {
        let edge = [[x1, y1], [x2, y2]];
        if (Graph.isEdgeCoord(edge)) {
            return ((x2 - x1)**2 + (y2 - y1)**2)**0.5;
        } else {
            throw Error('Graph manhattanDistance() : invalid coordinates argument');
        }
    }

    static nodeToCoord(node, width) {
        return [Math.floor(node / width), node % width];
    }

    static coordToNode(x, y, width) {
        return y * width + x;
    }


    /******************** OTHER GRID CONSTRUCTORS ********************/

    static fromGrid(grid, wall='#', arrow='^>v<') { // arrow : you can only go to the direction indicated, and you can come from every direction except where the tip is (arrow = false to disable it)
        if (Grid.gridType(grid)) {
            let h = grid.length;
            let w = grid[0].length;
            let nodes = [];
            let edges = [];
            for (let y = 0; y < h; y++) {
                for (let x = 0; x < w; x++) {
                    if (grid[y][x] != wall) {
                        let cellId = y*w + x;
                        nodes.push(cellId);
                        // nodes.push([x, y]);
                        if (grid[y-1] && grid[y-1][x] != wall && (!arrow || grid[y-1][x] != arrow[2])) { // from node to up
                            if (!arrow || ![arrow[1], arrow[2], arrow[3]].includes(grid[y][x])) {
                                // edges.push([[x, y], [x, y-1]]);
                                edges.push([cellId, cellId - w]);
                            }
                        }
                        if (grid[y][x+1] && grid[y][x+1] != wall && (!arrow || grid[y][x+1] != arrow[3])) { // from node to right
                            if (!arrow || ![arrow[0], arrow[2], arrow[3]].includes(grid[y][x])) {
                                // edges.push([[x, y], [x+1, y]]);
                                edges.push([cellId, cellId + 1]);
                            }
                        }
                        if (grid[y+1] && grid[y+1][x] != wall && (!arrow || grid[y+1][x] != arrow[0])) { // from node to down
                            if (!arrow || ![arrow[0], arrow[1], arrow[3]].includes(grid[y][x])) {
                                // edges.push([[x, y], [x, y+1]]);
                                edges.push([cellId, cellId + w]);
                            }
                        }
                        if (grid[y][x-1] && grid[y][x-1] != wall && (!arrow || grid[y][x-1] != arrow[1])) { // from node to left
                            if (!arrow || ![arrow[0], arrow[1], arrow[2]].includes(grid[y][x])) {
                                // edges.push([[x, y], [x-1, y]]);
                                edges.push([cellId, cellId - 1]);
                            }
                        }
                    }
                }
            }
            return new Grid(edges, nodes);
        } else {
            throw Error('Grid fromGrid() : invalid grid argument')
        }
    }

    static generateGrid(width, height, orientation='NESW') {
        let nodes = [];
        let edges = [];
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                let node = y * width + x;
                nodes.push(node);
                if (orientation.includes('N') && y > 0) edges.push([node, (y - 1) * width + x]);
                if (orientation.includes('E') && x < width - 1) edges.push([node, y * width + x + 1]);
                if (orientation.includes('S') && y < height - 1) edges.push([node, (y + 1) * width + x]);
                if (orientation.includes('W') && x > 0) edges.push([node, y * width + x - 1]);
            }
        }
        return new Grid(edges, nodes);
    }


    /******************** CONVERTERS ********************/

    static getGridDimensions(graph) { // automatically determines grid dimensions of a graph. Return false if cannot be converted to grid
        if (!Graph.isGraph(graph)) throw Error('Graph getGridDimensions() : invalid graph argument');
        let adjList = Object.entries(graph.adjList);
        let width = 0;
        let isGrid = true;
        for (let [node, children] of adjList) {
            if (children.length > 4 || isNaN(node) || children.some(x => isNaN(x))) isGrid = false;
            children.forEach(child => {
                let distance = Math.abs(+node - child);
                if (distance > 1 && width == 0) {
                    width = distance;
                } else if (distance > 1 && distance != width || distance == 1 && width > 0 && (node % width == 0 && child % width == width - 1 || node % width == width - 1 && child % width == 0)) {
                    isGrid = false;
                }
            })
            if (!isGrid) break;
        }
        if (!isGrid) return false;
        let highestNode = Math.max(...graph.nodes);
        width = width || (highestNode + 1);
        let height = Math.floor(highestNode / width) + 1;
        return [width, height];
    }


    /******************** CHECKERS ********************/
    
    static gridType(grid) { // check if argument is a valid grid and return its type
        if (Array.isArray(grid) && grid.every(line => line.length == grid[0].length)) {
            if (grid.every(line => Array.isArray(line) && line.every(x => typeof x == 'string' && x.length == 1))) { // [[' ', ' ', '#'], ['#', ' ', '#'], ['#', '#', '#']]
                return 'array';
            } else if (grid.every(line => typeof line == 'string')) { // ['####', '#  #', '#  #', '####']
                return 'string';
            }
        }
        return false;
    }

    static isGrid(grid) {
        return grid instanceof Grid;
    }
}