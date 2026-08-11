import { useState, useRef, useEffect } from 'react'
import { Bluetooth, Usb, Printer, Smartphone, CheckCircle2, XCircle, ChevronDown, ArrowLeft, Scissors } from 'lucide-react'
import { buildReceipt, buildTestTicket, formatBRL, translit } from './lib/escpos.js'
import { BluetoothPrinter, UsbPrinter, printViaRawBT, bluetoothSupported, usbSupported, isAndroid } from './lib/printer.js'
import logoImage from './assets/IMG_7057.jpg'

const SERVICES = [
  { name: 'Corte', price: 50 },
  { name: 'Barba', price: 45 },
  { name: 'Corte + Barba', price: 85 },
  { name: 'Corte + Sobrancelha', price: 60 },
  { name: 'Corte + Hidratacao', price: 65 },
  { name: 'Pacote Completo', price: 90 },
]

const PAGAMENTOS = ['PIX', 'Dinheiro', 'Cartao de Credito', 'Cartao de Debito']

export default function PrintPage() {
  const [cliente, setCliente] = useState('')
  const [barbeiro, setBarbeiro] = useState('Jefferson')
  const [selected, setSelected] = useState([])
  const [pagamento, setPagamento] = useState('PIX')
  const [obs, setObs] = useState('')
  const [logs, setLogs] = useState([])
  const [busy, setBusy] = useState(false)
  const [conn, setConn] = useState(null) // { type: 'bt'|'usb', name }
  const [helpOpen, setHelpOpen] = useState(false)
  const btRef = useRef(new BluetoothPrinter())
  const usbRef = useRef(new UsbPrinter())
  const logBoxRef = useRef(null)

  useEffect(() => {
    if (logBoxRef.current) logBoxRef.current.scrollTop = logBoxRef.current.scrollHeight
  }, [logs])

  const log = (msg, type = 'info') =>
    setLogs((l) => [...l.slice(-60), { msg, type, t: new Date().toLocaleTimeString('pt-BR') }])

  const toggleService = (name) =>
    setSelected((s) => (s.includes(name) ? s.filter((x) => x !== name) : [...s, name]))

  const itens = SERVICES.filter((s) => selected.includes(s.name))
  const total = itens.reduce((s, i) => s + i.price, 0)

  const receiptBytes = () => buildReceipt({ cliente, barbeiro, itens, pagamento, obs })

  const run = async (fn) => {
    setBusy(true)
    try { await fn() } catch (e) {
      if (e?.name === 'NotFoundError') log('Nenhum dispositivo selecionado.', 'err')
      else log(e?.message || String(e), 'err')
    } finally { setBusy(false) }
  }

  const connectBt = () => run(async () => {
    await btRef.current.connect(log)
    setConn({ type: 'bt', name: btRef.current.name })
    log('Impressora Bluetooth conectada!', 'ok')
  })

  const connectUsb = () => run(async () => {
    await usbRef.current.connect(log)
    setConn({ type: 'usb', name: usbRef.current.name })
    log('Impressora USB conectada!', 'ok')
  })

  const disconnect = () => {
    btRef.current.disconnect()
    usbRef.current.disconnect()
    setConn(null)
    log('Desconectado.')
  }

  const doPrint = (bytes) => run(async () => {
    if (conn?.type === 'bt') await btRef.current.print(bytes, log)
    else if (conn?.type === 'usb') await usbRef.current.print(bytes, log)
    else { log('Conecte a impressora primeiro (Bluetooth ou USB), ou use o RawBT no Android.', 'err'); return }
    log('Impressao enviada!', 'ok')
  })

  const printReceipt = () => {
    if (!itens.length) { log('Selecione pelo menos um servico.', 'err'); return }
    doPrint(receiptBytes())
  }

  const rawbt = (bytes) => {
    log('Abrindo RawBT... Se nada acontecer, instale o app "RawBT" na Play Store.')
    printViaRawBT(bytes)
  }

  // preview textual do cupom
  const preview = () => {
    const lines = [
      '        TREND BLADE', '         BARBEARIA',
      '   Av. Papa Pio XII, 218', '      Guarulhos - SP',
      '================================',
      'Data: ' + new Date().toLocaleDateString('pt-BR'),
    ]
    if (cliente) lines.push('Cliente: ' + translit(cliente))
    if (barbeiro) lines.push('Barbeiro: ' + translit(barbeiro))
    lines.push('--------------------------------', 'SERVICOS')
    for (const i of itens) {
      const price = formatBRL(i.price)
      lines.push(translit(i.name) + ' '.repeat(Math.max(1, 32 - i.name.length - price.length)) + price)
    }
    lines.push('--------------------------------')
    const t = formatBRL(total)
    lines.push('TOTAL' + ' '.repeat(Math.max(1, 32 - 5 - t.length)) + t)
    lines.push('Pagamento: ' + translit(pagamento))
    if (obs) lines.push('Obs: ' + translit(obs))
    lines.push('================================', '  Obrigado pela preferencia!')
    return lines.join('\n')
  }

  const gold = '#C9A84C'

  return (
    <div style={{ minHeight: '100vh', background: '#0A0A0A', color: '#F5F0E8', fontFamily: "'Barlow',sans-serif", padding: '1.25rem' }}>
      <link href="https://fonts.googleapis.com/css2?family=Oswald:wght@400;600;700&family=Barlow:wght@300;400;500&family=Barlow+Condensed:wght@600;700&display=swap" rel="stylesheet" />
      <style>{`
        *,*::before,*::after{box-sizing:border-box}
        .pp-wrap{max-width:960px;margin:0 auto}
        .pp-card{background:#141414;border:1px solid rgba(201,168,76,0.15);border-radius:4px;padding:1.5rem;margin-bottom:1rem}
        .pp-title{font-family:'Oswald',sans-serif;font-weight:700;text-transform:uppercase;letter-spacing:0.06em}
        .pp-label{font-family:'Barlow Condensed',sans-serif;font-size:0.68rem;font-weight:700;letter-spacing:0.25em;text-transform:uppercase;color:${gold};display:block;margin-bottom:0.4rem}
        .pp-input{width:100%;background:#0A0A0A;border:1px solid rgba(255,255,255,0.12);border-radius:3px;color:#F5F0E8;padding:0.7rem 0.9rem;font-size:0.95rem;font-family:inherit;outline:none;transition:border-color 0.2s}
        .pp-input:focus{border-color:${gold}}
        .pp-btn{display:inline-flex;align-items:center;justify-content:center;gap:0.5rem;font-family:'Barlow Condensed',sans-serif;font-weight:700;font-size:0.82rem;letter-spacing:0.14em;text-transform:uppercase;padding:0.85rem 1.4rem;border-radius:3px;cursor:pointer;border:none;transition:all 0.2s;width:100%}
        .pp-btn:disabled{opacity:0.45;cursor:not-allowed}
        .pp-btn-g{background:${gold};color:#0A0A0A}
        .pp-btn-g:hover:not(:disabled){background:#E8C96A}
        .pp-btn-o{background:transparent;color:${gold};border:1px solid rgba(201,168,76,0.4)}
        .pp-btn-o:hover:not(:disabled){background:rgba(201,168,76,0.08)}
        .pp-svc{display:flex;align-items:center;justify-content:space-between;background:#0A0A0A;border:1px solid rgba(255,255,255,0.1);border-radius:3px;padding:0.75rem 1rem;cursor:pointer;transition:all 0.15s;user-select:none}
        .pp-svc:hover{border-color:rgba(201,168,76,0.5)}
        .pp-svc.on{border-color:${gold};background:rgba(201,168,76,0.08)}
        .pp-grid{display:grid;grid-template-columns:1fr 1fr;gap:0.6rem}
        .pp-cols{display:grid;grid-template-columns:1.2fr 0.8fr;gap:1rem;align-items:start}
        @media(max-width:760px){.pp-cols{grid-template-columns:1fr}.pp-grid{grid-template-columns:1fr}}
        .pp-log{background:#050505;border:1px solid rgba(255,255,255,0.08);border-radius:3px;padding:0.75rem;height:150px;overflow-y:auto;font-family:monospace;font-size:0.72rem;line-height:1.6}
        .pp-preview{background:#fff;color:#111;font-family:'Courier New',monospace;font-size:0.72rem;line-height:1.45;white-space:pre;padding:1rem 0.75rem;border-radius:3px;overflow-x:auto}
        .pp-conn{display:flex;align-items:center;gap:0.5rem;font-size:0.82rem;padding:0.5rem 0.8rem;border-radius:3px;margin-bottom:0.8rem}
      `}</style>

      <div className="pp-wrap">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <img src={logoImage} alt="Trend Blade" style={{ height: 40, width: 'auto' }} />
            <div>
              <div className="pp-title" style={{ fontSize: '1.15rem', color: gold }}>TREND <span style={{ color: '#F5F0E8' }}>BLADE</span></div>
              <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: '0.62rem', letterSpacing: '0.3em', textTransform: 'uppercase', color: '#9A9080' }}>Impressao de Recibo * MPT2</div>
            </div>
          </div>
          <a href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: '#9A9080', textDecoration: 'none', fontSize: '0.8rem' }}><ArrowLeft size={14} /> Voltar ao site</a>
        </div>

        <div className="pp-cols">
          <div>
            <div className="pp-card">
              <div className="pp-title" style={{ fontSize: '0.95rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: 8 }}><Scissors size={16} color={gold} /> Dados do Atendimento</div>
              <div className="pp-grid" style={{ marginBottom: '0.9rem' }}>
                <div><label className="pp-label">Cliente</label><input className="pp-input" value={cliente} onChange={(e) => setCliente(e.target.value)} placeholder="Nome do cliente (opcional)" /></div>
                <div><label className="pp-label">Barbeiro</label><input className="pp-input" value={barbeiro} onChange={(e) => setBarbeiro(e.target.value)} /></div>
              </div>
              <label className="pp-label">Servicos</label>
              <div className="pp-grid" style={{ marginBottom: '0.9rem' }}>
                {SERVICES.map((s) => (
                  <div key={s.name} className={`pp-svc ${selected.includes(s.name) ? 'on' : ''}`} onClick={() => toggleService(s.name)}>
                    <span style={{ fontSize: '0.88rem' }}>{s.name}</span>
                    <span style={{ fontFamily: 'Oswald', color: gold, fontSize: '0.9rem' }}>{formatBRL(s.price)}</span>
                  </div>
                ))}
              </div>
              <div className="pp-grid">
                <div><label className="pp-label">Pagamento</label>
                  <select className="pp-input" value={pagamento} onChange={(e) => setPagamento(e.target.value)}>
                    {PAGAMENTOS.map((p) => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>
                <div><label className="pp-label">Observacao</label><input className="pp-input" value={obs} onChange={(e) => setObs(e.target.value)} placeholder="Opcional" /></div>
              </div>
              <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '0.9rem' }}>
                <span className="pp-label" style={{ margin: 0 }}>Total</span>
                <span style={{ fontFamily: 'Oswald', fontSize: '1.6rem', fontWeight: 700, color: gold }}>{formatBRL(total)}</span>
              </div>
            </div>

            <div className="pp-card">
              <div className="pp-title" style={{ fontSize: '0.95rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: 8 }}><Printer size={16} color={gold} /> Impressora</div>
              {conn ? (
                <div className="pp-conn" style={{ background: 'rgba(46,160,67,0.1)', border: '1px solid rgba(46,160,67,0.35)' }}>
                  <CheckCircle2 size={15} color="#3fb950" /> Conectada: <b>{conn.name}</b> ({conn.type === 'bt' ? 'Bluetooth' : 'USB'})
                  <button onClick={disconnect} style={{ marginLeft: 'auto', background: 'none', border: 'none', color: '#9A9080', cursor: 'pointer', fontSize: '0.75rem', textDecoration: 'underline' }}>desconectar</button>
                </div>
              ) : (
                <div className="pp-conn" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', color: '#9A9080' }}>
                  <XCircle size={15} /> Nenhuma impressora conectada
                </div>
              )}
              <div className="pp-grid" style={{ marginBottom: '0.6rem' }}>
                <button className="pp-btn pp-btn-o" onClick={connectBt} disabled={busy || !bluetoothSupported()}><Bluetooth size={15} /> Conectar Bluetooth</button>
                <button className="pp-btn pp-btn-o" onClick={connectUsb} disabled={busy || !usbSupported()}><Usb size={15} /> Conectar USB</button>
              </div>
              <div className="pp-grid" style={{ marginBottom: '0.6rem' }}>
                <button className="pp-btn pp-btn-g" onClick={printReceipt} disabled={busy || !conn}><Printer size={15} /> Imprimir Recibo</button>
                <button className="pp-btn pp-btn-o" onClick={() => doPrint(buildTestTicket())} disabled={busy || !conn}>Imprimir Teste</button>
              </div>
              {isAndroid() && (
                <div className="pp-grid">
                  <button className="pp-btn pp-btn-o" onClick={() => { if (!itens.length) { log('Selecione pelo menos um servico.', 'err'); return } rawbt(receiptBytes()) }} disabled={busy}><Smartphone size={15} /> Recibo via RawBT</button>
                  <button className="pp-btn pp-btn-o" onClick={() => rawbt(buildTestTicket())} disabled={busy}><Smartphone size={15} /> Teste via RawBT</button>
                </div>
              )}
              {!bluetoothSupported() && !usbSupported() && (
                <p style={{ fontSize: '0.78rem', color: '#c0392b', marginTop: '0.6rem' }}>
                  Este navegador nao suporta Web Bluetooth nem WebUSB. Use o Google Chrome ou Microsoft Edge (no iPhone/iPad nao ha suporte — use Android ou computador).
                </p>
              )}
              <div className="pp-log" ref={logBoxRef} style={{ marginTop: '0.8rem' }}>
                {logs.length === 0 && <span style={{ color: '#555' }}>Os detalhes da conexao e impressao aparecem aqui...</span>}
                {logs.map((l, i) => (
                  <div key={i} style={{ color: l.type === 'err' ? '#f85149' : l.type === 'ok' ? '#3fb950' : '#9A9080' }}>
                    [{l.t}] {l.msg}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div>
            <div className="pp-card">
              <div className="pp-title" style={{ fontSize: '0.95rem', marginBottom: '1rem' }}>Pre-visualizacao</div>
              <div className="pp-preview">{preview()}</div>
            </div>

            <div className="pp-card">
              <button onClick={() => setHelpOpen(!helpOpen)} style={{ background: 'none', border: 'none', color: gold, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, width: '100%', padding: 0, fontFamily: "'Oswald',sans-serif", fontWeight: 600, fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                <ChevronDown size={16} style={{ transform: helpOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} /> A impressora nao imprime?
              </button>
              {helpOpen && (
                <div style={{ marginTop: '0.9rem', fontSize: '0.82rem', color: '#9A9080', lineHeight: 1.7 }}>
                  <p style={{ marginBottom: '0.6rem' }}><b style={{ color: '#F5F0E8' }}>1. Teste fisico:</b> desligue a MPT2, segure o botao de papel (feed) e ligue — ela deve imprimir um autoteste. Se nao imprimir, verifique a bobina (papel termico, lado correto para cima) e a bateria/fonte.</p>
                  <p style={{ marginBottom: '0.6rem' }}><b style={{ color: '#F5F0E8' }}>2. Bluetooth + USB ao mesmo tempo:</b> mantenha apenas UMA conexao. Se ela estiver pareada no celular/PC e conectada no cabo, uma conexao trava a outra. Desconecte uma delas.</p>
                  <p style={{ marginBottom: '0.6rem' }}><b style={{ color: '#F5F0E8' }}>3. Bluetooth aqui nao encontra a MPT2:</b> muitas MPT2 sao Bluetooth "classico", que o navegador nao acessa. No Android, use o app gratuito <b style={{ color: '#F5F0E8' }}>RawBT</b> (Play Store): instale, selecione a MPT2 nas configuracoes dele e use os botoes "via RawBT" acima.</p>
                  <p style={{ marginBottom: '0.6rem' }}><b style={{ color: '#F5F0E8' }}>4. USB no Windows:</b> se o Windows ja instalou driver de impressora nessa porta, o navegador nao consegue acesso direto. Imprima pelo driver POS-58 (papel 58mm) ou use Bluetooth/RawBT.</p>
                  <p><b style={{ color: '#F5F0E8' }}>5. Pareamento:</b> PIN padrao da MPT2 costuma ser <b style={{ color: '#F5F0E8' }}>0000</b> ou <b style={{ color: '#F5F0E8' }}>1234</b>.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
