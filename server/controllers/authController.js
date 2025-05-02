const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Función para validar email
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Registro de usuario
const registerUser = async (req, res) => {
  const { firstName, lastName, email, password } = req.body;

  // Validaciones mejoradas
  if (!firstName || !lastName || !email || !password) {
    return res.status(400).json({ message: "Todos los campos son requeridos" });
  }

  // Validar longitud del nombre y apellido
  if (firstName.length < 2 || firstName.length > 50) {
    return res
      .status(400)
      .json({ message: "El nombre debe tener entre 2 y 50 caracteres" });
  }

  if (lastName.length < 2 || lastName.length > 50) {
    return res
      .status(400)
      .json({ message: "El apellido debe tener entre 2 y 50 caracteres" });
  }

  // Validar formato de email
  if (!isValidEmail(email)) {
    return res
      .status(400)
      .json({ message: "El formato del email es inválido" });
  }

  // Validar longitud y complejidad de la contraseña
  if (password.length < 6) {
    return res
      .status(400)
      .json({ message: "La contraseña debe tener al menos 6 caracteres" });
  }

  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "El usuario ya existe" });
    }

    // Hash de la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear el nuevo usuario con la info del form
    const newUser = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    // Creacion del token con la firma del scret y el expires
    const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.status(201).json({ message: "Usuario creado exitosamente", token });
  } catch (err) {
    console.error("Error al crear el usuario:", err.message);
    res.status(500).json({ message: "Error al crear el usuario" });
  }
};

// Login del usuario (para probar autenticación)
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  // Validaciones mejoradas
  if (!email || !password) {
    return res
      .status(400)
      .json({ message: "Email y contraseña son requeridos" });
  }

  // Validar formato de email
  if (!isValidEmail(email)) {
    return res
      .status(400)
      .json({ message: "El formato del email es inválido" });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Credenciales inválidas" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Credenciales inválidas" });
    }

    user.lastLogin = new Date();
    await user.save();

    //Creacion del token con la firma del scret y el expires
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    // Devolver información del usuario (sin la contraseña)
    const userInfo = {
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
    };

    res.status(200).json({ message: "Login exitoso", token, user: userInfo });
  } catch (err) {
    console.error("Error al hacer login:", err.message);
    res.status(500).json({ message: "Error al hacer login" });
  }
};

module.exports = { registerUser, loginUser };
