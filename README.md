<p align="center">
  <img src="https://st2.depositphotos.com/1431107/7783/v/950/depositphotos_77835800-stock-illustration-work-in-progress-sign.jpg" width=200>
  <br>... README.md is under construction ...
</p>

# Graph data structures
This collection of data structures consists of JavaScript classes for various graph types : common graphs, grids and trees.<br>
It allows you to easily make operations in data structures, like finding shortest path, displaying matrices or adjacency lists, generating rooted trees, and so on...</p>

## Contents

- [Objects formats](https://github.com/Gaspar-Cdv/graph-data-structures-JS#objects-formats)
  - [Node lists](https://github.com/Gaspar-Cdv/graph-data-structures-JS#node-lists)
  - [Edge lists](https://github.com/Gaspar-Cdv/graph-data-structures-JS#edge-lists)
  - [Adjacency lists](https://github.com/Gaspar-Cdv/graph-data-structures-JS#adjacency-lists)
  - [Matrices](https://github.com/Gaspar-Cdv/graph-data-structures-JS#matrices)
  - [Grids](https://github.com/Gaspar-Cdv/graph-data-structures-JS#grids)
- [Constructors](https://github.com/Gaspar-Cdv/graph-data-structures-JS#constructors)
- [Graph.mjs](https://github.com/Gaspar-Cdv/graph-data-structures-JS#graphmjs)
  - [Getters](https://github.com/Gaspar-Cdv/graph-data-structures-JS#getters)
    - [Nodes](https://github.com/Gaspar-Cdv/graph-data-structures-JS#nodes)
    - [Edges](https://github.com/Gaspar-Cdv/graph-data-structures-JS#edges)
    - [Adjacency list](https://github.com/Gaspar-Cdv/graph-data-structures-JS#adjacency-list)
    - [Matrix](https://github.com/Gaspar-Cdv/graph-data-structures-JS#matrix)
    - [Other getters](https://github.com/Gaspar-Cdv/graph-data-structures-JS#other-getters)
  - [Setters](https://github.com/Gaspar-Cdv/graph-data-structures-JS#setters)
    - [Nodes](https://github.com/Gaspar-Cdv/graph-data-structures-JS#nodes-1)
    - [Edges](https://github.com/Gaspar-Cdv/graph-data-structures-JS#edges-1)
  - [Static functions](https://github.com/Gaspar-Cdv/graph-data-structures-JS#static-functions)
- [Grid.mjs](https://github.com/Gaspar-Cdv/graph-data-structures-JS#gridmjs)
- [Tree.mjs](https://github.com/Gaspar-Cdv/graph-data-structures-JS#treemjs)

## Objects formats

Graph uses many objects like edge lists, node lists, adjacency lists, matrices,... It's important to know how to format them for an appropriate use. Many checkers are implemented as static methods as seen below.

### Node lists

A node can be a string or a number. If a node is weighted, its weight must be a number. If a node is not weighted, its default value is 0.

Graph objects accept four formats of node lists : arrays, weighted arrays, objects and Map objects. Once the graph instanced, the node list is automatically converted to Map object.

    Graph.nodeListType(['A', 'B', 'C']);                         // return 'array'
    Graph.nodeListType([['A', 0], ['B', 0], ['C', 0]]);          // return 'weighted array'
    Graph.nodeListType({'A': 5, 'B': 2, 'C': 4});                // return 'object'
    Graph.nodeListType(new Map([['A', 0], ['B', 0], ['C', 0]])); // return 'map'
    // else return false

Note : a node list cannot combine weighted nodes and non-weighted nodes (it returns `false`).

### Edge lists

An edge is a link between two nodes (e.g. `['A', 'B']`). An edge can also be weighted. If not, its default value is 1.

Graph objects also accept four formats of edge lists : arrays, weighted arrays, objects and Map objects. Once the graph instanced, the edge list is automatically converted to Map object.

    Graph.edgeListType([[0, 1], [0, 2], [1, 2]]);                                     // return 'array'
    Graph.edgeListType([[['A', 'B'], 5], [['A', 'C'], 2], [['B', 'C'], 3]]);          // return 'weighted array'
    Graph.edgeListType({'0,1' : 6, '0,2' : 4, '1,2' : 10});                           // return 'object'
    Graph.edgeListType(new Map([[['A', 'B'], 5], [['A', 'C'], 2], [['B', 'C'], 3]])); // return 'map'
    // else return false

Note : an edge list cannot combine weighted nodes and non-weighted nodes (it returns `false`).

### Adjacency lists

An adjacency list is a list of each node's children. The weight of each edge can appear, but the weight of each node can't.

Graph objects accept five formats of adjacency lists : arrays, labelled arrays, weighted arrays, objects and weighted objects.

    Graph.adjListType([[1, 2, 3], [0, 2, 3, 5], [4, 5]]);                                    // return 'array'
    Graph.adjListType([['A', ['B', 'C']], ['B', ['A', 'C', 'D']]]);                          // return 'labelled array'
    Graph.adjListType([['A', [['B', 4], ['C', 2]]], ['B', [['A', 3], ['C', 5], ['D', 1]]]]); // return 'weighted array'
    Graph.adjListType({'A': ['B', 'C'], 'B': ['A', 'C']});                                   // return 'object'
    Graph.adjListType({'A': {'B': 5, 'C': 2}, 'B': {'A': 1, 'C': 3}});                       // return 'weighted object'
    // else return false
    
Note : if adjListType is `'array'`, each node must be a positive integer, and each subarray refers to its index (here, the node 0 has three children : 1, 2 and 3).

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
    
Note : if matrixType is `'array'`, each node is represented by indexes of each subarray.

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
    
## Constructors

There is many ways to create an instance of a Graph :
- `new Graph(edges, nodes=undefined)` where `edges` and `nodes` are respectively valid edge list and node list. The `nodes` argument is facultative (node list can be automatically determinated from edge list).
- `Graph.fromAdjList(adjList, nodes=undefined)` where `adjList` is a valid adjacency list. If there is non-connected nodes which don't appear it the adjacency list, you can add them in an array in the `nodes` argument.
- `Graph.fromMatrix(matrix)` where `matrix` is a valid adjacency matrix.
- `Grid.fromGrid(grid, wall)` where `grid` is a valid grid and `wall` is a single character used to distinguish nodes from walls.

It is also possible to easily generate grids and trees : 
- `Grid.generateGrid(width, height, orientation)` where `width` and `height` are the dimensions of the grid, and `orientation` determines to which neighbors each node is connected. The orientation argument is a string composed of the letters N, E, S and W (for North, East, South and East). Examples :
    - `orientation='NESW'` (default value) : each node is connected to each of its four neighbors.
    - `orientation='SE` : each node is connected at most to two neighbors (at the right and at the bottom). The top-left node (at coordinates `[0, 0]`) has no parents, whereas the bottom-right node (at coordinates `[width-1, height-1]`) has no child.
    - `orientation=''` : none of the nodes is connected. There is no edges.
- `Tree.generateTree(n, branchs)` where `n` is the total number of nodes and branchs is the maximum number of children for each node. For xample, `branchs=2` (the default value) will return a complete binary tree.

All these methods return a Graph object (which an also be a Tree or a Grid object).

## Graph.mjs

From now, all the examples below will be presented with a Graph instance called `graph` :

    let graph = new Graph(edges, nodes);

### Getters

#### Nodes

You can easily get a non-weighted node list or a weighted node list. Remember, if no weights are specified during the Graph instantiation, all nodes will be initialized to 0.

    graph.nodes;           // return an array, like ['A', 'B', 'C']
    graph.weightedNodes;   // return a Map object, like {'A' => 0, 'B' => 0, 'C' => 0)
    
    graph.getWeight(node); // return the weight of a specific node
    
There are many ways to filter the graph's node list. Note : all the methods below will return a non-weighted node list :

    graph.roots;              // return nodes with no parents
    graph.leaves;             // return nodes with no children
    graph.innerNodes;         // return nodes which are neither root nor leaf
    graph.getParents(node);   // return parents of a specific node
    graph.getChildren(node);  // return children of a specific node
    graph.getNeighbors(node); // return parents and children of a specific node (without redundancy)
    
To get the degree of a specific node, use `graph.getDegree(node)`. The degree of a node is the number of its children.

At last, there are also many features to have some informations about a specific node. All of these will return a boolean. Their names speak for themselves.

    graph.isRoot(node);
    graph.isLeave(node);
    graph.isInnerNode(node);
    graph.hasParents(node);
    graph.hasChildren(node);
    graph.hasNeighbors(node);
    graph.hasNode(node); // return if a node is included in the graph's node list
    
#### Edges

Like for nodes, you can get non-weighted or weighted edge list. The default weight for each edge is 1.

    graph.edges;                 // return an array, like [['A', 'B'], ['A', 'C'], ['B', 'C']]
    graph.weightedEdges;         // return a Map object, like {['A', 'B'] => 1, ['A', 'C'] => 1, ['B', 'C'] => 1}
    
    graph.getWeight(start, end); // return the weight of a specific edge, from the node `start` to the node `end`
                                 // or return undefined it the edge doesn't exist
 
To check if an edge exists in the Graph object, use `graph.isLinked(start, end, both)`. The `both` argument is a boolean, which determines if you want to check the edge in an oriented or a non-oriented way. If `both=false` (the default value), it will return if an edge is linked from `start` to `end` only. If `both=true`, it will return if an edge is link from `start` to `end` AND from `end` to `start`.

#### Adjacency list

It's possible to get a non-weighted or a weighted adjacency list.

    graph.adjList;         // return an object, like {'A': ['B', 'C'], 'B': ['A', 'C']}
    graph.weightedAdjList; // return a weighted object, like {'A': {'B': 5, 'C': 2}, 'B': {'A': 1, 'C': 3}}

#### Matrix

The returned matrix is an object (see above).

    graph.matrix;

#### Other getters

    graph.size;       // return the number of nodes
    graph.density;    // return the ratio between edges number and nodes number
                      // 0 means there is no edge, 1 means all nodes are connected to each others
    graph.isOriented; // return a boolean. A graph is oriented if there is at least one edge non-oriented

### Setters

#### Nodes

It is possible to add or delete nodes in a Graph object. Note : if you delete a node, each edge which was connected to will be deleted too.

    graph.addNode(...nodes);    // you can add one or as much nodes as you want
    graph.deleteNode(...nodes); // you can delete one or as much nodes as you want
    
To set the weight of a specific node, use `graph.setWeight(weight, node)`.

#### Edges

In the same way, you can link or unlink edges.

    graph.link(start, end, weight=1, both=false); // if an edge already exists, its weight will be changed.
                                                  // if both=false, the edge will be oriented from start to end only
                                                  // else the edge will be linked in both directions
    graph.unlink(start, end, both=false);         // if both=false, only the edge from start to end will be unlinked
                                                  // else the edge will be unlink in both directions

Two useful features are implemented in the Graph class, to quickly link or unlink all edges from a specific node, or all edges of the entire Graph object.

    graph.linkAll(node='all', weight=1, fromNode='both');
    graph.unlinkAll(node='all', fromNode='both')

- node argument :
  - `'all'` (the default value) means every node will be linked/unlinked to each other.
  - else this argument can take a node exisiting in the Graph object.
- weight argument (for linkAll() only) :
  - set the weight of every edges created. If an edge already exists, its weight will be preserved.
- fromNode argument :
  - `'both'` (the default value) means edges will be linked/unlinked in both directions.
  - `true` means every edges will be linked/unlinked only from the specified node to each other (doesn't work if node='all').
  - `false` means every edges will be linked/unlinked only from the other edges to the specified node (doesn't work if node='all').

So to connect or disconnect every node in the Graph object, you can simply use `graph.linkAll()` or `graph.unlinkAll()`. The density or the graph will be respectively 1 and 0.

At last, to set the weight of a specific edge, use `graph.setWeight(weight, start, end, both=false)`. If `both=false`, only the edge from `start` to `end` will be setted. Otherwise, both directions will be changed.

### Static functions

...

## Grid.mjs

...

## Tree.mjs

...
