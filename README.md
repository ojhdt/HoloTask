# HoloTask

<img src="source/main.png" width="300" height="300">


A simple, lightweight tasks management tool.

![contributor](https://img.shields.io/github/contributors/ojhdt/holotask)
![version-support](https://img.shields.io/badge/Base%20Library-%3E%3D2.15.0-blue)
![last-commit](https://img.shields.io/github/last-commit/ojhdt/holotask)
[![license](https://img.shields.io/github/license/ojhdt/holotask)](LICENSE)

HoloTask is a WeChat Mini Program that allows users to manage their daily tasks (not yet released). The main functions of the application are data cloud synchronization, group management, task reminder and statistics. It can be applied to various occasions such as class management and self-discipline.

HoloTask has redesigned a large number of component used in the app, following the Material Design specifications for mobile development advocated by Google. HoloTask also abandons redundant configuration, simplifies operation, and pursues a refreshing and smooth user experience.

This project is used for communication and learning ONLY.

[中文文档](README_zh-CN.md)

## Table of Contents

- [Feature](#Feature)
- [Screenshot](#Screenshot)
- [Dependencies](#Dependencies)
- [Install](#install)
- [Maintainers](#Maintainers)
- [Change log](#Change-log)
- [Get help](#Get-help)
- [Contributing](#contributing)
- [License](#license)

## Feature

### Released

- Task release, editing, status change and deletion
- Preview and transmission of pictures and files
- Group creation, member addition and management
- Markdown support
- Statistics
- Archive
- Full dark mode support

### Upcoming

- Notification
- Search

## Screenshot

![light](screenshot/light.png)

![dark](screenshot/dark.png)

## Dependencies

- Base Library version >= 2.15.0

## Install

This project relies on Tencent Cloud Base, which may incur a small amount of fees.

1. Visit [Mini Program Registration page](https://mp.weixin.qq.com/), and submit the required information as instructed to get your Mini Program account. Then go to `Settings > Development Management > Development Settings` to find the AppID of the Mini Program.

2. Go to `Settings > Cloud Base` and enable Cloud Base and creat an Environment, get your unique environment ID.

3. Edit `project.config.json`
```
"appid": "", //Your APPID here
```

4. Import this project in Weixin DevTools. Edit `App.js`
```
wx.cloud.init({
  env: "" //Your environment ID here
})
```

5. Create 3 empty collections named `data`，`user` and `group` in the Cloud Base Console, which will be necessary to store tasks, users imformations and groups imformations. And change the permissions to **all users can read, only creator can read and write**

6. Deploy all cloud functions included in the `cloud` folder.

7. Enjoy it~。

## Maintainers

[@ojhdt](https://github.com/ojhdt/)

[@habc706](https://github.com/habc706)

[@liusenjun](https://github.com/liusenjun)

## Change log

### 1.6.5.210223_beta

- Add sharing
- Fix display error of group manager's name

### 1.6.4.210222_beta

- Add completion statistics
- Fix bugs that cause group searching fail
- Add login status detection in history page 

### 1.6.0.210220_beta

- Pictures preview support 
- Files transmission support
- Markdown support

### 1.5.2.210219_beta

- Improve group management
- Add interface settings of account page 

## Get help

Try to submit GitHub issues to explain your questions and find solutions: [Issues](https://github.com/ojhdt/HoloTask/issues)

You can contact the developers by the following ways:

📧 E-mail mailto:ojhdtmail@gmail.com

💬 Telegram https://telegram.me/ojhdt

🗨️ Wechat ojhdtwechat

## Contributing

PRs accepted.

## Credits

- [wemark](https://github.com/TooBug/wemark) - 微信小程序Markdown渲染库

## License

[MIT](LICENSE)
