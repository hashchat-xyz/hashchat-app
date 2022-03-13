'use strict'
Object.defineProperty(exports, '__esModule', { value: !0 })
var p = require('jotai'),
  m = require('react'),
  v = require('caip'),
  i = require('grommet')
function $ (e) {
  return e && typeof e == 'object' && 'default' in e ? e : { default: e }
}
function g (e) {
  if (e && e.__esModule) return e
  var t = Object.create(null)
  return (
    e &&
      Object.keys(e).forEach(function (n) {
        if (n !== 'default') {
          var r = Object.getOwnPropertyDescriptor(e, n)
          Object.defineProperty(
            t,
            n,
            r.get
              ? r
              : {
                  enumerable: !0,
                  get: function () {
                    return e[n]
                  }
                }
          )
        }
      }),
    (t.default = e),
    Object.freeze(t)
  )
}
var o = $(m)
const O = {
    label: 'Fortmatic',
    logo: '',
    getNetworkProvider (e, t) {
      return e === 'ethereum' && t?.apiKey != null ? 'web3' : null
    },
    async getProvider (e, t) {
      if (e !== 'web3') throw new Error(`Unsupported provider: ${e}`)
      if (t?.apiKey == null) throw new Error('Missing apiKey parameter for Fortmatic connector')
      const { default: n } = await Promise.resolve().then(function () {
        return g(require('fortmatic'))
      })
      return new n(t.apiKey).getProvider()
    }
  },
  T = {
    label: 'MetaMask',
    logo: '',
    getNetworkProvider (e) {
      return e === 'ethereum' && typeof window < 'u' && window.ethereum != null ? 'eip1193' : null
    },
    getProvider (e) {
      return e !== 'eip1193'
        ? Promise.reject(new Error(`Unsupported provider: ${e}`))
        : typeof window > 'u' || window.ethereum == null
        ? Promise.reject(new Error('No injected provider'))
        : Promise.resolve(window.ethereum)
    }
  },
  U = {
    label: 'Portis',
    logo: '',
    getNetworkProvider (e, t) {
      return e === 'ethereum' && t != null && t.dAppId != null && t.network != null ? 'web3' : null
    },
    async getProvider (e, t) {
      if (e !== 'web3') throw new Error(`Unsupported provider: ${e}`)
      if (t?.dAppId == null) throw new Error('Missing dAppId parameter for Portis connector')
      if (t?.network == null) throw new Error('Missing network parameter for Portis connector')
      const { default: n } = await Promise.resolve().then(function () {
        return g(require('@portis/web3'))
      })
      return new n(t.dAppId, t.network).provider
    }
  },
  K = {
    label: 'Torus',
    logo: '',
    getNetworkProvider (e, t) {
      return e === 'ethereum' && t?.network != null ? 'eip1193' : null
    },
    async getProvider (e, t) {
      if (e !== 'eip1193') throw new Error(`Unsupported provider: ${e}`)
      if (t?.network == null) throw new Error('Missing network parameter for Torus connector')
      const { default: n } = await Promise.resolve().then(function () {
          return g(require('@toruslabs/torus-embed'))
        }),
        r = new n()
      return await r.init({ showTorusButton: !1, ...t }), await r.login(), r.provider
    }
  },
  R = {
    label: 'WalletConnect',
    logo: '',
    getNetworkProvider (e, t) {
      return e === 'ethereum' && t != null && (t.infuraId != null || t.rpc != null)
        ? 'eip1193'
        : null
    },
    async getProvider (e, t) {
      if (e !== 'eip1193') throw new Error(`Unsupported provider: ${e}`)
      if (t == null || (t.infuraId == null && t.rpc == null))
        throw new Error('Missing infuraId or rpc parameter for WalletConnect connector')
      const { default: n } = await Promise.resolve().then(function () {
        return g(require('@walletconnect/ethereum-provider'))
      })
      return new n(t)
    }
  },
  P = { fortmatic: O, injected: T, portis: U, torus: K, walletConnect: R }
function k (e, t, n) {
  const r = P[t]
  if (r == null) throw new Error(`No default config for connector: ${t}`)
  const u = r.getNetworkProvider(e, n)
  return u ? { ...r, key: t, providerKey: u } : null
}
function x (e, t) {
  const n = typeof t == 'string' ? { key: t } : t,
    r = k(e, n.key, n.params)
  return r ? { ...r, ...n } : n
}
function E (e, t) {
  const n = []
  for (const r of t) {
    const u = x(e, r)
    u.providerKey != null && n.push(u)
  }
  return n
}
async function W (e, t) {
  return new Promise((n, r) => {
    e.sendAsync(t, (u, l) => {
      u == null
        ? l == null
          ? r(new Error('Missing response'))
          : l.error == null
          ? n(l.result)
          : r(l.error)
        : r(u)
    })
  })
}
const H = {
  '0x01': '1',
  '0x1': '1',
  '0x03': '3',
  '0x3': '3',
  '0x04': '4',
  '0x4': '4',
  '0x05': '5',
  '0x5': '5',
  '0x2a': '42'
}
function D (e) {
  if (e instanceof v.ChainID) return e
  const t =
    typeof e == 'object'
      ? e
      : { namespace: 'eip155', reference: typeof e == 'number' ? e.toString() : H[e] || e }
  return new v.ChainID(t)
}
async function z (e) {
  try {
    return (await e.request({ method: 'eth_requestAccounts' }))[0] ?? null
  } catch {
    return null
  }
}
async function F (e) {
  try {
    return (await e.enable())[0] ?? null
  } catch {
    return null
  }
}
async function L (e, t = {}) {
  const [n, r] = await Promise.all([
    t.account ?? z(e),
    t.chainID ?? e.request({ method: 'eth_chainId' })
  ])
  return { account: n, chainID: D(r) }
}
async function G (e, t = {}) {
  const [n, r] = await Promise.all([
    t.account ?? F(e),
    t.chainID ?? W(e, { method: 'eth_chainId' })
  ])
  return { account: n, chainID: D(r) }
}
async function J (e, t, n = {}) {
  let r
  if (e === 'eip1193') r = await L(t, n)
  else if (e === 'web3') r = await G(t, n)
  else throw new Error(`Unsupported Ethereum provider: ${e}`)
  return { ...r, provider: t, providerKey: e }
}
const b = { ethereum: { label: 'Ethereum', logo: '', connectors: ['injected'], getState: J } }
function I (e) {
  const t = b[e]
  if (t == null) throw new Error(`No default config for network: ${e}`)
  const n = E(e, t.connectors)
  return { ...t, connectors: n, key: e }
}
function S (e) {
  if (typeof e == 'string') return I(e)
  const t = b[e.key]
  if (t == null) throw new Error(`No default config for network: ${e.key}`)
  const n = E(e.key, e.connectors ?? t.connectors)
  return { ...t, ...e, connectors: n }
}
function A (e) {
  return e.map(S)
}
const N = Symbol(),
  Q = p.atom({ status: 'idle' })
function M () {
  let e
  const t = new Promise((n, r) => {
    e = { resolve: n, reject: r }
  })
  return Object.assign(t, e)
}
function y () {
  return p.useAtom(Q, N)
}
function V () {
  const [e, t] = y(),
    n = m.useCallback(() => {
      e.status === 'authenticating' && e.promise.resolve(null)
    }, [e]),
    r = m.useCallback(async () => {
      const a = M()
      return t({ status: 'authenticating', modal: !0, promise: a }), await a
    }, [t]),
    u = m.useCallback(
      async ({ mode: a = 'reuse', showModal: c } = {}) => {
        switch (a) {
          case 'select':
            return e.status === 'authenticating'
              ? (e.modal || t({ ...e, modal: !0 }), await e.promise)
              : await r()
          case 'reset':
            return n(), await r()
          case 'reuse':
            switch (e.status) {
              case 'authenticated':
                return e.auth
              case 'authenticating':
                return c && !e.modal && t({ ...e, modal: !0 }), await e.promise
              default:
                return await r()
            }
        }
      },
      [e, n, t, r]
    ),
    l = m.useCallback(() => {
      n(), t({ status: 'idle' })
    }, [n, t])
  return [e, u, l]
}
const X = ''
function Y () {}
function Z ({ children: e, src: t }) {
  return o.default.createElement(
    'div',
    {
      style: {
        position: 'relative',
        display: 'inline-block',
        width: '70px',
        height: '70px',
        marginBottom: '10px',
        borderRadius: '10px',
        backgroundColor: '#D8D8D8',
        backgroundSize: 'cover',
        backgroundImage: `url(${t})`
      }
    },
    e
  )
}
function ee ({ children: e }) {
  return o.default.createElement(
    'div',
    { style: { display: 'inline-block', margin: '11px', width: '70px', height: '70px' } },
    e
  )
}
function te ({ children: e }) {
  return o.default.createElement(
    'div',
    {
      style: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        marginBottom: '-15px',
        marginRight: '-15px'
      }
    },
    e
  )
}
function j ({
  disabled: e,
  label: t,
  loading: n,
  logo: r,
  onClick: u,
  selected: l,
  selectedIcon: a
}) {
  let c = null
  if (l) {
    const h =
      a == null || typeof a == 'string'
        ? o.default.createElement('img', { alt: '\u2713', src: a ?? X })
        : a
    c = o.default.createElement(te, null, h)
  }
  return o.default.createElement(
    i.Box,
    { align: 'center', direction: 'column', flex: !1, margin: 'small', onClick: e ? Y : u },
    o.default.createElement(
      Z,
      { src: r },
      n
        ? o.default.createElement(ee, null, o.default.createElement(i.Spinner, { size: 'medium' }))
        : null,
      c
    ),
    o.default.createElement(i.Text, null, t)
  )
}
function q ({ children: e }) {
  return o.default.createElement(
    'div',
    { style: { display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)' } },
    e
  )
}
const ne = ''
function re ({ closeIcon: e, networks: t, selectedIcon: n, text: r, title: u }) {
  const [l, a] = y()
  if (l.status !== 'authenticating' || !l.modal) return null
  const c = t.find(f => f.key === 'ethereum')
  if (c == null) return console.warn('Ethereum provider missing in config'), null
  const h = c.connectors.map(f => {
      const d = { key: 'ethereum', connector: f },
        B = () => {
          l.status === 'authenticating'
            ? l.method == null && a({ ...l, method: d })
            : a({ status: 'authenticating', promise: M(), method: d, modal: !0 }),
            f
              .getProvider(f.providerKey, f.params)
              .then(s => c.getState(f.providerKey, s))
              .then(
                s => {
                  if (s.account == null)
                    l.status === 'authenticating' && l.promise.resolve(null), a({ status: 'idle' })
                  else {
                    const C = {
                      accountID: new v.AccountID({ address: s.account, chainId: s.chainID }),
                      method: d,
                      state: s
                    }
                    l.status === 'authenticating' && l.promise.resolve(C),
                      a({ status: 'authenticated', auth: C })
                  }
                },
                s => {
                  l.status === 'authenticating' && l.promise.reject(s),
                    a({ status: 'failed', error: s })
                }
              )
        }
      return o.default.createElement(j, {
        disabled: l.status === 'authenticating' && l.method != null,
        key: d.connector.key,
        label: d.connector.label,
        loading: l.status === 'authenticating' && l.method?.connector.key === d.connector.key,
        logo: d.connector.logo,
        onClick: B,
        selectedIcon: n
      })
    }),
    _ =
      typeof e == 'string'
        ? o.default.createElement('img', { alt: 'x', src: e })
        : e ?? o.default.createElement('img', { alt: 'x', src: ne }),
    w = () => {
      l.status === 'authenticating' &&
        (l.method == null
          ? (l.promise.resolve(null), a({ status: 'idle' }))
          : a({ ...l, modal: !1 }))
    }
  return o.default.createElement(
    i.Layer,
    { onEsc: w, onClickOutside: w },
    o.default.createElement(
      i.Box,
      { flex: 'grow', pad: 'small', width: 'large' },
      o.default.createElement(
        i.Box,
        { direction: 'row' },
        o.default.createElement(
          i.Box,
          { flex: 'grow' },
          o.default.createElement(
            i.Heading,
            { level: 2, margin: { bottom: 'small', top: 'none' } },
            u ?? 'Connect wallet'
          )
        ),
        o.default.createElement(
          i.Box,
          null,
          o.default.createElement(i.Button, {
            icon: _,
            onClick: w,
            plain: !0,
            style: { padding: '10px' }
          })
        )
      ),
      o.default.createElement(
        i.Box,
        { overflow: 'auto', height: { max: 'calc(100vh - 120px)' } },
        o.default.createElement(
          i.Box,
          { flex: !1 },
          r ? o.default.createElement(i.Text, { margin: { bottom: 'small' } }, r) : null,
          o.default.createElement(
            i.Heading,
            { level: 4, margin: { vertical: 'small' } },
            '1. Choose network'
          ),
          o.default.createElement(
            q,
            null,
            o.default.createElement(j, {
              label: c.label,
              logo: c.logo,
              onClick: () => {},
              selected: !0,
              selectedIcon: n
            })
          ),
          o.default.createElement(
            i.Heading,
            { level: 4, margin: { vertical: 'small' } },
            '2. Choose wallet'
          ),
          o.default.createElement(q, null, h)
        )
      )
    )
  )
}
function oe (e) {
  const [t] = m.useState(() => A(e.networks ?? ['ethereum']))
  return o.default.createElement(
    p.Provider,
    { scope: N },
    e.children,
    o.default.createElement(re, { ...(e.modal ?? {}), networks: t })
  )
}
;(exports.Provider = oe),
  (exports.connectorsDefaults = P),
  (exports.getConnectorConfig = x),
  (exports.getConnectorsConfig = E),
  (exports.getDefaultConnectorConfig = k),
  (exports.getDefaultNetworkConfig = I),
  (exports.getNetworkConfig = S),
  (exports.getNetworksConfig = A),
  (exports.networksDefaults = b),
  (exports.useAuthState = y),
  (exports.useMultiAuth = V)
//# sourceMappingURL=lib.cjs.map
