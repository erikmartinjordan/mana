const unmount = async (setAnimation, hide, callback = console.log) => {

    callback()

    setAnimation('Unmount')

    await new Promise(r => setTimeout(r, 300))

    hide()

    setAnimation('')

}

export default unmount