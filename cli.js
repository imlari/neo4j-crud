const readline = require('readline');
const axios = require('axios');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const baseURL = 'http://localhost:3000/students';

const showMenu = () => {
    console.log("== CRUD Estudantes Neo4j ==");
    console.log("1. Criar Estudante");
    console.log("2. Ler Estudante");
    console.log("3. Atualizar Estudante");
    console.log("4. Excluir Estudante");
    console.log("5. Exibir Todos os Estudantes");
    console.log("0. Sair");
};

const createStudent = () => {
    rl.question('Nome: ', nome => {
        rl.question('Idade: ', idade => {
            rl.question('Plano: ', plano => {
                axios.post(`${baseURL}/add`, { nome, idade, plano })
                    .then(response => {
                        console.log(response?.data?.mssg);
                        showMenu();
                        promptUser();
                    })
                    .catch(error => {
                        console.error('Erro ao adicionar estudante');
                        showMenu();
                        promptUser();
                    });
            });
        });
    });
};

const readStudent = () => {
    rl.question('ID do Estudante: ', id => {
        axios.get(`${baseURL}/${id}`)
            .then(response => {
                console.log(response?.data?.student);
                showMenu();
                promptUser();
            })
            .catch(error => {
                console.error('Erro ao obter estudante');
                showMenu();
                promptUser();
            });
    });
};

const updateStudent = () => {
    rl.question('ID do Estudante: ', id => {
        rl.question('Nome: ', nome => {
            rl.question('Idade: ', idade => {
                rl.question('Plano: ', plano => {
                    axios.put(`${baseURL}/update/${id}`, { nome, idade, plano })
                        .then(response => {
                            console.log(response?.data?.mssg);
                            showMenu();
                            promptUser();
                        })
                        .catch(error => {
                            console.error('Erro ao atualizar estudante');
                            showMenu();
                            promptUser();
                        });
                });
            });
        });
    });
};

const deleteStudent = () => {
    rl.question('ID do Estudante: ', id => {
        axios.delete(`${baseURL}/delete/${id}`)
            .then(response => {
                console.log(response?.data?.mssg);
                showMenu();
                promptUser();
            })
            .catch(error => {
                console.error('Erro ao excluir estudante:', error.response?.data);
                showMenu();
                promptUser();
            });
    });
};

const listStudents = () => {
    axios.get(baseURL)
        .then(response => {
            console.log(response?.data?.students);
            showMenu();
            promptUser();
        })
        .catch(error => {
            console.error('Erro ao obter estudantes:', error.response?.data);
            showMenu();
            promptUser();
        });
};

const promptUser = () => {
    rl.question('Escolha uma opção: ', option => {
        switch (option) {
            case '1':
                createStudent();
                break;
            case '2':
                readStudent();
                break;
            case '3':
                updateStudent();
                break;
            case '4':
                deleteStudent();
                break;
            case '5':
                listStudents();
                break;
            case '0':
                rl.close();
                break;
            default:
                console.log('Opção inválida.');
                showMenu();
                promptUser();
                break;
        }
    });
};

showMenu();
promptUser();
