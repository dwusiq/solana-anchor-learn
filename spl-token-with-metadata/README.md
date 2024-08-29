# `SOL-TOKEN-WITH-METADATA`

## 前提(只支持旧版本的SPL)

* 将`asset`目录中的`icon.svg`上传到`ipfs`或其他地方得到链接,然后复制链接到同目录文件`metadata.json`的`image`中
* 将`asset`目录中的`metadata.json`上传到`ipfs`或其他地方得到链接[浏览器的获取到的代币名称是从这个json文件读取的]
* 修改`src/mint.ts`的`RPC`和私钥等信息

## 执行

```shell
# 安装依赖
yarn 
# 执行脚本生成代币
cd src && ts-node mint.ts
```

## 参考链接

* `quicknode`: `https://www.quicknode.com/guides/solana-development/spl-tokens/how-to-create-a-fungible-spl-token-with-the-new-metaplex-token-standard`