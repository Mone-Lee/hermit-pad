# hermit-pad
个人专用的 todo list 应用

## 功能特性

- ✅ 添加、删除、编辑待办事项
- ✅ 标记待办事项为已完成/未完成
- ✅ 左滑删除、右滑完成手势操作
- ✅ 长按拖拽排序功能
- ✅ 查看和编辑待办详情
- ✅ 子任务管理（添加、编辑、删除、排序）
- ✅ 数据持久化（AsyncStorage）
- ✅ 导入/导出数据功能
- ✅ 美观的用户界面和交互动画

## 技术栈

- React Native 0.81.5
- Expo SDK ~54.0.31
- TypeScript
- React Navigation
- react-native-gesture-handler（手势操作）
- react-native-reanimated（动画）
- react-native-draggable-flatlist（拖拽排序）
- AsyncStorage（数据持久化）
- Material Icons（图标库）

## 安装和运行

### 前置要求

- Node.js (推荐 v18 或更高版本)
- npm 或 yarn
- Expo Go 应用（在手机上安装，用于测试）

#### iOS（仅 macOS）

- Xcode（含 Command Line Tools）
- CocoaPods（用于 `expo run:ios` / `pod install`）
  - 安装：`gem install cocoapods`
  - 若提示 `pod: command not found`，把 RubyGems 的可执行目录加到 PATH：
    - 临时：`export PATH="$(ruby -e 'print Gem.bindir'):$PATH"`
    - 永久：把上面这一行加入你的 `~/.zprofile` / `~/.bash_profile`

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
├── App.tsx                     # 主应用入口
├── types.ts                    # TypeScript 类型定义
├── components/                 # 可复用的UI组件
│   ├── TodoItem.tsx           # 单个Todo项组件
│   ├── DetailModal.tsx        # Todo详情弹窗组件
│   ├── DeleteConfirmModal.tsx # 删除确认弹窗组件
│   └── SettingsModal.tsx      # 设置和导入弹窗组件
├── hooks/                     # 自定义Hooks
│   └── useTodos.ts            # Todo数据管理Hook
├── utils/                     # 工具函数
│   └── storage.ts             # 本地存储工具
├── styles/                    # 样式定义
│   └── listScreen.styles.ts   # 列表屏幕相关样式
├── screens/                   # 页面组件
│   ├── ListScreen.tsx         # 主列表页面
│   └── ListScreen.old.tsx     # 原始文件（备份）
├── assets/                    # 图片和资源文件
├── babel.config.js            # Babel 配置
├── tsconfig.json              # TypeScript 配置
├── package.json               # 项目依赖
└── README.md                  # 项目说明
```

### 模块职责

#### 1. Components（组件层）
- **TodoItem**: 负责渲染单个Todo项，包含左右滑动手势
- **DetailModal**: Todo详情弹窗，支持编辑标题、管理子任务
- **DeleteConfirmModal**: 删除确认对话框
- **SettingsModal**: 设置菜单和导入数据弹窗

#### 2. Hooks（逻辑层）
- **useTodos**: 封装所有Todo相关的状态管理和业务逻辑
  - Todo的增删改查
  - 子任务的管理
  - 数据持久化
  - 排序功能

#### 3. Utils（工具层）
- **storage**: 封装AsyncStorage操作
  - loadTodos: 从本地加载数据
  - saveTodos: 保存数据到本地

#### 4. Styles（样式层）
- 按功能模块分离样式定义
- 便于维护和复用

#### 5. Screens（页面层）
- **ListScreen**: 主页面组件，负责：
  - 组合各个组件
  - 处理用户交互
  - 管理UI状态（弹窗显示/隐藏等）

### 设计优势

#### 1. **关注点分离**
- UI渲染与业务逻辑分离
- 样式定义独立管理
- 数据持久化逻辑独立

#### 2. **可复用性**
- 组件可在其他页面复用
- Hooks可在不同组件中使用
- 工具函数可供全局调用

#### 3. **可测试性**
- 每个模块职责单一，便于单元测试
- Hooks可独立测试业务逻辑
- 组件可独立测试UI行为

#### 4. **可维护性**
- 代码结构清晰，易于定位问题
- 修改某个功能只需关注对应模块
- 新增功能不影响现有代码

#### 5. **可扩展性**
- 添加新组件无需修改现有代码
- 扩展功能只需添加新的Hook或工具函数
- 样式修改不影响业务逻辑

## 使用说明

### 主列表页

- **添加待办**: 在顶部输入框中输入标题，按回车或点击键盘完成按钮
- **左滑删除**: 向左滑动待办项，点击删除图标，确认后删除
- **右滑完成**: 向右滑动待办项，点击完成图标，切换完成状态
- **长按拖拽**: 长按待办项可以拖拽调整排序
- **点击查看**: 点击待办项打开详情弹窗
- **子任务计数**: 待办项下方显示子任务完成进度（如 2/5）

### 详情弹窗

- **编辑标题**: 点击标题区域可以编辑待办标题
- **管理子任务**: 
  - 点击复选框切换子任务完成状态
  - 点击子任务文字进入编辑模式
  - 编辑时右侧显示删除按钮
  - 长按拖拽图标可重新排序子任务
- **添加子任务**: 在底部输入框输入后按回车添加
- **底部操作**: 
  - 删除：删除当前待办
  - 完成：切换完成状态
- **关闭弹窗**: 点击遮罩层或向下滑动关闭

### 设置菜单

- 点击右下角礼物图标（🎁）打开设置
- **导出数据**: Web端直接下载JSON文件，移动端复制到剪贴板
- **导入数据**: 粘贴之前导出的JSON数据恢复待办列表

## 开发指南

### 添加新的Todo操作
1. 在 `hooks/useTodos.ts` 中添加新函数
2. 在 `screens/ListScreen.tsx` 中调用
3. 如需UI组件，在 `components/` 中创建

### 添加新的弹窗
1. 在 `components/` 创建新组件
2. 在 `styles/` 添加样式
3. 在 `screens/ListScreen.tsx` 中集成

### 修改样式
直接编辑 `styles/listScreen.styles.ts` 中对应的样式对象

## 开发计划

- [x] 数据持久化（AsyncStorage）
- [x] 待办分类和标签
- [x] 手势操作（左滑删除、右滑完成）
- [x] 拖拽排序功能
- [x] 子任务管理
- [x] 导入/导出功能
- [ ] 搜索和筛选功能
- [ ] 截止日期和提醒
- [ ] 主题切换（深色模式）
- [ ] 多设备同步

