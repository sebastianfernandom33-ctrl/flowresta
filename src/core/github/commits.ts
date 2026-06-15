export async function getCommit(
 repo:string,
 sha:string
){

console.log(
 "𓆧 COMMIT CALL:",
 sha
);

 const response =
  await fetch(
   `https://api.github.com/repos/${repo}/commits/${sha}`
  );


 if(
  !response.ok
 ){

  console.warn(
   "𓆧 Commit sleeping",
   sha
  );


  return null;

 }


 try{


  return await response.json();


 }catch{


  return null;


 }


}



export async function getBranchCommits(
 repo:string,
 branch:string
){


 const response =
  await fetch(
   `https://api.github.com/repos/${repo}/commits?sha=${branch}&per_page=20`
  );


 if(
  !response.ok
 ){

  console.warn(
   "𓆧 Branch history sleeping",
   response.status
  );


  return [];

 }


 try{


  return await response.json();


 }catch{


  return [];


 }


}
