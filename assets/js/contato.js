// Este script é apenas para a página de contato (contato.html)
document.addEventListener('DOMContentLoaded', () => {
    const formulario = document.getElementById('formulario-contato');
    const msgSucesso = document.getElementById('mensagem-sucesso');
    const containerErro = document.getElementById('container-erro-contato');

    formulario.addEventListener('submit', function(evento) {
        evento.preventDefault();

        const nome = document.getElementById('nome-contato').value.trim();
        const email = document.getElementById('email-contato').value.trim();
        const mensagem = document.getElementById('mensagem-contato').value.trim();
        
        containerErro.classList.add('oculto');
        msgSucesso.classList.add('oculto');

        if (nome === '' || email === '' || mensagem === '') {
            mostrarErro('Por favor, preencha todos os campos.');
            return;
        }

        if (!validarEmail(email)) {
            mostrarErro('Por favor, insira um e-mail válido.');
            return;
        }

        msgSucesso.classList.remove('oculto');
        formulario.reset();
    });

    function mostrarErro(msg) {
        containerErro.textContent = msg;
        containerErro.classList.remove('oculto');
    }

    function validarEmail(email) {
        const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }
});