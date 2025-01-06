export const handleKingMove = (
    setWhiteKingMoved:  React.Dispatch<React.SetStateAction<boolean>>,
    setBlackKingMoved: React.Dispatch<React.SetStateAction<boolean>>,
    origin: number,
):void => {
    switch(origin) {
        case 4:
            setBlackKingMoved(true);
            break
        case 60:
            setWhiteKingMoved(true);
    }
};