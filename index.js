/**
 * @param {import('probot').Application} app - Probot's Application class.
 * See: https://probot.github.io/docs/development/
 */

// Todo: Copy this
// https://github.com/financial-times-sandbox/manage-github-apps/commit/00e53a777c7cdbef0c574c601e402716f1c73a4e
 const isValid = context => {
	if (!context.payload) {
		return false;
	}
	if (!context.payload.action || context.payload.action !=='added') {
		return false;
	}
	if (!context.payload.installation) {
		return false;
	}
	if ( !context.payload.installation.id || context.payload.installation.id !== 387114) {
		return false;
	}
	if (!context.payload.repositories_added || !Array.isArray(context.payload.repositories_added) || !context.payload.repositories_added.length > 0) {
		return false;
	}
	return true;
}

module.exports = app => {
	app.on('installation_repositories', async context => {
		if (isValid(context)) {
			return Promise.all(context.payload.repositories_added.map(repository => {
				const [owner, repo] = repository.full_name.split('/');
				const payload = {
					owner: owner,
					repo: repo,
					title: 'Settoappu was installed.',
					body: 'This is a new issue.'
				}
				console.log('Creating issue:',payload)
				return context.github.issues.create(payload)
			}))
		}
	})
}
