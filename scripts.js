function verificarRespostas() {
    const respostasCorretas = {
        pergunta1: 'A',
        pergunta2: 'C',
        pergunta3: 'A',
        pergunta4: 'B',
        pergunta5: 'C',
        pergunta6: 'A',
        pergunta7: 'C',
        pergunta8: 'B',
        pergunta9: 'B',
        pergunta10: 'A'
    };

    let pontuacao = 0;

    for (let i = 1; i <= 10; i++) { 
        const selectElement = document.getElementById(`pergunta${i}`);
        const respostaSelecionada = selectElement.value;
        const respostaCorreta = respostasCorretas[`pergunta${i}`];

        if (respostaSelecionada === respostaCorreta) {
            pontuacao++;
        }
    }

    alert(`Você acertou ${pontuacao} de 10 perguntas.`);
}
