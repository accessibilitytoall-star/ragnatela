# 🕸️ Ragnatela — il cruscotto dei segnali

La pagina che AccessibilityToAll SRL apre per sapere **cosa aspetta una risposta**.
Gli agenti aziendali ci depositano le loro richieste; qui compaiono solo quando serve
davvero un sì, con il messaggio dell'agente in prima persona e un solo bottone.

## Cosa contiene questa cartella

| File | A cosa serve |
|---|---|
| `index.html` | Tutta la pagina: struttura, stile e comportamento in un file solo |
| `manifest.json` | Fa sì che l'iPhone la tratti come un'app, non come un sito |
| `sw.js` | La fa funzionare offline e mette i bottoni dentro le notifiche |
| `icona-192.png`, `icona-512.png` | L'icona sulla schermata Home |
| `.nojekyll` | Dice a GitHub Pages di pubblicare i file così come sono |

## Cosa NON contiene, ed è voluto

Nessun dato aziendale, nessun segreto. La pagina legge da Supabase **dopo il login**,
e la chiave che porta con sé è quella pubblicabile (`publishable`), pensata apposta per
stare dentro una pagina web. I dati sono protetti dalle regole del database, che
richiedono un'utenza autenticata: senza login la pagina non vede nulla.

Per questo può stare in un repo pubblico, **mentre il workspace resta privato**.

## Accessibilità

- Ogni segnale porta colore, icona **ed etichetta scritta**: il colore non è mai l'unica
  informazione, e non si usano mai rosso e verde insieme.
- Testo sempre nero. I sei colori di sfondo sono stati verificati: il contrasto va da
  5,97 a 16,48 — tutti sopra la soglia AA, la maggior parte sopra AAA.
- Il testo cresce con le impostazioni del telefono senza rompere i riquadri.
- VoiceOver legge prima quante cose aspettano, poi l'agente, poi il messaggio.
- I bottoni sono alti almeno 56 pixel e stanno nella metà bassa dello schermo.
- Chi non usa i gesti trova sempre i bottoni; chi li usa può scorrere per decidere.
- Ogni azione ha cinque secondi per essere annullata.

## Come si pubblica

Serve un repo **separato** da `claude-workspace`, che è privato e deve restare tale.
Nella cartella superiore c'è `PUBBLICA IL CRUSCOTTO - doppio clic qui.command`.

Poi, su GitHub: Settings → Pages → Source: branch `main`, cartella `/ (root)`.
L'indirizzo diventa `https://accessibilitytoall-star.github.io/ragnatela/` — lo stesso
a cui punta già il codice QR.

## Il tono dei segnali non lo decide chi scrive

Un agente non può dichiararsi urgente. Il tono lo calcola la vista `rag_cruscotto` in
base ai giorni di attesa e alla scadenza: beige appena arrivato, giallo dopo due giorni,
arancio dopo cinque o se scade domani, fucsia se è fuori tempo.

---

*AccessibilityToAll SRL · 31 agosto 2026*
