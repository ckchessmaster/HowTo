targetScope = 'subscription'

resource rg 'Microsoft.Resources/resourceGroups@2021-01-01' = {
  name: 'rg-bicep101-ckingdon'
  location: 'eastus2'
  tags: {
    aCoolTag: 'CoolTagValue'
  }
}

module storage 'storageaccount.bicep' = {
  name: 'storageaccount'
  scope: resourceGroup(rg.name)
  params: {
    projectName: 'bicep101'
  }
}

var outputExample = storage.outputs.key


