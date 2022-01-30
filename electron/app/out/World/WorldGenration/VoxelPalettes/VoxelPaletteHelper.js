/**# Voxel Palette Manager
 * ---
 * Used to help decode voxel ids and states from per-chunk voxel palettes.
 */
export class VoxelPaletteManager {
    DVEW;
    globalVoxelPaletteIndex = 1;
    perRegionVoxelRecord = {};
    perChunkVoxelRecord = {};
    globalVoxelPalette = {};
    globalVoxelPaletteMap = {};
    globalVoxelPaletteRecord = {};
    constructor(DVEW) {
        this.DVEW = DVEW;
    }
    /**# Get Vooxel Id From Global Palette
     * ---
     * Gets the number id for use of actual world generation.
     * This is what is actually stored in the chunk voxels.
     * @param voxelTrueId
     * @param voxelStateId
     * @returns
     */
    getVoxelPaletteIdFromGlobalPalette(voxelTrueId, voxelStateId) {
        return this.globalVoxelPaletteMap[`${voxelTrueId}:${voxelStateId}`];
    }
    /**# Get Voxel True Id From Global Palette
     * ---
     * Returns the string id and state from the global voxel palette.
     * @param voxelId
     * @param voxelStateId
     * @returns
     */
    getVoxelDataFromGlobalPalette(voxelId) {
        const id = this.globalVoxelPalette[voxelId];
        return this.globalVoxelPaletteRecord[id];
    }
    registerVoxelForGlobalPalette(voxel) {
        const defaultId = `${voxel.data.id}:default`;
        this.globalVoxelPalette[this.globalVoxelPaletteIndex] = defaultId;
        this.globalVoxelPaletteMap[`${voxel.data.id}:default`] =
            this.globalVoxelPaletteIndex;
        this.globalVoxelPaletteIndex++;
        this.globalVoxelPaletteRecord[defaultId] = [voxel.data.id, "default"];
        if (voxel.data.states) {
            for (const state of voxel.data.states) {
                const stateID = `${voxel.data.id}:${state}`;
                this.globalVoxelPalette[this.globalVoxelPaletteIndex] = stateID;
                this.globalVoxelPaletteRecord[stateID] = [voxel.data.id, state];
                this.globalVoxelPaletteMap[`${voxel.data.id}:${state}`] =
                    this.globalVoxelPaletteIndex;
                this.globalVoxelPaletteIndex++;
            }
        }
    }
    registerVoxelForPerChunkVoxelPalette(voxel) {
        const defaultId = `${voxel.data.id}:default`;
        this.perChunkVoxelRecord[defaultId] = [voxel.data.id, "default"];
        if (voxel.data.states) {
            for (const state of voxel.data.states) {
                const stateID = `${voxel.data.id}:${state}`;
                this.perChunkVoxelRecord[stateID] = [voxel.data.id, state];
            }
        }
    }
    registerVoxelForPerRegionVoxelPalette(voxel) {
        const defaultId = `${voxel.data.id}:default`;
        this.perRegionVoxelRecord[defaultId] = [voxel.data.id, "default"];
        if (voxel.data.states) {
            for (const state of voxel.data.states) {
                const stateID = `${voxel.data.id}:${state}`;
                this.perRegionVoxelRecord[stateID] = [voxel.data.id, state];
            }
        }
    }
    getGlobalVoxelPalette() {
        return this.globalVoxelPalette;
    }
    getVoxelData(chunk, voxelId) {
        if (!chunk.palette)
            return false;
        const palette = chunk.palette;
        const id = palette.record[voxelId];
        return this.perChunkVoxelRecord[id];
    }
    getVoxelPaletteId(chunk, voxelId, voxelState) {
        if (!chunk.palette)
            return false;
        const palette = chunk.palette;
        return palette.map[`${voxelId}:${voxelState}`];
    }
    addToChunksVoxelPalette(chunk, voxelId, voxelState) {
        if (!chunk.palette)
            return 0;
        const palette = chunk.palette;
        const id = `${voxelId}:${voxelState}`;
        palette.record[palette.count] = id;
        palette.map[id] = palette.count;
        palette.count++;
        return palette.count - 1;
    }
    getVoxelDataFromRegion(region, voxelId) {
        if (!region.palette)
            return false;
        const palette = region.palette;
        const id = palette.record[voxelId];
        return this.perChunkVoxelRecord[id];
    }
    getVoxelPaletteIdFromRegion(region, voxelId, voxelState) {
        if (!region.palette)
            return false;
        const palette = region.palette;
        return palette.map[`${voxelId}:${voxelState}`];
    }
    addToRegionsVoxelPalette(region, voxelId, voxelState) {
        if (!region.palette)
            return 0;
        const palette = region.palette;
        const id = `${voxelId}:${voxelState}`;
        palette.record[palette.count] = id;
        palette.map[id] = palette.count;
        palette.count++;
        return palette.count - 1;
    }
}
