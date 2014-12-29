jDialog - a dialog is used like jQuery [![Built with Gulp](https://cdn.gruntjs.com/builtwith.png)](http://gulpjs.com/)
======

## Guides
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
## Options
```js

    jDialog({

            title: '提示',                  // [String]     dialog 的 title
            modal: true,                // [Boolean]  是否启用模式窗口
            msg: '',                        // [HTMLstring | string]      需要显示的信息
            autoHide: 0,                // [Number]    自动销毁，单位（s）
            preventHide: false,      //  [Boolean]    尚未实现
            callBack: null               //  [Function]   这里和events系统是重头，
                                              //  但目前没有太好的想法

    });


```

## API

### width()

    * width( value ) @Returns: jDialog
        为dialog设置CSS width ，可以是Number，百分比、em、pt、rem等；
        没有单位默认为pixel；
    * width()           @Returns: Number
        返回dialog的offsetWidth

## Questions?