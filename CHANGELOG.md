# FigCritique Changelog

## v2.0.0 — 2026-05-28（大改版）

### 核心改動
- **視覺全面翻新**：Quick Stickers 與 Comment Boxes 改用 PNG 圖示，移除 emoji 文字按鈕
- **生成物件改為群組**：所有生成內容（圖示 + 名牌 / 色塊 + 圖示 + 名牌）自動 group，移動不再散落
- **名牌設計重構**：白底 + 使用者色邊框 + 使用者色文字；貼紙名牌置於圖片右側（-15px overlap）
- **Comment Box 改用 FigJam 原生 ShapeWithText**：顏色即背景色塊，雙擊可直接編輯，告別分離色塊
- **Comment Box 樣式**：Square 形狀、文字左對齊、Unordered bulleted list、14pt Inter Medium
- **使用者顏色綁定**：生成物件顏色（名牌邊框 + 評論框背景）隨選定身分改變
- **身分選擇邏輯重構**：開啟時不自動選取，需明確選取身分才能啟用按鈕；身分名牌移至 header 右上角

### Bug 修復
- **Ctrl+Z 無法復原**：改為 startup 預載字型，`onmessage` 維持同步，所有變更納入單一 undo batch
- **視窗跳位**：移除 `scrollAndZoomIntoView`，改以 `figma.viewport.center` 計算放置位置，點擊不再跳視窗
- **選取物件時生成位置異常**：不再依賴選取狀態決定位置，統一使用視野中心

### 人員顏色調整
- 岱虹：改為咖啡色 `#8B5A2B`（原紅色與拉瓦太相近）
- Josie：改為玫紅色 `#D63075`（原紫色與亨利太相近）

### 部署路徑更新
- 目標路徑改為 `\\Synology1618\mixcode_workshare_2\1_2026_Wacky Tidy Pals\00_Internal\02_Tool & Resource\FigCritique`

---

## v1.0.0 — 2026-05-11（初版）

- 基本 Quick Stickers（+1 / Love / OK）：生成 emoji 文字貼紙 + 名字標籤
- 基本 Comment Boxes（同意 / 待釐清 / 點子 / 不建議）：生成矩形色塊 + 文字框
- 使用者選單（拉瓦 / 岱虹 / Josie / 亨利）
- 部署腳本（deploy.bat）
