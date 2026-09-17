/**
 * MODULO VIGENERE: Implementazione del cifrario di Vigenère (sostituzione polialfabetica)
 * La chiave determina quale alfabeto Cesare usare per ogni lettera del messaggio
 */

document.addEventListener('DOMContentLoaded', () => {

    /**
     * FUNZIONE VIGENERE LOGIC: Cifra/Decifra usando il cifrario di Vigenère
     * @param {string} text - Messaggio da elaborare
     * @param {string} key - Parola chiave (es. "VERMEER")
     * @param {boolean} isDecrypt - true per decifrare, false per cifrare
     * @returns {object} - { text: risultato, explanation: spiegazione step-by-step }
     * 
     * Funzionamento:
     * - Ogni lettera della chiave corrisponde a uno shift (A=0, B=1, ..., Z=25)
     * - La chiave si ripete ciclicamente sul messaggio
     * - Ogni lettera del messaggio viene shifata usando il valore chiave corrente
     */
    function vigenereLogic(text, key, isDecrypt) {
        // Validazione: controlla che la chiave non sia vuota
        if(!key) return { text: "Errore: Manca la chiave", explanation: "" };
        
        // Normalizza la chiave: maiuscola e solo lettere
        key = key.toUpperCase().replace(/[^A-Z]/g, '');
        if(key.length === 0) return { text: text, explanation: "Chiave non valida (usa solo lettere)" };

        let result = "";
        let keyIndex = 0; // Traccia la posizione nella chiave
        let steps = []; // Array per memorizzare la spiegazione di ogni passo
        
        // Inizializza la spiegazione step-by-step
        let explanation = text.length > 0 ? `<strong>Chiave Attiva:</strong> "<strong style="color: #2ecc71;">${key}</strong>"<br><br>` : "";
        explanation += `<strong>Procedimento (${isDecrypt ? 'Decifratura' : 'Cifratura'}):</strong><br>`;

        // LOOP: Elabora ogni carattere del testo
        for (let i = 0; i < text.length; i++) {
            const char = text[i];
            const code = char.charCodeAt(0);
            // Verifica se il carattere è una lettera (maiuscola o minuscola)
            let isUpper = (code >= 65 && code <= 90);   // A-Z
            let isLower = (code >= 97 && code <= 122);  // a-z

            if (isUpper || isLower) {
                // Determina la base ASCII (maiuscola o minuscola)
                const base = isUpper ? 65 : 97;
                // Prendi il carattere della chiave corrente (ripetendo ciclicamente)
                const keyChar = key[keyIndex % key.length];
                // Calcola lo shift dal carattere chiave (A=0, B=1, ..., Z=25)
                const shift = keyChar.charCodeAt(0) - 65;
                const originalChar = String.fromCharCode(code);
                
                // Applica la formula di Vigenère
                let newCode;
                if (isDecrypt) {
                    // Decifratura: sottrai lo shift
                    newCode = (code - base - shift + 26) % 26;
                } else {
                    // Cifratura: aggiungi lo shift
                    newCode = (code - base + shift) % 26;
                }
                const encryptedChar = String.fromCharCode(newCode + base);
                result += encryptedChar;
                
                // Registra il passo per la spiegazione
                const operation = isDecrypt ? '-' : '+';
                steps.push(`
                    <span class="step-detail">
                        <strong style="color: #3498db;">${originalChar.toUpperCase()}</strong> ${isDecrypt ? '←' : '→'} 
                        <strong style="color: #e74c3c;">${keyChar}</strong> 
                        (${operation}${shift}) = 
                        <strong style="color: #27ae60;">${encryptedChar.toUpperCase()}</strong>
                    </span>
                `);
                keyIndex++; // Sposta all'indice della chiave successivo
            } else {
                // Caratteri non-alfabetici non vengono cifrati (spazi, punteggiatura, ecc.)
                result += char;
            }
        }
        
        // Costruisci la spiegazione dettagliata
        if(steps.length > 0) {
            explanation += `<div class="steps-container">`;
            steps.forEach((step, idx) => {
                explanation += step;
                // Aggiungi spazi ogni 5 lettere per una migliore leggibilità
                if((idx + 1) % 5 === 0) explanation += `<br>`;
            });
            explanation += `</div>`;
        }
        
        // Ritorna sia il testo elaborato che la spiegazione
        return { text: result, explanation: explanation };
    }

    // Seleziona gli elementi DOM
    const vInput = document.getElementById('v-input');        // Messaggio da cifrare
    const vKey = document.getElementById('v-key');            // Chiave segreta
    const vOutput = document.getElementById('v-output');      // Output cifrato
    const vExplain = document.getElementById('v-explanation'); // Spiegazione step-by-step

    // BOTTONE CIFRATURA: Applica Vigenère per cifrare
    const btnEnc = document.getElementById('btn-v-enc');
    if(btnEnc) {
        btnEnc.addEventListener('click', () => {
            const res = vigenereLogic(vInput.value, vKey.value, false);
            vOutput.innerText = res.text;
            vExplain.innerHTML = res.explanation;
        });
    }

    // BOTTONE DECIFRATURA: Applica Vigenère per decifrare
    const btnDec = document.getElementById('btn-v-dec');
    if(btnDec) {
        btnDec.addEventListener('click', () => {
            const res = vigenereLogic(vInput.value, vKey.value, true);
            vOutput.innerText = res.text;
            vExplain.innerHTML = res.explanation;
        });
    }
});