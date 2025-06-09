import cors from 'cors';
import express from 'express';
import { readFile } from 'node:fs/promises'
import { authMiddleware, handleLogin } from './auth.js';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware as apolloMiddleware } from '@apollo/server/express4';
import { resolvers } from './resolvers.js';
import { getUser } from './db/users.js';

const PORT = 9000;

const app = express();
app.use(cors(), express.json(), authMiddleware);

const getContext = async ({req}) => {
  if (req.auth) {
    const user = await getUser(req.auth.sub);
    return {user};
  }
  return {};
}

const typeDefs = await readFile('./schema.graphql', 'utf8');
const apolloServer = new ApolloServer({typeDefs, resolvers});
await apolloServer.start();
app.use('/graphql', apolloMiddleware(apolloServer, {
  context: getContext
}))

app.post('/login', handleLogin);

app.listen({ port: PORT }, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Graphql running on port http://localhost:${PORT}/graphql`);
});
