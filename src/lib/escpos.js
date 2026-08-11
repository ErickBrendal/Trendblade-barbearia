// Gerador de comandos ESC/POS para impressoras termicas 58mm (ex.: MPT2 / MPT-II)
// Largura padrao: 32 colunas (384 dots / fonte A)

const ESC = 0x1b
const GS = 0x1d
const LF = 0x0a

export const COLS_58MM = 32

// Impressoras MPT2 genericas variam muito de codepage — transliterar acentos
// para ASCII é o único caminho que imprime correto em todos os clones.
export function translit(str) {
  return String(str)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[ªº°]/g, '.')
    .replace(/[“”„]/g, '"')
    .replace(/[‘’‚]/g, "'")
    .replace(/[–—]/g, '-')
    .replace(/[✦•·]/g, '*')
    .replace(/[^\x20-\x7e\n]/g, '?')
}

export class EscPos {
  constructor(cols = COLS_58MM) {
    this.cols = cols
    this.bytes = []
  }

  raw(...b) { this.bytes.push(...b); return this }
  init() { return this.raw(ESC, 0x40) }
  // 0 = esquerda, 1 = centro, 2 = direita
  align(n) { return this.raw(ESC, 0x61, n) }
  bold(on) { return this.raw(ESC, 0x45, on ? 1 : 0) }
  // largura/altura de 1 a 8
  size(w = 1, h = 1) { return this.raw(GS, 0x21, ((w - 1) << 4) | (h - 1)) }

  text(s) {
    for (const ch of translit(s)) this.bytes.push(ch === '\n' ? LF : ch.charCodeAt(0))
    return this
  }

  line(s = '') { return this.text(s).raw(LF) }
  feed(n = 1) { return this.raw(ESC, 0x64, n) }
  divider(char = '-') { return this.line(char.repeat(this.cols)) }

  // texto à esquerda + valor à direita na mesma linha
  kv(left, right) {
    const l = translit(left)
    const r = translit(right)
    const space = this.cols - l.length - r.length
    if (space >= 1) return this.line(l + ' '.repeat(space) + r)
    return this.line(l).line(' '.repeat(Math.max(0, this.cols - r.length)) + r)
  }

  // quebra texto longo respeitando a largura
  wrapped(s) {
    const words = translit(s).split(/\s+/)
    let cur = ''
    for (const w of words) {
      if ((cur + ' ' + w).trim().length > this.cols) { this.line(cur.trim()); cur = w }
      else cur = (cur + ' ' + w).trim()
    }
    if (cur) this.line(cur)
    return this
  }

  build() { return new Uint8Array(this.bytes) }
}

export function formatBRL(value) {
  return 'R$ ' + Number(value).toFixed(2).replace('.', ',')
}

export function buildTestTicket() {
  const p = new EscPos()
  p.init()
    .align(1).size(2, 2).bold(true).line('TREND BLADE').size(1, 1).bold(false)
    .line('Teste de impressao MPT2')
    .divider()
    .align(0)
    .line('Se voce esta lendo isto, a')
    .line('impressora esta funcionando!')
    .divider('=')
    .align(1).line('0123456789 ABCDEFGHIJ abcdefghij')
    .feed(4)
  return p.build()
}

export function buildReceipt({ cliente, barbeiro, itens, pagamento, obs, data }) {
  const p = new EscPos()
  const total = itens.reduce((s, i) => s + i.price, 0)
  const dt = data || new Date()
  const dataStr = dt.toLocaleDateString('pt-BR') + ' ' + dt.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })

  p.init()
    .align(1)
    .size(2, 2).bold(true).line('TREND BLADE').size(1, 1)
    .line('BARBEARIA').bold(false)
    .line('Av. Papa Pio XII, 218')
    .line('Guarulhos - SP')
    .line('WhatsApp (11) 95123-1443')
    .divider('=')
    .align(0)
    .kv('Data:', dataStr)
  if (cliente) p.kv('Cliente:', cliente)
  if (barbeiro) p.kv('Barbeiro:', barbeiro)
  p.divider()
  p.bold(true).line('SERVICOS').bold(false)
  for (const item of itens) p.kv(item.name, formatBRL(item.price))
  p.divider()
  p.bold(true).size(1, 2).kv('TOTAL', formatBRL(total)).size(1, 1).bold(false)
  if (pagamento) p.kv('Pagamento:', pagamento)
  if (obs) { p.divider(); p.wrapped('Obs: ' + obs) }
  p.divider('=')
    .align(1)
    .line('Obrigado pela preferencia!')
    .line('Volte sempre * @trendblade')
    .line('* NAO E DOCUMENTO FISCAL *')
    .feed(4)
  return p.build()
}
