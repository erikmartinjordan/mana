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
            'levels': true
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
            'levels': true
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
            'levels': true
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
            'levels': true
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
            'levels': true
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
            'levels': true
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
            'levels': true
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
            'deleteMessages': true
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
            'mdformat': true
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
            'badge': true
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
        'mdformat': true
    }
}

export default accounts;