import {
 useState
} from "react";


import {
 manual
} from "./manualData";


function ManualOverlay({
 onClose,
 openTutorial
}:any){


 const [
  selected,
  setSelected
 ] =
 useState("tutorial");


 const current =
  manual[selected];


 const cyan =
  "#56d4c8";


 const buttonStyle = {

  background:
   "#161b22",

  color:
   cyan,

  border:
   `1px solid ${cyan}`,

  borderRadius:
   "10px",

  padding:
   "10px 18px",

  cursor:
   "pointer",

  fontFamily:
   "JetBrains Mono, monospace",

  boxShadow:
   "0 0 12px #56d4c866"

 };


 return(

<div

style={{

 position:"fixed",

 inset:0,

 zIndex:9999,

 background:
  "#0d1117dd",

 display:"flex",

 justifyContent:"center",

 alignItems:"center"

}}

>


<div

style={{

 width:"850px",

 height:"600px",

 background:
  "#161b22",

 border:
  "1px solid #238636",

 borderRadius:
  "18px",

 display:"flex",

 overflow:"hidden",

 boxShadow:
  "0 0 35px #23863666",

 position:"relative"

}}

>


<button

onClick={
 onClose
}

style={{

 position:"absolute",

 right:"18px",

 top:"18px",

 width:"42px",

 height:"42px",

 background:
  "#161b22",

 color:
  "#7ee787",

 border:
  "1px solid #238636",

 borderRadius:
  "10px",

 cursor:"pointer",

 fontSize:"22px",

 zIndex:5

}}

>

×

</button>


{/* LEFT MENU */}

<div

style={{

 width:"22%",

 borderRight:
  "1px solid #30363d",

 padding:
  "20px",

 boxSizing:
  "border-box",

 fontFamily:
  "JetBrains Mono, monospace"

}}

>


<h3

style={{

 color:"#7ee787",

 marginTop:0

}}

>

𓆧 Guide

</h3>


{
Object.entries(
 manual
)
.map(
 ([key,item]:any)=>(


<button

key={key}

onClick={()=>{

 setSelected(
  key
 );

}}

style={{

 width:"100%",

 marginBottom:"10px",

 textAlign:"left",

 background:

 selected === key

 ?
 "#56d4c822"

 :
 "transparent",


 color:

 selected === key

 ?
 cyan

 :
 "#8b949e",


 border:

 selected === key

 ?
 `1px solid ${cyan}`

 :
 "1px solid transparent",


 borderRadius:"8px",

 padding:"8px",

 cursor:"pointer",

 fontFamily:
  "JetBrains Mono, monospace"

}}

>

{
 item.title
}

</button>


))

}


</div>


{/* CONTENT */}

<div

style={{

 flex:1,

 padding:
  "28px 40px",

 color:"#c9d1d9",

 fontFamily:
  "JetBrains Mono, monospace",

 overflowY:"auto"

}}

>


<h2

style={{

 color:"#7ee787",

 fontSize:"26px",

 marginBottom:"20px"

}}

>

{
 current.title
}

</h2>


{
current.image && (

<img

src={
 current.image
}

style={{

 width:"400px",

 maxHeight:"300px",

 objectFit:"contain",

 display:"block",

 margin:
  "0 auto 18px",

 filter:
  "drop-shadow(0 0 18px #23863688)"

}}

/>

)
}


<pre

style={{

 whiteSpace:
  "pre-wrap",

 lineHeight:
  "1.40",

 color:
  "#8b949e",

 fontSize:
  "12px",

 letterSpacing:
  "0px",

  marginBottom:"14px",

 fontFamily:
  "JetBrains Mono, monospace"

}}

>

{
 current.content
}

</pre>


{
current.action && (

<button

style={
 buttonStyle
}

onClick={()=>{


 if(
  selected === "tree"
 ){

  openTutorial(
   "ancient"
  );


  return;

 }


 openTutorial(
  "simple"
 );


}}

>

{
 current.action
}

</button>

)

}


</div>


</div>


</div>


 );


}


export default ManualOverlay;
