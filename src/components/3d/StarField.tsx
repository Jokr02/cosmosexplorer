import { Stars } from '@react-three/drei';

export const StarField = () => {
    return (
        <Stars
            radius={5000} // Push stars way out
            depth={100}
            count={5000}
            factor={4}
            saturation={0}
            fade
            speed={1}
        />
    );
};
