import { User } from "../models/user.model.js";

//controller for searching an user
const user_search = async (req, res) => {
  try {
    const { username } = req.params; 
    if (!username) {
      return res.status(400).json({ message: "Username field is required!" });
    }

    const user = await User.findOne({ username }).select("-password -email -refreshToken");

    if (!user) {
      return res.status(404).json({ message: "User does not exist!" }); 
    }

    res.status(200).json({ 
      success: true,
      user,
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

export { user_search };
