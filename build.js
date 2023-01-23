// This file is part of miniscript.
// The content is subject to the terms of the MIT license.
// Copyright (c) 2023-present Lukas Neubert.

const fs = require('fs')
const vm = require('vm')
const bootstrap = require('./bin/bootstrap.js')

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

fs.writeFileSync('bin/bootstrap.js', res, 'utf-8')
console.log("Successfully recompiled")
