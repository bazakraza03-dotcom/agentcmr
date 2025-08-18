const { app, BrowserWindow, Menu, shell, dialog, ipcMain } = require("electron")
const path = require("path")
const os = require("os")
const fs = require("fs")

let mainWindow
let loginWindow
let isAuthenticated = false
const ADMIN_PASSWORD = "admin123"

function getSystemInfo() {
  const totalMemGB = Math.round(os.totalmem() / (1024 * 1024 * 1024))
  const freeMemGB = Math.round(os.freemem() / (1024 * 1024 * 1024))

  return {
    platform: os.platform(),
    arch: os.arch(),
    hostname: os.hostname(),
    user: os.userInfo().username,
    localIP: getLocalIPAddress(),
    totalMemory: `${totalMemGB}GB`,
    freeMemory: `${freeMemGB}GB`,
    cpus: os.cpus().length,
  }
}

function getLocalIPAddress() {
  const interfaces = os.networkInterfaces()
  const priorityInterfaces = ["Ethernet", "Wi-Fi", "WiFi", "wlan0", "eth0"]

  for (const interfaceName of priorityInterfaces) {
    if (interfaces[interfaceName]) {
      for (const connection of interfaces[interfaceName]) {
        if (connection.family === "IPv4" && !connection.internal) {
          return connection.address
        }
      }
    }
  }

  // Fallback to any available IPv4 address
  for (const interfaceName in interfaces) {
    for (const connection of interfaces[interfaceName]) {
      if (connection.family === "IPv4" && !connection.internal) {
        return connection.address
      }
    }
  }

  return "127.0.0.1"
}

function createLoginWindow() {
  loginWindow = new BrowserWindow({
    width: 450,
    height: 600,
    resizable: false,
    frame: true,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
    show: false,
  })

  const loginPath = path.join(__dirname, "../renderer/login.html")

  if (fs.existsSync(loginPath)) {
    loginWindow.loadFile(loginPath)
  } else {
    loginWindow.loadURL(createFallbackHTML())
  }

  loginWindow.once("ready-to-show", () => {
    loginWindow.show()
  })

  loginWindow.on("closed", () => {
    loginWindow = null
    if (!isAuthenticated) {
      app.quit()
    }
  })
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1200,
    minHeight: 800,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      webSecurity: false,
    },
    show: false,
  })

  const rendererPath = path.join(__dirname, "../renderer/index.html")

  if (fs.existsSync(rendererPath)) {
    mainWindow.loadFile(rendererPath)
  } else {
    mainWindow.loadURL(createFallbackHTML())
  }

  mainWindow.once("ready-to-show", () => {
    mainWindow.show()

    const systemInfo = getSystemInfo()
    dialog.showMessageBox(mainWindow, {
      type: "info",
      title: "AgentCMR Desktop",
      message: "Aplikacja uruchomiona pomyślnie!",
      detail: `💻 ${systemInfo.hostname}\n👤 ${systemInfo.user}\n🌐 ${systemInfo.localIP}\n💾 ${systemInfo.totalMemory}\n\n🚀 Pure Desktop Mode\n⚡ No web server required`,
      buttons: ["OK"],
    })
  })

  ipcMain.handle("get-system-info", () => getSystemInfo())

  ipcMain.handle("authenticate", async (event, credentials) => {
    const { mode, password } = credentials

    if (password === ADMIN_PASSWORD) {
      isAuthenticated = true

      if (loginWindow) {
        loginWindow.close()
        loginWindow = null
      }

      return { success: true }
    } else {
      return { success: false, error: "Nieprawidłowe hasło" }
    }
  })

  const template = [
    {
      label: "AgentCMR",
      submenu: [
        {
          label: "O aplikacji",
          click: () => {
            const systemInfo = getSystemInfo()
            dialog.showMessageBox(mainWindow, {
              type: "info",
              title: "AgentCMR Desktop v1.0",
              message: "System Zarządzania dla Agentów Ubezpieczeniowych",
              detail: `💻 ${systemInfo.hostname}\n👤 ${systemInfo.user}\n🌐 ${systemInfo.localIP}\n💾 ${systemInfo.totalMemory}\n\n🏢 Zarządzanie klientami\n🚗 Rejestr pojazdów\n📋 Administracja polis\n💰 Płatności i rozliczenia`,
              buttons: ["Zamknij"],
            })
          },
        },
        { type: "separator" },
        {
          label: "Przeładuj",
          accelerator: "CmdOrCtrl+R",
          click: () => mainWindow.reload(),
        },
        {
          label: "Zakończ",
          accelerator: "CmdOrCtrl+Q",
          click: () => app.quit(),
        },
      ],
    },
    {
      label: "Widok",
      submenu: [
        {
          label: "Powiększ",
          accelerator: "CmdOrCtrl+Plus",
          click: () => {
            const currentZoom = mainWindow.webContents.getZoomLevel()
            mainWindow.webContents.setZoomLevel(currentZoom + 0.5)
          },
        },
        {
          label: "Pomniejsz",
          accelerator: "CmdOrCtrl+-",
          click: () => {
            const currentZoom = mainWindow.webContents.getZoomLevel()
            mainWindow.webContents.setZoomLevel(currentZoom - 0.5)
          },
        },
        {
          label: "Resetuj powiększenie",
          accelerator: "CmdOrCtrl+0",
          click: () => mainWindow.webContents.setZoomLevel(0),
        },
        { type: "separator" },
        {
          label: "Pełny ekran",
          accelerator: "F11",
          click: () => mainWindow.setFullScreen(!mainWindow.isFullScreen()),
        },
      ],
    },
  ]

  const menu = Menu.buildFromTemplate(template)
  Menu.setApplicationMenu(menu)
}

function createFallbackHTML() {
  const fallbackHTML = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>AgentCMR - Setup Required</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 0; padding: 40px; background: linear-gradient(135deg, #2563eb, #7c3aed); color: white; min-height: 100vh; display: flex; align-items: center; justify-content: center; }
        .container { text-align: center; background: rgba(255,255,255,0.1); padding: 40px; border-radius: 20px; backdrop-filter: blur(10px); }
        h1 { font-size: 3em; margin-bottom: 20px; }
        .step { background: rgba(255,255,255,0.1); padding: 15px; margin: 10px 0; border-radius: 10px; }
        code { background: rgba(0,0,0,0.3); padding: 5px 10px; border-radius: 5px; color: #FFD700; }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>🚀 AgentCMR Desktop</h1>
        <p>Aplikacja wymaga zbudowania</p>
        <div class="step"><strong>1.</strong> <code>npm install</code></div>
        <div class="step"><strong>2.</strong> <code>npm run build</code></div>
        <div class="step"><strong>3.</strong> <code>npm start</code></div>
        <p>✅ Brak wymagań sieciowych<br>⚡ Czysta aplikacja desktopowa</p>
      </div>
    </body>
    </html>
  `

  const tempPath = path.join(os.tmpdir(), "agentcmr-setup.html")
  fs.writeFileSync(tempPath, fallbackHTML)
  return `file://${tempPath}`
}

app.whenReady().then(() => {
  createLoginWindow()

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createLoginWindow()
    }
  })
})

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit()
  }
})

ipcMain.on("login-success", (event, mode) => {
  isAuthenticated = true
  createWindow()
})
