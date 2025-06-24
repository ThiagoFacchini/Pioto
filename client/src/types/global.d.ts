import type * as THREE from 'three'

// types/three-transform-controls.d.ts
declare module 'three/examples/jsm/controls/TransformControls' {
  import { Camera, Object3D } from 'three';
  import { EventDispatcher } from 'three';

  export class TransformControls extends EventDispatcher {
    constructor(camera: Camera, domElement: HTMLElement);
    object?: Object3D;
    
    enabled: boolean;
    axis: string | null;
    mode: 'translate' | 'rotate' | 'scale';
    setSize(size: number): void;
    attach(object: Object3D): void;
    detach(): void;
    dispose(): void;
    getMode(): string;
    setMode(mode: string): void;
    setTranslationSnap(snap: number): void;
    setRotationSnap(snap: number): void;
    setScaleSnap(snap: number): void;
    setSpace(space: 'local' | 'world'): void;
    update(): void;
    dragging: boolean;
    showX: boolean;
    showY: boolean;
    showZ: boolean;
  }
}

declare global {
  type Camera = THREE.Camera
}