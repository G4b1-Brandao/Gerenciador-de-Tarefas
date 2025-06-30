const fs = require('fs'); // File System, para salvar e carregar dados

// Importação classes de modelo
const Board = require('./models/Board.js');
const Section = require('./models/Section.js');
const Task = require('./models/Task.js');
const Tag = require('./models/Tag.js'); 

// Declara a variável inquirer no escopo do módulo para que todas as funções a acessem.
let inquirer;

// Constante para o nome do arquivo de dados
const DATA_FILE = './board-data.json';

/**
 * Salva o estado atual do quadro em um arquivo JSON.
 * @param {Board} board O objeto do quadro a ser salvo.
 */
function saveData(board) {
  try {
    // JSON.stringify converte o objeto JavaScript para uma string no formato JSON.
    fs.writeFileSync(DATA_FILE, JSON.stringify(board, null, 2), 'utf8');
    console.log('\n✅ Quadro salvo com sucesso!');
  } catch (error) {
    console.error('\n❌ Erro ao salvar os dados:', error);
  }
}

/**
 * Carrega o estado do quadro a partir de um arquivo JSON.
 * Se o arquivo não existir, cria um quadro padrão.
 * @returns {Board} O objeto do quadro carregado ou um novo quadro.
 */
function loadData() {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const data = fs.readFileSync(DATA_FILE, 'utf8');
      const plainObject = JSON.parse(data);

     
      const board = new Board(plainObject.title);
      plainObject.sections.forEach(sectionData => {
        const section = new Section(sectionData.title);
        if (sectionData.tasks) {
          sectionData.tasks.forEach(taskData => {
            const task = new Task(taskData.title, taskData.description);
            // Reidratação das Tags para cada tarefa
            if (taskData.tags) {
              taskData.tags.forEach(tagData => {
                task.addTag(new Tag(tagData.title));
              });
            }
            section.addTask(task);
          });
        }
        board.addSection(section);
      });
      console.log('✅ Quadro carregado com sucesso!');
      return board;
    }
  } catch (error) {
    console.error('❌ Erro ao carregar os dados. Um novo quadro será criado.', error);
  }

  console.log('Nenhum dado salvo encontrado. Criando um novo quadro.');
  const newBoard = new Board("Meu Projeto");
  newBoard.addSection(new Section("Backlog"));
  newBoard.addSection(new Section("A Fazer"));
  newBoard.addSection(new Section("Concluído"));
  return newBoard;
}

/**
 * Função principal que exibe o menu e gerencia as ações do usuário.
 * @param {Board} board O objeto do quadro a ser gerenciado.
 */
async function mainMenu(board) {
  while (true) {
    const { action } = await inquirer.prompt([
      {
        type: 'list',
        name: 'action',
        message: 'O que você deseja fazer?',
        choices: [
          'Visualizar Quadro',
          'Adicionar Tarefa',
          'Adicionar Seção',
          'Editar Tarefa',
          'Mover Tarefa',
          'Deletar Item',
          { type: 'separator' },
          'Sair'
        ],
      },
    ]);

    switch (action) {
      case 'Visualizar Quadro':
        board.display();
        break;
      case 'Adicionar Tarefa':
        await addTask(board);
        break;
      case 'Adicionar Seção':
        await addSection(board);
        break;
      case 'Editar Tarefa':
        await editTask(board);
        break;
      case 'Mover Tarefa':
        await moveTask(board);
        break;
      case 'Deletar Item':
        await deleteItem(board);
        break;
      case 'Sair':
        saveData(board);
        console.log('\n👋 Até logo!');
        return;
    }
    
    await inquirer.prompt([{ type: 'input', name: 'continue', message: '\nPressione ENTER para continuar...', suffix: '' }]);
  }
}

/**
 * Gerencia o fluxo para adicionar uma nova seção.
 * @param {Board} board O quadro onde a seção será adicionada.
 */
async function addSection(board) {
    const { title } = await inquirer.prompt([
        { type: 'input', name: 'title', message: 'Qual o título da nova seção?', validate: input => !!input || 'O título não pode ser vazio.' }
    ]);
    board.addSection(new Section(title));
    saveData(board);
}

/**
 * Gerencia o fluxo para adicionar uma nova tarefa, incluindo tags.
 * @param {Board} board O quadro onde a tarefa será adicionada.
 */
async function addTask(board) {
  if (board.sections.length === 0) {
      console.log('❌ Você precisa criar uma seção antes de adicionar uma tarefa.');
      return;
  }
    
  const answers = await inquirer.prompt([
    { type: 'input', name: 'title', message: 'Qual o título da tarefa?', validate: input => !!input || 'O título não pode ser vazio.' },
    { type: 'input', name: 'description', message: 'Qual a descrição da tarefa?' },
    { type: 'list', name: 'sectionTitle', message: 'Em qual seção a tarefa deve ser adicionada?', choices: board.sections.map(s => s.title) }
  ]);

  const task = new Task(answers.title, answers.description);

  // Pergunta se o usuário quer adicionar tags
  const { addTags } = await inquirer.prompt([{ type: 'confirm', name: 'addTags', message: 'Deseja adicionar tags a esta tarefa?', default: false }]);
  if (addTags) {
      const { tagString } = await inquirer.prompt([{ type: 'input', name: 'tagString', message: 'Digite as tags separadas por vírgula (ex: urgente, frontend):' }]);
      if (tagString) {
          const tagTitles = tagString.split(',').map(t => t.trim()).filter(t => t);
          tagTitles.forEach(title => task.addTag(new Tag(title)));
      }
  }

  const section = board.sections.find(s => s.title === answers.sectionTitle);
  if (section) {
    section.addTask(task);
    saveData(board);
  } else {
    console.log('❌ Seção não encontrada.');
  }
}

/**
 * Gerencia o fluxo para mover uma tarefa entre seções.
 * @param {Board} board O quadro onde a tarefa será movida.
 */
async function moveTask(board) {
  const allTasks = board.sections.flatMap(section => section.tasks.map(task => ({ name: `[${section.title}] ${task.title}`, value: { task, fromSection: section } })));
  if (allTasks.length === 0) { console.log('\nℹ️ Não há tarefas para mover.'); return; }

  const { taskToMove } = await inquirer.prompt([{ type: 'list', name: 'taskToMove', message: 'Qual tarefa você deseja mover?', choices: allTasks }]);
  const { task, fromSection } = taskToMove;

  const destinationChoices = board.sections.filter(s => s.title !== fromSection.title).map(s => s.title);
  if (destinationChoices.length === 0) { console.log('\nℹ️ Não há outras seções para onde mover esta tarefa.'); return; }

  const { toSectionTitle } = await inquirer.prompt([{ type: 'list', name: 'toSectionTitle', message: `Mover "${task.title}" para qual seção?`, choices: destinationChoices }]);
  
  const toSection = board.sections.find(s => s.title === toSectionTitle);
  if (toSection) {
      fromSection.tasks = fromSection.tasks.filter(t => t.title !== task.title || t.description !== task.description);
      toSection.addTask(task);
      saveData(board);
  } else {
      console.log('❌ Seção de destino não encontrada.');
  }
}

/**
 * Gerencia a edição de uma tarefa (título, descrição, tags).
 * @param {Board} board O quadro que contém a tarefa.
 */
async function editTask(board) {
    const allTasks = board.sections.flatMap(section => section.tasks.map(task => ({ name: `[${section.title}] ${task.title}`, value: { task } })));
    if (allTasks.length === 0) { console.log('\nℹ️ Não há tarefas para editar.'); return; }
  
    const { taskToEdit } = await inquirer.prompt([{ type: 'list', name: 'taskToEdit', message: 'Qual tarefa você deseja editar?', choices: allTasks }]);
    const { task } = taskToEdit;

    const { partToEdit } = await inquirer.prompt([{
        type: 'list', name: 'partToEdit', message: `O que você quer editar em "${task.title}"?`,
        choices: ['Título', 'Descrição', 'Adicionar Tags', 'Remover Tags']
    }]);

    switch (partToEdit) {
        case 'Título':
            const { newTitle } = await inquirer.prompt([{ type: 'input', name: 'newTitle', message: 'Digite o novo título:', default: task.title }]);
            task.title = newTitle;
            break;
        case 'Descrição':
            const { newDescription } = await inquirer.prompt([{ type: 'input', name: 'newDescription', message: 'Digite a nova descrição:', default: task.description }]);
            task.description = newDescription;
            break;
        case 'Adicionar Tags':
            const { tagString } = await inquirer.prompt([{ type: 'input', name: 'tagString', message: 'Digite as novas tags separadas por vírgula:' }]);
            if (tagString) {
                const tagTitles = tagString.split(',').map(t => t.trim()).filter(t => t);
                tagTitles.forEach(title => task.addTag(new Tag(title)));
            }
            break;
        case 'Remover Tags':
            if (task.tags.length === 0) { console.log('ℹ️ Esta tarefa não possui tags para remover.'); return; }
            const { tagsToRemove } = await inquirer.prompt([{
                type: 'checkbox', name: 'tagsToRemove', message: 'Selecione as tags para remover:',
                choices: task.tags.map(t => ({ name: t.title }))
            }]);
            tagsToRemove.forEach(tagTitle => task.removeTag(tagTitle));
            break;
    }
    saveData(board);
}

/**
 * Gerencia a exclusão de um item (tarefa ou seção).
 * @param {Board} board O quadro de onde o item será deletado.
 */
async function deleteItem(board) {
    const { itemType } = await inquirer.prompt([{
        type: 'list', name: 'itemType', message: 'O que você deseja deletar?',
        choices: ['Tarefa', 'Seção']
    }]);

    if (itemType === 'Tarefa') {
        const allTasks = board.sections.flatMap(section => section.tasks.map(task => ({ name: `[${section.title}] ${task.title}`, value: { task, fromSection: section } })));
        if (allTasks.length === 0) { console.log('\nℹ️ Não há tarefas para deletar.'); return; }

        const { taskToDelete } = await inquirer.prompt([{ type: 'list', name: 'taskToDelete', message: 'Qual tarefa você deseja deletar?', choices: allTasks }]);
        const { task, fromSection } = taskToDelete;
        
        fromSection.tasks = fromSection.tasks.filter(t => t.title !== task.title || t.description !== task.description);

    } else if (itemType === 'Seção') {
        if (board.sections.length === 0) { console.log('\nℹ️ Não há seções para deletar.'); return; }
        const { sectionTitle } = await inquirer.prompt([{ type: 'list', name: 'sectionTitle', message: 'Qual seção você deseja deletar?', choices: board.sections.map(s => s.title) }]);
        
        const { confirmDelete } = await inquirer.prompt([{ type: 'confirm', name: 'confirmDelete', message: `⚠️ ATENÇÃO: Isso deletará a seção "${sectionTitle}" e TODAS as suas tarefas. Deseja continuar?`, default: false }]);

        if (confirmDelete) {
            board.sections = board.sections.filter(s => s.title !== sectionTitle);
        } else {
            console.log('Operação cancelada.');
        }
    }
    saveData(board);
}


async function run() {
  try {
    inquirer = (await import('inquirer')).default;
  } catch (err) {
    console.error("Falha ao carregar a biblioteca 'inquirer'.");
    console.error("Por favor, certifique-se de que ela está instalada corretamente rodando: npm install inquirer");
    return;
  }

  console.clear();
  console.log('========================================');
  console.log('   Bem-vindo ao Gerenciador de Tarefas! ');
  console.log('========================================\n');
  
  const board = loadData();
  await mainMenu(board);
}

// Executa o programa
run();
