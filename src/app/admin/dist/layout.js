"use strict";
exports.__esModule = true;
exports.metadata = void 0;
require("./admin.css");
var NavBar_1 = require("../components/NavBar");
var google_1 = require("next/font/google");
var angkor = google_1.Roboto({ weight: "400", subsets: ["latin"] });
exports.metadata = {
    title: 'Stork Race @ GT',
    description: 'The only Fantasy League where teams bet on which storks will migrate the fastest'
};
function RootLayout(_a) {
    var children = _a.children;
    return (React.createElement("div", null,
        React.createElement("div", { className: "flex w-full justify-end md:justify-normal" },
            React.createElement(NavBar_1["default"], { admin: true })),
        React.createElement("div", { className: "" + angkor.className }, children)));
}
exports["default"] = RootLayout;
