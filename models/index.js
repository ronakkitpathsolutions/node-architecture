import sequelize from "../config/database.js";
import User from "./user.model.js";
import Role from "./role.model.js";
import Permission from "./permission.model.js";

// Define associations
Role.hasMany(User, {
    foreignKey: "role_id",
    as: "users"
});

User.belongsTo(Role, {
    foreignKey: "role_id",
    as: "role"
});

// Export models and sequelize instance
const db = {
    sequelize,
    User,
    Role,
    Permission
};

export default db;