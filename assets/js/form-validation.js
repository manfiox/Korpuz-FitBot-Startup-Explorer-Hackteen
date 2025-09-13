// Validação customizada do formulário multipasso

document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('formulario-plano');
    const steps = Array.from(document.querySelectorAll('.form-step'));
    const nextBtns = document.querySelectorAll('.proximo-step');
    const prevBtns = document.querySelectorAll('.voltar-step');
    const erroContainer = document.getElementById('container-erro');

    // Função para mostrar erro
    function showError(message, fieldId) {
        erroContainer.innerHTML = '<span class="material-symbols-outlined icone-erro-aviso">error</span> ' + message;
        erroContainer.classList.remove('oculto');
        // Rola até o erro para garantir visibilidade
        erroContainer.scrollIntoView({ behavior: 'smooth', block: 'center' });
        if (fieldId) {
            const field = document.getElementById(fieldId);
            if (field) {
                field.classList.add('campo-erro');
                field.focus();
            }
        }
    }
    // Limpa erro visual
    function clearErrors() {
        erroContainer.classList.add('oculto');
        erroContainer.textContent = '';
        document.querySelectorAll('.campo-erro').forEach(el => el.classList.remove('campo-erro'));
    }

    // Validação dos campos de cada passo
    function validateStep(stepIndex) {
        clearErrors();
        if (stepIndex === 0) {
            const nome = document.getElementById('nome');
            const sobrenome = document.getElementById('sobrenome');
            const email = document.getElementById('email');
            if (!nome.value.trim()) {
                showError('Preencha o campo Nome.', 'nome');
                return false;
            }
            if (!sobrenome.value.trim()) {
                showError('Preencha o campo Sobrenome.', 'sobrenome');
                return false;
            }
            if (!email.value.trim()) {
                showError('Preencha o campo Email.', 'email');
                return false;
            }
            // Validação simples de email
            if (!/^\S+@\S+\.\S+$/.test(email.value.trim())) {
                showError('Digite um email válido.', 'email');
                return false;
            }
        }
        if (stepIndex === 1) {
            const idade = document.getElementById('idade');
            const peso = document.getElementById('peso');
            const altura = document.getElementById('altura');
            if (!idade.value.trim()) {
                showError('Preencha o campo Idade (de 11 a 100 anos).', 'idade');
                return false;
            }
            if (!peso.value.trim()) {
                showError('Preencha o campo Peso (de 40kg a 300kg).', 'peso');
                return false;
            }
            if (!altura.value.trim()) {
                showError('Preencha o campo Altura.', 'altura');
                return false;
            }
            const idadeVal = parseInt(idade.value, 10);
            const pesoVal = parseFloat(peso.value);
            if (isNaN(idadeVal) || idadeVal < 11 || idadeVal > 100) {
                showError('Insira uma idade válida (de 11 a 100 anos).', 'idade');
                return false;
            }
            if (isNaN(pesoVal) || pesoVal < 40 || pesoVal > 300) {
                let msg = 'Insira um peso válido (de 40kg a 300kg).';
                if (pesoVal < 40 || pesoVal > 300) {
                    msg += ' Valores fora desse intervalo não são saudáveis. Procure um médico!';
                }
                showError(msg, 'peso');
                return false;
            }
        }
        if (stepIndex === 2) {
            const objetivo = document.getElementById('objetivo');
            const nivel = document.getElementById('nivel');
            const frequencia = document.getElementById('frequencia');
            const tipoDieta = document.getElementById('tipo_dieta');
            if (!objetivo.value) {
                showError('Selecione um objetivo.', 'objetivo');
                return false;
            }
            if (!nivel.value) {
                showError('Selecione o nível de treino.', 'nivel');
                return false;
            }
            if (!frequencia.value) {
                showError('Selecione a frequência semanal.', 'frequencia');
                return false;
            }
            if (!tipoDieta.value) {
                showError('Selecione o tipo de dieta.', 'tipo_dieta');
                return false;
            }
        }
        return true;
    }


    // Torna a função global para ser usada em outros scripts
    window.validateStep = validateStep;

    // Validação ao clicar em Próximo (mantém para acessibilidade, mas agora a navegação é controlada no form-steps.js)
    nextBtns.forEach((btn, idx) => {
        btn.addEventListener('click', function (e) {
            const currentStep = steps.findIndex(step => !step.classList.contains('oculto'));
            if (!validateStep(currentStep)) {
                e.preventDefault();
            }
        });
    });

    // Validação final ao enviar
    form.addEventListener('submit', function (e) {
        if (!validateStep(2)) {
            e.preventDefault();
        } else {
            clearErrors();
        }
    });
});
