// 掲示板関連のJavaScript（scriptは別のJavaScriptファイルに分離）

// データ入力＆保存
async function addData() {
    // async = 非同期関数として宣言。この関数内でawaitキーワードを使用する。
    // function addData() = addDataという名前の関数を宣言。データの入力と保存を処理する。
        const input1 = document.getElementById('input1').value;
        // document.getElementById('inputX').value = HTMLドキュメントからidがinputXの要素の値を取得する。(Xは1～9)
        const input2 = document.getElementById('input2').value;
        const input3 = document.getElementById('input3').value;
        const input4 = document.getElementById('input4').value;
        const input5 = document.getElementById('input5').value;
        const input6 = document.getElementById('input6').value;
        const input7 = document.getElementById('input7').value;
        const input8 = document.getElementById('input8').value;
        const input9 = document.getElementById('input9').value;
    
        const data = {
            purposeIdx: input1,
            message: input2,
            mean: parseFloat(input3),
            meanAddPhrase: parseFloat(input4),
            meanAddMor: parseFloat(input5),
            meanAddAll: parseFloat(input6),
            runningTime: input7,
            yesValue: parseFloat(input8),
            noValue: parseFloat(input9),
            confirmStatus: false
        };
        
        // サーバーにデータを送信
        try {
        // try = エラーが発生する可能性のあるコードブロックを開始。エラーが発生するとcatchブロックで処理
            const response = await fetch('セキュリティ上の理由で削除しました。/boardDB/firstmessages', {
            // fetch APIを使用して非同期HTTPリクエストを送信
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                // リクエストヘッダーを設定。送信するデータがJSON形式であることを指定
                body: JSON.stringify(data)
                // リクエストボディに送信するデータをJSON文字列に変換して設定
            });
    
            const result = await response.json();
            // サーバーからの応答をJSON形式に変換
            if (response.ok) {
                alert('データが正常に挿入されました');
                // データ挿入が成功したことを知らせるアラートを表示
                location.reload();  // ページを再読み込み
                // ページを再読み込みして変更を反映
            } else {
                alert('エラー: ' + result.detail);
                // 応答が成功しなかった場合、エラーメッセージを表示
            }
        } catch (error) {
        // tryでエラーが発生した場合
            console.error('エラー:', error);
            // コンソールにエラーを出力
            alert('データ挿入に失敗しました');
            // データ挿入の失敗を知らせるアラートを表示
        }
    }
    
    // メッセージ送信関数
    async function sendMessage(messageId) {
    // async = 非同期関数を定義。awaitキーワードを使用できる
    // function sendMessage(messageId) = sendMessageという名前の関数を定義。messageIdというパラメータを受け取る
        try {
        // try = エラーが発生する可能性のあるコードブロックを開始。エラーが発生するとcatchブロックで処理
            const response = await fetch(`セキュリティ上の理由で削除しました。/boardDB1/firstmessages/${messageId}`, {
            // fetch関数はネットワークリクエストを行う。awaitキーワードはこのリクエストが完了するのを待つ
                method: 'PUT',
                // リクエストのオプション。HTTP PUTリクエストを使用
                headers: { 'Content-Type': 'application/json' }
                // リクエストヘッダーを設定。送信するデータがJSON形式であることを指定
            });
    
            if (!response.ok) throw new Error('メッセージ送信に失敗しました');
            // response.okがfalseの場合、エラーを発生させる。これはリクエストが成功しなかったことを意味する
    
            const result = await response.json();
            // response.json() = 応答本文をJSONにパース。awaitキーワードを使用してパースが完了するのを待つ
    
            const sendDateElement = document.querySelector(`#sendDate-${messageId}`);
            // document.querySelector = CSSセレクタを使用してドキュメントから要素を選択
            // ここで'#sendDate-${messageId}'はIDがsendDate-messageIdの要素を選択
            if (sendDateElement) {
            // sendDateElementが存在するか確認
                const sendDate = new Date(result.sendDate);
                // result.sendDateをDateオブジェクトに変換
                const formattedSendDate = `${sendDate.getFullYear()}-${String(sendDate.getMonth() + 1).padStart(2, '0')}-${String(sendDate.getDate()).padStart(2, '0')} ${String(sendDate.getHours()).padStart(2, '0')}:${String(sendDate.getMinutes()).padStart(2, '0')}:${String(sendDate.getSeconds()).padStart(2, '0')}`;
                // sendDateをフォーマットされた文字列に変換。年、月、日、時間、分、秒をそれぞれ2桁の数字でフォーマット
                sendDateElement.innerText = formattedSendDate;
                // sendDateElementのテキスト内容をformattedSendDateに設定
            }
            alert('メッセージが正常に送信および更新されました');
            // メッセージ送信が成功したことを知らせるアラートメッセージを表示
        } catch (error) {
        // tryでエラーが発生した場合
            console.error('エラー:', error);
            // コンソールにエラーを出力
            alert('メッセージ送信に失敗しました');
            // メッセージ送信の失敗を知らせるアラートを表示
        }
    }
    
    // テーブル2、3のデータ取得機能
    async function loadData() {
    // loadDataという名前の非同期関数を定義。async = 関数が非同期的に実行され、awaitキーワードを使用できる
        // table2のデータをロード(boardDB2)
        try {
        // try = エラーが発生する可能性のあるコードブロックを開始。エラーが発生するとcatchブロックで処理
            const response2 = await fetch('セキュリティ上の理由で削除しました。/boardDB2/firstmessages');
            // fetch関数は指定されたURLにHTTPリクエストを送信。awaitキーワードでリクエストが完了するのを待つ
            const data2 = await response2.json();
            // 応答オブジェクトresponse2からJSONデータを抽出。awaitキーワードを使ってデータ抽出が完了するのを待つ
            console.log('table2のデータ:', data2);
            // コンソールにdata2を出力して確認。デバッグに役立つ
            const table2Body = document.getElementById('team2Data');
            // HTMLドキュメントからIDがteam2Dataの要素を選択。データを挿入するテーブルの本文
            data2.forEach(item => {
            // data2配列の各要素について繰り返し。各要素はitemとして参照
                const row = document.createElement('tr');
                // 新しいテーブル行(tr)要素を生成
                row.innerHTML = `<td>${item.messageId}</td><td>${item.message}</td>`;
                // 行のHTML内容を設定。各行にはmessageIdとmessageの値が含まれる
                table2Body.appendChild(row);
                // 生成した行をテーブル本文に追加
            });
        } catch (error) {
        // tryでエラーが発生した場合に実行
            console.error('table2のデータ取得エラー:', error);
            // エラーメッセージをコンソールに出力して記録
        }
    
        // table23のデータをロード(boardDB3)
        try {
        // try = エラーが発生する可能性のあるコードブロックを開始。エラーが発生するとcatchブロックで処理
            const response3 = await fetch('セキュリティ上の理由で削除しました。/boardDB3/firstmessages');
            // fetch関数は指定されたURLにHTTPリクエストを送信。awaitキーワードでリクエストが完了するのを待つ
            const data3 = await response3.json();
            // 応答オブジェクトresponse3からJSONデータを抽出。awaitキーワードを使ってデータ抽出が完了するのを待つ
            console.log('table23のデータ:', data3);
            // コンソールにdata3を出力して確認。デバッグに役立つ
            const table23Body = document.getElementById('allData');
            // HTMLドキュメントからIDがteam23Dataの要素を選択。データを挿入するテーブルの本文
            data3.forEach(item => {
            // data3配列の各要素について繰り返し。各要素はitemとして参照
                const row = document.createElement('tr');
                // 新しいテーブル行(tr)要素を生成
                row.innerHTML = `<td>${item.messageId}</td><td>${item.message}</td>`;
                // 行のHTML内容を設定。各行にはmessageIdとmessageの値が含まれる
                table23Body.appendChild(row);
                // 生成した行をテーブル本文に追加
            });
        } catch (error) {
        // tryでエラーが発生した場合に実行
            console.error('table23のデータ取得エラー:', error);
            // エラーメッセージをコンソールに出力して記録
        }
    }    

// テーブル1を照会と修正
async function loadDataTable1() {
// loadDataTable1という名前の非同期関数を定義。async = 関数が非同期で実行され、awaitキーワードを使用できる
    try {
    // try = エラーが発生する可能性のあるコードブロックを開始。エラーが発生すると、catchブロックで処理する
        const response1 = await fetch('セキュリティ上の理由で削除しました。/boardDB1/firstmessages');
        // fetch関数は指定されたURLにHTTPリクエストを送信。awaitキーワードを使用してリクエストが完了するまで待機
        const data1 = await response1.json();
        // 応答オブジェクトresponse1からJSONデータを抽出。awaitキーワードを使用してデータ抽出が完了するまで待機
        console.log('Data for table1:', data1);
        // コンソールにdata1を出力して確認。デバッグに便利
        const table1Body = document.getElementById('personalData');
        // HTML文書からIDがteam1Dataの要素を選択。tbody要素を保存する変数
        const firstMessagesMap = {};
        // 空のオブジェクトを宣言してfirstmessages行を保存する変数

        // まず、firstmessagesをレンダリング
        data1.forEach(item => {
        // data1配列の各要素に対してコールバック関数を実行。item = 配列の各要素を表す
            const sendDate = item.sendDate ? new Date(item.sendDate) : null;
            // sendDate値が存在すればDateオブジェクトに変換し、存在しなければnullを保存
            const formattedSendDate = sendDate ? `${sendDate.getFullYear()}-${String(sendDate.getMonth() + 1).padStart(2, '0')}-${String(sendDate.getDate()).padStart(2, '0')} ${String(sendDate.getHours()).padStart(2, '0')}:${String(sendDate.getMinutes()).padStart(2, '0')}:${String(sendDate.getSeconds()).padStart(2, '0')}` : '';
            // sendDateが存在すればフォーマットされた文字列を保存し、そうでなければ空の文字列を保存

            const row = document.createElement('tr');
            // 新しいtr要素を生成
            // row.innerHTML = 生成された行(tr)の内部HTMLを設定
            // column-messageId = テーブルデータ(td)要素を生成し、itemオブジェクトのmessageId値を入れる
            row.innerHTML = `
                <td class="column-messageId">${item.messageId}</td>
                <td class="column-purpose">${item.purposeIdx}</td>
                <td class="column-message">${item.message}</td>
                <td class="column-mean">${item.mean}</td>
                <td class="column-meanAddPhrase">${item.meanAddPhrase}</td>
                <td class="column-meanAddMor">${item.meanAddMor}</td>
                <td class="column-meanAddAll">${item.meanAddAll}</td>
                <td class="column-runningTime">${item.runningTime}</td>
                <td class="column-sendDate" id="sendDate-${item.messageId}">${formattedSendDate}</td>
                <td class="column-receiveDate" id="receiveDate-${item.messageId}">
                    <button class="sendbutton" onclick="sendMessage('${item.messageId}')">メッセージ送り</button>
                </td>
                <td class="column-yesValue">${item.yesValue}</td>
                <td class="column-noValue">${item.noValue}</td>
                <td class="column-confirmStatus">${item.confirmStatus}</td>
            `;
            table1Body.appendChild(row);
            // 生成された行をテーブルに追加
            
            firstMessagesMap[item.messageId] = row;
            // オブジェクトにmessageIdをキーとして行(tr)を保存
        });

        // answermessagesを取得してレンダリング
        const responseAnswer = await fetch('セキュリティ上の理由で削除しました。/boardDB1/answermessages');
        // サーバー応答を保存する変数
        const answerData = await responseAnswer.json();
        // JSONに変換されたanswermessagesデータを保存する変数
        console.log('Data for answermessages:', answerData);
        // コンソールにanswerDataを出力して確認。デバッグに便利

        answerData.forEach(item => {
        // answerData配列の各要素に対してコールバック関数を実行
            const sendDate = new Date(item.sendDate);
            // sendDate定数名
            const formattedSendDate = `${sendDate.getFullYear()}-${String(sendDate.getMonth() + 1).padStart(2, '0')}-${String(sendDate.getDate()).padStart(2, '0')} ${String(sendDate.getHours()).padStart(2, '0')}:${String(sendDate.getMinutes()).padStart(2, '0')}:${String(sendDate.getSeconds()).padStart(2, '0')}`;
            // formattedSendDate定数の名前。時間を見やすく再配置
            // バッククォート(`)で囲まれた部分はテンプレートリテラルで、文字列を生成するために使用
            // テンプレートリテラル内では${}構文を使用して変数や式を挿入できる
            // ${}内に年を挿入して文字列に含める

            const receiveDate = item.receiveDate ? new Date(item.receiveDate) : null;
            // receiveDate値が存在すればDateオブジェクトに変換し、存在しなければnullを保存
            const formattedReceiveDate = receiveDate ? `${receiveDate.getFullYear()}-${String(receiveDate.getMonth() + 1).padStart(2, '0')}-${String(receiveDate.getDate()).padStart(2, '0')} ${String(receiveDate.getHours()).padStart(2, '0')}:${String(receiveDate.getMinutes()).padStart(2, '0')}:${String(receiveDate.getSeconds()).padStart(2, '0')}` : '';
            // receiveDateが存在すればフォーマットされた文字列を保存し、そうでなければ空の文字列を保存

            const row = document.createElement('tr');
            // 新しいtr要素を生成
            // row.innerHTML = 生成された行(tr)の内部HTMLを設定
            row.innerHTML = `
                <td class="column-messageId-2">${item.answerId}</td>
                <td class="column-purpose-2">ㄴ</td>
                <td class="column-message-2">${item.answer}</td>
                <td class="column-mean-2">${item.mean}</td>
                <td class="column-meanAddPhrase-2">${item.meanAddPhrase}</td>
                <td class="column-meanAddMor-2">${item.meanAddMor}</td>
                <td class="column-meanAddAll-2">${item.meanAddAll}</td>
                <td class="column-runningTime-2"></td>
                <td class="column-sendDate-2">${formattedSendDate}</td>
                <td class="column-receiveDate-2">${formattedReceiveDate}</td>
                <td class="column-yesValue-2"></td>
                <td class="column-noValue-2"></td>
                <td class="column-confirmStatus-2">${item.yesOrNo}</td>
            `;

            // 対応するfirstmessages行の後に行を挿入
            const messageId = item.messageId;
            // const messageId = messageIdの値を保存する変数
            if (firstMessagesMap[messageId]) {
            // firstMessagesMapオブジェクトにmessageIdキーが存在するか確認
                firstMessagesMap[messageId].insertAdjacentElement('afterend', row);
                // 該当する行(tr)の後に新しい行を挿入
            }
        });
    } catch (error) {
    // tryでエラーが発生した場合に実行
        console.error('Error fetching data for table1:', error);
        // エラーメッセージをコンソールに出力してエラーを記録
    }
}

// 「リフレッシュ」ボタンのクリックイベントリスナーを追加
document.querySelector('.button2').addEventListener('click', () => {
// HTML文書からクラス名がbutton2の最初の要素を選択+選択した要素に'click'イベントリスナーを追加。ボタンがクリックされたときに指定された関数が実行される
// document = 現在のウェブページのドキュメントオブジェクト。
// querySelector('.button2'): 選択子.button2(クラス)に対応する要素を返す
// () => { location.reload(); } = クリックイベントが発生したときに実行する関数。ここではアロー関数(無名関数)を使用
    location.reload();
    // 現在のページをリロード
    // location = 現在のページのURLを表すオブジェクト。
    // reload() = ページを再読み込み
});

// ページロード時にデータをロード
window.onload = function() {
// ページが完全にロードされたときに実行する関数を指定
// window = ブラウザウィンドウを表すグローバルオブジェクト
// onload = ページロードイベント。ページが完全にロードされるとこのイベントが発生する
// function() { ... } = ページがロードされたときに実行する無名関数
// 無名関数 = 名前のない関数。通常、関数式や即時実行関数式として使用される
    loadData();
    // loadData関数を呼び出す。データを取得してDOMに追加する
    loadDataTable1();
    // loadDataTable1関数を呼び出す。最初のデータテーブルを取得してDOMに追加する
    // DOM = ウェブページの構造を表すオブジェクトモデル。HTML文書がブラウザにロードされると、ブラウザはこの文書をDOMに変換する。
};
