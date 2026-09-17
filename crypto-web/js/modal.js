/**
 * MODULO MODAL: Gestione della finestra modale per la spiegazione di Enigma
 * Apre/Chiude la spiegazione dettagliata del funzionamento della macchina
 * Gestisce il blocco dello scroll del body quando il modal è aperto
 */

document.addEventListener('DOMContentLoaded', function() {
    const modal = document.getElementById('enigma-modal');
    const btn = document.getElementById('btn-enigma-how');
    const closeBtn = document.getElementById('modal-close');
    let previousOverflow = ''; // Salva lo stato di overflow precedente
    
    // APERTURA MODAL: Click sul bottone "Come funziona?"
    if (btn) {
        btn.addEventListener('click', function() {
            modal.style.display = 'block';
            // Salva lo stato di overflow attuale per ripristinarlo dopo
            previousOverflow = document.body.style.overflow;
            // Blocca lo scroll della pagina mentre il modal è aperto
            document.body.style.overflow = 'hidden';
        });
    }
    
    // CHIUSURA MODAL: Click sul bottone X
    if (closeBtn) {
        closeBtn.addEventListener('click', function() {
            modal.style.display = 'none';
            // Ripristina lo scroll della pagina
            document.body.style.overflow = previousOverflow;
        });
    }
    
    // CHIUSURA MODAL: Click all'esterno del modal (sull'area scura)
    window.addEventListener('click', function(event) {
        if (event.target === modal) {
            modal.style.display = 'none';
            document.body.style.overflow = previousOverflow;
        }
    });
});
