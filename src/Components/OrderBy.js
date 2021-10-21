import React, { useEffect, useState }  from 'react'
import moment                          from 'moment'
import { TriangleDownIcon }            from '@primer/octicons-react'
import '../Styles/OrderBy.css'

const OrderBy = ({filter, setFilter, setFrom, setTo}) => {

    const [date, setDate] = useState('M')

    useEffect(() => {

        if(date === 'D') var [from, to] = [moment().subtract(1, 'day' ).valueOf(),  moment().valueOf()]
        if(date === 'W') var [from, to] = [moment().subtract(1, 'week').valueOf(),  moment().valueOf()]
        if(date === 'M') var [from, to] = [moment().subtract(1, 'month').valueOf(), moment().valueOf()]

        if(filter === 'nuevo'){

            setFrom(null)
            setTo(null)

        }
        else{

            setFrom(from)
            setTo(to)

        }

    }, [filter, date])

    return (
        <div className = 'OrderBy'>
            <div onClick = {() => setFilter('nuevo')}       className = {filter === 'nuevo'      ? 'Selected' : null}>Nuevo</div>
            <div onClick = {() => setFilter('puntos')}      className = {filter === 'puntos'     ? 'Selected' : null}>Puntuación</div>
            <div onClick = {() => setFilter('respuestas')}  className = {filter === 'respuestas' ? 'Selected' : null}>Respuestas </div>
            { filter === 'puntos' || filter === 'respuestas'
            ? <form>
                <label>
                    <div className = 'Selector'>
                        <select value = {date} onChange = {(e) => setDate(e.target.value)}>
                            <option value = 'D'>Hoy</option>
                            <option value = 'W'>Esta semana</option>
                            <option value = 'M'>Este mes</option>
                        </select>
                        <TriangleDownIcon/>
                    </div>
                </label>
              </form>
            : null
            }
        </div>
    )
    
}

export default OrderBy