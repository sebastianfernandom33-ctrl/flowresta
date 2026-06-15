import {
 useState,
 useEffect
} from "react";


import {
 tutorials
} from "./tutorialData";


function TutorialOverlay({
 type,
 onClose
}:{
  type:keyof typeof tutorials,
  onClose:any
}){


 const [
  index,
  setIndex
 ] =
 useState(0);


 const slides =
  tutorials[type];

  useEffect(()=>{

    setIndex(0);


  },[type]);


 const finish = () => {


  localStorage.setItem(
   `flowresta-${type}-tutorial`,
   "true"
  );


  onClose();


 };

const buttonStyle = {

 background:
  "#161b22",

 color:
  "#7ee787",

 border:
  "1px solid #238636",

 borderRadius:
  "10px",

 padding:
  "10px 22px",

 cursor:
  "pointer",

 fontFamily:
  "JetBrains Mono, monospace",

 boxShadow:
  "0 0 12px #23863655",

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

 position:"relative",

 width:"min(90vw,900px)",

 background:"#020e14",

 border:
  "1px solid #238636",

 borderRadius:"18px",

 padding:"35px",

 maxHeight:"85vh",

 display:"flex",

 flexDirection:"column",

 alignItems:"center",

 boxShadow:
  "0 0 35px #23863666"

}}

>


<button

onClick={finish}

style={{

 ...buttonStyle,

 position:"absolute",

 right:"20px",

 top:"20px",

 width:"42px",

 height:"42px",

 padding:0,

 fontSize:"22px",

}}

>

×

</button>


<img

src={
 slides[index]
}

style={{

 width:"100%",

 borderRadius:"14px",

 maxHeight:"81vh",

 objectFit:"contain",

}}

/>


<div

style={{

 width:"100%",

 display:"flex",

 justifyContent:"space-between",

 marginTop:"12px"

}}

>


<button

onClick={()=>{

 setIndex(
  index - 1
 );

}}

style={{

 ...buttonStyle,


 opacity:

  index === 0
   ? 0
   : 1,


 pointerEvents:

  index === 0
   ? "none"
   : "auto"

}}

>

Previous

</button>



<button

onClick={()=>{


 if(
  index === slides.length - 1
 ){

  finish();

  return;

 }


 setIndex(
  index + 1
 );


}}

style={
 buttonStyle
}

>

{
 index === slides.length -1
 ?
 "Finish"
 :
 "Next"
}

</button>



</div>


</div>


</div>

 );


}


export default TutorialOverlay;
