#express-middleware-bigpipe
-------

express' bigpipe Middleware.

[![Build Status](https://travis-ci.org/wssgcg1213/express-middleware-bigpipe.svg?branch=master)](https://travis-ci.org/wssgcg1213/express-middleware-bigpipe)

##Start
####Install
```bash
npm i express-middleware-bigpipe --save
```
####Use in express
```javascript
// express code
var bigpipe = require('express-middleware-bigpipe')

app.use(bigpipe({
    basedir: __dirname + '/public/'
}))
```

[DEMO](https://github.com/wssgcg1213/express-bigpipe-demo)

##Usage:

本中间件的 namespace 在 res.bigpipe 下, 所有方法都支持链式调用, 输出完成后自动触发```res.end()```结束请求.

The namespace of this middleware is at `res.bigpipe`, all methods allow chained call, it will automatically invoke `res.end()` to end a request when finished pipe.

####```write(str);```

直接输出, 与`res.end`类似, 但是不会终止请求

directly pipe a string


####```pagelet(file, errHandler);```

读取basedir下的file文件, 第二个参数为错误处理回调, 传入参数err

pipe the static file in `opts.basedir`, errHandler is a callback function to handle errors.


####```render(view, renderObj, callback/* optional */);```

使用模板引擎读取模板目录下模板, renderObj 为渲染的数据, callback回调采用尾触发, 传入一个参数assign, 在callback中异步获取到数据之后使用assign(obj) 将数据合并入renderObj并渲染输出.

This method use template engine to bigpipe a rendered string.

The callback function have an `assign` argument which is a function to assign an obj to render asynclly.

该方法可用的重载:

You can also use this method in the following way:

```render(view, renderObj);```

```render(view, callback);```



####```done(fn);```, ```done(str);```

提前结束, 相当于 res.end , 可以传入 String 直接输出, 或者回调函数在 res.end 之前执行.

End the request immediately.

You can also pass a function or string. If it is a func, it will be called before res.end, or if it is a string, it will be passed to `res.end(str)`.

##Quick Demo:

```javascript
var app = require('express')(),
	bigpipe = require('express-middleware-bigpipe'); // import

//...

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(bigpipe({						 // use bigpipe
	basedir: __dirname + '/public/'     // 设定bigpipe的pagelet路径, set basedir
}));

app.get("/", function(req, res){
	 res.bigpipe.write("<script>alert('this is a test');</script>"); // directly pipe
	 res.bigpipe.pagelet('pagelet.eg.js', function(err){  //  使用 pagelet 读取 basedir 下的文件, 第二个参数为错误处理
         //this is err handle
         console.log('err', err);
     });

	 res.bigpipe.render('pagelet', {
         text: "this is a rendered data"

     }, function(assign) {
         //async coding

         setTimeout(function(){
             assign({
                 anotherData: "3000ms 后输出" // render and pipe after 3000ms
             });
         }, 3000);

     }).render('pagelet', {
         text: "123321",
         others: "balabala"
     });

});
```

##Test
```bash
npm test
```

Use mocha and supertest

By Ling created @ 2015-04-29 21:10:36
[www.zeroling.com](https://www.zeroling.com)

Follow me at https://github.com/wssgcg1213

Report issue at https://github.com/wssgcg1213/express-middleware-bigpipe/issues

