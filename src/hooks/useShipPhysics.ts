import { useRef, useState } from 'react';

import { Vector3, Quaternion } from 'three';

export const useShipPhysics = (initialPosition: Vector3 = new Vector3(0, 0, 0)) => {
    const [velocity] = useState(new Vector3(0, 0, 0));
    const position = useRef(initialPosition.clone());
    const rotation = useRef(new Quaternion());

    // Physics constants
    const THRUST_POWER = 15.0; // Increased for better feel
    const ROTATION_SPEED = 2.0;
    const DRAG = 0.98; // Applied to velocity each frame

    const updatePhysics = (
        delta: number,
        inputs: { thrust: number; yaw: number; pitch: number; roll: number }
    ) => {
        const { thrust, yaw, pitch, roll } = inputs;

        // Apply rotation
        const qYaw = new Quaternion().setFromAxisAngle(new Vector3(0, 1, 0), yaw * ROTATION_SPEED * delta);
        const qPitch = new Quaternion().setFromAxisAngle(new Vector3(1, 0, 0), pitch * ROTATION_SPEED * delta);
        const qRoll = new Quaternion().setFromAxisAngle(new Vector3(0, 0, 1), roll * ROTATION_SPEED * delta);

        rotation.current.multiply(qYaw).multiply(qPitch).multiply(qRoll);
        rotation.current.normalize();

        // Apply thrust
        if (thrust !== 0) {
            const direction = new Vector3(0, 0, -1).applyQuaternion(rotation.current);
            velocity.add(direction.multiplyScalar(thrust * THRUST_POWER * delta));
        }

        // Apply drag
        velocity.multiplyScalar(DRAG);

        // Update position
        position.current.add(velocity.clone().multiplyScalar(delta));

        return {
            position: position.current,
            rotation: rotation.current,
            velocity: velocity
        };
    };

    return { updatePhysics, position, rotation, velocity };
};
