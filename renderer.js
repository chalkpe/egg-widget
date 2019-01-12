const bytes = require('bytes')
const byteSize = require('byte-size')
const {ipcRenderer} = require('electron')

const config = require('./config.json')
const planBytes = bytes.parse(config.plan)
const precision = parseInt(config.precision)

const chart = document.getElementById('chart')
const todayValue = document.getElementById('today-value')
const todayUnit = document.getElementById('today-unit')
const totalValue = document.getElementById('total-value')
const totalUnit = document.getElementById('total-unit')

function rad (cx, cy, r, p) {
  const a = (p - 0.25) * 2 * Math.PI
  return { x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) }
}

function arc (cx, cy, r, sp, ep) {
  const a = rad(cx, cy, r, ep)
  const b = rad(cx, cy, r, sp)
  const l = (ep - sp) > 0.5 ? 1 : 0
  return `M ${a.x} ${a.y} A ${r} ${r} 0 ${l} 0 ${b.x} ${b.y}`
}

ipcRenderer.on('data', (_, data) => {
  const stat = data.lte.statistics
  const totalBytes = parseInt(stat.TOTAL_TX_BYTES) + parseInt(stat.TOTAL_RX_BYTES)
  const todayBytes = parseInt(stat.daily.TOTAL_LTE_TX_BYTES) + parseInt(stat.daily.TOTAL_LTE_RX_BYTES)

  const total = byteSize(totalBytes, { precision })
  totalValue.textContent = parseFloat(total.value)
  totalUnit.textContent = total.unit

  const today = byteSize(todayBytes, { precision })
  todayValue.textContent = parseFloat(today.value)
  todayUnit.textContent = today.unit

  chart.innerHTML = `
    <circle fill="#fff" r="45" cx="50" cy="50" />
    <path fill="none" stroke="#d5d5d5" stroke-width="10" d="${arc(50, 50, 45, totalBytes / planBytes - 0.001, 1)}" />
    <path fill="none" stroke="${config.color}" stroke-width="10" d="${arc(50, 50, 45, 0, totalBytes / planBytes)}" />
  `
})