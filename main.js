import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'path';
import { fileURLToPath } from 'url';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let mainWindow;

async function getActiveWindowTitle() {
  try {
    if (process.platform === 'win32') {
      // PowerShell command to get the foreground window title
      const command = 'powershell -command "(Get-Process | Where-Object { $_.MainWindowHandle -eq (Add-Type \u0027[DllImport(\"user32.dll\")] public static extern IntPtr GetForegroundWindow();\u0027 -Name \"Win32GetForegroundWindow\" -PassThru)::GetForegroundWindow() }).MainWindowTitle"';
      const { stdout } = await execAsync(command);
      return stdout.trim();
    } else if (process.platform === 'darwin') {
      // AppleScript for macOS
      const command = 'osascript -e "tell application \"System Events\" to get name of first process whose frontmost is true"';
      const { stdout } = await execAsync(command);
      return stdout.trim();
    } else {
      return 'Generic Desktop App (Linux/Other)';
    }
  } catch (error) {
    console.error('Error capturing window title:', error);
    return 'Unknown Application';
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

  const isDev = process.env.NODE_ENV === 'development';
  if (isDev) {
    mainWindow.loadURL('http://localhost:3000');
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(path.join(__dirname, 'dist/index.html'));
  }

  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
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

// IPC Handlers
ipcMain.handle('get-active-window', async () => {
  return await getActiveWindowTitle();
});
