const { ipcMain } = require('electron');

const template = [
  {
    label: 'Hypergraph',
    submenu: [
      {
        label: 'Open Hypergraph',
        click () {
          ipcMain.emit('main:open-hypergraph');
        }
      },
      { role: 'quit' }
    ]
  },
  {
     label: 'Edit',
     submenu: [
      { role: 'undo'},
      { role: 'redo'},
      { role: 'separator'},
      { role: 'cut'},
      { role: 'copy'},
      { role: 'paste'}
    ]
  },
  {
     label: 'View',
     submenu: [
      { role: 'reload'},
      { role: 'toggledevtools'},
      { role: 'separator'},
      { role: 'resetzoom'},
      { role: 'zoomin'},
      { role: 'zoomout'},
      { role: 'separator'},
      { role: 'togglefullscreen'}
    ]
  },
  {
     role: 'window',
     submenu: [
      { role: 'minimize'},
      { role: 'close'}
    ]
  },
  {
    role: 'help',
    submenu: [
      { label: 'Learn More'}
    ]
  }
];

module.exports = template;
