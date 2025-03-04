import type {
 VoxelSubstanceType,
 VoxelTemplateSubstanceType,
} from "Meta/index.js";
import { ChunkReader } from "../../Data/Chunk/ChunkReader.js";
import { WorldRegister } from "../../Data/World/WorldRegister.js";
import { DimensionsRegister } from "../../Data/Dimensions/DimensionsRegister.js";
import { WorldBounds } from "../../Data/World/WorldBounds.js";
import { VoxelReader } from "../../Data/Voxel/VoxelByte.js";
import { VoxelData } from "../../Data/Voxel/VoxelData.js";
import { VoxelPaletteReader } from "../../Data/Voxel/VoxelPalette.js";
import { HeightMapData } from "../../Data/Chunk/HeightMapData.js";

export class DataTool {
 static _dtutil = new DataTool();

 _mode: "World" | "Entity" = "World";
 data = {
  dimension: "main",
  raw: [0, 0],
  id: 0,
  baseId: 0,
  secondaryId: 0,
  secondaryBaseId: 0,
 };
 position  = {
    x : 0,
    y : 0,
    z : 0
 }
 _cached = {
  id: 0,
  secondaryId: 0,
  substance: <VoxelSubstanceType>"solid",
  secondarySubstance: <VoxelSubstanceType>"solid",
 };
 __secondary = false;

 setDimension(dimensionId: string | number) {
  this.data.dimension = DimensionsRegister.getDimensionStringId(dimensionId);
  return this;
 }

 setSecondary(enable: boolean) {
  this.__secondary = enable;
  return this;
 }
 _getBaseId(id: number) {
  return VoxelPaletteReader.id.baseNumeric(id);
 }

 loadInRaw(rawData: number[]) {
  this.data.raw = rawData;
  this.__process();
 }

 __process() {
  this.data.id = VoxelReader.getId(this.data.raw[0]);
  this._cached.id = this.data.id;
  this.data.secondaryId = VoxelReader.getId(this.data.raw[1]);
  this._cached.secondaryId = this.data.secondaryId;
  this.data.baseId = this._getBaseId(this.data.id);
  if (this.data.secondaryId > 1) {
   this.data.secondaryBaseId = this._getBaseId(this.data.secondaryId);
  } else {
   this.data.secondaryBaseId = 0;
  }
  this._cached.substance = this.getSubstance();
  this.setSecondary(true);
  this._cached.secondarySubstance = this.getSubstance();
  this.setSecondary(false);
 }

 loadIn(x: number, y: number, z: number) {
  this.position.x = x;
  this.position.y = y;
  this.position.z = z;
  if (this._mode == "World") {
   const chunk = WorldRegister.chunk.get(this.data.dimension, x, y, z);
   if (!chunk) return false;
   const voxelPOS = WorldBounds.getVoxelPosition(x, y, z);
   this.data.raw[0] = ChunkReader.getVoxelDataUseObj(chunk, voxelPOS);
   this.data.raw[1] = ChunkReader.getVoxelDataUseObj(chunk, voxelPOS, true);
   this.__process();
   return true;
  }
  if (this._mode == "Entity") {
   return false;
  }
 }
 commit(heightMapUpdate = 0) {
  if (this._mode == "World") {
   const chunk = WorldRegister.chunk.get(
    this.data.dimension,
    this.position.x,
    this.position.y,
    this.position.z
   );
   if (!chunk) return false;
   const voxelPOS = WorldBounds.getVoxelPosition(
    this.position.x,
    this.position.y,
    this.position.z
   );

   ChunkReader.setVoxelDataUseObj(chunk, voxelPOS, this.data.raw[0]);
   ChunkReader.setVoxelDataUseObj(chunk, voxelPOS, this.data.raw[1], true);
   if (heightMapUpdate) {
    const substance = this.getTemplateSubstance();
    if (heightMapUpdate == 1) {
     HeightMapData.calculateHeightAddDataForSubstance(
      voxelPOS.y,
      substance,
      voxelPOS.x,
      voxelPOS.z,
      chunk.data
     );
     HeightMapData.updateChunkMinMax(voxelPOS, chunk.data);
    }
    if (heightMapUpdate == 2) {
     HeightMapData.calculateHeightRemoveDataForSubstance(
      voxelPOS.y,
      substance,
      voxelPOS.x,
      voxelPOS.z,
      chunk.data
     );
     HeightMapData.updateChunkMinMax(voxelPOS, chunk.data);
    }
   }
  }
  if (this._mode == "Entity") {
  }
  return this;
 }
 getLight() {
  const rawVoxelData = this.data.raw[0];
  if (rawVoxelData < 0) return -1;
  const voxelId = VoxelReader.getId(rawVoxelData);
  if (voxelId == 0) return VoxelReader.getLight(rawVoxelData);
  if (voxelId < 2) return -1;
  const lightValue = VoxelData.getLightValue(voxelId);
  if ( VoxelData.isLightSource(voxelId) && lightValue) {
   return lightValue;
  }
  if (VoxelData.getTrueSubstance(voxelId) == "solid") {
   return -1;
  }
  return VoxelReader.getLight(rawVoxelData);
 }
 setLight(light: number) {
  this.data.raw[0] = VoxelReader.setLight(this.data.raw[0], light);
  return this;
 }
 getLevel() {
  return VoxelReader.getLevel(this.data.raw[1]);
 }
 setLevel(level: number) {
  this.data.raw[1] = VoxelReader.setLevel(this.data.raw[1], level);
  return this;
 }
 getLevelState() {
  return VoxelReader.getLevelState(this.data.raw[1]);
 }
 setLevelState(state: number) {
  this.data.raw[1] = VoxelReader.setLevelState(this.data.raw[1], state);
  return this;
 }
 getShapeState() {
  return VoxelReader.getShapeState(this.data.raw[1]);
 }
 setShapeState(state: number) {
  this.data.raw[1] = VoxelReader.setShapeState(this.data.raw[1], state);
  return this;
 }
 hasSecondaryVoxel() {
  return this.data.secondaryBaseId > 1;
 }

 //voxel data
 getShapeId() {
  if (this.__secondary) {
   if (this.data.secondaryBaseId < 2) return -1;
   return VoxelData.getShapeId(this.data.secondaryBaseId);
  }
  if (this.data.id < 2) return -1;
  return VoxelData.getShapeId(this.data.baseId);
 }
 isLightSource() {
  if (this.__secondary) {
   if (this.data.secondaryBaseId < 2) return false;
   return VoxelData.isLightSource(this.data.secondaryBaseId);
  }
  if (this.data.id < 2) return false;
  return VoxelData.isLightSource(this.data.baseId);
 }
 getLightSourceValue() {
  if (this.__secondary) {
   if (this.data.secondaryBaseId < 2) return -1;
   return VoxelData.getLightValue(this.data.secondaryBaseId);
  }
  if (this.data.id < 2) return -1;
  return VoxelData.getLightValue(this.data.baseId);
 }
 getSubstance() {
  if (this.__secondary) {
   if (this.data.secondaryBaseId < 2) return "solid";
   return VoxelData.getTrueSubstance(this.data.secondaryBaseId);
  }
  if (this.data.id < 2) return "solid";
  return VoxelData.getTrueSubstance(this.data.baseId);
 }
 getTemplateSubstance(): VoxelTemplateSubstanceType {
  let substance: VoxelSubstanceType;
  if (this.__secondary) {
   if (this.data.secondaryBaseId < 2) return "solid";
   substance = <any>VoxelData.getTrueSubstance(this.data.secondaryBaseId);
  } else {
   if (this.data.id < 2) return "solid";
   substance = <any>VoxelData.getTrueSubstance(this.data.baseId);
  }
  if (substance == "transparent") {
   substance = "solid";
  }
  return substance;
 }
 getState() {
  if (this.__secondary) {
   return this.data.secondaryId - this.data.secondaryBaseId;
  }
  return this.data.id - this.data.baseId;
 }
 isRich() {
  if (this.__secondary) {
   if (this.data.secondaryBaseId < 2) return false;
   return VoxelData.isRich(this.data.secondaryBaseId);
  }
  if (this.data.id < 2) return false;
  return VoxelData.isRich(this.data.baseId);
 }

 //util
 setAir() {
  this.data.raw[0] = VoxelReader.setId(0, this.data.raw[0]);
  return this;
 }
 isAir() {
  return 0 == VoxelReader.getId(this.data.raw[0]);
 }
 setBarrier() {
  this.data.raw[0] = VoxelReader.setId(1, this.data.raw[0]);
  return this;
 }
 isBarrier() {
  return 1 == VoxelReader.getId(this.data.raw[0]);
 }
 //voxel id
 getId(base: boolean = false) {
  if (this.__secondary) {
   if (!base) {
    return this.data.secondaryId;
   }
   return this.data.secondaryBaseId;
  }
  if (!base) {
   return this.data.id;
  }
  return this.data.baseId;
 }
 setId(id: number) {
  if (this.__secondary) {
   this.data.raw[1] = VoxelReader.setId(id, this.data.raw[1]);
   this.data.secondaryId = id;
   this.data.secondaryBaseId = this._getBaseId(id);
   return this;
  }
  this.data.raw[0] = VoxelReader.setId(id, this.data.raw[0]);
  this.data.id = id;
  this.data.baseId = this._getBaseId(id);
  return this;
 }
 getStringId() {
  if (this.__secondary) {
   return VoxelPaletteReader.id.stringFromNumber(this.data.secondaryBaseId);
  }
  return VoxelPaletteReader.id.stringFromNumber(this.data.baseId);
 }

 //util
 isRenderable() {
  if (this.data.id < 2 && this.data.secondaryId < 2) return false;
  return true;
 }
 isSameVoxel(cx: number, cy: number, cz: number) {
  DataTool._dtutil.loadIn(cx, cy, cz);
  if (this.__secondary) {
   return this.data.secondaryBaseId == DataTool._dtutil.data.secondaryBaseId;
  }
  return this.data.baseId == DataTool._dtutil.data.baseId;
 }
}
