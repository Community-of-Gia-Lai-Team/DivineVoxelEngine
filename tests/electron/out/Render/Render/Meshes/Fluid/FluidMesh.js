import { LiquidMaterial } from "../../Materials/Liquid/LiquidMaterial.js";
export const LiquidMesh = {
    pickable: false,
    checkCollisions: false,
    seralize: false,
    clearCachedGeometry: false,
    createTemplateMesh(scene) {
        const mesh = new BABYLON.Mesh("liquid", scene);
        mesh.isPickable = this.pickable;
        mesh.checkCollisions = this.checkCollisions;
        if (!this.checkCollisions) {
            mesh.doNotSyncBoundingInfo = true;
        }
        mesh.doNotSerialize = this.seralize;
        return mesh;
    },
    syncSettings(settings) {
        if (settings.meshes.pickable) {
            this.pickable = true;
        }
        if (settings.meshes.clearChachedGeometry) {
            this.clearCachedGeometry = true;
        }
        if (settings.meshes.checkLiquidCollisions) {
            this.checkCollisions = true;
        }
        if (settings.meshes.seralize) {
            this.seralize = true;
        }
    },
    _applyVertexData(mesh, data) {
        mesh.unfreezeWorldMatrix();
        const chunkVertexData = new BABYLON.VertexData();
        chunkVertexData.positions = data.positionArray;
        chunkVertexData.indices = data.indiciesArray;
        chunkVertexData.normals = data.normalsArray;
        chunkVertexData.applyToMesh(mesh, false);
        mesh.setVerticesData("cuv3", data.uvArray, false, 3);
        mesh.setVerticesData("ocuv3", data.overlayUVArray, false, 4);
        mesh.setVerticesData("faceData", data.faceDataArray, false, 1);
        mesh.setVerticesData("rgbLightColors", data.RGBLightColorsArray, false, 4);
        mesh.setVerticesData("sunLightColors", data.sunLightColorsArray, false, 4);
        mesh.setVerticesData("colors", data.colorsArray, false, 4);
        if (this.clearCachedGeometry) {
            const bbInfo = mesh.getBoundingInfo();
            if (mesh.subMeshes) {
                for (const sm of mesh.subMeshes) {
                    sm.setBoundingInfo(bbInfo);
                }
            }
            mesh.geometry?.clearCachedData();
        }
        mesh.freezeWorldMatrix();
    },
    async rebuildMeshGeometory(mesh, data) {
        this._applyVertexData(mesh, data);
        return mesh;
    },
    async createMeshGeometory(mesh, data) {
        mesh.material = LiquidMaterial.getMaterial();
        this._applyVertexData(mesh, data);
        return mesh;
    },
};
