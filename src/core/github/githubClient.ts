const GITHUB_TOKEN =
 import.meta.env.VITE_GITHUB_TOKEN;


export async function githubFetch(
 url:string
){

 const headers:any = {};


 if(
  GITHUB_TOKEN
 ){

  headers.Authorization =
   `Bearer ${GITHUB_TOKEN}`;

 }


 return fetch(
  `https://api.github.com${url}`,
  {
   headers
  }
 );

}
