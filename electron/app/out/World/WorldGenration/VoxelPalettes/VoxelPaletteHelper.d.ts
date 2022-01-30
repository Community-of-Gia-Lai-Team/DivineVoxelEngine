import type { ChunkData } from "Meta/Chunks/Chunk.types";
import { VoxelInteface } from "Meta/World/Voxels/Voxel.types";
import { WorldRegion } from "Meta/WorldData/World.types";
import type { DivineVoxelEngineWorld } from "World/DivineVoxelEngineWorld";
/**# Voxel Palette Manager
 * ---
 * Used to help decode voxel ids and states from per-chunk voxel palettes.
 */
export declare class VoxelPaletteManager {
    private DVEW;
    globalVoxelPaletteIndex: number;
    perRegionVoxelRecord: Record<string, string[]>;
    perChunkVoxelRecord: Record<string, string[]>;
    globalVoxelPalette: Record<number, string>;
    globalVoxelPaletteMap: Record<string, number>;
    globalVoxelPaletteRecord: Record<string, string[]>;
    constructor(DVEW: DivineVoxelEngineWorld);
    /**# Get Vooxel Id From Global Palette
     * ---
     * Gets the number id for use of actual world generation.
     * This is what is actually stored in the chunk voxels.
     * @param voxelTrueId
     * @param voxelStateId
     * @returns
     */
    getVoxelPaletteIdFromGlobalPalette(voxelTrueId: string, voxelStateId: string): number;
    /**# Get Voxel True Id From Global Palette
     * ---
     * Returns the string id and state from the global voxel palette.
     * @param voxelId
     * @param voxelStateId
     * @returns
     */
    getVoxelDataFromGlobalPalette(voxelId: number): string[];
    registerVoxelForGlobalPalette(voxel: VoxelInteface): void;
    registerVoxelForPerChunkVoxelPalette(voxel: VoxelInteface): void;
    registerVoxelForPerRegionVoxelPalette(voxel: VoxelInteface): void;
    getGlobalVoxelPalette(): Record<number, string>;
    getVoxelData(chunk: ChunkData, voxelId: number): string[] | false;
    getVoxelPaletteId(chunk: ChunkData, voxelId: string, voxelState: string): number | false;
    addToChunksVoxelPalette(chunk: ChunkData, voxelId: string, voxelState: string): number;
    getVoxelDataFromRegion(region: WorldRegion, voxelId: number): string[] | false;
    getVoxelPaletteIdFromRegion(region: WorldRegion, voxelId: string, voxelState: string): number | false;
    addToRegionsVoxelPalette(region: WorldRegion, voxelId: string, voxelState: string): number;
}
