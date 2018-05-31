const path = require("path");

var immicibleT = {
    entry: "./src/immicibleT.js",
    output: {
        filename: "bundleImmicibleT.js",
        path: path.resolve(__dirname, "dist")
    },
    module: {
        rules: [
            { test: /\.js$/,
                exclude: /node_modules/,
                loader: "babel-loader" }
        ]
    },
    mode: "development",
    stats: {
        colors: true
    }
};
var immicibleP = {
    entry: "./src/immicibleP.js",
    output: {
        filename: "bundleImmicibleP.js",
        path: path.resolve(__dirname, "dist")
    },
    module: {
        rules: [
            { test: /\.js$/,
                exclude: /node_modules/,
                loader: "babel-loader" }
        ]
    },
    mode: "development",
    stats: {
        colors: true
    }
};

module.exports = [
  immicibleT, immicibleP
];
