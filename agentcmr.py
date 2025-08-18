import tkinter as tk
from tkinter import ttk, messagebox, simpledialog
import sqlite3
import hashlib
import socket
import threading
import json
import os
from datetime import datetime

class AgentCMRApp:
    def __init__(self):
        self.root = tk.Tk()
        self.root.title("AgentCMR - System Zarządzania Ubezpieczeniami")
        self.root.geometry("1200x800")
        self.root.configure(bg='#f0f0f0')
        
        # Database setup
        self.setup_database()
        
        # Current user and mode
        self.current_user = None
        self.app_mode = None
        self.server_socket = None
        
        # Show login window
        self.show_login()
        
    def setup_database(self):
        """Initialize SQLite database"""
        self.conn = sqlite3.connect('agentcmr.db')
        cursor = self.conn.cursor()
        
        # Users table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY,
                username TEXT UNIQUE,
                password_hash TEXT,
                role TEXT DEFAULT 'agent'
            )
        ''')
        
        # Clients table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS clients (
                id INTEGER PRIMARY KEY,
                name TEXT,
                email TEXT,
                phone TEXT,
                address TEXT,
                created_date TEXT
            )
        ''')
        
        # Policies table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS policies (
                id INTEGER PRIMARY KEY,
                client_id INTEGER,
                policy_number TEXT,
                policy_type TEXT,
                premium REAL,
                start_date TEXT,
                end_date TEXT,
                status TEXT DEFAULT 'active',
                FOREIGN KEY (client_id) REFERENCES clients (id)
            )
        ''')
        
        # Vehicles table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS vehicles (
                id INTEGER PRIMARY KEY,
                client_id INTEGER,
                make TEXT,
                model TEXT,
                year INTEGER,
                vin TEXT,
                license_plate TEXT,
                FOREIGN KEY (client_id) REFERENCES clients (id)
            )
        ''')
        
        # Create default admin user
        admin_hash = hashlib.sha256("admin123".encode()).hexdigest()
        cursor.execute('INSERT OR IGNORE INTO users (username, password_hash, role) VALUES (?, ?, ?)',
                      ('admin', admin_hash, 'admin'))
        
        self.conn.commit()
        
    def show_login(self):
        """Show login window"""
        self.login_window = tk.Toplevel(self.root)
        self.login_window.title("AgentCMR - Logowanie")
        self.login_window.geometry("400x300")
        self.login_window.configure(bg='#2c3e50')
        self.login_window.transient(self.root)
        self.login_window.grab_set()
        
        # Center the login window
        self.login_window.geometry("+{}+{}".format(
            int(self.root.winfo_screenwidth()/2 - 200),
            int(self.root.winfo_screenheight()/2 - 150)
        ))
        
        # Login form
        login_frame = tk.Frame(self.login_window, bg='#2c3e50', padx=40, pady=40)
        login_frame.pack(expand=True, fill='both')
        
        # Title
        title_label = tk.Label(login_frame, text="AgentCMR", font=('Arial', 24, 'bold'), 
                              fg='white', bg='#2c3e50')
        title_label.pack(pady=(0, 20))
        
        # Mode selection
        mode_label = tk.Label(login_frame, text="Tryb pracy:", font=('Arial', 12), 
                             fg='white', bg='#2c3e50')
        mode_label.pack(anchor='w')
        
        self.mode_var = tk.StringVar(value="standalone")
        modes = [("Standalone", "standalone"), ("Serwer", "server"), ("Klient", "client")]
        
        for text, value in modes:
            rb = tk.Radiobutton(login_frame, text=text, variable=self.mode_var, value=value,
                               fg='white', bg='#2c3e50', selectcolor='#34495e',
                               font=('Arial', 10))
            rb.pack(anchor='w', pady=2)
        
        # Username
        tk.Label(login_frame, text="Użytkownik:", font=('Arial', 12), 
                fg='white', bg='#2c3e50').pack(anchor='w', pady=(20, 5))
        self.username_entry = tk.Entry(login_frame, font=('Arial', 12), width=25)
        self.username_entry.pack(pady=(0, 10))
        self.username_entry.insert(0, "admin")
        
        # Password
        tk.Label(login_frame, text="Hasło:", font=('Arial', 12), 
                fg='white', bg='#2c3e50').pack(anchor='w', pady=(0, 5))
        self.password_entry = tk.Entry(login_frame, font=('Arial', 12), width=25, show="*")
        self.password_entry.pack(pady=(0, 20))
        
        # Login button
        login_btn = tk.Button(login_frame, text="Zaloguj", font=('Arial', 12, 'bold'),
                             bg='#3498db', fg='white', width=20, pady=5,
                             command=self.login)
        login_btn.pack()
        
        # Bind Enter key
        self.login_window.bind('<Return>', lambda e: self.login())
        self.username_entry.focus()
        
    def login(self):
        """Handle login"""
        username = self.username_entry.get()
        password = self.password_entry.get()
        mode = self.mode_var.get()
        
        if not username or not password:
            messagebox.showerror("Błąd", "Wprowadź nazwę użytkownika i hasło")
            return
            
        # Verify credentials
        password_hash = hashlib.sha256(password.encode()).hexdigest()
        cursor = self.conn.cursor()
        cursor.execute('SELECT * FROM users WHERE username = ? AND password_hash = ?',
                      (username, password_hash))
        user = cursor.fetchone()
        
        if user:
            self.current_user = user
            self.app_mode = mode
            self.login_window.destroy()
            
            # Setup mode-specific functionality
            if mode == "server":
                self.start_server()
            elif mode == "client":
                self.connect_to_server()
                
            self.show_main_window()
        else:
            messagebox.showerror("Błąd", "Nieprawidłowe dane logowania")
            
    def start_server(self):
        """Start server mode"""
        try:
            self.server_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
            self.server_socket.bind(('0.0.0.0', 8080))
            self.server_socket.listen(5)
            
            # Get local IP
            hostname = socket.gethostname()
            local_ip = socket.gethostbyname(hostname)
            
            messagebox.showinfo("Serwer", f"Serwer uruchomiony na IP: {local_ip}:8080")
            
            # Start server thread
            server_thread = threading.Thread(target=self.handle_server, daemon=True)
            server_thread.start()
            
        except Exception as e:
            messagebox.showerror("Błąd serwera", f"Nie można uruchomić serwera: {e}")
            
    def handle_server(self):
        """Handle server connections"""
        while True:
            try:
                client_socket, addr = self.server_socket.accept()
                client_thread = threading.Thread(target=self.handle_client, 
                                                args=(client_socket, addr), daemon=True)
                client_thread.start()
            except:
                break
                
    def handle_client(self, client_socket, addr):
        """Handle individual client connections"""
        try:
            while True:
                data = client_socket.recv(1024).decode()
                if not data:
                    break
                # Handle client requests here
                response = {"status": "ok", "data": "Server response"}
                client_socket.send(json.dumps(response).encode())
        except:
            pass
        finally:
            client_socket.close()
            
    def connect_to_server(self):
        """Connect to server in client mode"""
        server_ip = simpledialog.askstring("Połączenie z serwerem", 
                                          "Wprowadź IP serwera:")
        if server_ip:
            try:
                self.client_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
                self.client_socket.connect((server_ip, 8080))
                messagebox.showinfo("Połączenie", f"Połączono z serwerem {server_ip}")
            except Exception as e:
                messagebox.showerror("Błąd połączenia", f"Nie można połączyć z serwerem: {e}")
                
    def show_main_window(self):
        """Show main application window"""
        self.root.deiconify()
        
        # Create menu bar
        menubar = tk.Menu(self.root)
        self.root.config(menu=menubar)
        
        # File menu
        file_menu = tk.Menu(menubar, tearoff=0)
        menubar.add_cascade(label="Plik", menu=file_menu)
        file_menu.add_command(label="Nowy klient", command=self.new_client)
        file_menu.add_command(label="Nowa polisa", command=self.new_policy)
        file_menu.add_separator()
        file_menu.add_command(label="Wyloguj", command=self.logout)
        file_menu.add_command(label="Wyjście", command=self.root.quit)
        
        # Tools menu
        tools_menu = tk.Menu(menubar, tearoff=0)
        menubar.add_cascade(label="Narzędzia", menu=tools_menu)
        tools_menu.add_command(label="Informacje o systemie", command=self.show_system_info)
        
        # Create main frame
        main_frame = tk.Frame(self.root, bg='#ecf0f1')
        main_frame.pack(fill='both', expand=True, padx=10, pady=10)
        
        # Status bar
        status_frame = tk.Frame(main_frame, bg='#34495e', height=30)
        status_frame.pack(fill='x', side='bottom')
        status_frame.pack_propagate(False)
        
        self.status_label = tk.Label(status_frame, 
                                   text=f"Zalogowany: {self.current_user[1]} | Tryb: {self.app_mode}",
                                   fg='white', bg='#34495e', font=('Arial', 10))
        self.status_label.pack(side='left', padx=10, pady=5)
        
        # Create notebook for tabs
        self.notebook = ttk.Notebook(main_frame)
        self.notebook.pack(fill='both', expand=True, pady=(0, 10))
        
        # Create tabs
        self.create_dashboard_tab()
        self.create_clients_tab()
        self.create_policies_tab()
        self.create_vehicles_tab()
        
    def create_dashboard_tab(self):
        """Create dashboard tab"""
        dashboard_frame = ttk.Frame(self.notebook)
        self.notebook.add(dashboard_frame, text="Dashboard")
        
        # Welcome message
        welcome_label = tk.Label(dashboard_frame, 
                                text=f"Witaj w AgentCMR, {self.current_user[1]}!",
                                font=('Arial', 18, 'bold'), bg='#ecf0f1')
        welcome_label.pack(pady=20)
        
        # Statistics frame
        stats_frame = tk.Frame(dashboard_frame, bg='#ecf0f1')
        stats_frame.pack(fill='x', padx=20, pady=10)
        
        # Get statistics
        cursor = self.conn.cursor()
        cursor.execute('SELECT COUNT(*) FROM clients')
        clients_count = cursor.fetchone()[0]
        
        cursor.execute('SELECT COUNT(*) FROM policies')
        policies_count = cursor.fetchone()[0]
        
        cursor.execute('SELECT COUNT(*) FROM vehicles')
        vehicles_count = cursor.fetchone()[0]
        
        # Statistics cards
        stats = [
            ("Klienci", clients_count, "#3498db"),
            ("Polisy", policies_count, "#2ecc71"),
            ("Pojazdy", vehicles_count, "#e74c3c")
        ]
        
        for i, (title, count, color) in enumerate(stats):
            card = tk.Frame(stats_frame, bg=color, width=200, height=100)
            card.pack(side='left', padx=10, pady=10)
            card.pack_propagate(False)
            
            tk.Label(card, text=str(count), font=('Arial', 24, 'bold'), 
                    fg='white', bg=color).pack(pady=(20, 5))
            tk.Label(card, text=title, font=('Arial', 12), 
                    fg='white', bg=color).pack()
                    
    def create_clients_tab(self):
        """Create clients management tab"""
        clients_frame = ttk.Frame(self.notebook)
        self.notebook.add(clients_frame, text="Klienci")
        
        # Toolbar
        toolbar = tk.Frame(clients_frame, bg='#ecf0f1')
        toolbar.pack(fill='x', padx=10, pady=5)
        
        tk.Button(toolbar, text="Nowy klient", command=self.new_client,
                 bg='#3498db', fg='white', font=('Arial', 10)).pack(side='left', padx=5)
        tk.Button(toolbar, text="Edytuj", command=self.edit_client,
                 bg='#f39c12', fg='white', font=('Arial', 10)).pack(side='left', padx=5)
        tk.Button(toolbar, text="Usuń", command=self.delete_client,
                 bg='#e74c3c', fg='white', font=('Arial', 10)).pack(side='left', padx=5)
        
        # Clients list
        columns = ('ID', 'Nazwa', 'Email', 'Telefon', 'Data utworzenia')
        self.clients_tree = ttk.Treeview(clients_frame, columns=columns, show='headings')
        
        for col in columns:
            self.clients_tree.heading(col, text=col)
            self.clients_tree.column(col, width=150)
            
        self.clients_tree.pack(fill='both', expand=True, padx=10, pady=5)
        
        # Scrollbar
        scrollbar = ttk.Scrollbar(clients_frame, orient='vertical', command=self.clients_tree.yview)
        scrollbar.pack(side='right', fill='y')
        self.clients_tree.configure(yscrollcommand=scrollbar.set)
        
        self.refresh_clients()
        
    def create_policies_tab(self):
        """Create policies management tab"""
        policies_frame = ttk.Frame(self.notebook)
        self.notebook.add(policies_frame, text="Polisy")
        
        # Toolbar
        toolbar = tk.Frame(policies_frame, bg='#ecf0f1')
        toolbar.pack(fill='x', padx=10, pady=5)
        
        tk.Button(toolbar, text="Nowa polisa", command=self.new_policy,
                 bg='#3498db', fg='white', font=('Arial', 10)).pack(side='left', padx=5)
        tk.Button(toolbar, text="Edytuj", command=self.edit_policy,
                 bg='#f39c12', fg='white', font=('Arial', 10)).pack(side='left', padx=5)
        tk.Button(toolbar, text="Usuń", command=self.delete_policy,
                 bg='#e74c3c', fg='white', font=('Arial', 10)).pack(side='left', padx=5)
        
        # Policies list
        columns = ('ID', 'Numer polisy', 'Klient', 'Typ', 'Składka', 'Status')
        self.policies_tree = ttk.Treeview(policies_frame, columns=columns, show='headings')
        
        for col in columns:
            self.policies_tree.heading(col, text=col)
            self.policies_tree.column(col, width=120)
            
        self.policies_tree.pack(fill='both', expand=True, padx=10, pady=5)
        
        self.refresh_policies()
        
    def create_vehicles_tab(self):
        """Create vehicles management tab"""
        vehicles_frame = ttk.Frame(self.notebook)
        self.notebook.add(vehicles_frame, text="Pojazdy")
        
        # Toolbar
        toolbar = tk.Frame(vehicles_frame, bg='#ecf0f1')
        toolbar.pack(fill='x', padx=10, pady=5)
        
        tk.Button(toolbar, text="Nowy pojazd", command=self.new_vehicle,
                 bg='#3498db', fg='white', font=('Arial', 10)).pack(side='left', padx=5)
        tk.Button(toolbar, text="Edytuj", command=self.edit_vehicle,
                 bg='#f39c12', fg='white', font=('Arial', 10)).pack(side='left', padx=5)
        tk.Button(toolbar, text="Usuń", command=self.delete_vehicle,
                 bg='#e74c3c', fg='white', font=('Arial', 10)).pack(side='left', padx=5)
        
        # Vehicles list
        columns = ('ID', 'Klient', 'Marka', 'Model', 'Rok', 'VIN', 'Rejestracja')
        self.vehicles_tree = ttk.Treeview(vehicles_frame, columns=columns, show='headings')
        
        for col in columns:
            self.vehicles_tree.heading(col, text=col)
            self.vehicles_tree.column(col, width=120)
            
        self.vehicles_tree.pack(fill='both', expand=True, padx=10, pady=5)
        
        self.refresh_vehicles()
        
    def new_client(self):
        """Add new client"""
        dialog = ClientDialog(self.root, "Nowy klient")
        if dialog.result:
            cursor = self.conn.cursor()
            cursor.execute('''INSERT INTO clients (name, email, phone, address, created_date)
                             VALUES (?, ?, ?, ?, ?)''',
                          (dialog.result['name'], dialog.result['email'], 
                           dialog.result['phone'], dialog.result['address'],
                           datetime.now().strftime('%Y-%m-%d')))
            self.conn.commit()
            self.refresh_clients()
            messagebox.showinfo("Sukces", "Klient został dodany")
            
    def edit_client(self):
        """Edit selected client"""
        selection = self.clients_tree.selection()
        if not selection:
            messagebox.showwarning("Uwaga", "Wybierz klienta do edycji")
            return
            
        item = self.clients_tree.item(selection[0])
        client_id = item['values'][0]
        
        # Get client data
        cursor = self.conn.cursor()
        cursor.execute('SELECT * FROM clients WHERE id = ?', (client_id,))
        client = cursor.fetchone()
        
        dialog = ClientDialog(self.root, "Edytuj klienta", client)
        if dialog.result:
            cursor.execute('''UPDATE clients SET name=?, email=?, phone=?, address=?
                             WHERE id=?''',
                          (dialog.result['name'], dialog.result['email'],
                           dialog.result['phone'], dialog.result['address'], client_id))
            self.conn.commit()
            self.refresh_clients()
            messagebox.showinfo("Sukces", "Klient został zaktualizowany")
            
    def delete_client(self):
        """Delete selected client"""
        selection = self.clients_tree.selection()
        if not selection:
            messagebox.showwarning("Uwaga", "Wybierz klienta do usunięcia")
            return
            
        if messagebox.askyesno("Potwierdzenie", "Czy na pewno chcesz usunąć tego klienta?"):
            item = self.clients_tree.item(selection[0])
            client_id = item['values'][0]
            
            cursor = self.conn.cursor()
            cursor.execute('DELETE FROM clients WHERE id = ?', (client_id,))
            self.conn.commit()
            self.refresh_clients()
            messagebox.showinfo("Sukces", "Klient został usunięty")
            
    def new_policy(self):
        """Add new policy"""
        # Get clients for dropdown
        cursor = self.conn.cursor()
        cursor.execute('SELECT id, name FROM clients')
        clients = cursor.fetchall()
        
        if not clients:
            messagebox.showwarning("Uwaga", "Najpierw dodaj klientów")
            return
            
        dialog = PolicyDialog(self.root, "Nowa polisa", clients)
        if dialog.result:
            cursor.execute('''INSERT INTO policies (client_id, policy_number, policy_type, 
                             premium, start_date, end_date, status)
                             VALUES (?, ?, ?, ?, ?, ?, ?)''',
                          (dialog.result['client_id'], dialog.result['policy_number'],
                           dialog.result['policy_type'], dialog.result['premium'],
                           dialog.result['start_date'], dialog.result['end_date'], 'active'))
            self.conn.commit()
            self.refresh_policies()
            messagebox.showinfo("Sukces", "Polisa została dodana")
            
    def edit_policy(self):
        """Edit selected policy"""
        # Implementation similar to edit_client
        pass
        
    def delete_policy(self):
        """Delete selected policy"""
        # Implementation similar to delete_client
        pass
        
    def new_vehicle(self):
        """Add new vehicle"""
        # Get clients for dropdown
        cursor = self.conn.cursor()
        cursor.execute('SELECT id, name FROM clients')
        clients = cursor.fetchall()
        
        if not clients:
            messagebox.showwarning("Uwaga", "Najpierw dodaj klientów")
            return
            
        dialog = VehicleDialog(self.root, "Nowy pojazd", clients)
        if dialog.result:
            cursor.execute('''INSERT INTO vehicles (client_id, make, model, year, vin, license_plate)
                             VALUES (?, ?, ?, ?, ?, ?)''',
                          (dialog.result['client_id'], dialog.result['make'],
                           dialog.result['model'], dialog.result['year'],
                           dialog.result['vin'], dialog.result['license_plate']))
            self.conn.commit()
            self.refresh_vehicles()
            messagebox.showinfo("Sukces", "Pojazd został dodany")
            
    def edit_vehicle(self):
        """Edit selected vehicle"""
        # Implementation similar to edit_client
        pass
        
    def delete_vehicle(self):
        """Delete selected vehicle"""
        # Implementation similar to delete_client
        pass
        
    def refresh_clients(self):
        """Refresh clients list"""
        for item in self.clients_tree.get_children():
            self.clients_tree.delete(item)
            
        cursor = self.conn.cursor()
        cursor.execute('SELECT * FROM clients ORDER BY name')
        clients = cursor.fetchall()
        
        for client in clients:
            self.clients_tree.insert('', 'end', values=client)
            
    def refresh_policies(self):
        """Refresh policies list"""
        for item in self.policies_tree.get_children():
            self.policies_tree.delete(item)
            
        cursor = self.conn.cursor()
        cursor.execute('''SELECT p.id, p.policy_number, c.name, p.policy_type, 
                         p.premium, p.status
                         FROM policies p
                         JOIN clients c ON p.client_id = c.id
                         ORDER BY p.policy_number''')
        policies = cursor.fetchall()
        
        for policy in policies:
            self.policies_tree.insert('', 'end', values=policy)
            
    def refresh_vehicles(self):
        """Refresh vehicles list"""
        for item in self.vehicles_tree.get_children():
            self.vehicles_tree.delete(item)
            
        cursor = self.conn.cursor()
        cursor.execute('''SELECT v.id, c.name, v.make, v.model, v.year, v.vin, v.license_plate
                         FROM vehicles v
                         JOIN clients c ON v.client_id = c.id
                         ORDER BY c.name''')
        vehicles = cursor.fetchall()
        
        for vehicle in vehicles:
            self.vehicles_tree.insert('', 'end', values=vehicle)
            
    def show_system_info(self):
        """Show system information"""
        import platform
        
        info = f"""Informacje o systemie:
        
System: {platform.system()} {platform.release()}
Procesor: {platform.processor()}
Architektura: {platform.architecture()[0]}
Nazwa komputera: {platform.node()}
Użytkownik: {os.getlogin()}
Python: {platform.python_version()}

Tryb aplikacji: {self.app_mode}
Zalogowany użytkownik: {self.current_user[1]}
"""
        
        messagebox.showinfo("Informacje o systemie", info)
        
    def logout(self):
        """Logout and show login window again"""
        if self.server_socket:
            self.server_socket.close()
            
        self.root.withdraw()
        self.current_user = None
        self.app_mode = None
        self.show_login()
        
    def run(self):
        """Run the application"""
        self.root.withdraw()  # Hide main window initially
        self.root.mainloop()


class ClientDialog:
    def __init__(self, parent, title, client_data=None):
        self.result = None
        
        self.dialog = tk.Toplevel(parent)
        self.dialog.title(title)
        self.dialog.geometry("400x300")
        self.dialog.transient(parent)
        self.dialog.grab_set()
        
        # Center dialog
        self.dialog.geometry("+{}+{}".format(
            int(parent.winfo_x() + parent.winfo_width()/2 - 200),
            int(parent.winfo_y() + parent.winfo_height()/2 - 150)
        ))
        
        # Form fields
        tk.Label(self.dialog, text="Nazwa:", font=('Arial', 12)).pack(anchor='w', padx=20, pady=(20, 5))
        self.name_entry = tk.Entry(self.dialog, font=('Arial', 12), width=40)
        self.name_entry.pack(padx=20, pady=(0, 10))
        
        tk.Label(self.dialog, text="Email:", font=('Arial', 12)).pack(anchor='w', padx=20, pady=(0, 5))
        self.email_entry = tk.Entry(self.dialog, font=('Arial', 12), width=40)
        self.email_entry.pack(padx=20, pady=(0, 10))
        
        tk.Label(self.dialog, text="Telefon:", font=('Arial', 12)).pack(anchor='w', padx=20, pady=(0, 5))
        self.phone_entry = tk.Entry(self.dialog, font=('Arial', 12), width=40)
        self.phone_entry.pack(padx=20, pady=(0, 10))
        
        tk.Label(self.dialog, text="Adres:", font=('Arial', 12)).pack(anchor='w', padx=20, pady=(0, 5))
        self.address_entry = tk.Entry(self.dialog, font=('Arial', 12), width=40)
        self.address_entry.pack(padx=20, pady=(0, 20))
        
        # Fill data if editing
        if client_data:
            self.name_entry.insert(0, client_data[1] or '')
            self.email_entry.insert(0, client_data[2] or '')
            self.phone_entry.insert(0, client_data[3] or '')
            self.address_entry.insert(0, client_data[4] or '')
        
        # Buttons
        button_frame = tk.Frame(self.dialog)
        button_frame.pack(pady=20)
        
        tk.Button(button_frame, text="Zapisz", command=self.save,
                 bg='#3498db', fg='white', font=('Arial', 12), width=10).pack(side='left', padx=10)
        tk.Button(button_frame, text="Anuluj", command=self.cancel,
                 bg='#95a5a6', fg='white', font=('Arial', 12), width=10).pack(side='left', padx=10)
        
        self.name_entry.focus()
        
    def save(self):
        name = self.name_entry.get().strip()
        if not name:
            messagebox.showerror("Błąd", "Nazwa jest wymagana")
            return
            
        self.result = {
            'name': name,
            'email': self.email_entry.get().strip(),
            'phone': self.phone_entry.get().strip(),
            'address': self.address_entry.get().strip()
        }
        self.dialog.destroy()
        
    def cancel(self):
        self.dialog.destroy()


class PolicyDialog:
    def __init__(self, parent, title, clients, policy_data=None):
        self.result = None
        
        self.dialog = tk.Toplevel(parent)
        self.dialog.title(title)
        self.dialog.geometry("400x400")
        self.dialog.transient(parent)
        self.dialog.grab_set()
        
        # Form fields
        tk.Label(self.dialog, text="Klient:", font=('Arial', 12)).pack(anchor='w', padx=20, pady=(20, 5))
        self.client_var = tk.StringVar()
        client_combo = ttk.Combobox(self.dialog, textvariable=self.client_var, width=37)
        client_combo['values'] = [f"{c[0]} - {c[1]}" for c in clients]
        client_combo.pack(padx=20, pady=(0, 10))
        
        tk.Label(self.dialog, text="Numer polisy:", font=('Arial', 12)).pack(anchor='w', padx=20, pady=(0, 5))
        self.policy_number_entry = tk.Entry(self.dialog, font=('Arial', 12), width=40)
        self.policy_number_entry.pack(padx=20, pady=(0, 10))
        
        tk.Label(self.dialog, text="Typ polisy:", font=('Arial', 12)).pack(anchor='w', padx=20, pady=(0, 5))
        self.policy_type_var = tk.StringVar()
        type_combo = ttk.Combobox(self.dialog, textvariable=self.policy_type_var, width=37)
        type_combo['values'] = ['OC', 'AC', 'OC+AC', 'NNW', 'Assistance']
        type_combo.pack(padx=20, pady=(0, 10))
        
        tk.Label(self.dialog, text="Składka:", font=('Arial', 12)).pack(anchor='w', padx=20, pady=(0, 5))
        self.premium_entry = tk.Entry(self.dialog, font=('Arial', 12), width=40)
        self.premium_entry.pack(padx=20, pady=(0, 10))
        
        tk.Label(self.dialog, text="Data rozpoczęcia:", font=('Arial', 12)).pack(anchor='w', padx=20, pady=(0, 5))
        self.start_date_entry = tk.Entry(self.dialog, font=('Arial', 12), width=40)
        self.start_date_entry.pack(padx=20, pady=(0, 10))
        self.start_date_entry.insert(0, datetime.now().strftime('%Y-%m-%d'))
        
        tk.Label(self.dialog, text="Data zakończenia:", font=('Arial', 12)).pack(anchor='w', padx=20, pady=(0, 5))
        self.end_date_entry = tk.Entry(self.dialog, font=('Arial', 12), width=40)
        self.end_date_entry.pack(padx=20, pady=(0, 20))
        
        # Buttons
        button_frame = tk.Frame(self.dialog)
        button_frame.pack(pady=20)
        
        tk.Button(button_frame, text="Zapisz", command=self.save,
                 bg='#3498db', fg='white', font=('Arial', 12), width=10).pack(side='left', padx=10)
        tk.Button(button_frame, text="Anuluj", command=self.cancel,
                 bg='#95a5a6', fg='white', font=('Arial', 12), width=10).pack(side='left', padx=10)
        
    def save(self):
        client_text = self.client_var.get()
        if not client_text:
            messagebox.showerror("Błąd", "Wybierz klienta")
            return
            
        client_id = int(client_text.split(' - ')[0])
        
        self.result = {
            'client_id': client_id,
            'policy_number': self.policy_number_entry.get().strip(),
            'policy_type': self.policy_type_var.get(),
            'premium': float(self.premium_entry.get() or 0),
            'start_date': self.start_date_entry.get().strip(),
            'end_date': self.end_date_entry.get().strip()
        }
        self.dialog.destroy()
        
    def cancel(self):
        self.dialog.destroy()


class VehicleDialog:
    def __init__(self, parent, title, clients, vehicle_data=None):
        self.result = None
        
        self.dialog = tk.Toplevel(parent)
        self.dialog.title(title)
        self.dialog.geometry("400x400")
        self.dialog.transient(parent)
        self.dialog.grab_set()
        
        # Form fields
        tk.Label(self.dialog, text="Klient:", font=('Arial', 12)).pack(anchor='w', padx=20, pady=(20, 5))
        self.client_var = tk.StringVar()
        client_combo = ttk.Combobox(self.dialog, textvariable=self.client_var, width=37)
        client_combo['values'] = [f"{c[0]} - {c[1]}" for c in clients]
        client_combo.pack(padx=20, pady=(0, 10))
        
        tk.Label(self.dialog, text="Marka:", font=('Arial', 12)).pack(anchor='w', padx=20, pady=(0, 5))
        self.make_entry = tk.Entry(self.dialog, font=('Arial', 12), width=40)
        self.make_entry.pack(padx=20, pady=(0, 10))
        
        tk.Label(self.dialog, text="Model:", font=('Arial', 12)).pack(anchor='w', padx=20, pady=(0, 5))
        self.model_entry = tk.Entry(self.dialog, font=('Arial', 12), width=40)
        self.model_entry.pack(padx=20, pady=(0, 10))
        
        tk.Label(self.dialog, text="Rok:", font=('Arial', 12)).pack(anchor='w', padx=20, pady=(0, 5))
        self.year_entry = tk.Entry(self.dialog, font=('Arial', 12), width=40)
        self.year_entry.pack(padx=20, pady=(0, 10))
        
        tk.Label(self.dialog, text="VIN:", font=('Arial', 12)).pack(anchor='w', padx=20, pady=(0, 5))
        self.vin_entry = tk.Entry(self.dialog, font=('Arial', 12), width=40)
        self.vin_entry.pack(padx=20, pady=(0, 10))
        
        tk.Label(self.dialog, text="Nr rejestracyjny:", font=('Arial', 12)).pack(anchor='w', padx=20, pady=(0, 5))
        self.license_entry = tk.Entry(self.dialog, font=('Arial', 12), width=40)
        self.license_entry.pack(padx=20, pady=(0, 20))
        
        # Buttons
        button_frame = tk.Frame(self.dialog)
        button_frame.pack(pady=20)
        
        tk.Button(button_frame, text="Zapisz", command=self.save,
                 bg='#3498db', fg='white', font=('Arial', 12), width=10).pack(side='left', padx=10)
        tk.Button(button_frame, text="Anuluj", command=self.cancel,
                 bg='#95a5a6', fg='white', font=('Arial', 12), width=10).pack(side='left', padx=10)
        
    def save(self):
        client_text = self.client_var.get()
        if not client_text:
            messagebox.showerror("Błąd", "Wybierz klienta")
            return
            
        client_id = int(client_text.split(' - ')[0])
        
        self.result = {
            'client_id': client_id,
            'make': self.make_entry.get().strip(),
            'model': self.model_entry.get().strip(),
            'year': int(self.year_entry.get() or 0),
            'vin': self.vin_entry.get().strip(),
            'license_plate': self.license_entry.get().strip()
        }
        self.dialog.destroy()
        
    def cancel(self):):
        self.dialog.destroy()


if __name__ == "__main__":
    app = AgentCMRApp()
    app.run()
