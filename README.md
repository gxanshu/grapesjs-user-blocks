# Grapesjs User Blocks
![Uploading grapesjsuserblocks-2023-07-16_23.29.18.gif…](https://github-production-user-asset-6210df.s3.amazonaws.com/68537640/253819674-376d5293-d743-43ae-871e-11369506c407.gif)

[DEMO]https://codesandbox.io/s/elated-sammet-wnps7g?file=/src/index.js)

### HTML
```html
<link href="https://unpkg.com/grapesjs/dist/css/grapes.min.css" rel="stylesheet">
<script src="https://unpkg.com/grapesjs"></script>
<script src="https://unpkg.com/grapesjs-user-blocks"></script>

<div id="gjs"></div>
```

### JS
```js
const editor = grapesjs.init({
	container: '#gjs',
  height: '100%',
  fromElement: true,
  storageManager: false,
  plugins: ['grapesjs-user-blocks'],
});
```

### CSS
```css
body, html {
  margin: 0;
  height: 100%;
}
```


## Summary

* Plugin name: `grapesjs-user-blocks` super simple user block generator for grapesjs. it allow developers to store there components in Storage Manager and also in blockManager to use letter.

## Download

* CDN
  * `https://unpkg.com/grapesjs-user-blocks`
* NPM
  * `npm i grapesjs-user-blocks`
* GIT
  * `git clone https://github.com/gxnanshu/grapesjs-user-blocks.git`



## Usage

Directly in the browser
```html
<link href="https://unpkg.com/grapesjs/dist/css/grapes.min.css" rel="stylesheet"/>
<script src="https://unpkg.com/grapesjs"></script>
<script src="path/to/grapesjs-user-blocks.min.js"></script>

<div id="gjs"></div>

<script type="text/javascript">
  var editor = grapesjs.init({
      container: '#gjs',
      // ...
      plugins: ['grapesjs-user-blocks']
  });
</script>
```

Modern javascript
```js
import grapesjs from 'grapesjs';
import plugin from 'grapesjs-user-blocks';

const editor = grapesjs.init({
  container : '#gjs',
  // ...
  plugins: [plugin],
  // pluginsOpts: {
  //   [plugin]: { /* options */ }
  // }
  // // or
  // plugins: [
  //   editor => plugin(editor, { /* options */ }),
  // ],
});
```



## Development

Clone the repository

```sh
$ git clone https://github.com/gxnanshu/grapesjs-user-blocks.git
$ cd grapesjs-user-blocks
```

Install dependencies

```sh
$ npm i
```

Start the dev server

```sh
$ npm start
```

Build the source

```sh
$ npm run build
```



## License

MIT
