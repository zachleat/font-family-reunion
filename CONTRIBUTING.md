# How to contribute

The most difficult part of maintaining this project is keeping the global list of default fonts up to date with new browsers and operating systems.

`font-family-reunion` cannot automatically find all the fonts installed on a web browser, it must know the names ahead of time. All known font family names go into a big alphabetized `./test/src/font-families.json`. This list has been compiled from many different sources, which have been documented in the `./artifacts/source-list.txt`.

The best contributions to this project are to find source lists for new operating systems and web browsers from documentation published on the web. Once font family names are known, adding those browser/operating system combinations is pretty trivial.

We welcome all sources of font lists on [open issues](https://github.com/zachleat/font-family-reunion/issues?q=is%3Aissue+is%3Aopen+label%3Anew-browser-or-os) or new issues. Thanks!