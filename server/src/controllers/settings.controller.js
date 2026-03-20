let userPreferences = { darkMode: false };

exports.getSettings = (req, res) => {
    res.status(200).json(userPreferences);
};

exports.updateSettings = (req, res) => {
    const { darkMode } = req.body;
    userPreferences.darkMode = darkMode;
    res.status(200).json({ message: "Preferencia guardada", data: userPreferences });
};
