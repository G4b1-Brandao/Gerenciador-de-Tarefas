const Task = require('./Task.js');

class Section {
  constructor(title) {
    this.title = title;
    this.tasks = []; // Um array para armazenar as Tasks
  }

  addTask(task) {
    if (task instanceof Task) {
      this.tasks.push(task);
    } else {
      console.error("Erro: Só é possível adicionar objetos do tipo Task.");
    }
  }

  display() {
    console.log(`\n## ${this.title.toUpperCase()} ##`);
    if (this.tasks.length === 0) {
      console.log("   (Nenhuma tarefa nesta seção)");
    } else {
      this.tasks.forEach(task => task.display());
    }
  }
}

module.exports = Section;