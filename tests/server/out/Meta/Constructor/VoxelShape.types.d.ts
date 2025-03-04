import { VoxelSubstanceType } from "Meta/index";
import type { Position3Matrix } from "Meta/Util.types";
import { FaceDataOverride } from "./OverRide.types";
/** # Voxel Shape Add DAta
---
*/
export declare type VoxelShapeAddData = {
    LOD: number;
    substance: VoxelSubstanceType;
    positions: number[];
    normals: number[];
    indices: number[];
    faceData: number[];
    RGBLightColors: number[];
    sunLightColors: number[];
    AOColors: number[];
    colors: number[];
    uvs: number[];
    overlayUVs: number[];
    indicieIndex: number;
    face: number;
    shapeState: number;
    flowTemplateIndex?: number;
    flowTemplate?: number[];
    unTemplate: number[];
    uvTemplateIndex: number;
    overylayUVTemplate: number[];
    overylayUVTemplateIndex: number;
    colorTemplate: number[];
    colorIndex: number;
    lightTemplate: number[];
    lightIndex: number;
    aoTemplate: number[];
    aoIndex: number;
    position: Position3Matrix;
};
export declare type VoxelShapeAddReturnData = {
    newIndicieIndex: number;
    newUVTemplateIndex: number;
    newOverlayUVTemplateIndex: number;
    newColorIndex: number;
    newlightIndex: number;
    newAOIndex: number;
    newFlowTemplateIndex?: number;
};
/**# Voxel Shape
 * ---
 * Describes a basic voxel shape such as a box or half box.
 * Voxel shapes are used by the mesh bulder to generate the mush.
 * It checks with the voxel shape to build the proper mesh.
 */
export declare type VoxelShapeInterface = {
    id: string;
    cullFaceOverrideFunctions: Record<string, (data: FaceDataOverride) => boolean>;
    aoAddOverrideFunctions: Record<string, (data: FaceDataOverride) => boolean>;
    aoFlipOverrideFunctions: Record<string, (data: FaceDataOverride) => boolean>;
    cullFaceOverride(data: FaceDataOverride): boolean;
    registerShapeForCullFaceOverride(shapeId: string, func: (data: FaceDataOverride) => boolean): void;
    aoAddOverride(data: FaceDataOverride): boolean;
    registerShapeAOAddOverride(shapeId: string, func: (data: FaceDataOverride) => boolean): void;
    aoFlipOverride(data: FaceDataOverride): boolean;
    registerShapeAOFlipOverride(shapeId: string, func: (data: FaceDataOverride) => boolean): void;
    /**# Add To Chunk Mesh
     * ---
     */
    addToChunkMesh(data: VoxelShapeAddData): VoxelShapeAddReturnData;
};
