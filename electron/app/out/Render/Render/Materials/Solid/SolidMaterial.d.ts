import type { EngineSettingsData } from "Meta/Global/EngineSettings.types";
import { MaterialCreateData } from "Meta/Render/Materials/Material.types.js";
export declare const SolidMaterial: {
    material: BABYLON.ShaderMaterial | null;
    time: number;
    getMaterial(): BABYLON.ShaderMaterial | null;
    updateFogOptions(data: BABYLON.Vector4): void;
    setSunLightLevel(level: number): void;
    setBaseLevel(level: number): void;
    updateMaterialSettings(settings: EngineSettingsData): void;
    createMaterial(data: MaterialCreateData): BABYLON.ShaderMaterial;
    overrideMaterial(material: any): void;
    runEffects(): void;
};
