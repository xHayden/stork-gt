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
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
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
exports.__esModule = true;
exports.POST = void 0;
var types_1 = require("@/app/types");
var mongodb_1 = require("../../../../lib/mongodb");
var server_1 = require("next/server");
var errors_1 = require("@/app/types/errors");
var createStork = function (route, stork) { return __awaiter(void 0, void 0, void 0, function () {
    var dbClient, db, collection, filter, update, options, doc, e_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, mongodb_1["default"]];
            case 1:
                dbClient = _a.sent();
                db = dbClient.db('stork-gt');
                collection = db.collection('storks');
                filter = { atId: stork.atId };
                update = {
                    $setOnInsert: stork
                };
                options = { upsert: true, returnNewDocument: true };
                _a.label = 2;
            case 2:
                _a.trys.push([2, 4, , 5]);
                return [4 /*yield*/, collection.findOneAndUpdate(filter, update, options)];
            case 3:
                doc = _a.sent();
                return [2 /*return*/, doc];
            case 4:
                e_1 = _a.sent();
                throw new errors_1.FailedToCreateError(route, types_1.DBStork);
            case 5: return [2 /*return*/];
        }
    });
}); };
function POST(req) {
    return __awaiter(this, void 0, void 0, function () {
        var route, data, missing, res, e_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    route = "api/storks/create";
                    if (!req.body) {
                        throw new errors_1.MissingRequestBodyError(route);
                    }
                    return [4 /*yield*/, req.json()];
                case 1:
                    data = _a.sent();
                    missing = [];
                    if (!data.name) {
                        missing.push("name");
                    }
                    if (!data.atId) {
                        missing.push("atId");
                    }
                    if (!data.atContentURL) {
                        missing.push("atContentURL");
                    }
                    if (!data.alive) {
                        missing.push("alive");
                    }
                    if (!data.lastLocation) {
                        data.push("lastLocation");
                    }
                    if (!data.locations) {
                        data.push("locations");
                    }
                    if (!data.trackType) {
                        data.push("trackType");
                    }
                    if (missing.length > 0) {
                        throw new errors_1.MissingRequestParametersError(route, missing);
                    }
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, 4, , 5]);
                    return [4 /*yield*/, createStork(route, new types_1.Stork({
                            name: data.name,
                            atId: data.atId,
                            atContentURL: data.atContentURL,
                            alive: data.alive,
                            lastLocation: data.lastLocation,
                            locations: data.locations,
                            trackType: data.trackType
                        }))];
                case 3:
                    res = _a.sent();
                    return [3 /*break*/, 5];
                case 4:
                    e_2 = _a.sent();
                    return [2 /*return*/, server_1.NextResponse.json({ error: e_2.message }, { status: 400 })];
                case 5: return [2 /*return*/, server_1.NextResponse.json(res)];
            }
        });
    });
}
exports.POST = POST;
