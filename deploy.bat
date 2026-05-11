@echo off
chcp 65001 > nul
setlocal

:: --- 設定區 ---
:: 請將下方路徑設定為 NAS 網路路徑或雲端硬碟路徑
:: 設定 NAS 網路路徑 (請勿包含引號)
set "TARGET_DIR=\\Synology1618\mixcode_workshare_2\1_2023-04-25_第一哩路_怪怪整理師\0_internal\工具與資源\FigCritique"

:: --- 程式區 ---
echo [Deploy] 正在檢查目標資料夾...
if not exist "%TARGET_DIR%" (
    echo [Info] 目標資料夾不存在，正在建立...
    mkdir "%TARGET_DIR%"
)

echo [Deploy] 正在複製檔案到雲端硬碟...
copy /Y "manifest.json" "%TARGET_DIR%"
copy /Y "ui.html" "%TARGET_DIR%"
copy /Y "code.js" "%TARGET_DIR%"

echo.
echo [Success] 部署完成！
echo 夥伴們現在可以從 "%TARGET_DIR%" 載入插件了。
pause
