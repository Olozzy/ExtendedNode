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

        function walkDir(options) {
            const keyList = fs.readdirSync(obj)

            let doneList = []
            let loopList = []

            for (const key of keyList) {
                loopList.push({ name: key, path: [obj] })
            }

            let didClean = false;

            function simplify() {
                didClean = true;

                for (const obj of loopList) {
                    const fullPath = path.join(...obj.path, obj.name)

                    if (!fs.statSync(fullPath).isDirectory()) {

                        doneList.push(fullPath)

                        loopList = loopList.filter(item => item !== obj)

                    } else {
                        didClean = false;

                        let newList = fs.readdirSync(fullPath)
                        for (const key of newList) {
                            loopList.push({ name: key, path: [...obj.path, obj.name] })
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




        type = type.toLowerCase()
        if (type == "json") {
            return walkJSON(args)
        } else if (type == "dir") {
            return walkDir(args)
        }

    }
}





module.exports = new ExtendedNode()