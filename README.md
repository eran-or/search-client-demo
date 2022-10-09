# Giphy client example
[Demo](https://eran-or.github.io/search-client-demo/) 

This demo was built on top of:
- React v18.2 
- React router v6.4.1
- Tailwind css
- Dexie.js 
It was created with:
` npx create-react-app my-app --template redux-typescript `

It's include redux though it's not using it and all the data passed between the routes is handled with react router loaders of the version 6.4.1

It also manage the searches through dexie, and pull the data from json file to provide offline experience.