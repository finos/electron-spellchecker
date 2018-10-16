import { app, BrowserWindow, ipcMain, MenuItem } from 'electron';
import electronDebug from 'electron-debug';
const SpellCheckHandler = require('../lib/spell-check-handler').default;
const ContextMenuBuilder = require('../lib/context-menu-builder').default;
const ContextMenuListener = require('../lib/context-menu-builder').default;
let SpellChecker;
let contextMenuBuilder;

let mainWindow = null;
electronDebug({enabled: true, showDevTools: true});

app.on('window-all-closed', () => {
  app.quit();
});

app.on('ready', () => {
  mainWindow = new BrowserWindow({
    width: 580,
    height: 365
  });

  mainWindow.loadURL(`file://${__dirname}/index.html`);
  setTimeout(() => mainWindow.openDevTools(), 5*1000);

  mainWindow.webContents.on('did-finish-load', function () {
    SpellChecker = new SpellCheckHandler();

    contextMenuBuilder = new ContextMenuBuilder(SpellChecker, mainWindow, false, processMenu.bind(this));
    const contextMenuListener = new ContextMenuListener((info) => {
      console.log("came here");
      contextMenuBuilder.showPopupMenu(info);
    }, mainWindow);

  });

  ipcMain.on('spell', (event, args) => {
    if (args.text) {
      event.returnValue = SpellChecker.isMisspelled(args.text);
    }
  });
});

function processMenu(menu) {

  let isLink = false;
  menu.items.map((item) => {
    if (item.label === 'Copy Link'){
      isLink = true;
    }
    return item;
  });

  if (!isLink){
    menu.append(new MenuItem({ type: 'separator' }));
    menu.append(new MenuItem({
      role: 'reload',
      accelerator: 'CmdOrCtrl+R',
      label: this.localeContent && this.localeContent.Reload || 'Reload',
    }));
  }
  return menu;
}
