var accounts = {
                    'free': {
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
                        'edit': true
                    }
                }

export default accounts;