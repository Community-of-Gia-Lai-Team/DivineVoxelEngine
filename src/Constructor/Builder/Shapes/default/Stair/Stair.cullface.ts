import type { FaceDataOverride } from "Meta/Constructor/OverRide.types";
type SideReocrd = Record<number, boolean>;

const eastWestSides: SideReocrd = {
 0: true,
 2: true,
 4: true,
 6: true,
};

const eastBoxes: SideReocrd = {
 3: true,
 7: true,
 10: true,
 11: true,
 14: true,
 15: true,
};
const westBoxes: SideReocrd = {
 1: true,
 5: true,
 8: true,
 9: true,
 12: true,
 13: true,
};

const northSouthSides: SideReocrd = {
 1: true,
 3: true,
 5: true,
 7: true,
};

const northBoxes: SideReocrd = {
 2: true,
 6: true,
 9: true,
 11: true,
 13: true,
 15: true,
};
const southBoxes: SideReocrd = {
 0: true,
 4: true,
 8: true,
 10: true,
 12: true,
 14: true,
};

const sameCullEastWast: SideReocrd = {
 0: true,
 2: true,
 4: true,
 6: true,
};

const sameCullNorthSouth: SideReocrd = {
 1: true,
 4: true,
 7: true,
 5: true,
};

const halfBoxCull = (Data: FaceDataOverride) => {
 return true;
};
const stairCull = (data: FaceDataOverride) => {
 const shapeState = data.currentVoxel.getShapeState();
 const neighborShapeState = data.neighborVoxel.getShapeState();
 if (shapeState >= 0 && shapeState <= 7) {
  if (data.face == "east" || data.face == "west") {
   if (shapeState == neighborShapeState) {
    return sameCullNorthSouth[shapeState];
   }
   if (data.face == "east") {
    if (eastBoxes[shapeState] && westBoxes[neighborShapeState]) return false;
   }
   if (data.face == "west") {
    if (westBoxes[shapeState] && eastBoxes[neighborShapeState]) return false;
   }
  }
  if (data.face == "north" || data.face == "south") {
   if (shapeState == neighborShapeState) {
    return sameCullEastWast[shapeState];
   }
   if (data.face == "north") {
    if (northBoxes[shapeState] && southBoxes[neighborShapeState]) return false;
   }
   if (data.face == "south") {
    if (southBoxes[shapeState] && northBoxes[neighborShapeState]) return false;
   }
  }
 }

 return true;
};

const boxCull = (data: FaceDataOverride) => {
 const shapeState = data.currentVoxel.getShapeState();
 if (data.face == "bottom") {
  if (
   (shapeState >= 0 && shapeState <= 3) ||
   (shapeState >= 8 && shapeState <= 11)
  ) {
   return false;
  }
 }
 if (data.face == "top") {
  if (
   (shapeState >= 4 && shapeState <= 7) ||
   (shapeState >= 12 && shapeState <= 15)
  ) {
   return false;
  }
 }
 if (data.face == "east") {
  if (eastWestSides[shapeState]) return false;
  if (eastBoxes[shapeState]) return false;
 }
 if (data.face == "west") {
  if (eastWestSides[shapeState]) return false;
  if (westBoxes[shapeState]) return false;
 }

 if (data.face == "north") {
  if (northSouthSides[shapeState]) return false;
  if (northBoxes[shapeState]) return false;
 }
 if (data.face == "south") {
  if (northSouthSides[shapeState]) return false;
  if (southBoxes[shapeState]) return false;
 }

 return true;
};

export const StairCullFace = (data: FaceDataOverride) => {
 const id = data.neighborVoxel.getVoxelShapeObj().id;
 if (id == "Box") {
  return boxCull(data);
 }
 if (id == "HalfBox") {
  return halfBoxCull(data);
 }
 if (id == "Stair") {
  return stairCull(data);
 }
 return true;
};
