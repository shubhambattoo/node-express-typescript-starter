/* eslint-disable no-console */
import * as dotenv from 'dotenv';
dotenv.config();
import app from './app';

process.on('uncaughtException', (err: Error) => {
  console.log('Unhandler Exception! Shutting Down...');
  console.log(err.name, err.message);
  process.exit(1);
});

const PORT = (process.env.PORT as string) || 3000;
app.listen(PORT, () => {
  console.log(`server started on ${PORT}`);
});
