import React, { useState, useEffect } from "react";
import styles from './GameOver.module.css';

interface GameOverProps {
    description: string;
    resetValues: any;
}

const GameOverModal = ({ description, resetValues }: GameOverProps) => {
    const [isDragging, setIsDragging] = useState(false);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [offset, setOffset] = useState({ x: 0, y: 0 });

    // Center the modal on the screen when it first loads
    useEffect(() => {
        const centerX = window.innerWidth / 2 - 150; // Adjust 150 to half the width of your modal
        const centerY = window.innerHeight / 2 - 75; // Adjust 100 to half the height of your modal
        setPosition({ x: centerX, y: centerY });
    }, []);

    const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
        setIsDragging(true);
        setOffset({
            x: e.clientX - position.x,
            y: e.clientY - position.y,
        });
    };

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!isDragging) return;
        setPosition({
            x: e.clientX - offset.x,
            y: e.clientY - offset.y,
        });
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    return (
        <div
            className={styles.container}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            style={{
                position: "absolute",
                left: `${position.x}px`,
                top: `${position.y}px`,
                cursor: "grab",
                zIndex: 999999,
            }}
        >
            <p>{description}</p>
            <button className={styles.button} onClick={resetValues}>
                Start new game
            </button>
        </div>
    );
};

export default GameOverModal;
