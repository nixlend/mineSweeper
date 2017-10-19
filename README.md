# mineSweeper
I have made my first minesweeper game!

19 OCT 2017 Update
1. Grid Propagation added
    - When player click the empty grid, nearby empty grids will be opened untill it hit a number grid
2. Flag icon
    - Right click the grid will toggle the Flag icon
3. Next pending update
    - disable Flag icon toggling function on opened grid
    - decide whether the Flagged upopen grid will be opened if the related empty grid is clicked
    - better documentation
    - potentially seperating the bfs algorithm from application.js to another js file
4. Future Update
    - adding timer
    - alert player if stepping on the bomb, then showing option to reset the game
    - show how many grids have been opened and left, also the total amount of bombs and used flags on the board
    - slow animation when opening the grid to show the propagation of the empty grid