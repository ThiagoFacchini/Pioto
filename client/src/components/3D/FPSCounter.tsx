import { useFrame } from '@react-three/fiber'
import { useRef } from 'react'
import { useDebugStore } from '../../stores/DebugStore'

export default function FPSCounter() {
    const lastTimeRef = useRef(performance.now())
    const framesRef = useRef(0)
    const setFps = useDebugStore((state) => state.setFps)

    useFrame(() => {
        framesRef.current++
        const now = performance.now()
        if (now - lastTimeRef.current >= 1000) {
            setFps(framesRef.current)
            framesRef.current = 0
            lastTimeRef.current = now
        }
    })

    return null
}