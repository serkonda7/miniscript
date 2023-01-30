# Miniscript
Selfhosted source-to-source compiler for a minimal superset of JavaScript in 1k lines of code.

The prebuilt JS used for bootstrapping is in `out/`.

## Usage
```sh
Usage: node cli.js <command|file>

Examples:
   node cli.js foo.ms   Compile the file ´foo.ms´ into ´foo.js´.

Commands:
	self      Recompile the compiler.
	version   Print version information..
	help      Show this message.
```

## Feature Support and Compability
> This section is work in progress and doesn't reflect the actual feature set yet!

### Try...catch
```js
try {
	// try statements
} catch (exception_var) {
	// catch statements
} finally {
	// finally statements
}
```

Optional elements:
- `exception_var` and its surrounding parentheses, resulting in `catch {...}`
- `catch` block
- `finally` block

## License and Attribution
This project was inspired by [mini-js][repo-mini-js].

All files in this repository are subject to the [MIT License](LICENSE).

<!-- links -->
[repo-mini-js]: https://github.com/maierfelix/mini-js
