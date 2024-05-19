const express = require('express');
const router = express.Router();
const neo4j = require('neo4j-driver');

const driver = neo4j.driver("bolt://localhost:7687", neo4j.auth?.basic("neo4j", "password"));
const session = driver.session();

router.post('/add', (req, res) => {
    const { nome, idade, plano } = req.body;
    session
        .run("CREATE (s:Student { nome: $nome, idade: $idade, plano: $plano })", { nome, idade, plano })
        .then(() => {
            res.status(200).json({ 'status': '200', 'mssg': 'Estudante adicionado com sucesso' });
        })
        .catch(err => {
            res.status(500).send({ 'status': '500', 'mssg': 'Erro ao adicionar estudante', 'error': err });
        });
});

router.get('/', (req, res) => {
    session
        .run("MATCH (s:Student) RETURN s")
        .then(result => {
            const students = result.records.map(record => record.get('s').properties);
            res.status(200).json({ 'status': '200', 'students': students });
        })
        .catch(err => {
            res.status(500).send({ 'status': '500', 'mssg': 'Erro ao obter estudantes', 'error': err });
        });
});

router.get('/:id', (req, res) => {
    const studentId = req.params.id;
    session
        .run("MATCH (s:Student) WHERE id(s) = $studentId RETURN s", { studentId: parseInt(studentId) })
        .then(result => {
            if (result.records.length === 0) {
                res.status(404).json({ 'status': '404', 'mssg': 'Estudante não encontrado' });
            } else {
                const student = result.records[0].get('s').properties;
                res.status(200).json({ 'status': '200', 'student': student });
            }
        })
        .catch(err => {
            res.status(500).send({ 'status': '500', 'mssg': 'Erro ao obter estudante', 'error': err });
        });
});

router.put('/update/:id', (req, res) => {
    const studentId = req.params.id;
    const { nome, idade, plano } = req.body;
    session
        .run("MATCH (s:Student) WHERE id(s) = $studentId SET s.nome = $nome, s.idade = $idade, s.plano = $plano", { studentId: parseInt(studentId), nome, idade, plano })
        .then(() => {
            res.status(200).json({ 'status': '200', 'mssg': 'Estudante atualizado com sucesso' });
        })
        .catch(err => {
            res.status(500).send({ 'status': '500', 'mssg': 'Erro ao atualizar estudante', 'error': err });
        });
});

router.delete('/delete/:id', (req, res) => {
    const studentId = req.params.id;
    session
        .run("MATCH (s:Student) WHERE id(s) = $studentId DETACH DELETE s", { studentId: parseInt(studentId) })
        .then(() => {
            res.status(200).json({ 'status': '200', 'mssg': 'Estudante excluído com sucesso' });
        })
        .catch(err => {
            res.status(500).send({ 'status': '500', 'mssg': 'Erro ao excluir estudante', 'error': err });
        });
});

module.exports = router;
