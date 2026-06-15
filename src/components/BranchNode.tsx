import {
  Handle,
  Position
} from "reactflow";


export default function BranchNode({
  data
}) {

  

const expanded =
  Boolean(data.label);

const invisibleHandle = {

  opacity: 0,

};

const seasonStyle =
 data.seasonStyle || {

  node:"#161b22",
  leaf:"#7ee787",
  border:"#30363d"

 };

const isMain =
  data.isRoot;


const seed = "𖠽";

const leaf = "𖥸";


let topGlyph =
  data.hasTopConnection
    ? isMain
      ? seed
      : leaf
    : null;


let bottomGlyph =
  data.hasBottomConnection
    ? isMain
      ? seed
      : leaf
    : null;


let leftGlyph =
  data.hasLeftConnection
    ? isMain
      ? seed
      : leaf
    : null;


let rightGlyph =
  data.hasRightConnection
    ? isMain
      ? seed
      : leaf
    : null;



const showTopSymbol =
  Boolean(topGlyph);


const showBottomSymbol =
  Boolean(bottomGlyph);

const showLeftSymbol =
  Boolean(leftGlyph);


const showRightSymbol =
  Boolean(rightGlyph);

  return (

    <div

      style={{

        position:"relative",

        width:
          expanded
            ? "160px"
            : "38px",

        height:
          expanded
            ? "auto"
            : "38px",

        boxSizing:"border-box",

        maxWidth:
          expanded
            ? "180px"
            : "38px",

        minHeight:
          expanded
            ? "45px"
            : "38px",

        display:"flex",

        alignItems:"center",

        justifyContent:"center",

        textAlign:"center",

        wordBreak:"break-word",

        overflowWrap:"anywhere",

        background:
          `linear-gradient ${seasonStyle.node}`,

        border:
          `1px solid ${seasonStyle.border}`,

        boxShadow:
          "insert 0 0 20px #123c2d55",

        borderRadius:"10px",

        padding:
          expanded
            ? "12px 20px"
            : "0px",

        color:"#c9d1d9",

        transition:
          "all 0.35s cubic-bezier(0.34,1.56,0.64,1)",

       }}

    >


      {/* ⚙️ React Flow connectors invisíveis */}
      <Handle

        id="top"

        type="source"

        position={Position.Top}

        style={invisibleHandle}

      />


      <Handle

        id="top-target"

        type="target"

        position={Position.Top}

        style={invisibleHandle}

      />



      {/* 🌿 entrada */}
        {showTopSymbol && (

          <div
            style={{

              position:"absolute",

              top:"-24px",

              left:"50%",

              transform:
                topGlyph === seed
                  ? "translateX(-50%)"
                  : "translateX(-50%) rotate(180deg)",

              color:seasonStyle.leaf,

              textShadow:
                "0 0 10px #56d4c8",

              fontSize:"40px",

              zIndex:20,

            }}
          >

            {topGlyph}

          </div>

        )}

<div
  style={{
    maxWidth:"160px",
    fontFamily:
      "JetBrains Mono, monospace",
    fontSize:"14px",
  }}
>

  {data.label}

</div>

        {showLeftSymbol && (

          <div
            style={{
              position:"absolute",
              left:"-22px",
              top:"50%",
              transform:
                leftGlyph === seed
                  ? "translateY(-50%)"
                  : "translateY(-50%) rotate(90deg)",

              color:seasonStyle.leaf,

              textShadow:
                "0 0 10px #56d4c8",

              fontSize:"40px",
            }}
          >

            {leftGlyph}

          </div>

        )}



        {showRightSymbol && (

          <div
            style={{
              position:"absolute",
              right:"-22px",
              top:"50%",
              transform:
                rightGlyph === seed
                  ? "translateY(-50%)"
                  : "translateY(-50%) rotate(-90deg)",

              color:seasonStyle.leaf,

              textShadow:
                "0 0 10px #56d4c8",

              fontSize:"40px",
            }}
          >

            {rightGlyph}

          </div>

        )}

      {/* 🌱 saída */}
        {showBottomSymbol && (

          <div
            style={{

              position:"absolute",

              bottom:"-24px",

              left:"50%",

              transform:
                "translateX(-50%)",

              color:seasonStyle.leaf,

              textShadow:
                "0 0 10px #56d4c8",

              fontSize:"40px",

              zIndex:20,

            }}
          >

            {bottomGlyph}

          </div>

        )}

      <Handle

        id="top-source"

        type="source"

        position={Position.Top}

        style={invisibleHandle}

      />


      <Handle

        id="bottom-target"

        type="target"

        position={Position.Bottom}

        style={invisibleHandle}

      />


      <Handle

        id="top-target"

        type="target"

        position={Position.Top}

        style={invisibleHandle}

      />


      <Handle

        id="bottom-source"

        type="source"

        position={Position.Bottom}

        style={invisibleHandle}

      />

            {/* ☘️ CLOVER esquerda recebe */}
      <Handle

        id="left-target"

        type="target"

        position={Position.Left}

        style={invisibleHandle}

      />


      {/* ☘️ CLOVER direita cresce */}
      <Handle

        id="right-source"

        type="source"

        position={Position.Right}

        style={invisibleHandle}

      />

      <Handle

        id="left-source"

        type="source"

        position={Position.Left}

        style={invisibleHandle}

      />


      <Handle

        id="right-target"

        type="target"

        position={Position.Right}

        style={invisibleHandle}

      />


    </div>

  );

}