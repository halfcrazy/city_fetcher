这次是nodejs版本，支持课表成绩查询。
-----------------------------------

安装
====
`$ npm install`

运行
====
`$ make start`

用法
====

1. 成绩查询

 `$ curl -d 'username=学号&password=密码&term=学期编号' http://yourserver:port/api/grade`

2. 课表查询

 `$ curl -d 'username=学号&password=密码&term=学期编号' http://yourserver:port/api/schedule`

TODO
====

- [ ] 优化查询速度
- [ ] 添加数据库支持