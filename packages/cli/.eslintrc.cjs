module.exports = {
    extends: ['@pedaki/eslint-config'],
    parserOptions: {
        project: true,
    },
    rules: {
        'node/no-unpublished-import': 'off',
        "node/shebang": "off",
        "no-process-exit": "off",
    }
};