import Sigma from 'sigma';
import graphology from 'graphology';
import Papa from 'papaparse';

window.onload = function () {
    // const graph = new graphology.Graph();
    // graph.addNode("1", { label: "Node 1", x: 0, y: 0, size: 10, color: "blue" });
    // graph.addNode("2", { label: "Node 2", x: 1, y: 1, size: 20, color: "red" });
    // graph.addEdge("1", "2", { size: 5, color: "purple" });

    // // Instantiate sigma.js and render the graph
    // const sigmaInstance = new Sigma(graph, document.getElementById("container"));
    // }
    console.log("Hello");

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
                        type: 'arrow',
                        forceLabel: true
                    });
                }
            });

            // Render the graph using Sigma.js
            const sigmaInstance = new Sigma(graph, document.getElementById("container"), {
                renderEdgeLabels: true
            });
        },
        error: function (error) {
            console.error("Error parsing CSV:", error);
        }
    });

};