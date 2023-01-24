// This file is part of miniscript.
// The content is subject to the terms of the MIT license.
// Copyright (c) 2023-present Lukas Neubert.

const fs = require('fs')
const vm = require('vm')
const bootstrap = require('./bin/miniscript.js')

let help_text = `Usage: node cli.js <command>

Commands:
	self   Recompile the compiler.
	help   Show this message.`

function recompile_self(){
	let res = ''

	try {
		const text = fs.readFileSync('src/miniscript.ms', 'utf-8')
		res = bootstrap.compile(text)
		const context = {
			module: {exports: {}}
		}
		vm.runInNewContext(res, context)
		context.module.exports.compile(text, context)
	} catch (e) {
		console.log(e)
		return
	}

	fs.writeFileSync('bin/miniscript.js', res, 'utf-8')
	console.log("Successfully recompiled")
}

function main() {
	const args = process.argv.slice(2)
	if (args.length == 0 || args[0] == 'help') {
		console.log(help_text)
	} else if (args[0] == 'self') {
		recompile_self()
	} else {
		console.error('Unknown command ' + args[0])
	}
}

main()
