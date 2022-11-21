require('dotenv').config({ path: '../.env' });

module.exports = {
    launch: {
        devtools: false,
        headless: !process.env.HEADLESS ? false : process.env.HEADLESS === '1',
        ignoreHTTPSErrors: true,
        defaultViewport: {
            width: 1920,
            height: 1080
        },
        args: [
            '--ignore-certificate-errors',
            '--disable-web-security',
            '--use-gl=swiftshader'
        ]
    },
}
