import { useState, useEffect } from "react";
import React from "react";
import ReactFlow, {
  Background,
  Controls,
  useNodesState,
} from "reactflow";

import "reactflow/dist/style.css";

const initialNodes = [
  {
    id: "main",

    draggable: true,

    position: { x: 400, y: 50 },

    data: {
      label: "🛡️ main",
    },

    style: {
      background: "#2d333b",
      border: "2px solid #8b949e",
      color: "#8b949e",
      borderRadius: "10px",
      padding: "8px",
      fontFamily: "JetBrains Mono, monospace",
    },
  },
  {
    id: "develop",

    draggable: true,

    position: { x: 250, y: 200 },

    data: {
      label: "develop",
    },

    style: {
      background: "#161b22",
      border: "2px solid #58a6ff",
      boxShadow: "0 0 10px #58a6ff",
      color: "#c9d1d9",
      borderRadius: "10px",
      padding: "8px",
      fontFamily: "JetBrains Mono, monospace",
    },
  },
  {
    id: "release",

    draggable: true,

    position: { x: 550, y: 200 },
    data: { label: "release/v1.2" },

    style: {
      background: "#161b22",
      border: "1px solid #30363d",
      color: "#c9d1d9",
      borderRadius: "10px",
      padding: "8px",
      fontFamily: "JetBrains Mono, monospace",
    },

  },
  {
    id: "hotfix",

    draggable: true,

    position: { x: 750, y: 200 },
    data: { label: "hotfix" },

    style: {
      background: "#161b22",
      border: "1px solid #30363d",
      color: "#c9d1d9",
      borderRadius: "10px",
      padding: "8px",
      fontFamily: "JetBrains Mono, monospace",
    },

  },
];

const edges = [
  {
    id: "e1",
    source: "main",
    target: "develop",
    style: {
      stroke: "#3fb950",
      strokeWidth: 4,
    },
  },

  {
    id: "e2",
    source: "main",
    target: "release",
    style: {
      stroke: "#d29922",
      strokeWidth: 4,
    },
  },

  {
    id: "e3",
    source: "main",
    target: "hotfix",
    style: {
      stroke: "#f85149",
      strokeWidth: 4,
    },
  },
];

const branchData = {
  main: {
    protected: true,
    pipeline: "success",
    author: "Sebastian",
    roles: ["Owner", "Maintainer"],
  },

  develop: {
    protected: false,
    pipeline: "running",
    author: "Marina",
    roles: ["Developer"],
  },

  release: {
    protected: false,
    pipeline: "not-started",
    author: "Northon",
    roles: ["Maintainer"],
  },

  hotfix: {
    protected: false,
    pipeline: "failed",
    author: "Samuel",
    roles: ["Developer"],
  },
};

const STORAGE_KEY = "flowresta-layout";

function App() {

  const savedLayout =
    localStorage.getItem(STORAGE_KEY);

  const [nodes, setNodes, onNodesChange] =
    useNodesState(
      savedLayout
        ? JSON.parse(savedLayout)
        : initialNodes
    );

  console.log("CURRENT NODES", nodes);

  useEffect(() => {
    console.log("saving", nodes);


    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(nodes)
    );
  }, [nodes]);

  const [selectedBranch, setSelectedBranch] = useState("Nenhuma");

  const [hoveredBranch, setHoveredBranch] = useState("");

  const [isDragging, setIsDragging] = useState(false);

  const [tooltipPosition, setTooltipPosition] = useState({
    x: 0,
    y: 0,
  });

  const details =
    branchData[selectedBranch as keyof typeof branchData];

  const hoveredDetails =
    branchData[hoveredBranch as keyof typeof branchData];

  const styledNodes = nodes.map((node) => ({
    ...node,

    style: {
      ...node.style,

      boxShadow:
        selectedBranch === node.id
          ? "inset 0 0 0 2px #8b949e"
          : node.style?.boxShadow,
    },
  }));

  return (
    <div
      style={{
        background: "#0d1117",
        color: "#ffffff",
        minHeight: "100vh",
        padding: "20px",
      }}
    >
      <h1>🌲 Flowresta</h1>

      <div
        style={{
          border: "1px solid #30363d",
          borderRadius: "12px",
          height: "700px",
          marginTop: "20px",
        }}
      >
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onPaneClick={() => {
            setSelectedBranch("Nenhuma");
          }}
          onNodesChange={onNodesChange}

          onNodeDragStart={() => {
            setIsDragging(true);
            
            setHoveredBranch("");
          }}

          onNodeDragStop={(_, node) => {
            setIsDragging(false);

            setHoveredBranch(node.id);
          }}

          fitView
          zoomOnScroll={false}
          nodesDraggable={true}
          onNodeClick={(_, node) => {
            setSelectedBranch(node.id);
          }}

          onNodeMouseEnter={(event, node) => {
            setHoveredBranch(node.id);

            setTooltipPosition({
              x: event.clientX,
              y: event.clientY,
            });
          }}

          onNodeMouseMove={(event) => {
            setTooltipPosition({
              x: event.clientX,
              y: event.clientY,
            });
          }}

          onNodeMouseLeave={() => {
            setHoveredBranch("");
          }}
        >
          <Controls />
          <Background />
        </ReactFlow>
      </div>


      <div
        style={{
          marginTop: "20px",
          padding: "15px",
          border: "1px solid #30363d",
          borderRadius: "12px",
          textAlign: "left",
          color: "#c9d1d9",
          fontFamily: "JetBrains Mono, monospace",
        }}
      >
        <h3>↪︎Branch Details</h3>

        {selectedBranch === "Nenhuma" ? (
          <p
            style={{
              fontStyle: "italic",
              color: "#8b949e",
            }}
          >
            select branch...
          </p>
        ) : (
          <p>
            <strong>Name:</strong> {selectedBranch}
          </p>
        )}

        {details?.protected && (
          <p
            style={{
              fontStyle: "italic",
              color: "#8b949e",
            }}
          >
            protected
          </p>
        )}

        {details ? (
          <>
          

            <p>
              <strong>Author:</strong> {details.author}
            </p>

            <p>
              <strong>Last Pipeline:</strong>{" "}

              {details.pipeline === "success" && "OK"}

              {details.pipeline === "failed" && "NOK"}

              {details.pipeline === "running" && "Running"}

              {details.pipeline === "not-started" && "Not Started"}
            </p>

            <p>
              <strong>Roles:</strong>{" "}
              {details.roles.join(", ")}
            </p>

          </>
        ) : null}
      </div>
    
    {hoveredDetails && !isDragging && (
      <div
        style={{
          position: "fixed",

          left: tooltipPosition.x + 15,

          top: tooltipPosition.y + 15,

          background: "#161b22",

          border: "1px solid #30363d",

          borderRadius: "10px",

          padding: "12px",

          fontFamily: "JetBrains Mono, monospace",

          fontSize: "13px",

          pointerEvents: "none",

          zIndex: 9999,
        }}
      >
        <strong>
          {hoveredDetails.pipeline === "success" && (
            <span style={{ color: "#58a6ff" }}>
              ✓
            </span>
          )}

          {hoveredDetails.pipeline === "failed" && (
            <span style={{ color: "#58a6ff" }}>
              ✕
            </span>
          )}

          {hoveredDetails.pipeline === "running" && (
            <span style={{ color: "#58a6ff" }}>
              ϟ
            </span>
          )}

          {" "}

          {hoveredBranch}

          {hoveredDetails?.protected && (
            <span
              style={{
                fontStyle: "italic",
                color: "#8b949e",
                marginLeft: "6px",
              }}
            >
              (protected)
            </span>
          )}
        </strong>

        <p>Author: {hoveredDetails?.author}</p>

      </div>
    )}


    </div>

  );
}


export default App;