export type Status = 'hidden' | 'bomb' | 'number' | 'marked' | 'detonated';

export interface TilePosition {
    row: number;
    column: number;
}

export interface Tile {
    row: number;
    column: number;
    bomb: boolean;
    nearbyBombs: number;
    status: Status;
}