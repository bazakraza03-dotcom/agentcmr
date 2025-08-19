const express = require('express')
const cors = require('cors')
const path = require('path')
const Database = require('better-sqlite3')

function initDb(dbPath) {
  const db = new Database(dbPath)
  db.pragma('journal_mode = WAL')
  db.exec(`
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
  return db
}

function createServer({ dbPath, port = 8080, host = '0.0.0.0' }) {
  const db = initDb(dbPath)
  const app = express()
  app.use(cors())
  app.use(express.json({ limit: '2mb' }))

  // Companies CRUD
  app.get('/api/companies', (req, res) => {
    const rows = db.prepare('select * from companies where deleted_at is null order by name').all()
    res.json(rows)
  })

  app.post('/api/companies', (req, res) => {
    const { id, name, icon, url, username, password_encrypted, auto_login_script } = req.body || {}
    if (!name) return res.status(400).json({ error: 'name required' })
    const rowId = id || require('crypto').randomUUID()
    const now = Date.now()
    db.prepare(
      `insert into companies (id, name, icon, url, username, password_encrypted, auto_login_script, updated_at, deleted_at)
       values (@id, @name, @icon, @url, @username, @password_encrypted, @auto_login_script, @updated_at, null)`
    ).run({ id: rowId, name, icon, url, username, password_encrypted, auto_login_script, updated_at: now })
    res.json({ id: rowId })
  })

  app.put('/api/companies/:id', (req, res) => {
    const { id } = req.params
    const { name, icon, url, username, password_encrypted, auto_login_script } = req.body || {}
    const now = Date.now()
    db.prepare(
      `update companies
         set name = coalesce(@name, name),
             icon = coalesce(@icon, icon),
             url = coalesce(@url, url),
             username = coalesce(@username, username),
             password_encrypted = coalesce(@password_encrypted, password_encrypted),
             auto_login_script = coalesce(@auto_login_script, auto_login_script),
             updated_at = @updated_at
       where id = @id`
    ).run({ id, name, icon, url, username, password_encrypted, auto_login_script, updated_at: now })
    res.json({ ok: true })
  })

  app.delete('/api/companies/:id', (req, res) => {
    const { id } = req.params
    const now = Date.now()
    db.prepare('update companies set deleted_at = @now, updated_at = @now where id = @id').run({ id, now })
    res.json({ ok: true })
  })

  const server = app.listen(port, host)
  return { app, server, db }
}

module.exports = { createServer }

