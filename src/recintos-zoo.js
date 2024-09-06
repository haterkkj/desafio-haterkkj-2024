const recintos = [
    {numero: 1, bioma: ['savana'], tamanhoTot: 10, animaisExistentes: [{especie: 'MACACO', quantidade: 3}]},
    {numero: 2, bioma: ['floresta'], tamanhoTot: 5, animaisExistentes: []},
    {numero: 3, bioma: ['savana', 'rio'], tamanhoTot: 7, animaisExistentes: [{especie: 'GAZELA', quantidade: 1}]},
    {numero: 4, bioma: ['rio'], tamanhoTot: 8, animaisExistentes: []},
    {numero: 5, bioma: ['savana'], tamanhoTot: 9, animaisExistentes: [{especie: 'LEAO', quantidade: 1}]}
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
        if(quantidade <= 0){
            return {erro: 'Quantidade inválida', recintosViaveis: false};
        }
        
        let animalEncontrado = animais.find(a => a.especie === animal);
        let pesoDosAnimais;
        if(animalEncontrado){
            pesoDosAnimais = animalEncontrado.tamanho * quantidade; 
            console.log(pesoDosAnimais);
        } else {
            return {erro: 'Animal inválido', recintosViaveis: false};
        }

        array.forEach(element => {
            
        });
    }
}

const resultado = new RecintosZoo().analisaRecintos('CROCODILO', 5);
console.log(resultado);

export { RecintosZoo as RecintosZoo };
