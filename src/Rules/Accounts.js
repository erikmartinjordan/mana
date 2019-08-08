var accounts = {
                    'free': {
                        'vote': true,
                        'meessages': {
                            'maxLength': 550,
                            'timeSpanPosts': 86400000,
                            'timeSpanReplies': 300000,
                        },
                        'notifications': true,
                        'points': true,
                        'levels': true
                    },
                    'premium': {
                        'vote': true,
                        'meessages': {
                            'maxLength': 'unlimited',
                            'timeSpanPosts': 'unlimited',
                            'timeSpanReplies': 'unlimited',
                        },
                        'notifications': true,
                        'points': true,
                        'levels': true,
                        'anonymMessages': true,
                        'deleteMessages': true,
                        'profileViews': true,
                        'badge': true,
                        'nightMode': true
                    }
                }

export default accounts;