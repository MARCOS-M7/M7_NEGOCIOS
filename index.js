import express from 'express'
import supabase from './supabaseClient.js'
import dotenv from 'dotenv'
dotenv.config()

const app = express()
const port = 3000

app.get('/', async (req, res) => {
  const { data, error } = await supabase.from('usuarios').select('*')
  if (error) return res.status(500).send(error.message)
  res.json(data)
})

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`)
})