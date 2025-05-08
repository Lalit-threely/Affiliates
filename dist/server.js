"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const body_parser_1 = __importDefault(require("body-parser"));
const dotenv_1 = __importDefault(require("dotenv"));
const index_1 = require("./models/index");
const affiliate_1 = __importDefault(require("./routes/affiliate"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT || 3000;
// Middleware
app.use((0, cors_1.default)());
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: true }));
// Routes
app.use('/api/affiliates', affiliate_1.default);
// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'OK', message: 'Server is running' });
});
// Database connection and server start
const startServer = async () => {
    try {
        console.log('Starting server...');
        await index_1.sequelize.authenticate();
        console.log('Database connection has been established successfully.');
        // Sync database models
        await index_1.sequelize.sync({ alter: true });
        console.log('Database models synchronized.');
        app.listen(port, () => {
            console.log(`Server is running on port ${port}`);
        });
    }
    catch (error) {
        console.error('Unable to start server:', error);
    }
};
startServer();
//# sourceMappingURL=server.js.map