# 跨合约调用

### 注意点

* `anchor-lang = "0.30.0"`
* 记得将被调用合约的`idl`文件添加到根目录的`idls`目录中，如`call-to.json`
* 然后在调用发起的合约顶头加上一行`declare_program!(call_to);`,同时增加需要调用的函数和参数结构体引用
  ```
    declare_program!(call_to);
    use call_to::accounts::PowerStatus;
    use call_to::cpi::accounts::SwitchPower;
    use call_to::cpi::switch_power;
    use call_to::program::CallTo;
  ```
* 执行：`anchor expand`
* `avm install 0.30.0` 、`avm use 0.30.0`
* 添加：
  ```
  [features]
  idl-build = ["anchor-lang/idl-build"]
  ```
