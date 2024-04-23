const express = require('express')
const data = require('../data/data.json')
const _ = require('lodash');
const app = express();
app.use(express.json())

app.get('/alquilable', (req, res)=>{
  res.status(200).json(data)
})

app.get('/alquilable/:id', (req, res)=>{
  const id = req.params.id;
  const alquilable = data.find( e => e.id == id)
  if (alquilable)
    res.status(200).json(alquilable)
  else
    res.status(404).json({error: `El id ${id} no existe.`})
})

app.delete('/alquilable/:id', (req, res)=>{
   const id = req.params.id;
   const idx = data.findIndex(e => e.id == id)
   if (idx >= 0) {
    const removed = data.splice(idx, 1)
    res.status(200).json({
      mensaje: `El alquilable con id ${id} fue eliminado`,
      alquilable: removed
    })
   } else 
    res.status(404).json({error: `El id ${id} no existe.`})
})

app.post('/alquilable',(req, res)=>{
    const alquilabe = req.body
    let id = 0
    if (data.length)
      id = _.max(data.map(e=>e.id)) 
    const aGrabar = {id: id + 1, ...alquilabe}
    data.push(aGrabar)
    res.status(201).json(aGrabar)
})

app.put('/alquilable/:id', (req, res)=>{
  const id = req.params.id;
  const idx = data.findIndex( e => e.id == id)
  if (idx >=0) {
    data[idx] = {id: Number(id), ...req.body}
    res.status(200).json(data[idx])
  } else
    res.status(404).json({error: `El id ${id} no existe.`})
})


app.listen(3000, ()=>{
  console.log(`La aplicacion arranco correctamente en el puerto 3000`);
})