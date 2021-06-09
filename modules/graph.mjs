function isNum(n) { // check if n is a number
    return (typeof n == 'number' || typeof n == 'string') && n == +n;
}

function type(element) { // get type of element (array, object, map, set, number, string, boolean, etc...)
    return toString.call(element).slice(8, -1).toLowerCase();
}

export class Graph {

    #weightedEdges = new Map();
    #weightedNodes = new Map();

    constructor(edges, nodes=undefined) {
        this.edges = edges;
        nodes && this.addNode(nodes);
    }
    

    /******************** SETTERS ********************/

    set edges(edges) {
        edges = Graph.edgeListToMap(edges);
        if (!edges) throw Error('Graph edges setter : invalid edges argument');
        this.#weightedEdges = edges;
        this.addNodesFromEdges(this.edges); // automatically add nodes if they don't exist
    }

    set nodes(nodes) {
        nodes = Graph.nodeListToMap(nodes);
        if (!nodes) throw Error('Graph nodes setter : invalid nodes argument');
        this.#weightedNodes = nodes;
        this.#weightedEdges = new Map([...this.weightedEdges].filter(([[a, b], weight]) => this.nodes.includes(a) && this.nodes.includes(b))); // deleting ghost edges
    }


    /******************** GETTERS ********************/

    get edges() {
        return [...this.#weightedEdges.keys()];
    }
    
    get weightedEdges() {
        return this.#weightedEdges;
    }

    get nodes() {
        return [...this.#weightedNodes.keys()];
    }

    get weightedNodes() {
        return this.#weightedNodes;
    }

    get matrix() { // get matrix from nodes and adjList (with weighted edges)
        let adjList = this.weightedAdjList;
        let matrix = {};
        this.nodes.forEach(a => matrix[a] = Object.fromEntries(this.nodes.map(b => [b, adjList[a]?.[b] || 0])));
        return matrix; // e.g. {'A': {'A': 0, 'B': 1, 'C': 1}, 'B': {'A': 1, 'B': 0, 'C': 0}, 'C': {'A': 1, 'B': 0, 'C': 0}}
    }

    get adjList() { // get adjacency list (without weighted edges)
        let adjList = {};
        this.edges.forEach(([a, b]) => adjList[a] ? adjList[a].push(b) : adjList[a] = [b])
        return adjList; // e.g. {'A': ['B', 'C'], 'B': ['C', 'D'], 'C': ['A', 'C', 'D']}
    }

    get weightedAdjList() { // get adjacency list (with weighted edges)
        let adjList = {};
        this.edges.forEach(([a, b]) => {
            adjList[a] = adjList[a] || {};
            adjList[a][b] = this.getWeight(a, b);
        });
        return adjList; // e.g. {'A': {'B': 5, 'C': 3, 'D': 1}, 'B': {'A': 5, 'C': 2, 'D': 2}}
    }

    get size() { // nodes number
        return this.nodes.length;
    }

    get density() {
        return this.edges.length / (this.size * (this.size - 1));
    }

    get isOriented() { // check if the graph is oriented
        return Graph.isOriented(this.edges);
    }

    get roots() {
        return this.nodes.filter(node => !this.hasParents(node));
    }

    get leaves() {
        return this.nodes.filter(node => !this.hasChildren(node));
    }


    /******************** LINKS AND NODES ********************/

    getDegree(node) {
        return this.getChildren(node).length;
    }

    isRoot(node) {
        return this.roots.includes(node);
    }

    isLeave(node) {
        return this.leaves.includes(node);
    }

    getParents(node) {
        return this.edges.filter(([a, b]) => b == node).map(([a, b]) => a);
    }

    getChildren(node) {
        return this.edges.filter(([a, b]) => a == node).map(([a, b]) => b);
    }

    getNeighbors(node) { // parents and children
        return this.getChildren(node).concat(this.getParents(node)).filter((x, i, a) => a.indexOf(x) == i);
    }

    hasParents(node) {
        return this.getParents(node).length > 0;
    }

    hasChildren(node) {
        return this.getDegree(node) > 0;
    }

    hasNeighbors(node) {
        return this.getNeighbors(node).length > 0;
    }

    hasNode(node) { // check if argument is a valid node in the graph
        return this.nodes.includes(node.toString());
    }

    addNode(...nodes) {
        let isWeighted = Graph.nodeListType(nodes) != 'array';
        nodes = Graph.nodeListToMap(nodes) || Graph.nodeListToMap(nodes[0]);
        if (!nodes) throw Error('Graph addNode() : invalid nodes arguments');
        nodes.forEach((weight, node) => (!this.hasNode(node) || isWeighted) && this.#weightedNodes.set(node.toString(), weight));
    }

    deleteNode(...nodes) {
        this.nodes = [...this.weightedNodes].filter(([node, weight]) =>  !nodes.map(x => x.toString()).includes(node));
    }

    link(start, end, value=1, both=false) { // link two nodes. It doesn't change the value if nodes already connected (use setWeight() instead)
        if (isNaN(value)) throw Error('Graph link() : invalid value argument');
        start = start.toString();
        end = end.toString();
        this.addNodesFromEdges([[start, end]]); // create nodes if don't exist
        if (!this.isLinked(start, end)) this.#weightedEdges.set([start, end], value); // link from start to end
        if (both && !this.isLinked(end, start)) this.#weightedEdges.set([end, start], value); // link the other side
    }

    linkAll(node='all', value=1, fromNode='both') { // fromNode = true : link only edges from this node / false : link only edges to this node
        if (isNaN(value)) throw Error('Graph linkAll() : invalid value argument');
        if (node == 'all') { // link only nodes that are not already connected (weights will be preserved)
            for (let start = 0; start < this.size - 1; start++) {
                for (let end = start + 1; end < this.size; end++) {
                    this.link(this.nodes[start], this.nodes[end], value, true);
                }
            }
        } else if (this.hasNode(node)) {
            for (let i = 0; i < this.size; i++) {
                let otherNode = this.nodes[i];
                if (otherNode != node) {
                    if (fromNode != false) { // link edges from node and both
                        this.link(node, otherNode, value, fromNode=='both');
                    } else { // link only edges to node
                        this.link(otherNode, node, value);
                    }
                }
            }
        }
    }

    unlink(start, end, both=false) {
        if (this.isLinked(start, end)) { // unlink from start to end
            let edgesCopy = [...this.#weightedEdges];
            let edgeIndex = this.edges.map(x => JSON.stringify(x)).indexOf(JSON.stringify([start.toString(), end.toString()]));
            edgesCopy.splice(edgeIndex, 1);
            this.#weightedEdges = new Map(edgesCopy);
        }
        if (both && this.isLinked(end, start)) { // unlink the other side
            let edgesCopy = [...this.#weightedEdges];
            let edgeIndex = this.edges.map(x => JSON.stringify(x)).indexOf(JSON.stringify([end.toString(), start.toString()]));
            edgesCopy.splice(edgeIndex, 1);
            this.#weightedEdges = new Map(edgesCopy);
        }
    }

    unlinkAll(node='all', fromNode='both') { // fromNode = true : unlink only edges from this node / false : unlink only edges to this node
        if (node == 'all') {
            this.#weightedEdges = new Map([]);
        } else if (this.hasNode(node)) {
            this.edges = new Map([...this.weightedEdges].filter(([[a, b], weight]) => (fromNode == false || a != node) && (fromNode == true || b != node)));
        }
    }

    isLinked(start, end, both=false) { // check if two nodes are linked
        start = start.toString();
        end = end.toString();
        return JSON.stringify(this.edges).includes(JSON.stringify([start, end])) && (!both || JSON.stringify(this.edges).includes(JSON.stringify([end, start])));
    }


    /******************** WEIGHTED GRAPH ********************/

    getWeight(start, end=undefined) { // return undefined if invalid arguments
        start = start.toString();
        end = end && end.toString();
        if (end) { // get edge weight
            return Object.fromEntries([...this.weightedEdges])[[start,end]];
        } else { // get node weight
            return this.weightedNodes.get(start);
        }
    }

    setWeight(value, start, end=undefined, both=false) {
        start = start.toString();
        end = end && end.toString();
        if (!isNaN(value)) {
            if (end) { // set edge weight
                this.addNodesFromEdges([[start, end]]);
                let edges = Object.fromEntries(this.weightedEdges);
                edges[[start,end]] = value;
                if (both) edges[[end, start]] = value;
                this.edges = edges;
            } else { // set node weight
                this.addNode([[start, value]]);
            }
        } else {
            throw Error('Graph setWeight() : invalid value argument');
        }
    }


    /******************** GRAPH SEARCH ********************/

    dfs(start, end=undefined) {

    }

    bfs(start, end=undefined) {

    }

    dijkstra(start, end=undefined) {

    }


    /******************** OTHER GRAPH CONSTRUCTORS ********************/

    static fromMatrix(matrix) { // return new Graph from matrix
        if (!Graph.matrixType(matrix)) {
            throw Error('Graph fromMatrix() : invalid matrix argument');
        } else if (Graph.matrixType(matrix) == 'array') { // [[0, 0, 1], [1, 0, 0], [1, 1, 0]]
            matrix = Object.fromEntries(matrix.map((line, i) => [i, {...line}])); // converting to object
        }
        let nodes = Object.keys(matrix);
        let weightedEdges = [];
        for (let start of nodes) {
            for (let end of nodes) {
                matrix[start][end] != 0 && weightedEdges.push([[start, end], matrix[start][end]]);
            }
        }
        return new this(weightedEdges, nodes);
    }

    static fromAdjList(adjList, nodes = undefined) { // create new Graph from adjacency list
        adjList = Graph.adjListToObject(adjList);
        if (!adjList) throw Error('Graph fromAdjList() : invalid adjList argument');
        let weightedEdges = [];
        for (let start of Object.keys(adjList)) { 
            for (let end of Object.keys(adjList[start] || [])) {
                weightedEdges.push([[start, end], adjList[start][end]]);
            }
        }
        if (nodes == undefined || Graph.nodeListType(nodes)) {
            return new this(weightedEdges, nodes);
        } else {
            throw Error('Graph fromAdjList() : invalid nodes argument');
        }
    }


    /******************** OBJECT CONVERTERS ********************/

    static edgesToNodes(edges) { // return nodes from and edge list, e.g. [[0, 1], [0, 2], [1, 2]] -> [0, 1, 2]
        if (!Graph.isEdgeList) throw Error('Graph edgesToNodes() : invalid edges argument');
        let nodes = [];
        for (let [a, b] of edges) {
            if (!nodes.includes(a)) nodes.push(a)
            if (!nodes.includes(b)) nodes.push(b)
        }
        return nodes;
    }

    addNodesFromEdges(edges) { // add nodes to node list when new edge is created (e.g. with set edges() and link()). Existing weights are preserved
        if (!Graph.isEdgeList(edges)) throw Error('Graph addNodesFromEdges() : invalid edges argument');
        edges.forEach(([a, b]) => {
            !this.nodes.includes(a) && this.#weightedNodes.set(a, 0);
            !this.nodes.includes(b) && this.#weightedNodes.set(b, 0);
        });
    }

    static getOrientedEdges(edges) { // convert non-oriented edges to oriented edges, e.g. [[0, 1], [2, 3]] -> [[0, 1], [1, 0], [2, 3], [3, 2]]
        let edgeListType = Graph.edgeListType(edges);
        if (!edgeListType) {
            throw Error('Graph getOrientedEdges() : invalid edges argument');
        } else if (edgeListType == 'object') {
            let edgesCopy = Object.fromEntries(Object.entries(edges).map(([edge, weight]) => [edge.split(/ *, */g), weight])); // delete spaces around keys comma
            let orientedEdges = Object.fromEntries(Object.entries(edges).map(([edge, weight]) => [edge.split(/ *, */g).reverse(), weight]));
            return Object.assign({}, orientedEdges, edgesCopy);
        } else { // map, array and weighted array
            edges = [...edges]; // if map
            let edgesCopy = JSON.parse(JSON.stringify(edges));
            let orientedEdges = edges.map(x => edgeListType == 'array' ? [...x].reverse() : [[...x[0]].reverse(), [x[1]]]);
            for (let edge of orientedEdges) {
                if (!JSON.stringify(edges).includes(JSON.stringify(edge))) {
                    edgesCopy.push(edge);
                }
            }
            return edgeListType == 'map' ? new Map(edgesCopy) : edgesCopy;
        }
    }

    static getNonOrientedEdges(edges) { // convert oriented edges to non-oriented edges, e.g. [[0, 1], [1, 0], [2, 3], [3, 2]] -> [[0, 1], [2, 3]]
        let edgeListType = Graph.edgeListType(edges);
        if (!edgeListType) {
            throw Error('Graph getNonOrientedEdges() : invalid edges argument');
        } else if (edgeListType == 'object') {
            let nonOrientedEdges = {};
            Object.entries(edges).forEach(([edge, weight]) => {
                edge = edge.split(/ *, */g); // delete spaces around keys comma
                if (!nonOrientedEdges[[...edge].reverse()]) {
                    nonOrientedEdges[edge] = weight;
                }
            })
            return nonOrientedEdges;
        } else {
            edges = [...edges]; // if map
            let nonOrientedEdges = [];
            edges.forEach(edge => {
                if (!JSON.stringify(nonOrientedEdges).includes(JSON.stringify(edgeListType == 'array' ? [...edge].reverse() : [[...edge[0].reverse()], edge[1]]))) {
                    nonOrientedEdges.push(edge);
                }
            });
            return edgeListType == 'map' ? new Map(nonOrientedEdges) : nonOrientedEdges;
        }
    }

    static nodeListToMap(nodes) {
        let nodeListType = Graph.nodeListType(nodes);
        if (!nodeListType) {
            return false;
        } else if (nodeListType == 'array') { // ['A', 'B', 'C']
            return new Map(nodes.map(node => [node.toString(), 0]));
        } else if (nodeListType == 'weighted array') { // [['A', 0], ['B', 0], ['C', 0]]
            return new Map(nodes);
        } else if (nodeListType == 'object') { // {'A': 5, 'B': 2, 'C': 4}
            return new Map(Object.entries(nodes));
        } else {
            return nodes;
        }
    }

    static edgeListToMap(edges) {
        let edgeListType = Graph.edgeListType(edges);
        if (!edgeListType) {
            return false;
        } else if (edgeListType == 'array') { // [[0, 1], [0, 2], [1, 2]]
            return new Map(edges.map(edge => [edge.map(node => node.toString()), 1]));
        } else if (edgeListType == 'weighted array') { // [[['A', 'B'], 1], [['A', 'C'], 1], [['B', 'C'], 1]]
            return new Map(edges);
        } else if (edgeListType == 'object') { // {'0,1': 6, '0,2': 4, '1,2': 10}
            return new Map(Object.entries(edges).map(([edge, weight]) => [edge.split(/ *, */g), weight])); 
        } else {
            return edges;
        }
    }

    static adjListToObject(adjList) {
        let adjListType = Graph.adjListType(adjList);
        if (!adjListType) {
            return false;
        } else if (adjListType == 'array') { // [[1, 2, 3], [0, 2, 3, 5], [4, 5]]
            return {...adjList.map(x => Object.fromEntries(x.map(node => [node, 1])))};
        } else if (adjListType == 'labeled array') { // [['A', ['B', 'C']], ['B', ['A', 'C', 'D']]]
            return Object.fromEntries(adjList.map(([node, links]) => [node, Object.fromEntries(links.map(link => [link, 1]))]));
        } else if (adjListType == 'weighted array') { // [['A', [['B', 4], ['C', 2]]], ['B', [['A', 3], ['C', 5], ['D', 1]]]]
            return Object.fromEntries(adjList.map(([node, links]) => [node, Object.fromEntries(links)]));
        } else if (adjListType == 'object') { // {'A': ['B', 'C'], 'B': ['A', 'C']}
            return Object.fromEntries(Object.entries(adjList).map(([key, value]) => [key, Object.fromEntries(value.map(node => [node, 1]))]));
        }
    }

    
    /******************** CHECKERS ********************/

    static isWeighted =            element => Array.isArray(element) && element.length == 2 && !isNaN(element[1]);          // [something, 5]

    static isNode =                   node => ['number', 'string'].includes(type(node));                                    // 'A'
    static isNodeList =              nodes => Array.isArray(nodes) && nodes.every(node => Graph.isNode(node));              // ['A', 'B', 'C']
    static isWeightedNode =           node => Graph.isEdge(node) && !isNaN(node[1]);                                        // ['A', 5]
    static isWeightedNodeList =      nodes => Graph.isEdgeList(nodes) && nodes.every(node => !isNaN(node[1]));              // [['A', 1], ['B', 3], ['C', 5]]
    
    static isNodeCoord =              node => Graph.isWeighted(node) && !isNaN(node[0])                                     // [0, 0]
    static isNodeCoordList =         nodes => Array.isArray(nodes) && nodes.every(node => Graph.isNodeCoord(node));         // [[0, 0], [0, 1], [1, 0], [1, 1]]
    static isWeightedNodeCoord =      node => Graph.isWeighted(edge) && Graph.isNodeCoord(node[0]);                         // [[0, 0], 1]
    static isWeightedNodeCoordList = nodes => Array.isArray(nodes) && nodes.every(node => Graph.isWeightedNodeCoord(node)); // [[[0, 0], 5], [[0, 1], 5], [[1, 0], 3]]
    
    static isEdge =                   edge => Graph.isNodeList(edge) && edge.length == 2;                                   // ['A', 'B']
    static isEdgeList =              edges => Array.isArray(edges) && edges.every(edge => Graph.isEdge(edge));              // [[0, 1], [2, 3], [4, 5]]
    static isWeightedEdge =           edge => Graph.isWeighted(edge) && Graph.isEdge(edge[0])                               // [['A', 'B'], 5]
    static isWeightedEdgeList =      edges => Array.isArray(edges) && edges.every(edge => Graph.isWeightedEdge(edge));      // [[['A', 'B'], 5], [['A', 'C'], 2], [['B', 'C'], 3]]

    static isEdgeCoord =              edge => Graph.isNodeCoordList(edge) && edge.length == 2;                              // [[0, 0], [0, 1]]
    static isEdgeCoordList =         edges => Array.isArray(edges) && edges.every(edge => Graph.isEdgeCoord(edge));         // [[[0, 0], [0, 1]], [[2, 4], [2, 1]]]
    static isWeightedEdgeCoord =      edge => Graph.isWeighted(edge) && Graph.isEdgeCoord(edge[0]);                         // [[[0, 0], [0, 1]], 5]
    static isWeightedEdgeCoordList = edges => Array.isArray(edges) && edges.every(edge => Graph.isWeightedEdgeCoord(edge)); // [[[[0, 0], [0, 1]], 5], [[[2, 1], [2, 2]], 3]]

    static edgeListType(edges) { // check if argument is a valid edge list and return its type
        if (Graph.isEdgeList(edges)) { // [[0, 1], [0, 2], [1, 2]]
            return 'array';
        } else if (Graph.isWeightedEdgeList(edges)) { // [[['A', 'B'], 5], [['A', 'C'], 2], [['B', 'C'], 3]]
            return 'weighted array';
        } else if (type(edges) == 'object' && Graph.isWeightedEdgeList(Object.entries(edges).map(([edge, weight]) => [edge.split(/ *, */g), weight]))) {
            return 'object'; // {'0,1' : 6, '0,2' : 4, '1,2' : 10}
        } else if (type(edges) == 'map' && Graph.isWeightedEdgeList([...edges])) { // Map([[['A', 'B'], 5], [['A', 'C'], 2], [['B', 'C'], 3]])
            return 'map';
        }
        return false;
    }

    static nodeListType(nodes) { // check if argument is a valid node list and return its type
        if (Graph.isNodeList(nodes)) { // ['A', 'B', 'C']
            return 'array';
        } else if (Graph.isWeightedNodeList(nodes)) { // [['A', 0], ['B', 0], ['C', 0]]
            return 'weighted array';
        } else if (type(nodes) == 'object' && Graph.isWeightedNodeList(Object.entries(nodes))) { // {'A': 5, 'B': 2, 'C': 4}
            return 'object';
        } else if (type(nodes) == 'map' && Graph.isWeightedNodeList([...nodes])) { // Map([['A', 0], ['B', 0], ['C', 0]])
            return 'map';
        }
        return false;
    }

    static matrixType(matrix) { // check if argument is a valid matrix and return its type
        if (Array.isArray(matrix) && matrix.every(line => Array.isArray(line) && line.length == matrix.length && line.every(x => !isNaN(x)))) {
            return 'array'; // [[0, 0, 1], [1, 0, 0], [1, 1, 0]]
        } else if (type(matrix) == 'object' && Object.values(matrix).every(line => type(line) == 'object' && JSON.stringify(Object.keys(line)) == JSON.stringify(Object.keys(matrix)) && Object.values(line).every(x => !isNaN(x)))) {
            return 'object'; // {'A': {'A': 0, 'B': 0, 'C': 0}, 'B': {'A': 1, 'B': 0, 'C': 0}, 'C': {'A': 1, 'B': 1, 'C': 0}}
        }
        return false;
    }

    static adjListType(adjList) { // check if argument is a valid adjList and return its type
        if (Array.isArray(adjList) && adjList.every(x => Array.isArray(x))) {
            if (adjList.every(link => link.every(node => isNum(node)))) { // [[1, 2, 3], [0, 2, 3, 5], [4, 5]]
                return 'array';
            } else if (adjList.every(link => link.length == 2 && Graph.isNode(link[0]))) {
                if (adjList.every(link => Graph.isNodeList(link[1]))) { // [['A', ['B', 'C']], ['B', ['A', 'C', 'D']]]
                    return 'labeled array';
                } else if (adjList.every(link => Graph.isWeightedNodeList(link[1]))) { // [['A', [['B', 4], ['C', 2]]], ['B', [['A', 3], ['C', 5], ['D', 1]]]]
                    return 'weighted array';
                }
            }
        } else if (type(adjList) == 'object' && Graph.isNodeList(Object.keys(adjList))) {
            if (Object.values(adjList).every(nodes => Graph.isNodeList(nodes))) { // {'A': ['B', 'C'], 'B': ['A', 'C']}
                return 'object';
            } else if (Object.values(adjList).every(nodes => type(nodes) == 'object' && Graph.isWeightedNodeList(Object.entries(nodes)))) { // {'A': {'B': 5, 'C': 2}, 'B': {'A': 1, 'C': 3}}
                return 'weighted object';
            }
        }
        return false;
    }

    static isOriented(edges) { // check if a graph is oriented from an edge list
        if (Graph.edgeListType(edges) == 'object') {
            edges = Object.keys(edges).map(edge => edge.split(','));
        } else if (Graph.edgeListType(edges) == false) {
            throw Error('Graph isOriented() : invalid edges argument');
        }
        return edges.some(([a, b]) => !JSON.stringify(edges).includes(JSON.stringify([b, a])));
    }

    static isGraph(graph) {
        return graph instanceof Graph;
    }
}