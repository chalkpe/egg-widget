const { app, BrowserWindow } = require('electron')
const reader = require('./reader')
const config = require('./config.json')

let read = null
let window = null
let ref = null

async function createWindow() {
  read = await reader()
  window = new BrowserWindow({
    alwaysOnTop: true, width: config.size, height: config.size,
    transparent: true, frame: false, maximizable: false, resizable: false
  })

  window.loadFile('index.html')
  window.on('closed', () => read = window = null)
  window.webContents.on('did-finish-load', refresh)
}

async function refresh () {
  if (!window) return

  try {
    const data = await read()
    window.webContents.send('data', data)
    console.log(new Date().toISOString(), data.system.status.UPTIME)
  } catch (err) {
    console.error(err)
  }

  if (ref) clearTimeout(ref)
  ref = setTimeout(refresh, config.interval)
}

app.on('ready', createWindow)
app.on('activate', () => (window === null && createWindow()))
app.on('window-all-closed', () => (process.platform !== 'darwin' && app.quit()))
