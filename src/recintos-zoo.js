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
        if(!Number.isInteger(quantidade) || quantidade <= 0){
            return {erro: 'Quantidade inválida', recintosViaveis: false};
        }
        
        let animalEncontrado = animais.find(a => a.especie === animal);
        if(!animalEncontrado){
            return {erro: 'Animal inválido', recintosViaveis: false};
        }

        let tamanhoDosAnimais = animalEncontrado.tamanho * quantidade;
        let possiveisRecintos = [];
        possiveisRecintos = recintos.filter(recinto =>
            recinto.bioma.some(biomaRecinto =>
                animalEncontrado.bioma.includes(biomaRecinto)
            )
        );


        // verificando se o recinto possui animais carnivoros, se possuir e for de uma espécie diferente, o recinto não é mais considerado como possivel.
        possiveisRecintos.forEach((recinto, i) => {
            if(recinto.animaisExistentes != null){
                let retirou = false;
                recinto.animaisExistentes.forEach(a => {
                    let animalNoRecinto = animais.find(animal => animal.especie === a.especie);
                    if((animalEncontrado.alimentacao === 'CARNIVORO' || animalNoRecinto.alimentacao === 'CARNIVORO') && animalNoRecinto.especie != animalEncontrado.especie){
                        if(!retirou){
                            possiveisRecintos.splice(i, 1);
                            retirou = true;
                        }
                    }
                })
            }
        });

        /*
        let tamanhoDisponivelNosRecintos = [];
        tamanhoDisponivelNosRecintos = possiveisRecintos.map(recinto => {
            let tamanhoOcupado = recinto.animaisExistentes.reduce((total, animal) => {
                return (animal.quantidade * animalEncontrado.tamanho);
            }, 0);

            let tamanhoDisponivel = recinto.tamanhoTotal - tamanhoOcupado;
            return tamanhoDisponivel;
        })*/
        console.log(possiveisRecintos);
    }
}

const resultado = new RecintosZoo().analisaRecintos('MACACO', 1);
console.log(resultado);

export { RecintosZoo as RecintosZoo };
