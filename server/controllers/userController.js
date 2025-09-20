
export const getProfile = (req, res) => {
  res.json({ user: req.user });
};


export const getAdminData = (req, res) => {
  res.json({ message: "Admin-only data", admin: req.user });
};
