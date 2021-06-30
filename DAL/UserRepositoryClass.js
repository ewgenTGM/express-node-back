import { User } from '../models/User.js';

class UserRepositoryClass {
	constructor() {}

	async getUserByEmail(email) {
		try {
			const user = await User.findOne({ email });
			return user;
		} catch (e) {
			throw new Error(e.message);
		}
	}

	async deleteUser(id) {
		try {
			await User.deleteOne({ _id: id });
			return true;
		} catch {
			return false;
		}
	}

	async getAllUsers() {
		const users = await User.find();
		return users;
	}

	async getUserById(id) {
		const candidate = await User.findById(id);
		return candidate;
	}

	async updateUser(id, user) {
		try {
			const candidate = await User.findById(id);
			if (candidate) {
				const updatedUser = await candidate.update({ ...user });
				return updatedUser;
			}
		} catch {
			return null;
		}
	}
}

export default new UserRepositoryClass();
