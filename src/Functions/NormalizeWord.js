const normalize = (word) => {
    
    let hyphenWord = word.split(' ').join('-');
    
    let accents = 'ÀÁÂÃÄÅĄĀāàáâãäåąßÒÓÔÕÕÖØŐòóôőõöøĎďDŽdžÈÉÊËĘèéêëęðÇçČčĆćÐÌÍÎÏĪìíîïīÙÚÛÜŰùűúûüĽĹŁľĺłÑŇŃňńŔŕŠŚŞšśşŤťŸÝÿýŽŻŹžżźđĢĞģğ';
    let normal  = 'AAAAAAAAaaaaaaaasOOOOOOOOoooooooDdDZdzEEEEEeeeeeeCcCcCcDIIIIIiiiiiUUUUUuuuuuLLLlllNNNnnRrSSSsssTtYYyyZZZzzzdGGgg';
    
    let entries = [...accents].map((c,i) => [accents[i], normal[i]]);
    
    let accentsNormalObject = Object.fromEntries(entries);
    
    let result = [...hyphenWord].map(c => accentsNormalObject[c] || c).join('');
    
    return result.toLocaleLowerCase();
    
}

export default normalize;