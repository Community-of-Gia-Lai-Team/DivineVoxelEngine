import { ChunkVoxels } from "Meta/Chunks/Chunk.types";
import { PositionMatrix } from "Meta/Util.types";

/**# Flat 3D Array
 * ---
 * Used to treat a 1d array as a 3d array.
 */
export const Flat3DArray = {
 bounds: {
  x: 16,
  y: 128,
  z: 16,
 },

 _position: {
  x: 0,
  y: 0,
  z: 0,
 },

 setBounds(x: number, y: number, z: number) {
  this.bounds = {
   x: x,
   y: y,
   z: z,
  };
 },

 getValue(x: number, y: number, z: number, array: ChunkVoxels) {
  return array[x + y * this.bounds.x + z * this.bounds.z * this.bounds.y];
 },
 getValueUseObj(position: PositionMatrix, array: ChunkVoxels) {
  return array[
   position.x +
    position.y * this.bounds.x +
    position.z * this.bounds.z * this.bounds.y
  ];
 },
 setValue(x: number, y: number, z: number, array: ChunkVoxels, value: number) {
  array[x + y * this.bounds.x + z * this.bounds.z * this.bounds.y] = value;
 },
 setValueUseObj(position: PositionMatrix, array: ChunkVoxels, value: number) {
  array[
   position.x +
    position.y * this.bounds.x +
    position.z * this.bounds.z * this.bounds.y
  ] = value;
 },

 deleteValue(x: number, y: number, z: number, array: ChunkVoxels) {
  delete array[x + y * this.bounds.x + z * this.bounds.z * this.bounds.y];
 },
 deleteUseObj(position: PositionMatrix, array: ChunkVoxels) {
  delete array[position.x + position.y * this.bounds.x + position.z * this.bounds.z * this.bounds.y];
 },
 getIndex(x: number, y: number, z: number) {
  return x + y * this.bounds.x + z * this.bounds.z * this.bounds.y;
 },
 getXYZ(index: number): PositionMatrix {
  this._position.x = index % this.bounds.x >> 0;
  this._position.y = (index / this.bounds.x) % this.bounds.y >> 0;
  this._position.z = (index / (this.bounds.x * this.bounds.y)) >> 0;
  return this._position;
 },
};
