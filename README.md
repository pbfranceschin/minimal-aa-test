# Error
`entity stake/unstake delay too low`

# Steps for reproduction
- clone repo
- create `.env.local` at root dir, ant enter a value for `NEXT_PUBLIC_SEPOLIA_ALCHEMY_API_KEY`
> `yarn install`
> `yarn dev`
- open `localhost:3000`, social login, fund account and try making a transfer.