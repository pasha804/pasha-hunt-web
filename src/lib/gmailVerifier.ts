import tls from 'tls';

export function verifyGmailCredentials(emailAddr: string, appPassword: string): Promise<{ ok: boolean; message: string }> {
  return new Promise((resolve) => {
    const cleanEmail = emailAddr.trim();
    const cleanPass = appPassword.replace(/\s+/g, '').trim();

    if (!cleanEmail || !cleanPass) {
      return resolve({ ok: false, message: "Email and 16-character App Password are required." });
    }

    if (cleanPass.length < 16) {
      return resolve({ ok: false, message: "Invalid App Password length. Google App Passwords must be 16 letters." });
    }

    let socket: tls.TLSSocket | null = null;
    let step = 0;
    let resolved = false;

    const timeout = setTimeout(() => {
      if (!resolved) {
        resolved = true;
        if (socket) socket.destroy();
        resolve({ ok: false, message: "SMTP Handshake Timeout. Please verify your internet connection." });
      }
    }, 8000);

    try {
      socket = tls.connect({
        host: 'smtp.gmail.com',
        port: 465,
        rejectUnauthorized: false
      }, () => {
        // Connected
      });

      socket.on('data', (data) => {
        const msg = data.toString();
        if (resolved) return;

        if (step === 0 && msg.startsWith('220')) {
          step = 1;
          socket?.write('EHLO localhost\r\n');
        } else if (step === 1 && msg.includes('250')) {
          step = 2;
          socket?.write('AUTH LOGIN\r\n');
        } else if (step === 2 && msg.startsWith('334')) {
          step = 3;
          socket?.write(Buffer.from(cleanEmail).toString('base64') + '\r\n');
        } else if (step === 3 && msg.startsWith('334')) {
          step = 4;
          socket?.write(Buffer.from(cleanPass).toString('base64') + '\r\n');
        } else if (step === 4) {
          resolved = true;
          clearTimeout(timeout);
          socket?.write('QUIT\r\n');
          socket?.destroy();

          if (msg.startsWith('235')) {
            resolve({ ok: true, message: "✓ Successfully authenticated with Gmail SMTP!" });
          } else {
            resolve({ ok: false, message: "Authentication Failed: Please ensure you are using a 16-character Google App Password (not your normal Gmail password)." });
          }
        }
      });

      socket.on('error', (err) => {
        if (!resolved) {
          resolved = true;
          clearTimeout(timeout);
          resolve({ ok: false, message: `SMTP connection error: ${err.message}` });
        }
      });
    } catch (e: any) {
      if (!resolved) {
        resolved = true;
        clearTimeout(timeout);
        resolve({ ok: false, message: `Error: ${e.message}` });
      }
    }
  });
}
