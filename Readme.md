# Start.Then.Go -- simple JS flow control.

## Install

<pre>
  npm install start-then-go
</pre>

Or from source:

<pre>
  git clone git://github.com/sbquinlan/start-then-go.git 
  cd start-then-go
  npm link
</pre>

## Straightforward.
I want to flatten my callbacks in an easy to read pipeline that supports parallelism (note that I'm not calling it concurrency).

```javascript
var stg = require('start-then-go');

stg.start(
  function (_, next) {
    next({ user_id : 123});
  }
).then(
  function (prev, next) {
    http.get(
      'http://someurl.com',
      function (_, _, res) {
        next({page_contents : res});
      }
    );
  },
  function (prev, next) {
    Users.findById(
      prev.user_id, 
      function (err, user) {
        next({user : user});
      }
    );
  }
).then(
  function (prev) {
    console.log(prev);
//    {
//      'page_contents' : '<html>...yadda...</html>',
//      'user' : [Object object]
//    }
  }
).go();
```

There are a handful of these modules on NPM. I just wanted to add mine to the lot.

## License

