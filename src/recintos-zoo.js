const recintos = [
    {numero: 1, bioma: ['savana'], tamanhoTotal: 10, animaisExistentes: [{especie: 'MACACO', quantidade: 3}]},
    {numero: 2, bioma: ['floresta'], tamanhoTotal: 5, animaisExistentes: []},
    {numero: 3, bioma: ['savana', 'rio'], tamanhoTotal: 7, animaisExistentes: [{especie: 'GAZELA', quantidade: 1}]},
    {numero: 4, bioma: ['rio'], tamanhoTotal: 8, animaisExistentes: []},
    {numero: 5, bioma: ['savana'], tamanhoTotal: 9, animaisExistentes: [{especie: 'LEAO', quantidade: 1}]}
];

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
        let recintosViaveis = [];
        
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
        let possiveisRecintos = recintos.filter(recinto =>
            recinto.bioma.some(biomaRecinto =>
                animalEncontrado.bioma.includes(biomaRecinto)
            )
        );

        // verificando se o recinto possui animais carnivoros, se possuir e for de uma espécie diferente, o recinto não é mais considerado como possivel.
        let recintosFiltrados = possiveisRecintos.filter(recinto => {
            if(recinto.animaisExistentes.length === 0){
                return true;
            }
            let algumAnimalCarnivoro = recinto.animaisExistentes.some(animalExistenteNoRecinto => {
                let animalNoRecinto = animais.find(animal => animal.especie === animalExistenteNoRecinto.especie);
                return (animalNoRecinto.alimentacao === 'CARNIVORO' || animalEncontrado.alimentacao === 'CARNIVORO') && (animalNoRecinto.especie !== animalEncontrado.especie);
            });
            return !algumAnimalCarnivoro;
        });
        possiveisRecintos = [...recintosFiltrados];
        
        // verificando tamanho disponivel em cada um dos recintos que sao uma opcao até o momento
        let tamanhoDisponivelNosRecintos = possiveisRecintos.map(recinto => {
            let tamanhoOcupado = recinto.animaisExistentes.reduce((x, animalNoRecinto) => {
                let animalNaTabela = animais.find(a => a.especie === animalNoRecinto.especie);
                if(!animalNaTabela){
                    return 0;
                }
                // verificando se os animais são de especies diferentes, caso for, estaremos considerando 1 espaço extra ocupado
                if(animalNaTabela.especie !== animalEncontrado.especie){
                    return (animalNaTabela.tamanho * animalNoRecinto.quantidade) + 1;
                } else {
                    return (animalNaTabela.tamanho * animalNoRecinto.quantidade);
                }
            }, 0);
            return {numeroRecinto: recinto.numero, tamanhoDisponivel: recinto.tamanhoTotal - tamanhoOcupado};
        });

        // verificando se tamanho disponivel em cada recinto é menor ou maior que tamanho dos animais que serao inseridos
        recintosFiltrados = possiveisRecintos.filter((recinto, i) => {
            if(tamanhoDosAnimais > tamanhoDisponivelNosRecintos[i].tamanhoDisponivel){
                return false;
            } else {
                return true;
            }
        });
        possiveisRecintos = [...recintosFiltrados];
        
        // caso nesta parte da filtragem já não houver recintos viaveis para tal animal, já retornamos o erro.
        if(possiveisRecintos.length === 0){
            return {
                erro: "Não há recinto viável", recintosViaveis: false
            }
        }

        console.log(possiveisRecintos);
    }
}

const resultado = new RecintosZoo().analisaRecintos('MACACO', 5);
console.log(resultado);

export { RecintosZoo as RecintosZoo };
