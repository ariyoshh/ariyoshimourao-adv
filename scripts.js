// Inicializa o EmailJS
(function() {
    emailjs.init({
        publicKey: "DOemw90iieKu_lv_R",
    });
})();

// Aguarda o carregamento completo do DOM
document.addEventListener('DOMContentLoaded', function() {
    const contatoForm = document.getElementById('contatoForm');
    if (contatoForm) {
        contatoForm.addEventListener('submit', function(event) {
            event.preventDefault();
            enviarEmail();
        });
    }
});

function enviarEmail() {
    const submitBtn = document.getElementById('submitBtn');
    const statusDiv = document.getElementById('status');
    
    // Validação básica
    const nome = document.getElementById('nome').value;
    const email = document.getElementById('email').value;
    const telefone = document.getElementById('telefone').value;
    const mensagem = document.getElementById('mensagem').value;
    
    if (!nome || !email || !telefone || !mensagem) {
        mostrarStatus('Por favor, preencha todos os campos obrigatórios.', 'error');
        return;
    }
    
    // Validação de e-mail simples
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        mostrarStatus('Por favor, insira um endereço de e-mail válido.', 'error');
        return;
    }
    
    // Desabilita o botão para evitar múltiplos envios
    submitBtn.disabled = true;
    submitBtn.textContent = 'Enviando...';
    
    // Limpa mensagens anteriores
    statusDiv.style.display = 'none';
    statusDiv.className = '';

    // Obtém os dados do formulário
    const templateParams = {
        from_name: nome,
        user_email: email,
        telefone: telefone,
        message: mensagem,
        date: new Date().toLocaleString('pt-BR')
    };

    // Envia o email usando o método send
    emailjs.send('service_q9b7wmw', 'template_xtozu09', templateParams)
        .then(function(response) {
            console.log('SUCESSO!', response.status, response.text);
            mostrarStatus('Mensagem enviada com sucesso! Entrarei em contato em breve.', 'success');
            document.getElementById('contatoForm').reset();
        })
        .catch(function(error) {
            console.error('FALHA...', error);
            let errorMsg = 'Erro ao enviar mensagem. ';
            
            if (error.text) {
                errorMsg += 'Detalhes: ' + error.text;
            } else if (error.status === 400) {
                errorMsg += 'Verifique se todos os campos estão preenchidos corretamente.';
            } else {
                errorMsg += 'Tente novamente ou entre em contato diretamente.';
            }
            
            mostrarStatus(errorMsg, 'error');
        })
        .finally(function() {
            // Reabilita o botão
            submitBtn.disabled = false;
            submitBtn.textContent = 'Enviar Mensagem';
        });
}

function mostrarStatus(message, type) {
    const statusDiv = document.getElementById('status');
    statusDiv.textContent = message;
    statusDiv.className = type;
    statusDiv.style.display = 'block';
    
    // Rola a página para mostrar a mensagem
    statusDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    
    // Auto-esconde mensagens de sucesso após 5 segundos
    if (type === 'success') {
        setTimeout(() => {
            statusDiv.style.display = 'none';
        }, 5000);
    }
}