import type { ChunkVoxels, ChunkData } from "Meta/Chunks/Chunk.types";
import { GetRelativeVoxelData, GetVoxelData } from "./Functions/GetVoxelData.js";
import type { DivineVoxelEngineWorld } from "World/DivineVoxelEngineWorld.js";
import { CalculateVoxelLight, VoxelLightMixCalc } from "./Functions/CalculateVoxelLight.js";
import { InfoByte } from "Global/Util/InfoByte.js";
import { LightByte } from "Global/Util/LightByte.js";
import { VoxelSunLightMixCalc } from "./Functions/CalculateVoxelSunLight.js";
import { VoxelInteface } from "Meta/World/Voxels/Voxel.types.js";
export declare class WorldData {
    DVEW: DivineVoxelEngineWorld;
    renderDistance: number;
    chunkXPow2: number;
    chunkZPow2: number;
    chunkYPow2: number;
    private chunkProccesor;
    chunks: Record<string, ChunkData>;
    getVoxelData: typeof GetVoxelData;
    getRelativeVoxelData: typeof GetRelativeVoxelData;
    calculdateVoxelLight: typeof CalculateVoxelLight;
    voxelRGBLightMixCalc: typeof VoxelLightMixCalc;
    voxelSunLightMixCalc: typeof VoxelSunLightMixCalc;
    infoByte: InfoByte;
    lightByte: LightByte;
    substanceRules: Record<string, boolean>;
    constructor(DVEW: DivineVoxelEngineWorld);
    getCurrentWorldDataSize(): number;
    getCurrentWorldDataString(): string;
    /**# Is Exposed
     * ---
     * Will return true if any face of the voxel is exposed.
     * Must provide the voxel's x,y,z position.
     * @param voxel
     * @param voxelData
     * @param x
     * @param y
     * @param z
     * @returns
     */
    isExposed(voxel: VoxelInteface, voxelData: any[], x: number, y: number, z: number): boolean;
    /**# Face Check
     * ---
     * Determines if a face of a voxel is exposed.
     * You must provide the x,y,z position for the face that is being checked.
     * For instance if you want to check the top face it would be the voxels y plus 1.
     * @param voxel
     * @param voxelData
     * @param x
     * @param y
     * @param z
     * @returns
     */
    faceCheck(voxel: VoxelInteface, voxelData: any[], x: number, y: number, z: number): boolean;
    removeData(x: number, y: number, z: number): false | undefined;
    getData(x: number, y: number, z: number): any;
    _copy(data: any): any[];
    setData(x: number, y: number, z: number, data: number[]): false | undefined;
    getChunk(chunkX: number, chunkY: number, chunkZ: number): ChunkData | false;
    removeChunk(chunkX: number, chunkY: number, chunkZ: number): void;
    setChunk(chunkX: number, chunkY: number, chunkZ: number, chunk: ChunkData): void;
    getChunkPosition(x: number, y: number, z: number): number[];
    requestVoxelAdd(chunkX: number, chunkY: number, chunkZ: number, x: number, y: number, z: number, voxelPaletteId?: number): false | ChunkVoxels;
    _checkNearbyChunksToRebuild(chunkX: number, chunkY: number, chunkZ: number, relativeX: number, relativeZ: number): void;
    _getRelativeChunkPosition(chunkX: number, chunkY: number, chunkZ: number, x: number, y: number, z: number): number[];
    requestVoxelBeRemove(chunkX: number, chunkY: number, chunkZ: number, x: number, y: number, z: number): false | ChunkVoxels;
}
