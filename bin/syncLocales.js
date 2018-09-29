const { syncLanguages } = require('sync-multilanguage-json')

syncLanguages(`${__dirname}/../locales`, 'en').then(() => {
	console.info('Done')
}).catch((err) => {
	console.error(err)
})
