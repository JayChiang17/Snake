const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");
// getContext() method會回傳一個canvas的drawing context，
// drawing context可以用來在canvas內畫圖
const unit = 20;
const row = canvas.height / unit; // 320 / 20 = 16
const column = canvas.width / unit; // 320 / 20 = 16

let snake = []; // array中的每個元素，都是一個物件
function createSnake() {
  // 物件的工作是，儲存身體的x, y座標
  // 蛇的每個部分是一個帶有 x 和 y 座標的物件
  snake[0] = { x: 80, y: 0 }; // 蛇頭
  snake[1] = { x: 60, y: 0 }; // 蛇身的第一部分
  snake[2] = { x: 40, y: 0 }; // 蛇身的第二部分
  snake[3] = { x: 20, y: 0 }; // 蛇身的第三部分
}

class Fruit {
  // 構造函數：當創建一個新的 Fruit 實例時，它將被自動調用
  constructor() {
    // 為水果隨機生成 x 和 y 座標，並保證其在畫布的單元格內
    this.x = Math.floor(Math.random() * column) * unit;
    this.y = Math.floor(Math.random() * row) * unit;
  }

  // 方法：用於在畫布上繪製水果
  drawFruit() {
    // 設置蘋果的主體顏色
    ctx.fillStyle = "red";

    // 開始繪製蘋果的路徑
    ctx.beginPath();
    ctx.arc(this.x + unit / 2, this.y + unit / 2, unit / 2, 0, Math.PI * 2);
    ctx.closePath();
    ctx.fill();

    // 添加蘋果的亮點（為了讓蘋果看起來更立體）
    ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
    ctx.beginPath();
    ctx.arc(this.x + unit / 3, this.y + unit / 3, unit / 8, 0, Math.PI * 2);
    ctx.closePath();
    ctx.fill();

    // 繪製蘋果的蒂
    ctx.fillStyle = "brown";
    ctx.fillRect(this.x + unit / 2 - unit / 10, this.y, unit / 5, unit / 5);
  }

  // 方法：為水果隨機選擇一個新的位置
  pickALocation() {
    // 宣告一個布爾變量，用來檢查新位置是否與蛇的身體重疊
    let overlapping = false;
    // 宣告新位置的 x 和 y 座標變量
    let new_x;
    let new_y;

    // 內部函數：檢查新位置是否與蛇的身體部分重疊
    function checkOverlap(new_x, new_y) {
      // 遍歷蛇的每一節
      for (let i = 0; i < snake.length; i++) {
        // 如果新位置與蛇的某一節位置相同
        if (new_x == snake[i].x && new_y == snake[i].y) {
          // 輸出日誌信息
          console.log("overlapping...");
          // 將重疊標記設為 true
          overlapping = true;
          // 結束函數
          return;
        } else {
          // 如果不重疊，重疊標記設為 false
          overlapping = false;
        }
      }
    }
    // 重複執行，直到找到一個不與蛇身體重疊的位置
    do {
      // 隨機生成新的 x 座標
      new_x = Math.floor(Math.random() * column) * unit;
      // 隨機生成新的 y 座標
      new_y = Math.floor(Math.random() * row) * unit;
      // 檢查新生成的位置是否重疊
      checkOverlap(new_x, new_y);
      // 如果重疊，則繼續循環
    } while (overlapping);

    // 將水果的位置設置為新生成的位置
    this.x = new_x;
    this.y = new_y;
  }
}

// 初始設定
createSnake();
let myFruit = new Fruit(); // 創建新的水果物件
window.addEventListener("keydown", changeDirection); // 添加鍵盤事件監聽器以處理方向改變
let d = "Right"; // 設置初始方向為向右
// 定義改變方向的函數
function changeDirection(e) {
  // 如果按下右箭頭鍵且當前方向不是左，改變方向為向右
  if (e.key == "ArrowRight" && d != "Left") {
    d = "Right";
    // 如果按下下箭頭鍵且當前方向不是上，改變方向為向下
  } else if (e.key == "ArrowDown" && d != "Up") {
    d = "Down";
    // 如果按下左箭頭鍵且當前方向不是右，改變方向為向左
  } else if (e.key == "ArrowLeft" && d != "Right") {
    d = "Left";
    // 如果按下上箭頭鍵且當前方向不是下，改變方向為向上
  } else if (e.key == "ArrowUp" && d != "Down") {
    d = "Up";
  }

  // 每次按下上下左右鍵之後，在下一幀被畫出來之前，
  // 不接受任何keydown事件
  // 這樣可以防止連續按鍵導致蛇在邏輯上自殺
  window.removeEventListener("keydown", changeDirection);
}
let highestScore; // 宣告一個變量用於儲存最高分數
loadHighestScore(); // 加載最高分數
let score = 0; // 初始化當前分數為 0
document.getElementById("myScore").innerHTML = "Game Score:" + score; // 顯示當前分數
document.getElementById("myScore2").innerHTML = "Highest Score:" + highestScore; // 顯示最高分數

function draw() {
  // 每次畫圖之前，確認蛇有沒有咬到自己
  for (let i = 1; i < snake.length; i++) {
    // 比較蛇頭和蛇身的每個部分的座標
    if (snake[i].x == snake[0].x && snake[i].y == snake[0].y) {
      // 如果蛇頭的座標與蛇身任何一部分的座標相同，則結束遊戲
      clearInterval(myGame); // 停止遊戲循環
      document.getElementById("gameOverContainer").style.display = "block"; // 顯示遊戲結束消息
      return; // 結束 draw 函數的執行
    }
  }

  ctx.fillStyle = "black"; // 背景全設定為黑色
  ctx.fillRect(0, 0, canvas.width, canvas.height); // 繪製一個覆蓋整個畫布的黑色矩形

  myFruit.drawFruit(); // 調用 Fruit 實例的 drawFruit 方法來繪製水果

  // 劃出蛇
  for (let i = 0; i < snake.length; i++) {
    // 如果是蛇的第一部分（頭），設置為淺綠色；否則設置為淺藍色
    if (i == 0) {
      ctx.fillStyle = "red";
    } else {
      ctx.fillStyle = "lightblue";
    }

    // 為蛇的每個部分設置邊框顏色
    ctx.strokeStyle = "white";

    // 如果蛇的某部分超出畫布右邊界，從左邊界重新出現
    if (snake[i].x >= canvas.width) {
      snake[i].x = 0;
    }

    // 如果蛇的某部分超出畫布左邊界，從右邊界重新出現
    if (snake[i].x < 0) {
      snake[i].x = canvas.width - unit;
    }

    // 如果蛇的某部分超出畫布下邊界，從上邊界重新出現
    if (snake[i].y >= canvas.height) {
      snake[i].y = 0;
    }

    // 如果蛇的某部分超出畫布上邊界，從下邊界重新出現
    if (snake[i].y < 0) {
      snake[i].y = canvas.height - unit;
    }

    // x, y, width, height
    ctx.beginPath();
    ctx.arc(
      snake[i].x + unit / 2,
      snake[i].y + unit / 2,
      unit / 2,
      0,
      Math.PI * 2
    );
    //ctx.arc() 方法用於繪製圓形。
    //其中的參數 snake[i].x + unit / 2
    //和 snake[i].y + unit / 2 分別是圓心的 x 和 y 座標，unit / 2 是圓的半徑，0
    //和 Math.PI * 2 分別是圓的起始角度和結束角度。
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  }

  // 以目前的d變數方向，來決定蛇的下一幀要放在哪個座標
  let snakeX = snake[0].x; // snake[0]是一個物件，但snake[0].x是個number
  let snakeY = snake[0].y; // 獲取蛇頭的 y 座標
  if (d == "Left") {
    snakeX -= unit; // 向左移動時，減少 x 座標
  } else if (d == "Up") {
    snakeY -= unit; // 向上移動時，減少 y 座標
  } else if (d == "Right") {
    snakeX += unit; // 向右移動時，增加 x 座標
  } else if (d == "Down") {
    snakeY += unit; // 向下移動時，增加 y 座標
  }

  let newHead = {
    // 創建一個新的蛇頭物件，用於更新蛇的位置
    x: snakeX,
    y: snakeY,
  };

  // 確認蛇是否有吃到果實
  // 確認蛇頭（snake[0]）的位置是否與果實的位置相同
  if (snake[0].x == myFruit.x && snake[0].y == myFruit.y) {
    // 如果蛇吃到了果實，隨機生成新的果實位置
    myFruit.pickALocation();
    score++; // 分數增加
    setHighestScore(score); // 更新最高分數
    document.getElementById("myScore").innerHTML = "Game Score:" + score; // 在網頁上顯示當前分數
    document.getElementById("myScore2").innerHTML =
      "Highest Score:" + highestScore; // 在網頁上顯示最高分數
  } else {
    snake.pop(); // 如果沒有吃到果實，移除蛇的最後一節
  }

  snake.unshift(newHead); // 將新的蛇頭添加到蛇的前面
  window.addEventListener("keydown", changeDirection); // 為鍵盤按下事件添加監聽器，以改變蛇的移動方向
}

let myGame = setInterval(draw, 100); // 這行代碼是在 JavaScript 中使用 setInterval 函數來設置一個定時器，它會定期（每 100 毫秒）執行 draw 函數。
function loadHighestScore() {
  // 從本地存儲中獲取 'highestScore' 項目
  if (localStorage.getItem("highestScore") == null) {
    // 如果本地存儲中沒有 'highestScore' 項目，則將最高分數設為 0
    highestScore = 0;
  } else {
    // 如果本地存儲中有 'highestScore' 項目，則讀取並轉換為數字
    highestScore = Number(localStorage.getItem("highestScore"));
  }
}

function setHighestScore(score) {
  if (score > highestScore) {
    localStorage.setItem("highestScore", score);
    highestScore = score;
  }
}
