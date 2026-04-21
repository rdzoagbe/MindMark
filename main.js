import { app, BrowserWindow, ipcMain, shell } from 'electron';
import path from 'path';
import { fileURLToPath } from 'url';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const isDev = process.env.NODE_ENV === 'development';

let mainWindow;

async function getActiveWindowTitle() {
  try {
    const activeWindow = (await import('active-win')).default;
    const windowInfo = await activeWindow();
    if (windowInfo && windowInfo.title) {
      return windowInfo.title;
    }
    return 'Unknown Application';
  } catch (err) {
    console.warn('active-win failed, falling back:', err);
    try {
      const command = process.platform === 'win32'
        ? 'powershell -command "(Get-Process | Where-Object { $_.MainWindowHandle -eq (Add-Type \'[DllImport(\"user32.dll\")] public static extern IntPtr GetForegroundWindow();\' -Name \"Win32GetForegroundWindow\" -PassThru)::GetForegroundWindow() }).MainWindowTitle"'
        : 'osascript -e "tell application \\"System Events\\" to get name of first process whose frontmost is true"';
      const { stdout } = await execAsync(command);
      return stdout.trim() || 'Unknown Application';
    } catch (error) {
      return 'Unknown Application';
    }
  }
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
    titleBarStyle: 'hiddenInset',
    show: false,
  });

  if (isDev) {
    mainWindow.loadURL('http://localhost:3000');
  } else {
    mainWindow.loadFile(path.join(__dirname, 'dist/index.html'));
  }

  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith('https://accounts.google.com')) {
      shell.openExternal(url);
      return { action: 'deny' };
    }
    return { action: 'allow' };
  });

  mainWindow.once('ready-to-show', () => mainWindow.show());
  mainWindow.on('closed', () => { mainWindow = null; });
}

app.whenReady().then(() => {
  createWindow();
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

ipcMain.handle('get-active-window', async () => {
  return await getActiveWindowTitle();
});
