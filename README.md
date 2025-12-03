<div align="center">
<img width="1200" height="475" alt="Spring Boot Banner Gen" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Spring Boot Banner Gen

一个功能强大、直观易用的 Spring Boot 横幅生成器，基于 React 和 Gemini AI 构建，让你轻松为 Spring Boot 应用创建精美的 ASCII 艺术横幅。

## 功能特性

### 📸 图片转 ASCII
- 点击或拖拽上传图片
- 实时 ASCII 转换并提供预览
- 可自定义设置：
  - 宽度（20-150 个字符）
  - 对比度调节
  - 亮度控制
  - 颜色反转选项
  - 多种字符集（标准、简单、密集、华丽）

### 📝 文本转 ASCII
- 从文本输入生成 ASCII 横幅
- 丰富的 FIGLET 字体选择
- 实时预览，边输入边查看效果
- 可自定义文本样式

### 🤖 AI 增强功能
- **AI 标语生成**：根据图片生成创意标语
- **AI ASCII 艺术**：使用 Gemini API 生成实验性 AI ASCII 艺术

### 💾 导出选项
- 复制到剪贴板功能
- 下载为 `banner.txt` 文件
- 完美适配 Spring Boot 应用格式

## 技术栈

- **前端**：React 19 + TypeScript + Vite
- **后端**：通过 `@google/genai` 使用 Gemini API
- **ASCII 引擎**：自定义 ASCII 转换算法 + FIGLET 库
- **样式**：现代 CSS，类似 Tailwind 的工具类
- **图标**：自定义 SVG 图标

## 快速开始

### 前置条件

- Node.js（推荐 v18+）
- Gemini API 密钥（用于 AI 功能）

### 安装步骤

1. **克隆仓库**
   ```bash
   git clone <repository-url>
   cd spring-boot-banner-gen
   ```

2. **安装依赖**
   ```bash
   npm install
   ```

3. **配置 Gemini API 密钥**
   
   在项目根目录创建 `.env.local` 文件，并添加你的 Gemini API 密钥：
   ```
   GEMINI_API_KEY=你的-gemini-api-key
   ```

4. **启动开发服务器**
   ```bash
   npm run dev
   ```

5. **打开浏览器**
   访问 `http://localhost:5173`（或终端中显示的端口）

## 使用说明

### 生成横幅

#### 图片模式
1. 点击或拖拽图片到上传区域
2. 在控制面板中调整设置，优化你的 ASCII 艺术
3. 使用 AI 功能生成标语或 AI ASCII 艺术（可选）
4. 复制或下载你的 banner.txt 文件

#### 文本模式
1. 输入你想要的文本（例如："Spring Boot"）
2. 从可用选项中选择字体样式
3. 实时预览你的横幅
4. 复制或下载你的 banner.txt 文件

### Spring Boot 集成

1. 下载你的 `banner.txt` 文件
2. 将其放置在 Spring Boot 项目的 `src/main/resources` 目录中
3. 运行你的 Spring Boot 应用 - 横幅将在启动时显示在控制台中

## 项目结构

```
spring-boot-banner-gen/
├── components/          # UI 组件
│   └── Icons.tsx        # SVG 图标
├── services/           # 服务层
│   ├── asciiEngine.ts   # ASCII 转换逻辑
│   └── geminiService.ts # Gemini AI 集成
├── App.tsx             # 主应用组件
├── index.tsx           # 应用入口点
├── types.ts            # 类型定义
├── package.json        # 依赖和脚本
├── tsconfig.json       # TypeScript 配置
├── vite.config.ts      # Vite 配置
└── README.md           # 本文件
```

## 可用脚本

- **`npm run dev`**: 启动开发服务器
- **`npm run build`**: 构建生产版本
- **`npm run preview`**: 本地预览生产构建

## 贡献指南

欢迎贡献！请随时提交 Pull Request。

## 许可证

MIT 许可证 - 允许个人或商业用途自由使用本项目。

## 致谢

- 灵感来自经典的 Spring Boot 横幅传统
- 使用 Google 的 Gemini AI 构建
- 使用 FIGLET 库生成基于文本的 ASCII 艺术

---

**祝您生成愉快！** 🚀

