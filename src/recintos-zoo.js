// criando base de dados dos recintos do zoologico
const recintos = [
    {numero: 1, bioma: ['savana'], tamanhoTotal: 10, animaisExistentes: [{especie: 'MACACO', quantidade: 3}]},
    {numero: 2, bioma: ['floresta'], tamanhoTotal: 5, animaisExistentes: []},
    {numero: 3, bioma: ['savana', 'rio'], tamanhoTotal: 7, animaisExistentes: [{especie: 'GAZELA', quantidade: 1}]},
    {numero: 4, bioma: ['rio'], tamanhoTotal: 8, animaisExistentes: []},
    {numero: 5, bioma: ['savana'], tamanhoTotal: 9, animaisExistentes: [{especie: 'LEAO', quantidade: 1}]}
];

// criando base de dados dos animais tratados pelo zoologico, adicionado a coluna alimentacao.
const animais = [
    {especie: 'LEAO', tamanho: 3, bioma: ['savana'], alimentacao: 'CARNIVORO'},
    {especie: 'LEOPARDO', tamanho: 2, bioma: ['savana'], alimentacao: 'CARNIVORO'},
    {especie: 'CROCODILO', tamanho: 3, bioma: ['rio'], alimentacao: 'CARNIVORO'},
    {especie: 'MACACO', tamanho: 1, bioma: ['savana', 'floresta'], alimentacao: 'ONIVORO'},
    {especie: 'GAZELA', tamanho: 2, bioma: ['savana'], alimentacao: 'HERBIVORO'},
    {especie: 'HIPOPOTAMO', tamanho: 4, bioma: ['savana', 'rio'], alimentacao: 'HERBIVORO'}
];

class RecintosZoo {
    analisaRecintos(animal, quantidade) {
        let possiveisRecintos = [];
        
        // tratando quantidade invalida
        if(!Number.isInteger(quantidade) || quantidade <= 0){
            return {
                erro: 'Quantidade inválida', recintosViaveis: false
            };
        }
        
        // tratando animal invalido
        const animalEncontrado = animais.find(a => a.especie === animal);
        if(!animalEncontrado){
            return {
                erro: 'Animal inválido', recintosViaveis: false
            };
        }

        // calculando tamanho total do lote de animais que estamos procurando um recinto
        let tamanhoDosAnimais = animalEncontrado.tamanho * quantidade;

        // filtrando possiveis recintos baseado nos biomas em que o lote de novos animais se sente confortavel 
        possiveisRecintos = this.checaCasosEspecificos(possiveisRecintos, animalEncontrado, quantidade);
        
        // verificando se o recinto possui animais carnivoros, se possuir e for de uma espécie diferente, o recinto não é mais considerado como possivel.
        possiveisRecintos = this.verificaSeTemAnimaisCarnivoros(possiveisRecintos, animalEncontrado);
        
        // calculando tamanho disponivel em cada recinto identificado como possivel até o momento
        let tamanhoDisponivelNosRecintos = this.calculaTamanhoDisponivelDosPossiveisRecintos(possiveisRecintos, animalEncontrado);

        // analisando se espaco disponivel nos recintos é compativel com o tamanho a ser utilizado pelos animais, filtrando os possiveis recintos
        possiveisRecintos = this.verificaSeTamanhoDosRecintosEhCompativel(possiveisRecintos, tamanhoDisponivelNosRecintos, tamanhoDosAnimais);

        // caso não houver recintos viaveis para tal animal, retornamos o erro.
        if(possiveisRecintos.length === 0){
            return {
                erro: "Não há recinto viável", recintosViaveis: false
            }
        }

        // gera a resposta na forma esperada pelo usuario
        let resposta = this.formulaResposta(possiveisRecintos, tamanhoDisponivelNosRecintos, tamanhoDosAnimais);
        return resposta;
    }

    checaCasosEspecificos(possiveisRecintos, animalEncontrado, quantidade){
        // criando lista com os animais que possuem excessoes
        let animaisComExcessoes = ['HIPOPOTAMO', 'MACACO'];

        // caso o animal nao seja um dos listados como 'com excessoes', somente procuramos os biomas ao qual ele se adapta e retornamos
        if(!animaisComExcessoes.includes(animalEncontrado.especie)){
            possiveisRecintos = recintos.filter(recinto =>
                recinto.bioma.some(biomaRecinto =>
                    animalEncontrado.bioma.includes(biomaRecinto)
                )
            );    
        }

        // caso o animal seja um hipopotamo, antes de retornar os possiveis recintos para ele, analisaremos as exigencias do mesmo
        if(animalEncontrado.especie === 'HIPOPOTAMO'){
            let biomasNecessarios = ['savana', 'rio'];
            possiveisRecintos = recintos.filter(recinto => {
                if(recinto.animaisExistentes.length === 0){
                    return recinto.bioma.some(biomaRecinto =>
                        animalEncontrado.bioma.includes(biomaRecinto)
                    );
                } else {
                    return biomasNecessarios.every(biomaNecessario => 
                        recinto.bioma.includes(biomaNecessario)
                    );
                }
            });
        }

        // caso o animal seja um macaco, antes de retornar os possiveis recintos para ele, analisaremos as exigencias do mesmo 
        if(animalEncontrado.especie === 'MACACO' && quantidade < 2){
            possiveisRecintos = recintos.filter(recinto => {
                if(recinto.animaisExistentes != 0){
                    return recinto.bioma.some(biomaRecinto =>
                        animalEncontrado.bioma.includes(biomaRecinto)
                    );
                }
            });
        } else if (animalEncontrado.especie === 'MACACO' && quantidade >= 2) {
            possiveisRecintos = recintos.filter(recinto =>
                recinto.bioma.some(biomaRecinto =>
                    animalEncontrado.bioma.includes(biomaRecinto)
                )
            );   
        }

        // verificandos se nos recintos que encontramos como possiveis, existem hipopotamos, caso sim, iremos checar se o bioma no qual foi encontrado
        // cumpre os pre-requisitos para que hipopotamos possam conviver tranquilamente com outras especies. Caso não cumprir, o recinto não é mais
        // considerado um recinto possivel 
        let recintosFiltrados = possiveisRecintos.filter(recinto => {
            if(recinto.animaisExistentes.length === 0 || !recinto.animaisExistentes){
                return true;
            }
            return recinto.animaisExistentes.some(animalExistenteNoRecinto => {
                if(animalExistenteNoRecinto.especie === 'HIPOPOTAMO' && animalEncontrado.especie !== 'HIPOPOTAMO'){
                    let biomasNecessarios = ['savana', 'rio']; // biomas nos quais o hipopotamo aceita conviver com outras especies 
                    return biomasNecessarios.every(biomaNecessario => 
                        recinto.bioma.includes(biomaNecessario)
                    );
                }
                return true;
            });
        });
        possiveisRecintos = [...recintosFiltrados];

        return possiveisRecintos;
    }

    calculaTamanhoDisponivelDosPossiveisRecintos(possiveisRecintos, animalEncontrado){
        // verificando tamanho disponivel em cada um dos recintos que sao uma opcao até o momento
        let tamanhoDisponivelNosRecintos = possiveisRecintos.map(recinto => {
            let tamanhoOcupado = recinto.animaisExistentes.reduce((x, animalNoRecinto) => {
                let animalNaTabela = animais.find(a => a.especie === animalNoRecinto.especie);
                if(!animalNaTabela){
                    return 0;
                }
                // verificando se os animais são de especies diferentes, caso for, estaremos considerando 1 espaço extra ocupado
                if(animalNaTabela.especie !== animalEncontrado.especie){
                    return x + (animalNaTabela.tamanho * animalNoRecinto.quantidade) + 1;
                } else {
                    return x + (animalNaTabela.tamanho * animalNoRecinto.quantidade);
                }
            }, 0);
            return {numeroRecinto: recinto.numero, tamanhoDisponivel: recinto.tamanhoTotal - tamanhoOcupado};
        });

        return tamanhoDisponivelNosRecintos;
    }

    verificaSeTamanhoDosRecintosEhCompativel(possiveisRecintos, tamanhoDisponivelNosRecintos, tamanhoDosAnimais){
        // verificando se tamanho disponivel em cada recinto é menor ou maior que tamanho dos animais que serao inseridos
        let recintosFiltrados = possiveisRecintos.filter((recinto, i) => {
            if(tamanhoDosAnimais > tamanhoDisponivelNosRecintos[i].tamanhoDisponivel){
                return false;
            } else {
                return true;
            }
        });

        return recintosFiltrados;
    }

    verificaSeTemAnimaisCarnivoros(possiveisRecintos, animalEncontrado){
        // verificando se tem animais carnivoros já presentes no recinto ou sendo inseridos
        let recintosFiltrados = possiveisRecintos.filter(recinto => {
            // caso nao houver nenhum animal no recinto, ele é considerado uma opcao
            if(recinto.animaisExistentes.length === 0){
                return true;
            }
            // caso houver algum animal carnivoro no recinto ou sendo inserido que seja carnivoro, caso forem de espécies diferentes, o recinto não é mais considerado uma possibilidade
            let algumAnimalCarnivoro = recinto.animaisExistentes.some(animalExistenteNoRecinto => {
                let animalNoRecinto = animais.find(animal => animal.especie === animalExistenteNoRecinto.especie);
                return (animalNoRecinto.alimentacao === 'CARNIVORO' || animalEncontrado.alimentacao === 'CARNIVORO') && (animalNoRecinto.especie !== animalEncontrado.especie);
            });
            return !algumAnimalCarnivoro;
        });

        return recintosFiltrados;
    }

    formulaResposta(possiveisRecintos, tamanhoDisponivelNosRecintos, tamanhoDosAnimais){
        // gerando resposta no padrao esperado pelo usuario do sistema
        let resposta = {recintosViaveis: []};
        let tamanhoDisponivelNosRecintosViaveis = tamanhoDisponivelNosRecintos.filter(tamanhoRecinto => {
            return possiveisRecintos.find(possivelRecinto => possivelRecinto.numero === tamanhoRecinto.numeroRecinto) !== undefined;
        });
        possiveisRecintos.forEach((recinto, i) => {
            resposta.recintosViaveis.push(`Recinto ${recinto.numero} (espaço livre: ${tamanhoDisponivelNosRecintosViaveis[i].tamanhoDisponivel - tamanhoDosAnimais} total: ${recinto.tamanhoTotal})`);
        });
        return resposta;
    }
}

const resultado = new RecintosZoo().analisaRecintos('HIPOPOTAMO', 2);
console.log(resultado)

export { RecintosZoo as RecintosZoo };
