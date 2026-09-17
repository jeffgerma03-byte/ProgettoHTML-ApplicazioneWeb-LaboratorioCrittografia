/**
 * MODULO ENIGMA: Simulazione della Macchina Enigma elettromeccanica
 * 
 * Struttura:
 * - Input → Plugboard (non implementato) → Rotore I (veloce) → Rotore II → Rotore III
 * - Riflettore B → Ritorno attraverso i rotori in senso inverso → Lampboard (Output)
 * 
 * Funzionamento Rotori:
 * - Ogni rotore ha un cablaggio interno (wiring) che trasforma le lettere
 * - Dopo ogni keystroke, il Rotore I avanza (step)
 * - Quando Rotore I raggiunge la sua "tacca" (notch), causa l'avanzamento del Rotore II
 * - Quando Rotore II raggiunge la sua tacca, causa l'avanzamento del Rotore III
 * 
 * Wehrmacht Rotor Configuration:
 * - Rotor I:   Notch=Q (pos 16)
 * - Rotor II:  Notch=E (pos 4)
 * - Rotor III: Notch=V (pos 21)
 */

document.addEventListener('DOMContentLoaded', () => {

    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    
    // CONFIGURAZIONE ROTORI: Wehrmacht (Rotors I, II, III)
    // Ogni rotore ha un cablaggio interno disordinato che permuta le lettere
    const rotors = {
        I:   "EKMFLGDQVZNTOWYHXUSPAIBRCJ",
        II:  "AJDKSIRUXBLHWTMCQGZNPYFVOE",
        III: "BDFHJLCPRTXVZNYEIWGAKMUSQO"
    };
    
    // NOTCH (Tacche): Posizioni che causano il movimento del rotore successivo
    const notches = { I: 'Q', II: 'E', III: 'V' };
    
    // RIFLETTORE B: Componente fisso che rimanda il segnale indietro attraverso i rotori
    // Proprietà cruciale: nessuna lettera viene riflessa in se stessa
    const reflectorB = "YRUHQSLDPXNGOKMIEBFZCWVJAT";

    // STATO ROTORI: Posizione attuale di ciascun rotore (0-25)
    let r1Pos = 0, r2Pos = 0, r3Pos = 0;

    // ELEMENTI DOM
    const inputField = document.getElementById('enigma-input');       // Campo di input (una lettera alla volta)
    const lampsContainer = document.getElementById('enigma-lamps');   // Griglia lampade
    const outputText = document.getElementById('enigma-output-text'); // Nastro output
    
    const rot1Input = document.getElementById('rotor-1');  // Controllo Rotor I (1-26)
    const rot2Input = document.getElementById('rotor-2');  // Controllo Rotor II (1-26)
    const rot3Input = document.getElementById('rotor-3');  // Controllo Rotor III (1-26)
    const btnReset = document.getElementById('btn-reset-enigma');

    // INIZIALIZZAZIONE LAMPBOARD: Griglia di 26 lampadine LED
    // Layout QWERTY (come la tastiera di Enigma reale)
    const qwerty = "QWERTYUIOPASDFGHJKLZXCVBNM";
    if(lampsContainer) {
        let html = "";
        // Crea una lampada per ogni lettera
        for(let char of qwerty) html += `<div id="lamp-${char}" class="lamp">${char}</div>`;
        lampsContainer.innerHTML = html;
    }

    /**
     * FUNZIONE ENIGMA CIPHER CHAR: Cifra una singola lettera
     * 
     * Procedura completa:
     * 1. STEPPING (movimento rotori)
     * 2. FORWARD PASS: Lettera attraversa i 3 rotori da destra a sinistra
     * 3. REFLECTOR: Viene rimbalzata dal riflettore
     * 4. BACKWARD PASS: Ritorna attraverso i 3 rotori da sinistra a destra
     * 5. OUTPUT: Lettera finale illumina una lampada
     */
    function enigmaCipherChar(char) {
        // --- 1. GESTIONE MOVIMENTO ROTORI (STEPPING MECHANISM) ---
        // In Enigma reale, i rotori si muovono PRIMA di cifrare la lettera.
        // Questo è cruciale per il funzionamento della macchina.
        
        // Flag per indicare quali rotori devono muoversi
        let moveR2 = false;  // Flag per rotore II
        let moveR1 = false;  // Flag per rotore III

        // LOGICA TACCHE (Notch positions):
        // - Se Rotor 3 è sulla tacca V, al prossimo step muove Rotor 2
        // - Se Rotor 2 è sulla tacca E, al prossimo step muove Rotor 1
        // Nota: Nel nostro array alfabeto, le lettere mappano agli indici:
        // Q=16, E=4, V=21
        
        // CONTROLLO ROTOR 3 (veloce): Se raggiunge la tacca V, prepara il movimento di R2
        if (alphabet[r3Pos] === notches.III) {
            moveR2 = true;
        }
        
        // CONTROLLO ROTOR 2: Se raggiunge la tacca E, prepara il movimento di R1
        if (alphabet[r2Pos] === notches.II) {
            moveR1 = true;
        }

        // ESECUZIONE MOVIMENTI: Applicazione dei flag
        r3Pos = (r3Pos + 1) % 26; // R3 gira SEMPRE (single stepping)
        
        if (moveR2) {
            r2Pos = (r2Pos + 1) % 26; // R2 gira se triggered da R3
        }
        
        if (moveR1) {
            r1Pos = (r1Pos + 1) % 26; // R1 gira se triggered da R2
        }

        // Aggiorna la visualizzazione UI dei numeri dei rotori
        updateRotorUI();

        let index = alphabet.indexOf(char);

        // --- 2. FORWARD PASS: Il segnale attraversa i rotori da destra a sinistra ---
        // Ordine: Rotor III (destra) → Rotor II → Rotor I (sinistra)
        index = passThroughRotor(index, rotors.III, r3Pos, true);
        index = passThroughRotor(index, rotors.II,  r2Pos, true);
        index = passThroughRotor(index, rotors.I,   r1Pos, true);

        // --- 3. REFLECTOR: Il segnale viene rimbalzato indietro ---
        // Il riflettore non è mobile e rimanda il segnale su un percorso diverso
        let refChar = reflectorB[index];
        index = alphabet.indexOf(refChar);

        // --- 4. BACKWARD PASS: Il segnale ritorna attraverso i rotori al contrario ---
        // Ordine inverso: Rotor I → Rotor II → Rotor III
        // Attraversano gli stessi rotori ma in senso inverso
        index = passThroughRotor(index, rotors.I,   r1Pos, false);
        index = passThroughRotor(index, rotors.II,  r2Pos, false);
        index = passThroughRotor(index, rotors.III, r3Pos, false);

        // --- 5. OUTPUT: Ritorna la lettera cifrata finale ---
        return alphabet[index];
    }

    /**
     * FUNZIONE PASS THROUGH ROTOR: Elabora una lettera attraverso un rotore
     * 
     * Parametri:
     * @param {number} index - Posizione della lettera (0-25)
     * @param {string} wiring - Cablaggio interno del rotore
     * @param {number} pos - Posizione attuale del rotore
     * @param {boolean} forward - true=forward pass, false=backward pass
     * 
     * Forward: La lettera attraversa il cablaggio da sinistra a destra
     * Backward: La lettera attraversa il cablaggio da destra a sinistra (cerca l'indice)
     */
    function passThroughRotor(index, wiring, pos, forward) {
        let offset = pos; // Offset causato dalla rotazione del rotore
        if (forward) {
            // FORWARD: applica l'offset, passa nel cablaggio, togli l'offset
            let realIndex = (index + offset) % 26;
            let wireChar = wiring[realIndex];
            let wireIndex = alphabet.indexOf(wireChar);
            return (wireIndex - offset + 26) % 26;
        } else {
            // BACKWARD: applica l'offset, CERCA nel cablaggio (inverso), togli l'offset
            let realIndex = (index + offset) % 26;
            let charAtPos = alphabet[realIndex];
            let wireIndex = wiring.indexOf(charAtPos);
            return (wireIndex - offset + 26) % 26;
        }
    }

    /**
     * Aggiorna la visualizzazione dei numeri dei rotori nell'UI
     * Converte da indice interno (0-25) a visualizzazione utente (1-26)
     */
    function updateRotorUI() {
        if(rot1Input) rot1Input.value = r1Pos + 1;
        if(rot2Input) rot2Input.value = r2Pos + 1;
        if(rot3Input) rot3Input.value = r3Pos + 1;
    }

    /**
     * Legge i valori dei rotori dall'interfaccia UI
     * Converte da visualizzazione utente (1-26) a indice interno (0-25)
     */
    function readRotorsFromUI() {
        if(rot1Input) r1Pos = (parseInt(rot1Input.value) - 1) % 26;
        if(rot2Input) r2Pos = (parseInt(rot2Input.value) - 1) % 26;
        if(rot3Input) r3Pos = (parseInt(rot3Input.value) - 1) % 26;
    }

    // LISTENER CAMPO INPUT: Gestisce ogni keystroke
    if(inputField) {
        inputField.addEventListener('input', (e) => {
            let val = inputField.value.toUpperCase();
            let char = val.slice(-1); // Ultima lettera inserita

            // GESTIONE BACKSPACE: Rimuove l'ultima lettera dal risultato
            if (e.inputType === "deleteContentBackward") {
                outputText.innerText = outputText.innerText.slice(0, -1);
                return;
            }
            
            // Valida che il carattere sia una lettera dell'alfabeto
            if (!alphabet.includes(char)) return;

            // Al primo caractere, leggi la posizione dei rotori dall'UI
            if (val.length === 1) readRotorsFromUI();

            // Cifra il carattere e aggiorna output e lampboard
            let cipherChar = enigmaCipherChar(char);
            outputText.innerText += cipherChar;
            lightUpLamp(cipherChar);
        });

        // VALIDAZIONE TASTIERA: Consenti solo lettere a-z e A-Z
        inputField.addEventListener('keydown', (e) => {
            if(e.key === "Backspace") return;  // Permetti backspace
            if(!/^[a-zA-Z]$/.test(e.key)) e.preventDefault(); // Blocca altri caratteri
        });
    }

    // BOTTONE RESET: Ricomincia da zero
    if(btnReset) {
        btnReset.addEventListener('click', () => {
            inputField.value = "";          // Svuota input
            outputText.innerText = "";      // Svuota output
            r1Pos = 0; r2Pos = 0; r3Pos = 0; // Reset posizioni rotori
            updateRotorUI();                 // Aggiorna visualizzazione
        });
    }

    /**
     * FUNZIONE LIGHT UP LAMP: Accende la lampada corrispondente
     * Simula il pannello di lampadine storiche (lampboard) di Enigma
     * @param {string} char - Lettera da illuminare
     */
    function lightUpLamp(char) {
        // Spegni tutte le lampade
        document.querySelectorAll('.lamp').forEach(l => l.classList.remove('lit'));
        
        // Accendi la lampada corrispondente alla lettera
        const lamp = document.getElementById(`lamp-${char}`);
        if(lamp) {
            lamp.classList.add('lit');  // Accendi
            // Spegni automaticamente dopo 500ms per un effetto più realistico
            setTimeout(() => lamp.classList.remove('lit'), 500);
        }
    }

    // Inizializza la visualizzazione dei rotori al caricamento
    updateRotorUI();
});