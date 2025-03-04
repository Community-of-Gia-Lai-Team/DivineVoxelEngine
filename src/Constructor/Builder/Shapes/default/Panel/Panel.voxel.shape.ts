import { Builder } from "../../../Builder.js";
import type {
 VoxelShapeAddData,
 VoxelShapeInterface,
} from "Meta/Constructor/VoxelShape.types";
import type { DirectionNames } from "Meta/Util.types.js";

const shapeDimensions = {
 width: 0.5,
 depth: 0.5,
 height: 0.5,
};

const processDefaultFaceData = (
 face: DirectionNames,
 data: VoxelShapeAddData,
 flip: boolean
) => {
 const uv = data.unTemplate[data.uvTemplateIndex];
 const rotation = Builder.shapeHelper.getTextureRotation(data.face, face);
 for (let i = 0; i < 2; i++) {
  Builder.uvHelper.addUVs(face, {
   uvs: data.uvs,
   uv: uv,
   width: { start: 0, end: 1 },
   height: { start: 0, end: 1 },
   flipped: flip,
   rotoate: rotation,
  });
  Builder.uvHelper.processOverlayUVs(data);

  Builder.shapeHelper.calculateAOColorFromValue(
   data.AOColors,
   data.aoTemplate[data.aoIndex]
  );

  Builder.shapeHelper.calculateLightColorFromValue(
   data.RGBLightColors,
   data.sunLightColors,
   data.lightTemplate[data.lightIndex]
  );
 }

 if (data.substance == "flora") {
  let animData = Builder.shapeHelper.meshFaceData.setAnimationType(2, 0);
  Builder.shapeHelper.addFaceData(animData, data.faceData);
  Builder.shapeHelper.addFaceData(animData, data.faceData);
 } else {
  Builder.shapeHelper.addFaceData(0, data.faceData);
  Builder.shapeHelper.addFaceData(0, data.faceData);
 }

 data.uvTemplateIndex += 2;
 data.overylayUVTemplateIndex += 4;
 data.lightIndex += 1;
 data.colorIndex += 1;
 data.aoIndex += 1;
};

const shapeStates: Record<number, (data: VoxelShapeAddData) => void> = {
 0: (data) => {
  const flip = Builder.shapeHelper.shouldFaceFlip(data.face, "north");
  data.position.z += 0.05;
  Builder.shapeBuilder.addFace(
   "south",
   data.position,
   shapeDimensions,
   data,
   flip
  );
  data.position.z -= 1;
  Builder.shapeBuilder.addFace(
   "north",
   data.position,
   shapeDimensions,
   data,
   flip
  );
  processDefaultFaceData("north", data, flip);
 },
 1: (data) => {
  const flip = Builder.shapeHelper.shouldFaceFlip(data.face, "north");
  data.position.z -= 0.05;
  Builder.shapeBuilder.addFace(
   "north",
   data.position,
   shapeDimensions,
   data,
   flip
  );
  data.position.z += 1;
  Builder.shapeBuilder.addFace(
   "south",
   data.position,
   shapeDimensions,
   data,
   flip
  );
  processDefaultFaceData("north", data, flip);
 },
 2: (data) => {
  const flip = Builder.shapeHelper.shouldFaceFlip(data.face, "west");
  data.position.x -= 0.05;
  Builder.shapeBuilder.addFace(
   "east",
   data.position,
   shapeDimensions,
   data,
   flip
  );
  data.position.x += 1;
  Builder.shapeBuilder.addFace(
   "west",
   data.position,
   shapeDimensions,
   data,
   flip
  );
  processDefaultFaceData("west", data, flip);
 },
 3: (data) => {
  const flip = Builder.shapeHelper.shouldFaceFlip(data.face, "west");
  data.position.x += 0.05;
  Builder.shapeBuilder.addFace(
   "west",
   data.position,
   shapeDimensions,
   data,
   flip
  );
  data.position.x -= 1;
  Builder.shapeBuilder.addFace(
   "east",
   data.position,
   shapeDimensions,
   data,
   flip
  );
  processDefaultFaceData("west", data, flip);
 },
 4: (data) => {
  const flip = Builder.shapeHelper.shouldFaceFlip(data.face, "top");
  data.position.y -= 0.05;
  Builder.shapeBuilder.addFace(
   "top",
   data.position,
   shapeDimensions,
   data,
   flip
  );
  data.position.y += 1;
  Builder.shapeBuilder.addFace(
   "bottom",
   data.position,
   shapeDimensions,
   data,
   flip
  );
  processDefaultFaceData("bottom", data, flip);
 },
 5: (data) => {
  const flip = Builder.shapeHelper.shouldFaceFlip(data.face, "bottom");
  data.position.y += 0.05;
  Builder.shapeBuilder.addFace(
   "bottom",
   data.position,
   shapeDimensions,
   data,
   flip
  );
  data.position.y -= 1;
  Builder.shapeBuilder.addFace(
   "top",
   data.position,
   shapeDimensions,
   data,
   flip
  );
  processDefaultFaceData("bottom", data, flip);
 },
};

export const PanelVoxelShape: VoxelShapeInterface = {
 id: "Panel",
 cullFaceOverrideFunctions: {},
 aoAddOverrideFunctions: {},
 aoFlipOverrideFunctions: {},
 registerShapeForCullFaceOverride(shapeId, func) {
  this.cullFaceOverrideFunctions[shapeId] = func;
 },
 registerShapeAOAddOverride(shapeId, func) {
  this.aoAddOverrideFunctions[shapeId] = func;
 },
 cullFaceOverride(data) {
  if (
   this.cullFaceOverrideFunctions[data.neighborVoxel.getVoxelShapeObj().id]
  ) {
   return this.cullFaceOverrideFunctions[
    data.neighborVoxel.getVoxelShapeObj().id
   ](data);
  }
  if (data.currentVoxel.getSubstance() == "flora") {
   return false;
  }
  return data.default;
 },
 aoAddOverride(data) {
  if (this.aoAddOverrideFunctions[data.neighborVoxel.getVoxelShapeObj().id]) {
   return this.aoAddOverrideFunctions[data.neighborVoxel.getVoxelShapeObj().id](
    data
   );
  }
  return data.default;
 },
 registerShapeAOFlipOverride(shapeId, func) {
  this.aoAddOverrideFunctions[shapeId] = func;
 },
 aoFlipOverride(data) {
  return false;
 },
 addToChunkMesh(data: VoxelShapeAddData) {
  data.position.x += shapeDimensions.width;
  data.position.z += shapeDimensions.depth;
  data.position.y += shapeDimensions.height;
  const shapeState = data.shapeState;
  shapeStates[shapeState](data);
  return Builder.shapeHelper.produceShapeReturnData(data);
 },
};
