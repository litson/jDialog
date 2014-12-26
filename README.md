jDialog
======

#jDialog
> jDialog是参照jQuery核心原理，摒弃丑陋的 new 关键字，支持像jQuery扩展一样自定义属于你的dialog

## Usage
```js

    // 我们可以直接生产一个带有“取消”按钮的对话框
    jDialog('Hello world!');

    // 也可以这样模拟一个confirm
    jDialog('确定删除？',function(){
        this.destory();
    });

    // 也可以做详细配置
    jDialog({
        modal:false, // 一个不带模式窗口的dialog
        autoHide:3  // 3s后自动
    });


```

## API