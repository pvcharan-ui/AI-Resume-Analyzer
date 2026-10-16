import { spawn } from 'node:child_process';

const isWin = process.platform === 'win32';
const npmCmd = isWin ? 'npm.cmd' : 'npm';

console.log('[dev:full] Launching backend server and frontend client concurrently...');

const serverProcess = spawn(npmCmd, ['run', 'server'], { stdio: 'inherit' });
const clientProcess = spawn(npmCmd, ['run', 'dev'], { stdio: 'inherit' });

const shutdown = () => {
  serverProcess.kill();
  clientProcess.kill();
  process.exit();
};

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
