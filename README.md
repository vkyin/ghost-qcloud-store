[中文](README.md) | [English](README-en.md)

# Ghost Tencent cloud storage Adaptor

## 使用方式
1. 打开你的ghost安装目录，如果你不清楚，你可以执行`ghost ls`查看正在运行的ghost实例，Location字段为安装目录。
```bash
┌──────────┬───────────────┬─────────┬──────────────────────┬──────────────────┬──────┬─────────────────┐
│ Name     │ Location      │ Version │ Status               │ URL              │ Port │ Process Manager │
├──────────┼───────────────┼─────────┼──────────────────────┼──────────────────┼──────┼─────────────────┤
│ xxxxxxxx │ /xxx/xxx/xxxx │ x.xx.x  │ running (production) │ https://vkyin.cn │ 0000 │ systemd         │
└──────────┴───────────────┴─────────┴──────────────────────┴──────────────────┴──────┴─────────────────┘
```
```bash
cd <ghost location>
```
2. 创建一个`content/adapters/storage`文件夹，进入文件夹后clone本仓库，并安装依赖
```bash
mkdir -p content/adapters/storage
cd content/adapters/storage
git clone https://github.com/vkyin/ghost-qcloud-store.git
cd ghost-qcloud-store
npm i
```
3. 配置
```bash
ghost config storage.active ghost-qcloud-store
ghost config storage.ghost-qcloud-store.SecretId <访问cos使用的SecretId>
ghost config storage.ghost-qcloud-store.SecretKey <访问cos使用的SecretKey>
ghost config storage.ghost-qcloud-store.Bucket <文件BucketName>
ghost config storage.ghost-qcloud-store.Region <Region，格式为: ap-guangzhou>
```

4. 重启ghost应用
```bash
ghost restart
```
