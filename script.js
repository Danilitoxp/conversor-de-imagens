const dropArea = document.getElementById('dropArea');
const downloadLink = document.getElementById('downloadLink');
const loadingIndicator = document.querySelector('.loading');
const successIndicator = document.querySelector('.success');
const uploadIndicator = document.querySelector('.upload-indicator');

// Previne o comportamento padrão de arrastar e soltar
['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
    dropArea.addEventListener(eventName, preventDefaults, false);
});

function preventDefaults(e) {
    e.preventDefault();
    e.stopPropagation();
}

// Adiciona classes de estilo ao arrastar
['dragenter', 'dragover'].forEach(eventName => {
    dropArea.addEventListener(eventName, () => dropArea.classList.add('dragging'), false);
});

['dragleave', 'drop'].forEach(eventName => {
    dropArea.addEventListener(eventName, () => dropArea.classList.remove('dragging'), false);
});

// Lida com o evento de soltar
dropArea.addEventListener('drop', handleDrop, false);

function handleDrop(e) {
    const dt = e.dataTransfer;
    const file = dt.files[0];
    if (file) {
        handleFile(file);
    }
}

function handleFile(file) {
    uploadIndicator.style.display = 'none'; // Esconde o indicador de upload
    loadingIndicator.style.display = 'flex'; // Mostra o indicador de carregamento
    successIndicator.style.display = 'none'; // Esconde o indicador de sucesso, se estiver visível

    const reader = new FileReader();

    // Define o tipo de leitura como DataURL para suportar vários tipos de imagem
    reader.readAsDataURL(file);

    reader.onloadend = function () {
        const img = new Image();
        img.src = reader.result;

        img.onload = function () {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');

            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);

            // Converte a imagem para JPG
            const dataURL = canvas.toDataURL('image/jpeg');

            downloadLink.href = dataURL;
            downloadLink.download = 'converted-image.jpg';
            downloadLink.style.display = 'inline-flex'; // Mostra o botão de download
            downloadLink.textContent = 'Download Converted Image';

            loadingIndicator.style.display = 'none'; // Esconde o indicador de carregamento
            successIndicator.style.display = 'flex'; // Mostra o ícone de sucesso
        };

        img.onerror = function () {
            // Trata erros ao carregar a imagem
            loadingIndicator.style.display = 'none';
            uploadIndicator.style.display = 'flex';
            alert('Failed to load the image.');
        };
    };

    reader.onerror = function () {
        // Trata erros ao ler o arquivo
        loadingIndicator.style.display = 'none';
        uploadIndicator.style.display = 'flex';
        alert('Failed to read the file.');
    };
}
