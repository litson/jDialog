jDialog - a dialog is used like jQuery
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
               <td>message()</td>
               <td>[value](可选)</td>
               <td>为当前dialog设置message | 返回当前dialog配置的msg</td>
               <td>jDialog | String | HTMLString</td>
        </tr>
        <tr>
               <td>title()</td>
               <td>[value](可选)</td>
               <td>为当前dialog设置title | 返回当前dialog配置的title</td>
               <td>jDialog | String </td>
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
</table>

## Questions?

