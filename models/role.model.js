import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Role = sequelize.define("Role", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    name: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: {
            msg: "Role name already exists"
        },
        validate: {
            notEmpty: {
                msg: "Role name cannot be empty"
            },
            len: {
                args: [2, 50],
                msg: "Role name must be between 2 and 50 characters"
            }
        }
    },
    description: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
        field: "created_at"
    },
    updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
        field: "updated_at"
    }
}, {
    tableName: "roles",
    timestamps: true
});

export default Role;