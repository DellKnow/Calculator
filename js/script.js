window.addEventListener('DOMContentLoaded', () => {
    const digitNumbers = document.querySelectorAll('.for-number'),
          allResultArea = document.querySelector('.header__result'),
          resultArea = allResultArea.querySelector('.header__result-this'),
          resultAreaText = resultArea.querySelector('.header__result-this-area_text'),
          resultPreviousArea = allResultArea.querySelector('.header__result-previous'),
          resultPreviousAreaText = allResultArea.querySelector('.header__result-previous-area_text'),
          allBtns = document.querySelectorAll('.operations__buttons-btn'),
          allOperations = document.querySelectorAll('.for-op'),
          clearBtn = document.querySelector('.for-clear'),
          multiplicationBtn = document.querySelector('.multiplication'),
          leftBracket = document.querySelector('.bracket__left'),
          rightBracket = document.querySelector('.bracket__right');

    let currentBtn = -1,
        flagForTimer = 1,
        flagForNumber = 1,
        flagForEqual = 0,
        firstNumberDigit = 0,
        dotCounter = 0,
        resultAns = 0,
        flagForClickClear = 1,
        leftBracketCounter = 0,
        rightBracketCounter = 0,
        itsStartZero = 1,
        firstMinus = 0,
        check = 0,
        checkForTimer = 0,                    
        dot = '.',
        resultForCalc = '',
        clearTimer;

    function addDigit(digit) {
        if (flagForNumber) {
            firstMinus = 0;
            itsStartZero = 0;
            if (digit != dot) {
                if (firstNumberDigit == 0) {
                    resultAreaText.textContent = removeLastSymbol(resultAreaText.textContent) + digit;
                    firstNumberDigit = digit;
                }
                else {
                    resultAreaText.textContent += digit;
                    if (firstNumberDigit == '(') {
                        firstNumberDigit = digit;
                    }
                }
            }
            else {
                if (dotCounter == 0) {
                    resultAreaText.textContent += digit;
                    dotCounter++;
                    if (firstNumberDigit == 0) {
                        firstNumberDigit = '.';
                    }
                }
            }
        }
        else {
            if (flagForEqual) {
                resultPreviousAreaText.textContent = `Ans = ${resultAns}`;
            }
            if (lastSymbol(resultAreaText.textContent) == ')' || lastSymbol(resultAreaText.textContent) == '%') {
                resultAreaText.textContent += multiplicationBtn.textContent;
            }

            if (digit != dot) {
                dotCounter = 0;
                if (flagForEqual || resultAreaText.textContent == 'Undefined' || resultAreaText.textContent == 'Infinity') {
                    resultAreaText.textContent = digit;
                }
                else {
                    resultAreaText.textContent += digit;
                }
            }
            else {
                dotCounter = 1;
                if (flagForEqual) {
                    resultAreaText.textContent = '0.';
                }
                else {
                    resultAreaText.textContent += '0.';
                }
            }
            flagForNumber = 1;
            flagForEqual = 0;
            firstNumberDigit = digit;
        }
    }

    function addOperation(op) {
        if (flagForEqual) {
            resultPreviousAreaText.textContent = `Ans = ${resultAns}`;
            flagForEqual = 0;
        }

        if (lastSymbol(resultAreaText.textContent) != '(' && resultAreaText.textContent != 'Undefined' && resultAreaText.textContent != 'Infinity' && lastSymbol(resultAreaText.textContent) != '-') {
            if (itsStartZero && op == ' - ') {
                firstMinus = 1;
                resultAreaText.textContent = '-';
            }
            else {
                if (lastSymbol(resultAreaText.textContent) != ' ') {
                    if (lastSymbol(resultAreaText.textContent) == '.') {
                        resultAreaText.textContent += '0';
                    }
                    resultAreaText.textContent += op;
                }
                else {
                    if (op == ' - ' && !firstMinus) {
                        resultAreaText.textContent += '(-';
                        firstMinus = 0;
                        leftBracketCounter++;
                    }
                    else {
                        resultAreaText.textContent = removeLastSymbol(resultAreaText.textContent, 1) + op;
                    }
                }
            }
            itsStartZero = 0;
            flagForNumber = 0;
        }
        else if (lastSymbol(resultAreaText.textContent) == '(' && op == ' - ') {
            firstMinus = 1;
            resultAreaText.textContent += '-';
            flagForNumber = 0;
        }
    }

    function addBracket(bracket) {
        flagForNumber = 0;
        firstMinus = 0;
        if (bracket == '(') {
            leftBracketCounter++;
            if (itsStartZero || resultAreaText.textContent == 'Infinity' || resultAreaText.textContent == 'Undefined') {
                itsStartZero = 0;
                resultAreaText.textContent = '(';
                firstNumberDigit = '(';
                if (flagForEqual) {
                    flagForEqual = 0;
                }
            }
            else {
                if (lastSymbol(resultAreaText.textContent) == '-') {
                    resultAreaText.textContent += ' (';
                }
                else {
                    if (lastSymbol(resultAreaText.textContent) != ' ' && lastSymbol(resultAreaText.textContent) != '(') {
                        resultAreaText.textContent += multiplicationBtn.textContent;
                    }
                    resultAreaText.textContent += '(';
                }
            }
        }
        else {
            if (rightBracketCounter < leftBracketCounter && lastSymbol(resultAreaText.textContent) != '-' && lastSymbol(resultAreaText.textContent) != ' ' && lastSymbol(resultAreaText.textContent) != '(' && lastSymbol(resultAreaText.textContent) != ' ') {
                rightBracketCounter++;
                resultAreaText.textContent += ')';
            }
        }
    }

    function addEqual() {
        if (leftBracketCounter == rightBracketCounter && (('0' <= lastSymbol(resultAreaText.textContent) && lastSymbol(resultAreaText.textContent) <= '9')  || lastSymbol(resultAreaText.textContent) == ')' || lastSymbol(resultAreaText.textContent) == '%')) {
            removeAnimationToResultsAreas();
            // addAnimationToResultsAreas();
            if (resultAreaText.textContent != 0) {
                clearBtn.textContent = 'AC';
            }
            if (!flagForEqual) {
                resultPreviousAreaText.textContent = `${resultAreaText.textContent} =`;
            }
            resultAns = simplifyAns(calcFunc(resultAreaText.textContent));
            resultAreaText.textContent = resultAns;
            flagForEqual = 1;
            flagForNumber = 0;
            leftBracketCounter = 0;
            rightBracketCounter = 0;
        }
    }

    function isEhere(str) {
        for (let i = 0; i < str.length; i++) {
            if (str[i] == 'e') {
                return i;
            }
        }
        return 0;
    }

    function max(a, b) {
        if (a > b) {
            return a;
        }
        else {
            return b;
        }
    }

    function min(a, b) {
        if (a > b) {
            return b;
        }
        else {
            return a;
        }
    }

    function simplifyAns(str) {
        const t = str.split('.');
        if (t.length == 1) {
            return str;
        }
        if (isEhere(str)) {
            return `${t[0]}.${t[1].substring(0, min(t[1].length, 8))}${str.substring(isEhere(str), str.length)}`;
        }
        else {
            let simpDigit;
            if (t[0].length >= 12) {
                simpDigit = 1;
            }
            else if (t[0].length >= 10) {
                simpDigit = 2;
            }
            else if (t[0].length >= 8) {
                simpDigit = 4;
            }
            else if (t[0].length >= 6) {
                simpDigit = 6;
            }
            else if (t[0].length >= 4) {
                simpDigit = 8;
            }
            else {
                simpDigit = 11;
            }
            
            return `${t[0]}.${t[1].substring(0, min(t[1].length, simpDigit))}`;
        }
    }

    function removeDot(str) {   
        if (!isEhere(str)) {
            if (str[0] == '0') {
                if (str[1] == '.') {
                    for (let i = 2; i < str.length; i++) {
                        if (str[i] != '0') {
                            // console.log(str.substring(i, str.length), `1e+${str.length - 2}`);
                            return [str.substring(i, str.length), `1e+${str.length - 2}`];
                        }
                    }
                    return [0, "1e+0"];
                }
                else {
                    return [0, "1e+0"];
                }
            }
            else {
                const t = str.split('.');
                // console.log(t);
                if (t.length == 1) {
                    return [str, "1e+0"];
                }
                else {
                    return [t[0] + t[1], `1e+${t[1].length}`];
                }
            }
        }
    }

    const actions = {
        multiplication: {
            value: '*',
            label: 'multiplication',
            func: (a,b) => {
                if (isEhere(a) || isEhere(b)) {
                    return parseFloat(a) * parseFloat(b);
                }
                else {
                    a = removeDot(a);
                    b = removeDot(b);
                    return (parseFloat(a[0]) * parseFloat(b[0])) / (parseFloat(a[1]) * parseFloat(b[1]));
                }
            }
        },
        division: {
            value: '/',
            label: 'division',
            func: (a,b) => {
                a = parseFloat(a);
                b = parseFloat(b);
                if (b == 0) {
                    return "Undefined";
                }
                else {
                    return a / b;
                }
            }
        },
        addition: {
            value: '+',
            label: 'addintion',
            func: (a,b) => {
                if (isEhere(a) || isEhere(b)) {
                    return parseFloat(a) + parseFloat(b);
                }
                else {
                    a = removeDot(a);
                    b = removeDot(b);
                    let a1 = a[1].split('1e+').join(''), b1 = b[1].split('1e+').join('');

                    let maxx = max(parseFloat(a1), parseFloat(b1));
                    for (let i = 0; i < maxx - parseFloat(a1); i++) {
                        a[0] += '0';
                    }
                    for (let i = 0; i < maxx - parseFloat(b1); i++) {
                        b[0] += '0';
                    }
                    return (parseFloat(a[0]) + parseFloat(b[0])) / parseFloat(`1e+${maxx}`);
                }   
            }
        },
        subtraction: {
            value: '-',
            label: 'subtraction',
            func: (a,b) => {
                if (isEhere(a) || isEhere(b)) {
                    return parseFloat(a) - parseFloat(b);
                }
                else {
                    a = removeDot(a);
                    b = removeDot(b);
                    let a1 = a[1].split('1e+').join(''), b1 = b[1].split('1e+').join('');

                    let maxx = max(parseFloat(a1), parseFloat(b1));
                    // console.log(a1, b1, a, b);
                    for (let i = 0; i < maxx - parseFloat(a1); i++) {
                        a[0] += '0';
                    }
                    for (let i = 0; i < maxx - parseFloat(b1); i++) {
                        b[0] += '0';
                    }
                    // console.log(a1, b1, a, b);
                    return (parseFloat(a[0]) - parseFloat(b[0])) / parseFloat(`1e+${maxx}`);
                }
            }
        }
    };

    function calcFunc(expression) {
        expression = expression.split(' ').join('').replaceAll(multiplicationBtn.textContent.trim(), '*').replaceAll('÷', '/');

        function parseBrackets(str) {
            let left = 0, right = 0;
            for (let i = 0; i < str.length; i++) {
                if (str[i] == '(') {
                    let st = i;
                    left++;
                    while (left != right) {
                        i++;
                        if (str[i] == '(') {
                            left++;
                        }
                        else if (str[i] == ')') {
                            right++;
                        }
                    }
                    let subStr = str.substring(st + 1, i);
                    return parseBrackets(str.replace(`(${subStr})`, parseBrackets(subStr)));
                }
            }
            return calcExpr(str);
        }

        function removePercent(str) {
            for (let i = str.length - 1; i >= 0; i--) {
                if (str[i] == '%' && '0' <= str[i - 1] && str[i - 1] <= '9') {
                    let end = i;
                    i--;
                    while ((('0' <= str[i] && str[i] <= '9') || str[i] == '.') && i >= 0) {
                        i--;
                    }
                    if ((str[i] == '-' || str[i] == '+') && str[i - 1] == 'e') {
                        i -= 2;
                        while ((('0' <= str[i] && str[i] <= '9') || str[i] == '.') && i >= 0) {
                            i--;
                        }
                    }
                    let subStr = str.substring(i + 1, end);
                    return removePercent(str.replace(`${subStr}%`, actions.division.func(subStr, 100)));
                }
            }
            return str;
        }

        function matchMultiplicationOrDivision(str) {
            for (let i = 0; i < str.length; i++) {
                if (str[i] == '/' || str[i] == '*') {
                    return 1;
                }
            }
            return 0;
        }

        function calcExpr(str) {
            if (str == 'Undefined') {
                return str;
            }
            str = removePercent(str);
            const out = matchMultiplicationOrDivision(str);
            // console.log(str);
            if (!out) {
                let i = 0;
                if (str[0] == '-') {
                    i++;
                }
                for (; i < str.length; i++) {
                    if (str[i] == '+' && str[i - 1] != 'e') {
                        let num1 = str.substring(0, i),
                            num2,
                            st = i + 1;
                        i++;
                        while ((('0' <= str[i] && str[i] <= '9') || str[i] == '.') && i < str.length) {
                            i++;
                        }
                        if (str[i] == 'e') {
                            i += 2;
                            while ((('0' <= str[i] && str[i] <= '9') || str[i] == '.') && i < str.length) {
                                i++;
                            }
                        }
                        num2 = str.substring(st, i);
                        return calcExpr(str.replace(`${num1}+${num2}`, calcExpr(actions.addition.func(num1, num2))));
                    }
                    else if (str[i] == '-' && str[i - 1] != 'e') {
                        let num1 = str.substring(0, i),
                            num2,
                            st = i + 1;
                        i++;
                        while ((('0' <= str[i] && str[i] <= '9') || str[i] == '.') && i < str.length) {
                            i++;
                        }
                        if (str[i] == 'e') {
                            i += 2;
                            while ((('0' <= str[i] && str[i] <= '9') || str[i] == '.') && i < str.length) {
                                i++;
                            }
                        }
                        num2 = str.substring(st, i);
                        return calcExpr(str.replace(`${num1}-${num2}`, calcExpr(actions.subtraction.func(num1, num2))));
                    }
                }
            }
            else {
                let i = 0;
                for (; i < str.length; i++) {
                    if (str[i] == '*') {
                        let num1,
                            num2,
                            st = i + 1,
                            end = i;
                        i++;
                        while ((('0' <= str[i] && str[i] <= '9') || str[i] == '.') && i < str.length) {
                            i++;
                        }
                        if (str[i] == 'e') {
                            i += 2;
                            while ((('0' <= str[i] && str[i] <= '9') || str[i] == '.') && i < str.length) {
                                i++;
                            }
                        }
                        num2 = str.substring(st, i);
                        i = end - 1;
                        while ((('0' <= str[i] && str[i] <= '9') || str[i] == '.') && i >= 0) {
                            i--;
                        }
                        if ((str[i] == '-' || str[i] == '+') && str[i - 1] == 'e') {
                            i -= 2;
                            while ((('0' <= str[i] && str[i] <= '9') || str[i] == '.') && i >= 0) {
                                i--;
                            }
                        }
                        if (i == 0) {
                            i--;
                        }
                        num1 = str.substring(i + 1, end);
                        // console.log(num1, num2);
                        return calcExpr(str.replace(`${num1}*${num2}`, calcExpr(actions.multiplication.func(num1, num2))));
                    }
                    else if (str[i] == '/') {
                        let num1,
                            num2,
                            st = i + 1,
                            end = i;
                        i++;
                        while ((('0' <= str[i] && str[i] <= '9') || str[i] == '.') && i < str.length) {
                            i++;
                        }
                        num2 = str.substring(st, i);
                        if (str[i] == 'e') {
                            i += 2;
                            while ((('0' <= str[i] && str[i] <= '9') || str[i] == '.') && i < str.length) {
                                i++;
                            }
                        }
                        i = end - 1;
                        while ((('0' <= str[i] && str[i] <= '9') || str[i] == '.') && i >= 0) {
                            i--;
                        }
                        if ((str[i] == '-' || str[i] == '+') && str[i - 1] == 'e') {
                            i -= 2;
                            while ((('0' <= str[i] && str[i] <= '9') || str[i] == '.') && i >= 0) {
                                i--;
                            }
                        }
                        if (i == 0) {
                            i--;
                        }
                        num1 = str.substring(i + 1, end);
                        return calcExpr(str.replace(`${num1}/${num2}`, calcExpr(actions.division.func(num1, num2))));
                    }
                }
            }
            return str;
        }
        
        return parseBrackets(expression);
    }

    function AreaTouch() {
        allResultArea.classList.add('area-touch');
        allResultArea.removeEventListener('mousemove', AreaTouch);
    }

    function addBlueBorder() {
        allResultArea.classList.add('blue-border');
        allResultArea.classList.remove('area-touch');
    }

    function clearArea() {
        // console.log(2, flagForClickClear);
        if ((resultAreaText.textContent == '0' && !flagForTimer) || checkForTimer) {
            resultPreviousAreaText.textContent = 'Ans = 0';
        }
        else if (!flagForTimer) {
            resultAreaText.textContent = '0';
            resultPreviousAreaText.textContent = `Ans = ${resultAns}`;
        }
        flagForTimer = 1;
        flagForNumber = 1;
        firstNumberDigit = 0;
        leftBracketCounter = 0;
        rightBracketCounter = 0;
        dotCounter = 0;
        itsStartZero = 1;
    }

    function removeLastSymbol(s, ok = 0) {
        if (!ok) {
            if (lastSymbol(s) == '.') {
                dotCounter = 0;
            }
            s = s.substring(0, s.length - 1);
        }
        else {
            s = s.substring(0, s.length - 3);
        }
        return s;
    }

    function removeLastSymbolforClear(s) {
        if (lastSymbol(s) == ' ') {
            s = removeLastSymbol(s, 1);
        }
        else {
            if (lastSymbol(s) == '(') {
                leftBracketCounter--;
            }
            else if (lastSymbol(s) == ')') {
                rightBracketCounter--;
            }
            s = removeLastSymbol(s);
        }
        
        if (s.length == 0) {
            s = '0';
            firstNumberDigit = 0;
            itsStartZero = 1;
            flagForNumber = 1;
            if (!flagForClickClear && !checkForTimer) {
                checkForTimer = 1;
                clearTimer = setTimeout(clearArea, 700);
            }
        }
        else if ('0' <= lastSymbol(s) && lastSymbol(s) <= '9') {
            flagForNumber = 1;
            if (lastSymbol(s) == '0' && !('0' <= s[s.length - 2] && s[s.length - 2] <= '9')) {
                firstNumberDigit = 0;
            }
        }
        else {
            flagForNumber = 0;
        }
        return s;
    }
    
    function removeAnimationToResultsAreas() {
        resultPreviousAreaText.classList.remove('fade');
        resultAreaText.classList.remove('move');

        setTimeout(addAnimationToResultsAreas, 1);

        function addAnimationToResultsAreas() {
            resultPreviousAreaText.classList.add('fade');
            resultAreaText.classList.add('move');
        }
    }

    function lastSymbol(s) {
        return s[s.length - 1];
    }

    function isDescendant(parent, child) {
        while (parent != child && child) {
            child = child.parentNode;
        }
        return (parent == child);
    }

    document.addEventListener('click', (e) => {
        const obj = e.target;

        if (!flagForTimer) {
            clearInterval(clearTimer);
        }

        if (isDescendant(resultArea, obj)) {
            addBlueBorder();
        }
        else if (obj && obj.classList.contains('operations__buttons-btn')) {
            if (resultPreviousAreaText.textContent === '') {
                resultPreviousAreaText.textContent += 'Ans = 0';
            }

            if (clearBtn.textContent == 'AC') {
                clearBtn.textContent = 'CE';
            }

            if (obj.classList.contains('for-equal')) {
                addEqual();
            }
            else if (obj.classList.contains('for-clear')) {
                if (!flagForTimer) {
                    resultAreaText.textContent = removeLastSymbolforClear(resultAreaText.textContent);
                    flagForTimer = 1;
                }

                if (flagForEqual) {
                    clearArea();
                    flagForEqual = 0;
                }
            }
            else if (obj.classList.contains('for-op')) {
                addOperation(obj.textContent);
            }
            else if (obj == leftBracket || obj == rightBracket) {
                addBracket(obj.textContent);
            }
            else if (obj.classList.contains('for-number')) {
                addDigit(obj.textContent);
            }

            addBlueBorder();
        }
        else {
            allResultArea.classList.remove('blue-border');
            allResultArea.addEventListener('mousemove', AreaTouch);
        }

        if (currentBtn != -1) {
            if (!currentBtn.classList.contains('for-equal')) {
                currentBtn.classList.remove('gray-border');
            }
            else {
                currentBtn.classList.remove('equal-border');
            }
            currentBtn = -1;
        }
    });

    allBtns.forEach(item => {
        item.addEventListener('mousedown', () => {
            if (!item.classList.contains('for-equal')) {
                item.classList.add('gray-border');
            }
            else {
                item.classList.add('equal-border');
            }

            allResultArea.classList.remove('blue-border');
            currentBtn = item;

            if (item.classList.contains('for-clear')) {
                flagForTimer = 0;
                clearTimer = setTimeout(clearArea, 700);
            }
        });
    });

    const digitNums = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '.'];
    const operations = new Map().set('+', ' + ').set('-', ' - ').set('*', multiplicationBtn.textContent).set('/', ' ÷ ').set('%', '%');
    const bracket = [')', '('];

    document.addEventListener('keydown', (e) => {
        if (allResultArea.classList.contains('blue-border')) {
            digitNums.forEach(item => {
                if (e.key == item) {
                    addDigit(item);
                    check = 1;
                }
            });
    
            operations.forEach((item, itemKey) => {
                if (e.key == itemKey) {
                    addOperation(item);
                    check = 1;
                }
            });
    
            if (e.key == 'Backspace') {
                flagForClickClear = 0;
                resultAreaText.textContent = removeLastSymbolforClear(resultAreaText.textContent);
                check = 1;
            }
    
            bracket.forEach(item => {
                if (e.key == item) {
                    addBracket(item);
                    check = 1;
                }
            });
    
            if (e.key == '=' || e.key == 'Enter') {
                addEqual();
                check = 1;
            }
    
            if (resultPreviousAreaText.textContent === '' && check) {
                resultPreviousAreaText.textContent += 'Ans = 0';
            }
        }
    });

    document.addEventListener('keyup', (e) => {
        if (e.key == 'Backspace') {
            if (!flagForClickClear) {
                clearInterval(clearTimer);
            }
            checkForTimer = 0;
            flagForClickClear = 1;
        }
    });
});