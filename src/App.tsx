import {
 getRepository
} from "./core/github/repository";

import {
 getBranches
} from "./core/github/branches";

import {
 getCommit,
 getBranchCommits
} from "./core/github/commits";

import {
 compareBranches
} from "./core/github/compare";

import TutorialOverlay
  from "./assets/components/Tutorial/TutorialOverlay";

import ManualOverlay
 from "./assets/components/Manual/ManualOverlay";

import forestBg from "./assets/flowresta-bg.png";
import {
  useState,
  useEffect,
  useRef
} from "react";
import type React from "react";
import flowrestaLogo from "./assets/flowresta-logo.png";
import BranchNode from "./components/BranchNode";
import Druid from "./components/Druid";
import ReactFlow, {
  Background,
  Controls,
  useNodesState,
  useEdgesState,
  Position,
} from "reactflow";

import "reactflow/dist/style.css";

const initialNodes = [
  {
    id: "main",

    type: "branch",

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

    type: "branch",

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

    type: "branch",

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

    type: "branch",

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

const nodeTypes = {
 branch: BranchNode
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

const MAX_TREE_BRANCHES = 50;

const MAX_CLAN_BRANCHES = 50;

const STORAGE_KEY = "flowresta-layout";

// 🌱 evita quemar la API de GitHub
async function processGardenBatch(
  items:any[],
  size:number,
  worker:any
){

  const results:any[] = [];


  for(
    let i = 0;
    i < items.length;
    i += size
  ){

    const batch =
      items.slice(
        i,
        i + size
      );


    const batchResult =
      await Promise.all(
        batch.map(worker)
      );


    results.push(
      ...batchResult
    );


  }


  return results;

}

function analyzeGarden(
  nodes,
  edges
) {

  const branchCount =
    nodes.length;

  const childrenMap = {};


  edges.forEach(edge => {

    if (
      !childrenMap[
        edge.source
      ]
    ) {

      childrenMap[
        edge.source
      ] = [];

    }


    childrenMap[
      edge.source
    ].push(
      edge.target
    );

  }
);

  const childGroups =
    Object.values(
      childrenMap
    );

  const maxChildren =
    Math.max(
      ...childGroups.map(
        (children:any)=>
        children.length
      ), 
      0
    );

  const averageChildren =
    childGroups.length
      ?
      childGroups.reduce(
        (sum:any,list:any)=>
          sum + list.length,
        0
      )
      /
      childGroups.length
      :
      0;
  


  // ☘️ muitos filhos do mesmo pai
  if (maxChildren >= 15) {

    return {
      mode:"clover",
      message:
       "✤ Clover recommended"
    };

  }


  // 🌿 repo grande espalhado
  if (
    branchCount > 40 &&
    averageChildren < 6
  ) {

    return {
      mode:"paripinnate",
      message:
       "𖠺 Paripinnate recommended"
    };

  }


// 🌱 floresta simples
// qualquer forma de vida cresce bem

  return {
    mode:null,
    message:null
  };

}

function analyzeForestLife(branches) {


  if(
    branches.length === 0
  ){

    return null;

  }


  const dates =
 branches

 .filter(
  branch =>
   branch.lastLifeSignal
 )

 .map(
  branch =>
   new Date(
    branch.lastLifeSignal
   ).getTime()
 );

 if(
 dates.length === 0
){

 return null;

}


  const oldest =
    Math.min(
      ...dates
    );


  const newest =
    Math.max(
      ...dates
    );


  const ageInDays =
    Math.floor(
      (
        newest -
        oldest
      )
      /
      (
        1000 *
        60 *
        60 *
        24
      )
    );


  const oldestYear =
 new Date(oldest)
  .getFullYear();


const newestYear =
 new Date()
  .getFullYear();


return {


 branches:
  branches.length,


 ageInDays,


oldest:
 new Date(
  branches[0].lastLifeSignal
 )
 .getFullYear(),


 newest:
  newestYear,



ancient:

 branches.length > 50
 ||
 ageInDays > 120


  };


}

function createBranchClans(
 branches:any[],
 defaultBranch:string
){

 const groups:any = {};


 branches.forEach(branch=>{


  if(
   branch.name === defaultBranch
  ){

   return;

  }


  const baseName =
   branch.name.includes("/")
    ? branch.name.split("/")[0]
    : "others";


  if(
   !groups[baseName]
  ){

   groups[baseName] = [];

  }


  groups[baseName].push(
   branch
  );


 });


 const clans:any[] = [];


 Object.keys(groups)
  .forEach(name=>{


   const group =
    groups[name];


   for(
    let i = 0;
    i < group.length;
    i += MAX_CLAN_BRANCHES
   ){


    const slice =
     group.slice(
      i,
      i + MAX_CLAN_BRANCHES
     );


    const clanNumber =
     Math.floor(
      i / MAX_CLAN_BRANCHES
    ) + 1;


    clans.push({

     name:

      group.length > MAX_CLAN_BRANCHES

       ?

       `𖠻 ${name} #${clanNumber}`

       :

       `𖠻 ${name}`,


     type:

      "clan",


     branches:

      slice,


     count:

      slice.length


    });


   }


  });


 return clans;


}

function App() {

  const [
    previousForest,
    setPreviousForest
    ] =
    useState<any>(null);

  const [nodes, setNodes, onNodesChange] =
    useNodesState(initialNodes);

  const [
    edges,
    setEdges,
    onEdgesChange,
  ] = useEdgesState(initialEdges);

  const [isGrowing, setIsGrowing] =
    useState(false);

  const [
    openingPortal,
    setOpeningPortal
    ] =
    useState(false);

  const [
    activeTutorial,
    setActiveTutorial
    ] =
    useState<any>(null);

  useEffect(()=>{


    if(
      !localStorage.getItem(
      "flowresta-import-tutorial"
      )
    ){

      setActiveTutorial(
      "import"
      );

    }


    },[]);

  const [
    queuedTutorial,
    setQueuedTutorial
    ] =
    useState<any>(null);

  const [
    showManual,
    setShowManual
    ] =
    useState(false);

  const [layoutPulse, setLayoutPulse] =
    useState("");

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

  const [
    forestBranches,
    setForestBranches
  ] =
  useState<any[]>([]);

  const [lifePeriod,setLifePeriod] =
  useState({
   from:2014,
   to:2026
  });

  const lifePeriodRef =
    useRef(lifePeriod);

  useEffect(()=>{

  lifePeriodRef.current =
    lifePeriod;

  },[lifePeriod]);

  const [branchCommitDetails, setBranchCommitDetails] =
    useState<any>(null);

  const [branchCommits, setBranchCommits] =
    useState<any[]>([]);

  const [currentRepo, setCurrentRepo] =
    useState("");

  const [showBranchNames, setShowBranchNames] =
    useState(false);

  const [defaultRepoBranch, setDefaultRepoBranch] =
    useState("");

  const [realCompare, setRealCompare] =
    useState<any>(null);

  const [toolbarTooltip, setToolbarTooltip] =
  useState("");

  const [showGardenPanel, setShowGardenPanel] =
    useState(false);

  const [layoutMode, setLayoutMode] =
    useState("crown");

  const [
    gardenSeason,
     setGardenSeason
    ] =
    useState<
     "summer" |
     "spring" |
     "autumn" |
     "winter"
    >(
     "summer"
    );


    const [
     showSeasonPanel,
     setShowSeasonPanel
    ] =
    useState(false);

  const [
    selectedClan,
    setSelectedClan
  ] =
  useState<any>(null);

  const [
    hoveredTreeBranch,
    setHoveredTreeBranch
    ] =
    useState("");

  const [
    activeSidePanel,
    setActiveSidePanel
    ] =
    useState<
    "clan" |
    "compare" |
    null
    >(null);

  const [
    previousSidePanel,
    setPreviousSidePanel
    ] =
    useState<any>(null);

  const [druidMessages, setDruidMessages] =
    useState<any[]>([]);

  const [
    growingTick,
    setGrowingTick
  ] =
  useState(0);

  useEffect(()=>{

 if(!isGrowing){
  return;
 }


 const timer =
  setInterval(()=>{

   setGrowingTick(
    current =>
     (current + 1) % 4
   );

  },400);


 return ()=>{

  clearInterval(timer);

 };


},[isGrowing]);

  const [druidVisible, setDruidVisible] =
    useState(false);

  const [elderDruid, setElderDruid] =
    useState(false);

  const [druidMode, setDruidMode] =
    useState<
      "message" | "guide"
    >("message");

  

const summonDruid = (
 text:string,
 type = "normal",
 persistent = false,
 actions:any[] = []
) => {


 setDruidMode(
  "message"
 );


 setDruidMessages(
  current => {


   // 🧙 evita eco na floresta
   const alreadyExists =
    current.some(
     msg =>
      msg.text === text
    );


   if(
    alreadyExists
   ){

    return current;

   }



   // 🌳 recomendações:
   // só existe uma viva
   if(
    type ===
    "recommendation"
   ){


    return [

     ...current.filter(
      msg =>
       msg.type !==
       "recommendation"
     ),


     {
      text,
      type,
      persistent,
      actions
     }

    ];


   }



   return [

    ...current,


    {
     text,
     type,
     persistent,
     actions
    }

   ];


  }

 );


 setDruidVisible(true);


};

const dismissDruidMessage = () => {

  if(
    druidMode === "guide"
  ){

    return;

  }

  setDruidMessages(
    current => {


      return current.slice(1);


    }
  );


};

const guideDruid = (
  text:string
) => {


  setDruidMode(
    "guide"
  );


  setDruidMessages([
    {
      text
    }
  ]);


  setDruidVisible(
    true
  );


};

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


 if(
  !reactFlowInstance
 ){
  return;
 }


 const timer =
  setTimeout(()=>{


   requestAnimationFrame(()=>{

    window.dispatchEvent(
      new Event("resize")
    );

    reactFlowInstance.fitView({

     padding:0.45,
     duration:0,


    });

    setTimeout(()=>{

      reactFlowInstance.fitView({

        padding:

          activeSidePanel ||
          (
          compareMode &&
          compareBranchA &&
          compareBranchB
          )

          ? 0.45
          : 0.25,

          duration:700,


        });


      },50);

    });


  },500);



 return ()=>{

  clearTimeout(timer);

 };


},[

 activeSidePanel,
 compareMode,
 compareBranchA,
 compareBranchB,
 nodes.length,
 reactFlowInstance

]);

  const applyLayout = (
    mode: string,
    layoutEdges = edges,
    layoutNodes = nodes
  ) => {

    setLayoutPulse(mode);


    setTimeout(() => {

      setLayoutPulse("");

    }, 300);

    setLayoutMode(mode);

// 🌱 limpa memória visual sem matar estrutura
const workingEdges =
  [
    ...layoutEdges
  ];

const currentNodes =
  layoutNodes.map(
    node => ({

      ...node,

      position:{
        x:0,
        y:0,
      },

      sourcePosition:
        undefined,

      targetPosition:
        undefined,

    })
  );

// 🌳 encontra irmãos reais da branch
const siblingsOf = (nodeId) => {


  const parentEdge =
    workingEdges.find(
      edge =>
        edge.target === nodeId
    );


  // main/root
  if (!parentEdge) {

    return [nodeId];

  }


  return currentNodes
    .filter(
      possibleSibling =>
        workingEdges.some(
          edge =>
            edge.source === parentEdge.source &&
            edge.target === possibleSibling.id
        )
    );

};


// 🌿 filhos diretos
const childrenOf =
  (id) => {

    return currentNodes.filter(
      n =>
        workingEdges.some(
          e =>
            e.source === id &&
            e.target === n.id
        )
    );

  };


// 🌲 encontra caminho principal seguro
const findMainPath = (
  id:string,
  path:string[] = [],
  visited = new Set<string>()
):string[] => {


  if(
    visited.has(id)
  ){

    return path;

  }


  visited.add(id);


  const children =
    childrenOf(id)
      .filter(
        child =>
          !visited.has(child.id)
      );


  if(
    children.length === 0
  ){

    return [
      ...path,
      id
    ];

  }


  return children

    .map(child =>
      findMainPath(
        child.id,
        [
          ...path,
          id
        ],
        new Set(visited)
      )
    )

    .sort(
      (a,b)=>
        b.length -
        a.length
    )[0];


};

// 🌱 raiz visual Flowresta

const rootNode =

  currentNodes.find(
    n =>
      n.id === defaultRepoBranch
  )

  ||

  currentNodes.find(
    n =>
      [
        "main",
        "master",
        "develop",
        "dev"
      ].includes(
        n.id.toLowerCase()
      )
  )

  ||

  currentNodes[0];

// 🌲 encontra o tronco real
// caminho mais longo da árvore

// 🌳 se main não tem filhos,
// usa o galho mais forte como continuação



let mainPath =
 rootNode
 ? findMainPath(
    rootNode.id
   )
 : [];


// 🌳 árvore sem tronco real
// cria tronco visual artificial
if(
 mainPath.length <= 1
){

 const strongestBranch =
  currentNodes.find(
   node =>
    node.id !== rootNode?.id
  );


 if(strongestBranch){

  mainPath = [
   rootNode.id,
   strongestBranch.id
  ];

 }

}

const visualRoot =
  rootNode?.id;


currentNodes.forEach(
 node => {


  if(
   node.id === visualRoot
  ){

   return;

  }


  const hasParent =
   workingEdges.some(
    edge =>
     edge.target === node.id
   );


  if(
   !hasParent &&
   visualRoot
  ){

   workingEdges.push({

    id:
     `${visualRoot}->${node.id}`,

    source:
     visualRoot,

    target:
     node.id,

    artificial:true,

   });

  }


 }
);

const nextNodes =
  currentNodes.map((node) => {


    const generation =
      calculateGeneration(
        node.id,
        workingEdges,
        visualRoot
      );


    const sameGeneration =
      currentNodes.filter(
        other =>
          calculateGeneration(
            other.id,
            workingEdges,
            visualRoot
          ) === generation
      );


    const index =
      sameGeneration.findIndex(
        other =>
          other.id === node.id
      );


    const center =
      (sameGeneration.length - 1) / 2;


// 🌳 CROWN - copa de árbol Flowresta
if (mode === "crown") {


 const siblings =
 currentNodes.filter(
  other =>
   calculateGeneration(
    other.id,
    workingEdges,
    visualRoot
   ) === generation
 );


 const siblingIndex =
  siblings.findIndex(
   s => s.id === node.id
  );


 const center =
  (siblings.length - 1) / 2;


 const isTrunk =
  mainPath.includes(
   node.id
  );


 const canopyLevel =
  Math.abs(
   siblingIndex -
   center
  );


 const spread =
  170;


 return {


  ...node,


  // 🌱 savia sube
  sourcePosition:
   Position.Top,


  targetPosition:
   Position.Bottom,


  position:{


   x:
    (
     siblingIndex -
     center
    )
    *
    spread,


   y:


    // 🌱 raíz abajo
    generation === 0
     ? 400


    // 🌳 tronco sube
    : isTrunk
     ? 250 -
       generation * 150


    // 🌿 copa abre arriba
     :
       -250 -
       generation * 100
       +
       canopyLevel * 60


  },


 };


}


// 🌱 ROOTS
if (mode === "roots") {


  const siblings =
    siblingsOf(
      node.id
    );


  const siblingIndex =
    siblings.findIndex(
      s =>
        s.id === node.id
    );


  const center =
    (siblings.length - 1) / 2;


  const isTrunk =
    mainPath.includes(
      node.id
    );


  const canopyLevel =
    Math.abs(
      siblingIndex -
      center
    );


  const spread =
    170;


  return {


    ...node,


    sourcePosition:
      Position.Bottom,


    targetPosition:
      Position.Top,


    position:{


      x:

        (
          siblingIndex -
          center
        )
        *
        spread,


      y:


        // 🌱 main fica em cima
        generation === 0
          ? -600


        // 🌳 tronco desce
        : isTrunk
          ? -400 +
            generation * 150


        // 🌿 raízes abrem embaixo
          :
            220 +
            generation * 110
            -
            canopyLevel * 70,


    },


  };


}



    // ☘️ CLOVER MULTI RING
if(
 mode === "clover"
){


 const nodesPerRing =
  24;


 const ring =
  Math.floor(
   index /
   nodesPerRing
  );


 const indexInRing =
  index %
  nodesPerRing;


 const totalInRing =
  Math.min(
   nodesPerRing,
   sameGeneration.length -
   ring * nodesPerRing
  );


 const angle =
  (
   indexInRing /
   totalInRing
  )
  *
  Math.PI *
  2;


 const radius =
  220 +
  ring * 260 +
  generation * 80;


 return {

  ...node,


  position:{

   x:
    Math.cos(angle)
    *
    radius,


   y:
    Math.sin(angle)
    *
    radius,

  },


 };


}



    // 🌿 PARIPINNATE
if (mode === "paripinnate") {


  const branchChildren =
    (id) =>
      currentNodes.filter(
        n =>
          workingEdges.some(
            e =>
              e.source === id &&
              e.target === n.id
          )
      );


  const root =
    rootNode?.id;

  const trunk =
    root
      ? [root]
      : [];


  const positions = {};


  // 🌿 cria uma nervura
  const growStem = (
    id,
    startX,
    startY,
    direction = 1,
    depth = 0
  ) => {


    const children =
      branchChildren(id);


    children.forEach(
      (child,index)=>{


        const side =
          index % 2 === 0
            ? -1
            : 1;

        const spacing =
          children.length > 50
            ? 90
            : children.length > 20
              ? 130
              : children.length > 10
              ? 170
              : 240;

        const column =
         index % 25;


        const layer =
         Math.floor(
          index / 25
        );


        const x =
         startX +
         column *
         spacing;


        let y =
         startY +
         side *
         direction *
         (
         170 +
         depth * 80
         )
         +
         layer * 500;


        positions[child.id] = {
          x,
          y
        };


        const grandChildren =
          branchChildren(
            child.id
          );


        // 🌱 filho simples
        if(
          grandChildren.length <= 1
        ){

          growStem(
            child.id,
            x,
            y,
            direction,
            depth + 1
          );

        }


        // 🌿 filho virou ramo próprio
        else {


          const miniOffset =
            260;

          growStem(
            child.id,

            x + miniOffset,

            y,

            side,

            depth + 1


          );


        }


      }
    );


  };


  // 🌱 MAIN
  trunk.forEach(
    (id,index)=>{

      positions[id]={
        x:index * 220,
        y:0
      };
    }
  );


  if(root){
    
    growStem(
      root,
      0,
      0
    );

  }

  return {


    ...node,


    sourcePosition:
      Position.Right,


    targetPosition:
      Position.Left,


    position:

      positions[node.id]
        ??
        {

          x:
            index * 160,

          y:
            index % 2 === 0
              ? -220
              : 220
        }


  };


}


        return node;


      });


    setNodes(nextNodes);


    setEdges(() => {


    return workingEdges.map(edge => {


        let sourceHandle;

        let targetHandle;


        if(mode === "paripinnate"){


         sourceHandle =
          "right-source";


         targetHandle =
          "left-target";


        }


        // 🌳 copa hacia arriba
        else if(mode === "crown"){


         sourceHandle =
          "top-source";


         targetHandle =
          "bottom-target";


        }


        // 🌱 raíces hacia abajo
        else if(mode === "roots"){


         sourceHandle =
          "bottom-source";


         targetHandle =
          "top-target";


        }


        // ☘️ radial
        else if(mode === "clover"){


          
          const sourceNode =
            nextNodes.find(
              n => n.id === edge.source
            );

          const targetNode =
            nextNodes.find(
              n => n.id === edge.target
            );

          if(
            !sourceNode ||
            !targetNode
          ){

            return edge;

          }

            
          const dx =
            targetNode.position.x -
            sourceNode.position.x;

          const dy =
            targetNode.position.y -
            sourceNode.position.y;

          if(
            Math.abs(dx) >
            Math.abs(dy)
          ){

            // horizontal

            if(dx > 0){

              sourceHandle =
                "right-source";

              targetHandle =
                "left-target";
                
            }else{

              sourceHandle =
                "left-source";

              targetHandle =
                "right-target";

            }

          }else{

           // vertical

            if(dy > 0){

              sourceHandle =
                "bottom-source";

              targetHandle =
                "top-target";
                
            }else{

              sourceHandle =
                "top-source";

              targetHandle =
                "bottom-target";

            }

            
          }



        }


        return {


          ...edge,


          sourceHandle,

          targetHandle,


          animated:false,


          className:
            "life-flow",


          type:
            "simplebezier",


          style:{


            ...edge.style,

            strokeWidth:3,


            strokeLinecap:
              "round",


          },


        };


      });


    });
        

    setTimeout(() => {

      requestAnimationFrame(()=>{

      const forestSize =
        nextNodes.length;

      reactFlowInstance?.fitView({

        padding:
          forestSize > 50
           ? 0.65
           : forestSize > 20
            ? 0.45
            : 0.25,

        duration: 1200,

      });

      });

    },900);


  };



const growClanTree = async () => {


 if(
  !selectedClan
 ){

  return;

 }

 setOpeningPortal(true);

 setDruidMessages([]);

 const clanBranches =
  selectedClan.data.branches;


 const rootBranch = {

  name:
   selectedClan.id,

  protected:true,

  type:"clanRoot",

 };


 const forest = [

  rootBranch,

  ...clanBranches

 ];


 await loadForest(

  forest,

  currentRepo,

  rootBranch.name

 );


 setSelectedClan(
  null
 );


 setActiveSidePanel(
  null
 );


 summonDruid(

  `𓆧 ${clanBranches.length} branches awakened`,

  "normal"

 );

 setTimeout(()=>{

  setOpeningPortal(false);

 },300);

};


const loadForest = async (
  branchesToGrow:any[],
  repo:string,
  defaultBranch:string
) => {

const sortedBranches =
  [
    ...branchesToGrow.filter(
      (branch) =>
        branch.name === defaultBranch
    ),

    ...branchesToGrow.filter(
      (branch) =>
        branch.name !== defaultBranch
    ),
  ];


const visibleBranches =
  sortedBranches;

const githubNodes =
  visibleBranches.map((branch, index) => ({

    type: "branch",

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

      branch.type === "clan"

       ?

       `${branch.name} (${branch.count})`

       :

       branch.name,


     isClan:

      branch.type === "clan",


     branches:

      branch.branches,


    },

    style: {
      background: "#161b22",

      border:

       branch.type === "clan"

       ?

       "2px solid #7ee787"

       :

       branch.protected

       ?

       "2px solid #8b949e"

       :

       "1px solid #30363d",

      color:

       branch.type === "clan"

       ?

       "#7ee787"

       :

       branch.protected

       ?

       "#8b949e"

       :

       "#8b949e",

      borderRadius: "10px",

      padding: "8px",

      fontFamily:
        "JetBrains Mono, monospace",
    },

  }));




const githubEdgesWithNull =
  await Promise.all(

    githubNodes

      .filter(
        node =>
          node.id !== defaultBranch
      )

      .map(async (node) => {

        if(
 node.data.isClan
){

 return {

  id:
   `${defaultBranch}->${node.id}`,

  source:
   defaultBranch,

  target:
   node.id,


  style:{

   stroke:"#238636",

   strokeWidth:3,

  }

 };

}

        const parent =
          await findBranchParent(

            repo,
            node.id,
            branchesToGrow,
            defaultBranch

          );


        if (!parent) {

          return null;

        }


        return {

          id:
            `${parent}->${node.id}`,

          source:
            parent,

          target:
            node.id,


          data: {

            health:
              "Scanning...",

            parent,

          },


          style: {

            stroke:
              "#8b949e",

            strokeWidth:
              3,

          },


        };


      })


  );

const rawEdges =
  githubEdgesWithNull.filter(
    (edge): edge is any =>
      Boolean(edge)
  );


const childAlreadyHasParent =
  new Set();


const githubEdges =
  rawEdges.filter(edge=>{


  if(
    childAlreadyHasParent.has(
      edge.target
    )
  ){

    return false;

  }


  childAlreadyHasParent.add(
    edge.target
  );


  return true;


});

console.log(
 "🌳 FAMILY TREE",
 githubEdges.map(
  edge => ({
   parent:edge.source,
   child:edge.target
  })
 )
);

const githubNodesWithHandles =
  githubNodes.map((node) => ({

    ...node,


    data: {

      ...node.data,


      hasParent:
        githubEdges.some(
          edge =>
            edge.target === node.id
        ),


      hasChildren:
        githubEdges.some(
          edge =>
            edge.source === node.id
        ),

    },

  }));



setEdges(githubEdges);


setNodes(
  githubNodesWithHandles
);

const garden =
  analyzeGarden(
    githubNodesWithHandles,
    githubEdges
  );

if(
 garden.mode
){

 setTimeout(()=>{


  summonDruid(

   garden.message,

   "recommendation",

   false,

   [

    {

     label:
      `𖧧Grow`,

     action:()=>{


 setNodes(currentNodes=>{


  setEdges(currentEdges=>{


   applyLayout(
    garden.mode,
    currentEdges,
    currentNodes
   );


   return currentEdges;


  });


  return currentNodes;


 });


 setDruidMessages([]);


}

    }

   ]

  );


 },2500);


}


// 𓆧 Druida observa antes de falar
setTimeout(() => {


  if(
    garden.mode !== "crown"
  ){


    if(garden.message){
      
      summonDruid(
        garden.message,
        "recommendation"
      );

    }

  }


},10000);



setTimeout(() => {

  applyLayout(
    "crown",
    githubEdges,
    githubNodesWithHandles
  );

}, 300);

console.log(
  "🌳 FLOWRESTA READY",
  githubNodes,
  githubEdges
);

setRepositoryLoaded(true);

const hasTreeGroups =
 githubNodesWithHandles.some(
  node =>
   node.data?.isClan
 );

setRepositoryLoaded(true);

setTimeout(()=>{


 const needSimple =
  !localStorage.getItem(
   "flowresta-simple-tutorial"
  );


 const needAncient =
  hasTreeGroups &&
  !localStorage.getItem(
   "flowresta-ancient-tutorial"
  );



 if(
  needSimple
 ){

  setActiveTutorial(
   "simple"
  );

  if(
  needAncient
 ){

  setQueuedTutorial(
   "ancient"
  );

 }

  return;

 }



 if(
  needAncient
 ){

  setActiveTutorial(
   "ancient"
  );

 }


},1500);

processGardenBatch(

 githubEdges.filter(
  edge => {

    const target =
    githubNodesWithHandles.find(
      node =>
      node.id === edge.target
    );


    return (
    !target?.data?.isClan
    );

  }
  ),

 5,

 async(edge)=>{


  const health =
    await scanBranchHealth(
      repo,
      defaultBranch,
      edge.target
    );


  setEdges(
    currentEdges =>

      currentEdges.map(
        current => {


          if(
            current.id !== edge.id
          ){

            return current;

          }


          return {


            ...current,


            data:{

              ...current.data,

              health:
                health.status,

              ahead:
                health.ahead,

              behind:
                health.behind,

            },


            style:{

              ...current.style,

              stroke:
                health.color,

            },


          };


        }
      )

  );


 }

);

};


  const importRepository = async () => {

    setPreviousForest(null);

    setSelectedClan(null);

    setActiveSidePanel(null);

    setToolbarTooltip("");

    setIsGrowing(true);

    try {

    console.log("🌱 START IMPORT");


    if (!repositoryUrl.trim()) {
      return;
    }


    const repo =
      repositoryUrl
        .replace("https://github.com/", "")
        .replace(/\/$/, "")
        .split("/")
        .slice(0,2)
        .join("/");;

    setCurrentRepo(repo);

    console.log(
      "🌳 REPO:",
      repo
    );


    const repoInfo =
      await getRepository(repo);



    console.log(
      "📦 REPO INFO:",
      repoInfo
    );


    const defaultBranch =
      repoInfo.default_branch;


    setDefaultRepoBranch(
      defaultBranch
    );

const branches =
  await getBranches(
    repo
  );

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

const repoBirthYear =
 new Date(
  repoInfo.created_at
 )
 .getFullYear();


const currentYear =
 new Date()
 .getFullYear();


const branchesWithLife =
 branches.map(
  (branch,index) => {


   const year =
    repoBirthYear +
    (
     index %
     (
      currentYear -
      repoBirthYear +
      1
     )
    );


   return {

    ...branch,


    lastLifeSignal:
     `${year}-01-01T00:00:00Z`,


    lifeKnown:true


   };


  }

 );

setForestBranches(
  branchesWithLife
);


console.log(
  "𓆧 LIFE SCANNER:",
  branchesWithLife.map(
    b=>({
      name:b.name,
      life:b.lastLifeSignal
    })
  )
);


console.log(
 "🌳 FINAL LIFE BEFORE ELDER",
 branchesWithLife.slice(0,5)
);

const livingBranches =
 branchesWithLife.filter(
  branch =>
   branch.lastLifeSignal !== null
 );

setForestBranches(
  livingBranches
);


const forestLife =
  analyzeForestLife(
    livingBranches
  );

console.log(
  "𓆧 FOREST AGE:",
  forestLife
);

if(
 forestLife
){

 setLifePeriod({

  from:
   forestLife.oldest - 1,

  to:
   forestLife.newest

 });

}

if(
  livingBranches.length >
  MAX_TREE_BRANCHES
){

    console.log(
      "🧙 ENTER ELDER MODE"
    );
  

  setTimeout(() => {

      console.log(
        "🧙 SUMMONING ELDER"
      );

  setElderDruid(true);

  setTimeout(() => {


  summonDruid(

`
𖣂 Ancient tree detected with ${forestLife?.branches} branches

Ancient Tree Life: ${forestLife?.oldest} ↔︎ ${forestLife?.newest}

Choose how you want to enter this forest
`,

    "elder",

    true,

    [

      {

        label:
          "𖣂 Ancient tree",

        action:async()=>{

          setElderDruid(false);

          setDruidMessages([]);

          const rootBranch =
 livingBranches.find(
  branch =>
   branch.name === defaultBranch
 );


const clans =
 createBranchClans(
  livingBranches,
  defaultBranch
 );


const forestToLoad =

 livingBranches.length > MAX_TREE_BRANCHES &&
 rootBranch

 ?

 [
  rootBranch,
  ...clans
 ]

 :

 livingBranches;


          await loadForest(
           forestToLoad,
           repo,
           defaultBranch
          );

          setIsGrowing(false);

        }

      },

      

      {

        label:
          "⚭ Grow period",

        action:async()=>{

          const filtered =
            livingBranches.filter(
              branch => {

                const year =
                  new Date(
                    branch.lastLifeSignal
                  )
                  .getFullYear();


                return (
                  year >= lifePeriodRef.current.from &&
                  year <= lifePeriodRef.current.to
                );

              }

            );

        if(
          filtered.length === 0
         ){

          summonDruid(
            "𓆧 No branches lived in this period"
          );

          setIsGrowing(false);

          return;

        }

        setElderDruid(false);

        setDruidVisible(false);

        setDruidMessages([]);

        let rootBranch =
 livingBranches.find(
  branch =>
   branch.name === defaultBranch
 );


if(
 !rootBranch
){

 rootBranch = {
  name: defaultBranch,
  protected:true,
  artificial:true
 };

}


const forestToLoad =

 filtered.length > MAX_TREE_BRANCHES

 ?

 [
  rootBranch,

  ...createBranchClans(
   filtered,
   defaultBranch
  )

 ]

 :

 [
    rootBranch,

    ...filtered.filter(
      branch =>
        branch.name !== defaultBranch
    )
 ];




await loadForest(
 forestToLoad,
 repo,
 defaultBranch
);

        setIsGrowing(false);

      }

    }

    ]

  );    

},100);

},3000);

return;

}



await loadForest(
  livingBranches,
  repo,
  defaultBranch
);

setIsGrowing(false);


  } catch (error) {

    console.error(
      "Flowresta import error",
      error
    );
   

    setIsGrowing(false);

  }

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
 sha:string
) => {

 const data =
  await getCommit(
   currentRepo,
   sha
  );


 setBranchCommitDetails(
  data
 );

};


  const loadBranchCommits = async (
 branchName:string
)=>{

 const data =
  await getBranchCommits(
   currentRepo,
   branchName
  );


 setBranchCommits(data);

};

  const loadRealCompare = async (
    base: string,
    head: string
  ) => {

  const response =
 await compareBranches(
  currentRepo,
  base,
  head
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
        await compareBranches(
          repo,
          baseBranch,
          branchName
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



      // 🔴 branch muito divergente
if(
 data.ahead_by > 20 &&
 data.behind_by > 20
){

 return {

  color:
   "#f85149",

  status:
   "Conflict risk",

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

  const calculateGeneration = (
    branchName: string,
    edges: any[],
    defaultBranch: string,
    visited = new Set<string>()
  ): number => {


  // 🌳 raiz
    if (
      branchName === defaultBranch
    ) {

      return 0;

    }


  // 🐉 detector Targaryen
    if (
      visited.has(branchName)
    ) {

      console.warn(
        "🐉 Cycle detected:",
        branchName
      );

      return 1;

    }


    visited.add(branchName);


    const parentEdge =
      edges.find(
        edge =>
          edge.target === branchName
      );


  // órfão vira filho da raiz
    if (!parentEdge) {

      return 1;

    }


    return (
      calculateGeneration(
        parentEdge.source,
        edges,
        defaultBranch,
        visited
      ) + 1
    );


  };

  const findBranchParent = async (
 repo: string,
 branchName: string,
 branches: any[],
 defaultBranch: string
) => {


 // 🌳 raiz nunca tem pai
 if(
  branchName === defaultBranch
 ){

  return null;

 }


 let bestParent = null;

 let bestScore = -1;

 // 🧠 candidatos prováveis de DNA
const parentCandidates =
 branches.filter(
  candidate => {


   if(
    candidate.name === branchName
   ){

    return false;

   }


   return (

    [
     defaultBranch,
     "main",
     "master",
     "develop",
     "dev",
     "release",
     "staging"
    ].includes(
     candidate.name
    )


    ||

    branchName.startsWith(
     candidate.name
    )


    ||

    candidate.name.split("/")[0]
    ===
    branchName.split("/")[0]


   );


  }
 );


const searchPool =
 parentCandidates.length
 ?
 parentCandidates
 :
 branches.slice(0,5);

 // 🧬 procura ancestral mais próximo
 for(
  const candidate of searchPool
 ){


  if(
   candidate.name === branchName
  ){

   continue;

  }


  try{


   const response =
    await compareBranches(
     repo,
     candidate.name,
     branchName
    );


   if(
    !response.ok
   ){

    continue;

   }


   const data =
    await response.json();


   /*
    🌱 Ideia:
    - poucos commits atrás
    - alguns commits na frente
    = nasceu daqui recentemente
   */

   const score =
    data.ahead_by -
    data.behind_by;


   if(
    score > bestScore
   ){

    bestScore =
     score;


    bestParent =
     candidate.name;

   }


  }catch(error){

   // galho silencioso 🌿

  }


 }


 // 🍃 fallback seguro
 return (
  bestParent ||
  defaultBranch
 );


};

const returnCoreTree = () => {


 if(
  !previousForest
 ){

  return;

 }


 setNodes(
  previousForest.nodes
 );


 setEdges(
  previousForest.edges
 );


 setDefaultRepoBranch(
  previousForest.defaultBranch
 );


 setPreviousForest(
  null
 );


 setSelectedClan(
  null
 );


 setActiveSidePanel(
  null
 );


 setToolbarTooltip(
  ""
 );


 // 🦗 Grilho esquece conselhos da outra dimensão
 setDruidMessages(
  current =>

   current.filter(
    msg =>
     msg.type !==
     "recommendation"
   )

 );


 summonDruid(

  "𓆧 Back in the core tree",

  "normal"

 );


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



  const styledNodes =
    nodes.map((node) => {


      const isProtected =
      repoBranches.some(
        branch =>
          branch.name === node.id &&
          branch.protected
      );


      const seasonNodeStyle = {

 summer:{
  bg:"#161b22",
  border:"#238636",
  glow:"#23863666",
  leaf:"#7ee787"
 },

 spring:{
  bg:"#22111f",
  border:"#b3608f",
  glow:"#ff79c666",
  leaf:"#ffb0e9"
 },

 autumn:{
  bg:"#24160d",
  border:"#73270d",
  glow:"#d2992266",
  leaf:"#ff9b54"
 },

 winter:{
  bg:"#0b1628",
  border:"#89abd2",
  glow:"#58a6ff66",
  leaf:"#9cdcfe"
 }

}[gardenSeason];


    return {

    ...node,

    sourcePosition:
      node.sourcePosition,

    targetPosition:
      node.targetPosition,

      ...node,
    

    data: {

      ...node.data,

      season:
        gardenSeason,

      seasonStyle:
        seasonNodeStyle,

      label:
        showBranchNames ||
        selectedBranch === node.id ||
        node.id === compareBranchA ||
        node.id === compareBranchB
          ? node.id
          : "",

      layoutMode,

      isRoot:
        node.id === defaultRepoBranch,

      hasTopConnection:
        edges.some(
          edge =>
            (
              edge.source === node.id &&
              edge.sourceHandle === "top-source"
            )
            ||
            (
              edge.target === node.id &&
              edge.targetHandle === "top-target"
            )
        ),

      hasBottomConnection:
        edges.some(
          edge =>
            (
              edge.source === node.id &&
              edge.sourceHandle === "bottom-source"
            )
            ||
            (
            edge.target === node.id &&
            edge.targetHandle === "bottom-target"
            )
        ),

      hasLeftConnection:
        edges.some(
          edge =>
            (
              edge.source === node.id &&
              edge.sourceHandle === "left-source"
            )
            ||
            (
              edge.target === node.id &&
              edge.targetHandle === "left-target"
            )
        ),

      hasRightConnection:
        edges.some(
          edge =>
            (
              edge.source === node.id &&
              edge.sourceHandle === "right-source"
            )
            ||
            (
              edge.target === node.id &&
              edge.targetHandle === "right-target"
            )
        ),

    },

    style: {

      ...node.style,

      background:
        seasonNodeStyle.bg,

      border:

  node.data?.isClan

  ?

  `2px solid ${seasonNodeStyle.leaf}`

  :

  `1px solid ${seasonNodeStyle.border}`,



 color:
  seasonNodeStyle.leaf,

      transition:
       "all 0.35s cubic-bezier(0.34,1.56,0.64,1)",

      overflow:
       "visible",

      boxShadow:

        node.id === compareBranchA
          ? "0 0 20px #a371f7"

        : node.id === compareBranchB
          ? "0 0 15px #a371f7"

        : selectedBranch === node.id
          ? `0 0 18px ${seasonNodeStyle.glow}`

        : isProtected
 ? `
 inset 0 0 0 3px ${seasonNodeStyle.border},
 0 0 18px ${seasonNodeStyle.glow}
            `

        : node.style?.boxShadow,

    },


    };
  });

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

  const gardenThemes = {

 summer:{

  background:
   "#0d1117",

  primary:
   "#0f7403",

  glow:
   "#5b7f62",

 },


 spring:{

  background:
   "#130b12",

  primary:
   "#ed4395",

  glow:
   "#d579a6",

 },


 autumn:{

  background:
   "#16110a",

  primary:
   "#9e3c0f",

  glow:
   "#8b4513",

 },


 winter:{

  background:
   "#07111f",

  primary:
   "#5a93d4",

  glow:
   "#678bc2",

 },


};


const gardenTheme =
 gardenThemes[
  gardenSeason
 ];

  const gardenButtonStyle = (
    mode:string
  ) => ({
    
    color:
      layoutPulse === mode
        ? "#ffb0e9"
        : "#8b949e",


    border:
      layoutPulse === mode
        ? "1px solid #ffb0e9"
        : "1px solid #30363d",


    boxShadow:
      layoutPulse === mode
        ? "0 0 10px #ffb0e9"
        : "none",


    transition:
      "all 0.2s ease",

    width: "55px",

    height: "55px",

    fontSize: "26px",

    background: "#161b22",

    borderRadius: "14px",

    cursor: "pointer",

  });

if (!repositoryLoaded) {

  return (

  <>

    <div
      style={{
        background:
        `
        linear-gradient(
        rgba(13,17,23,.70),
        rgba(13,17,23,.90)
        ),
        url(${forestBg})
        `,

        backgroundSize:
        "cover",

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

        placeholder="Insert Git URL..."

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

        disabled={isGrowing}

        style={{
          width:"120px",

          height:"44px",

          display:"flex",

          alignItems:"center",

          justifyContent:"center",

          background: "#238636",

          color: "white",

          border: "none",

          borderRadius: "10px",

          padding: "0px 24px",

          cursor: isGrowing
            ? "not-allowed"
            : "pointer",

          opacity: isGrowing
            ? 0.7
            : 1,

          fontFamily:
            "JetBrains Mono, monospace",
        }}
      >
        {
isGrowing
?
(
 <span
 style={{

  display:"inline-block",

  fontSize:"22px",

  transform:
   `translateY(${8 - growingTick * 3}px)
    scale(${0.6 + growingTick * 0.15})`,

  opacity:
   0.4 + growingTick * 0.2,

  transition:
   "all .35s ease"

 }}
 >

 𖧧

 </span>
)

:
"Import"
}

      </button>

      <p
        style={{
          color: "#8b949e",

          fontStyle: "italic",

          fontFamily:
            "JetBrains Mono, monospace",
        }}
      >
        𖧧 Plant your Flowresta here 𖣂
      </p>

    </div>

{
(  
  repositoryLoaded ||
  elderDruid
) && (


<Druid

 forestLoaded={
  repositoryLoaded
 }

 messages={druidMessages}

 visible={druidVisible}

 elder={elderDruid}

 forestBranches={forestBranches}

 lifePeriod={lifePeriod}

 setLifePeriod={setLifePeriod}

 onOpen={() => {

   setDruidVisible(
     current => !current
   );

 }}

 onDismiss={() =>{
   setElderDruid(false);

   setDruidMessages([]);

   setIsGrowing(false);
 
 }}

/>

)
}

{
activeTutorial && (

<TutorialOverlay

 type={
  activeTutorial
 }

 onClose={()=>{


  if(
   queuedTutorial
  ){


   const nextTutorial =
    queuedTutorial;


   setActiveTutorial(
    null
   );


   setQueuedTutorial(
    null
   );


   setTimeout(()=>{


    setActiveTutorial(
     nextTutorial
    );


   },2000);


   return;


  }


  setActiveTutorial(
   null
  );


 }}

/>

)
}

{
showManual && (

<ManualOverlay

 onClose={()=>{

  setShowManual(false);

 }}

 openTutorial={(type)=>{


  setShowManual(false);


  setActiveTutorial(
   type
  );


 }}

/>

)
}

</>

  );
}
  return (

    <div
      style={{
        background:
          gardenTheme.background,
        color: "#ffffff",
        minHeight: "100vh",
        padding: "20px",
      }}
    >
      <button

onClick={()=>{

 setShowManual(true);

}}

style={{

 position:"fixed",

 right:"35px",

 bottom:"120px",

 zIndex:1000,


 width:"46px",

 height:"46px",


 background:"#161b22",


 border:
  "1px solid #56d4c8",


 color:
  "#56d4c8",


 boxShadow:
  "0 0 15px #56d4c866",


 borderRadius:"50%",


 cursor:"pointer",


 fontSize:"25px",


 fontWeight:"bold",


 fontFamily:
  "JetBrains Mono, monospace",

  opacity:

 druidVisible
  ? 0
  : 1,


transform:

 druidVisible

 ?
 "translateY(20px) scale(0.7)"

 :
 "translateY(0px) scale(1)",


pointerEvents:

 druidVisible
 ?
 "none"
 :
 "auto",


transition:
 "all 0.35s cubic-bezier(0.34,1.56,0.64,1)",

}}

>

?

</button>

{
showManual && (

<ManualOverlay

 onClose={()=>{

  setShowManual(false);

 }}

 openTutorial={(type)=>{


  setShowManual(false);


  setActiveTutorial(
   type
  );


 }}

/>

)
}

    <div
      style={{
        width:"calc(100% - 80px)",
        boxSizing:"border-box",
        maxWidth: "1600px",
        margin: "0 auto",
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
            setCurrentRepo("");
            setRepoBranches([]);
            setForestBranches([]);
            setNodes([]);
            setEdges([]);
            setSelectedBranch("Nenhuma");
            setSelectedClan(null);
            setPreviousForest(null);
            setShowSeasonPanel(false);
            setBranchCommits([]);
            setBranchCommitDetails(null);
            setCompareMode(false);
            setRealCompare(null);
            setCompareBranchA("");
            setCompareBranchB("");
            setDruidVisible(false);
            setDruidMessages([]);
            setElderDruid(false);
            setDruidMode("message");
            setShowGardenPanel(false);
            setActiveSidePanel(null);
            setPreviousSidePanel(null);
            setShowBranchNames(false);
            setIsGrowing(false);
            setGrowingTick(0);
            setDefaultRepoBranch("");
            setLayoutMode("crown");

          }}



          style={{
            display: "flex",

            flexDirection: "column",

            alignItems: "center",

            cursor: "pointer",

            width: "140px",
          }}
        >


          <img


            className="flowresta-home"

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
            marginRight: "0px",
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
              fontSize: "15px",
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
              fontSize: "15px",
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
              fontSize: "15px",
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
              fontSize: "15px",
            }}
          >
            ◉{summary.conflict}
          </span>

          <button

            onClick={() =>
              setShowGardenPanel(
                !showGardenPanel
              )
            }

            onMouseEnter={(event) =>
              showToolbarTooltip(
                event,
                "Garden Layout"
              )
            }

            onMouseLeave={() =>
              setToolbarTooltip("")
            }


            style={{

              background:
                "#161b22",

              color:
                showGardenPanel
                  ? "#ffb0e9"
                  : "#8b949e",

              border:
                showGardenPanel
                  ? "1px solid #ffb0e9"
                  : "1px solid #30363d",

              boxShadow:
                showGardenPanel
                  ? "0 0 12px #ff7ad955"
                  : "none",


              borderRadius:
                "8px",

              padding:
                "0px 13px",

              cursor:
                "pointer",

              fontSize:
                "28px",

            }}

          >

          𓇗

          </button>

          {
          (

          <div

          style={{

          opacity:
            showGardenPanel
             ? 1
             : 0,
          
          transform:
            showGardenPanel
              ? "translateY(0px) scale(1)"
              : "translateY(-15px) scale(0.8)",

          pointerEvents:
            showGardenPanel
              ? "auto"
              : "none",

          transition:
            "all 0.25s cubic-bezier(0.34,1.56,0.64,1",

          position:"fixed",

          top:"130px",

          right:"10px",

          width:"50px",

          background:"#0d1117",

          border:"1px solid #ffb0e9",

          borderRadius:"13px",

          padding:"12px",

          display:"flex",

          alignItems:"center",

          flexDirection:"column",

          gap:"12px",

          boxShadow:"0 0 25px #ff7ad922",

          }}

          >







          
          <button

          style={gardenButtonStyle("crown")}

          onClick={() =>
          applyLayout("crown")
          }
          >
          𖣂
          </button>


          <button
            
            style={gardenButtonStyle("roots")}
            onClick={() =>
              applyLayout("roots")
            }
          >
            <span
              style={{
                display: "inline-block",
                transform: "scaleY(-1)",
              }}
            >
              𖣂

            </span>
          </button>



          <button
            style={gardenButtonStyle("clover")}
            onClick={() =>
              applyLayout("clover")
            }
          >
          ✤
          </button>


          <button
            style={gardenButtonStyle("paripinnate")}
            onClick={() =>
              applyLayout("paripinnate")
            }
          >
            <span
              style={{
                display: "inline-block",
                transform: "rotate(-90deg)",
              }}
          >  
          𖠺
            </span>
          </button>

          {/* 🌸 Seasons */}

<div

style={{

 width:"35px",

 height:"1px",

 background:"#30363d",

 margin:"6px 0"

}}

/>


<button

style={{

 ...gardenButtonStyle("season"),

 color:
  showSeasonPanel
   ? "#ffb0e9"
   : "#8b949e",

 border:
  showSeasonPanel
   ?
   "1px solid #ffb0e9"
   :
   "1px solid #30363d",

 boxShadow:
  showSeasonPanel
   ?
   "0 0 12px #ffb0e955"
   :
   "none",

  fontWeight:"bold",

  fontSize:"23px",
}}

onClick={()=>{

 setShowSeasonPanel(
  current => !current
 );

}}

>

𓆸

</button>

{

showSeasonPanel && (

<div

style={{

 position:"absolute",

 right:"80px",

 bottom:"0px",

 background:"#161b22",

 border:
  `1px solid #ffb0e9`,

 borderRadius:"14px",

 padding:"9px",

 display:"flex",

 flexDirection:"column",

 gap:"10px",


}}

>


{
[
 ["summer","𖤓"],
 ["autumn","𖧗"],
 ["winter","❄︎"],
 ["spring","❀"]

].map(([season,icon])=>(


<button

key={season}

onClick={()=>{


 setGardenSeason(
  season as any
 );


}}

style={{

 width:"40px",

 height:"40px",

 background:"#161b22",

 border:

  gardenSeason === season

  ?

  `1px solid ${gardenTheme.primary}`

  :

  "1px solid #30363d",


 borderRadius:"12px",

 cursor:"pointer",

 fontSize:"24px",

 color:

 gardenSeason === season

 ?

 gardenTheme.primary

 :

 "#8b949e",
 

}}

>

<span

style={{

 display:"inline-block",

 fontSize:"25px",

 transform:

  season === "autumn"

   ?

   "rotate(180deg)translateY(-2px)"

   :

   "none"

}}

>

{icon}

</span>

</button>


))

}


</div>

)

}


          </div>

          )
          }

          

          <button
            onClick={() => {

              const next =
                !compareMode;

              setCompareMode(next);

              if (next) {
                
                setPreviousSidePanel(
                  activeSidePanel
                );


                const hasTreeGroups =
                  nodes.some(
                    node =>
                      node.data?.isClan
                  );


                guideDruid(

                  hasTreeGroups

                  ?

                  "𓁹 Open a tree group & select source branch"

                  :

                  "𓁹 Select source branch"
                );


              }
              
              if(!next){


                setCompareBranchA("");
                setCompareBranchB("");


                setActiveSidePanel(
                  previousSidePanel
                );

                setPreviousSidePanel(
                  null
                );

                //cancela mission

                setDruidVisible(false);

                setDruidMessages([]);                

                setDruidMode(
                  "message"
                );
              }

            }}
          
            onMouseEnter={(event) =>
              showToolbarTooltip(
                event,
                "Compare Branches"
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

              boxShadow:
                compareMode
                  ? "0 0 12px #a371f777"
                  : "none",

              borderRadius: "8px",

              padding: "7px 9px",

              cursor: "pointer",

              fontFamily: "JetBrains Mono, monospace",

              fontSize: "27px",

              fontWeight: "bold",
            }}
          >
            <span
              style={{
                display: "inline-block",
                transform: "translateY(-2px)",
                lineHeight: 1,
              }}
            >
             
              
            {
              !compareMode
                ? "𓁹"
                : compareBranchA && compareBranchB
                ? "𓁿"
                : compareBranchA
                ? "𓁻"
                : "𓁹"

            }

            </span>
          </button>

          <button

            onClick={() =>
              setShowBranchNames(
              !showBranchNames
              )
            }

            onMouseEnter={(event) =>
              showToolbarTooltip(
                event,
                "Show Tags"
              )
            }

            onMouseLeave={() =>
              setToolbarTooltip("")
            }

            style={{
              background:"#161b22",

              color:
                showBranchNames
                ? "#6967ff"
                : "#8b949e",

              border:
                showBranchNames
                ? "1px solid #6967ff"
                : "1px solid #30363d",

              boxShadow:
                showBranchNames
                  ? "0 0 12px #7c7aff55"
                  : "none",


              borderRadius:"8px",

              padding:"6px 15px",

              cursor:"pointer",

              fontSize:"29px",
              
            }}
            >
            <span
              style={{
                display: "inline-block",
                transform: "translateY(-2px) translateX(-1px) rotate(-45deg)",
                lineHeight: 1,
              }}
          >

          𖤘
            </span>
          </button>

        </div>

      </div>

<Druid

 forestLoaded={true}

 messages={druidMessages}

 visible={druidVisible}

 elder={elderDruid}

 druidMode={druidMode}

 forestBranches={
   forestBranches
 }

 lifePeriod={
   lifePeriod
 }

 setLifePeriod={
   setLifePeriod
 }

 onOpen={() => {


  if(
    druidMode === "guide"
  ){

    return;
  }

  setDruidVisible(
    current => !current
  );
 }}


 onDismiss={
  dismissDruidMessage
 }

/>

      <div
        style={{

            width:"100%",

            height:"65vh",

            position:"relative",

            marginTop:"20px",

            boxSizing:"border-box",

            pointerEvents:

              openingPortal
                ? "none"
                : "auto",

  }}
      >

        {
openingPortal && (

<div

style={{

 position:"absolute",

 inset:0,

 zIndex:100,

 background:
  "#0d1117dd",

 display:"flex",

 flexDirection:"column",

 alignItems:"center",

 justifyContent:"center",

 fontFamily:
  "JetBrains Mono, monospace",

 color:"#7ee787",

 fontSize:"40px"

}}

>

<div>

࿓𖠻

</div>


<p

style={{

 fontSize:"14px",

 color:"#8b949e"

}}

>

opening tree dimension...

</p>


</div>

)
}

        {

selectedClan && (

<div

style={{

 position:"absolute",

 left:"15px",

 top:"15px",

 zIndex:20,

 width:
  activeSidePanel === "clan"
  ? "340px"
  : "0px",

 opacity:
  activeSidePanel === "clan"
   ? 1
   : 0,

 transform:
  activeSidePanel === "clan"
   ? "translateX(0px)"
   : "translateX(-50px)",

 overflow:"hidden",

 transition:
  "all 0.35s ease",

 height:"calc(65vh - 30px)",

 background:"#161b22",

 border:"1px solid #238636",

 borderRadius:"12px",

 padding:"16px",

 boxSizing:"border-box",

 fontFamily:
  "JetBrains Mono, monospace",

}}

>


<div
style={{
 display:"flex",
 alignItems:"center",
 gap:"12px"
}}
>


<button

onClick={()=>{

 setToolbarTooltip("");

 setPreviousForest({

  nodes,

  edges,

  defaultBranch:
   defaultRepoBranch

 });


 growClanTree();


}}

onMouseEnter={(event)=>
 showToolbarTooltip(
  event,
  "Grow tree"
 )
}


onMouseLeave={()=>
 setToolbarTooltip("")
}

style={{

 width:"42px",
 height:"42px",

 background:"#161b22",

 border:
  "1px solid #238636",

 color:"#7ee787",

 borderRadius:"10px",

 cursor:"pointer",

 fontSize:"24px"

}}

>

𖠻

</button>

<div
style={{

 flex:1,

 minWidth:0

}}
>


<h3

style={{

 color:"#7ee787",

 margin:0,

 overflow:"hidden",

 textOverflow:"ellipsis",

 whiteSpace:"nowrap"

}}

>

{selectedClan.id}

</h3>


<p

style={{

 color:"#8b949e",

 fontSize:"13px",

 margin:"4px 0 0"

}}

>

{
 selectedClan.data.branches.length
} branches

</p>


</div>


<button

onMouseEnter={(event)=>
 showToolbarTooltip(
   event,
   "Close panel"
 )
}

onMouseLeave={()=>
 setToolbarTooltip("")
}

onClick={()=>{

 setToolbarTooltip("");

 setActiveSidePanel(
  null
);

}}

style={{

 width:"42px",
 height:"42px",

 background:"#161b22",

 border:
  "1px solid #238636",

 color:"#7ee787",

 borderRadius:"10px",

 cursor:"pointer",

 fontSize:"22px"

}}

>

×

</button>


</div>



<div

style={{

 height:"calc(100% - 60px)",

 overflowY:"auto",

 overflowX:"hidden"

}}

>


{
selectedClan.data.branches.map(
 branch => (


<div

key={branch.name}

onMouseEnter={()=>{

 setHoveredTreeBranch(
  branch.name
 );

}}

onMouseLeave={()=>{

 setHoveredTreeBranch("");

}}

onClick={()=>{


 if(compareMode){


  if(!compareBranchA){

   setCompareBranchA(
    branch.name
   );

   guideDruid(
    "𓁻 now, Select target branch"
   );

   return;

  }


  if(!compareBranchB){

   setCompareBranchB(
    branch.name
   );


   loadRealCompare(
    compareBranchA,
    branch.name
   );


   setActiveSidePanel(
    "compare"
   );

   setDruidMessages([]);

   setDruidMode(
    "message"
   );


   return;

  }


 }


 setSelectedBranch(
  branch.name
 );


loadBranchCommitDetails(
 branch.commit.sha
);


loadBranchCommits(
 branch.name
);


}}


style={{

 padding:"8px",

 marginBottom:"6px",

 border:"1px solid #30363d",

 borderRadius:"8px",

 cursor:"pointer",

 textAlign:"left",

 wordBreak:"break-word",

 overflowWrap:"anywhere",

 background:

 selectedBranch === branch.name

 ? "#23863622"

 : hoveredTreeBranch === branch.name

 ? "#30363d66"

 : "transparent",


color:

 compareBranchA === branch.name ||
 compareBranchB === branch.name

 ? "#a371f7"

 : "#8b949e",


transition:
 "all .2s ease",

}}

>


✦ {branch.name}


</div>


))
}


</div>


</div>

)
}


        <div
          style={{

            width:"100%",

            position: "relative",

            overflow: "hidden",

            border: "1px solid #30363d",

            borderRadius: "12px",

            height: "65vh",

            boxSizing: "border-box",

            pointerEvents:

              openingPortal
                ? "none"
                : "auto",
          }}
        >
     
{

previousForest && 
!openingPortal && (

<button

onClick={()=>{

 setToolbarTooltip("");

 returnCoreTree();

}}

onMouseEnter={(event)=>
 showToolbarTooltip(
  event,
  "Back to core tree"
 )
}

onMouseLeave={()=>
 setToolbarTooltip("")
}

style={{

 position:"absolute",

 left:"15px",

 top:"15px",

 zIndex:30,


 width:"42px",

 height:"42px",


 background:
  "#161b22",


 border:
  "1px solid #238636",


 color:
  "#7ee787",


 borderRadius:
  "10px",


 cursor:
  "pointer",


 fontSize:
  "26px",


 boxShadow:
  "0 0 18px #23863655",


}}

>

⬿

</button>

)

}



        <ReactFlow

          nodeTypes={nodeTypes}

          proOptions={{
            hideAttribution: true,
          }}

          onInit={(instance)=>{


            setReactFlowInstance(
              instance
            );


            setTimeout(()=>{


              instance.fitView({

                padding:0.35,

                duration:0

              });


            },300);


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
          minZoom={0.1}
          maxZoom={2}
          fitViewOptions={{
            padding: 0.35,
          }}

          
          zoomOnScroll={false}
          nodesDraggable={true}
          onNodeClick={(_, node) => {

             if(
               node.data?.isClan
              ){

               setSelectedClan(
                node
              );

              setActiveSidePanel(
                "clan"
              );

               return;

              }

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

              setCompareBranchA(
                node.id
              );

              guideDruid(
                "𓁻 now, Select target branch"
              );

              return;
            }

            if (!compareBranchB) {

              setCompareBranchB(
                node.id
              );

              setActiveSidePanel(
                "compare"
              );

              loadRealCompare(
                compareBranchA,
                node.id
              );

              setDruidVisible(false);

              setDruidMessages([]);

              setDruidMode(
                "message"
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

      
        
        <div
          style={{
            position:"absolute",

            right:"15px",

            top:"15px",

            zIndex:20,

            bottom:"15px",

            width:
              compareMode &&
              compareBranchA &&
              compareBranchB
                ? "340px"
                : activeSidePanel === "clan"
                ? "340px"
                : "0px",

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
                : "translateX(50px)",

            overflow: "hidden",

            transition: "all 0.35s ease",
          }}

        >

            <div
              style={{
                width: "100%",

                boxSizing: "border-box",

                wordBreak:"break-word",

                overflowWrap:"anywhere",

                height: "100%",

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

                padding:"0px",

                background: "#161b22",

                color: "#c9d1d9",

                fontFamily:
                  "JetBrains Mono, monospace",
              }}
            >
<div
 style={{

  height:"100%",

  overflowY:"auto",

  overflowX:"hidden",

  padding:"20px 28px 20px 20px",

  boxSizing:"border-box",

 }}
>
              <h3
                style={{
                  color: "#a371f7",
                  marginTop: 0,
                  fontSize:"17px",
                  fontFamily:
                    "JetBrains Mono, monospace",
                }}
              >
                 ⚘ Compare Branches ⚘
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
                    fontSize:"30px",
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

                  fontSize:"15px",
                }}
              >
                {compareBranchB}
                 
                  <span
                    style={{
                      color: "#c084fc",
                      fontWeight: 700,
                      margin: "0 8px",
                      fontSize:"15px",
                    }}
                  >
                    VS
                  </span>
                 
                {compareBranchA}
              </p>

              <hr />

              <h4
                style={{
                  color: "#a371f7",
                  fontSize:"15px",
                }}
              >
               ┉┉┉┉┉ Changes ┉┉┉┉┉
              </h4>

              <p
                style={{
                  marginTop: "1px",
                  fontSize:"15px",
                }}
              >
                ↥ {compareBranchB} ahead
              </p>

              <strong>
                {realCompare?.ahead_by ?? 0} commits
              </strong>


              <p
                style={{
                  marginTop: "15px",
                  fontSize:"15px",
                }}
              >
                ↧ {compareBranchB} behind
              </p>

              <strong>
                {realCompare?.behind_by ?? 0} commits
              </strong>

              <h4
                style={{
                  color: "#a371f7",
                  marginTop: "25px",
                  fontSize:"15px",
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

                  fontSize: "12px",

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
                  fontSize:"15px",
                }}
              >
               ┉┉┉┉ Files Changed ┉┉┉┉
              </h4>


              <div
                style={{
                  border: "1px solid #30363d",

                  borderRadius: "10px",

                  fontSize:"12px",

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

                        fontSize:"12px",

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
                  fontSize:"15px",
                }}
              >
               ┉┉┉┉ Merge Preview ┉┉┉┉
              </h4>


              <div
                style={{
                  border: "1px solid #30363d",

                  borderRadius: "10px",

                  fontSize:"12px",

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
      </div>
    


<div
  style={{

    width: "100%",

    marginTop: "20px",

    display: "flex",

    gap: "20px",

    boxSizing: "border-box",

    transition: "all 0.35s ease",

  }}
>

  <div
    style={{
      flex: 1,
      padding: "15px",
      border: "1px solid #30363d",
      fontSize: "13px",
      lineHeight: "1.5",
      minWidth:0,
      overflow:"hidden",
      borderRadius: "12px",
      textAlign: "left",
      color: "#c9d1d9",
      fontFamily: "JetBrains Mono, monospace",
      boxSizing: "border-box",
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
      fontSize: "13px",
      lineHeight: "1.5",
      minWidth: 0,
      overflow:"hidden",
      borderRadius: "12px",
      textAlign: "left",
      color: "#c9d1d9",
      fontFamily: "JetBrains Mono, monospace",
      boxSizing: "border-box",
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
            wordBreak:"break-word",
            overflowWrap:"anywhere",
            fontSize:"12px",
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

    {
activeTutorial && (

<TutorialOverlay

 type={
  activeTutorial
 }

 onClose={()=>{

  if(
  queuedTutorial
 ){

  setActiveTutorial(
   queuedTutorial
  );


  setQueuedTutorial(
   null
  );


  return;

 }

  setActiveTutorial(
    null
  );
 }}

/>

)
}

    </div>

  );
}



export default App;