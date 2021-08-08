module.exports = (api) => {
    api.cache(true)

    return {
        presets: [
            ['@babel/preset-env', { "modules": 'auto' } ]
        ],
        plugins: ["@babel/plugin-transform-runtime"]
    }
}
