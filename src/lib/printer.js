// Camada de conexao com impressoras termicas MPT2 (e similares)
// Suporta: Web Bluetooth (BLE), WebUSB e RawBT (Android)

// UUIDs de servico BLE usados pelos chips mais comuns em impressoras termicas
// (MPT2/MPT-II, Goojprt, Zjiang, chips ISSC/Microchip, HM-10, etc.)
const BT_SERVICES = [
  '000018f0-0000-1000-8000-00805f9b34fb', // servico "printer" generico (0x18F0)
  '49535343-fe7d-4ae5-8fa9-9fafd205e455', // ISSC/Microchip transparent UART
  'e7810a71-73ae-499d-8c15-faa9aef0c3f2', // chips de clones comuns
  '0000ff00-0000-1000-8000-00805f9b34fb',
  '0000ffe0-0000-1000-8000-00805f9b34fb', // HM-10 style
  '0000fee7-0000-1000-8000-00805f9b34fb',
]

const delay = (ms) => new Promise((r) => setTimeout(r, ms))

export function bluetoothSupported() {
  return typeof navigator !== 'undefined' && !!navigator.bluetooth
}

export function usbSupported() {
  return typeof navigator !== 'undefined' && !!navigator.usb
}

export function isAndroid() {
  return typeof navigator !== 'undefined' && /android/i.test(navigator.userAgent)
}

export class BluetoothPrinter {
  constructor() {
    this.device = null
    this.characteristic = null
  }

  get connected() {
    return !!(this.device?.gatt?.connected && this.characteristic)
  }

  get name() {
    return this.device?.name || 'Impressora Bluetooth'
  }

  async connect(log = () => {}) {
    if (!bluetoothSupported()) {
      throw new Error('Este navegador nao suporta Web Bluetooth. Use Chrome/Edge no computador ou Android (iPhone nao suporta).')
    }
    log('Abrindo seletor de dispositivos Bluetooth...')
    this.device = await navigator.bluetooth.requestDevice({
      acceptAllDevices: true,
      optionalServices: BT_SERVICES,
    })
    log(`Dispositivo escolhido: ${this.device.name || this.device.id}`)
    this.device.addEventListener('gattserverdisconnected', () => { this.characteristic = null })

    const server = await this.device.gatt.connect()
    log('Conectado ao GATT. Procurando servico de impressao...')

    let services = []
    try {
      services = await server.getPrimaryServices()
    } catch {
      // alguns dispositivos exigem pedir servico por servico
      for (const uuid of BT_SERVICES) {
        try { services.push(await server.getPrimaryService(uuid)) } catch { /* tenta o proximo */ }
      }
    }
    if (!services.length) {
      throw new Error('Nenhum servico BLE encontrado. A MPT2 pode estar exposta apenas como Bluetooth classico (SPP) — nesse caso use USB ou o app RawBT no Android.')
    }

    // procura a primeira caracteristica gravavel
    for (const service of services) {
      let chars = []
      try { chars = await service.getCharacteristics() } catch { continue }
      for (const ch of chars) {
        if (ch.properties.write || ch.properties.writeWithoutResponse) {
          this.characteristic = ch
          log(`Servico ${service.uuid.slice(4, 8)} / caracteristica ${ch.uuid.slice(4, 8)} pronta para escrita.`)
          return this
        }
      }
    }
    throw new Error('Nenhuma caracteristica de escrita encontrada neste dispositivo. Verifique se selecionou a impressora correta.')
  }

  async print(bytes, log = () => {}) {
    if (!this.connected) throw new Error('Impressora Bluetooth nao conectada.')
    const ch = this.characteristic
    // escrita com resposta suporta pacotes maiores; sem resposta fica limitada ao MTU (~20 bytes)
    const withResponse = ch.properties.write
    const chunkSize = withResponse ? 100 : 20
    log(`Enviando ${bytes.length} bytes em blocos de ${chunkSize}...`)
    for (let i = 0; i < bytes.length; i += chunkSize) {
      const chunk = bytes.slice(i, i + chunkSize)
      if (withResponse) {
        if (ch.writeValueWithResponse) await ch.writeValueWithResponse(chunk)
        else await ch.writeValue(chunk)
      } else {
        await ch.writeValueWithoutResponse(chunk)
      }
      await delay(withResponse ? 20 : 35)
    }
    log('Dados enviados com sucesso.')
  }

  disconnect() {
    try { this.device?.gatt?.disconnect() } catch { /* ignora */ }
    this.characteristic = null
  }
}

export class UsbPrinter {
  constructor() {
    this.device = null
    this.endpoint = null
    this.iface = null
  }

  get connected() {
    return !!(this.device?.opened && this.endpoint != null)
  }

  get name() {
    return this.device?.productName || 'Impressora USB'
  }

  async connect(log = () => {}) {
    if (!usbSupported()) {
      throw new Error('Este navegador nao suporta WebUSB. Use Chrome/Edge no computador ou Android.')
    }
    log('Abrindo seletor de dispositivos USB...')
    this.device = await navigator.usb.requestDevice({ filters: [] })
    log(`Dispositivo: ${this.device.productName || 'sem nome'} (${this.device.vendorId.toString(16)}:${this.device.productId.toString(16)})`)
    await this.device.open()
    if (this.device.configuration === null) await this.device.selectConfiguration(1)

    // procura interface com endpoint bulk OUT (preferindo classe 7 = impressora)
    const ifaces = this.device.configuration.interfaces
      .map((i) => ({ i, alt: i.alternates[0] }))
      .filter(({ alt }) => alt.endpoints.some((e) => e.direction === 'out' && e.type === 'bulk'))
      .sort((a, b) => (b.alt.interfaceClass === 7) - (a.alt.interfaceClass === 7))

    if (!ifaces.length) throw new Error('Nenhuma interface de impressao (bulk OUT) encontrada neste dispositivo USB.')

    const { i, alt } = ifaces[0]
    try {
      await this.device.claimInterface(i.interfaceNumber)
    } catch {
      throw new Error(
        'Nao foi possivel assumir o controle da impressora USB. No Windows, o driver de impressora bloqueia o acesso direto do navegador — ' +
        'imprima pelo driver (POS-58) ou remova o driver dessa porta. No Android via cabo OTG costuma funcionar direto.'
      )
    }
    this.iface = i.interfaceNumber
    this.endpoint = alt.endpoints.find((e) => e.direction === 'out' && e.type === 'bulk').endpointNumber
    log(`Interface ${this.iface} / endpoint ${this.endpoint} prontos.`)
    return this
  }

  async print(bytes, log = () => {}) {
    if (!this.connected) throw new Error('Impressora USB nao conectada.')
    log(`Enviando ${bytes.length} bytes via USB...`)
    const chunkSize = 4096
    for (let i = 0; i < bytes.length; i += chunkSize) {
      const result = await this.device.transferOut(this.endpoint, bytes.slice(i, i + chunkSize))
      if (result.status !== 'ok') throw new Error(`Falha no envio USB (status: ${result.status}).`)
    }
    log('Dados enviados com sucesso.')
  }

  async disconnect() {
    try {
      if (this.iface != null) await this.device.releaseInterface(this.iface)
      await this.device?.close()
    } catch { /* ignora */ }
    this.endpoint = null
  }
}

// RawBT (app Android gratuito) — imprime em qualquer impressora Bluetooth/USB
// pareada no celular, inclusive Bluetooth classico que o navegador nao alcanca.
export function printViaRawBT(bytes) {
  let bin = ''
  for (const b of bytes) bin += String.fromCharCode(b)
  window.location.href = 'rawbt:base64,' + btoa(bin)
}
