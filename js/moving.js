window.addEventListener('DOMContentLoaded', () => {
    const block = document.querySelector('.block'),
          blockStyle = block.style,
          apple = document.querySelector('.apple'),
          appleStyle = apple.style,
          border = document.querySelector('.wrapper'),
          borderStyle = getComputedStyle(border),
          body = document.querySelector('body'),
          bodyStyle = getComputedStyle(body),
          scoreBlock = document.querySelector('.score'),
          scoreBlockStyle = getComputedStyle(scoreBlock),
          currentScore = document.querySelector('.currentScore_res'),
          bestScore = document.querySelector('.bestScore_res');
    
    let Moving, 
        fps = 60, 
        wholeTime = 1000,
        wholeChange = 300,
        time = wholeTime / fps,
        change = wholeChange / fps,
        startChange = change;

    let lastMove = 0,
        spaceClick = 0,
        funStuff = 1,
        speedAdd = 25;

    let allLeftPad = pixelToNumber(bodyStyle.paddingLeft),
        allTopPad = pixelToNumber(bodyStyle.paddingTop) + pixelToNumber(scoreBlockStyle.height);

    let startWidthOfScreen = allLeftPad,
        endWidthOfScreen = allLeftPad + pixelToNumber(borderStyle.width),
        startHeightOfScreen = allTopPad,
        endHeightOfScreen = allTopPad + pixelToNumber(borderStyle.height);

    let borderLength = pixelToNumber(borderStyle.borderWidth);

    let centerPointX = (startWidthOfScreen + endWidthOfScreen) / 2,
        centerPointY = (startHeightOfScreen + endHeightOfScreen) / 2,
        startPosX = centerPointX - block.offsetWidth + "px", 
        startPosY = centerPointY - block.offsetHeight + "px";
        
       

    // body.style.padding = "100px";
    
    //console.dir(borderStyle);

    console.log(borderLength);

    blockStyle.top = startPosY;
    blockStyle.left = startPosX;

    // console.log(block.style.left);
    
    function checkFuntions() {
        checkInteraction();
        gameOver();
    }
    
    function checkInteraction() {
        let dxAdit = apple.offsetWidth / 2 - block.offsetWidth / 2;
        let dx = Math.abs(pixelToNumber(appleStyle.left) + dxAdit - pixelToNumber(blockStyle.left));
        let dyAdit = apple.offsetHeight / 2 - block.offsetHeight / 2;
        let dy = Math.abs(pixelToNumber(appleStyle.top) + dyAdit - pixelToNumber(blockStyle.top));
        let blockDistance = apple.offsetHeight + block.offsetHeight;
        // 4 * (dx * dx + dy * dy) <= blockDistance * blockDistance
        // dx <= apple.offsetWidth && dy <= apple.offsetHeight
        if (4 * (dx * dx + dy * dy) <= blockDistance * blockDistance) {
            getPoint();
            speedUp(funStuff);
            currentScore.textContent = parseInt(currentScore.textContent) + 1;
            if (parseInt(currentScore.textContent) > parseInt(bestScore.textContent)) {
                bestScore.textContent = currentScore.textContent;
            }
        }
    }

    function gameOver() {
        let BlockX1 = pixelToNumber(blockStyle.left);
        let BlockX2 = pixelToNumber(blockStyle.left) + block.offsetWidth;
        let BlockY1 = pixelToNumber(blockStyle.top);
        let BlockY2 = pixelToNumber(blockStyle.top) + block.offsetHeight;

        let BorderX1 = startWidthOfScreen + borderLength;
        let BorderX2 = endWidthOfScreen - borderLength;
        let BorderY1 = startHeightOfScreen + borderLength;
        let BorderY2 = endHeightOfScreen - borderLength;

        if (BlockX1 <= BorderX1 || BlockX2 >= BorderX2 || BlockY1 <= BorderY1 || BlockY2 >= BorderY2) {
            blockStyle.top = startPosY;
            blockStyle.left = startPosX;
            clearInterval(Moving);
            lastMove = 0;
            change = startChange;
            currentScore.textContent = 0;
        }
    }

    function speedUp(switcher) {
        if (switcher) {
            change += speedAdd / fps;
            console.log(change);
        }
    }

    function pixelToNumber(obj) {
        return Number(obj.split("px")[0]); 
    }
    
    function randFrom(min, max) {
        return Math.round(Math.random() * (max - min)) + min;
    }

    function getPoint() {
        let dif = apple.offsetWidth + 15,
            difX = block.offsetWidth,
            difY = block.offsetHeight;


        let x = randFrom(startWidthOfScreen + dif, endWidthOfScreen - dif);

        while (x >= centerPointX - difX && x <= centerPointX + difX) {
            x = randFrom(startWidthOfScreen + dif, endWidthOfScreen - dif);
        }

        let y = randFrom(startHeightOfScreen + dif, endHeightOfScreen - dif);

        while (y >= centerPointY - difY && y <= centerPointY + difY) {
            y = randFrom(startHeightOfScreen + dif, endHeightOfScreen - dif);
        }

        appleStyle.left = x + "px";
        appleStyle.top = y + "px";
    }

    let mp = {
        1: function moveUp() {
            blockStyle.top = String(pixelToNumber(blockStyle.top) - change) + "px";
            checkFuntions();
        },
        2: function moveDown() {
            blockStyle.top = String(pixelToNumber(blockStyle.top) + change) + "px";
            checkFuntions();
        },
        3: function moveLeft() {
            blockStyle.left = String(pixelToNumber(blockStyle.left) - change) + "px";
            checkFuntions();
        },
        4: function moveRight() {
            blockStyle.left = String(pixelToNumber(blockStyle.left) + change) + "px";
            checkFuntions();
        }    
    };
    
    getPoint();

    const moves = new Set(['s', 'w', 'a', 'd', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown']);

    document.addEventListener('keydown', (e) => {
        if (moves.has(e.key) || e.key == ' ') {
            clearInterval(Moving);
        }

        if (e.key == ' ') {
            spaceClick += 1;
            if (spaceClick % 2 == 0 && lastMove > 0) {
                Moving = setInterval(mp[lastMove], time);
            }
        }

        
        if (e.key == 'w' || e.key == 'ArrowUp') {
            lastMove = 1;
        }
        if (e.key == 's' || e.key == 'ArrowDown') {
            lastMove = 2;
        }
        if (e.key == 'a' || e.key == 'ArrowLeft') {
            lastMove = 3;
        }
        if (e.key == 'd' || e.key == 'ArrowRight') {
            lastMove = 4;
        }

        if (moves.has(e.key)) {
            spaceClick = 0;
            Moving = setInterval(mp[lastMove], time);
        }
    });

    document.addEventListener('mousedown1', (e) => {
        if (e.button == 0) {
            console.log(e);
            let dx = e.clientX - blockStyle.left.split("px")[0] - block.offsetWidth / 2;
            let dy = e.clientY - blockStyle.top.split("px")[0] - block.offsetHeight / 2;
            if (Math.abs(dx) <= block.offsetWidth / 2 || Math.abs(dy) <= block.offsetHeight / 2) {
                clearInterval(Moving);
                if (dx >= block.offsetWidth / 2) {
                    Moving = setInterval(mp[4], time);
                }
                else if (dx <= -block.offsetWidth / 2) {
                    Moving = setInterval(mp[3], time);
                }
                else if (dy >= block.offsetHeight / 2) {
                    Moving = setInterval(mp[2], time);
                }
                else {
                    Moving = setInterval(mp[1], time);
                }
            }
        }
    });


});