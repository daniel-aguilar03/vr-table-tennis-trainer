import { readFile, readdir, stat } from "node:fs/promises";
import assert from "node:assert/strict";
const version=await readFile("ProjectSettings/ProjectVersion.txt","utf8");
assert.match(version,/m_EditorVersion: 6000\.3\.22f1/);
for(const file of ["Packages/manifest.json","Packages/packages-lock.json"])
  JSON.parse(await readFile(file,"utf8"));
for(const file of ["Assets/Scenes/Trainer.unity","Assets/Scripts/Trainer.cs","Assets/Scripts/BallPhysics.cs","Assets/Scripts/FeedTrajectory.cs","Assets/Scripts/PaddleGrip.cs","Assets/Scripts/SpatialAudio.cs","Assets/Scripts/TrackedPose.cs","Assets/Scripts/TrainerMenu.cs"])
  assert.ok((await stat(file)).size>0,file);
let metaCount=0;
async function walk(directory){
 for(const item of await readdir(directory,{withFileTypes:true})){
  const file=directory+"/"+item.name;
  if(item.isDirectory()) await walk(file);
  else if(file.endsWith(".meta")){ assert.ok((await readFile(file,"utf8")).includes("guid:"),file); metaCount++; }
  else if(file.endsWith(".json")) JSON.parse(await readFile(file,"utf8"));
 }
}
await walk("Assets");await walk("Validation");
console.log("Unity version, package JSON, required sources and "+metaCount+" metadata files checked. This is not a Unity compile or headset test.");
