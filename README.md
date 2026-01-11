# hermit-pad
个人专用的 todo list 应用

## 功能特性

- ✅ 添加、删除待办事项
- ✅ 标记待办事项为已完成/未完成
- ✅ 查看和编辑待办详情
- ✅ 多页面导航（列表页和详情页）
- ✅ 美观的用户界面

## 技术栈

- React Native
- Expo
- React Navigation
- TypeScript
- Native Stack Navigator

## 安装和运行

### 前置要求

- Node.js (推荐 v18 或更高版本)
- npm 或 yarn
- Expo Go 应用（在手机上安装，用于测试）

### 安装依赖

```bash
npm install
```

### 运行应用

```bash
# 启动开发服务器
npm start

# 在 Android 模拟器上运行
npm run android

# 在 iOS 模拟器上运行（需要 macOS）
npm run ios

# 在 Web 浏览器中运行
npm run web
```

### 使用 Expo Go 测试

1. 在手机上安装 Expo Go 应用
2. 运行 `npm start`
3. 使用 Expo Go 扫描终端中显示的二维码

## 项目结构

```
hermit-pad/
├── App.tsx                # 主应用入口，配置导航
├── types.ts               # TypeScript 类型定义
├── screens/
│   ├── ListScreen.tsx     # 待办列表页面
│   └── DetailScreen.tsx   # 待办详情页面
├── assets/                # 图片和资源文件
├── tsconfig.json          # TypeScript 配置
├── package.json           # 项目依赖
└── README.md             # 项目说明
```

## 使用说明

### 列表页（首页）

- 在顶部输入框中输入待办事项标题，点击"添加"按钮创建新的待办
- 点击待办事项左侧的圆形复选框可以标记为已完成/未完成
- 点击待办事项本身可以进入详情页查看和编辑
- 点击右侧"删除"按钮可以删除待办事项

### 详情页

- 可以编辑待办事项的标题和描述
- 可以切换完成状态
- 点击"保存"按钮保存更改
- 点击"取消"按钮或顶部返回按钮返回列表页

## 开发计划

- [ ] 数据持久化（AsyncStorage）
- [ ] 待办分类和标签
- [ ] 搜索和筛选功能
- [ ] 截止日期和提醒
- [ ] 主题切换（深色模式）

