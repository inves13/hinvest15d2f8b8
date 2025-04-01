import { obterDadosUsuario, salvarCodigoConvite } from './firebase.js';
import { getDatabase, ref, get, set } from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-database.js';
import { getAuth, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js';

document.addEventListener("DOMContentLoaded", function() {
  // Referências dos elementos da página
  let checkinBtn = document.getElementById("checkin-diario");
  let saldoConta = document.getElementById("saldo-conta");
  let saldoAcumulado = document.getElementById("renda-acumulada");
  let usuarioLogado = JSON.parse(localStorage.getItem("usuarioLogado"));
  
  // Função para carregar os dados do usuário a partir do Firebase
  function getUserData(userId, callback) {
    const db = getDatabase();
    const userRef = ref(db, "usuarios/" + userId);
    get(userRef).then(snapshot => {
      callback(snapshot.exists() ? snapshot.val() : null);
    }).catch(error => {
      console.error("Erro ao carregar dados do usuário:", error);
      callback(null);
    });
  }
  
  // Função para atualizar os dados do usuário no Firebase
  function updateUserData(userId, data) {
    const db = getDatabase();
    const userRef = ref(db, "usuarios/" + userId);
    set(userRef, data).catch(error => {
      console.error("Erro ao atualizar dados do usuário:", error);
    });
  }
  
  // Função para carregar o saldo
  function carregarSaldo() {
    if (usuarioLogado) {
      let userId = usuarioLogado.telefone;
      
      getUserData(userId, (data) => {
        if (data) {
          saldoConta.textContent = `R$ ${parseFloat(data.saldo || 0).toFixed(2)}`;
          saldoAcumulado.textContent = `R$ ${parseFloat(data.renda || 0).toFixed(2)}`;
        } else {
          saldoConta.textContent = "R$ 0.00";
          saldoAcumulado.textContent = "R$ 0.00";
        }
      });
    }
  }
  
  // Função para realizar o check-in diário
  if (checkinBtn) {
    checkinBtn.addEventListener("click", function() {
      if (!usuarioLogado) {
        alert("Você precisa estar logado para realizar o check-in!");
        return;
      }
      
      let userId = usuarioLogado.telefone;
      
      getUserData(userId, (data) => {
        let ultimoCheckin = data ? data.ultimoCheckin : null;
        let hoje = new Date().toLocaleDateString();
        
        if (ultimoCheckin === hoje) {
          alert("Você já coletou seu check-in diário hoje! Tente novamente amanhã.");
          return;
        }
        
        let saldoAtual = parseFloat(data.saldo || 0);
        let rendaAtual = parseFloat(data.renda || 0);
        let novoSaldo = saldoAtual + 1;
        let novaRenda = rendaAtual + 1;
        
        // Atualiza o saldo e a data do último check-in no Firebase
        updateUserData(userId, {
          saldo: novoSaldo,
          renda: novaRenda,
          ultimoCheckin: hoje
        });
        
        saldoConta.textContent = `R$ ${novoSaldo.toFixed(2)}`;
        saldoAcumulado.textContent = `R$ ${novaRenda.toFixed(2)}`;
        alert("Check-in diário coletado! R$ 1,00 adicionado ao saldo.");
      });
    });
  }
  
  // Função para garantir que os links do menu funcionem corretamente
  document.querySelectorAll(".botao-link").forEach(botao => {
    botao.addEventListener("click", function(event) {
      event.preventDefault(); // Impede o comportamento padrão do link
      let destino = this.getAttribute("data-url"); // Obtém a URL do botão
      window.location.href = destino; // Redireciona corretamente
    });
  });
  
  // Função para verificar se o usuário está logado
  function verificarLogin() {
    if (!usuarioLogado) {
      alert("Você precisa fazer login para acessar esta página!");
      window.location.href = "login.html";
    }
  }
  
  // Verifica o login ao acessar páginas protegidas
  if (window.location.pathname.includes("ganhos.html") || window.location.pathname.includes("ganhos2.html")) {
    verificarLogin();
  }
  
  // Função para simular login (substituir pela autenticação real)
  function realizarLogin(telefone, codigo) {
    let usuario = {
      telefone: telefone,
      codigo: codigo
    };
    localStorage.setItem("usuarioLogado", JSON.stringify(usuario));
    alert("Login realizado com sucesso!");
    carregarSaldo();
  }
  
  // Função para realizar logout
  function realizarLogout() {
    localStorage.removeItem("usuarioLogado");
    alert("Você saiu da sua conta!");
    window.location.href = "login.html";
  }
  
  // Função para obter dados do usuário
  function obterDadosUsuarioFirebase(telefoneUsuario) {
    obterDadosUsuario(telefoneUsuario, (dados) => {
      if (dados) {
        console.log(dados); // Aqui você pode fazer o que for necessário com os dados do usuário
      } else {
        console.log("Usuário não encontrado");
      }
    });
  }
  
  // Função para salvar código de convite
  function salvarCodigoConviteFirebase(telefone, codigo) {
    salvarCodigoConvite(telefone, codigo);
  }
  
  // Carrega o saldo ao abrir a página
  carregarSaldo();
  
  // Controle de telas (login, cadastro e recuperação)
  function mostrarCadastro() {
    document.getElementById("tela-login").style.display = 'none';
    document.getElementById("tela-cadastro").style.display = 'block';
    document.getElementById("tela-recuperacao").style.display = 'none';
  }
  
  function mostrarLogin() {
    document.getElementById("tela-login").style.display = 'block';
    document.getElementById("tela-cadastro").style.display = 'none';
    document.getElementById("tela-recuperacao").style.display = 'none';
  }
  
  function mostrarRecuperarSenha() {
    document.getElementById("tela-login").style.display = 'none';
    document.getElementById("tela-cadastro").style.display = 'none';
    document.getElementById("tela-recuperacao").style.display = 'block';
  }
  
  // Eventos para alternar entre telas
  let botaoCadastro = document.getElementById("nao-tem-conta");
  let botaoRecuperar = document.getElementById("esqueci-senha");
  let botaoVoltarLogin = document.getElementById("voltar-login");
  
  if (botaoCadastro) {
    botaoCadastro.addEventListener("click", mostrarCadastro);
  }
  if (botaoRecuperar) {
    botaoRecuperar.addEventListener("click", mostrarRecuperarSenha);
  }
  if (botaoVoltarLogin) {
    botaoVoltarLogin.addEventListener("click", mostrarLogin);
  }
});
