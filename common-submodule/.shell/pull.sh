#!/bin/bash

# 更新主仓库
echo "正在更新主仓库..."
git pull -v

# 更新子仓库
echo "正在更新子仓库 common-submodule..."
cd common-submodule
git pull -v
cd ..

echo "更新完成！"
