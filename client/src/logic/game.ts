import { TilePosition, Tile } from "@/types";

export function createBoard(rowCount: number, columnCount: number, bombCount: number): Tile[][] {
    const board = []; // will be an array of array of positions (in the form of {row, column, ...}
    const bombPositions = getBombPositions(rowCount, columnCount, bombCount);

    // populate the board variable
    for (let row = 0; row < rowCount; row++) { // each x represents a row
        const currentRow = [];
        for (let column = 0; column < columnCount; column++) { // each y represents a column
            // this object contains all properties of each tile
            const currentTile: Tile = {
                row, // represents rows. Goes like row0, row1, row2, etc
                column, // represents columns. Goes like row0column0, row0column1, row0column2, etc
                bomb: bombPositions.some(p => matchPosition(p, { row, column })), // return TRUE if current position (in the form of {x,y}) can be found in the bombPositions variable
                nearbyBombs: 0,
                status: 'hidden'
            };
            currentRow.push(currentTile);
        }
        board.push(currentRow);
    }
    return board;
}


// the function that either makes a number appear or makes a large part of the board "grayed-out"
export function revealTile(board: Tile[][], tile: Tile) {
    if (tile.status !== 'hidden') return; // only "hidden" tiles can be revealed

    // if the tile clicked on is the bomb, no need to execute the rest of the function
    if (tile.bomb) {
        tile.status = 'bomb';
        return;
    }

    tile.status = 'number';
    const nearbyTiles = getNearbyTiles(board, tile); // get all tiles that are adjacent
    const bombs = nearbyTiles.filter(t => t.bomb); // count how many of the adjacent tiles are actually bombs
    if (bombs.length === 0) {
        nearbyTiles.forEach(t => revealTile(board, t)); // if a tile has no bombs nearby, reveal the nearby tiles as well; I don't know how else to explain but you know how sometimes a large part of the board gets "blanked" in minesweeper right? Yeah like that
    } else {
        tile.nearbyBombs = bombs.length; // set the tile's text to the amount of bombs that are nearby
    }
}


export function checkWin(board: Tile[][]) {
    return board.every(row => {
        return row.every(tile => {
            return (
                tile.status === 'number' || (
                    tile.bomb && (
                        tile.status === 'hidden' || tile.status === 'marked'
                    )
                )
            )
        })
    })
}


export function checkLose(board: Tile[][]) {
    return board.some(row => {
        return row.some(tile => {
            return tile.status === 'bomb' // if status of any of the tiles of the current board is "bomb", that is, if any bombs are revealed, return TRUE to end the game with the lost condition. Also, "tile.status" being equal to "bomb" has nothing to do with "tile.bomb" being TRUE
        })
    })
}


// return a tile array of arrays, which will represent a 3x3 grid of tiles, surrounding the tile that the player clicked
function getNearbyTiles(board: Tile[][], tile: Tile) {
    const tiles = [];

    // picture the 3x3 grid of tiles surrounding the tile that the player clicked - upper tiles have x values that are one less than the clicked tile and the lower tiles have x values that are one more. Likewise, tiles to the left have y values that are one less than the clicked tile and tiles to the right have y values that are one more
    for (let rowOffset = -1; rowOffset <= 1; rowOffset++) {
        for (let columnOffset = -1; columnOffset <= 1; columnOffset++) {
            const nearbyTile = board[tile.row + rowOffset]?.[tile.column + columnOffset]; // ? (the question mark) ensures that item of index [tile.y + yOffset] is retrieved from board[tile.x + xOffset] only when board[tile.x + xOffset] is not undefined. This is because board[tile.x + xOffset] will sometimes be board[-1] which will return undefined and trying to treat undefined like an array will throw an error. However, you dont need ? at the end of [tile.y + yOffset] because even if board[tile.x + xOffset]?.[tile.y + yOffset] returns undefined, it doesnt throw an error
            if (nearbyTile) tiles.push(nearbyTile);
        }
    }
    return tiles;
}


// function to modify attribute of a tile element to marked
export function markTile(tile: Tile) {
    if (tile.status !== 'hidden' && tile.status !== 'marked') return;

    if (tile.status === 'marked') tile.status = 'hidden';
    else tile.status = 'marked';
}


// function to generate bombs (bombs positions to be exact) randomly, in object form, which will then be used to apply appropriate attributes to designated tile elements
function getBombPositions(rowCount: number, columnCount: number, bombCount: number) {
    const positions: TilePosition[] = [];

    while (positions.length < bombCount) {
        // the {row, column} format is similar to that of the tile object above
        const position = {
            row: getRandomPoint(rowCount),
            column: getRandomPoint(columnCount)
        };

        // if the currently generated position is already found in the positions array, dont add
        if (!positions.some(p => matchPosition(p, position))) {
            positions.push(position);
        }
    }
    return positions;
}


// function to check if two position objects (in the form of {row, column}) are similar
function matchPosition(a: TilePosition, b: TilePosition) {
    return a.row === b.row && a.column === b.column;
}


function getRandomPoint(size: number) {
    return Math.floor(Math.random() * size);
}