To use it you need the [Dojo Toolkit](http://dojotoolkit.org/) 1.8.

Additionally you need [master of remoteStorage.js](https://github.com/RemoteStorage/remoteStorage.js). Copy the `src/` directory and rename it to `remote-storage`.

Your `js/` directory should look like this:

```
root/
+ js/
  + dijit/
  + dojo/
  + gka/
  + remote-storage/
  + util/
```

Use `index.dev.html` for development.

To do a build run

    ./build.sh

You need [Node.js](http://nodejs.org/) or Java 6 for that. Then you can use `index.html`.
