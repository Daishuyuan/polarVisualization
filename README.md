# Polar Visualization Platform

---

## Notice
1. 在Settings -> Version Control -> Ignored Files 中添加规则忽略Log日志文件夹；
2. 在上传代码前务必先拉取代码，且不要修改随意别人负责的代码模块；
3. 写代码尽量加上注释和注解，解释代码的功能和影响；
4. 上传的代码务必是没有警告和错误的代码，最坏情况下也应该是能够运行通过的代码；
5. 更改超过100项内容的commit必须向项目的负责人通知，征求许可；

## Architectures
- 前端架构(resources/static/mineJs)
1. basic 基础库
    1. BasicTools 基本工具集
    2. DataPublisher 数据更新和推送模块
    3. ParamsTable 参数表 
2. core 核心库
    1. MainActivity Js程序入口
    2. VueLayer 基于vue的前端控制层
3. diagram 图表库
    1. TableFactory 图表构建工厂模块
4. scene 场景库
    1. Scene 所有场景的父类，负责一般性的场景操作
    2. XXXScene 继承自Scene，实现特殊的场景功能
    3. SceneManager 负责管理和初始化所有的场景

## Js Coding Rule
1. 所有公有变量的命名采用驼峰命名法，如myName, checkHandle等；
2. 私有变量（即仅在你自己写的模块内部使用的变量）前面加上‘_’，如_name, _handle；
3. 常量全部大写，且分割的单词用‘_’连接，如MY_NAME, HER_NAME；

## Download Operations
1. 下载安装Idea JavaWeb专业版并使用你的学校邮箱激活软件
2. 打开Idea选择从Version Control的Git中创建项目
- 输入Git路径git@github.com:SynchronizedThread/polarVisualization.git
- 输入你想要放置工程的本地路径
- 确认并等待工程构建完成
3. 更改Maven的配置文件为国内镜像
- 参照更改为以下的配置，下载速度比较快
```xml
<?xml version="1.0" encoding="UTF-8"?>
<settings xmlns="http://maven.apache.org/SETTINGS/1.0.0"
          xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
          xsi:schemaLocation="http://maven.apache.org/SETTINGS/1.0.0 http://maven.apache.org/xsd/settings-1.0.0.xsd">
    <mirrors>
        <mirror>
            <!-- change download url to aliyun -->
            <!--This sends everything else to /public -->
            <id>nexus-aliyun</id>
            <mirrorOf>*</mirrorOf>
            <name>Nexus aliyun</name>
            <url>http://maven.aliyun.com/nexus/content/groups/public</url>
        </mirror>
    </mirrors>
</settings>
```
- 等待Maven拉取依赖文件
4. 右上角配置Spring boot启动工程
- 点击+号创建启动方式，选择spring boot，然后选择PolarApplication作为程序启动入口
5. 打开浏览器，输入http://localhost:8080 等待界面加载完成

## Git Operations
1. 配置你的用户:
- git config --global user.name '你的名字'
- git config --global user.email '你的邮箱'
2. 上传代码步骤:
- git pull （注意，上传前必须先拉取别人的代码）
- git add --all (添加所有你修改的代码) 或者 git add 某个文件（推荐使用）
- git commit -m '修改信息备注'
- git push （上传所有修改代码）
3. 切换分支和拉取代码:
- git checkout 某个分支
- git pull （拉取代码 and 第一次拉取代码也请使用这个）
4. 如果发现冲突，无法上传代码，禁止使用git push -f
- 如未更改冲突的文件，可以直接删除后拉取代码
- 如果已经更改了冲突文件，可以先将冲突文件保存至桌面，
  然后参照上一条操作之后改回文件，再上传代码
- 如果更改的冲突文件不重要，也可以直接删除
- git checkout --force 强制丢弃本地所有更改（慎用）
5. 删除文件
- git rm 文件名称
- git commit -m '理由'
- git push
6. 回退到某一个版本
- git reset --hard 版本序列号
- 版本序列号可以在commit列表上找到

## Authors
1. DSY 负责前后端统筹规划开发和设计
2. ZXJ 负责图表样式的调整和数据接口的开发
3. WXY_m 负责地图服务的配置和开发
4. WXY_f 负责界面设计和前端逻辑实现
5. ZX 负责后端数据处理模块开发
6. WPS 负责后端
7. CJH 负责echarts和后端开发
8. LDX 负责地图服务配置和开发