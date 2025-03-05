"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.embedDocumentsInCollection = embedDocumentsInCollection;
var mongodb_1 = require("mongodb");
var embeddings_1 = require("./embeddings");
var p_limit_1 = require("p-limit");
/**
 * 将指定collection内的所有documents全部 embed，并支持并发处理
 * @param params
 */
function embedDocumentsInCollection(params) {
    return __awaiter(this, void 0, void 0, function () {
        var mongoUri, dbName, collectionName, fields, embeddingConfig, client, db, collection_1, embeddingService_1, limit, tasks, _loop_1, _a, _b, _c, e_1_1, error_1;
        var _this = this;
        var _d, e_1, _e, _f;
        return __generator(this, function (_g) {
            switch (_g.label) {
                case 0:
                    mongoUri = params.mongoUri, dbName = params.dbName, collectionName = params.collectionName, fields = params.fields, embeddingConfig = params.embeddingConfig;
                    client = new mongodb_1.MongoClient(mongoUri);
                    _g.label = 1;
                case 1:
                    _g.trys.push([1, 16, 17, 19]);
                    return [4 /*yield*/, client.connect()];
                case 2:
                    _g.sent();
                    console.log('已连接到 MongoDB');
                    db = client.db(dbName);
                    collection_1 = db.collection(collectionName);
                    embeddingService_1 = new embeddings_1.CustomEmbeddings(embeddingConfig);
                    limit = (0, p_limit_1.default)(100);
                    tasks = [];
                    _g.label = 3;
                case 3:
                    _g.trys.push([3, 8, 9, 14]);
                    _loop_1 = function () {
                        _f = _c.value;
                        _a = false;
                        var doc = _f;
                        if (!doc)
                            return "continue";
                        tasks.push(limit(function () { return __awaiter(_this, void 0, void 0, function () {
                            var texts, _i, fields_1, field, textToEmbed, embeddingVector, error_2;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        // 如果当前记录已有向量数据，则跳过
                                        if (doc.embedding) {
                                            console.log("\u8BB0\u5F55 _id ".concat(doc._id, " \u5DF2\u5B58\u5728 embedding\uFF0C\u8DF3\u8FC7\u3002"));
                                            return [2 /*return*/];
                                        }
                                        texts = [];
                                        for (_i = 0, fields_1 = fields; _i < fields_1.length; _i++) {
                                            field = fields_1[_i];
                                            if (doc[field]) {
                                                texts.push(String(doc[field]));
                                            }
                                        }
                                        if (texts.length === 0) {
                                            console.warn("\u8BB0\u5F55 _id ".concat(doc._id, " \u4E0D\u5305\u542B\u9700\u8981\u5D4C\u5165\u7684\u5B57\u6BB5\uFF0C\u8DF3\u8FC7\u3002"));
                                            return [2 /*return*/];
                                        }
                                        textToEmbed = texts.join(' ');
                                        _a.label = 1;
                                    case 1:
                                        _a.trys.push([1, 4, , 5]);
                                        return [4 /*yield*/, embeddingService_1.embedText(textToEmbed)];
                                    case 2:
                                        embeddingVector = _a.sent();
                                        // 更新文档，将生成的向量写入 embedding 字段中
                                        return [4 /*yield*/, collection_1.updateOne({ _id: doc._id }, { $set: { embedding: embeddingVector } })];
                                    case 3:
                                        // 更新文档，将生成的向量写入 embedding 字段中
                                        _a.sent();
                                        console.log("\u8BB0\u5F55 _id ".concat(doc._id, " \u66F4\u65B0\u4E86 embedding\u3002"));
                                        return [3 /*break*/, 5];
                                    case 4:
                                        error_2 = _a.sent();
                                        console.error("\u5904\u7406\u8BB0\u5F55 _id ".concat(doc._id, " \u65F6\u51FA\u9519\uFF1A"), error_2);
                                        return [3 /*break*/, 5];
                                    case 5: return [2 /*return*/];
                                }
                            });
                        }); }));
                    };
                    _a = true, _b = __asyncValues(collection_1.find({}));
                    _g.label = 4;
                case 4: return [4 /*yield*/, _b.next()];
                case 5:
                    if (!(_c = _g.sent(), _d = _c.done, !_d)) return [3 /*break*/, 7];
                    _loop_1();
                    _g.label = 6;
                case 6:
                    _a = true;
                    return [3 /*break*/, 4];
                case 7: return [3 /*break*/, 14];
                case 8:
                    e_1_1 = _g.sent();
                    e_1 = { error: e_1_1 };
                    return [3 /*break*/, 14];
                case 9:
                    _g.trys.push([9, , 12, 13]);
                    if (!(!_a && !_d && (_e = _b.return))) return [3 /*break*/, 11];
                    return [4 /*yield*/, _e.call(_b)];
                case 10:
                    _g.sent();
                    _g.label = 11;
                case 11: return [3 /*break*/, 13];
                case 12:
                    if (e_1) throw e_1.error;
                    return [7 /*endfinally*/];
                case 13: return [7 /*endfinally*/];
                case 14: return [4 /*yield*/, Promise.all(tasks)];
                case 15:
                    _g.sent();
                    return [3 /*break*/, 19];
                case 16:
                    error_1 = _g.sent();
                    console.error('连接 MongoDB 或处理记录时出错：', error_1);
                    return [3 /*break*/, 19];
                case 17: return [4 /*yield*/, client.close()];
                case 18:
                    _g.sent();
                    console.log('MongoDB 连接已关闭');
                    return [7 /*endfinally*/];
                case 19: return [2 /*return*/];
            }
        });
    });
}
///////////
var embedA1 = {
    mongoUri: 'mongodb://localhost:27017/',
    dbName: 'QuizBank',
    collectionName: 'a1',
    fields: ['question', 'options', 'analysis', 'answer', 'class', 'unit'],
    embeddingConfig: {
        apiKey: 'sk-qEWCkRNZDHKcTf1vCc9846Cf7693404dAc99C5F6F6B178Cd',
        baseURL: 'https://api.gptapi.us/v1',
        model: "text-embedding-3-small"
    }
};
embedDocumentsInCollection(embedA1);
