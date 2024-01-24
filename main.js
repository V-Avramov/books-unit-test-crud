try {
    const api = require('./src/api');
    api.mainStart();
} catch(e) {
    console.error(e);
}