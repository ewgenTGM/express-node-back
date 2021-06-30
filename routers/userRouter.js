import { Router } from 'express';
import { ResponseModel } from '../models/ResponseModel.js';
import UserRepositoryClass from '../DAL/UserRepositoryClass.js';

const userRouter = Router();

const repository = UserRepositoryClass;

userRouter.get('/', getAllUser);
userRouter.get('/:id', getUser);
userRouter.delete('/:id', deleteUser);
userRouter.patch('/:id', updateUser);

async function deleteUser(req, res) {
	const response = new ResponseModel();
	try {
		const { id } = req.params;
		if (await repository.deleteUser(id)) {
			response.data = `User ${id} deleted`;
		} else {
			response.data = `User ${id} not found`;
			response.success = false;
		}
	} catch (e) {
		response.success = false;
		response.errors.push(e.message);
	} finally {
		res.json(response);
	}
}

async function updateUser(req, res) {
	const response = new ResponseModel();
	try {
		const { email } = req.body;
		const { id } = req.params;
		console.log(id);
		const user = await repository.updateUser(id, { email });
		if (user) {
			response.data = user;
		} else {
			response.success = false;
			response.errors.push(`User ${id} not found`);
		}
	} catch (e) {
		response.success = false;
		response.errors.push(e.message);
	} finally {
		res.json(response);
	}
}

async function getAllUser(req, res) {
	const response = new ResponseModel();
	try {
		response.data = await repository.getAllUsers();
	} catch (e) {
		response.errors.push(e.message);
		response.success = false;
	} finally {
		res.json(response);
	}
}

async function getUser(req, res) {
	const response = new ResponseModel();
	try {
		const { id } = req.params;
		if (id.trim() === '') {
			response.errors.push('Bad parameter "id"');
		} else {
			const user = await repository.getUserById(id);
			if (user) {
				response.data = user;
			} else {
				response.success = false;
				response.errors.push(`User with id ${id} not found`);
			}
		}
	} catch (e) {
		response.errors.push(e.message);
		response.success = false;
	} finally {
		res.json(response);
	}
}

export default userRouter;
