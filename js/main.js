import * as data from '../data/data.js';
import * as logic from './logic.js';

//入力欄
const inputEl = document.getElementById("input");
//ボタン
const startEl = document.getElementById("start");
const btnGUEl = document.getElementById("btnGU");
const btnResetEl = document.getElementById("btnReset");
//表示
const raceNumEl = document.getElementById("raceNum");
const hintEl = document.getElementById("hint");
const correctEl = document.getElementById("correct");
const errorEl = document.getElementById("error");
const giveUpEl = document.getElementById("giveUp");
//設定値
const gamemode = document.getElementById("gamemode");
const container = document.getElementById('box-container');

//ゲームモード、解答仮設定
let tableData = data.OriginalData;
let ansId = Math.floor(Math.random() * tableData.length) + 1;
let hint1 = tableData[ansId][0];
let hint2 = tableData[ansId][1];
let answer = tableData[ansId][2];

//レースカウント
let raceNum = 1;
raceNumEl.textContent = `第1レース`;


//ゲームモード変更イベント
gamemode.addEventListener("change", () => {
  switch (gamemode.value) {
    case '2021':
      tableData = data.OriginalData;
      break;

    case 'all':
      tableData = data.horseAllData;
      break;

    case 'recent':
      tableData = data.recentData;
      break;

    case 'umamusume':
      tableData = data.umamusumeData;
      break;

    default:
      tableData = data.OriginalData;
      break;
  }
  //解答をテーブルに併せて変更
  setAns();
});

//出走ボタンのイベント
// 1. ボタンクリック時
startEl.addEventListener("click", submitInput);

// 2. 入力欄（inputEl）でEnterが押された時
// 20260608 Update ----
//MacEnterKey対応
let isComposing = false;
 inputEl.addEventListener("compositionstart", () => {
  isComposing = true;
});
 inputEl.addEventListener("compositionend", () => {
  isComposing = false;
});
inputEl.addEventListener("keydown", (event) => {
  if (event.key === "Enter" && !isComposing) {
    submitInput();
  }
});
// 20260608 Update end ---

//ギブアップボタンのclickイベント
btnGUEl.addEventListener("click", giveUp);

//リセットボタンのclickイベント
btnResetEl.addEventListener("click", () => {
  //解答リセット
  setAns()

  //レース番号リセット
  raceNum = 1;
  raceCount();

  //表示削除
  container.innerHTML = "";
  hintEl.textContent = "";
  correctEl.textContent = "";
  errorEl.textContent = "";
  giveUpEl.textContent = "";

  //ボタン有効化
  startEl.disabled = false;
  gamemode.disabled = false;
});

//解答セット関数
function setAns() {
  ansId = Math.floor(Math.random() * tableData.length) + 1;
  hint1 = tableData[ansId][0];
  hint2 = tableData[ansId][1];
  answer = tableData[ansId][2];
}

//レース番号表示DOM
function raceCount() {
  raceNumEl.textContent = `第${raceNum}レース`;
}

//give up表示DOM
function giveUp() {
  //エラー表示を削除
  errorEl.textContent = "";
  //正解表示
  giveUpEl.textContent = "本日のレースは終了しました……（正解：" + answer + "）"
  //判定ボタンを無効化
  startEl.disabled = true;
}

//umardle判定
function checkAnswer(inputValue) {
  // 1. カタカナに変換
  const input = logic.hiraToKata(inputValue);

  // 2. inputがtableDataにあるかどうかチェック
  if (!tableData.find(row => row[2] === input)) {
    // エラーを表示して終了
    errorEl.textContent = "入力エラー。リストに無い馬名です。";
    return; // ここで処理を抜ける（ネストを浅くするテクニックです）
  }

  // 以降はリストに存在する（正しい入力）の場合の処理
  errorEl.textContent = "";

  // 結果表示DOM起動
  raceResultArray(answer, input);

  // レース数カウント
  raceNum += 1;
  raceCount(); // ※元のコードで2回連続で呼ばれていたので整理が必要かもしれません

  // レース数表示更新 or 12レース経過でgive up
  if (raceNum > 12) {
    giveUp();
  } else {
    raceCount();
  }

  // レース数でヒント表示
  updateHint();

  // 正解表示
  if (input === answer) {
    correctEl.textContent = "正解しました！おめでとうございます！";
  }
}

// ヒント表示
function updateHint() {
  if (raceNum > 10) {
    if (gamemode.value === 'umamusume') {
      hintEl.textContent = `ヒント：${answer.length}文字 / ${hint1} / メインカラー：${hint2}`;
    } else {
      hintEl.textContent = `ヒント：${answer.length}文字 / ${hint1} / ${hint2}年`;
    }
  } else if (raceNum > 8) {
    hintEl.textContent = `ヒント：${answer.length}文字 / ${hint1}`;
  } else if (raceNum > 5) {
    hintEl.textContent = `ヒント：${answer.length}文字`;
  }
}

//入力確定処理
function submitInput() {
  const value = inputEl.value;
  if (!value) return; // 空欄なら何もしない

  // ゲームモードを固定
  document.getElementById("gamemode").disabled = true;

  // メインロジックを実行
  checkAnswer(value);

  // 入力欄を空欄に戻す
  inputEl.value = "";
}

//レース結果表示DOM
function raceResultArray(answer, input) {
  //正解の馬名とinputを比較した数列の配列を格納
  const resultArray = logic.umardleArray(answer, input);
  const inputArray = [...input];

  //行用のラッパーを作成
  const row = document.createElement('div');
  row.classList.add('result-row');

  //1文字ずつボックスに格納
  for (let i = 0; i < inputArray.length; i++) {
    const box = document.createElement('div');
    box.textContent = inputArray[i];
    box.classList.add('char-box');
    box.classList.add(`color-${resultArray[i]}`);

    //rowに追加
    row.appendChild(box);
  }

  //containerに行ごと追加
  container.append(row);
}