import { createPublicClient, http } from 'viem'
import { polygonMumbai } from 'viem/chains'

const client = createPublicClient({ 
    chain: polygonMumbai,
    transport: http()
});

export default client;
