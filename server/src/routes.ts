import express from 'express';

import PointsController from './controllers/PointsController';
import ItemsController from './controllers/ItemsController';


const routes = express.Router();

const pointsControler = new PointsController();
const itemsControler = new ItemsController();

routes.get('/', (request, response)=>{
    response.json({'hello':'world'});   
});

routes.get('/items', itemsControler.index);

routes.get('/points', pointsControler.index);
routes.get('/points/:id', pointsControler.show);
routes.post('/points', pointsControler.create);


export default routes;
