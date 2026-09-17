# CryptoWeb - Crittografia Classica e Didattica

Un'applicazione web interattiva progettata per l'insegnamento e l'apprendimento dei fondamenti della crittografia classica. CryptoWeb accompagna l'utente attraverso l'evoluzione storica dei cifrari, offrendo non solo strumenti di cifratura/decifratura, ma anche simulazioni visive degli attacchi per comprenderne le vulnerabilità matematiche e strutturali.

## Moduli del Progetto

L'applicazione è strutturata in quattro moduli didattici progressivi:

1.  **Sostituzione Monoalfabetica (Cifrario di Cesare)**: 
    *   Cifratura e decifratura con shift modulare matematico `(P + K) mod 26`.
    *   Mappatura visiva e dinamica dell'alfabeto traslato.
    *   *Modulo di attacco*: Dimostrazione pratica di vulnerabilità tramite attacco *Brute Force* (simulazione interattiva su 25 chiavi).
2.  **Crittoanalisi Statistica (Analisi delle Frequenze)**: 
    *   Scansione e conteggio dinamico dei caratteri di un testo cifrato.
    *   Visualizzazione tramite istogrammi proporzionali generati via CSS Grid.
    *   Identificazione visiva immediata (tramite alert di colore rosso) delle lettere ad alta frequenza per supportare l'analisi crittografica.
3.  **Sostituzione Polialfabetica (Cifrario di Vigenère)**: 
    *   Applicazione di chiavi testuali lunghe gestite ciclicamente.
    *   Display dell'output accoppiato alla visualizzazione del procedimento logico e della Tabula Recta virtuale.
4.  **Crittografia Elettromeccanica (Simulatore Enigma)**: 
    *   Simulatore software della storica macchina Enigma I della Wehrmacht.
    *   Riproduzione fedele del sistema di *Odometer stepping* (movimento a Notch dei tre rotori hard-codificati) e del Riflettore B.
    *   Feedback visivo ispirato alla vera macchina tramite *Lampboard* interattiva (CSS `.lit` glow effect) e output su nastro simulato.

##  Architettura e Tecnologie

Il software è stato sviluppato come una **Single Page Application (SPA)** nativa, con un focus estremo sulla leggerezza e sulla portabilità in ambito scolastico:
*   **Zero Dipendenze**: Nessuna libreria esterna. Solo HTML5, CSS3 e JavaScript "Vanilla".
*   **Portabilità Totale**: L'app si esegue interamente lato client nel browser. Non richiede installazioni, configurazioni server o connessione a internet.
*   **Separation of Concerns**: L'architettura separa rigorosamente struttura, stile e logica. Il codice JS è modulare (`main.js` per il DOM routing, file dedicati come `caesar.js`, `enigma.js` per la logica matematica).

## Istruzioni per l'Avvio

1.  Clonare o scaricare il repository.
2.  Non è necessario alcun server locale.
3.  Aprire il file `index.html` con un qualsiasi browser moderno (Chrome, Firefox, Safari, Edge).

##  Autori

Sviluppato per il corso di *Informatica per la creatività, didattica e divulgazione (ICDD)*.
*   **Andrea Peri** (Matricola: 5415544)
*   **Jeffrey Germano** (Matricola: 5669424)
