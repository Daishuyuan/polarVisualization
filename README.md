# Polar Visualization Platform

---

## Operations
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