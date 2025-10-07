document.addEventListener('DOMContentLoaded', () => {
    const words = document.querySelectorAll('.word');
    const dropZones = document.querySelectorAll('.drop-zone');
    let draggedWord = null;

    // Sürüklenen kelimeyi takip et
    words.forEach(word => {
        word.addEventListener('dragstart', (e) => {
            draggedWord = word;
            word.classList.add('dragging');
            e.dataTransfer.setData('text/plain', ''); // Firefox için gerekli
        });

        word.addEventListener('dragend', () => {
            word.classList.remove('dragging');
            draggedWord = null;
        });

        // Dokunmatik cihazlar için
        word.addEventListener('touchstart', (e) => {
            draggedWord = word;
            word.classList.add('dragging');
        });

        word.addEventListener('touchend', () => {
            word.classList.remove('dragging');
            draggedWord = null;
        });
    });

    // Bırakma alanlarını yönet
    dropZones.forEach(zone => {
        zone.addEventListener('dragover', (e) => {
            e.preventDefault();
            zone.classList.add('hover');
        });

        zone.addEventListener('dragleave', () => {
            zone.classList.remove('hover');
        });

        zone.addEventListener('drop', (e) => {
            e.preventDefault();
            zone.classList.remove('hover');

            if (draggedWord) {
                // Eğer bırakma alanında zaten bir kelime varsa, onu orijinal konumuna geri gönder
                const existingWord = zone.querySelector('.word');
                if (existingWord) {
                    const originalCategory = document.querySelector(`.category.${existingWord.dataset.type} .words`);
                    originalCategory.appendChild(existingWord);
                }

                // Yeni kelimeyi bırakma alanına taşı
                zone.appendChild(draggedWord);
            }
        });

        // Dokunmatik cihazlar için
        zone.addEventListener('touchend', (e) => {
            e.preventDefault();
            zone.classList.remove('hover');

            if (draggedWord) {
                const existingWord = zone.querySelector('.word');
                if (existingWord) {
                    const originalCategory = document.querySelector(`.category.${existingWord.dataset.type} .words`);
                    originalCategory.appendChild(existingWord);
                }
                zone.appendChild(draggedWord);
            }
        });
    });

    // Kontrol butonu işlevselliği
    const checkButton = document.getElementById('checkButton');
    checkButton.addEventListener('click', () => {
        const sentence = [];
        dropZones.forEach(zone => {
            const word = zone.querySelector('.word');
            if (word) {
                sentence.push({
                    text: word.textContent,
                    type: word.dataset.type
                });
            }
        });

        // Cümle yapısını kontrol et
        const isValid = validateSentence(sentence);
        alert(isValid ? 'Harika! Doğru bir cümle oluşturdun!' : 'Tekrar dene! Cümle yapısı doğru değil.');
    });
});

// Cümle yapısını doğrula
function validateSentence(sentence) {
    if (sentence.length !== 5) return false;

    const expectedOrder = ['karakter', 'renk', 'doku', 'bicim', 'ozellik'];
    return sentence.every((word, index) => word.type === expectedOrder[index]);
}
