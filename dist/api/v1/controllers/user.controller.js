"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.detail = exports.login = exports.register = void 0;
const md5_1 = __importDefault(require("md5"));
const user_model_1 = __importDefault(require("../models/user.model"));
const generateHelper = __importStar(require("../../../helper/generate"));
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const email = req.body.email;
        const emailExist = yield user_model_1.default.findOne({ email: email });
        if (emailExist) {
            res.json({
                code: 400,
                message: 'Email đã tồn tại',
            });
        }
        else {
            req.body.password = (0, md5_1.default)(req.body.password);
            const newUser = new user_model_1.default({
                fullName: req.body.fullName,
                email: req.body.email,
                password: req.body.password,
                token: generateHelper.generateRandomString(30),
            });
            yield newUser.save();
            const token = newUser.token;
            res.cookie('token', token);
            res.json({
                code: 200,
                message: 'tạo tài khoản thành công',
                token: token,
            });
        }
    }
    catch (error) {
        console.error('Lỗi changeStatus:', error);
        return res.status(400).json({
            code: 400,
            message: 'Không tồn tại!',
        });
    }
});
exports.register = register;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const email = req.body.email;
        const password = (0, md5_1.default)(req.body.password);
        const user = yield user_model_1.default.findOne({
            email: email,
            deleted: false,
        });
        if (!user) {
            res.json({
                code: 400,
                message: 'Email không tồn tại',
            });
            return;
        }
        if (password != user.password) {
            res.json({
                code: 400,
                message: 'Sai mật khẩu',
            });
            return;
        }
        if (user.status === 'inactive') {
            res.json({
                code: 400,
                message: 'Tài khoản đã bị khóa',
            });
            return;
        }
        const token = user.token;
        res.cookie('token', token);
        res.json({
            code: 200,
            message: 'Đăng nhập thành công',
            token: token,
        });
    }
    catch (error) {
        console.error('Lỗi changeStatus:', error);
        return res.status(400).json({
            code: 400,
            message: 'Không tồn tại!',
        });
    }
});
exports.login = login;
const detail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        res.json({
            code: 200,
            message: 'thành công',
            infoUser: req['user'],
        });
    }
    catch (error) {
        console.error('Lỗi changeStatus:', error);
        return res.status(400).json({
            code: 400,
            message: 'Không tồn tại!',
        });
    }
});
exports.detail = detail;
