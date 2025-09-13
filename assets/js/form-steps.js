// Script para navegação entre os passos do formulário multipasso

document.addEventListener('DOMContentLoaded', function () {
    const steps = Array.from(document.querySelectorAll('.form-step'));
    const nextBtns = document.querySelectorAll('.proximo-step');
    const prevBtns = document.querySelectorAll('.voltar-step');
    const stepCircles = document.querySelectorAll('.step-circle');

    let currentStep = 0;

    function showStep(index) {
        steps.forEach((step, i) => {
            step.classList.toggle('oculto', i !== index);
        });
        stepCircles.forEach((el, i) => {
            el.classList.toggle('step-active', i === index);
        });
    }

    // Função de validação importada do form-validation.js, se existir
    function validateStepProxy(stepIndex) {
        if (window.validateStep) {
            return window.validateStep(stepIndex);
        }
        // fallback: sempre permite
        return true;
    }

    nextBtns.forEach((btn, idx) => {
        btn.addEventListener('click', function (e) {
            // Só avança se a validação passar
            if (validateStepProxy(currentStep)) {
                if (currentStep < steps.length - 1) {
                    currentStep++;
                    showStep(currentStep);
                }
            } else {
                // Bloqueia avanço
                e.preventDefault();
            }
        });
    });

    prevBtns.forEach(btn => {
        btn.addEventListener('click', function () {
            if (currentStep > 0) {
                currentStep--;
                showStep(currentStep);
            }
        });
    });

    // Inicializa mostrando o primeiro passo
    showStep(currentStep);
});
