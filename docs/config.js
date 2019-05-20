const langs = [
    { title: '简体中文', path: '/home', matchPath: /^\/(home|ecosystem|support)/ },
    { title: 'English', path: '/en/', matchPath: /^\/en/ },
];

docute.init({
    landing: 'landing.html',
    title: 'wIoT',
    repo: 'iotcat/wIoT',
    twitter: 'iotcat',
    'edit-link': 'https://github.com/IoTcat/wIoT/blob/master/docs/',
    nav: {
        default: [
            {
                title: 'Home', path: '/home'
            },
            {
                title: 'Ecosystem', path: '/ecosystem'
            },
            {
                title: 'Support wIoT', path: '/support'
            },
            {
                title: 'Languages', type: 'dropdown', items: langs
            }
        ],
        'zh-Hans': [
            {
                title: '首页', path: '/en/'
            },
            {
                title: '生态', path: '/en/ecosystem'
            },
            {
                title: '支持 wIoT', path: '/en/support'
            },
            {
                title: '选择语言', type: 'dropdown', items: langs
            }
        ],
    },
    plugins: [
        docsearch({
            apiKey: '46a8ba306e368972c1d75feb581fb430',
            indexName: 'wiot',
            tags: ['english', 'zh-Hans'],
            url: 'http://wiot.eee.dog'
        }),
        evanyou()
    ]
});

function loadScript (src, callback) {
    let s,
        r,
        t;
    r = false;
    s = document.createElement('script');
    s.type = 'text/javascript';
    s.src = src;
    s.onload = s.onreadystatechange = function () {
    // console.log( this.readyState ); //uncomment this line to see which ready states are called.
        if (!r && (!this.readyState || this.readyState == 'complete'))
        {
            r = true;
            callback();
        }
    };
    t = document.getElementsByTagName('script')[0];
    t.parentNode.insertBefore(s, t);
}