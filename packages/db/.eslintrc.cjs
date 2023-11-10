module.exports = {
    extends: ['@pedaki/eslint-config'],
    parserOptions: {
        project: true,
    },
    rules: {
        "node/no-unpublished-import": "off",
        "node/no-extraneous-import": "off",
        "node/file-extension-in-import": "off",
    }
};