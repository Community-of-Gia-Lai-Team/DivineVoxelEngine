import { type EngineSettingsData } from "Meta/index.js";
//objects
import { DVEC } from "../DivineVoxelEngineConstructor.js";
import { ShapeHelper } from "./Shapes/ShapeHelper.js";
import { UVHelper } from "./Shapes/UVHelper.js";
import { ShapeManager } from "../Managers/Shapes/ShapeManager.js";
import { ShapeBuilder } from "./Shapes/ShapeBuilder.js";
import { TextureManager } from "./Textures/TextureManager.js";
import { Processor } from "./Processor/Processor.js";
import { ChunkMesher } from "./Mesher/ChunkMesher.js";
import { VoxelHelper } from "./Processor/VoxelHelper.js";
import { EntityConstructor } from "./EntityConstructor/EntityConstructor.js";
import { EntityMesher } from "./Mesher/EntityMesher.js";
import { ItemMesher } from "./Mesher/ItemMesher.js";
//functions
import { InitBuilder } from "./Init/InitBuilder.js";
import { DimensionsRegister } from "../../Data/Dimensions/DimensionsRegister.js";

export const Builder = {
 textureManager: TextureManager,
 shapeManager: ShapeManager,
 shapeHelper: ShapeHelper,
 shapeBuilder: ShapeBuilder,
 uvHelper: UVHelper,
 chunkMesher: ChunkMesher,
 entityMesher: EntityMesher,
 itemMesher: ItemMesher,
 processor: Processor,
 voxelHelper: VoxelHelper,
 entityConstructor: EntityConstructor,

 dimension: 0,

 async $INIT() {
  InitBuilder(this);
 },

 syncSettings(settings: EngineSettingsData) {
  this.processor.syncSettings(settings);
 },

 async buildChunk(
  dimension: string | number,
  chunkX: number,
  chunkY: number,
  chunkZ: number,
  LOD = 1
 ) {
  dimension = DimensionsRegister.getDimensionNumericId(dimension);
  let chunk = DVEC.data.worldRegister.chunk.get(
   dimension,
   chunkX,
   chunkY,
   chunkZ
  );
  if (!chunk) {
   console.warn(`${chunkX} ${chunkY} ${chunkZ} could not be loaded`);
   return;
  }
  const template = this.processor.makeAllChunkTemplates(
   dimension,
   chunk,
   chunkX,
   chunkY,
   chunkZ,
   LOD
  );
  this.chunkMesher.buildChunkMesh(
   dimension,
   chunkX,
   chunkY,
   chunkZ,
   template,
   LOD
  );
  this.processor.flush();
  return true;
 },

 constructEntity() {
  const template = this.processor.constructEntity();
  this.entityMesher.buildEntityMesh(
   this.entityConstructor.pos.x,
   this.entityConstructor.pos.y,
   this.entityConstructor.pos.z,
   template.solid
  );
  this.entityConstructor.clearEntityData();
  this.processor.flush();
 },
};
