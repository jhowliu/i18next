const path = require('path')
const i18next = require('i18next')
const syncBackend = require('i18next-node-fs-backend')

/** Class representing a Translator */
class I18nTranslator {
    /**
     * Create translator
     */
    constructor() {
        this.options = {
            fallbackLng: 'zh-CN',
            defaultNS: 'zh-CN',
            ns: ['zh-CN', 'zh-TW'],
            load: 'languageOnly',
            backend: {
                loadPath: path.resolve(__dirname, './locales/{{ns}}.json'),
                jsonIndent: 2
            },
            nonExplicitWhitelist: true,
            whitelist: ['en', 'zh']
        }
    }

    /**
     * Should call this method first time when you new this class
     */
    async init() {
        this.trans = await this.initI18next()
    }

    /**
     * Initalize i18next  (Async Function)
     */
    initI18next() {
        return new Promise((resolve, reject) => {
            i18next
                .use(syncBackend)
                .init(this.options, (err, t) => {
                    // Logging here
                    if (err) reject('Something went wrong')
                    resolve(t)
                })
        })
    }

    /**
     * Translate the code message for given ns and code
     * @param {number} code
     * @param {string} ns
     * @param {object} payload
     */
    translate(code, ns, payload={}) {
        return this.trans(`${ns}:log._${code}`, payload)
    }
}

async function main() {
    const translator = new I18nTranslator()
    await translator.init()

    console.log(translator.translate(1, 'zh-TW'))
    console.log(translator.translate(1, 'zh-CN'))

    console.log(translator.translate(2, 'zh-TW', {name: '孫中山'}))
    console.log(translator.translate(2, 'zh-CN', {name: '习近平'}))
}

main()