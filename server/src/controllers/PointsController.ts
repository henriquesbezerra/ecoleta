import { Request, Response } from 'express';
import knex from '../database/connection';

class PointsController{

    async index(request: Request, response: Response){       
        
        const { city, uf, items } = request.query;

        const parsedItems = String(items)
            .split(',')
            .map(item=> Number(item.trim()));


        const points = await knex('points')
            .join('point_items','points.id','=','point_items.point_id')
            .whereIn('point_items.item_id', parsedItems)
            .where('city', String(city))
            .where('uf', String(uf))
            .distinct()
            .select('points.*');
        
        
        return response.json(points);
    }

    async show(request: Request, response: Response){        
        const point = await knex('points').where('id', request.params.id ).first();
        if(!point){
            return response.status(400).json({error: 'Point Not Found'});
        }

        /**
         * SELECT * from items
         *  JOIN points_items ON items.id = point_items.item_id
         * WHERE point_items.point_id = {id}
         */

        const items = await knex('items')
            .join('point_items', 'items.id', '=', 'point_items.item_id')
            .where('point_items.point_id', request.params.id)
            .select('items.title');

        return response.json({point, items});
    }

    async create(request: Request, response: Response){
        const { 
            items,   
            name,
            email,
            whatsapp,
            latitude,
            longitute,
            number,
            city,
            uf  
        } = request.body;
        
        const trx = await knex.transaction();

        const insertedIds = await trx('points').insert({
            image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=400&q=60',
            name,
            email,
            whatsapp,
            latitude,
            longitute,
            number,
            city,
            uf 
        });

        const point_id = insertedIds[0];

        const pointItems = items.map((item_id: number)=>{
            return{
                item_id,
                point_id
            }
        });
        
        await trx('point_items').insert(pointItems);

        await trx.commit();      
        
        return response.json({
            id: point_id,
            name,
            email,
            whatsapp,
            latitude,
            longitute,
            number,
            city,
            uf 
        });
    }

  
}

export default PointsController;