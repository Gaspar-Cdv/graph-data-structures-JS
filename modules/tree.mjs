import { Graph } from "./graph.mjs";

export class Tree extends Graph { // rooted tree only ?
    // https://en.wikipedia.org/wiki/Tree_(data_structure)#Terminology

    #degree = Infinity; // maximum number of children for each node

    constructor(edges, degree = Infinity) {
        super(edges);
    }

    
    /******************** SETTERS ********************/

    set degree(n) {
        this.#degree = n;
        // delete excess nodes
    }


    /******************** GETTERS ********************/

    get root() {
        return this.roots[0];
    }

    get depth() {

    }

    depth(node) {

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


    get breadth() { // number of leaves
        return this.leaves.length;
    }

    get isFull() { // m-ary tree where every node has either 0 or m children

    }

    get isComplete() { // m-ary tree where every node has m children except for the last level, where leaves are as far left as possible

    }

    get isPerfect() { // a full m-ary tree where all leafs are at the same depth

    }


    /******************** OTHER TREE CONSTRUCTORS ********************/

    static fromTree(tree) {

    }

    static generateTree(m, branchs = 2) { // complete m-ary tree generator (2 branchs : binary tree)
        return Tree.fromAdjList([...Array(m)].map((x, i) => [...Array(i + 1 == Math.ceil(m / branchs) ? (m - 1) % branchs : branchs * (i < m / branchs))].map((y, j) => i * branchs + j + 1)));
    }


    /******************** CHECKERS ********************/

    static getBranchNb(edges) {
        if (!Tree.edgeListType(edges)) return 0;
        let tree = new Graph(edges);
        let roots = tree.roots;
        if (roots.length != 1) return 0;
        let branchs = Math.round(tree.size / (tree.size - tree.leaves.length)); // estimation

    }

    static isTree(tree) {
        return tree instanceof Tree;
    }


    /******************** DELETED METHODS ********************/

    link = null;
    linkAll = null;
    unlink = null;
    unlinkAll = null;
}