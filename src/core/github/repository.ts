import {
 githubFetch
} from "./githubClient";


export async function getRepository(
 repo:string
){

 const response =
  await githubFetch(
   `/repos/${repo}`
  );


 return response.json();

}
