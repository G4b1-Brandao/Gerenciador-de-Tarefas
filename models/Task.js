class Task {
  constructor(title, description) {
    this.title = title;
    this.description = description;
    this.tags = []; // Um array para armazenar as Tags
  }

  addTag(tag) {
    this.tags.push(tag);
  }

  // Método para exibir a tarefa de uma forma bonitinha
  display() {
    const tagTitles = this.tags.map(tag => `[${tag.title}]`).join(' ');
    console.log(`  - ${this.title} ${tagTitles}`);
    console.log(`    ${this.description}`);
  }
}

module.exports = Task;