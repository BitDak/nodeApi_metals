## Node.js实现restful API

时间：201908
作者：BitDak

#### 前置

​处理了soil版本中报错并退出的问题。

#### 1、实现了https


​**问题**：由于证书是自己生成的，测试工具Chrome Advanced REST Client提交接口测试时无响应。解决办法

​		1、Chrome 先访问一下https://localhost:3011/ ，根据提示操作使访问成功。

​		2、Chrome 打开`chrome://flags/#allow-insecure-localhost`，找到

`Allow invalid certificates for resources loaded from localhost.` 

`Allows requests to localhost over HTTPS even when an invalid certificate is presented. –Mac, Windows, Linux, Chrome OS, Android`

​		将Disabled改为Enabled即可。

​		采用远程调试类似。

#### 2、client ip监控

​		测试：

​		1、在本机测试：

``````
Https server listening on port 3011
::1
null
GET users called
``````

​		说明：本机测试返回如上属于正常。

​		2、异机测试：正常。

#### 3、Apikey

##### 3.1 Authorization格式的定义

BitdakAPIAuthorization201908协议：appName:permission

1. appName。自由定义，但以能表示清楚用义为好。例如：`userManager`。

2. permission。取值只有两种，即 in {"readOnly","read&write"}。

   **说明：BitdakApiAuthorization201908协议 是指由Bitdak自定义的私有协议。**

算法：BASE64

##### 3.2 多业务（client）支持及Apikey在服务端的可视化监控

​配置一个json数组文件，将授权的Apikey都存进数组，由服务器进行核对。

(完成)