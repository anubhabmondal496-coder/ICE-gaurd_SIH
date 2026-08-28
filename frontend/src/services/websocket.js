class TelemetryWebSocket {
  constructor() {
    this.ws = null;
    this.listeners = [];
    this.reconnectTimer = null;
  }

  connect() {
    if (this.ws && (this.ws.readyState === WebSocket.OPEN || this.ws.readyState === WebSocket.CONNECTING)) {
      return;
    }

    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${protocol}//${window.location.host}/ws/telemetry`;

    try {
      this.ws = new WebSocket(wsUrl);

      this.ws.onopen = () => {
        console.log('[ICEGUARD Telemetry] WebSocket connected.');
      };

      this.ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          this.listeners.forEach((callback) => callback(data));
        } catch (e) {
          console.error('[ICEGUARD Telemetry] Parse error', e);
        }
      };

      this.ws.onclose = () => {
        console.warn('[ICEGUARD Telemetry] WebSocket closed. Reconnecting in 2s...');
        this.reconnectTimer = setTimeout(() => this.connect(), 2000);
      };

      this.ws.onerror = (err) => {
        console.error('[ICEGUARD Telemetry] WebSocket error', err);
        if (this.ws) {
          this.ws.close();
        }
      };
    } catch (err) {
      console.error('[ICEGUARD Telemetry] Init error', err);
      this.reconnectTimer = setTimeout(() => this.connect(), 3000);
    }
  }

  subscribe(callback) {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter((cb) => cb !== callback);
    };
  }

  send(command) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(command));
    }
  }

  disconnect() {
    if (this.reconnectTimer) clearTimeout(this.reconnectTimer);
    if (this.ws) {
      this.ws.close();
    }
  }
}

export const telemetryWS = new TelemetryWebSocket();
