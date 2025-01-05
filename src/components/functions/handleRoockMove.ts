import { RockStatus } from "../../types/types";

export const handleRoockMove = (
    setWhiteRookMoved: any,
    setBlackRookMoved: any,
    origin: number
)=> {
    if(origin === 0) {
        setBlackRookMoved((prev: RockStatus)=> ({...prev, left: true}))
    } else if ( origin === 7 ) {
        setBlackRookMoved((prev: RockStatus)=> ({...prev, right: true}))
    } else if ( origin === 56 ) {
        setWhiteRookMoved((prev: RockStatus)=> ({...prev, left: true}))
    } else if ( origin === 63) {
        setWhiteRookMoved((prev:RockStatus)=> ({...prev, right: true}))
    }
};