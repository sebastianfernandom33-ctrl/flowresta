import { useState, useEffect } from "react";
import React from "react";
import flowrestaLogo from "./assets/flowresta-logo.png";
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

const commitData = {
  main: [
    "abc123 Initial commit",
    "def456 Add authentication",
    "ghi789 Merge release",
  ],

  develop: [
    "aaa111 Fix login",
    "bbb222 Update pipeline",
    "ccc333 Improve UI",
  ],

  release: [
    "ddd444 Release v1.2",
    "eee555 Update changelog",
  ],

  hotfix: [
    "fff666 Fix production bug",
  ],
};

const compareData = {
  "main-develop": {
    ahead: 3,
    behind: 1,
  },

  "main-release": {
    ahead: 5,
    behind: 0,
  },

  "develop-hotfix": {
    ahead: 2,
    behind: 2,
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

  const [reactFlowInstance, setReactFlowInstance] =
    useState<any>(null);

  const [selectedBranch, setSelectedBranch] = useState("Nenhuma");

  const [compareMode, setCompareMode] =
    useState(false);

  const [compareBranchA, setCompareBranchA] =
    useState("");

  const [compareBranchB, setCompareBranchB] =
    useState("");

  const [repositoryUrl, setRepositoryUrl] =
    useState("");

  const [repositoryLoaded, setRepositoryLoaded] =
    useState(false);

  console.log("CURRENT NODES", nodes);

  useEffect(() => {
    console.log("saving", nodes);


    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(nodes)
    );
  }, [nodes]);

  useEffect(() => {

    if (!reactFlowInstance) {
      return;
    }

  const compareReady =
      compareMode &&
      compareBranchA &&
      compareBranchB;

    setTimeout(() => {

      reactFlowInstance.fitView({
        padding: compareReady ? 0.4 : 0.2,
        duration: 800,
      });

    }, 350);

  }, [
    compareMode,
    compareBranchA,
    compareBranchB,
    reactFlowInstance,
  ]);

  const resetLayout = () => {
    localStorage.removeItem(STORAGE_KEY);

  setNodes(initialNodes);

    setSelectedBranch("Nenhuma");
  };
  
  const importRepository = () => {

    if (!repositoryUrl.trim()) {
      return;
    }

    setRepositoryLoaded(true);
  };  

  const repositoryName =
    repositoryUrl
      .replace("https://github.com/", "")
      .replace("https://gitlab.com/", "");


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

  const compareKey =
    `${compareBranchA}-${compareBranchB}`;

  const compareDetails =
    compareData[
      compareKey as keyof typeof compareData
    ];

  const styledNodes = nodes.map((node) => ({
    ...node,

    style: {
      ...node.style,

      boxShadow:

        node.id === compareBranchB
          ? "0 0 20px #a371f7"

          : node.id === compareBranchA
          ? "0 0 15px #a371f7"

          : selectedBranch === node.id
          ? "inset 0 0 0 2px #8b949e"

          : node.style?.boxShadow,
    },
  }));

  const summary = {
    conflict: 0,
    mr: 0,
    normal: 0,
    ok: 0,
  };

  edges.forEach((edge) => {
    const color = edge.style?.stroke;

    if (color === "#f85149") {
      summary.conflict++;
    }

    else if (color === "#d29922") {
      summary.mr++;
    }

    else if (color === "#3fb950") {
      summary.ok++;
    }

    else {
      summary.normal++;
    }
  });

if (!repositoryLoaded) {

  return (

    <div
      style={{
        background: "#0d1117",
        color: "#ffffff",
        minHeight: "100vh",

        display: "flex",

        flexDirection: "column",

        justifyContent: "center",

        alignItems: "center",

        gap: "20px",
      }}
    >
      <img
        src={flowrestaLogo}
        style={{
          width: "160px",
          marginBottom: "10px",
        }}
      />

      <h1>
        Flowresta
      </h1>

      <input
        type="text"

        value={repositoryUrl}

        onChange={(e) =>
          setRepositoryUrl(e.target.value)
        }

        placeholder="Insert Git URL"

        style={{
          width: "500px",

          padding: "12px",

          background: "#161b22",

          color: "#c9d1d9",

          border: "1px solid #30363d",

          borderRadius: "10px",

          fontFamily:
            "JetBrains Mono, monospace",
        }}
      />

      <button
        onClick={importRepository}

        style={{
          background: "#238636",

          color: "white",

          border: "none",

          borderRadius: "10px",

          padding: "12px 24px",

          cursor: "pointer",

          fontFamily:
            "JetBrains Mono, monospace",
        }}
      >
        Import
      </button>

      <p
        style={{
          color: "#8b949e",

          fontStyle: "italic",

          fontFamily:
            "JetBrains Mono, monospace",
        }}
      >
        🌱 Plant your Flowrest here 🌳
      </p>

    </div>

  );
}
  return (

    <div
      style={{
        background: "#0d1117",
        color: "#ffffff",
        minHeight: "100vh",
        padding: "20px",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >

        <div
          onClick={() => {
            setRepositoryLoaded(false);
            setRepositoryUrl("");
          }}

          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            cursor: "pointer",
          }}
        >

          <img
            src={flowrestaLogo}

            style={{
              width: "45px",
            }}
          />

          <h1>
            {repositoryName || "Flowresta"}
          </h1>

        </div>

        <div
          style={{
            display: "flex",
            gap: "12px",
            alignItems: "center",
            color: "#8b949e",
            fontFamily: "JetBrains Mono, monospace",
          }}
        >
          <span
            title="Merge Conflicts"
            style={{
              color: "#f85149",
              fontSize: "20px",
            }}
          >
            ◉{summary.conflict}
          </span>

          <span
            title="Merge Requests"
            style={{
              color: "#d29922",
              fontSize: "20px",
            }}
          >
            ◉{summary.mr}
          </span>

          <span
            title="Normal Relationships"
            style={{
              color: "#8b949e",
              fontSize: "20px",
            }}
          >
            ◉{summary.normal}
          </span>

          <span
            title="Merge OK"
            style={{
              color: "#3fb950",
              fontSize: "20px",
            }}
          >
            ◉{summary.ok}
          </span>

         <button
            onClick={resetLayout}
            title="Reset Layout"
            style={{
              background: "#161b22",
              color: "#8b949e",
              border: "1px solid #30363d",
              borderRadius: "8px",
              padding: "6px 14px",
              cursor: "pointer",
              fontFamily: "JetBrains Mono, monospace",
              fontSize: "30px",
            }}
          >
            ↺
          </button>

          <button
            onClick={() => {

              setCompareMode(!compareMode);

              if (compareMode) {
                setCompareBranchA("");
                setCompareBranchB("");
              }

            }}

            title="Compare"

            style={{
              background: "#161b22",

              color: compareMode
                ? "#a371f7"
                : "#8b949e",

              border: compareMode
                ? "1px solid #a371f7"
                : "1px solid #30363d",

              borderRadius: "8px",

              padding: "6px 16px",

              cursor: "pointer",

              fontFamily: "JetBrains Mono, monospace",

              fontSize: "30px",
            }}
          >
            {
              !compareMode
                ? "✢"
                : compareBranchA && compareBranchB
                ? "❃"
                : compareBranchA
                ? "✻"
                : "✢"

            }
          </button>

        </div>

      </div>

      <div
        style={{
          display: "flex",

          gap: "20px",

          marginTop: "20px",
        }}
      >

      <div
        style={{
          flex: 1,

          border: "1px solid #30363d",

          borderRadius: "12px",

          height: "700px",
        }}
      > 
        <ReactFlow
          onInit={(instance) => {
            setReactFlowInstance(instance);
          }}

          nodes={styledNodes}
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

            if (!compareMode) {
              setSelectedBranch(node.id);
              return;
            }

            if (!compareBranchA) {
              setCompareBranchA(node.id);
              return;
            }

            if (
              !compareBranchB &&
              node.id !== compareBranchA
            ) {
              setCompareBranchB(node.id);
            }

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
        
        <div>

            <div
              style={{
                width:
                  compareMode &&
                  compareBranchA &&
                  compareBranchB
                    ? "320px"
                    : "0px",

                height: "660px",

                overflow: "auto",

                flexDirection: "column",

                display: "flex",

                opacity:
                  compareMode &&
                  compareBranchA &&
                  compareBranchB
                    ? 1
                    : 0,

                transform:
                  compareMode &&
                  compareBranchA &&
                  compareBranchB
                    ? "translateX(0px)"
                    : "translateX(40px)",

                transition:
                  "all 0.35s ease",

                border:
                  compareMode &&
                  compareBranchA &&
                  compareBranchB
                    ? "1px solid #a371f7"
                    : "none",

                borderRadius: "12px",

                padding:
                  compareMode &&
                  compareBranchA &&
                  compareBranchB
                    ? "20px"
                    : "0px",

                background: "#161b22",

                color: "#c9d1d9",

                fontFamily:
                  "JetBrains Mono, monospace",
              }}
            >

              <h3
                style={{
                  color: "#a371f7",
                  marginTop: 0,
                }}
              >
                ✺ Compare Branches
              </h3>

              <p>
                A: {compareBranchA}
              </p>

              <p>
                B: {compareBranchB}
              </p>

              <hr />

              <p>
                + Commits: {compareDetails?.ahead ?? 0}
              </p>

              <p>
                - Commits: {compareDetails?.behind ?? 0}
              </p>

            </div>

        </div>
      </div>


<div
  style={{
    marginTop: "20px",
    display: "flex",
    gap: "20px",
  }}
>

  <div
    style={{
      flex: 1,
      padding: "15px",
      border: "1px solid #30363d",
      borderRadius: "12px",
      textAlign: "left",
      color: "#c9d1d9",
      fontFamily: "JetBrains Mono, monospace",
    }}
  >

    <h3>↪︎ Branch Details</h3>

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

    {details && (
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
    )}

  </div>

  <div
    style={{
      flex: 1,
      padding: "15px",
      border: "1px solid #30363d",
      borderRadius: "12px",
      textAlign: "left",
      color: "#c9d1d9",
      fontFamily: "JetBrains Mono, monospace",
    }}
  >

    <h3>↪︎ Commit History</h3>

    {selectedBranch !== "Nenhuma" ? (

      commitData[
        selectedBranch as keyof typeof commitData
      ]?.map((commit) => (

        <p key={commit}>
          {commit}
        </p>

      ))

    ) : (

      <p
        style={{
          color: "#8b949e",
          fontStyle: "italic",
        }}
      >
        select branch...
      </p>

    )}

  </div>

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