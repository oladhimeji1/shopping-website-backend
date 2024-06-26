
// update photo
// update password/changepage
// forget pass
const RegisterUser = async (req, res) => {
  const { username, password, email, gender } = req.body;
  const validatePassword = (password) => {
    const regex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!.@#$%^&*()_+])[A-Za-z\d!@#$.%^&*()_+]{8,}$/;
    return regex.test(password);
  };

  // Call the validatePassword function with the password parameter
  const isValidPassword = validatePassword(password);
  console.log(isValidPassword);

  const emailExist = await User.findOne({ email });
  console.log(emailExist);
  const hashespassword = await bcrypt.hash(password, 10);

  if (!username || !password || !email || !gender) {
    return res.json({
      message: "Fill all require field",
    });
  } else if (!isValidPassword) {
    return res.json({
      message:
        "password must include AZ or az and special chararter and must not less than 8",
    });
  } else if (emailExist) {
    return res.json({
      message: "email already exist",
    });
  } else {
    try {
      const newUser = await User.create({
        username,
        email,
        password: hashespassword,
        gender,
      });

      return res.status(200).json({
        message: "new user Successfully ",
        data: newUser,
      });
    } catch (error) {
      return res.status(500).json({
        message: "Error creating new user",
        error: error.message,
      });
    }
  }
};

const LoginUser = async (req, res) => {
  const { password, email } = req.body;

  if (!password || !email) {
    return res.status(400).json({
      message: "Please enter all required fields",
    });
  }

  try {
    // Check if the user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        message: "User not found Create an account",
      });
    }

    // Compare passwords
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    // Generate JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h", // Token expires in 1 hour
    });

    return res.status(200).json({
      message: "Login successful",
      token: token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        gender: user.gender,
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

const UpdateProfile = async (req, res) => {
  const { username, email, gender } = req.body;
  const userId = req.params.id;

  try {
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { username, email, gender },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({
      message: "User profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    return res.status(200).json({ users });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

const getOneUserById = async (req, res) => {
  const userId = req.params.id;

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({ user });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

const DeleteUser = async (req, res) => {
  const userId = req.params.id;

  try {
    const deletedUser = await User.findByIdAndDelete(userId);

    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    return res
      .status(200)
      .json({ message: "User deleted successfully", user: deletedUser });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

module.exports = {RegisterUser, getOneUserById, UpdateProfile, DeleteUser, getAllUsers, LoginUser}