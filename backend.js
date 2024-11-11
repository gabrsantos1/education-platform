const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '', // senha do seu banco de dados
    database: 'feedback_db'
});

db.connect((err) => {
    if (err) {
        console.error('Erro ao conectar ao banco de dados:', err);
        return;
    }
    console.log('Conectado ao banco de dados');
});

//tabela Feedback (caso não exista)
app.get('/create-table', (req, res) => {
    const createTableQuery = `
        CREATE TABLE IF NOT EXISTS Feedback (
            feedback_id INT PRIMARY KEY AUTO_INCREMENT,
            usuario_id VARCHAR(255),
            senha VARCHAR(255),
            comentario TEXT,
            avaliacao INT CHECK (avaliacao BETWEEN 1 AND 5),
            data_feedback TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    `;
    db.query(createTableQuery, (err, results) => {
        if (err) {
            return res.status(500).send('Erro ao criar tabela');
        }
        res.send('Tabela Feedback criada com sucesso');
    });
});

// adicionar feedback
app.post('/feedback', (req, res) => {
    const { usuario_id, senha, comentario, avaliacao } = req.body;
    const query = `
        INSERT INTO Feedback (usuario_id, senha, comentario, avaliacao)
        VALUES (?, ?, ?, ?)
    `;
    db.query(query, [usuario_id, senha, comentario, avaliacao], (err, results) => {
        if (err) {
            return res.status(500).send('Erro ao adicionar feedback');
        }
        res.status(201).send('Feedback adicionado com sucesso');
    });
});

// busca todos os feedbacks
app.get('/feedback', (req, res) => {
    const query = 'SELECT * FROM Feedback ORDER BY data_feedback DESC';
    db.query(query, (err, results) => {
        if (err) {
            return res.status(500).send('Erro ao buscar feedbacks');
        }
        res.json(results);
    });
});

// busca um feedback pelo ID
app.get('/feedback/:id', (req, res) => {
    const { id } = req.params;
    const query = 'SELECT * FROM Feedback WHERE feedback_id = ?';
    db.query(query, [id], (err, results) => {
        if (err) {
            return res.status(500).send('Erro ao recuperar feedback');
        }
        if (results.length === 0) {
            return res.status(404).send('Feedback não encontrado');
        }
        res.json(results[0]);  // Retorna o feedback
    });
});

// editar feedback
app.put('/feedback/:id', (req, res) => {
    const { id } = req.params;
    const { usuario_id, senha, comentario, avaliacao } = req.body;
    const query = `
        UPDATE Feedback SET usuario_id = ?, senha = ?, comentario = ?, avaliacao = ?
        WHERE feedback_id = ? AND senha = ?
    `;
    db.query(query, [usuario_id, senha, comentario, avaliacao, id, senha], (err, results) => {
        if (err) {
            return res.status(500).send('Erro ao editar feedback');
        }
        if (results.affectedRows === 0) {
            return res.status(400).send('Feedback não encontrado ou senha incorreta');
        }
        res.send('Feedback atualizado com sucesso');
    });
});

// excluir feedback
app.delete('/feedback/:id', (req, res) => {
    const { id } = req.params;
    const { senha } = req.body;
    const query = `
        DELETE FROM Feedback WHERE feedback_id = ? AND senha = ?
    `;
    db.query(query, [id, senha], (err, results) => {
        if (err) {
            return res.status(500).send('Erro ao excluir feedback');
        }
        if (results.affectedRows === 0) {
            return res.status(400).send('Feedback não encontrado ou senha incorreta');
        }
        res.send('Feedback excluído com sucesso');
    });
});

app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});
