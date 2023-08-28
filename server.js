const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 5000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

const { verifyToken } = require('./middleware/VerifyToken');
const { Register, Login, getUsers, Logout } = require('./controller/UserController');
const { getTodos, getDeletedTodos, getTodoById, deleteTodos, updateTodo, createTodo } = require('./controller/TodoController')


const prefix = '/v1/api/';

app.get(prefix + 'users', getUsers);
app.post(prefix + 'register', Register);
app.post(prefix + 'login', Login);
app.delete(prefix + 'logout', Logout);

app.get(prefix + "todos", verifyToken, getTodos);
app.get(prefix + "todo/:id", verifyToken, getTodoById);
app.get(prefix + "deletedtodo", verifyToken, getDeletedTodos);
app.put(prefix + "updatetodo/:id", verifyToken, updateTodo); // update buku
app.put(prefix + "todo/:id", verifyToken, deleteTodos); //delete book api
app.post(prefix + "createtodo", verifyToken, createTodo); //create book api


app.get('/', (req, res) => {
  res.send('Ok');
});

app.listen(5000 || process.env.PORT, () => {
  console.log('Server Started');
});