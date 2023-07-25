"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
exports.ObjectNotFoundError = exports.FailedToUpdateError = exports.AlreadyExistsError = exports.FailedToCreateError = exports.MissingRequestBodyError = exports.MissingRequestParametersError = exports.APIRequestError = void 0;
var APIRequestError = /** @class */ (function (_super) {
    __extends(APIRequestError, _super);
    function APIRequestError(route, message) {
        var _this = _super.call(this, message) || this;
        _this.route = route;
        return _this;
    }
    return APIRequestError;
}(Error));
exports.APIRequestError = APIRequestError;
var MissingRequestParametersError = /** @class */ (function (_super) {
    __extends(MissingRequestParametersError, _super);
    function MissingRequestParametersError(route, missingArgs) {
        var _this = _super.call(this, route, JSON.stringify(missingArgs)) || this;
        _this.missingArgs = missingArgs;
        return _this;
    }
    return MissingRequestParametersError;
}(APIRequestError));
exports.MissingRequestParametersError = MissingRequestParametersError;
var MissingRequestBodyError = /** @class */ (function (_super) {
    __extends(MissingRequestBodyError, _super);
    function MissingRequestBodyError(route) {
        return _super.call(this, route, "Missing body in request.") || this;
    }
    return MissingRequestBodyError;
}(APIRequestError));
exports.MissingRequestBodyError = MissingRequestBodyError;
var FailedToCreateError = /** @class */ (function (_super) {
    __extends(FailedToCreateError, _super);
    function FailedToCreateError(route, type) {
        var _this = this;
        if (!(type === null || type === void 0 ? void 0 : type.typeName)) {
            throw new Error("Illegal error creation, missing typeName.");
        }
        _this = _super.call(this, route, "Failed to create: " + typeof (type)) || this;
        return _this;
    }
    return FailedToCreateError;
}(APIRequestError));
exports.FailedToCreateError = FailedToCreateError;
var AlreadyExistsError = /** @class */ (function (_super) {
    __extends(AlreadyExistsError, _super);
    function AlreadyExistsError(route, type) {
        var _this = this;
        if (!(type === null || type === void 0 ? void 0 : type.typeName)) {
            throw new Error("Illegal error creation, missing typeName.");
        }
        _this = _super.call(this, route, "Failed to create: " + typeof (type) + " already exists") || this;
        return _this;
    }
    return AlreadyExistsError;
}(APIRequestError));
exports.AlreadyExistsError = AlreadyExistsError;
var FailedToUpdateError = /** @class */ (function (_super) {
    __extends(FailedToUpdateError, _super);
    function FailedToUpdateError(route, type) {
        var _this = this;
        if (!(type === null || type === void 0 ? void 0 : type.typeName)) {
            throw new Error("Illegal error creation, missing typeName.");
        }
        _this = _super.call(this, route, "Failed to update: " + type.typeName) || this;
        return _this;
    }
    return FailedToUpdateError;
}(APIRequestError));
exports.FailedToUpdateError = FailedToUpdateError;
var ObjectNotFoundError = /** @class */ (function (_super) {
    __extends(ObjectNotFoundError, _super);
    function ObjectNotFoundError(route, type) {
        var _this = this;
        if (!(type === null || type === void 0 ? void 0 : type.typeName)) {
            throw new Error("Illegal error creation, missing typeName.");
        }
        _this = _super.call(this, route, "Failed to find existing: " + type.typeName) || this;
        return _this;
    }
    return ObjectNotFoundError;
}(APIRequestError));
exports.ObjectNotFoundError = ObjectNotFoundError;
