# bs4-selectbox

A simple yet powerful selectbox directive for angularjs and bootstrap 4.

It was written because [ui-select](http://angular-ui.github.io/ui-select/)
only supports bootstrap 3 and breaks badly with bootstrap 4 (and the repo
looks almost dead), while [selectize](https://selectize.github.io/selectize.js/)
and [select2](https://select2.org/) are jQuery libraries and therefore
not very suitable for use in angularjs.

What this component tries to achieve:

 * Be simple and straightforward to use.
 * Look native in bootstrap 4.
 * Be flexible enough to allow custom items.
 * Support single and multiple selection.
 * Live search.
 
And what it tries not to:

 * Support any use-case and look good in extreme conditions. It only uses css for the view.
 * Fetch data from server.
 * Be extremely performant for thousand of choices.

## Install

Using npm

```bash
npm install bs4-selectbox --save-dev
```

Then import it in your preferred way

```javascript
require(bs4-selectbox);
// or
import 'bs4-selectbox';
```

Finally add the modules as a dependency of your angularjs app

```javascript
angular.module('myApp', ['bs4-selectbox'])
```

## Documentation

The usage documentation can be found
[here](https://frapa.github.io/bs4-selectbox-example/dist/index.html).