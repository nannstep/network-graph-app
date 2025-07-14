import Sigma from 'sigma';
import graphology from 'graphology';
import Papa from 'papaparse';
import EdgeCurveProgram from "@sigma/edge-curve";



window.onload = function () {

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
                        curved: true,
                        forceLabel: true
                    });
                }
            });

            // Render the graph using Sigma.js
            const sigmaInstance = new Sigma(graph, document.getElementById("container"), {
                allowInvalidContainer: true,
                renderEdgeLabels: true,
                defaultEdgeType: "curve",
                edgeProgramClasses: {
                    curve: EdgeCurveProgram
                },
            });
        },
        error: function (error) {
            console.error("Error parsing CSV:", error);
        }
    });

};