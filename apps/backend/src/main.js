"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const express_1 = require("express");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.enableCors({
        origin: process.env.FRONTEND_URL || 'http://localhost:5173',
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization']
    });
    app.use((0, express_1.json)());
    app.use((0, express_1.urlencoded)({ extended: true }));
    await app.listen(process.env.PORT || 4000);
    console.log('✅ Backend running with CORS enabled on', await app.getUrl());
}
bootstrap();
//# sourceMappingURL=main.js.map