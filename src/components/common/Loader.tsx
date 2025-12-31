import React from 'react';

interface LoaderProps {
    className?: string;
    scale?: number;
}

export const Loader = ({ className = "", scale = 1 }: LoaderProps) => {
    return (
        <span
            className={`loader ${className}`}
            style={{
                transform: scale !== 1 ? `scale(${scale})` : undefined,
                transformOrigin: 'center center'
            }}
        ></span>
    );
};
