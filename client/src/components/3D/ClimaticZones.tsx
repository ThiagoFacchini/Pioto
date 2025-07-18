// 📦 - IMPORTS
// ─────────────────────────────────────────────────────────────────────────────
// [ CORE ]
// ─────────────────────────────────────────────────────────────────────────────
import { useEffect, useRef, useMemo, RefObject } from 'react'
import { useGLTF, useAnimations, useKeyboardControls, Text } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { clone } from 'three/examples/jsm/utils/SkeletonUtils'
import { RigidBody, CapsuleCollider } from '@react-three/rapier'
import type { RapierRigidBody } from '@react-three/rapier'

// ─────────────────────────────────────────────────────────────────────────────
// [ STORES ]
// ─────────────────────────────────────────────────────────────────────────────
import { useGameStore } from '../../stores/GameStore'
import { useDebugStore } from '../../stores/DebugStore'
import { useConfigsStore } from '../../stores/ConfigsStore'
import { useWebSocketStore } from '../../stores/WebsocketStore'


// ─────────────────────────────────────────────────────────────────────────────
// [ SHARED TYPES & ENUMS ]
// ─────────────────────────────────────────────────────────────────────────────
import { ClimaticZonesType } from 'shared/messageTypes'
import { PlayerType, AnimationNameType } from './../../../../shared/playerType'
// =============================================================================



export function getClimaticZone( coordZ: number, mapSize: [ number, number] ): ClimaticZonesType {
    const halfDepth = mapSize[1] / 2
    const absZ = Math.abs( coordZ )

    if ( absZ <= halfDepth * 0.5 ) {               // Central 50% (-25% to 25% of full depth).
        return 'TROPICAL'
    } else if ( absZ <= halfDepth * 0.8 ) {         // Next 30% total (-25% to -40%, 25% to 40%).
        return 'TEMPERATE'
    } else {                                        // Outer 20% (-40% to -50%, 40% to 50%).
        return 'POLAR'
    }    
}


export default function ClimaticZones() {
    const mapSize = useGameStore( ( state ) => state.mapSize )
    const shouldShowZones = useDebugStore( ( state ) => state.showClimaticZones )

    const halfDepth = mapSize[1] / 2
    const zoneHeight = 20

    // Calculating zone depths
    const tropicalDepth = mapSize[1] * 0.5
    const temperateDepth = mapSize[1] * 0.15
    const polarDepth = mapSize[1] * 0.1

    // Positioning
    const tropicalPosZ = 0
    const temperatePosZNorth = tropicalDepth / 2 + temperateDepth / 2
    const temperatePosZSouth = -temperatePosZNorth
    const polarPosZNorth = temperatePosZNorth + temperateDepth / 2 + polarDepth / 2
    const polarPosZSouth = -polarPosZNorth

    // Memoize geometries / material for performance
    const boxGeometry = useMemo( () => { 
        return new THREE.BoxGeometry( mapSize[0], zoneHeight, 1)
    }, [ mapSize] )

    const tropicalMaterial = useMemo( () => {
        return new THREE.MeshBasicMaterial( { color: '#FF4500', transparent: true, opacity: 0.5 } )
    }, [] )

    const temperateMaterial = useMemo( () => {
        return new THREE.MeshBasicMaterial( { color: '#FFD700', transparent: true, opacity: 0.5 } ) 
    }, [] )

    const polarMaterial = useMemo( () => {
        return new THREE.MeshBasicMaterial( { color: '#00BFFF', transparent: true, opacity: 0.5 } )
    }, [] )

    if ( !shouldShowZones ) return null

    return (
        <>
            {/* 1x Tropical Zone (central, redish) */}
            <mesh position={[0, zoneHeight / 2, tropicalPosZ]} material={ tropicalMaterial } geometry={boxGeometry} scale={[1, 1, tropicalDepth]} />

            {/* 2x Temperate Zones (yellow, one north and one south) */}
            <mesh position={[0, zoneHeight / 2, temperatePosZNorth]} material={temperateMaterial} geometry={boxGeometry} scale={[1, 1, temperateDepth]} />
            <mesh position={[0, zoneHeight / 2, temperatePosZSouth]} material={temperateMaterial} geometry={boxGeometry} scale={[1, 1, temperateDepth]} />

            {/* 2x Polar Zones (blue, one north and one south) */}
            <mesh position={[0, zoneHeight / 2, polarPosZNorth]} material={polarMaterial} geometry={boxGeometry} scale={[1, 1, polarDepth]} />
            <mesh position={[0, zoneHeight / 2, polarPosZSouth]} material={polarMaterial} geometry={boxGeometry} scale={[1, 1, polarDepth]} />
        </>
    );
    }



