import { useState, useEffect } from "react";
import React from "react";
import flowrestaLogo from "./assets/flowresta-logo.png";
import ReactFlow, {
  Background,
  Controls,
  useNodesState,
  useEdgesState,
} from "reactflow";

import "reactflow/dist/style.css";

const initialNodes = [
  {
    id: "main",

    draggable: true,

    position: { x: 400, y: 50 },

    data: {
      label: "main",
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

const initialEdges = [
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

const compareCommitData = {
  "main-develop": {

    onlyInTarget: [
      "aaa111 Fix login",
      "bbb222 Update pipeline",
      "ccc333 Improve UI",
    ],

    onlyInBase: [
      "ghi789 Merge release",
    ],
  },


  "main-release": {

    onlyInTarget: [
      "ddd444 Release v1.2",
      "eee555 Update changelog",
    ],

    onlyInBase: [],
  },


  "develop-hotfix": {

    onlyInTarget: [
      "fff666 Fix production bug",
    ],

    onlyInBase: [
      "ccc333 Improve UI",
    ],
  },
};

const compareFileData = {
  "main-develop": [
    {
      file: "src/App.tsx",
      added: 35,
      removed: 4,
    },

    {
      file: "README.md",
      added: 12,
      removed: 1,
    },
  ],


  "main-release": [
    {
      file: "package.json",
      added: 2,
      removed: 0,
    },
  ],


  "develop-hotfix": [
    {
      file: "src/auth.ts",
      added: 5,
      removed: 8,
    },
  ],
};

const mergePreviewData = {
  "main-develop": {
    status: "Ready to merge",

    checks: [
      "Pipeline passed",
      "No conflicts",
      "Review approved",
    ],
  },


  "main-release": {
    status: "Waiting",

    checks: [
      "Pipeline running",
      "Review pending",
    ],
  },


  "develop-hotfix": {
    status: "Needs attention",

    checks: [
      "Pipeline failed",
      "Conflict detected",
    ],
  },
};

const STORAGE_KEY = "flowresta-layout";

const GITHUB_TOKEN =
  import.meta.env.VITE_GITHUB_TOKEN;

const githubFetch = (url: string) => {

  return fetch(url, {

    headers: {

      Authorization:
        `Bearer ${GITHUB_TOKEN}`,

    },

  });

};

function App() {

  const savedLayout =
    localStorage.getItem(STORAGE_KEY);

  const [nodes, setNodes, onNodesChange] =
    useNodesState(
      savedLayout
        ? JSON.parse(savedLayout)
        : initialNodes
    );

  const [
    edges,
    setEdges,
    onEdgesChange,
  ] = useEdgesState(initialEdges);

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

  const [repoBranches, setRepoBranches] =
    useState<any[]>([]);

  const [branchCommitDetails, setBranchCommitDetails] =
    useState<any>(null);

  const [branchCommits, setBranchCommits] =
    useState<any[]>([]);

  const [currentRepo, setCurrentRepo] =
    useState("");

  const [defaultRepoBranch, setDefaultRepoBranch] =
    useState("");

  const [realCompare, setRealCompare] =
    useState<any>(null);

  const [toolbarTooltip, setToolbarTooltip] =
  useState("");

  const [originalRepoNodes, setOriginalRepoNodes] =
    useState<any[]>([]);

  const [originalRepoEdges, setOriginalRepoEdges] =
    useState<any[]>([]);

  const [
    toolbarTooltipPosition,
    setToolbarTooltipPosition,
  ] = useState({
    x: 0,
    y: 0,
  });

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


    if (originalRepoNodes.length > 0) {

      setNodes(originalRepoNodes);

      setEdges(originalRepoEdges);

    }


    setSelectedBranch("Nenhuma");


    setTimeout(() => {

      reactFlowInstance?.fitView({
        padding: 0.2,
        duration: 800,
      });

    }, 100);

  };
  
  const importRepository = async () => {

    console.log("🌱 START IMPORT");

    if (!repositoryUrl.trim()) {
      return;
    }


    const repo =
      repositoryUrl
        .replace("https://github.com/", "")
        .replace(/\/$/, "");

      console.log(
        "🌳 REPO:",
        repo
      );

    const repoResponse =
      await githubFetch(
        `https://api.github.com/repos/${repo}`
      );


    const repoInfo =
      await repoResponse.json();

    console.log(
      "📦 REPO INFO:",
      repoInfo
    );


    const defaultBranch =
      repoInfo.default_branch;
      setDefaultRepoBranch(defaultBranch);

    const response =
      await githubFetch(
        `https://api.github.com/repos/${repo}/branches`
      );


const branches =
  await response.json();

  console.log(
    "🌿 BRANCH RESPONSE:",
    branches
  );

if (!Array.isArray(branches)) {

  console.error(
    "GitHub branches error:",
    branches
  );

  return;

}


console.log(branches);


setRepoBranches(branches);


const sortedBranches =
  [
    ...branches.filter(
      (branch) =>
        branch.name === defaultBranch
    ),

    ...branches.filter(
      (branch) =>
        branch.name !== defaultBranch
    ),
  ];


const visibleBranches =
  sortedBranches.slice(0, 20);

const githubNodes =
  visibleBranches.map((branch, index) => ({

    id: branch.name,

    draggable: true,

    position: {
      x:
        index === 0
          ? 500
          : 150 + (index % 5) * 200,

      y:
        index === 0
          ? 50
          : 200 + Math.floor(index / 5) * 120,
    },

    data: {
      label:
        branch.protected
          ? `${branch.name}`
          : branch.name,
    },

    style: {
      background: "#161b22",

      border: branch.protected
        ? "2px solid #8b949e"
        : "1px solid #30363d",

      color: branch.protected
        ? "#8b949e"
        : "#c9d1d9",

      borderRadius: "10px",

      padding: "8px",

      fontFamily:
        "JetBrains Mono, monospace",
    },

  }));


setNodes(githubNodes);

setOriginalRepoNodes(githubNodes);

const findParentBranch = (branchName: string) => {

  if (
    branchName.startsWith("feature") &&
    githubNodes.some(
      (node) => node.id === "develop"
    )
  ) {
    return "develop";
  }


  if (
    branchName.startsWith("hotfix") ||
    branchName.startsWith("release")
  ) {
    return defaultBranch;
  }


  return defaultBranch;

};


const githubEdges =
  githubNodes

    .filter(
      node =>
        node.id !== defaultBranch
    )

    .map((node) => ({

      id:
        `${defaultBranch}-${node.id}`,

      source:
        defaultBranch,

      target:
        node.id,

      data: {
        health: "Scanning...",
      },

      style: {

        stroke: "#8b949e",

        strokeWidth: 3,

      },

    }));


setEdges(githubEdges);


setOriginalRepoEdges(githubEdges);

console.log(
  "🌳 FLOWRESTA READY",
  githubNodes,
  githubEdges
);

setRepositoryLoaded(true);

githubEdges.forEach(async (edge) => {

  const health =
    await scanBranchHealth(
      repo,
      defaultBranch,
      edge.target
    );


  setEdges((currentEdges) =>

    currentEdges.map((current) => {

      if (current.id !== edge.id) {

        return current;

      }


      return {

        ...current,


        data: {

          ...current.data,


          health:
            health.status,

          ahead:
            health.ahead,

          behind:
            health.behind,

        },


        style: {

          ...current.style,


          stroke:
            health.color,

        },

      };


    })

  );


});

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
    repoBranches.find(
      branch =>
        branch.name === selectedBranch
    );

  const hoveredDetails =
    repoBranches.find(
      branch =>
        branch.name === hoveredBranch
    );

  const compareKey =
    `${compareBranchA}-${compareBranchB}`;

  const compareDetails =
    compareData[
      compareKey as keyof typeof compareData
    ];

  const compareCommits =
    compareCommitData[
      compareKey as keyof typeof compareCommitData
    ];  

  const compareFiles =
    compareFileData[
      compareKey as keyof typeof compareFileData
    ];

  const mergePreview = {

    status:
      realCompare?.behind_by > 10
        ? "Needs update"
        : "Ready to merge",

    checks: [
      "Compare analyzed",
      "No conflicts detected",
      `${realCompare?.files?.length ?? 0} files changed`,
    ],

  };

  const loadBranchCommitDetails = async (
    sha: string
  ) => {

    const response =
      await githubFetch(
        `https://api.github.com/repos/${currentRepo}/commits/${sha}`
      );


    const data =
      await response.json();


    setBranchCommitDetails(data);

  };

  const loadBranchCommits = async (
    branchName: string
  ) => {

    const response =
      await githubFetch(
        `https://api.github.com/repos/${currentRepo}/commits?sha=${branchName}`
      );


    const data =
      await response.json();


    setBranchCommits(data);

  };

  const loadRealCompare = async (
    base: string,
    head: string
  ) => {

    const response =
      await githubFetch(
        `https://api.github.com/repos/${currentRepo}/compare/${base}...${head}`
      );


    const data =
      await response.json();


    console.log(
      "COMPARE REAL",
      data
    );


    setRealCompare(data);

  };

  const scanBranchHealth = async (
    repo: string,
    baseBranch: string,
    branchName: string
  ) => {

    try {

      const response =
        await githubFetch(
          `https://api.github.com/repos/${repo}/compare/${baseBranch}...${branchName}`
        );


      if (!response.ok) {

        return {
          color: "#8b949e",
          status: "Normal",
          ahead: 0,
          behind: 0,
        };

      }


      const data =
        await response.json();


      // 🟢 pronto para merge
      if (
        data.ahead_by > 0 &&
        data.behind_by === 0
      ) {

        return {

          color: "#3fb950",

          status:
            "Merge OK",

          ahead:
            data.ahead_by,

          behind:
            data.behind_by,

        };

      }


      // 🟡 possível merge mas precisa atualizar
      if (
        data.ahead_by > 0 &&
        data.behind_by > 0
      ) {

        return {

          color: "#d29922",

          status:
            "Merge Possible",

          ahead:
            data.ahead_by,

            behind:
              data.behind_by,

        };

      }


    // ⚪ branch sem ação
      return {

        color: "#8b949e",

        status:
          "Normal",

        ahead:
          data.ahead_by,

        behind:
          data.behind_by,

      };


    } catch {

      return {

        color: "#8b949e",

        status: "Normal",

        ahead: 0,

        behind: 0,

      };

    }

  };

  const showToolbarTooltip = (
    event: React.MouseEvent,
    text: string
  ) => {

    setToolbarTooltip(text);

    setToolbarTooltipPosition({
      x: event.clientX,
      y: event.clientY,
    });

  };

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

      <h1
        style={{
          fontFamily: "Inter, sans-serif",
          fontSize: "42px",
          fontWeight: 800,
          letterSpacing: "-2px",
          margin: 0,
          lineHeight: "1.2",
        }}
      >
        <span
          style={{
            background:
              "linear-gradient(90deg, #7ee787, #56d4c8)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Flow
        </span>

        <span
          style={{
            color: "#8b949e",

            fontWeight: 300,

            letterSpacing: "-1px",
          }}
        >
          resta
        </span>
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

          alignItems: "center",

          width: "100%",

          gap: "30px",
        }}
      >


        <div
          onClick={() => {
            setRepositoryLoaded(false);
            setRepositoryUrl("");
          }}

          style={{
            display: "flex",

            flexDirection: "column",

            alignItems: "center",

            cursor: "pointer",

            width: "160px",
          }}
        >


          <img
            src={flowrestaLogo}

            style={{
              width: "50px",
            }}
          />


          <h1
            style={{
              fontFamily: "Inter, sans-serif",

              fontSize: "28px",

              fontWeight: 800,

              margin: 0,

              lineHeight: "1.2",
            }}
          >

            <span
              style={{
                background:
                  "linear-gradient(90deg,#7ee787,#56d4c8)",

                WebkitBackgroundClip: "text",

                WebkitTextFillColor:
                  "transparent",
              }}
            >
              Flow
            </span>


            <span
              style={{
                color: "#8b949e",

                fontWeight: 300,

                letterSpacing: "-1px",
              }}
            >
              resta
            </span>

          </h1>
              

        </div>


        <span
          style={{
            maxWidth: "600px",

            overflow: "hidden",

            textOverflow: "ellipsis",

            whiteSpace: "nowrap",

            color: "#8b949e",

            fontFamily:
              "JetBrains Mono, monospace",

            fontSize: "15px",

            marginTop: "4px",
          }}
        >

          {repositoryName}

        </span>




        <div
          style={{
            display: "flex",
            gap: "12px",
            alignItems: "center",
            color: "#8b949e",
            fontFamily: "JetBrains Mono, monospace",
            marginLeft: "auto",
          }}
        >

          <span
            onMouseEnter={(event) =>
              showToolbarTooltip(
                event,
                "Normal"
              )
            }     
            
            onMouseLeave={() =>
              setToolbarTooltip("")
            }    
            style={{
              color: "#8b949e",
              fontSize: "20px",
            }}
          >
            ◉{summary.normal}
          </span>

          <span
            onMouseEnter={(event) =>
              showToolbarTooltip(
                event,
                "Merge Ok"
              )
            }     
            
            onMouseLeave={() =>
              setToolbarTooltip("")
            }            
            
            style={{
              color: "#3fb950",
              fontSize: "20px",
            }}
          >
            ◉{summary.ok}
          </span>

          <span
            onMouseEnter={(event) =>
              showToolbarTooltip(
                event,
                "Merge possible"
              )
            }     
            
            onMouseLeave={() =>
              setToolbarTooltip("")
            }             
            
            style={{
              color: "#d29922",
              fontSize: "20px",
            }}
          >
            ◉{summary.mr}
          </span>

          <span
            onMouseEnter={(event) =>
              showToolbarTooltip(
                event,
                "Merge conflict"
              )
            }     
            
            onMouseLeave={() =>
              setToolbarTooltip("")
            }         
            style={{
              color: "#f85149",
              fontSize: "20px",
            }}
          >
            ◉{summary.conflict}
          </span>

         <button
            onMouseEnter={(event) =>
              showToolbarTooltip(
                event,
                "Reset Layout"
              )
            }     
            
            onMouseLeave={() =>
              setToolbarTooltip("")
            }    

            onClick={resetLayout}
            
            style={{
              background: "#161b22",
              color: "#8b949e",
              border: "1px solid #30363d",
              borderRadius: "8px",
              padding: "6px 16px",
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
          
            onMouseEnter={(event) =>
              showToolbarTooltip(
                event,
                "Compare branches"
              )
            }

            onMouseLeave={() =>
              setToolbarTooltip("")
            }


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

          onEdgesChange={onEdgesChange}

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


              const branch =
                repoBranches.find(
                  branch =>
                    branch.name === node.id
                );


              if (branch) {

                loadBranchCommitDetails(
                  branch.commit.sha
                );

              }

              loadBranchCommits(node.id);

              return;
            }

            if (!compareBranchA) {
              setCompareBranchA(node.id);
              return;
            }

            if (!compareBranchB) {

              setCompareBranchB(node.id);

              loadRealCompare(
                compareBranchA,
                node.id
              );

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
          <Controls
            showInteractive={false}
          />
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

                overflowY: "auto",

                overflowX: "hidden",

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

              <div
                style={{
                  border: "1px solid #30363d",
                  borderRadius: "10px",
                  padding: "12px",
                }}
              >

                <p>
                  ✦ {compareBranchA}
                </p>

                <p
                  style={{
                    color: "#a371f7",
                    textAlign: "center",
                  }}
                >
                  ↕
                </p>

                <p>
                  ✦ {compareBranchB}
                </p>

              </div>

              <p
                style={{
                  color: "#8b949e",

                  textAlign: "center",

                  marginTop: "15px",
                }}
              >
                {compareBranchB} vs {compareBranchA}
              </p>

              <hr />

              <h4
                style={{
                  color: "#a371f7",
                }}
              >
                Changes
              </h4>

              <p>
                ↟ {compareBranchB} ahead
              </p>

              <strong>
                {realCompare?.ahead_by ?? 0} commits
              </strong>


              <p
                style={{
                  marginTop: "15px",
                }}
              >
                ↡ {compareBranchB} behind
              </p>

              <strong>
                {realCompare?.behind_by ?? 0} commits
              </strong>

              <h4
                style={{
                  color: "#a371f7",
                  marginTop: "25px",
                }}
              >
                Commits in {compareBranchB}
              </h4>


              <div
                style={{
                  border: "1px solid #30363d",

                  borderRadius: "10px",

                  padding: "12px",

                  background: "#0d1117",

                  fontSize: "13px",

                  height: "220px",

                  minHeight: "220px",

                  flexShrink: 0,

                  overflowY: "auto",

                  overflowX: "hidden",

                  paddingRight: "8px",

                }}
              >

                {realCompare?.commits?.map((commit) => (

                  <p
                    key={commit.sha}

                    style={{

                      color: "#8b949e",

                      textAlign: "left",

                      lineHeight: "1.5",

                      wordBreak: "break-word",

                    }}
                  >

                    <>
                      -{" "}

                      <span
                        style={{
                          color:"#c9d1d9",
                        }}
                      >

                        {commit.sha.substring(0,7)}

                      </span>


                      {" "}


                      {
                        commit.commit.message
                          .split("\n")[0]
                      }

                    </>

                  </p>

                ))}

              </div>


              <h4
                style={{
                  color: "#a371f7",
                  marginTop: "25px",
                }}
              >
                Files Changed
              </h4>


              <div
                style={{
                  border: "1px solid #30363d",

                  borderRadius: "10px",

                  padding: "12px",

                  background: "#0d1117",

                  height: "220px",

                  minHeight: "220px",

                  flexShrink: 0,

                  overflowY: "auto",

                  overflowX: "hidden",
                }}
              >

                {realCompare?.files?.map((file) => (

                  <div
                    key={file.filename}

                    style={{
                      marginBottom: "15px",
                    }}
                  >

                    <p
                      style={{
                        color: "#c9d1d9",

                        wordBreak: "break-all",

                        overflowWrap: "anywhere",

                        lineHeight: "1.5",
                      }}
                    >

                      {file.filename}

                    </p>


                    <span
                      style={{
                       color: "#8b949e",
                      }}
                    >

                      +{file.additions}

                      {" "}

                      -{file.deletions}

                    </span>

                  </div>

                ))}


              </div>

              <h4
                style={{
                  color: "#a371f7",
                  marginTop: "25px",
                }}
              >
                Merge Preview
              </h4>


              <div
                style={{
                  border: "1px solid #30363d",

                  borderRadius: "10px",

                  padding: "12px",

                  background: "#0d1117",
                }}
              >


                <p>
                  Status
                </p>


                <strong>
                  {mergePreview?.status}
                </strong>


                <hr />


                {mergePreview?.checks.map((check) => (

                  <p
                    key={check}

                    style={{
                      color: "#8b949e",
                    }}
                  >

                    <span
                      style={{
                        color: "#58a6ff",
                      }}
                    >
                      ✓
                    </span>

                    {" "}

                    {check}

                  </p>

                ))}


              </div>

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
        <strong>SHA:</strong>{" "}
        {details.commit.sha.substring(0, 7)}
      </p>

      <p>
        <strong>Author:</strong>{" "}

        {
          branchCommitDetails
            ?.commit
            ?.author
            ?.name
        }
      </p>


      <p>
        <strong>Date:</strong>{" "}

        {
          branchCommitDetails
            ?.commit
            ?.author
            ?.date
            ?.substring(0,10)
        }
      </p>


      <p>
        <strong>Status:</strong>{" "}

        {details.protected
          ? "Protected"
          : "Open"}
      </p>


      <p>
        <strong>Branch:</strong>{" "}
        {details.name}
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

    <div
      style={{
        maxHeight: "260px",

        overflowY: "auto",

        paddingRight: "8px",
      }}
    >

    {selectedBranch !== "Nenhuma" ? (

      branchCommits.map((commit) => (

        <p
          key={commit.sha}

          style={{
            color: "#8b949e",
            
            lineHeight: "1.5",
          }}
        >

          - {" "}

          <span
            style={{
              color: "#c9d1d9",
          }}
        >
          {commit.sha.substring(0,7)}
        </span>

          {" "}

          {commit.commit.message.split("\n")[0]}

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

</div>
    
    {toolbarTooltip && (

      <div
        style={{
          position: "fixed",

          left:
            toolbarTooltipPosition.x + 15,

          top:
            toolbarTooltipPosition.y + 15,

          background: "#161b22",

          border: "1px solid #30363d",

          borderRadius: "10px",

          padding: "10px",

          color: "#c9d1d9",

          fontFamily:
            "JetBrains Mono, monospace",

          fontSize: "12px",

          zIndex: 9999,
        }}
      >

        {toolbarTooltip}

      </div>

    )}

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
          {hoveredBranch}
        </strong>

        <p>
         SHA:
         {hoveredDetails.commit.sha.substring(0,7)}
        </p>

      </div>
    )}


    </div>

  );
}


export default App;