export const getImageTransformStyle = (rotation, zoom) => {
    return {
        transform: `rotate(${rotation}deg) scale(${zoom})`,
        transition: 'transform 0.2s ease-in-out'
    };
};

export const getFilterClass = (filterEffect) => {
    switch (filterEffect) {
        case 'grayscale': return 'grayscale';
        case 'sepia': return 'sepia';
        case 'invert': return 'invert';
        case 'blur': return 'blur-sm';
        case 'contrast': return 'contrast-125';
        default: return '';
    }
};

export default {
    getImageTransformStyle,
    getFilterClass
};
