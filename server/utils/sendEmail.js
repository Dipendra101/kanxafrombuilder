import { fork } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

// Helper to get the correct path in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const sendEmail = (options) => {
  return new Promise((resolve, reject) => {
    // Fork the email worker script
    const worker = fork(path.join(__dirname, 'emailWorker.js'));

    // Listen for messages from the worker
    worker.on('message', (message) => {
      if (message.success) {
        resolve();
      } else {
        reject(new Error(message.error));
      }
    });

    // Handle errors in the worker process itself
    worker.on('error', (err) => {
      reject(err);
    });

    // Handle the worker exiting unexpectedly
    worker.on('exit', (code) => {
      if (code !== 0) {
        reject(new Error(`Email worker stopped with exit code ${code}`));
      }
    });

    // Send the email options to the worker to start the process
    worker.send(options);
  });
};

export default sendEmail;