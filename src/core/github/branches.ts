export async function getBranches(
 repo:string
){

 let page = 1;

 const allBranches:any[] = [];


 while(true){


  const response =
   await fetch(

    `https://api.github.com/repos/${repo}/branches?per_page=100&page=${page}`,

    {

     headers:{

      Accept:
       "application/vnd.github+json",

      Authorization:
       `Bearer ${import.meta.env.VITE_GITHUB_TOKEN}`

     }

    }

   );


  if(
   !response.ok
  ){

   console.error(
    "🌵 GitHub branches error:",
    response.status
   );


   return [];

  }


  const data =
   await response.json();


  if(
   !Array.isArray(data)
  ){

   console.error(
    "🌵 Invalid branch response:",
    data
   );


   return [];

  }


  if(
   data.length === 0
  ){

   break;

  }


  allBranches.push(
   ...data
  );


  page++;


 }


 return allBranches;


}