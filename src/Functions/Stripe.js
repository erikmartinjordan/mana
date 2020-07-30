import { environment } from '../Functions/Firebase';

let config = {
    
    'PRE':{
        'apiKey': 'pk_test_6pnYp66tdBEK5pSfB1RU4tQw00LTl4BKQD',
        'plans': {
            'premium':{
                'prices':{
                    '9': {id: 'price_1HAH53JPlUf3HGzJKlttJGtb' , value: 9},
                    '19': {id: 'price_1H9traJPlUf3HGzJivfYjws0', value: 19}
                }
            },
            'infinita':{
                'prices':{
                    '29': {id: 'price_1H9tupJPlUf3HGzJ13WmQIjC', value: 29},
                    '39': {id: 'price_1HAH4hJPlUf3HGzJUJIvRu3O', value: 39}
                }
            }
        }
    },
    
    'PRO':{
        'apiKey': 'pk_live_Hh2RhmFjzbX3kO24alpCEQLq003bNwQwf8',
        'plans': {
            'premium':{
                'prices':{
                    '12': {id: 'price_1HAdUoJPlUf3HGzJHqoW7kr7', value: 12},
                    '19': {id: 'price_1H9pebJPlUf3HGzJtOXxc5vn', value: 19}
                }
            },
            'infinita':{
                'prices':{
                    '24': {id: 'price_1HAdVCJPlUf3HGzJQheBPLuV', value: 24},
                    '29': {id: 'price_1H9pd6JPlUf3HGzJX2pcdOKY', value: 29}
                }
            }
        }
    }
    
}

export const apiKey  = environment === 'PRE' 
? config.PRE.apiKey 
: config.PRO.apiKey;

export const premium = environment === 'PRE' 
? config.PRE.plans.premium.prices['9'] 
: config.PRO.plans.premium.prices['12'];

export const infinita = environment === 'PRE' 
? config.PRE.plans.infinita.prices['39'] 
: config.PRO.plans.infinita.prices['24'];