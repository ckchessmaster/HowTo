<script setup>
import { ref, watch } from 'vue'
import config from '@/config'
import axios from 'axios'
import { useAuth0 } from '@auth0/auth0-vue'

import WelcomeItem from './WelcomeItem.vue'
import DocumentationIcon from './icons/IconDocumentation.vue'
import ToolingIcon from './icons/IconTooling.vue'
import EcosystemIcon from './icons/IconEcosystem.vue'
import CommunityIcon from './icons/IconCommunity.vue'
import SupportIcon from './icons/IconSupport.vue'

const { getAccessTokenSilently, isAuthenticated, user } = useAuth0()

let healthStatus = ref('Pending...')
let secureRouteStatus = ref('Pending...')
let adminOnlyStatus = ref('Pending...')

async function getApiHealth() {
  try {
    const response = await axios.get(`${config.apiBaseUrl}/health`)
    return response.data
  } catch {
    return 'Unhealthy'
  }
}

async function getSecureRouteStatus() {
  let accessToken 
  
  try {
    accessToken = await getAccessTokenSilently()
  } catch {}

  try {
    const response = await axios.get(`${config.apiBaseUrl}/secure-route`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    })
    return response.data
  } catch (e) {
    if (e.response && e.response.status > 300) {
      return e.response.data
    }

    return 'Unhealthy'
  }
}

async function getAdminOnlyStatus() {
  let accessToken 
  
  try {
    accessToken = await getAccessTokenSilently()
  } catch {}

  try {
    const response = await axios.get(`${config.apiBaseUrl}/admin-only`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    })
    return response.data
  } catch (e) {
    if (e.response && e.response.status > 300) {
      return e.response.data
    }

    return 'Unhealthy'
  }
}

async function getStatuses() {
  healthStatus.value = await getApiHealth()

  if (isAuthenticated.value) {
    secureRouteStatus.value = await getSecureRouteStatus()

    const roles = user.value[`${config.customNamespace}/roles`]
    
    if(roles && roles.map(r => r.toLowerCase()).includes('admin')) {
      adminOnlyStatus.value = await getAdminOnlyStatus()
    } else {
      adminOnlyStatus.value = 'Not an admin!'
    }
  } else {
    secureRouteStatus.value = 'Not logged in.'
    adminOnlyStatus.value = 'Not logged in.'
  }
}

watch(() => isAuthenticated, async () => {
  await getStatuses()
}, {
  immediate: true,
  deep: true
})
</script>

<template>
  <WelcomeItem>
    <template #icon>
      <DocumentationIcon />
    </template>
    <template #heading>API Health Status</template>
    The backend API is: {{healthStatus}}
  </WelcomeItem>

  <WelcomeItem>
    <template #icon>
      <ToolingIcon />
    </template>
    <template #heading>Secure Route Status</template>
    Secure route message: {{secureRouteStatus}}
  </WelcomeItem>

  <WelcomeItem>
    <template #icon>
      <EcosystemIcon />
    </template>
    <template #heading>Admin Only Route</template>
    Admin only message: {{adminOnlyStatus}}
  </WelcomeItem>

  <WelcomeItem>
    <template #icon>
      <CommunityIcon />
    </template>
    <template #heading>Community</template>

    Got stuck? Ask your question on
    <a target="_blank" href="https://chat.vuejs.org">Vue Land</a>, our official Discord server, or
    <a target="_blank" href="https://stackoverflow.com/questions/tagged/vue.js">StackOverflow</a>.
    You should also subscribe to
    <a target="_blank" href="https://news.vuejs.org">our mailing list</a> and follow the official
    <a target="_blank" href="https://twitter.com/vuejs">@vuejs</a>
    twitter account for latest news in the Vue world.
  </WelcomeItem>

  <WelcomeItem>
    <template #icon>
      <SupportIcon />
    </template>
    <template #heading>Support Vue</template>

    As an independent project, Vue relies on community backing for its sustainability. You can help
    us by
    <a target="_blank" href="https://vuejs.org/sponsor/">becoming a sponsor</a>.
  </WelcomeItem>
</template>
