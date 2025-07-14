import Sigma from 'sigma';
import graphology from 'graphology';
import Papa from 'papaparse';
import EdgeCurveProgram from "@sigma/edge-curve";




window.onload = function () {

    console.log("Hello");

    // Retrieve some useful DOM elements:
    const container = document.getElementById("sigma-container");
    
    // Initialize the graph instance
    const graph = new graphology.Graph();

    // Type and declare internal state:
    /**
     * @typedef {Object} State
     * @property {string=} hoveredNode
     * @property {string=} selectedNode
     * @property {Set<string>=} suggestions
     * @property {Set<string>=} hoveredNeighbors
     */
    /** @type {State} */
    const state = {};

    var results = Papa.parse("./jon_sample_data.csv", {
        download: true,
        header: true,
        skipEmptyLines: true,
        complete: function (results) {
            console.log("CSV Data Parsed:", results.data);
            // Process the parsed data here
            // For example, you can create nodes and edges based on the CSV data
            const graph = new graphology.Graph();
            results.data.forEach(row => {

                if (!graph.hasNode(row.source)) {
                    graph.addNode(row.source, {
                        label: row.source,
                        x: Math.random(),
                        y: Math.random(),
                        size: 10,
                        color: "blue"
                    });
                }
            });

            results.data.forEach(row => {
                if (row.source && row.target && graph.hasNode (row.source) && graph.hasNode(row.target) && !graph.hasEdge(row.source, row.target)) {
                    graph.addEdge(row.source, row.target, { 
                        size: 2, 
                        label: row.label,
                        curved: true,
                        forceLabel: true
                    });
                }
            });

            // Instantiate sigma:
            const renderer = new Sigma(graph, container, {
                allowInvalidContainer: true,
                renderEdgeLabels: true,
                defaultEdgeType: "curve",
                edgeProgramClasses: {
                    curve: EdgeCurveProgram
                },
            });

            // Bind graph interactions:
            renderer.on("enterNode", ({ node }) => {
                setHoveredNode(node);
            });
            renderer.on("leaveNode", () => {
                setHoveredNode(undefined);
            });

            // Render nodes accordingly to the internal state:
            // 1. If a node is selected, it is highlighted
            // 2. If there is query, all non-matching nodes are greyed
            // 3. If there is a hovered node, all non-neighbor nodes are greyed
            renderer.setSetting("nodeReducer", (node, data) => {
                const res = { ...data };
                
                if (!graph.hasNode(node)) {
                    return { hidden: true };
                }
                if (state.hoveredNeighbors && !state.hoveredNeighbors.has(node) && state.hoveredNode !== node) {
                    res.label = "";
                    res.color = "#f6f6f6";
                }

                if (state.selectedNode === node) {
                    res.highlighted = true;
                } else if (state.suggestions) {
                    if (state.suggestions.has(node)) {
                        res.forceLabel = true;
                    } else {
                        res.label = "";
                        res.color = "#f6f6f6";
                    }
                }

                return res;
            });

            // Render edges accordingly to the internal state:
            // 1. If a node is hovered, the edge is hidden if it is not connected to the
            //    node
            // 2. If there is a query, the edge is only visible if it connects two
            //    suggestions
            renderer.setSetting("edgeReducer", (edge, data) => {
                const res = { ...data };

                if (
                    state.hoveredNode &&
                    !graph.extremities(edge).every((n) => n === state.hoveredNode || graph.areNeighbors(n, state.hoveredNode))
                ) {
                    res.hidden = true;
                }

                if (
                    state.suggestions &&
                    (!state.suggestions.has(graph.source(edge)) || !state.suggestions.has(graph.target(edge)))
                ) {
                    res.hidden = true;
                }

                return res;
            });

            function setHoveredNode(node) {
                if (node) {
                    state.hoveredNode = node;
                    state.hoveredNeighbors = new Set(graph.neighbors(node));
                }

                if (!node) {
                    state.hoveredNode = undefined;
                    state.hoveredNeighbors = undefined;
                }

                // Refresh rendering
                renderer.refresh({
                    // We don't touch the graph data so we can skip its reindexation
                    skipIndexation: true,
                });
            }
        },
        error: function (error) {
            console.error("Error parsing CSV:", error);
        }
    });

};