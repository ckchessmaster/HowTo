require('dotenv').config()

const auth0Cli = require('auth0-deploy-cli')
const config = require('./config/tenantName-dev.json')

auth0Cli.deploy({
    input_file: 'src/tenantName-dev',
    config: config
})
    .then(() => console.log('Auth0 config deployed successfully!'))
    .catch(err => {
        console.error(`An error occured while attempting to update Auth0 config: ${err}`)
        process.exit(1)
    })

const axios = require("axios")
deployBranding().then().catch()

async function deployBranding() {
    const domain = 'tenantName.us.auth0.com'
    const token = await getToken(domain)

    await deployLoginTemplate(domain, token)
}

async function getToken(domain) {
    const options = {
        method: 'POST',
        url: `https://${domain}/oauth/token`,
        headers: {'content-type': 'application/json'},
        data: {
            grant_type: 'client_credentials',
            client_id: process.env.AUTH0_CLIENT_ID,
            client_secret: process.env.AUTH0_CLIENT_SECRET,
            audience: `https://${domain}/api/v2/`
        }
    }

    const response = await axios.request(options)

    return response.data.access_token
}

async function deployLoginTemplate(domain, token) {
    console.log('Updating universal login template...')
    const data = fs.readFileSync('./tenantName-dev/universal-login/login.html', 'utf8')

    const options = {
        method: 'PUT',
        url: `https://${domain}/api/v2/branding/templates/universal-login`,
        headers: {
            authorization: `Bearer ${token}`,
            'content-type': 'text/html'
        },
        data: data
    }

    try {
        await axios.request(options)
        console.log('Universal login update complete!')
    } catch (e) {
        console.error(e)
    }
}