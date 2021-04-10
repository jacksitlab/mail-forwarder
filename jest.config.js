const { defaults } = require('jest-config');
module.exports = {
    preset: 'ts-jest',
    globals: {
        'ts-jest': {
            diagnostics: false
        }
    },
    moduleFileExtensions: [...defaults.moduleFileExtensions, 'ts', 'tsx'],
    // ...
};