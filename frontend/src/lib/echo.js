import Echo from 'laravel-echo'
import Pusher from 'pusher-js'

window.Pusher = Pusher

let echoInstance = null
let lastToken = null

export function getEcho() {
  const token = sessionStorage.getItem('auth_token')

  if (!token) {
    return null
  }

  if (echoInstance && lastToken === token) {
    return echoInstance
  }

  if (echoInstance) {
    echoInstance.disconnect()
  }

  const apiUrl = (import.meta.env.VITE_API_URL || `${window.location.origin}/api`).replace(/\/$/, '')
  const authEndpoint = import.meta.env.VITE_BROADCAST_AUTH_URL || `${apiUrl}/broadcasting/auth`
  const wsHost = import.meta.env.VITE_REVERB_HOST || window.location.hostname
  const wsPort = Number(import.meta.env.VITE_REVERB_PORT || 8080)
  const scheme = import.meta.env.VITE_REVERB_SCHEME || 'ws'
  const forceTLS = scheme === 'wss' || window.location.protocol === 'https:'

  echoInstance = new Echo({
    broadcaster: 'reverb',
    key: import.meta.env.VITE_REVERB_APP_KEY || 'local',
    wsHost,
    wsPort,
    wssPort: wsPort,
    forceTLS,
    enabledTransports: ['ws', 'wss'],
    disableStats: true,
    authEndpoint,
    auth: {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
      },
    },
  })

  lastToken = token

  return echoInstance
}

export function disconnectEcho() {
  if (echoInstance) {
    echoInstance.disconnect()
    echoInstance = null
    lastToken = null
  }
}
