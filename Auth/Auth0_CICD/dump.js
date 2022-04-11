require('dotenv').config()

const auth0Cli = require('auth0-deploy-cli')
const config = require('./config/tenantName-dev.json')
const axios = require('axios')

const today = new Date()
var date = `${today.getFullYear()}-${(today.getMonth() + 1)}-${today.getDate()}`
var time = `${today.getHours()}-${today.getMinutes()}-${today.getSeconds()}`
const datetime = `${date}_${time}`

const fs = require('fs')
const templateDirectory = `./dump/${datetime}/universal-login`
if (!fs.existsSync(templateDirectory)) {
    fs.mkdirSync(templateDirectory, { recursive: true })
}

// Retrieve Auth0 Configuration
auth0Cli.dump({
    output_folder: `dump/${datetime}`,
    config: config
})
    .then(() => console.log('Auth0 config dumped successfully!'))
    .catch(err => console.log(`An error occured while attempting to dump Auth0 config: ${err}`))

dumpBranding().then().catch()
async function dumpBranding() {
    const domain = 'tenantName.us.auth0.com'
    const token = await getToken(domain)

    await dumpLoginTemplate(domain, token)
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

async function dumpLoginTemplate(domain, token) {
    console.log('Dumping universal login templates...')
    let options = {
        method: 'GET',
        url: `https://${domain}/api/v2/branding/templates/universal-login`,
        headers: {
            authorization: `Bearer ${token}`
        }
    }

    try {
        let response = await axios.request(options)

        fs.writeFileSync(`${templateDirectory}/login.html`, response.data.body)
        console.log('Universal login temaplates dumped successfully!')

    } catch (e) {
        console.error(e)
    }
}




// async function dumpVerbage(domain, token) {
//     console.log('Dumping universal login verbage...')

//     const verbage = {
//         'login-id': await getVerbage(domain, token, 'login-id'),
//         'login-password': await getVerbage(domain, token, 'login-password'),
//         signup: await getVerbage(domain, token, 'signup')
//     }

//     fs.writeFileSync(`${templateDirectory}/login-text.en.json`, JSON.stringify(verbage))
//     console.log('Universal login verbage dumped successfully!')
// }

// async function getVerbage(domain, token, name) {
//     let text = {}

//     const options = {
//         method: 'GET',
//         url: `https://${domain}/api/v2/prompts/${name}/custom-text/en`,
//         headers: {
//             authorization: `Bearer ${token}`
//         }
//     }

//     try {
//         response = await axios.request(options)
//         text = response.data[name]
//     } catch (e) {
//         console.log(e)
//     } finally {
//         return text
//     }
// }