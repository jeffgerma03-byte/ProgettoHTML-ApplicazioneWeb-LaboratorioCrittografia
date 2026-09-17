/**
 * MODULO MAIN: Gestione della navigazione tra le sezioni didattiche
 * Sistema di tab per alternare tra Home, Cesare, Analisi, Vigenère, Enigma
 */

document.addEventListener('DOMContentLoaded', () => {
    
    // DEFINIZIONE TAB: Bottoni di navigazione
    const tabs = {
        home: document.getElementById('tab-home'),
        caesar: document.getElementById('tab-caesar'),
        analysis: document.getElementById('tab-analysis'),
        vigenere: document.getElementById('tab-vigenere'),
        enigma: document.getElementById('tab-enigma')
    };

    // DEFINIZIONE VISTE (SEZIONI): Contenitori delle sezioni didattiche
    const views = {
        home: document.getElementById('view-home'),      // Introduzione
        caesar: document.getElementById('view-caesar'),  // Cesare
        analysis: document.getElementById('view-analysis'), // Analisi Frequenze
        vigenere: document.getElementById('view-vigenere'), // Vigenère
        enigma: document.getElementById('view-enigma')   // Enigma
    };

    /**
     * FUNZIONE SWITCH TAB: Cambia sezione attiva
     * - Nasconde tutte le viste
     * - Mostra solo la vista selezionata
     * - Rimuove la classe 'active' da tutti i tab
     * - Aggiunge 'active' al tab selezionato
     * @param {string} targetKey - ID della sezione da mostrare
     */
    function switchTab(targetKey) {
        // Nascondi tutte le sezioni e rimuovi lo stato active dai tab
        Object.keys(tabs).forEach(key => {
            tabs[key].classList.remove('active');
            views[key].style.display = 'none';
        });
        // Attiva il tab e la sezione selezionati
        tabs[targetKey].classList.add('active');
        views[targetKey].style.display = 'block';
        
        // Scroll in alto per mostrare l'inizio della sezione
        window.scrollTo(0,0);
    }

    // LISTENER TABS: Aggancia i click sui tab alla navigazione
    Object.keys(tabs).forEach(key => {
        tabs[key].addEventListener('click', () => switchTab(key));
    });

    // LISTENER BOTTONI NAVIGAZIONE: Bottoni "Avanti" e "Torna a Home"
    // Questi permettono di seguire il percorso didattico passo dopo passo
    
    const btnStart = document.getElementById('btn-start');
    if(btnStart) btnStart.addEventListener('click', () => switchTab('caesar')); // Home → Cesare

    const btnNextAnalysis = document.getElementById('btn-next-analysis');
    if(btnNextAnalysis) btnNextAnalysis.addEventListener('click', () => switchTab('analysis')); // Cesare → Analisi

    const btnNextVig = document.getElementById('btn-next-vigenere');
    if(btnNextVig) btnNextVig.addEventListener('click', () => switchTab('vigenere')); // Analisi → Vigenère

    const btnNextEnigma = document.getElementById('btn-next-enigma');
    if(btnNextEnigma) btnNextEnigma.addEventListener('click', () => switchTab('enigma')); // Vigenère → Enigma

    const btnBackHome = document.getElementById('btn-back-home');
    if(btnBackHome) btnBackHome.addEventListener('click', () => switchTab('home')); // Enigma → Home
});