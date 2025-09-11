# is-path-inside

> Check if a path is inside another path

## Install

```sh
npm install is-path-inside
```

## Usage

```js
import isPathInside from 'is-path-inside';

isPathInside('a/b/c', 'a/b');
//=> true

isPathInside('a/b/c', 'x/y');
//=> false

isPathInside('a/b/c', 'a/b/c');
//=> false

isPathInside('/Users/sindresorhus/dev/unicorn', '/Users/sindresorhus');
//=> true
```

## API

### isPathInside(childPath, parentPath)

Note that relative paths are resolved against `process.cwd()` to make them absolute.

> [!IMPORTANT]
> This package is meant for use with path manipulation. It does not check if the paths exist nor does it resolve symlinks. You should not use this as a security mechanism to guard against access to certain places on the file system.

#### childPath

Type: `string`

The path that should be inside `parentPath`.

#### parentPath

Type: `string`

The path that should contain `childPath`.

## Tips

### Filesystem-aware checking

For symlink resolution and path existence checking, combine it with `fs.realpathSync()`:

```js
import {realpathSync} from 'node:fs';

isPathInside(realpathSync(childPath), realpathSync(parentPath));
```
