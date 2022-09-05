import type { VoxelData } from "out/Meta/index";

export const DreamStoneStairVoxelData: VoxelData = {
 name: "Dream Stone Stair",
 shapeId: "Stair",
 id: "dve:dreamstone-stair",
 substance: "transparent",
 material : "stone",
 hardnress : 1000,
 physics: {
  collider: "Stair",
  checkCollisions : true
 },
};
