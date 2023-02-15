const es = require('../Applications/NodeModules/ExtendedNode/v2/extendednode')

const files = es.walk('api', {
  type: "dir",
	advancedData: true,
  relative: true,
  posix: true
})

//Error when not: posix

console.log(files)
