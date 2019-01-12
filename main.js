const { app, BrowserWindow } = require('electron')
const reader = require('./reader')
const {interval} = require('./config.json')

let read = null
let window = null

async function createWindow() {
  read = await reader()
  window = new BrowserWindow({
    alwaysOnTop: true,
    width: 180, height: 180,
    frame: false, transparent: true,
    resizable: false, maximizable: false
  })

  window.loadFile('index.html')
  window.on('closed', () => (read = window = null))
  
  refresh()
}

async function refresh () {
  if (!window) return
  try {
    const data = await read()
    window.webContents.send('data', data)
    console.log(data.system.status.UPTIME)
  } catch (err) {
    console.error(err)
  }

  setTimeout(refresh, interval)
}

app.on('ready', createWindow)
app.on('activate', () => (window === null && createWindow()))
app.on('window-all-closed', () => (process.platform !== 'darwin' && app.quit()))
