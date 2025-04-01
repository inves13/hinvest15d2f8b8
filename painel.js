// Declaração das variáveis para armazenar saques e usuários
let saques = [];
let usuarios = [];

// Função para cadastrar um novo saque
function cadastrarSaque() {
    let telefoneSaque = prompt("Digite o número de telefone do saque:");
    let nomeTitular = prompt("Digite o nome do titular:");
    let chavePIX = prompt("Digite a chave PIX do titular:");
    let valorSaque = parseFloat(prompt("Digite o valor do saque:"));

    // Adicionar o novo saque ao array de saques
    saques.push({
        telefone: telefoneSaque,
        nome: nomeTitular,
        chavePIX: chavePIX,
        valor: valorSaque,
        aprovado: false
    });

    // Atualizar a tabela de saques
    carregarSaques();
}

// Atualiza a tabela de saques na interface
function carregarSaques() {
    let saquesTabela = document.getElementById("saques");
    saquesTabela.innerHTML = ""; // Limpa os saques anteriores

    saques.forEach(saque => {
        let tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${saque.telefone}</td>
            <td>${saque.nome}</td>
            <td>${saque.chavePIX}</td>
            <td>R$ ${saque.valor.toFixed(2)}</td>
            <td>
                <button class="botao" onclick="aprovarSaque('${saque.telefone}')">Aprovar</button>
                <button class="botao" onclick="negarSaque('${saque.telefone}')">Negar</button>
            </td>
        `;
        saquesTabela.appendChild(tr);
    });
}

// Função para aprovar saque
function aprovarSaque(telefone) {
    let saque = saques.find(s => s.telefone === telefone);
    if (saque) {
        saque.aprovado = true;
        alert(`Saque aprovado para o telefone: ${telefone}`);
        carregarSaques(); // Atualiza a tabela de saques
    }
}

// Função para negar saque
function negarSaque(telefone) {
    let saque = saques.find(s => s.telefone === telefone);
    if (saque) {
        saque.aprovado = false;
        alert(`Saque negado para o telefone: ${telefone}`);
        carregarSaques(); // Atualiza a tabela de saques
    }
}

// Função para cadastrar um novo usuário
function cadastrarUsuario() {
    let telefoneCadastro = document.getElementById("telefoneCadastro").value;
    if (!telefoneCadastro) {
        alert("Digite um número de telefone válido");
        return;
    }

    // Gerar um novo ID e adicionar o novo usuário ao array
    let novoId = (usuarios.length + 1) * 10000; // Exemplo de geração de ID
    usuarios.push({
        telefone: telefoneCadastro,
        idUsuario: novoId.toString(),
        saldo: 0,
        recarga: 0
    });

    // Limpar o campo de telefone e atualizar o painel
    document.getElementById("telefoneCadastro").value = "";
    alert(`Usuário cadastrado com sucesso! Telefone: ${telefoneCadastro}`);
    
    // Atualizar as tabelas de recargas e saques
    carregarRecargas();
    carregarSaques();
}

// Função para carregar a tabela de recargas
function carregarRecargas() {
    let recargasTabela = document.getElementById("recargas");
    recargasTabela.innerHTML = ""; // Limpa as recargas anteriores

    usuarios.forEach(usuario => {
        let tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${usuario.telefone}</td>
            <td>R$ ${usuario.saldo.toFixed(2)}</td>
            <td>R$ ${usuario.recarga.toFixed(2)}</td>
        `;
        recargasTabela.appendChild(tr);
    });
}