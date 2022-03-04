const config = {
    clientRedirects:[
        {
            urlSrc:"/",
            redirectTo:"/examples/index.html"
        }
    ],
    textReplacements: [
        {
            queryVar:"r",
            queryVarRegexp:/^0\.[0-9]{3}$/,
            replaceRegexp:/0\.119/g,
            defaultValue:"0.119",
            pathRegexp:/\.(html|jsm?)|(\/)$/
        },{
            replaceRegexp:/\<!-- DEVSRVMONITOR -->/g,
            defaultValue:'<script type="text/javascript" src="../../js/devsrv-monitor.js"></script>',
            pathRegexp:/\.(html|jsm?)|(\/)$/
        }
    ],
    buildOptions:{
        src:"./examples",
        dst:"./dist/v1.0.0/threejs.119",
        replaceRegexp:/THREEJSVERSION/g,
        defaultValue:"0.119",
        fileRegexp:/\.(html|js)$/
    }, 
    monitorOptions:{
        enable:true,
        directories:[ './' ],
        fileRegexp:/\.(html|jsm?)$/,
        excludeRegexp:/node_modules/
    }
}

module.exports = config;