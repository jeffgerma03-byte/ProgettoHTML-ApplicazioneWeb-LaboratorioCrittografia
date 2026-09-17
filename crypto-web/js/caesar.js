/**
 * FUNZIONE GLOBALE: Cifra/Decifra con algoritmo Cesare
 * @param {string} str - Testo da elaborare
 * @param {number} shift - Numero di posizioni da traslare (1-25)
 * @returns {string} - Testo cifrato/decifrato
 * 
 * Logica: Ogni lettera viene spostata di 'shift' posizioni nell'alfabeto.
 * Usa aritmetica modulare per gestire il ciclo A-Z (dopo Z ritorna ad A).
 */
function caesarLogic(str, shift) {
    shift = parseInt(shift) || 0;
    shift = shift % 26; // Normalizza: shift > 25 viene ricondotto al range 0-25
    
    return str.split('').map(char => {
        const code = char.charCodeAt(0);
        if (code >= 65 && code <= 90) {
            return String.fromCharCode(((code - 65 + shift + 26) % 26) + 65);
        }
        else if (code >= 97 && code <= 122) {
            return String.fromCharCode(((code - 97 + shift + 26) % 26) + 97);
        }
        return char;
    }).join('');
}

// Inizializzazione: Attendi il caricamento completo del DOM
document.addEventListener('DOMContentLoaded', () => {
    
    // Elementi DOM
    const cInput = document.getElementById('c-input');        // Campo input testo
    const cOutputBox = document.getElementById('c-output-box'); // Area output risultato
    const cShift = document.getElementById('c-shift');         // Input shift (1-25)
    const visualizer = document.getElementById('caesar-visualizer'); // Griglia alfabeto dinamica

    /**
     * Disegna la mappatura dinamica dell'alfabeto
     * Mostra come ogni lettera in chiaro si trasforma nella lettera cifrata
     * @param {number} shift - Valore dello shift
     */
    function drawVisualizer(shift) {
        if (!visualizer) return;
        
        let shiftVal = parseInt(shift);
        // Valida che lo shift sia un numero tra 0 e 25
        const isValid = !isNaN(shiftVal) && shiftVal >= 0 && shiftVal <= 25;
        if(!isValid) shiftVal = 0; 

        const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        let html = "";
        
        // Riga 1: Alfabeto in chiaro (A-Z)
        for (let char of alphabet) html += `<div class="alph-cell alph-plain">${char}</div>`;
        
        // Riga 2: Alfabeto cifrato (con il shift applicato)
        for (let i = 0; i < 26; i++) {
            // Calcola la posizione cifrata usando modulo 26
            let newIndex = (i + shiftVal) % 26;
            if (newIndex < 0) newIndex += 26;
            let cipherChar = alphabet[newIndex];
            let styleClass = isValid ? "alph-cipher" : "alph-plain"; 
            html += `<div class="alph-cell ${styleClass}" style="${!isValid ? 'opacity:0.5' : ''}">${cipherChar}</div>`;
        }
        visualizer.innerHTML = html;
    }

    if(cShift) {
        cShift.addEventListener('input', () => drawVisualizer(cShift.value));
        drawVisualizer(3);
    }

    /**
     * Valida il valore dello shift
     * Controlla che sia un numero intero tra 1 e 25
     * @param {number} val - Valore da validare
     * @returns {string|null} - Messaggio di errore o null se valido
     */
    function validateShift(val) {
        val = parseInt(val);
        if (isNaN(val)) return "Inserisci un numero.";
        if (val > 25) return "Errore: Lo spostamento massimo è 25.";
        if (val < 1) return "Errore: Lo spostamento deve essere almeno 1.";
        return null; // Nessun errore
    }

    // BOTTONE CIFRATURA: Applica shift positivo
    const btnEnc = document.getElementById('btn-c-enc');
    if(btnEnc) {
        btnEnc.addEventListener('click', () => {
            const error = validateShift(cShift.value);
            if (error) {
                // Mostra errore in rosso
                cOutputBox.innerHTML = `<span style="color: #d63031; font-weight: bold;">⚠️ ${error}</span>`;
                cOutputBox.style.backgroundColor = "#fff5f5";
                cOutputBox.style.borderColor = "#ffadad";
                return;
            }
            // Stile success (verde)
            cOutputBox.style.backgroundColor = "#e8f5e9";
            cOutputBox.style.borderColor = "#a5d6a7";
            cOutputBox.style.color = "#1b5e20";
            
            // Applica shift positivo per cifratura
            cOutputBox.innerText = caesarLogic(cInput.value, parseInt(cShift.value));
        });
    }

    // BOTTONE DECIFRATURA: Applica shift negativo per invertire la cifratura
    const btnDec = document.getElementById('btn-c-dec');
    if(btnDec) {
        btnDec.addEventListener('click', () => {
            const error = validateShift(cShift.value);
            if (error) {
                cOutputBox.innerHTML = `<span style="color: #d63031; font-weight: bold;">⚠️ ${error}</span>`;
                return;
            }
            cOutputBox.style.backgroundColor = "#e8f5e9";
            cOutputBox.style.borderColor = "#a5d6a7";
            
            // Applica shift negativo per decifratura (inverte la cifratura)
            cOutputBox.innerText = caesarLogic(cInput.value, -parseInt(cShift.value));
        });
    }

    /**
     * BRUTE FORCE: Tenta tutte le 25 chiavi possibili
     * Dimostra la vulnerabilità del cifrario Cesare
     * Prova ogni shift da 1 a 25 per decriptare il testo
     */
    const btnAnalyze = document.getElementById('btn-c-analyze');
    if(btnAnalyze) {
        btnAnalyze.addEventListener('click', () => {
            let cipherText = cOutputBox.innerText.trim();
            const outBox = document.getElementById('c-analysis-output');
            
            // Validazione: controlla che esista un testo cifrato valido
            if(cOutputBox.innerHTML.includes("⚠️") || !cipherText || cipherText === "..." || cipherText === "") {
                outBox.classList.remove('hidden');
                outBox.innerHTML = "<div style='color:#d63031; padding:10px; font-weight:bold;'>⚠️ Errore: Prima devi cifrare un messaggio valido!</div>";
                return;
            }

            // Costruisci la lista di tentativi
            let html = `<p style="margin-bottom:10px; border-bottom:1px solid #ccc; padding-bottom:5px;">Analisi sul testo: <strong>"${cipherText}"</strong></p><ul style="max-height: 200px; overflow-y: auto;">`;
            
            // Prova tutti i 25 shift possibili
            for(let i=1; i<26; i++) {
                let attempt = caesarLogic(cipherText, -i); // Decifra con shift negativo
                html += `<li><strong>Shift -${i}:</strong> <span style="font-family:monospace; color:#333;">${attempt}</span></li>`;
            }
            html += "</ul>";
            outBox.classList.remove('hidden');
            outBox.innerHTML = html;
        });
    }
});