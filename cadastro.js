// Importando os módulos necessários do Firebase
import { getDatabase, ref, set } from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-database.js';
import { getAuth, createUserWithEmailAndPassword } from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js';

// Obtendo as instâncias do Firebase
const db = getDatabase();
const auth = getAuth();

// Adicionando o evento de cadastro
document.getElementById("botao-cadastro").addEventListener("click", function() {
  let nome = document.getElementById("nome").value;
  let telefone = document.getElementById("telefone").value;
  let senha = document.getElementById("senha").value;
  
  if (nome === "" || telefone === "" || senha === "") {
    alert("Preencha todos os campos!");
    return;
  }
  
  // Criando o usuário no Firebase Auth (usando o telefone como email temporário)
  createUserWithEmailAndPassword(auth, telefone + "@example.com", senha)
    .then((userCredential) => {
      // Usuário criado com sucesso
      const user = userCredential.user;
      
      // Agora salva os dados do usuário no Realtime Database
      set(ref(db, "usuarios/" + user.uid), {
        nome: nome,
        telefone: telefone,
        senha: senha,
        saldo: 0
      }).then(() => {
        alert("Cadastro realizado com sucesso!");
        window.location.href = "login.html"; // Redireciona para a página de login
      }).catch((error) => {
        console.error("Erro ao salvar dados no Firebase:", error);
      });
    })
    .catch((error) => {
      console.error("Erro ao cadastrar usuário:", error);
      alert("Erro ao criar conta. Tente novamente.");
    });
});