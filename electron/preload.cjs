const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('dancingMouseApi', {
  onKeystroke: (callback) => {
    const listener = (_event, payload) => callback(payload);
    ipcRenderer.on('global-keystroke', listener);
    return () => ipcRenderer.removeListener('global-keystroke', listener);
  },
});
