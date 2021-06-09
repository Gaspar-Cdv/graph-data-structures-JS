import {Graph, Grid, Tree} from "./modules/dataStructures.mjs";

let adjList = {
    'A' : {
        'B' : 5,
        'C' : 3,
        'D' : 1
    },
    'B' : {
        'A' : 5,
        'C' : 2,
        'D' : 2
    }
}
adjList = [
    [1, 2, 3],
    [0, 2, 3], 
    [0, 1, 3],
    [0, 1, 2]
]
adjList = {
    0 : [1, 2, 3],
    1 : [0, 2, 3], 
    2 : [0, 1, 3],
    3 : [0, 1, 2]
}
let matrix = {
    'A' : {
        'A' : 0,
        'B' : 1,
        'C' : 1,
        'D' : 0
    },
    'B' : {
        'A' : 1,
        'B' : 0,
        'C' : 0,
        'D' : 1
    },
    'C' : {
        'A' : 1,
        'B' : 0,
        'C' : 0,
        'D' : 0
    },
    'D' : {
        'A' : 0,
        'B' : 1,
        'C' : 0,
        'D' : 0
    },
}
matrix = [
    [0, 0, 5, 0, 0],
    [1, 0, 1, 1, 1],
    [0, 0, 0, 0, 0],
    [1, 1, 0, 0, 1],
    [0, 0, 1, 0, 0]
]
let grid = [
    '########################',
    '#       #   # #        #',
    '# ####### ### #### #####',
    '#                      #',
    '### ############ # #####',
    '#      #         #     #',
    '###### ##### ######### #',
    '#                #     #',
    '#### ############# #####',
    '#        #             #',
    '########## #############',
    '#                      #',
    '########################'
]

let nodes = [0, 1, 2, 3, 4, 5];
nodes = {0: 4, 1: 5, 2: 3, 3: 4, 4: 1, 5: 0};
nodes = [[0, 4], [1, 5], [2, 3], [3, 4], [4, 1], [5, 0]]

let edges = [[0, 1], [2, 3], [4, 5], [1, 0], [4, 3], [5, 0], [5, 4]];
// edges = {'0, 1': 4,'1, 2': 5,'3, 4': 1,'5, 0': 8, '1,0' : 4}
// edges = new Map([[['A', 'B'], 5], [['A', 'C'], 2], [['B', 'C'], 3]])

let graph = new Graph(edges);
// let graph = Graph.fromAdjList({'A': {'B': 5, 'C': 2}, 'B': {'A': 1, 'C': 3}}, ['D', 'E'])
graph = Graph.fromMatrix(matrix)
// graph = Graph.fromGrid(grid);

// console.log(graph.nodes);
// console.table(graph.weightedNodes);
// console.table(graph.weightedEdges);

// console.log(JSON.stringify(graph.adjList, null, 4));
// console.table(graph.matrix)

let tree = Tree.generateTree(100, 6);
console.log(tree.leaves.length);