const { Todo } = require("../models");

//get all data buku
exports.getTodos = async (req, res) => {
    try {
        const todos = await Todo.findAll({
            attributes: { exclude: ['createdAt', 'updatedAt'] },
            where: {
                is_deleted: 0
            }
        });
        res.status(200).json({
            success: true,
            message: "List All",
            data: todos,
        });
    } catch (error) {
        console.log(error);
    }
};

//get data by id
exports.getTodoById = async (req, res) => {
    try {
        const id = req.params.id
        const todos = await Todo.findOne({
            attributes: { exclude: ['createdAt', 'updatedAt'] },
            where: {
                is_deleted: 0,
                id: id
            }
        });
        res.status(200).json({
            success: true,
            message: "List Todo by id",
            data: books,
        });
    } catch (error) {
        console.log(error);
    }
};

//get all data yang terdelete (is_deleted = 0)
exports.getDeletedTodos = async (req, res) => {
    try {
        const todos = await Todo.findAll({
            attributes: { exclude: ['createdAt', 'updatedAt'] },
            where: {
                is_deleted: 1
            }
        });
        res.status(200).json({
            success: true,
            message: "List All Deleted ",
            data: todos,
        });
    } catch (error) {
        console.log(error);
    }
};

// delete
exports.deleteTodos = async (req, res) => {
    try {
        const id = req.params.id
        const tokenUser = req.user
        const { body } = req


        body.is_deleted = 1 //set is_deleted = 1
        body.user_id = tokenUser.userId //set tokenUser yang login

        await Todo.update(body, {
            where: {
                id: id,
            },
        });

        //untuk nampilkan response
        const updatedDate = await Todo.findOne({
            attributes: { exclude: ['createdAt', 'updatedAt'] },
            where: { id: id }
        });

        res.status(200).json({
            success: true,
            message: "Delete berhasil",
            data: updatedDate,
        });
    } catch (error) {
        console.log(error);
    }
};

//update
exports.updateTodo = async (req, res) => {
    try {
        const id = req.params.id
        const tokenUser = req.user
        const { body } = req


        body.user_id = tokenUser.userId //set tokenUser yang login untuk agar bisa tau siapa yang update book ini

        console.log(body);
        await Todo.update(body, {
            where: {
                id: id,
            },
        });

        //untuk nampilkan response
        const updatedDate = await Todo.findOne({
            attributes: { exclude: ['createdAt', 'updatedAt'] },
            where: { id: id }
        });

        res.status(200).json({
            success: true,
            message: "Update berhasil",
            data: updatedDate,
        });
    } catch (error) {
        console.log(error);
    }
};

//create
exports.createTodo = async (req, res) => {
    try {
        const tokenUser = req.user
        const { body } = req


        body.is_deleted = 0 // set is_deleted = 0
        body.user_id = tokenUser.userId //set tokenUser yang login untuk agar bisa tau siapa yang update book ini

        const createdData = await Todo.create(body);

        // const parsedData = JSON.stringify(createdData)
        res.status(200).json({
            success: true,
            message: "Taks berhasil ditambahkan",
            data: createdData,
        });
    } catch (error) {
        console.log(error);
    }
};