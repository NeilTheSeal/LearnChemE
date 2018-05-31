const path = require("path");

var immicibleP = {
    entry: "./prb/immicibleP.js",
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

var immicibleT = {
    entry: "./prb/immicibleT.js",
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

var Pxy = {
    entry: "./prb/Pxy.js",
    output: {
        filename: "bundlePxy.js",
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

var Txy = {
    entry: "./prb/Txy.js",
    output: {
        filename: "bundleTxy.js",
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
  immicibleT, immicibleP, Pxy, Txy,
];
