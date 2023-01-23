const fs = require('fs')
const vm = require('vm')
const prebuild = require('./bin/prebuild.js')

let res = ''

try {
	const text = fs.readFileSync('miniscript.ms', 'utf-8')
	res = prebuild.compile(text)
	const context = {
		module: {exports: {}}
	}
	vm.runInNewContext(res, context)
	context.module.exports.compile(text, context)
} catch (e) {
	console.log(e)
	return
}

fs.writeFileSync('bin/prebuild.js', res, 'utf-8')
console.log("Successfully recompiled")
