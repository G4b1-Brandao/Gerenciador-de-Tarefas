const Section = require('./Section.js');

class Board {
  constructor(title) {
    this.title = title;
    this.sections = []; // Um array para armazenar as Sections
  }

  addSection(section) {
    if (section instanceof Section) {
      this.sections.push(section);
    } else {
      console.error("Erro: Só é possível adicionar objetos do tipo Section.");
    }
  }

  display() {
    console.log("========================================");
    console.log(`  QUADRO: ${this.title}`);
    console.log("========================================");
    this.sections.forEach(section => section.display());
    console.log("\n========================================");
  }
}

module.exports = Board;