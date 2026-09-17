/**
 * MODULO ANALYSIS: Analisi statistica delle frequenze delle lettere
 * Criptanalisi basata su frequenze: dimostra come la distribuzione delle lettere
 * rimane invariata nei cifrari monoalfabetici, permettendo di rompere la cifratura
 */

document.addEventListener('DOMContentLoaded', () => {
    
    // Elementi DOM
    const inputArea = document.getElementById('analysis-input');      // Area per incollare il testo
    const chartContainer = document.getElementById('freq-chart');     // Grafico a barre
    const btnSample = document.getElementById('btn-load-sample');     // Bottone carica esempio
    const btnClear = document.getElementById('btn-clear-analysis');   // Bottone pulisci
    const insightBox = document.getElementById('analysis-insight');   // Box per il messaggio di analisi

    // Testo d'esempio: Inizio del Canto I della Divina Commedia cifrato con Cesare (shift 3)
    const sampleText = "QHO PHCCR GHO FDPPLQ GL QRVWUD YLWD PL ULWURYDL SHU XQD VHOYD RVFXUD FKH OD GLULWWD YLD HUD VPDUULWD";

    /**
     * FUNZIONE ANALYZE FREQUENCY: Conta le lettere e crea un grafico
     * Principio: La frequenza delle lettere è un'impronta digitale della lingua
     * Nei cifrari monoalfabetici, le frequenze rimangono invariate
     */
    function analyzeFrequency() {
        const text = inputArea.value.toUpperCase();
        const counts = {};        // Conta occorrenze di ogni lettera
        const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        let totalLetters = 0;     // Numero totale di lettere

        // Inizializza i contatori a zero
        for (let char of alphabet) counts[char] = 0;

        // Conta le occorrenze di ogni lettera
        for (let char of text) {
            if (alphabet.includes(char)) {
                counts[char]++;
                totalLetters++;
            }
        }

        // Se il testo è vuoto, mostra un messaggio
        if (totalLetters === 0) {
            chartContainer.innerHTML = '<p style="text-align:center; padding: 20px; color:#999; width:100%;">Scrivi del testo per vedere il grafico...</p>';
            insightBox.classList.add('hidden');
            return;
        }

        let html = "";
        let maxCount = 0;  // Conta massima (per normalizzare l'altezza delle barre)
        let maxChar = '';  // Lettera più frequente

        // Trova la lettera con frequenza massima
        for (let char in counts) {
            if (counts[char] > maxCount) {
                maxCount = counts[char];
                maxChar = char;
            }
        }

        // Crea le barre del grafico per ogni lettera
        for (let char of alphabet) {
            const count = counts[char];
            // Calcola la percentuale sul totale
            const percentage = ((count / totalLetters) * 100).toFixed(1);
            // Normalizza l'altezza della barra (max = 100%)
            const heightPercent = maxCount > 0 ? (count / maxCount) * 100 : 0;
            // Evidenzia le lettere molto frequenti
            const isHigh = heightPercent > 80 ? "high-freq" : "";

            html += `
                <div class="chart-bar-group" title="${char}: ${count} (${percentage}%)">
                    <div class="chart-value">${count > 0 ? count : ''}</div>
                    <div class="chart-bar ${isHigh}" style="height: ${heightPercent}%;"></div>
                    <div class="chart-label">${char}</div>
                </div>
            `;
        }
        chartContainer.innerHTML = html;

        // Mostra un'analisi del risultato
        insightBox.classList.remove('hidden');
        // Se la lettera più frequente NON è E o A, potrebbe indicare una cifratura
        if (maxChar !== 'E' && maxChar !== 'A') {
            insightBox.innerHTML = `
                <strong>🔍 Analisi Crittoanalitica:</strong><br>
                La lettera più frequente è <strong>'${maxChar}'</strong>. In italiano solitamente è <strong>'E'</strong>.<br>
                Probabile shift: se E diventa ${maxChar}, allora il testo è cifrato.
            `;
        } else {
            insightBox.innerHTML = `<strong>🔍 Analisi:</strong> La lettera più frequente è '${maxChar}'. Distribuzione apparentemente normale.`;
        }
    }

    // LISTENER INPUT: Analizza ogni volta che l'utente modifica il testo
    if(inputArea) inputArea.addEventListener('input', analyzeFrequency);
    
    // BOTTONE CARICA ESEMPIO: Incolla un testo cifrato d'esempio
    if(btnSample) {
        btnSample.addEventListener('click', () => {
            inputArea.value = sampleText;
            analyzeFrequency(); // Aggiorna il grafico automaticamente
        });
    }

    // BOTTONE PULISCI: Svuota l'area e resetta il grafico
    if(btnClear) {
        btnClear.addEventListener('click', () => {
            inputArea.value = "";
            analyzeFrequency(); // Resetta la visualizzazione
        });
    }
});