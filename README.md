### 简介

健康平台 3.0 主应用使用 git submodule 引用公用组件、模块

### 快速开始

```shell
# 克隆项目
git clone http://192.168.50.172:9580/edu_health/3.0/stu-main.git

# 进入项目目录
cd stu-main

# 初始化并更新submodule
git submodule update --init

# 安装依赖(建议使用pnpm: https://pnpm.io/zh/installation)
npm i -g pnpm # 装了可忽略
pnpm i # 或者 npm i

# 启动
pnpm dev
```

### 构建发布

```shell
# 构建测试环境
pnpm build:test

# 构建测试环境并发布到测试环境
pnpm publish:test

# 构建生产环境
pnpm build
```

### 其他指令

```shell
# eslint代码格式检查并修复
pnpm lint:eslint

# prettier代码格式检查并修复
pnpm lint:prettier

# 预览发布包（需先执行构建指令）
pnpm preview:dist
```

#### git commit 规范

- `feat` 增加新功能
- `fix` 修复问题/BUG
- `style` 代码风格相关无影响运行结果的
- `perf` 优化/性能提升
- `refactor` 重构
- `revert` 撤销修改
- `test` 测试相关
- `docs` 文档/注释
- `chore` 依赖更新/脚手架配置修改等
- `workflow` 工作流改进
- `ci` 持续集成
- `types` 类型定义文件更改
- `wip` 开发中
- `mod` 不确定分类的修改
- `release` 发布.
