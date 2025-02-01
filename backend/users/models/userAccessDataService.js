const { generateAuthToken } = require("../../auth/providers/jwt");
const { createError } = require("../../utils/handleErrors");
const {
	generatePassword,
	comparePasswords,
} = require("../../users/helpers/bcrypt");
const User = require("../../users/models/mongodb/User");

const registerUser = async (newUser) => {
	try {
		newUser.password = generatePassword(newUser.password);
		console.log(newUser);

		let user = new User(newUser);
		user = await user.save();
		user = { email: user.email, name: user.name, _id: user._id };
		return user;
	} catch (error) {
		return createError("Mongoose", error);
	}
};

const getAllUsers = async () => {
	try {
		let users = await User.find().select("-password");
		return users;
	} catch (error) {
		return createError("Mongoose", error);
	}
};

const getUser = async (UserId) => {
	try {
		let user = await User.findById(UserId).select("-password");
		if (!user) {
			throw { status: 404, message: "User not found" };
		}
		return user;
	} catch (error) {
		return createError("Mongoose", error);
	}
};

const loginUser = async (email, password) => {
	try {
		const userFromBD = await User.findOne({ email });
		if (!userFromBD) {
			const error = new Error("User not exsist. Please register");
			error.status = 401;
			createError("Authentication", error);
		}
		if (!comparePasswords(password, userFromBD.password)) {
			const error = Error("Password Missmatch");
			error.status = 401;
			createError("Authentication", error);
		}
		const token = generateAuthToken(userFromBD);
		return token;
	} catch (error) {
		createError("Mongoose", error);
	}
};
const updateUser = async (id, updateData) => {
	try {
		const user = await User.findByIdAndUpdate(
			id,
			{ $set: updateData },
			{ new: true, runValidators: true }
		);

		if (!user) {
			throw { status: 404, message: "User not found" };
		}

		return user;
	} catch (error) {
		throw {
			status: error.status || 400,
			message: error.message || "Update failed",
		};
	}
};

const deleteUser = async (id) => {
	try {
		const user = await User.findByIdAndDelete(id);
		return user;
	} catch (error) {
		throw { status: 400, message: "Delete failed" };
	}
};

module.exports = {
	registerUser,
	getAllUsers,
	getUser,
	loginUser,
	updateUser,
	deleteUser,
};
