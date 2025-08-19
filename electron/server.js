const express = require('express')
const cors = require('cors')
const path = require('path')
const initSqlJs = require('sql.js')

async function createServer({ dbPath, port = 8080, host = '0.0.0.0' }) {
  const SQL = await initSqlJs()
  const fs = require('fs')
  let db
  if (fs.existsSync(dbPath)) {
    const fileBuffer = fs.readFileSync(dbPath)
    db = new SQL.Database(fileBuffer)
  } else {
    db = new SQL.Database()
  }

  db.run(`
    create table if not exists companies (
      id text primary key,
      name text not null,
      icon text,
      url text,
      username text,
      password_encrypted text,
      auto_login_script text,
      updated_at integer not null,
      deleted_at integer
    );
  `)

  function persist() {
    const data = db.export()
    const buffer = Buffer.from(data)
    require('fs').mkdirSync(require('path').dirname(dbPath), { recursive: true })
    require('fs').writeFileSync(dbPath, buffer)
  }

  const app = express()
  app.use(cors())
  app.use(express.json({ limit: '2mb' }))

  // Companies CRUD
  app.get('/api/companies', (req, res) => {
    const stmt = db.prepare('select * from companies where deleted_at is null order by name')
    const rows = []
    stmt.run = undefined
    const result = db.exec('select * from companies where deleted_at is null order by name')
    if (result[0]) {
      const cols = result[0].columns
      for (const row of result[0].values) {
        const obj = {}
        cols.forEach((c, i) => (obj[c] = row[i]))
        rows.push(obj)
      }
    }
    res.json(rows)
  })

  app.post('/api/companies', (req, res) => {
    const { id, name, icon, url, username, password_encrypted, auto_login_script } = req.body || {}
    if (!name) return res.status(400).json({ error: 'name required' })
    const rowId = id || require('crypto').randomUUID()
    const now = Date.now()
    db.run(`insert into companies (id, name, icon, url, username, password_encrypted, auto_login_script, updated_at, deleted_at)
            values (?, ?, ?, ?, ?, ?, ?, ?, null)`, [
      rowId, name, icon, url, username, password_encrypted, auto_login_script, now,
    ])
    persist()
    res.json({ id: rowId })
  })

  app.put('/api/companies/:id', (req, res) => {
    const { id } = req.params
    const { name, icon, url, username, password_encrypted, auto_login_script } = req.body || {}
    const now = Date.now()
    const select = db.exec(`select * from companies where id='${id.replace(/'/g, "''")}' limit 1`)
    if (!select[0]) return res.status(404).json({ error: 'not found' })
    const cols = select[0].columns
    const vals = select[0].values[0]
    const current = {}
    cols.forEach((c, i) => (current[c] = vals[i]))
    const next = {
      name: name ?? current.name,
      icon: icon ?? current.icon,
      url: url ?? current.url,
      username: username ?? current.username,
      password_encrypted: password_encrypted ?? current.password_encrypted,
      auto_login_script: auto_login_script ?? current.auto_login_script,
      updated_at: now,
    }
    db.run(
      `update companies set name=?, icon=?, url=?, username=?, password_encrypted=?, auto_login_script=?, updated_at=? where id=?`,
      [next.name, next.icon, next.url, next.username, next.password_encrypted, next.auto_login_script, next.updated_at, id]
    )
    persist()
    res.json({ ok: true })
  })

  app.delete('/api/companies/:id', (req, res) => {
    const { id } = req.params
    const now = Date.now()
    db.run('update companies set deleted_at = ?, updated_at = ? where id = ?', [now, now, id])
    persist()
    res.json({ ok: true })
  })

  const server = app.listen(port, host)
  return { app, server }
}

module.exports = { createServer }

