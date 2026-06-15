import {
 githubFetch
} from "./githubClient";


export async function compareBranches(
 repo:string,
 base:string,
 head:string
){

 const response =
  await githubFetch(
   `/repos/${repo}/compare/${base}...${head}`
  );


 return response;

}
