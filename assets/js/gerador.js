// Este script é apenas para a página principal (index.html)
document.addEventListener('DOMContentLoaded', () => {

    const formulario = document.getElementById('formulario-plano');
    const painelInformativo = document.getElementById('painel-informativo');
    const containerFormulario = document.getElementById('container-formulario');
    const containerResultado = document.getElementById('container-resultado');
    const containerErro = document.getElementById('container-erro');

    function mostrarErro(mensagem) {
        containerErro.textContent = mensagem;
        containerErro.classList.remove('oculto');
        setTimeout(() => containerErro.classList.add('oculto'), 5000);
    }

    function validarFormulario(idade, peso, altura) {
        if (!idade || idade < 12 || idade > 100) {
            mostrarErro('Idade inválida (entre 12 e 100 anos).');
            return false;
        }
        if (!peso || peso < 30 || peso > 300) {
            mostrarErro('Peso inválido (entre 30kg e 300kg).');
            return false;
        }
        if (!altura || altura < 100 || altura > 250) {
            mostrarErro('Altura inválida (entre 100cm e 250cm).');
            return false;
        }
        return true;
    }

    function getExercicioImg(nome) {
        const mapa = {
            'Supino Reto': 'img/exercicios/supino_reto.png.jpg',
            'Supino Inclinado': 'img/exercicios/supino_inclinado.png.jpg',
            'Supino Inclinado c/ Halteres': 'img/exercicios/supino_inclinado.png.jpg',
            'Flexão de Braço': 'img/exercicios/flexao.png.jpg',
            'Flexão na Paralela': 'img/exercicios/flexao_paralela.png.gif',
            'Puxada Frontal': 'img/exercicios/puxada_frontal.png.jpg',
            'Remada Curvada': 'img/exercicios/remada_curvada.png.jpg',
            'Rosca Direta': 'img/exercicios/rosca_direta.png.jpg',
            'Tríceps Polia': 'img/exercicios/triceps_polia.png.jpg',
            'Tríceps Corda': 'img/exercicios/triceps_corda.png.jpg',
            'Agachamento Livre': 'img/exercicios/agachamento.png.jpg',
            'Leg Press': 'img/exercicios/leg_press.png.jpg',
            'Leg Press 45º': 'img/exercicios/leg_press.png.jpg',
            'Cadeira Extensora': 'img/exercicios/extensora.png.jpg',
            'Mesa Flexora': 'img/exercicios/flexora.png.gif',
            'Desenvolvimento c/ Halteres': 'img/exercicios/desenvolvimento.png.webp',
            'Desenvolvimento Militar': 'img/exercicios/desenvolvimento.png.webp',
            'Desenvolvimento Arnold': 'img/exercicios/desenvolvimento.png.webp',
            'Elevação Lateral': 'img/exercicios/elevacao_lateral.png.jpg',
            'Abdominal Supra': 'img/exercicios/abdominal.png.jpg',
            'Prancha': 'img/exercicios/prancha.png.gif',
            'Cardio': 'img/exercicios/cardio.png.jpg',
        };
        return mapa[nome] || 'img/exercicios/padrao.png';
    }

    function gerarHtmlTreino(treinoData) {
        if (!treinoData || !treinoData.planoBase) return '<p>Plano de treino não disponível.</p>';
        const { divisao, planoBase } = treinoData;

        const diasHtml = planoBase.dias.map(dia => `
            <div class="plano-dia">
                <h4><span class="material-symbols-outlined icone-lista-resultado">calendar_month</span>${dia.dia}</h4>
                <ul>
                    ${dia.exercicios.map(ex => `<li class="exercicio-item"><img class="exercicio-img efeito-ampliar" src="${getExercicioImg(ex.nome)}" alt="${ex.nome}"><span class="exercicio-nome">${ex.nome}</span><span class="exercicio-reps">${ex.reps}</span></li>`).join('')}
                </ul>
            </div>
        `).join('');
    // Efeito de ampliar imagem ao clicar no mobile
    document.body.addEventListener('click', function(e) {
        if (e.target.classList.contains('efeito-ampliar')) {
            // Remove a classe ampliada de todas as imagens
            document.querySelectorAll('.exercicio-img.efeito-ampliar.ampliada').forEach(img => img.classList.remove('ampliada'));
            // Adiciona na imagem clicada
            e.target.classList.add('ampliada');
            // Remove após 1.2s
            setTimeout(() => e.target.classList.remove('ampliada'), 1200);
        }
    });

        const dicasHtml = `<div class="plano-dicas"><h4><span class="material-symbols-outlined icone-google">lightbulb</span>Dicas Importantes</h4><p>${planoBase.dicas}</p></div>`;
        return `<div class="plano-divisao">${divisao.titulo}<br><small>${divisao.schema}</small></div>${diasHtml}${dicasHtml}`;
    }

    function gerarHtmlDieta(dietaData) {
        if (!dietaData) return '<p>Plano de dieta não disponível.</p>';
        const refeicoesHtml = `<div class="plano-refeicoes"><ul>${dietaData.refeicoes.map(r => `<li class="refeicao-item"><span class="refeicao-nome"><span class="material-symbols-outlined icone-lista-resultado">restaurant_menu</span>${r.nome}</span><span class="refeicao-desc">${r.descricao}</span></li>`).join('')}</ul></div>`;
        const resumoHtml = `<div class="plano-resumo"><h4><span class="material-symbols-outlined icone-google">info</span>Resumo da Estratégia</h4><p>${dietaData.resumo}</p></div>`;
        return `${refeicoesHtml}${resumoHtml}`;
    }

    formulario.addEventListener('submit', function(evento) {
        evento.preventDefault();
        
        const dadosUsuario = {
            nome: document.getElementById('nome').value,
            sobrenome: document.getElementById('sobrenome').value,
            idade: parseInt(document.getElementById('idade').value),
            peso: parseFloat(document.getElementById('peso').value),
            altura: parseInt(document.getElementById('altura').value),
            objetivo: document.getElementById('objetivo').value,
            nivel: document.getElementById('nivel').value,
            frequencia: parseInt(document.getElementById('frequencia').value),
            tipo_dieta: document.getElementById('tipo_dieta').value
        };

        if (!validarFormulario(dadosUsuario.idade, dadosUsuario.peso, dadosUsuario.altura)) return;

        const plano = gerarPlanoPersonalizado(dadosUsuario);
        
        painelInformativo.classList.add('oculto');
        containerFormulario.classList.add('oculto');
        containerResultado.classList.remove('oculto');

        const htmlTreino = gerarHtmlTreino(plano.treino);
        const htmlDieta = gerarHtmlDieta(plano.dieta);

        containerResultado.innerHTML = `
            <div class="cartao">
                <div style="text-align: center; margin-bottom: 2rem;">
                    <h2 class="titulo-gradiente" style="font-size: 2rem;">Plano Gerado, ${dadosUsuario.nome}!</h2>
                    <p class="texto-suporte">Abaixo está seu plano personalizado. Lembre-se que este é um ponto de partida!</p>
                </div>
                
                <div class="grid-dados-resultado">
                    <h3><span class="material-symbols-outlined icone-lista-resultado">person_outline</span>Seus Dados</h3>
                    <p><strong>Nome:</strong> ${dadosUsuario.nome} ${dadosUsuario.sobrenome}</p>
                    <p><strong>Idade:</strong> ${dadosUsuario.idade} anos</p>
                    <p><strong>Peso:</strong> ${dadosUsuario.peso} kg</p>
                    <p><strong>Altura:</strong> ${dadosUsuario.altura} cm</p>
                    <p><strong>Objetivo:</strong> ${dadosUsuario.objetivo}</p>
                    <p><strong>Nível:</strong> ${dadosUsuario.nivel}</p>
                </div>

                <div class="grid-planos">
                    <div class="plano-card plano-card-treino">
                        <h3><span class="material-symbols-outlined icone-lista-resultado">fitness_center</span>Plano de Treino</h3>
                        <div class="plano-conteudo">${htmlTreino}</div>
                    </div>
                    <div class="plano-card plano-card-dieta">
                        <h3><span class="material-symbols-outlined icone-lista-resultado">restaurant_menu</span>Plano de Dieta</h3>
                        <div class="plano-conteudo">${htmlDieta}</div>
                    </div>
                </div>
                
                <div class="botoes-resultado">
                    <button id="botao-gerar-novo" class="botao-principal animacao-pulso"><span class="material-symbols-outlined">refresh</span>Gerar Novo Plano</button>
                    <button id="botao-salvar-pdf" class="botao-principal botao-pdf"><span class="material-symbols-outlined">download</span>Imprimir</button>
                </div>

                <div class="observacao-personalizacao">
                    <p><strong>Importante:</strong> Este plano é gerado com base nas suas informações, mas nós também oferecemos um plano realmente personalizado e com acompanhamento profissional!</p>
                   <a href="https://wa.me/5515997262538?text=Olá, vim pelo Korpuz Bot e queria saber mais sobre os serviços" id="botao-saiba-mais" class="btn btn-primary d-inline-flex align-items-center">
  <span class="material-symbols-outlined me-1">info</span>
  Saiba Mais
</a>

                </div>
            </div>`;
        
        document.getElementById('botao-gerar-novo').addEventListener('click', () => {
            containerResultado.classList.add('oculto');
            painelInformativo.classList.remove('oculto');
            containerFormulario.classList.remove('oculto');
            formulario.reset();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });

        document.getElementById('botao-salvar-pdf').addEventListener('click', () => {
            // Usa window.print() para gerar PDF do conteúdo visível
            // Para controle mais fino, uma biblioteca como jsPDF seria necessária.
            window.print();
        });

        document.getElementById('botao-saiba-mais').addEventListener('click', () => {
            window.location.href = 'servicos.html';
        });

        containerResultado.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
});

function gerarPlanoPersonalizado({ objetivo, nivel, frequencia, tipo_dieta }) {
    
    const treinos = {
        "emagrecer": {
            "iniciante": {
                titulo: "Treino para Emagrecer - Iniciante",
                dias: [
                    { dia: "Segunda: Peito & Tríceps", exercicios: [ {nome: "Supino Reto", reps:"3x 12-15"}, {nome: "Supino Inclinado", reps:"3x 12-15"}, {nome: "Flexão de Braço", reps:"3x máx"}, {nome: "Tríceps Polia", reps:"3x 15-20"}, {nome: "Cardio", reps:"20min caminhada"} ]},
                    { dia: "Terça: Costas & Bíceps", exercicios: [ {nome: "Puxada Frontal", reps:"3x 12-15"}, {nome: "Remada Curvada", reps:"3x 12-15"}, {nome: "Rosca Direta", reps:"3x 15-20"}, {nome: "Cardio", reps:"20min bicicleta"} ]},
                    { dia: "Quarta: Pernas", exercicios: [ {nome: "Agachamento Livre", reps:"3x 12-15"}, {nome: "Leg Press", reps:"3x 15-20"}, {nome: "Cadeira Extensora", reps:"3x 15-20"}, {nome: "Mesa Flexora", reps:"3x 15-20"} ]},
                    { dia: "Sexta: Ombros & Abdômen", exercicios: [ {nome: "Desenvolvimento c/ Halteres", reps:"3x 12-15"}, {nome: "Elevação Lateral", reps:"3x 15-20"}, {nome: "Abdominal Supra", reps:"3x 20-25"}, {nome: "Prancha", reps:"3x 30-45s"} ]}
                ],
                dicas: "Descanse 60s entre séries. Foque na execução correta dos movimentos antes de aumentar a carga."
            },
            "intermediário": {
                titulo: "Treino para Emagrecer - Intermediário",
                dias: [
                    { dia: "Segunda: Peito & Tríceps", exercicios: [ {nome: "Supino Reto", reps:"4x 10-12"}, {nome: "Supino Inclinado c/ Halteres", reps:"4x 10-12"}, {nome: "Crucifixo", reps:"3x 12-15"}, {nome: "Tríceps Testa", reps:"4x 10-12"}, {nome: "Cardio HIIT", reps:"25min"} ]},
                    { dia: "Terça: Costas & Bíceps", exercicios: [ {nome: "Barra Fixa (ou Graviton)", reps:"4x máx"}, {nome: "Remada Curvada", reps:"4x 10-12"}, {nome: "Serrote", reps:"3x 10-12"}, {nome: "Rosca Direta", reps:"4x 10-12"}, {nome: "Rosca Alternada", reps:"3x 12-15"} ]},
                    { dia: "Quinta: Pernas", exercicios: [ {nome: "Agachamento Livre", reps:"4x 10-12"}, {nome: "Leg Press 45º", reps:"4x 12-15"}, {nome: "Afundo", reps:"3x 12/perna"}, {nome: "Stiff", reps:"4x 12-15"}, {nome: "Panturrilha em pé", reps:"4x 15-20"} ]},
                    { dia: "Sexta: Ombros & Abdômen", exercicios: [ {nome: "Desenvolvimento Militar", reps:"4x 10-12"}, {nome: "Elevação Lateral", reps:"4x 12-15"}, {nome: "Elevação Posterior", reps:"3x 15"}, {nome: "Abdominal na Polia", reps:"4x 15"}, {nome: "Prancha c/ Peso", reps:"4x 45-60s"} ]}
                ],
                dicas: "Descanse 45-60s. Use técnicas como superséries (combinar 2 exercícios sem descanso) para aumentar a intensidade."
            },
            "avançado": {
                titulo: "Treino para Emagrecer - Avançado",
                dias: [
                    { dia: "Segunda: Peito & Tríceps", exercicios: [ {nome: "Supino Reto", reps:"5x 8-10"}, {nome: "Supino Inclinado", reps:"4x 8-10"}, {nome: "Flexão na Paralela", reps:"4x máx"}, {nome: "Tríceps Corda", reps:"5x 10-12"}, {nome: "Cardio HIIT", reps:"30min intenso"} ]},
                    { dia: "Terça: Costas & Bíceps", exercicios: [ {nome: "Barra Fixa c/ Peso", reps:"5x 6-8"}, {nome: "Remada Curvada", reps:"5x 8-10"}, {nome: "Puxada Alta", reps:"4x 10"}, {nome: "Rosca Direta", reps:"5x 8-10"}, {nome: "Rosca Scott", reps:"4x 10"} ]},
                    { dia: "Quinta: Pernas", exercicios: [ {nome: "Agachamento Livre", reps:"5x 8-10"}, {nome: "Leg Press", reps:"5x 10-12"}, {nome: "Cadeira Extensora (Drop-set)", reps:"4x 10+10"}, {nome: "Mesa Flexora", reps:"5x 10-12"} ]},
                    { dia: "Sexta: Ombros & Abdômen", exercicios: [ {nome: "Desenvolvimento Arnold", reps:"5x 8-10"}, {nome: "Elevação Lateral", reps:"5x 10-12"}, {nome: "Abdominal Infra (Suspenso)", reps:"5x máx"}, {nome: "Prancha lateral", reps:"5x 60s/lado"} ]}
                ],
                dicas: "Descanse 30-45s. Utilize técnicas avançadas como drop-sets e rest-pause para levar os músculos à falha total."
            }
        },
        "ganhar massa": {
            "iniciante": {
                titulo: "Treino para Hipertrofia - Iniciante",
                dias: [
                    { dia: "Segunda: Peito, Ombros & Tríceps", exercicios: [ {nome: "Supino Reto", reps:"3x 8-12"}, {nome: "Desenvolvimento c/ Halteres", reps:"3x 8-12"}, {nome: "Elevação Lateral", reps:"3x 10-15"}, {nome: "Tríceps Polia", reps:"3x 10-12"} ]},
                    { dia: "Quarta: Costas & Bíceps", exercicios: [ {nome: "Puxada Frontal", reps:"3x 8-12"}, {nome: "Remada Sentada", reps:"3x 8-12"}, {nome: "Rosca Direta", reps:"3x 10-12"}, {nome: "Rosca Martelo", reps:"3x 10-12"} ]},
                    { dia: "Sexta: Pernas", exercicios: [ {nome: "Agachamento na Barra Guiada", reps:"3x 8-12"}, {nome: "Leg Press 45º", reps:"3x 10-15"}, {nome: "Cadeira Extensora", reps:"3x 10-15"}, {nome: "Mesa Flexora", reps:"3x 10-15"} ]}
                ],
                dicas: "Descanse 90s entre séries. Foque na progressão de carga: tente aumentar o peso ou as repetições a cada semana."
            },
            "intermediário": {
                titulo: "Treino para Hipertrofia - Intermediário",
                dias: [
                    { dia: "Segunda: Peito & Tríceps", exercicios: [ {nome: "Supino Reto", reps:"4x 6-10"}, {nome: "Supino Inclinado c/ Halteres", reps:"4x 8-12"}, {nome: "Crucifixo", reps:"3x 10-12"}, {nome: "Tríceps Testa", reps:"4x 8-12"} ]},
                    { dia: "Terça: Costas & Bíceps", exercicios: [ {nome: "Barra Fixa (ou Graviton)", reps:"4x máx"}, {nome: "Remada Curvada", reps:"4x 6-10"}, {nome: "Rosca Direta", reps:"4x 8-12"}, {nome: "Rosca Scott", reps:"3x 10-12"} ]},
                    { dia: "Quinta: Pernas", exercicios: [ {nome: "Agachamento Livre", reps:"4x 6-10"}, {nome: "Leg Press 45º", reps:"4x 8-12"}, {nome: "Afundo", reps:"3x 10/perna"}, {nome: "Stiff", reps:"4x 8-12"} ]},
                    { dia: "Sexta: Ombros", exercicios: [ {nome: "Desenvolvimento Militar", reps:"4x 6-10"}, {nome: "Elevação Lateral", reps:"4x 10-15"}, {nome: "Elevação Posterior", reps:"3x 12-15"}, {nome: "Encolhimento", reps:"4x 10-12"} ]}
                ],
                dicas: "Descanse 60-90s. Controle a fase excêntrica (a descida do peso), fazendo-a durar de 2 a 3 segundos."
            },
            "avançado": {
                titulo: "Treino para Hipertrofia - Avançado",
                dias: [
                    { dia: "Segunda: Peito", exercicios: [ {nome: "Supino Reto", reps:"5x 5"}, {nome: "Supino Inclinado c/ Halteres", reps:"4x 6-10"}, {nome: "Crucifixo Declinado", reps:"4x 10-12"}, {nome: "Flexão na Paralela c/ Peso", reps:"4x máx"} ]},
                    { dia: "Terça: Costas", exercicios: [ {nome: "Levantamento Terra", reps:"5x 5"}, {nome: "Remada Curvada", reps:"4x 6-10"}, {nome: "Puxada Alta Unilateral", reps:"4x 10-12"} ]},
                    { dia: "Quarta: Pernas", exercicios: [ {nome: "Agachamento Livre", reps:"5x 5"}, {nome: "Leg Press", reps:"4x 8-12"}, {nome: "Passada", reps:"4x 10/perna"}, {nome: "Mesa Flexora", reps:"4x 6-10"} ]},
                    { dia: "Sexta: Ombros & Braços", exercicios: [ {nome: "Desenvolvimento Militar", reps:"5x 5"}, {nome: "Elevação Lateral (Drop-set)", reps:"4x 10+10"}, {nome: "Rosca Direta", reps:"4x 6-10"}, {nome: "Tríceps Corda", reps:"4x 8-12"} ]}
                ],
                dicas: "Descanse 2-3 minutos nos exercícios compostos (5x5) e 60s nos demais. O volume e a intensidade são a chave."
            }
        },
        "manter": {
             "iniciante": {
                titulo: "Treino de Manutenção - 3x/semana",
                dias: [
                    { dia: "Dia 1: Full Body A", exercicios: [ {nome: "Agachamento", reps:"3x 10-15"}, {nome: "Supino Reto", reps:"3x 10-15"}, {nome: "Remada Curvada", reps:"3x 10-15"}, {nome: "Desenvolvimento", reps:"3x 10-15"} ]},
                    { dia: "Dia 2: Full Body B", exercicios: [ {nome: "Leg Press", reps:"3x 10-15"}, {nome: "Puxada Frontal", reps:"3x 10-15"}, {nome: "Flexão de Braço", reps:"3x máx"}, {nome: "Elevação Lateral", reps:"3x 12-15"} ]},
                    { dia: "Dia 3: Full Body C", exercicios: [ {nome: "Levantamento Terra", reps:"3x 10-15"}, {nome: "Supino Inclinado", reps:"3x 10-15"}, {nome: "Rosca Direta", reps:"3x 12-15"}, {nome: "Tríceps Corda", reps:"3x 12-15"} ]}
                ],
                dicas: "Foque na consistência e em manter a carga atual. A frequência de 3x por semana é ótima para manutenção."
            }
        },
        "secar e ganhar massa": {
            "intermediário": {
                titulo: "Treino de Recomposição Corporal - Intermediário",
                dias: [
                    { dia: "Segunda: Força (Inferiores)", exercicios: [ {nome: "Agachamento Livre", reps:"5x 5"}, {nome: "Stiff", reps:"4x 6-8"}, {nome: "Panturrilha", reps:"4x 8-10"} ]},
                    { dia: "Terça: Força (Superiores)", exercicios: [ {nome: "Supino Reto", reps:"5x 5"}, {nome: "Remada Curvada", reps:"5x 5"}, {nome: "Desenvolvimento Militar", reps:"4x 6-8"} ]},
                    { dia: "Quinta: Hipertrofia (Inferiores)", exercicios: [ {nome: "Leg Press", reps:"4x 10-15"}, {nome: "Mesa Flexora", reps:"4x 12-15"}, {nome: "Afundo", reps:"3x 10/perna"} ]},
                    { dia: "Sexta: Hipertrofia (Superiores)", exercicios: [ {nome: "Supino Inclinado c/ Halteres", reps:"4x 10-12"}, {nome: "Puxada Alta", reps:"4x 10-12"}, {nome: "Elevação Lateral", reps:"4x 12-15"}, {nome: "Rosca + Tríceps (Supersérie)", reps:"3x 12-15"} ]}
                ],
                dicas: "Combine dias de força (cargas altas, poucas reps) com dias de hipertrofia (cargas moderadas, mais reps). O cardio pós-treino é essencial."
            }
        },
    };

    const dietas = {
        "emagrecer": {
            "restrita": {
                titulo: "Dieta Restrita para Emagrecer",
                refeicoes: [ {nome: "Café da Manhã", descricao: "Omelete de 3 claras + café sem açúcar"}, {nome: "Almoço", descricao: "150g de frango grelhado + salada de folhas à vontade"}, {nome: "Lanche", descricao: "1 pote de iogurte natural desnatado"}, {nome: "Jantar", descricao: "120g de tilápia assada + brócolis cozido"} ],
                resumo: "Foco em alta proteína e baixo carboidrato para maximizar a queima de gordura. Beba muita água."
            },
            "balanceada": {
                titulo: "Dieta Balanceada para Emagrecer",
                refeicoes: [ {nome: "Café da Manhã", descricao: "1 ovo mexido + 1 fatia pão integral + 1 fruta"}, {nome: "Almoço", descricao: "120g frango + 3 col. sopa arroz integral + salada"}, {nome: "Lanche", descricao: "1 maçã + 5 amêndoas"}, {nome: "Jantar", descricao: "Omelete de 2 ovos + salada"} ],
                resumo: "Déficit calórico moderado com todos os macronutrientes, promovendo uma perda de peso sustentável."
            },
            "flexivel": {
                titulo: "Dieta Flexível para Emagrecer",
                refeicoes: [ {nome: "Café da Manhã", descricao: "Pão na chapa com queijo branco + café com leite"}, {nome: "Almoço", descricao: "Prato feito tradicional (arroz, feijão, carne, salada)"}, {nome: "Lanche", descricao: "1 barra de proteína"}, {nome: "Jantar", descricao: "Wrap de frango com salada"} ],
                resumo: "Foca em atingir uma meta de calorias e proteínas, permitindo maior variedade de alimentos."
            }
        },
        "ganhar massa": {
            "restrita": {
                titulo: "Dieta Restrita para Ganhar Massa",
                refeicoes: [ {nome: "Café da Manhã", descricao: "Panqueca de 4 claras + 50g aveia + banana"}, {nome: "Lanche", descricao: "Shake de Whey Protein + creatina"}, {nome: "Almoço", descricao: "200g de patinho moído + 150g de batata doce + salada"}, {nome: "Jantar", descricao: "200g de frango + 150g de arroz integral + brócolis"}, {nome: "Ceia", descricao: "4 ovos cozidos"} ],
                resumo: "Superávit calórico limpo, com alta ingestão de proteínas e carboidratos de baixo índice glicêmico."
            },
            "balanceada": {
                titulo: "Dieta Balanceada para Ganhar Massa",
                refeicoes: [ {nome: "Café da Manhã", descricao: "2 ovos + 2 fatias pão integral + suco de laranja"}, {nome: "Almoço", descricao: "150g de carne + arroz + feijão + legumes"}, {nome: "Lanche", descricao: "Vitamina de banana com aveia e leite"}, {nome: "Jantar", descricao: "150g de frango + purê de batata + salada"} ],
                resumo: "Aumento calórico com comida de verdade, garantindo energia para os treinos e nutrientes para a recuperação."
            },
            "flexivel": {
                titulo: "Dieta Flexível para Ganhar Massa",
                refeicoes: [ {nome: "Café da Manhã", descricao: "Pão com ovos e bacon + achocolatado"}, {nome: "Almoço", descricao: "Macarronada à bolonhesa"}, {nome: "Lanche", descricao: "Sanduíche de pasta de amendoim"}, {nome: "Jantar", descricao: "Hambúrguer caseiro com batata frita (air fryer)"} ],
                resumo: "Foco em bater as metas de superávit calórico e proteínas com maior liberdade de escolha alimentar."
            }
        },
        "manter": {
            "balanceada": {
                titulo: "Dieta Balanceada para Manutenção",
                refeicoes: [ {nome: "Café da Manhã", descricao: "1 ovo mexido + 1 fatia pão integral + 1 fruta"}, {nome: "Almoço", descricao: "120g de carne + arroz + feijão + salada"}, {nome: "Lanche", descricao: "1 iogurte"}, {nome: "Jantar", descricao: "Sopa de legumes ou sanduíche natural"} ],
                resumo: "Calorias de manutenção com equilíbrio entre os macronutrientes para manter o peso e a performance."
            }
        },
        "secar e ganhar massa": {
            "balanceada": {
                titulo: "Dieta para Recomposição Corporal",
                refeicoes: [ {nome: "Café da Manhã", descricao: "Ovos mexidos com queijo cottage + 1 fatia pão integral"}, {nome: "Almoço", descricao: "150g de salmão + quinoa + salada verde"}, {nome: "Lanche", descricao: "Shake de Whey Protein"}, {nome: "Jantar", descricao: "150g de frango em cubos + legumes salteados"} ],
                resumo: "Leve déficit calórico com alta ingestão de proteínas para estimular a queima de gordura enquanto se preserva (ou constrói) massa muscular."
            }
        }
    };

    const planoBase = treinos[objetivo]?.[nivel] || treinos["manter"]["iniciante"];
    const dietaSelecionada = dietas[objetivo]?.[tipo_dieta] || dietas[objetivo]?.["balanceada"] || dietas["manter"]["balanceada"];
    
    const divisoes = {
        3: { titulo: "🏋️ TREINO 3x POR SEMANA (ABC)", schema: "Seg: A | Qua: B | Sex: C" },
        4: { titulo: "🏋️ TREINO 4x POR SEMANA (ABCD)", schema: "Seg: A | Ter: B | Qui: C | Sex: D" },
        5: { titulo: "🏋️ TREINO 5x POR SEMANA (ABCDE)", schema: "Seg: A | Ter: B | Qua: C | Qui: D | Sex: E" },
        6: { titulo: "🏋️ TREINO 6x POR SEMANA (Push/Pull/Legs)", schema: "Seg: PPL | Ter: PPL | Qua: Descanso | Repete" },
        7: { titulo: "🏋️ TREINO 7x POR SEMANA (Avançado)", schema: "Foco em um grupo muscular por dia + Cardio" }
    };
    
    return {
        treino: { divisao: divisoes[frequencia], planoBase: planoBase },
        dieta: dietaSelecionada
    };
}