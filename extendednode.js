//Working jon v1
const path = require("path")
const fs = require('fs')

const jsonTree = {
    obj1: "bob",
    obj2: {
        obj3: "bob 3",
        obj4: "bob 4"
    }
}

class ExtendedNode {

    walk(obj, type = "dir", args = {}) {
        function walkJSON(options) {
            const keyList = Object.keys(obj)

            let doneList = []
            let loopList = []

            for (const key of keyList) {
                loopList.push({ key: key, path: [key], obj: obj[key] })
            }

            let didClean = false;

            function simplify() {
                didClean = true;

                for (const obj of loopList) {
                    if (typeof obj.obj !== "object") {
                        doneList.push(path.join(...obj.path, obj.obj))

                        loopList = loopList.filter(item => item !== obj)

                    } else {
                        didClean = false;

                        let newList = Object.keys(obj.obj)
                        for (const key of newList) {
                            loopList.push({ key: key, path: [...obj.path, key], obj: obj.obj[key] })
                        }
                        loopList = loopList.filter(item => item !== obj)

                    }
                }

                if (didClean) {
                    return doneList
                }
            }

            while (!didClean) {
                const done = simplify()
                if (done) {
                    return done
                }
            }


        }

        function walkDir2(objpath) {
            if(!fs.statSync(objpath).isDirectory()) {
                throw Error("es.walk(path) > path must be path for a folder not file!")
            }

            let loopList = fs.readdirSync(obj).map(item => {
                return { name: item, path: [obj] }
            })
            let doneList = []
            
            function run() {
                doneList.push(...loopList.reduce((acc, obj) => {
                    const objPath = path.join(...obj.path, obj.name)
    
                    if (fs.statSync(objPath).isFile()) {
                        acc.push(objPath)
    
                    } else if (fs.statSync(objPath).isDirectory()) {
                        console.log(objPath)
    
                        loopList.push(...fs.readdirSync(objPath).map(item => {return {name: item, path: [objPath]}} ))
                    }
    
                    loopList = loopList.filter(item => item !== obj)
                    
                    return acc
                }, []))
            }

            while (loopList.length > 0) {
                run()
            }

            return doneList
        }

        function walkDir(options) {

            let loopList = fs.readdirSync(obj).map(item => {
                return { name: item, path: [obj] }
            })

            let doneList = []
            let didClean = false;

            function simplify() {
                didClean = true;

                for (const obj of loopList) {
                    const fullPath = path.join(...obj.path, obj.name)

                    if (fs.statSync(fullPath).isFile()) {

                        doneList.push(fullPath)

                        loopList = loopList.filter(item => item !== obj)

                    } else if (fs.statSync(fullPath).isDirectory()) {
                        didClean = false;

                        fs.readdirSync(fullPath).forEach(item => {
                            loopList.push({ name: item, path: [...obj.path, obj.name] })
                        })

                        loopList = loopList.filter(item => item !== obj)
                    }
                }

                if (didClean) {
                    return doneList
                }
            }

            while (!didClean) {
                const done = simplify()
                if (done) {
                    return done
                }
            }
        }




        type = type.toLowerCase()
        if (type == "json") {
            return walkJSON(args)
        } else if (type == "dir") {
            return walkDir2(obj)
        }

    }
}





module.exports = new ExtendedNode()
