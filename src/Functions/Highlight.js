export const highlightMentions = (text) => {

    const format = {

        background: 'var(--lightBlue)',
        borderRadius: '6px',
        color: 'var(--blue)',
        padding: '3px'

    }

    let res;

    if(typeof text === 'string'){

        res = [];

        let arr = text.split(' ');

        arr.forEach((el, i) => {
            
            if(el.startsWith('@'))
                res = [...res, <span key = {i} style = {format}>{el}</span>, ' '];
            
            else if(res.length === 0)
                res[0] = el + ' ';

            else if(i !== arr.length - 1)
                res[res.length - 1] += el + ' ';
            
            else
                res[res.length - 1] += el;
        
        })
    }
    else{

        res = text;

    }

    return res;

}