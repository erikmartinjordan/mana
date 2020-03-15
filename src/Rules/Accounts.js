var accounts = {
    'free': {
        0: {
            'vote': true,
            'messages': {
                'maxLength': 550,
                'timeSpanPosts': 86400000,
                'timeSpanReplies': 300000,
            },
            'notifications': true,
            'points': true,
            'levels': true,
            'privilege': 'Sin anuncios'
        },
        5: {
            'vote': true,
            'messages': {
                'maxLength': 1100,
                'timeSpanPosts': 86400000,
                'timeSpanReplies': 300000,
            },
            'notifications': true,
            'points': true,
            'levels': true,
            'privilege': 'Publicaciones de 1100 caracteres'
        },
        10: {
            'vote': true,
            'messages': {
                'maxLength': 2200,
                'timeSpanPosts': 86400000,
                'timeSpanReplies': 300000,
            },
            'notifications': true,
            'points': true,
            'levels': true,
            'privilege': 'Publicaciones de 2200 caracteres'
        },
        15: {
            'vote': true,
            'messages': {
                'maxLength': 4400,
                'timeSpanPosts': 86400000,
                'timeSpanReplies': 300000,
            },
            'notifications': true,
            'points': true,
            'levels': true,
            'privilege': 'Publicaciones de 4400 caracteres'
        },
        20: {
            'vote': true,
            'messages': {
                'maxLength': 99999,
                'timeSpanPosts': 86400000,
                'timeSpanReplies': 300000,
            },
            'notifications': true,
            'points': true,
            'levels': true,
            'privilege': 'Publicaciones de longitud ∞'
        },
        25: {
            'vote': true,
            'messages': {
                'maxLength': 99999,
                'timeSpanPosts': 86400000,
                'timeSpanReplies': 0,
            },
            'notifications': true,
            'points': true,
            'levels': true,
            'privilege': 'Tiempo entre respuestas ilimitado'
        },
        30: {
            'vote': true,
            'messages': {
                'maxLength': 99999,
                'timeSpanPosts': 0,
                'timeSpanReplies': 0,
            },
            'notifications': true,
            'points': true,
            'levels': true,
            'privilege': 'Tiempo entre publicaciones ilimitado'
        },
        35: {
            'vote': true,
            'messages': {
                'maxLength': 99999,
                'timeSpanPosts': 0,
                'timeSpanReplies': 0,
            },
            'notifications': true,
            'points': true,
            'levels': true,
            'deleteMessages': true,
            'privilege': 'Borrado de mensajes'
        },
        40: {
            'vote': true,
            'messages': {
                'maxLength': 99999,
                'timeSpanPosts': 0,
                'timeSpanReplies': 0,
            },
            'notifications': true,
            'points': true,
            'levels': true,
            'deleteMessages': true,
            'edit': true,
            'privilege': 'Edición de mensajes'
        },
        45: {
            'vote': true,
            'messages': {
                'maxLength': 99999,
                'timeSpanPosts': 0,
                'timeSpanReplies': 0,
            },
            'notifications': true,
            'points': true,
            'levels': true,
            'deleteMessages': true,
            'edit': true,
            'mdformat': true,
            'privilege': 'Publicaciones con formato md'
        },
        50: {
            'vote': true,
            'messages': {
                'maxLength': 99999,
                'timeSpanPosts': 0,
                'timeSpanReplies': 0,
            },
            'notifications': true,
            'points': true,
            'levels': true,
            'deleteMessages': true,
            'edit': true,
            'mdformat': true,
            'badge': true,
            'privilege': 'Badge de usuario pro'
        }
    },
    'premium': {
        'vote': true,
        'messages': {
            'maxLength': 99999,
            'timeSpanPosts': 0,
            'timeSpanReplies': 0,
        },
        'notifications': true,
        'points': true,
        'levels': true,
        'anonymMessages': true,
        'deleteMessages': true,
        'profileViews': true,
        'badge': true,
        'nightMode': true,
        'edit': true,
        'mdformat': true,
        'privileges': ['Sin anuncios', 'Tiempo entre respuestas ilimitado', 'Tiempo entre publicaciones ilimitado', 'Edición de mensajes', 'Borado de mensajes', 'Publicaciones con formato md', 'Badge de usuario pro', 'Mensajes anónimos']
    }
}

export default accounts;