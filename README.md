jDialog - 使用起来就像jQuery一样
======

## Guides
> jDialog是参照jQuery核心原理，摒弃丑陋的 new 关键字，
    支持像jQuery扩展一样自定义属于你的dialog

## Usage
```js

    // 我们可以直接生成一个带有“取消”按钮的对话框
    jDialog('Hello world!');

    // 也可以这样模拟一个confirm
    jDialog('确定删除？',function(){
        this.destory();
    });

    // 也可以做详细配置
    jDialog({
        modal:false, // 一个不带模式窗口的dialog
        autoHide:3  // 3s后自动销毁
    });

    // 提供了部分“插件”
    // alert
    jDialog.alert(' hello! ');

    // error
    jDialog.error(' error msg ');

    // toast
    jDialog.toast(' some text ');


```
### 如何添加按钮？

```js

    var dialog = jDialog.alert('按钮');
    
    // 我们可以很轻松的添加一个自定义按钮
    dialog.addButton('宽度变为100', 'resetWidth', function(){
        this.width(100); // 点击按钮时，会将dialog的宽度设置为100；
    });
    
    // actionName参数的作用? 提供一个可操作的句柄，
    // 所以，我们可以在外面做这样的事情：
    jDialog.event.fire('resetWidth');
    
    // 所以也可以:
    jDialog.event.add('resetWidth',function(){
        alert('您修改了dialog的宽度'); 
    });
    
    //当我们点击这个按钮，结果为width被设置为100px，并且弹出alert；
    
```

当然还有懒人模式
```js
    
    // 
    dialog.addButton('一个按钮',function(){
        this.content('一个按钮');
    });
    
    // 添加一个自定义事件的确定按钮
    dialog.addButton(function(){
        this.content('这个按钮做了操作');
    });

    // 或者干脆
    dialog.addButton();
    
    
    


```


## Options

## API
<table>
    <tr>
        <th>名称</th>
        <th>参数</th>
        <th>说明</th>
        <th>返回值</th>
    </tr>
    <tr>
        <td>width()</td>
        <td>[value](可选)</td>
        <td>为当前dialog设置宽度 | 返回当前dialog的宽度</td>
        <td>jDialog | Number</td>
    </tr>
    <tr>
        <td>height()</td>
        <td>[value](可选)</td>
        <td>为当前dialog设置高度 | 返回当前dialog的高度</td>
        <td>jDialog | Number</td>
    </tr>
    <tr>
        <td>index()</td>
        <td>[value](可选)</td>
        <td>为当前dialog设置zIndex
            <br>(并同时会为当前dialog的Modal设置zIndex[value-1])
            <br>| 返回当前dialog的zIndex
        </td>
        <td>jDialog | Number</td>
    </tr>
    <tr>
        <td>top()</td>
        <td>[value](可选)</td>
        <td>为当前dialog设置CSS top | 返回当前dialog的CSS top</td>
        <td>jDialog | Number</td>
    </tr>
    <tr>
        <td>content()</td>
        <td>[value](可选)</td>
        <td>为当前dialog设置content | 返回当前dialog配置的content</td>
        <td>jDialog | String | HTMLString</td>
    </tr>
    <tr>
        <td>title()</td>
        <td>[value](可选)</td>
        <td>为当前dialog设置title | 返回当前dialog配置的title</td>
        <td>jDialog | String</td>
    </tr>
    <tr>
        <td>getWrapper()</td>
        <td></td>
        <td>获取当前dialog的DOM结构</td>
        <td>HTMLElement</td>
    </tr>
    <tr>
        <td>getHeader()</td>
        <td></td>
        <td>获取当前dialog页头的DOM结构</td>
        <td>HTMLElement</td>
    </tr>
    <tr>
        <td>hideHeader()</td>
        <td></td>
        <td>隐藏当前dialog的页头</td>
        <td>jDialog</td>
    </tr>
    <tr>
        <td>getFooter()</td>
        <td></td>
        <td>获取当前dialog页尾的DOM结构</td>
        <td>HTMLElement</td>
    </tr>
    <tr>
        <td>hideFooter()</td>
        <td></td>
        <td>隐藏当前dialog的页尾</td>
        <td>jDialog</td>
    </tr>
    <tr>
        <td>getModal()</td>
        <td></td>
        <td>获取当前dialog的Modal的DOM结构</td>
        <td>HTMLElement</td>
    </tr>
    <tr>
        <td>hideModal()</td>
        <td></td>
        <td>隐藏当前dialog的Modal</td>
        <td>jDialog</td>
    </tr>
    <tr>
        <td>showModal()</td>
        <td></td>
        <td>显示当前dialog的Modal</td>
        <td>jDialog</td>
    </tr>
    <tr>
        <td>destory()</td>
        <td></td>
        <td>销毁当前dialog</td>
        <td>jDialog</td>
    </tr>
    <tr>
        <td>addClass()</td>
        <td>value</td>
        <td>为当前dialog添加样式</td>
        <td>jDialog</td>
    </tr>
    <tr>
        <td>removeClass()</td>
        <td>value</td>
        <td>为当前dialog移除样式</td>
        <td>jDialog</td>
    </tr>
    <tr>
            <td>addButton()</td>
            <td>[text,actionName,handler]</td>
            <td>为当前dialog添加按钮<br/></td>
            <td>jDialog</td>
        </tr>
    <tr>
        <td>preventHide()</td>
        <td></td>
        <td>点击modal不会自动销毁dialog</td>
        <td>jDialog</td>
    </tr>
    <tr>
        <td>verticalInViewPort()</td>
        <td>useFixed</td>
        <td>
                调整dialog盒模型定位基准；fixed 或 absolute
                <br/>
                设置为fixed则会限定dialog的高度
                <br/>
                设置为absolute时会移除高度的限定
           </td>
        <td>jDialog</td>
    </tr>
    <tr>
        <td>toggleLockBody()</td>
        <td>useLock</td>
        <td>
               锁住body的滚动
               移除body的滚动
           </td>
        <td>jDialog</td>
    </tr>
</table>
## Questions?
[Open issues](https://github.com/litson/jDialog/issues/new)
