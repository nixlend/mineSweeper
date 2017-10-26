# mineSweeper
I have made my first minesweeper game!

25 OCT 2017 Update
1. Information bar has been added to the top right
    - When grids has been opened, 'opened-grid' will display the number of it
    - When flags has been assigned to the grid, the flag icon will display the number of flags on current board
    - When bombs has been opened, the flag icon will display the number of bomb is now 1 less than before
2. Centerize the numbers, bombs and flags to make it look better
3. Disable click when the grid is assigned a flag
4. When the grid is flagged, it will not be opened by the propagration of empty grid
5. Known bugs
    - empty adjacent grid at the corner will be opened by the propagation

19 OCT 2017 Update
1. Grid Propagation added
    - When player click the empty grid, nearby empty grids will be opened untill it hit a number grid
2. Flag icon
    - Right click the grid will toggle the Flag icon
3. Next pending update
    - disable Flag icon toggling function on opened grid (25 OCT 2017 Update)
    - decide whether the Flagged upopen grid will be opened if the related empty grid is clicked (25 OCT 2017 Update)
    - better documentation
    - potentially seperating the bfs algorithm from application.js to another js file
4. Future Update
    - adding timer
    - alert player if stepping on the bomb, then showing option to reset the game
    - show how many grids have been opened and left, also the total amount of bombs and used flags on the board
    - slow animation when opening the grid to show the propagation of the empty grid