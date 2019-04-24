const path = require('path');
const mkdirp = require('mkdirp');
const { Observable } = require('rxjs/Observable');

require('rxjs/add/observable/of');
require('rxjs/add/operator/mergeMap');
require('rxjs/add/operator/reduce');
require('rxjs/add/operator/toPromise');

const { fs } = require('./promisify');
const { normalizeLanguageCode } = require('./utility');

let d = require('debug')('electron-spellchecker:dictionary-sync');

const app = process.type === 'renderer' ?
  require('electron').remote.app :
  require('electron').app;

/**
 * DictioanrySync handles downloading and saving Hunspell dictionaries. Pass it
 * to {{SpellCheckHandler}} to configure a custom cache directory.
 */
module.exports = class DictionarySync {
  /**
   * Creates a DictionarySync
   *
   * @param  {String} cacheDir    The path to a directory to store dictionaries.
   *                              If not given, the Electron user data directory
   *                              will be used.
   */
  constructor(cacheDir=null) {
    // NB: Require here so that consumers can handle native module exceptions.
    this.cacheDir = cacheDir || path.join(app.getPath('userData'), 'dictionaries');
    mkdirp.sync(this.cacheDir);
  }

  /**
   * Override the default logger for this class. You probably want to use
   * {{setGlobalLogger}} instead
   *
   * @param {Function} fn   The function which will operate like console.log
   */
  static setLogger(fn) {
    d = fn;
  }

  /**
   * Loads the dictionary for a given language code, trying first to load a
   * local version, then downloading it. You probably don't want this method
   * directly, but the wrapped version
   * {{loadDictionaryForLanguageWithAlternatives}} which is in {{SpellCheckHandler}}.
   *
   * @param  {String} langCode        The language code (i.e. 'en-US')
   * @param  {Boolean} cacheOnly      If true, don't load the file content into
   *                                  memory, only download it
   *
   * @return {Promise<Buffer|String>}     A Buffer of the file contents if
   *                                      {{cacheOnly}} is False, or the path to
   *                                      the file if True.
   */
  async loadDictionaryForLanguage(langCode, cacheOnly=false) {
    d(`Loading dictionary for language ${langCode}`);
    if (process.platform === 'darwin') return new Buffer([]);

    let lang = normalizeLanguageCode(langCode);
    let target = path.join(this.cacheDir, `${lang}.bdic`);

    if (cacheOnly) return target;

    try {
      if (!fs.existsSync(target)) {
        throw new Error(`${lang} is currently not supported`);
      }
      d(`Returning local copy: ${target}`);
      let ret = await fs.readFile(target, {});

      if (ret.length < 8*1024) {
        throw new Error("File exists but is most likely bogus");
      }

      return ret;
    } catch (e) {
      d(`Failed to read file ${target}: ${e.message}`);
    }
  }

  preloadDictionaries() {
    // NB: This is retained solely to not break earlier versions
    return Observable.of(true);
  }
}
