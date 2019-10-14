# electron-spellchecker

![](https://img.shields.io/npm/dm/electron-spellchecker.svg) <a href="https://electron-userland.github.io/electron-spellchecker/docs">![](https://electron-userland.github.io/electron-spellchecker/docs/badge.svg)</a>

electron-spellchecker is a library to help you implement spellchecking in your Electron applications, as well as handle default right-click Context Menus (since spell checking shows up in them).  This library intends to solve the problem of spellchecking in a production-ready, international-friendly way.

electron-spellchecker:

* Spell checks in all of the languages that Google Chrome supports by reusing its dictionaries.
* Automatically detects the language the user is typing in and silently switches on the fly.
* Handles locale correctly and automatically (i.e. users who are from Australia should not be corrected for 'colour', but US English speakers should)
* Automatically downloads and manages dictionaries in the background.
* Checks very quickly, doesn't introduce input lag which is extremely noticable
* Only loads one Dictionary at a time which saves a significant amount of memory

## Quick Start

```js
import {SpellCheckHandler, ContextMenuListener, ContextMenuBuilder} from 'electron-spellchecker';

window.spellCheckHandler = new SpellCheckHandler();
window.spellCheckHandler.attachToInput();

// Start off as US English, America #1 (lol)
window.spellCheckHandler.switchLanguage('en-US');

let contextMenuBuilder = new ContextMenuBuilder(window.spellCheckHandler);
let contextMenuListener = new ContextMenuListener((info) => {
  contextMenuBuilder.showPopupMenu(info);
});
```

## Language Auto-Detection

The spell checker will attempt to automatically check the language that the user is typing in and switch on-the fly. However, giving it an explicit hint by calling `switchLanguage`, or providing it a block of sample text via `provideHintText` will result in much better results.

Sample text should be text that is reasonably likely to be in the same language as the user typing - for example, in an Email reply box, the original Email text would be a great sample, or in the case of Slack, the existing channel messages are used as the sample text.

## About node-spellchecker

This module uses a fork of Atom's excellent `node-spellchecker` that takes a slightly different path on Windows by using Hunspell only. You can find the source [here](https://github.com/felixrieseberg/node-spellchecker).

## Learning more

* Run `npm start` to start [the example application](https://github.com/electron-userland/electron-spellchecker/tree/master/example) and play around.
* Read [the class documentation](https://electron-userland.github.io/electron-spellchecker/docs/) to learn more.

## Contributing

1. Fork it (<https://github.com/symphonyoss/electron-spellchecker/fork>)
2. Create your feature branch (`git checkout -b feature/fooBar`)
3. Read our [contribution guidelines](.github/CONTRIBUTING.md) and [Community Code of Conduct](https://www.finos.org/code-of-conduct)
4. Commit your changes (`git commit -am 'Add some fooBar'`)
5. Push to the branch (`git push origin feature/fooBar`)
6. Create a new Pull Request

_NOTE:_ Commits and pull requests to FINOS repositories will only be accepted from those contributors with an active, executed Individual Contributor License Agreement (ICLA) with FINOS OR who are covered under an existing and active Corporate Contribution License Agreement (CCLA) executed with FINOS. Commits from individuals not covered under an ICLA or CCLA will be flagged and blocked by the FINOS Clabot tool. Please note that some CCLAs require individuals/employees to be explicitly named on the CCLA.

*Need an ICLA? Unsure if you are covered under an existing CCLA? Email [help@finos.org](mailto:help@finos.org)*

## License
The code in this repository is distributed under the Apache License, Version 2.0.

Copyright 2019 Symphony

