# Santin Estética Automotiva

Site institucional da Santin Estética Automotiva — Chapecó/SC.

R. Princesa Isabel-E, 2300 — Jardim América, Chapecó/SC · 89803-442

## Estrutura

```
site/
├── index.html    página única
├── style.css     estilos
├── script.js     comparador antes/depois + revelações no scroll
└── img/          imagens otimizadas para web
```

HTML estático, sem build. Para ver localmente:

```sh
cd site && python3 -m http.server 8000
```

Para publicar, basta subir a pasta `site/` em qualquer hospedagem estática
(Netlify, Vercel, GitHub Pages, Hostinger).

## Identidade

| Token | Valor | Origem |
|---|---|---|
| Amarelo da marca | `#F8D008` | logo |
| Amarelo rebaixado | `#C9A91C` | rótulos pequenos |
| Preto do box | `#0B0B0C` | foto do box |
| Osso | `#EDE6DA` | texto |

Tipografia: Oswald (títulos), Inter (corpo), JetBrains Mono (rótulos e dados).

## Pendente

- [ ] Substituir o WhatsApp provisório `5549999999999` pelo número real (5 ocorrências em `site/index.html`)
