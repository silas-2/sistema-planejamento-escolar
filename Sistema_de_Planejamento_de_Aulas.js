// Classe para gerenciar notas
class GerenciadorNotas {
  constructor() {
    this.notas = this.carregarDoLocalStorage();
    this.aulas = this.carregarAulas();
  }

  // Carregar notas do localStorage
  carregarDoLocalStorage() {
    const dados = localStorage.getItem('notas-escolares');
    return dados ? JSON.parse(dados) : [];
  }

  // Salvar notas no localStorage
  salvarNoLocalStorage() {
    localStorage.setItem('notas-escolares', JSON.stringify(this.notas));
  }

  // Carregar aulas (dados de exemplo)
  carregarAulas() {
    return [
      { data: '2024-10-03', horario: '08:00', professor: 'Prof. João', disciplina: 'Matemática', turma: '7A', conteudo: 'Equações de 1º grau' },
      { data: '2024-10-03', horario: '09:00', professor: 'Prof. Maria', disciplina: 'Português', turma: '7A', conteudo: 'Interpretação de textos' },
      { data: '2024-10-03', horario: '10:00', professor: 'Prof. Carlos', disciplina: 'História', turma: '7A', conteudo: 'Revolução Francesa' },
    ];
  }

  // Adicionar nova nota
  adicionarNota(aluno, disciplina, t1, t2, p1, p2) {
    const mediaTarefas = (t1 + t2) / 2;
    const mediaProvas = (p1 + p2) / 2;
    const mediaFinal = (mediaTarefas + mediaProvas) / 2;
    
    const situacao = mediaFinal >= 7 ? 'Aprovado' : (mediaFinal >= 5 ? 'Recuperação' : 'Reprovado');

    const nota = {
      id: Date.now(),
      aluno,
      disciplina,
      t1,
      t2,
      mediaTarefas: mediaTarefas.toFixed(2),
      p1,
      p2,
      mediaProvas: mediaProvas.toFixed(2),
      mediaFinal: mediaFinal.toFixed(2),
      situacao,
      dataRegistro: new Date().toLocaleDateString('pt-BR')
    };

    this.notas.push(nota);
    this.salvarNoLocalStorage();
    return nota;
  }

  // Editar nota existente
  editarNota(id, aluno, disciplina, t1, t2, p1, p2) {
    const index = this.notas.findIndex(n => n.id == id);
    if (index !== -1) {
      const mediaTarefas = (t1 + t2) / 2;
      const mediaProvas = (p1 + p2) / 2;
      const mediaFinal = (mediaTarefas + mediaProvas) / 2;
      const situacao = mediaFinal >= 7 ? 'Aprovado' : (mediaFinal >= 5 ? 'Recuperação' : 'Reprovado');

      this.notas[index] = {
        id,
        aluno,
        disciplina,
        t1,
        t2,
        mediaTarefas: mediaTarefas.toFixed(2),
        p1,
        p2,
        mediaProvas: mediaProvas.toFixed(2),
        mediaFinal: mediaFinal.toFixed(2),
        situacao,
        dataRegistro: this.notas[index].dataRegistro
      };

      this.salvarNoLocalStorage();
      return this.notas[index];
    }
    return null;
  }

  // Deletar nota
  deletarNota(id) {
    this.notas = this.notas.filter(n => n.id != id);
    this.salvarNoLocalStorage();
  }

  // Filtrar notas
  filtrarNotas(aluno = '', disciplina = '') {
    return this.notas.filter(nota => 
      nota.aluno.toLowerCase().includes(aluno.toLowerCase()) &&
      nota.disciplina.toLowerCase().includes(disciplina.toLowerCase())
    );
  }

  // Obter estatísticas
  obterEstatisticas() {
    if (this.notas.length === 0) return { mediaGeral: 0, aprovados: 0, recup: 0, reprov: 0 };

    const mediaGeral = (this.notas.reduce((sum, n) => sum + parseFloat(n.mediaFinal), 0) / this.notas.length).toFixed(2);
    const aprovados = this.notas.filter(n => n.situacao === 'Aprovado').length;
    const recup = this.notas.filter(n => n.situacao === 'Recuperação').length;
    const reprov = this.notas.filter(n => n.situacao === 'Reprovado').length;

    return { mediaGeral, aprovados, recup, reprov };
  }
}

// Instância global
const gerenciador = new GerenciadorNotas();

// Inicializar na carga da página
document.addEventListener('DOMContentLoaded', () => {
  renderizarNotas();
  renderizarAulas();
  atualizarDashboard();
});

// Renderizar notas na tabela
function renderizarNotas() {
  const tbody = document.getElementById('tb-notas-body');
  const aluno = document.getElementById('filtro-aluno').value;
  const disciplina = document.getElementById('filtro-disciplina').value;

  const notas = gerenciador.filtrarNotas(aluno, disciplina);

  if (notas.length === 0) {
    tbody.innerHTML = '<tr><td colspan="11" class="empty-state">Nenhuma nota registrada</td></tr>';
    return;
  }

  tbody.innerHTML = notas.map(nota => `
    <tr>
      <td><strong>${nota.aluno}</strong></td>
      <td>${nota.disciplina}</td>
      <td>${nota.t1}</td>
      <td>${nota.t2}</td>
      <td><strong>${nota.mediaTarefas}</strong></td>
      <td>${nota.p1}</td>
      <td>${nota.p2}</td>
      <td><strong>${nota.mediaProvas}</strong></td>
      <td><strong style="color: ${nota.mediaFinal >= 7 ? '#10b981' : nota.mediaFinal >= 5 ? '#b06000' : '#ef4444'}">${nota.mediaFinal}</strong></td>
      <td>
        <span class="badge-${nota.situacao === 'Aprovado' ? 'aprovado' : nota.situacao === 'Recuperação' ? 'recup' : 'reprov'}">
          ${nota.situacao}
        </span>
      </td>
      <td>
        <button class="btn-edit" onclick="editarNota(${nota.id})">Editar</button>
        <button class="btn-danger" onclick="deletarNota(${nota.id})">Deletar</button>
      </td>
    </tr>
  `).join('');
}

// Salvar nova nota
function salvarNovaNota(event) {
  event.preventDefault();

  const id = document.getElementById('nota-editando-id').value;
  const aluno = document.getElementById('aluno-nome').value;
  const disciplina = document.getElementById('aluno-disc').value;
  const t1 = parseFloat(document.getElementById('aluno-t1').value);
  const t2 = parseFloat(document.getElementById('aluno-t2').value);
  const p1 = parseFloat(document.getElementById('aluno-p1').value);
  const p2 = parseFloat(document.getElementById('aluno-p2').value);

  if (id) {
    gerenciador.editarNota(id, aluno, disciplina, t1, t2, p1, p2);
  } else {
    gerenciador.adicionarNota(aluno, disciplina, t1, t2, p1, p2);
  }

  // Limpar formulário
  document.getElementById('form-nota').reset();
  document.getElementById('nota-editando-id').value = '';
  document.getElementById('submit-nota-btn').textContent = 'Lançar e Calcular Médias';

  renderizarNotas();
  atualizarDashboard();
}

// Editar nota
function editarNota(id) {
  const nota = gerenciador.notas.find(n => n.id == id);
  if (!nota) return;

  document.getElementById('nota-editando-id').value = id;
  document.getElementById('aluno-nome').value = nota.aluno;
  document.getElementById('aluno-disc').value = nota.disciplina;
  document.getElementById('aluno-t1').value = nota.t1;
  document.getElementById('aluno-t2').value = nota.t2;
  document.getElementById('aluno-p1').value = nota.p1;
  document.getElementById('aluno-p2').value = nota.p2;
  document.getElementById('submit-nota-btn').textContent = 'Atualizar Nota';

  // Scroll suave para o formulário
  document.querySelector('.card').scrollIntoView({ behavior: 'smooth' });
}

// Deletar nota
function deletarNota(id) {
  if (confirm('Tem certeza que deseja deletar esta nota?')) {
    gerenciador.deletarNota(id);
    renderizarNotas();
    atualizarDashboard();
  }
}

// Renderizar aulas
function renderizarAulas() {
  const tbody = document.getElementById('tb-aulas-body');
  
  if (gerenciador.aulas.length === 0) {
    tbody.innerHTML = '<tr><td colspan="6" class="empty-state">Nenhuma aula agendada</td></tr>';
    return;
  }

  tbody.innerHTML = gerenciador.aulas.map(aula => `
    <tr>
      <td>${new Date(aula.data).toLocaleDateString('pt-BR')}</td>
      <td>${aula.horario}</td>
      <td>${aula.professor}</td>
      <td>${aula.disciplina}</td>
      <td>${aula.turma}</td>
      <td>${aula.conteudo}</td>
    </tr>
  `).join('');
}

// Atualizar dashboard
function atualizarDashboard() {
  const stats = gerenciador.obterEstatisticas();
  
  document.getElementById('kpi-media-geral').textContent = stats.mediaGeral;
  document.getElementById('kpi-aprovados').textContent = stats.aprovados;
  document.getElementById('kpi-recup').textContent = stats.recup;
  document.getElementById('kpi-reprov').textContent = stats.reprov;
}

// Alternar abas
function switchTab(tabName, event) {
  event.preventDefault();

  // Remover classe active de todos os botões e conteúdos
  document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
  document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));

  // Adicionar classe active ao clicado
  event.target.classList.add('active');
  document.getElementById(tabName).classList.add('active');
}

// Filtros de notas
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('filtro-aluno')?.addEventListener('input', renderizarNotas);
  document.getElementById('filtro-disciplina')?.addEventListener('input', renderizarNotas);
  document.getElementById('btn-limpar-filtros')?.addEventListener('click', () => {
    document.getElementById('filtro-aluno').value = '';
    document.getElementById('filtro-disciplina').value = '';
    renderizarNotas();
  });
});
