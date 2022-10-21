[中文](README.md) | [English](README-en.md)

# Ghost Tencent cloud storage Adaptor

## Usage
1. cd into the location where the ghost installed. You can run `ghost ls` to see the running instances details. The `Location` column is where the ghost installed.
┌──────────┬───────────────┬─────────┬──────────────────────┬──────────────────┬──────┬─────────────────┐
│ Name     │ Location      │ Version │ Status               │ URL              │ Port │ Process Manager │
├──────────┼───────────────┼─────────┼──────────────────────┼──────────────────┼──────┼─────────────────┤
│ xxxxxxxx │ /xxx/xxx/xxxx │ x.xx.x  │ running (production) │ https://vkyin.cn │ 0000 │ systemd         │
└──────────┴───────────────┴─────────┴──────────────────────┴──────────────────┴──────┴─────────────────┘
```bash
cd <ghost location>
```
2. Create a new folder named `content/adapters/storage`. Clone this repo, and install the dependences.
```bash
mkdir -p content/adapters/storage
cd content/adapters/storage
git clone https://github.com/vkyin/ghost-qcloud-store.git
cd ghost-qcloud-store
npm i
```
3. Do some config
```bash
ghost config storage.active ghost-qcloud-store
ghost config storage.ghost-qcloud-store.SecretId <SecretId>
ghost config storage.ghost-qcloud-store.SecretKey <SecretKey>
ghost config storage.ghost-qcloud-store.Bucket <BucketName>
ghost config storage.ghost-qcloud-store.Region <Region>
```

4. Restart the Ghost App
```bash
ghost restart
```
