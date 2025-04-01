// Configuração do Firebase
const firebaseConfig = {
  apiKey: "SUA_API_KEY", // Substitua pela sua chave de API
  authDomain: "SEU_AUTH_DOMAIN", // Substitua pelo domínio de autenticação do projeto
  databaseURL: "SEU_DATABASE_URL", // Substitua pela URL do banco de dados
  projectId: "SEU_PROJECT_ID", // Substitua pelo ID do projeto
  storageBucket: "SEU_STORAGE_BUCKET", // Substitua pelo bucket de armazenamento
  messagingSenderId: "SEU_MESSAGING_SENDER_ID", // Substitua pelo ID de mensagens
  appId: "SEU_APP_ID" // Substitua pelo ID do aplicativo
};

// Inicializa o Firebase
firebase.initializeApp(firebaseConfig);

// Exporta a referência do banco de dados
const database = firebase.database();

// Função para obter dados do usuário
function getUserData(userId, callback) {
  const userRef = database.ref('users/' + userId);
  userRef.on('value', (snapshot) => {
    const data = snapshot.val();
    callback(data);
  });
}

// Função para atualizar dados do usuário
function updateUserData(userId, data) {
  const userRef = database.ref('users/' + userId);
  userRef.update(data);
}

// Função para registrar uma nova recarga
function registrarRecarga(userId, valor) {
  const recargaRef = database.ref('recargas/' + userId);
  const novaRecarga = {
    valor: valor,
    data: new Date().toLocaleString()
  };
  recargaRef.push(novaRecarga);
  alert("Recarga de R$ " + valor.toFixed(2) + " registrada com sucesso!");
}

// Função para registrar uma retirada
function registrarRetirada(userId, valor, chave, tipoChave) {
  const retiradaRef = database.ref('retiradas/' + userId);
  const novaRetirada = {
    valor: valor,
    chave: chave,
    tipoChave: tipoChave,
    data: new Date().toLocaleString()
  };
  retiradaRef.push(novaRetirada);
  alert("Solicitação de retirada de R$ " + valor.toFixed(2) + " realizada com sucesso!");
}