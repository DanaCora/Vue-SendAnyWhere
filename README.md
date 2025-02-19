# SendEveryThing - 即時資訊分享

![Tech Stack](https://img.shields.io/badge/tech-Vue3%20%7C%20Spring%20Boot%203-blue) ![Security](https://img.shields.io/badge/security-End--to--End%20Encryption-orange)

## 專案簡介
本專案為個人碩論[具機密性與身份認證之即時資訊分享：以 Vue.js 與 Spring 框架實作通訊協定與應用系統](https://hdl.handle.net/11296/m977gr)的前端實作部分。  
SendEveryThing 是一款整合 Vue.js + Spring Boot 的即時資訊分享平台，提供匿名檔案分享、即時通訊加密與多人檔案管理等功能，確保資訊安全與隱私。    

🔹 匿名檔案分享：無須註冊即可上傳與下載檔案與文字，並採用QR Code與驗證碼進行下載。  
🔹 即時聊天室：支援 AES-GCM 加密，確保訊息安全。  
🔹 多人檔案管理：註冊使用者可管理與分享檔案。  
🔹 安全驗證：採用 JWT + Spring Security + OAuth 2.0 (Google) 進行身份驗證。  

## 範例影片

[![專案展示影片](https://img.youtube.com/vi/sDwU72uj1Og/0.jpg)](https://youtu.be/sDwU72uj1Og)

## 專案流程
### 檔案管理模組
```mermaid
sequenceDiagram
    participant User as 使用者
    participant Frontend as Vue.js 前端
    participant Backend as Spring Boot 後端
    participant IPFS as IPFS (分散式檔案儲存)
    participant MySQL as MySQL (檔案元數據)

    %% 檔案上傳流程
    Note over User,Frontend: 檔案上傳
    User->>Frontend: 1. 選擇檔案並點擊上傳
    Frontend->>Backend: 2. 分片上傳檔案 (Chunk Upload)
    Backend->>IPFS: 3. 儲存檔案
    IPFS-->>Backend: 4. 回傳 CID (檔案識別碼)
    Backend->>Backend: 5. 產生驗證碼
    Backend->>MySQL: 6. 儲存 CID、驗證碼與使用者關聯
    MySQL-->>Backend: 7. 儲存成功
    Backend-->>Frontend: 8. 回傳下載檔案網址與驗證碼
    Frontend->>Frontend: 9. 產生 QR Code (基於下載網址)
    Frontend->>User: 10. 顯示驗證碼與 QR Code

    %% 檔案下載流程
    Note over User,Frontend: 檔案下載
    User->>Frontend: 11. 掃描 QR Code 或輸入驗證碼
    Frontend->>Backend: 12. 發送下載請求（附帶驗證碼）
    Backend->>MySQL: 13. 查詢驗證碼是否有效
    alt 驗證成功
        MySQL-->>Backend: 14a. 回傳檔案資訊
        Backend->>IPFS: 15a. 請求檔案內容
        IPFS-->>Backend: 16a. 回傳檔案
        Backend-->>Frontend: 17a. 傳送檔案給使用者
        Frontend-->>User: 18a. 檔案下載成功
    else 驗證失敗
        Backend-->>Frontend: 14b. 回傳錯誤訊息
        Frontend-->>User: 15b. 顯示驗證碼錯誤
    end
```

### 即時通訊模組
```mermaid
sequenceDiagram
    participant UserA as 使用者 A
    participant UserB as 使用者 B
    participant FrontendA as Vue.js (A)
    participant FrontendB as Vue.js (B)
    participant WebSocket as WebSocket 伺服器
    participant Backend as Spring Boot 後端
    participant MongoDB as MongoDB (聊天訊息)

    UserA->>FrontendA: 1. 進入聊天室
    FrontendA->>WebSocket: 2. 建立 WebSocket 連線
    WebSocket->>Backend: 3. 進行 Diffie-Hellman 密鑰交換
    Backend-->>WebSocket: 4. 產生 AES-GCM 加密密鑰
    WebSocket-->>FrontendA: 5. 傳送密鑰 (僅用於此聊天室)

    UserA->>FrontendA: 6. 輸入訊息並發送
    FrontendA->>WebSocket: 7. 傳送 AES-GCM 加密訊息
    WebSocket->>MongoDB: 8. 儲存加密訊息
    MongoDB-->>WebSocket: 9. 儲存成功
    WebSocket-->>FrontendB: 10. 廣播加密訊息
    FrontendB-->>UserB: 11. 解密並顯示訊息
```

### 身分驗證模組 (Spring Security + JWT)
```mermaid
sequenceDiagram
    participant User as 使用者
    participant Frontend as Vue.js 前端
    participant Backend as Spring Boot 後端
    participant MySQL as MySQL (使用者資料)

    User->>Frontend: 1. 提交登入請求 (帳號/密碼)
    Frontend->>Backend: 2. 傳送登入請求
    Backend->>MySQL: 3. 驗證使用者帳號與密碼
    MySQL-->>Backend: 4. 回傳使用者資訊
    Backend->>Backend: 5. 產生 JWT
    Backend-->>Frontend: 6. 回傳 JWT
    Frontend->>User: 7. 儲存 JWT (HttpOnly Cookie)
    User->>Frontend: 8. 進行後續操作 (檔案管理 / 即時通訊)
    Frontend->>Backend: 9. 附帶 JWT 進行 API 請求
    Backend->>Backend: 10. 驗證 JWT
    Backend-->>Frontend: 11. 回傳請求結果
```

### 核心功能
🔹 **安全檔案分享**
- 私有 IPFS 集群架構
- 檔案節點複製備援
- 與外部網路隔離的安全傳輸
- 支援大檔案傳輸

🔹 **即時聊天室**
- 整合 WebSocket 技術實現即時通訊
- 採用 AES-GCM 加密確保訊息安全
- 支援多人群組聊天

🔹 **進階檔案管理**
- 檔案分類與標籤功能
- 支援檔案版本控制

🔹 **安全性設計**
- JWT + Spring Security 身份驗證
- OAuth 2.0 整合（Google 登入）
- 訊息加密保護

## 技術架構

### 前端 (Vue 3)
🔹 Vue 3 Composition API  
🔹 Pinia ( 狀態管理 )  
🔹 Vite ( 開發環境 )  
🔹 Web Worker ( 多執行緒處理 )  

### 後端 (Spring Boot)
🔹 Spring Boot 3  
🔹 Spring Security  
🔹 WebSocket ( 即時聊天 )  
🔹 JWT / OAuth 2.0 ( 身份驗證 )  

### 資料儲存
🔹 MySQL：集中式資料管理，儲存檔案元數據與使用者資訊  
🔹 MongoDB：聊天訊息儲存  
🔹 私有 IPFS 集群：
- 多節點互連架構
- 檔案複製備援機制
- 與外部 IPFS 網路隔離
- 優化的檔案傳輸效能

### DevOps & 部署
🔹 Nginx (反向代理)  
🔹 Docker (容器化)  
🔹 GitHub (版本控制)  

## 專案特色

### 安全性設計
- 私有 IPFS 網路隔離機制
- 檔案節點複製備援策略
- 全程 HTTPS 加密傳輸
- 完整的身份驗證機制

### 效能優化
- 私有 IPFS 集群優化傳輸效能
- 前端多執行緒處理大量運算
- 資料庫讀寫分離設計
- 快取機制優化響應時間

### 擴展性設計
- IPFS 節點可動態擴展
- 彈性的資料庫架構

## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/)  
[Intellij](https://www.jetbrains.com/idea/)

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

```sh
http://localhost:8081
```

### Compile and Minify

```sh
npm run build
```

```sh
services/Unify_API/API_URL.js
```
