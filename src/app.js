const express = require('express')
const data = require('../data/data.json')
const db = require('./db/models')
const _ = require('lodash');
const app = express();
app.use(express.json())

app.get('/alquilable', async (req, res)=>{
  const alquilables = await db.Alquilable.findAll({
    attributes: ["id","descripcion", "disponible", "precio"]
  }); //no filtro por nada, devuelve todo
  res.status(200).json(alquilables);
})

app.get('/alquilable/:id', async (req, res)=>{
  const id = req.params.id;
  const alquilables = await db.Alquilable.findOne({
    where: {id},
    attributes: ["id","descripcion", "disponible", "precio"]
  }); 
  res.status(200).json(alquilables);
})

app.delete('/alquilable/:id', async (req, res)=>{
  const id = req.params.id;
  const row = await db.Alquilable.destroy({where: {id}});
  if (row) {
    res.status(200).json(`El alquilable con id ${id} fue eliminado`)
  } else {
    res.status(404).json(`El alquilable con id ${id} no existe`)
  }
})

app.post('/alquilable', async (req, res)=>{
  const alquilable = req.body
  try {
    const newRecord = await db.Alquilable.create(alquilable);
    res.status(201).json(newRecord);
  } catch (error) {
    res.status(406).json(`El campo descripcion no puede ser null`);
  }
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

function createAlquilable(name,disponible,price) {
  db.Alquilable.create({
    descripcion: name,
    disponible: disponible,
    precio: price
  })
}

app.listen(3000, async ()=> {
  console.log(`La aplicacion arranco correctamente en el puerto 3000`);
  try {
    await db.sequelize.authenticate()
    await db.sequelize.sync({force:true}); //agarra los modelos y convertirlos siempre a tablas, sin el true solo se actualiza si la tabla no existe
    createAlquilable('Castillo Inflable',true,1200);
    createAlquilable('Toro Mecanico',true,2200);
    createAlquilable('Auto rojo',false,210200);
    createAlquilable('Auto gris',false,3200);
    createAlquilable('Auto blanco',false,30000);
  
  } catch (error) {
    console.log(error);
  }
})

