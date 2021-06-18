import { Graph } from "./graph.mjs";

export class Tree extends Graph { // rooted tree only ?
    // https://en.wikipedia.org/wiki/Tree_(data_structure)#Terminology

    #treeDegree = Infinity; // maximum number of children for each node

    constructor(edges, treeDegree=Infinity) {
        super(edges);
        // set degree
    }


    /******************** SETTERS ********************/

    set treeDegree(n) {
        this.#treeDegree = n;
        // delete excess nodes, or reorder ?
    }


    /******************** GETTERS ********************/

    get treeDegree() {
        return this.#treeDegree;
    }

    get root() {
        return this.roots[0];
    }

    get depth() {

    }

    depth(node, weighted=true) { // distance from the root

    }

    height(node, weighted=true) { // distance to the farest leave

    }

    
    get breadth() { // number of leaves
        return this.leaves.length;
    }

    subTree(node) { 
        // return new Tree(this.edges.filter(......))
    }

    getParent(node) {
        return this.getParents(node)[0];
    }

    getSiblings(node) {
        return this.getParents(node).map(x => this.getChildren(x)).flat().filter((x, i, a) => a.indexOf(x) == i && x != node);
    }

    hasSiblings(node) {
        return this.getSiblings(node).length > 0;
    }

    get isFull() { // m-ary tree where every node has either 0 or m children

    }

    get isComplete() { // m-ary tree where every node has m children except for the last level, where leaves are as far left as possible
        // let branchs = Math.round(tree.size / (tree.size - tree.leaves.length)); // estimation
    }

    get isPerfect() { // a full m-ary tree where all leafs are at the same depth

    }

    /******************** TREE SEARCH ********************/

    lowestCommonAncestor(node1, node2) {

    }

    /******************** OTHER TREE CONSTRUCTORS ********************/

    static fromTree(tree) {

    }

    static generateTree(n, degree=2) { // complete m-ary tree generator (2 degree : binary tree)
        return Tree.fromAdjList([...Array(n)].map((x, i) => [...Array(i + 1 == Math.ceil(n / degree) ? (n - 1) % degree : degree * (i < n / degree))].map((y, j) => i * degree + j + 1)));
    }


    /******************** CHECKERS ********************/

    static isTree(tree) {
        return tree instanceof Tree;
    }

    static isValidTree(edges, degree=Infinity) { // degree : the maximum number of children for each node
        let tree = new Graph(edges);
        let roots = tree.roots;
        if (roots.length != 1) return false;

        let adjList = tree.adjList;
        let stack = [roots[0]];
        let visited = [];
        while (stack.length) { // DFS
            let node = stack.pop();
            visited.push(node);
            if (!adjList[node]) continue; // if node is a leaf
            if (adjList[node].length > degree) return false;
            adjList[node].forEach(x => {
                if (!visited.includes(x)) {
                    stack.push(x);
                } else { 
                    return false;
                }
            })
        }
        return true;
    }

    static getTreeDegree(tree) {
        if (!Tree.isTree(tree)) throw Error('Tree getTreeDegree() : invalid tree argument');
        return Math.max(...Object.values(tree.adjList).map(x => x.length));
    }

    /******************** DELETED METHODS ********************/

    link = null;
    linkAll = null;
    unlink = null;
    unlinkAll = null;
}