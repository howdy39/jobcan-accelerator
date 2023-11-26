console.info('loading jobcan-accelerator');

// 出勤簿のテーブルを取得
const table = document.getElementsByClassName("table-responsive")[0].firstElementChild;

// th要素とtr要素を取得
const headers = table.getElementsByTagName("th");
const rows = table.getElementsByTagName("tbody")[0].getElementsByTagName("tr");
const footers = table.getElementsByTagName("tfoot")[0].getElementsByTagName("td");


// "労働時間"と一致するth要素を検索
let columnIndex = 0;
while (headers[columnIndex] && headers[columnIndex].innerText !== "労働時間") {
    columnIndex++;
}

if (!headers[columnIndex]) {
    console.error('労働時間列が見つかりませんでした');
}
    
// ヘッダーに新しいth要素を作成し、赤いテキストで"通算の差分"を表示
const newHeader = headers[columnIndex].cloneNode();
newHeader.innerHTML = "<font color='red'>通算の差分</font>";
headers[columnIndex].parentNode.insertBefore(newHeader, headers[columnIndex].nextSibling);

// フッターに"通算の差分"と同じ位置に新しいtr要素を作成
const footerColumnIndex = columnIndex-2;
const newFooter = footers[footerColumnIndex].cloneNode();
newFooter.innerHTML = "<font color='red'></font>";
footers[footerColumnIndex].parentNode.insertBefore(newFooter, footers[footerColumnIndex].nextSibling);

let totalHours = 0;
let totalMinutes = 0;

// 各行に対して処理
for (let rowIndex = 0; rowIndex < rows.length; rowIndex++) {
    const cells = rows[rowIndex].getElementsByTagName("td");
    const timeMatch = cells[columnIndex].innerText.match(/^(\d\d):(\d\d)$/);

    let cellHTML = ''

    // 時間の形式に一致する場合
    if (timeMatch) {
        const hours = parseInt(timeMatch[1]);
        const minutes = parseInt(timeMatch[2]);

        // 時間を計算
        totalHours += hours;
        totalMinutes += minutes;

        if (totalMinutes >= 60) {
            totalMinutes -= 60;
            totalHours++;
        }

        totalHours -= 8;

        // 差分を表示
        const timeDiff = (totalHours >= 0 ? "+" : "-") + Math.abs(totalHours) + ":" + String(totalMinutes).padStart(2, "0");
        cellHTML = "<font color='red'>" + timeDiff + "</font>";
    }

    // 新しいtd要素を作成し、差分ないし空文字を表示
    const newCell = cells[columnIndex].cloneNode();
    newCell.innerHTML = cellHTML;
    cells[columnIndex].parentNode.insertBefore(newCell, cells[columnIndex].nextSibling);

}