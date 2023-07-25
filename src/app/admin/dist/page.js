'use client';
"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
var react_1 = require("react");
var react_hot_toast_1 = require("react-hot-toast");
var google_1 = require("next/font/google");
var roboto = google_1.Roboto({ weight: "400", subsets: ["latin"] });
var rubik = google_1.Rubik_Mono_One({ weight: "400", subsets: ["latin"] });
var APIForm = function (_a) {
    var requestUrl = _a.requestUrl, requestMethod = _a.requestMethod, fields = _a.fields, buttonText = _a.buttonText;
    var _b = react_1.useState(""), response = _b[0], setResponse = _b[1];
    var _c = react_1.useState({}), formData = _c[0], setFormData = _c[1];
    react_1.useEffect(function () {
        setFormData(fields === null || fields === void 0 ? void 0 : fields.reduce(function (acc, field) {
            var _a;
            return (__assign(__assign({}, acc), (_a = {}, _a[field.name] = "", _a)));
        }, {}));
    }, [fields]);
    var handleChange = function (e, field) {
        var _a;
        setFormData(__assign(__assign({}, formData), (_a = {}, _a[field.name] = e.target.value, _a)));
    };
    var handleRequest = function () { return __awaiter(void 0, void 0, void 0, function () {
        var newRequestURL, regex, match, _loop_1, request, response, data;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    newRequestURL = requestUrl;
                    if (fields && newRequestURL.includes("{")) {
                        regex = /\{(\w+)\}/g;
                        match = void 0;
                        _loop_1 = function () {
                            // Replace the found variable with the value from the fields object
                            var variable = match[1];
                            var fieldObject = fields.find(function (field) { return field.name === variable; });
                            if (fieldObject && formData.hasOwnProperty(variable)) {
                                newRequestURL = newRequestURL.replace("{" + variable + "}", formData[variable]);
                            }
                        };
                        // Find each instance of a variable in the URL
                        while (match = regex.exec(requestUrl)) {
                            _loop_1();
                        }
                    }
                    if (fields) {
                        if (Object.values(formData).some(function (value) { return value === ""; })) {
                            react_hot_toast_1.toast.error("All fields are required");
                            return [2 /*return*/];
                        }
                    }
                    if (requestMethod == "GET") {
                        request = fetch(newRequestURL, {
                            method: requestMethod,
                            headers: {
                                'Content-Type': 'application/json'
                            }
                        });
                    }
                    else {
                        request = fetch(newRequestURL, {
                            method: requestMethod,
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify(formData)
                        });
                    }
                    return [4 /*yield*/, request];
                case 1:
                    response = _a.sent();
                    return [4 /*yield*/, response.text()];
                case 2:
                    data = _a.sent();
                    setResponse(data);
                    if (response.ok) {
                        react_hot_toast_1.toast.success("Request successfully completed!");
                    }
                    else {
                        react_hot_toast_1.toast.error("Request failed: " + data);
                    }
                    return [2 /*return*/];
            }
        });
    }); };
    return (React.createElement("div", { className: "flex flex-col gap-2 bg-white p-4 border-b-8 border-teal-500" },
        React.createElement("div", { className: 'flex flex-col gap-2' }, fields === null || fields === void 0 ? void 0 : fields.map(function (field) { return (React.createElement("div", { key: field.name },
            React.createElement("input", { type: field.type, value: formData[field.name], onChange: function (e) { return handleChange(e, field); }, placeholder: field.placeholder, className: "px-1 py-2 w-full border-b-4 border-teal-500 border-2 text-black" }))); })),
        React.createElement("button", { onClick: handleRequest, className: "bg-teal-500 text-white" }, buttonText),
        React.createElement("div", { className: 'border-white' }, response ? React.createElement("div", null,
            React.createElement("textarea", { className: "w-full text-black p-0 m-0", key: response }, response)) : React.createElement(React.Fragment, null))));
};
var AdminSectionFrame = function (props) {
    return React.createElement("div", { className: "flex gap-2 flex-col" },
        React.createElement("h1", { className: "text-4xl bg-white w-max text-black px-4 py-2 " + rubik.className }, props.title),
        React.createElement("div", { className: 'grid grid-cols-3 gap-8' }, props.children));
};
function Admin() {
    return (React.createElement("main", null,
        React.createElement("div", null,
            React.createElement(react_hot_toast_1.Toaster, null)),
        React.createElement("div", { className: "flex gap-4 flex-col" },
            React.createElement(AdminSectionFrame, { title: "Storks" },
                React.createElement(APIForm, { requestUrl: '/api/storks/alive', requestMethod: 'GET', buttonText: 'Get Alive Storks' }),
                React.createElement(APIForm, { requestUrl: '/api/storks/dead', requestMethod: 'GET', buttonText: 'Get Dead Storks' }),
                React.createElement(APIForm, { requestUrl: '/api/storks/id/{storkId}', requestMethod: 'GET', buttonText: 'Get Stork By Id', fields: [
                        { name: 'storkId', type: 'text', placeholder: 'Stork Id' }
                    ] }),
                React.createElement(APIForm, { requestUrl: '/api/storks/name/{storkName}', requestMethod: 'GET', buttonText: 'Get Stork By Name', fields: [
                        { name: 'storkName', type: 'text', placeholder: 'Stork Name' }
                    ] })),
            React.createElement(AdminSectionFrame, { title: "Teams" },
                React.createElement(APIForm, { requestUrl: '/api/teams/create', requestMethod: 'POST', buttonText: 'Create New Team', fields: [
                        { name: 'name', type: 'text', placeholder: 'Team Name' },
                        { name: 'captain', type: 'text', placeholder: 'Captain ID' }
                    ] })))));
}
exports["default"] = Admin;
