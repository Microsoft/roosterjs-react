var context = require.context("./packages", true, /test\/.+\.tsx?$/);

context.keys().forEach(function(key) {
    context(key);
});

module.exports = context;
