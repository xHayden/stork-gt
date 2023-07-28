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
exports.TrackType = exports.DBStork = exports.Stork = exports.DBTeam = exports.Team = exports.Item = exports.DBUser = exports.User = exports.DatabaseObject = void 0;
var DatabaseObject = /** @class */ (function () {
    function DatabaseObject(typeName) {
        this.typeName = typeName;
    }
    return DatabaseObject;
}());
exports.DatabaseObject = DatabaseObject;
var User = /** @class */ (function (_super) {
    __extends(User, _super);
    function User(user) {
        var _this = _super.call(this, "User") || this;
        Object.assign(_this, user);
        return _this;
    }
    User.prototype.paidDues = function () {
        return (this.dues <= 0);
    };
    return User;
}(DatabaseObject));
exports.User = User;
var DBUser = /** @class */ (function (_super) {
    __extends(DBUser, _super);
    function DBUser(_id, user) {
        var _this = _super.call(this, user) || this;
        _this._id = _id;
        return _this;
    }
    DBUser.typeName = "DBUser";
    return DBUser;
}(User));
exports.DBUser = DBUser;
var Item = /** @class */ (function (_super) {
    __extends(Item, _super);
    function Item(item) {
        var _this = _super.call(this, "Item") || this;
        Object.assign(_this, item);
        return _this;
    }
    return Item;
}(DatabaseObject));
exports.Item = Item;
var Team = /** @class */ (function (_super) {
    __extends(Team, _super);
    function Team(team) {
        var _this = _super.call(this, "Team") || this;
        Object.assign(_this, team);
        return _this;
    }
    return Team;
}(DatabaseObject));
exports.Team = Team;
var DBTeam = /** @class */ (function (_super) {
    __extends(DBTeam, _super);
    function DBTeam(_id, team) {
        var _this = _super.call(this, team) || this;
        _this._id = _id;
        return _this;
    }
    DBTeam.typeName = "DBTeam";
    return DBTeam;
}(Team));
exports.DBTeam = DBTeam;
var Stork = /** @class */ (function (_super) {
    __extends(Stork, _super);
    function Stork(stork) {
        var _this = _super.call(this, "Stork") || this;
        Object.assign(_this, stork);
        return _this;
    }
    return Stork;
}(DatabaseObject));
exports.Stork = Stork;
var DBStork = /** @class */ (function (_super) {
    __extends(DBStork, _super);
    function DBStork(_id, stork) {
        var _this = _super.call(this, stork) || this;
        _this._id = _id;
        return _this;
    }
    DBStork.typeName = "DBStork";
    return DBStork;
}(Stork));
exports.DBStork = DBStork;
var TrackType;
(function (TrackType) {
    TrackType[TrackType["two_weeks"] = 0] = "two_weeks";
    TrackType[TrackType["year"] = 1] = "year";
})(TrackType = exports.TrackType || (exports.TrackType = {}));
