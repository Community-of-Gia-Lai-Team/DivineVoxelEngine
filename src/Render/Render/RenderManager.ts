//types
import type { EngineSettingsData, RecursivePartial } from "Meta/index.js";
//objects
import { AnimationManager } from "./Animations/AnimationManager.js";
import { ShaderBuilder } from "./Shaders/ShaderBuilder.js";
import { TextureCreator } from "./Textures/TextureCreator.js";

//meshes
import { SolidMesh } from "./Meshes/Solid/SolidMesh.js";
import { FloraMesh } from "./Meshes/Flora/FloraMesh.js";
import { LiquidMesh } from "./Meshes/Liquid/LiquidMesh.js";
import { MagmaMesh } from "./Meshes/Magma/MagmaMesh.js";
import { ItemMesh } from "./Meshes/Item/ItemMesh.js";

//materials
import { SolidMaterial } from "./Materials/Solid/SolidMaterial.js";
import { FloraMaterial } from "./Materials/Flora/FloraMaterial.js";
import { LiquidMaterial } from "./Materials/Liquid/LiquidMaterial.js";
import { MagmaMaterial } from "./Materials/Magma/MagmaMaterial.js";
import { SkyBoxMaterial } from "./Materials/SkyBox/SkyBoxMaterial.js";
import { ItemMaterial } from "./Materials/Item/ItemMaterial.js";
import { StandardSolidMaterial } from "./Materials/Solid/Standard/SolidMaterial.bjsmp.js";
import { StandardLiquidMaterial } from "./Materials/Liquid/Standard/LiquidMaterial.bjsmp.js";
import {
 RenderFogOptions,
 RenderEffectsOptions,
} from "Meta/Render/Render/Render.options.types.js";

export const RenderManager = {
 fogOptions: <RenderFogOptions>{
  mode: "volumetric",
  density: 0.0002,
  color: new BABYLON.Color3(1, 1, 1),
  volumetricOptions: {
   heightFactor: 0.25,
  },
 },

 fogData: new BABYLON.Vector4(1, .1, 0.5, 0),

 effectOptions: <RenderEffectsOptions>{
  floraEffects: false,
  liquidEffects: false,
 },

 shaderBuilder: ShaderBuilder,
 textureCreator: TextureCreator,
 animationManager: AnimationManager,

 solidMaterial: SolidMaterial,
 floraMaterial: FloraMaterial,
 liquidMaterial: LiquidMaterial,
 magmaMaterial: MagmaMaterial,
 itemMaterial: ItemMaterial,

 solidStandardMaterial: StandardSolidMaterial,
 liquidStandardMaterial: StandardLiquidMaterial,

 skyBoxMaterial: SkyBoxMaterial,

 solidMesh: SolidMesh,
 floraMesh: FloraMesh,
 liquidMesh: LiquidMesh,
 magmaMesh: MagmaMesh,
 itemMesh: ItemMesh,

 scene: <BABYLON.Scene | null>null,

 reStart() {},

 setScene(scene: BABYLON.Scene) {
  this.scene = scene;
 },

 updateFogOptions(options: RecursivePartial<RenderFogOptions>) {
  for (const key of Object.keys(options)) {
   //@ts-ignore
   const data = options[key];
   if (typeof data == "object") {
    for (const key2 of Object.keys(data)) {
     const data2 = data[key2];
     (this as any).fogOptions[key][key2] = data2;
    }
   } else {
    (this as any).fogOptions[key] = data;
   }
  }

  if(options.color && this.scene) {
    //@ts-ignore
    this.scene.fogColor = options.color;
  }
  const fogData = new BABYLON.Vector4(0, 0, 0, 0);
  if (this.fogOptions.mode == "volumetric") {
   fogData.x = 1;
  }
  if (this.fogOptions.mode == "animated-volumetric") {
   fogData.x = 2;
  }
  fogData.y = this.fogOptions.density;
  fogData.z = this.fogOptions.volumetricOptions.heightFactor;
  this.fogData = fogData;
 },

 _setFogData() {
  const fogData = this.fogData;
  this.solidMaterial.updateFogOptions(fogData);
  this.liquidMaterial.updateFogOptions(fogData);
  this.floraMaterial.updateFogOptions(fogData);
  this.magmaMaterial.updateFogOptions(fogData);
  this.itemMaterial.updateFogOptions(fogData);
  this.skyBoxMaterial.updateFogOptions(fogData);
 },

 $INIT() {
  this.updateFogOptions(this.fogOptions);
  this._setFogData();
 },

 updateShaderEffectOptions(options: RecursivePartial<RenderEffectsOptions>) {
  if (options.floraEffects !== undefined) {
   this.effectOptions.floraEffects = options.floraEffects;
  }
  if (options.liquidEffects !== undefined) {
   this.effectOptions.liquidEffects = options.liquidEffects;
  }
 },

 syncSettings(settings: EngineSettingsData) {
  this.solidMesh.syncSettings(settings);
  this.floraMesh.syncSettings(settings);
  this.liquidMesh.syncSettings(settings);
  this.magmaMesh.syncSettings(settings);
  this.itemMesh.syncSettings(settings);
 },

 getScene() {
  return this.scene;
 },

 createSkyBoxMaterial(scene?: BABYLON.Scene) {
  if (!this.scene && !scene) {
   throw new Error(`Must set a scene first.`);
  }
  if (!this.scene && scene) {
   this.skyBoxMaterial.createMaterial(scene);
  }
  if (this.scene && !scene) {
   this.skyBoxMaterial.createMaterial(this.scene);
  }
  return this.skyBoxMaterial.getMaterial();
 },

 setSunLevel(level: number) {
  this.solidMaterial.setSunLightLevel(level);
  this.liquidMaterial.setSunLightLevel(level);
  this.floraMaterial.setSunLightLevel(level);
  this.itemMaterial.setSunLightLevel(level);
 },
 setBaseLevel(level: number) {
  this.solidMaterial.setBaseLevel(level);
  this.liquidMaterial.setBaseLevel(level);
  this.floraMaterial.setBaseLevel(level);
  this.itemMaterial.setBaseLevel(level);
 },
};
