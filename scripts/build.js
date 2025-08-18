const fs = require("fs")
const path = require("path")

const rendererDir = path.join(__dirname, "../renderer")
if (!fs.existsSync(rendererDir)) {
  fs.mkdirSync(rendererDir, { recursive: true })
}

const loginHTML = `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>AgentCMR - Logowanie</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 0; padding: 20px; background: #f5f5f5; }
        .login-container { background: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .logo { text-align: center; margin-bottom: 30px; color: #2563eb; font-size: 24px; font-weight: bold; }
        .form-group { margin-bottom: 20px; }
        label { display: block; margin-bottom: 5px; font-weight: bold; }
        select, input { width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 4px; font-size: 14px; }
        button { width: 100%; padding: 12px; background: #2563eb; color: white; border: none; border-radius: 4px; font-size: 16px; cursor: pointer; }
        button:hover { background: #1d4ed8; }
        .error { color: red; margin-top: 10px; }
        .info { background: #e0f2fe; padding: 15px; border-radius: 4px; margin-bottom: 20px; font-size: 12px; }
    </style>
</head>
<body>
    <div class="login-container">
        <div class="logo">🏢 AgentCMR</div>
        <div class="info">
            <strong>Tryby pracy:</strong><br>
            • <strong>Standalone</strong> - praca lokalna bez sieci<br>
            • <strong>Server</strong> - udostępnianie w sieci lokalnej<br>
            • <strong>Client</strong> - połączenie z serwerem
        </div>
        <form id="loginForm">
            <div class="form-group">
                <label>Tryb pracy:</label>
                <select id="mode" required>
                    <option value="standalone">Standalone (lokalny)</option>
                    <option value="server">Server (serwer sieciowy)</option>
                    <option value="client">Client (klient sieciowy)</option>
                </select>
            </div>
            <div class="form-group">
                <label>Hasło:</label>
                <input type="password" id="password" placeholder="Wprowadź hasło" required>
            </div>
            <button type="submit">Zaloguj się</button>
            <div id="error" class="error"></div>
        </form>
    </div>

    <script>
        const { ipcRenderer } = require('electron');
        
        document.getElementById('loginForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            const mode = document.getElementById('mode').value;
            const password = document.getElementById('password').value;
            const errorDiv = document.getElementById('error');
            
            try {
                const result = await ipcRenderer.invoke('authenticate', { mode, password });
                if (result.success) {
                    ipcRenderer.send('login-success', mode);
                } else {
                    errorDiv.textContent = result.error;
                }
            } catch (error) {
                errorDiv.textContent = 'Błąd logowania: ' + error.message;
            }
        });
    </script>
</body>
</html>`

const mainHTML = `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>AgentCMR - System Zarządzania</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 0; padding: 0; background: #f8fafc; }
        .header { background: #2563eb; color: white; padding: 15px 20px; display: flex; justify-content: space-between; align-items: center; }
        .header h1 { margin: 0; font-size: 20px; }
        .system-info { font-size: 12px; opacity: 0.9; }
        .container { padding: 20px; }
        .tabs { display: flex; border-bottom: 2px solid #e5e7eb; margin-bottom: 20px; }
        .tab { padding: 12px 24px; cursor: pointer; border: none; background: none; font-size: 14px; color: #6b7280; }
        .tab.active { color: #2563eb; border-bottom: 2px solid #2563eb; }
        .tab-content { display: none; }
        .tab-content.active { display: block; }
        .card { background: white; padding: 20px; border-radius: 8px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); margin-bottom: 20px; }
        .form-row { display: flex; gap: 15px; margin-bottom: 15px; }
        .form-group { flex: 1; }
        .form-group label { display: block; margin-bottom: 5px; font-weight: bold; color: #374151; }
        .form-group input, .form-group select, .form-group textarea { width: 100%; padding: 8px; border: 1px solid #d1d5db; border-radius: 4px; }
        .btn { padding: 10px 20px; border: none; border-radius: 4px; cursor: pointer; font-size: 14px; }
        .btn-primary { background: #2563eb; color: white; }
        .btn-primary:hover { background: #1d4ed8; }
        .btn-secondary { background: #6b7280; color: white; }
        .table { width: 100%; border-collapse: collapse; margin-top: 15px; }
        .table th, .table td { padding: 12px; text-align: left; border-bottom: 1px solid #e5e7eb; }
        .table th { background: #f9fafb; font-weight: bold; }
        .status-badge { padding: 4px 8px; border-radius: 12px; font-size: 12px; font-weight: bold; }
        .status-active { background: #dcfce7; color: #166534; }
        .status-inactive { background: #fee2e2; color: #dc2626; }
    </style>
</head>
<body>
    <div class="header">
        <h1>🏢 AgentCMR - System Zarządzania</h1>
        <div class="system-info" id="systemInfo">Ładowanie informacji systemowych...</div>
    </div>

    <div class="container">
        <div class="tabs">
            <button class="tab active" onclick="showTab('dashboard')">Dashboard</button>
            <button class="tab" onclick="showTab('clients')">Klienci</button>
            <button class="tab" onclick="showTab('policies')">Polisy</button>
            <button class="tab" onclick="showTab('vehicles')">Pojazdy</button>
            <button class="tab" onclick="showTab('payments')">Płatności</button>
            <button class="tab" onclick="showTab('settings')">Ustawienia</button>
        </div>

        <div id="dashboard" class="tab-content active">
            <div class="card">
                <h2>Dashboard</h2>
                <div class="form-row">
                    <div class="card" style="flex: 1; text-align: center;">
                        <h3 style="color: #2563eb; margin: 0;">156</h3>
                        <p style="margin: 5px 0; color: #6b7280;">Aktywni klienci</p>
                    </div>
                    <div class="card" style="flex: 1; text-align: center;">
                        <h3 style="color: #059669; margin: 0;">89</h3>
                        <p style="margin: 5px 0; color: #6b7280;">Aktywne polisy</p>
                    </div>
                    <div class="card" style="flex: 1; text-align: center;">
                        <h3 style="color: #dc2626; margin: 0;">12</h3>
                        <p style="margin: 5px 0; color: #6b7280;">Wygasające polisy</p>
                    </div>
                </div>
            </div>
        </div>

        <div id="clients" class="tab-content">
            <div class="card">
                <h2>Zarządzanie Klientami</h2>
                <div class="form-row">
                    <div class="form-group">
                        <label>Imię i nazwisko:</label>
                        <input type="text" placeholder="Jan Kowalski">
                    </div>
                    <div class="form-group">
                        <label>PESEL:</label>
                        <input type="text" placeholder="12345678901">
                    </div>
                    <div class="form-group">
                        <label>Telefon:</label>
                        <input type="text" placeholder="+48 123 456 789">
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label>Email:</label>
                        <input type="email" placeholder="jan.kowalski@email.com">
                    </div>
                    <div class="form-group">
                        <label>Adres:</label>
                        <input type="text" placeholder="ul. Przykładowa 123, 00-000 Warszawa">
                    </div>
                </div>
                <button class="btn btn-primary">Dodaj klienta</button>
                
                <table class="table">
                    <thead>
                        <tr>
                            <th>Imię i nazwisko</th>
                            <th>PESEL</th>
                            <th>Telefon</th>
                            <th>Status</th>
                            <th>Akcje</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Jan Kowalski</td>
                            <td>12345678901</td>
                            <td>+48 123 456 789</td>
                            <td><span class="status-badge status-active">Aktywny</span></td>
                            <td><button class="btn btn-secondary">Edytuj</button></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

        <div id="policies" class="tab-content">
            <div class="card">
                <h2>Zarządzanie Polisami</h2>
                <div class="form-row">
                    <div class="form-group">
                        <label>Numer polisy:</label>
                        <input type="text" placeholder="POL/2024/001">
                    </div>
                    <div class="form-group">
                        <label>Typ ubezpieczenia:</label>
                        <select>
                            <option>OC</option>
                            <option>AC</option>
                            <option>NNW</option>
                            <option>Assistance</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Data rozpoczęcia:</label>
                        <input type="date">
                    </div>
                </div>
                <button class="btn btn-primary">Dodaj polisę</button>
            </div>
        </div>

        <div id="vehicles" class="tab-content">
            <div class="card">
                <h2>Zarządzanie Pojazdami</h2>
                <div class="form-row">
                    <div class="form-group">
                        <label>Numer rejestracyjny:</label>
                        <input type="text" placeholder="WA 12345">
                    </div>
                    <div class="form-group">
                        <label>Marka i model:</label>
                        <input type="text" placeholder="Toyota Corolla">
                    </div>
                    <div class="form-group">
                        <label>Rok produkcji:</label>
                        <input type="number" placeholder="2020">
                    </div>
                </div>
                <button class="btn btn-primary">Dodaj pojazd</button>
            </div>
        </div>

        <div id="payments" class="tab-content">
            <div class="card">
                <h2>Zarządzanie Płatnościami</h2>
                <div class="form-row">
                    <div class="form-group">
                        <label>Kwota:</label>
                        <input type="number" placeholder="1500.00">
                    </div>
                    <div class="form-group">
                        <label>Data płatności:</label>
                        <input type="date">
                    </div>
                    <div class="form-group">
                        <label>Status:</label>
                        <select>
                            <option>Oczekująca</option>
                            <option>Opłacona</option>
                            <option>Przeterminowana</option>
                        </select>
                    </div>
                </div>
                <button class="btn btn-primary">Dodaj płatność</button>
            </div>
        </div>

        <div id="settings" class="tab-content">
            <div class="card">
                <h2>Ustawienia Aplikacji</h2>
                <div class="form-row">
                    <div class="form-group">
                        <label>Nazwa firmy:</label>
                        <input type="text" placeholder="Moja Firma Ubezpieczeniowa">
                    </div>
                    <div class="form-group">
                        <label>NIP:</label>
                        <input type="text" placeholder="1234567890">
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label>Adres firmy:</label>
                        <textarea rows="3" placeholder="ul. Biznesowa 1, 00-000 Warszawa"></textarea>
                    </div>
                </div>
                <button class="btn btn-primary">Zapisz ustawienia</button>
            </div>
        </div>
    </div>

    <script>
        const { ipcRenderer } = require('electron');
        
        async function loadSystemInfo() {
            try {
                const info = await ipcRenderer.invoke('get-system-info');
                document.getElementById('systemInfo').textContent = 
                    \`💻 \${info.hostname} | 🌐 \${info.localIP} | 👤 \${info.user} | 💾 \${info.totalMemory}\`;
            } catch (error) {
                console.error('Error loading system info:', error);
            }
        }
        
        function showTab(tabName) {
            // Hide all tab contents
            const contents = document.querySelectorAll('.tab-content');
            contents.forEach(content => content.classList.remove('active'));
            
            // Remove active class from all tabs
            const tabs = document.querySelectorAll('.tab');
            tabs.forEach(tab => tab.classList.remove('active'));
            
            // Show selected tab content
            document.getElementById(tabName).classList.add('active');
            
            // Add active class to clicked tab
            event.target.classList.add('active');
        }
        
        // Load system info on startup
        loadSystemInfo();
    </script>
</body>
</html>`

fs.writeFileSync(path.join(rendererDir, "login.html"), loginHTML)
fs.writeFileSync(path.join(rendererDir, "index.html"), mainHTML)

console.log("✅ Build completed successfully!")
console.log("📁 Files created:")
console.log("  - renderer/login.html")
console.log("  - renderer/index.html")
console.log("")
console.log("🚀 To run the application:")
console.log("  npm start")
