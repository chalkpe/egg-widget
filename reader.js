const btoa = require('btoa')
const request = require('request-promise-native').defaults({ jar: true, json: true })

const config = require('./config.json')
const url = 'http://192.168.1.1/cgi-bin/webmain.cgi'

module.exports = async () => {
  const summaryData = { act: 'summary' }
  const loginData = {
    act: 'login',
    login: 'login',
    ac: btoa(config.username),
    passwd: btoa(config.password)
  }

  const res = await request.post({ url, formData: loginData })
  if (res.RESULT !== 'SUCCESS') throw new Error(`failed: ${res.RESULT}`)

  return () => request.post({ url, formData: summaryData })
}