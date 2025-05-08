"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AffiliateRole = void 0;
const sequelize_1 = require("sequelize");
const index_1 = require("./index");
var AffiliateRole;
(function (AffiliateRole) {
    AffiliateRole["ADMIN"] = "ADMIN";
    AffiliateRole["MANAGER"] = "MANAGER";
    AffiliateRole["AFFILIATE"] = "AFFILIATE";
})(AffiliateRole || (exports.AffiliateRole = AffiliateRole = {}));
const Affiliate = index_1.sequelize.define('Affiliate', {
    id: {
        type: sequelize_1.DataTypes.UUID,
        defaultValue: sequelize_1.DataTypes.UUIDV4,
        primaryKey: true,
    },
    parent_id: {
        type: sequelize_1.DataTypes.UUID,
        allowNull: true,
    },
    name: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true,
        },
    },
    access_code: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    role: {
        type: sequelize_1.DataTypes.ENUM(...Object.values(AffiliateRole)),
        allowNull: false,
        defaultValue: AffiliateRole.AFFILIATE,
    },
    password: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
        defaultValue: null,
    },
    verified: {
        type: sequelize_1.DataTypes.BOOLEAN,
        defaultValue: false,
    },
    wallet_address: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
        unique: true,
    },
    path: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    tag: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    status: {
        type: sequelize_1.DataTypes.ENUM('active', 'inactive', 'suspended'),
        allowNull: false,
        defaultValue: 'active',
    },
}, {
    tableName: 'Affiliates',
    timestamps: true,
    paranoid: true,
    indexes: [
        {
            unique: true,
            fields: ['email'],
        },
        {
            fields: ['id'],
        },
        {
            fields: ['access_code'],
        },
    ],
});
// Hooks
Affiliate.beforeCreate(async (affiliate, options) => {
    try {
        const affiliateData = affiliate.get();
        if (affiliateData.parent_id) {
            const parent = await Affiliate.findByPk(affiliateData.parent_id);
            if (!parent) {
                throw new Error(`Parent affiliate with ID ${affiliateData.parent_id} not found.`);
            }
            const parentData = parent.get();
            affiliate.set('path', `${parentData.path}/${affiliateData.id}`);
        }
        else {
            affiliate.set('path', `/${affiliateData.id}`);
        }
    }
    catch (error) {
        console.error('Error in beforeCreate hook for Affiliate model:', {
            affiliate: affiliate.get(),
            error: error instanceof Error ? error.message : String(error),
        });
        throw error;
    }
});
exports.default = Affiliate;
//# sourceMappingURL=Affiliate.js.map