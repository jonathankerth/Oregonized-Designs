import '@shopify/shopify-app-remix/adapters/node'
import {
  AppDistribution,
  DeliveryMethod,
  shopifyApp,
  LATEST_API_VERSION,
} from '@shopify/shopify-app-remix'
import { PrismaSessionStorage } from '@shopify/shopify-app-session-storage-prisma'
import { restResources } from '@shopify/shopify-api/rest/admin/2023-07'
import express from 'express'
import fetch from 'node-fetch'
import cors from 'cors'
import prisma from './db.server'

const GRAPHQL_ENDPOINT =
  'https://oregonizeddesignco.myshopify.com/api/2023-07/graphql.json'
const STOREFRONT_ACCESS_TOKEN = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN

const shopify = shopifyApp({
  apiKey: process.env.SHOPIFY_API_KEY,
  apiSecretKey: process.env.SHOPIFY_API_SECRET || '',
  apiVersion: LATEST_API_VERSION,
  scopes: process.env.SCOPES?.split(','),
  appUrl: process.env.SHOPIFY_APP_URL || '',
  authPathPrefix: '/auth',
  sessionStorage: new PrismaSessionStorage(prisma),
  distribution: AppDistribution.AppStore,
  restResources,
  webhooks: {
    APP_UNINSTALLED: {
      deliveryMethod: DeliveryMethod.Http,
      callbackUrl: '/api',
    },
  },
  hooks: {
    afterAuth: async ({ session }) => {
      shopify.registerWebhooks({ session })
    },
  },
  ...(process.env.SHOP_CUSTOM_DOMAIN
    ? { customShopDomains: [process.env.SHOP_CUSTOM_DOMAIN] }
    : {}),
})

const app = express()
const PORT = 3001

app.use(cors()) // Use CORS middleware to handle headers
app.use(express.json()) // for parsing application/json

app.post('/shopify', async (req, res) => {
  try {
    const response = await fetch(GRAPHQL_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': STOREFRONT_ACCESS_TOKEN,
      },
      body: JSON.stringify(req.body),
    })
    const data = await response.json()
    res.json(data)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`)
})

export default shopify
export const apiVersion = LATEST_API_VERSION
export const addDocumentResponseHeaders = shopify.addDocumentResponseHeaders
export const authenticate = shopify.authenticate
export const login = shopify.login
export const registerWebhooks = shopify.registerWebhooks
export const sessionStorage = shopify.sessionStorage
