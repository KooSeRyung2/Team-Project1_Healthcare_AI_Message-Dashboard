// メインからボタンを押してホームページに入るコード

// document.addEventListener("DOMContentLoaded", function() {
//     // ボタン6クリック時、gesipan.htmlファイルを新しいウィンドウで開く
//     const button6 = document.getElementById("hum6");
//     button6.addEventListener("click", function() {
//         window.open("gesipan.html", "_blank");
//     });
// });

document.addEventListener("DOMContentLoaded", function() {
    // ボタン6クリック時、gesipan.htmlファイルを現在のウィンドウで開く
    const button6 = document.getElementById("hum6");
    button6.addEventListener("click", function() {
        window.location.href = "gesipan.html";
    });
});
