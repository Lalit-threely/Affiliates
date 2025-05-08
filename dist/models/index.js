"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sequelize = void 0;
const sequelize_1 = require("sequelize");
const config_1 = __importDefault(require("../config"));
const { env, db } = config_1.default;
console.log(db, env);
// Initialize Sequelize without a database to create the database
exports.sequelize = new sequelize_1.Sequelize(db.database, db.user, db.password, {
    host: db.host,
    dialect: 'mysql',
    port: db.port ?? 3306,
    pool: {
        max: 1500, // Maximum number of connections in the pool
        min: 0, // Minimum number of connections in the pool
        acquire: 50000, // Maximum time (ms) Sequelize will try to get a connection before throwing an error
        idle: 10000, // Maximum time (ms) a connection can be idle before being released
    },
    logging: env === 'development', // Disable logging in production
    retry: {
        max: 3, // Retry a failed query up to 3 times
    },
});
//# sourceMappingURL=index.js.map