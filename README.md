# 📝 Gerenciador de Tarefas de Console

Este é um projeto de um simples, porém funcional, gerenciador de tarefas que roda inteiramente no terminal, inspirado em quadros Kanban e seguindo um esboço feito pelo meu professor. Foi desenvolvido como uma forma de aplicar e aprofundar conhecimentos em JavaScript moderno (ES6+), Node.js e na manipulação de dados de forma modular e persistente.

## 🎯 Objetivo do Projeto

O principal objetivo deste projeto é o estudo e a prática de conceitos fundamentais e intermediários de JavaScript e do ecossistema Node.js, incluindo:

- Programação Orientada a Objetos (POO): Criação e utilização de Classes para modelar as entidades do sistema (Board, Section, Task, Tag).

- Modularização: Organização do código em módulos (arquivos) para melhor manutenibilidade, seguindo o padrão CommonJS (require/module.exports).

- Manipulação de Arrays e Objetos: Uso intensivo de métodos como .map, .filter, .find e .flatMap para gerenciar os dados.

- Assincronismo (Async/Await): Lidar com operações assíncronas de forma limpa, especialmente na interação com o usuário.

- Persistência de Dados: Leitura e escrita de arquivos (fs) para salvar o estado da aplicação em um arquivo JSON, simulando um banco de dados simples.

- Criação de Interfaces de Linha de Comando (CLI): Uso da biblioteca inquirer para criar uma experiência de usuário interativa e amigável no terminal.

## ✨ Funcionalidades

- Visualização de Quadro: Exibe todas as seções e suas respectivas tarefas de forma organizada.

- Gerenciamento de Seções: Crie e delete seções (colunas) no seu quadro.

- Gerenciamento de Tarefas: Crie, edite, mova e delete tarefas.

- Uso de Tags: Adicione e remova tags de tarefas para melhor categorização.

- Persistência de Dados: O estado do seu quadro é salvo automaticamente em um arquivo board-data.json, para que você não perca seu trabalho ao fechar o programa.

## 🛠️ Tecnologias Utilizadas

- Node.js: Ambiente de execução para o JavaScript no servidor/backend.

- Inquirer.js: Biblioteca para criar prompts de comando interativos.

- JavaScript (ES6+): Versão moderna da linguagem, utilizando conceitos como Classes, let/const, Arrow Functions e Async/Await.

## 🚀 Instalação e Execução

- Para rodar este projeto em sua máquina local, siga os passos abaixo:

- Clone o repositório (ou baixe os arquivos):

  git clone https://github.com/G4b1-Brandao/Gerenciador-de-Tarefas.git


- Navegue até a pasta do projeto:

  cd gerenciador-de-tarefas-console

- Instale as dependências (neste caso, o inquirer):

  npm install

- Execute a aplicação:

  node app.js


📌 *Projeto desenvolvido para estudar e aprimorar minhas habilidaes em javaScript - 2025*  
