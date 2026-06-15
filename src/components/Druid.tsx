import {
 Range,
 getTrackBackground
} from "react-range";
export default function Druid({
  messages,
  visible,
  onOpen,
  onDismiss,
  elder,
  lifePeriod,
  setLifePeriod,
  forestBranches,
  forestLoaded,
  druidMode,
}:any) {

  console.log(
 "🧙 DRUID RENDER",
 {
  elder,
  visible,
  messages:messages.length
 }
);



const isTalking =
  visible &&
  messages.length > 0;


const currentMessage =
  messages[0]?.text;


const actions =
  messages[0]?.actions || [];

const getBranchYear = (
 branch:any
)=>{


 const date =
  branch.lastLifeSignal &&
  branch.lastLifeSignal !== "UNKNOWN"
  ?
  branch.lastLifeSignal
  :
  branch.commit?.commit?.author?.date ??
  branch.commit?.committer?.date ??
  branch.commit?.author?.date;


 if(
  !date ||
  date === "LOADING" ||
  date === "UNKNOWN"
 ){

  return new Date()
   .getFullYear();

 }


 const year =
  new Date(
   date
  )
  .getFullYear();


 return Number.isNaN(year)
 ?
 new Date()
  .getFullYear()
 :
 year;


};

const branchYears =
 forestBranches
 ?.map(
  (branch:any) =>
   getBranchYear(
    branch
   )
 )
 .filter(
  (year:any) =>
   year !== null
 )
 ??
 [];


const minLifeYear =
 branchYears.length
 ?
 Math.min(...branchYears)
 :
 2013;


const maxLifeYear =
 branchYears.length
 ?
 Math.max(...branchYears)
 :
 new Date().getFullYear();


const safeMinLifeYear =
 minLifeYear === maxLifeYear
 ?
 minLifeYear - 1
 :
 minLifeYear;

const safeLifeFrom =
 Math.max(
  lifePeriod.from,
  safeMinLifeYear
 );


const safeLifeTo =
 Math.min(
  lifePeriod.to,
  maxLifeYear
 );

 console.log(
 "🌳 RANGE DATA",
 {
  lifePeriod,
  minLifeYear,
  maxLifeYear,
  first:
   forestBranches?.[0]
 }
);

const selectedBranches =
 forestBranches?.filter(
  (branch:any)=>{

   const year =
 getBranchYear(
  branch
 );


   return (
 year >= (
  Number.isNaN(lifePeriod.from)
   ? safeMinLifeYear
   : lifePeriod.from
 )
 &&
 year <= (
  Number.isNaN(lifePeriod.to)
   ? maxLifeYear
   : lifePeriod.to
 )
);

  }
 )
 ??
 [];

if(
  elder
){

return (

<div
onClick={()=>{
 onDismiss();
}}

style={{

position:"fixed",

inset:0,

background:
"rgba(0,0,0,0.75)",

display:"flex",

alignItems:"center",

justifyContent:"center",

zIndex:9999,

}}

>

<div
onClick={(event)=>{

 event.stopPropagation();

}}

style={{

width:"720px",

maxHeight:"90vh",

overflow:"hidden",

background:"#0d1117",

border:
"1px solid #7ee787",

borderRadius:"22px",

padding:"25px 35px",

boxShadow:
"0 0 60px #56d4c855",

textAlign:"center",

fontFamily:
"JetBrains Mono, monospace",

}}

>


<div
style={{

position:"relative",

width:"90%",

height:"clamp(300px,30vh,400px)",

margin:
"0 auto 6px",

borderRadius:
"22px",

overflow:"hidden",

}}

>


<img

src="/druid.png"

style={{

width:"100%",

height:"100%",

objectFit:"cover",

borderRadius:"22px",

}}

/>

<div

style={{

position:"absolute",

inset:0,

background:
`
radial-gradient(
circle,
transparent 45%,
#0d1117 95%
)
`,

pointerEvents:"none",

}}

/>

</div>


<div
style={{

color:"#7ee787",

whiteSpace:"pre-line",

lineHeight:"1.45",

fontSize:"15px",

marginBottom:"20px",

}}

>

{currentMessage}

</div>

{
elder &&
forestBranches?.length > 0 && (

<div
style={{
margin:"15px 0"
}}
>


<Range

min={
 safeMinLifeYear
}

max={
 maxLifeYear
}

values={[
 safeLifeFrom,
 safeLifeTo
]}

onChange={(values)=>{

setLifePeriod({

from:values[0],

to:values[1]

});

}}


renderTrack={({props,children})=>(

<div
onMouseDown={props.onMouseDown}

onTouchStart={props.onTouchStart}

 style={{
  ...props.style,

  height:"40px",

  display:"flex",

  width:"50%",

  margin:"18px auto",

 }}
>

 <div

  ref={props.ref}

  style={{
   height:"6px",

   width:"100%",

   borderRadius:"10px",

    background:

 getTrackBackground({

values:[
 safeLifeFrom,
 safeLifeTo
],


  colors:[

   "#30363d",

   "#56d4c8",

   "#30363d"

  ],


  min:
   safeMinLifeYear,


  max:
   maxLifeYear
   

 }),


 alignSelf:"center",

 boxShadow:
  "0 0 12px #56d4c855",

}}

>

{children}

</div>


</div>

)}


renderThumb={({props})=>{

const {key,...rest}=props;


return (

<div

key={key}

{...rest}

style={{

...rest.style,


height:"24px",

width:"24px",

transform:
`${rest.style?.transform ?? ""} translateY(-1px)`,


borderRadius:"50%",


background:"#7ee787",


boxShadow:
"0 0 20px #56d4c8",


outline:"none",

}}

/>

);

}}

/>

<p
style={{
color:"#7ee787",
fontSize:"15px",
}}
>

Period: {
 Number.isNaN(lifePeriod.from)
 ?
 safeMinLifeYear
 :
 lifePeriod.from
}
   ⚯   
{
 Number.isNaN(lifePeriod.to)
 ?
 maxLifeYear
 :
 lifePeriod.to
}

</p>

<p
style={{
 fontSize:"15px",
 color:
 selectedBranches.length
  ? "#56d4c8"
  : "#f85149"
}}
>

{selectedBranches.length}  branches alive

</p>

</div>

)
}




<div
style={{

display:"flex",

justifyContent:"center",

gap:"15px",

}}

>

{
actions.map(
(action:any,index:number)=>(


<button

key={index}

onClick={()=>{

action.action();

}}

style={{

background:"#102820",

border:
"1px solid #7ee787",

borderRadius:"12px",

padding:
"12px 18px",

color:"#7ee787",

cursor:"pointer",

fontFamily:
"JetBrains Mono, monospace",

}}

>

{action.label}

</button>


))
}

</div>


</div>


</div>

);

}

if(
 forestLoaded === false
){

 return null;

}

return (

<div
style={{

position:"fixed",
right:"35px",
bottom:"35px",
zIndex:100,

display:"flex",
alignItems:"flex-end",
gap:"12px",

}}
>


<div

onClick={onDismiss}

style={{

transform:
isTalking
? "scale(1)"
: "scale(0.8)",

opacity:
isTalking
? 1
: 0,


transition:
"all .35s cubic-bezier(0.34,1.56,0.64,1)",


pointerEvents:
isTalking
? "auto"
: "none",


background:"#161b22",

border:
"1px solid #7ee787",

borderRadius:"16px",

padding:"12px 16px",

color:"#7ee787",

fontFamily:
"JetBrains Mono, monospace",

fontSize:"13px",

boxShadow:
"0 0 20px #56d4c855",

cursor:"pointer",

}}

>

{currentMessage}

</div>

{
isTalking &&
actions.map(
(action:any,index:number)=>(

<button

key={index}

onClick={(event)=>{

event.stopPropagation();

action.action();

}}

style={{

marginTop:"10px",

background:
"rgba(86,212,200,0.12)",

border:
"1px solid #56d4c8",

borderRadius:"999px",

color:"#56d4c8",

padding:"7px 6px",

cursor:"pointer",

fontFamily:
"JetBrains Mono, monospace",

fontSize:"12px",

boxShadow:
"0 0 15px #56d4c855",

transition:
"all .25s ease",

}}

>

{action.label}

</button>

))
}

<div

onClick={onOpen}

style={{

position:"relative",

width:"55px",
height:"55px",

borderRadius:"50%",

background:"#102820",

border:
"1px solid #7ee787",

display:"flex",

alignItems:"center",

justifyContent:"center",

fontSize:
isTalking
? "32px"
: "28px",

color:"#7ee787",

cursor:"pointer",

transition:
"all .3s ease",

boxShadow:
isTalking
? "0 0 20px #7ee787"
: "0 0 15px #56d4c855",

}}

>

{
isTalking
? "𓆧"
: "𖧧"
}


{
!visible &&
messages.length > 0 && 
druidMode !== "guide" && (

<div

style={{

color:"#10272f",

position:"absolute",

top:"-5px",

right:"-5px",

background:"#5afedb",

borderRadius:"50%",

width:"18px",

height:"18px",

fontSize:"11px",

display:"flex",

alignItems:"center",

justifyContent:"center",

}}

>

{messages.length}

</div>

)
}


</div>


</div>

);

}