import Server from './app';
import { checkEnvVariables } from '@hireverse/service-common/dist/utils/envChecker';

(async () => {
    checkEnvVariables('DATABASE_URL');
    const server = new Server();
    const port = process.env.PORT || '5001';
    server.start(port);
})();