#!/bin/bash

# 更新子仓库
echo "正在更新子仓库 common-submodule..."
cd common-submodule
git add -A
git commit -m "Update common-submodule"
git push
cd ..
# 更新主仓库
echo "正在更新主仓库..."
git add -A
git commit -m "Update main repository"
git push




echo "更新完成！"
