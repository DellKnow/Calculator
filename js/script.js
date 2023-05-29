window.addEventListener('DOMContentLoaded', () => {
    const apple = document.querySelector('.apple'),
          block = document.querySelector('.block'),
          appleStyle = apple.style,
          blockStyle = block.style;
    
    function randFrom(min, max) {
        return Math.round(Math.random() * (max - min)) + min;
    }

    function getPoint() {
        let x = randFrom(50, 1300);

        while (x >= 600 && x <= 800) {
            x = randFrom(50, 1300);
        }

        let y = randFrom(50, 550);

        while (y >= 200 && y <= 400) {
            y = randFrom(50, 550);
        }

        appleStyle.left = x + "px";
        appleStyle.top = y + "px";
    }

    getPoint();

    if (Number(blockStyle.top.split("px")[0]) == Number(appleStyle.top.split("px")[0])) {
        console.log(1);
    }
});