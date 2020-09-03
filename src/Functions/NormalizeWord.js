const normalize = (word) => {
    
    // Removing spaces and adding hyphen
    let hyphenWord = word.split(' ').join('-');
    
    // Defining accents and normal chars
    let accents = 'ÀÁÂÃÄÅĄĀāàáâãäåąßÒÓÔÕÕÖØŐòóôőõöøĎďDŽdžÈÉÊËĘèéêëęðÇçČčĆćÐÌÍÎÏĪìíîïīÙÚÛÜŰùűúûüĽĹŁľĺłÑŇŃňńŔŕŠŚŞšśşŤťŸÝÿýŽŻŹžżźđĢĞģğ';
    let normal  = 'AAAAAAAAaaaaaaaasOOOOOOOOoooooooDdDZdzEEEEEeeeeeeCcCcCcDIIIIIiiiiiUUUUUuuuuuLLLlllNNNnnRrSSSsssTtYYyyZZZzzzdGGgg';
    
    // Defining entries as a pair of key, value => [[À, A], [Á, A] ... [ğ, g]]
    let entries = [...accents].map((c,i) => [accents[i], normal[i]]);
    
    // Building the object
    let accentsNormalObject = Object.fromEntries(entries);
    
    // Transforming the word
    let result = [...hyphenWord].map(c => accentsNormalObject[c] || c).join('');
    
    return result.toLocaleLowerCase();
    
}

export default normalize;