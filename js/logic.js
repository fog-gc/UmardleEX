//半角数字→全角数字メソッド
function toFullWidth(str) {
    return str.replace(/[0-9]/g, s =>
        String.fromCharCode(s.charCodeAt(0) + 0xFEE0)
    );
}

//ひらがな→カタカナメソッド
export function hiraToKata(str) {
    return str.replace(/[\u3041-\u3096]/g, function (match) {
        return String.fromCharCode(match.charCodeAt(0) + 0x60);
    });
}

//入力名の解答比較数列返却メソッド（全角文字列）
export function umardle(answer, input) {
    // 1文字ずつ配列化
    const ansArray = [...answer];
    const inputArray = [...input];
    let resultArray = [];

    const len = Math.min(input.length, answer.length);

    // ① 完全一致チェック（2）
    for (let i = 0; i < len; i++) {
        //inputとanswerの文字と位置が両方正しいとき、resultのその位置に２
        if (inputArray[i] === ansArray[i]) {
            resultArray[i] = '2';
        }
    }

    // ② 存在チェック（1 / 0）
    for (let i = 0; i < input.length; i++) {
        // resultに既に２がセットさせているならスキップ
        if (resultArray[i] != null) {
            continue;
        }

        //inputのi番目がanswerに存在すれば１、なければ０
        if (ansArray.includes(inputArray[i])) {
            resultArray[i] = '1';
        } else {
            resultArray[i] = '0';
        }
    }

    const result = resultArray.join("");
    return toFullWidth(result);
}

//入力名の解答比較数列返却メソッド（半角配列）
export function umardleArray(answer, input) {
    // 1文字ずつ配列化
    const ansArray = [...answer];
    const inputArray = [...input];
    let resultArray = [];

    const len = Math.min(input.length, answer.length);

    // ① 完全一致チェック（2）
    for (let i = 0; i < len; i++) {
        //inputとanswerの文字と位置が両方正しいとき、resultのその位置に２
        if (inputArray[i] === ansArray[i]) {
            resultArray[i] = '2';
        }
    }

    // ② 存在チェック（1 / 0）
    for (let i = 0; i < input.length; i++) {
        // resultに既に２がセットさせているならスキップ
        if (resultArray[i] != null) {
            continue;
        }

        //inputのi番目がanswerに存在すれば１、なければ０
        if (ansArray.includes(inputArray[i])) {
            resultArray[i] = '1';
        } else {
            resultArray[i] = '0';
        }
    }

    return resultArray;
}