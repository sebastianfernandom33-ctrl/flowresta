import druidImg
 from "./druid.png";

import branchesImg
 from "./branch.png";

import mapImg
 from "./map.png";

import gardenImg
 from "./garden.png";

import compareImg
 from "./compare.png";

import druxdImg
 from "./druxd.png";

import treeImg
 from "./tree.png";

import aboutImg
 from "./about.png";


export const manual = {

 tutorial:{

  title:
   "𓆧 Druid Guide",

  image:
    druidImg,

  type:
    "tutorial",

  content:
`
Welcome traveler.

I am the guardian of your Flowresta.

I can teach you how to read your forest,
understand branches,
compare histories,
and explore ancient trees.

Start the visual guide anytime.
`,

  action:
   "Start Tutorial"

 },


 branches:{

 title:
  "𖠁 Branches",

  image:
    branchesImg,

 content:
`
Every leaf represents a branch.

Click branches to inspect:

✦ SHA
✦ Author
✦ Protection
✦ Commit history

Use "Show Tags" to reveal branch names.
`

 },


 map:{

 title:
  "± Map Controls",

  image:
    mapImg,

 content:
`
Navigate your forest:

+ Zoom in

- Zoom out

[ ] Fit forest

Drag branches:
move individual branches

Shift + drag:
move groups together
`

 },


 garden:{

 title:
  "𓇗 Garden Layout",

  image:
    gardenImg,

 content:
`
Change how your repository grows.

𖣂 Crown:
classic tree view

𖣂 inverted:
root exploration

✤ Clover:
large repositories

𖠺 Paripinnate:
long branch structures
`

 },


 compare:{

 title:
  "𓁹 Compare Mode",

  image:
    compareImg,

 content:
`
Compare two branches.

Analyze:

↥ commits ahead

↧ commits behind

changed files

merge readiness
`

 },


 druid:{

 title:
  "𖧧 drUId / drUXd",

  image:
    druxdImg,

 content:
`
The Druid watches your forest.

He can:

✦ recommend layouts
✦ detect ancient trees
✦ guide actions

Click the message to close recommendations.

Some actions appear in cyan.
`

 },


 tree:{

 title:
  "𖠻 Tree Groups",

  image:
    treeImg,

 content:
`
Ancient forests are grouped.

Tree Groups organize massive repositories.

Open groups to explore deeper branches.
`,

 action:
  "Ancient Tutorial"

 },


 about:{

 title:
  "ⓘ About Flowresta",

  image:
    aboutImg,

 content:
`
𖧧 Flowresta

A living Git visualization experience.

Created by:
Sebastián Martínez Quiñones

Version:
1.0

Year:
2026
`

 }

};
