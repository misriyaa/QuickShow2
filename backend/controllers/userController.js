import { userModel } from "../models/userModel.js";

export const getUSerData = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await userModel.findById(userId);
    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }
    res.json({
      success: true,
      userData: {
        name: user.name,
        email: user.email,
        isAccountVerified: user.isAccountVerified,
           isAdmin: user.isAdmin, 
      },
    });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};
