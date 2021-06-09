<p align="center">
  <img src="https://st2.depositphotos.com/1431107/7783/v/950/depositphotos_77835800-stock-illustration-work-in-progress-sign.jpg" width=200>
  <br>... README.md is under construction ...
</p>

# Graph data structures
This collection of data structures consists of JavaScript classes for various graph types : common graphs, grids and trees.<br>
It allows you to easily make operations in data structures, like finding shortest path, displaying matrix or adjacency list, generating rooted trees, and so on...</p>

## Objects formats

Graph uses many objects like edge lists, node lists, adjacency lists, matrices,... It's important to know how to format them for an appropriate use. Many checkers are implemented as static methods as seen below.

### Node lists

A node can be a string or a number. If a node is weighted, its weight must be a number. If a node is not weighted, its default value is 0.

Graph objects accept four formats of node lists : arrays, weighted arrays, objects and Map objects.

    Graph.nodeListType(['A', 'B', 'C']);                         // return 'array'
    Graph.nodeListType([['A', 0], ['B', 0], ['C', 0]]);          // return 'weighted array'
    Graph.nodeListType({'A': 5, 'B': 2, 'C': 4});                // return 'object'
    Graph.nodeListType(new Map([['A', 0], ['B', 0], ['C', 0]])); // return 'map'
    // else return false

Note : a node list cannot combine weighted nodes and non-weighted nodes (it returns false).

### Edge lists

An edge is a link between two nodes (e.g. `['A', 'B']`). An edge can also be weighted. If not, its default value is 1.

Graph objects also accept four formats of edge lists : arrays, weighted arrays, objects and Map objects.

    Graph.edgeListType([[0, 1], [0, 2], [1, 2]]);                                     // return 'array'
    Graph.edgeListType([[['A', 'B'], 5], [['A', 'C'], 2], [['B', 'C'], 3]]);          // return 'weighted array'
    Graph.edgeListType({'0,1' : 6, '0,2' : 4, '1,2' : 10});                           // return 'object'
    Graph.edgeListType(new Map([[['A', 'B'], 5], [['A', 'C'], 2], [['B', 'C'], 3]])); // return 'map'
    // else return false

Note : an edge list cannot combine weighted nodes and non-weighted nodes (it returns false).

### Adjacency lists

An adjacency list is a list of each node's children. The weight of each edge can appear, but the weight of each node can't.

Graph objects accept five formats of adjacency lists : arrays, labelled arrays, weighted arrays, objects and weighted objects.

    Graph.adjListType([[1, 2, 3], [0, 2, 3, 5], [4, 5]]);                                    // return 'array'
    Graph.adjListType([['A', ['B', 'C']], ['B', ['A', 'C', 'D']]]);                          // return 'labelled array'
    Graph.adjListType([['A', [['B', 4], ['C', 2]]], ['B', [['A', 3], ['C', 5], ['D', 1]]]]); // return 'weighted array'
    Graph.adjListType({'A': ['B', 'C'], 'B': ['A', 'C']});                                   // return 'object'
    Graph.adjListType({'A': {'B': 5, 'C': 2}, 'B': {'A': 1, 'C': 3}});                       // return 'weighted object'
    // else return false
    
Note : if adjListType is 'array', each node must be a positive integer, and each subarray refers to its index (here, the node 0 has three children : 1, 2 and 3).

### Matrices

An adjacency matrix, or matrix, is a square which indicates if two nodes are connected or not. If a link exists, it displays the weight (default is 1), else 0.

Graph objects accept two formats of matrices : arrays and objects.

    let matrixArray = [
        [0, 0, 1, 0, 0],
        [1, 0, 1, 1, 1],
        [0, 0, 0, 0, 0],
        [1, 1, 0, 0, 1],
        [0, 0, 1, 0, 0]
    ];
       
    let matrixObject = {
        'A' : {'A' : 0, 'B' : 1, 'C' : 1, 'D' : 0},
        'B' : {'A' : 1, 'B' : 0, 'C' : 0, 'D' : 1},
        'C' : {'A' : 1, 'B' : 0, 'C' : 0, 'D' : 0},
        'D' : {'A' : 0, 'B' : 1, 'C' : 0, 'D' : 0}
    }
    
    Graph.matrixType(matrixArray);  // return 'array'
    Graph.matrixType(matrixObject); // return 'object'
    // else return false
    
Note : if matrixType is 'array', each node is represented by indexes of each subarray.

### Grids

A grid is graph where each node is a coordinate in an euclidean plane. Each node has at most 4 neighbors (up, right, down and left). Each intersection of the grid can be a node, linked or not to its neighbors, but can also be a 'wall', as can be seen in ASCII representations of mazes for example.

Grid objects accept two formats of grids : arrays where each value is a string and arrays where each value is an array.

    let grid = [
        '   ######################',
        '   #           #        #',
        '#  #  #######  ####  ####',
        '#     #  #        #     #',
        '#  #  #  #######  #  #  #',
        '#  #  #     #        #  #',
        '#  ####  #  #######  #  #',
        '#     #  #           #  #',
        '#  ##########  #  ####  #',
        '#  #           #  #      ',
        '######################   '
    ]
    
    Grid.gridType(grid);                       // return 'string'
    Grid.gridType(grid.map(line => [...line]); // return 'array'
    // else return false
    
## Graph.mjs

### Constructors

There is many ways to create an instance of a Graph :
- `new Graph(edges, nodes)` where `edges` and `nodes` are respectively valid edge list and node list. The nodes argument is facultative (node list can be automatically determinated from edge list).
- `Graph.fromAdjList(adjList)` where `adjList` is a valid adjacency list.
- `Graph.fromMatrix(matrix)` where `matrix` is a valid adjacency matrix.
- `Grid.fromGrid(grid, wall)` where `grid` is a valid grid and `wall` is a single character used to distinguish nodes from walls.

It is also possible to easily generate grids and trees : 
- `Grid.generateGrid(width, height, orientation)` where `width` and `height` are the dimensions of the grid, and `orientation` determines to which neighbors each node is connected. The orientation argument is a string composed of the letters N, E, S and W (for North, East, South and East). Examples :
    - `orientation='NESW'` (default value) : each node is connected to each of its four neighbors.
    - `orientation='SE` : each node is connected at most to two neighbors (at the right and at the bottom). The top-left node (at coordinates `[0, 0]`) has no parents, whereas the bottom-right node (at coordinates `[width-1, height-1]`) has no child.
    - `orientation=''` : none of the nodes is connected. There is no edges.
- `Tree.generateTree(m, branchs)` where `n` is the total number of nodes and branchs is the maximum number of children for each node. Example, for `branchs=2` (the default value), it will return a complete binary tree.


### Getters

...

### Setters

...

## Grid.mjs

...

## Tree.mjs

...
