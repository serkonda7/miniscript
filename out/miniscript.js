let TokenKind = {
	eof: "eof",
	name: "name",
	string: "string",
	tmpl_string: "tmpl_string",
	number: "number",
	lpar: "(",
	rpar: ")",
	lbr: "[",
	rbr: "]",
	lcur: "{",
	rcur: "}",
	dot: ".",
	colon: ":",
	comma: ",",
	plus: "+",
	minus: "-",
	mul: "*",
	div: "/",
	and: "&&",
	or: "||",
	assign: "=",
	eq: "==",
	ne: "!=",
	not: "!",
	lt: "<",
	gt: ">",
	le: "<=",
	ge: ">=",
	key_let: "key_let",
	key_function: "key_function",
	key_export: "key_export",
	key_import: "key_import",
	key_as: "key_as",
	key_from: "key_from",
	key_if: "key_if",
	key_else: "key_else",
	key_while: "key_while",
	key_break: "key_break",
	key_continue: "key_continue",
	key_return: "key_return",
	key_new: "key_new",
	key_in: "key_in",
	key_null: "key_null",
	key_try: "key_try",
	key_catch: "key_catch",
	key_finally: "key_finally"
}
let keyword_kinds = {
	"let": TokenKind.key_let,
	"function": TokenKind.key_function,
	"export": TokenKind.key_export,
	"import": TokenKind.key_import,
	"as": TokenKind.key_as,
	"from": TokenKind.key_from,
	"if": TokenKind.key_if,
	"else": TokenKind.key_else,
	"while": TokenKind.key_while,
	"break": TokenKind.key_break,
	"continue": TokenKind.key_continue,
	"return": TokenKind.key_return,
	"new": TokenKind.key_new,
	"in": TokenKind.key_in,
	"null": TokenKind.key_null,
	"try": TokenKind.key_try,
	"catch": TokenKind.key_catch,
	"finally": TokenKind.key_finally
}
function t_get_keyword_kind(name) {
	if (name in keyword_kinds){
		return keyword_kinds[name]
	}
	return TokenKind.name
}

function t_is_whitespace(char) {
	return char == " "
}

function t_is_number(char) {
	return char >= "0" && char <= "9"
}

function t_is_name_start_char(char) {
	return char >= "A" && char <= "Z" || char >= "a" && char <= "z" || char == "_"
}

function t_is_name_char(char) {
	return t_is_name_start_char(char) || t_is_number(char)
}

function t_is_quote(char) {
	return char == "'" || char == "\""
}

function t_tokenize(text) {
	let i = -1
	let line_nr = 1
	let col = 0
	let tokens = []
	function push_token(kind, val) {
		tokens.push({
			kind: kind,
			val: val,
			line: line_nr,
			column: col
		})
	}

	function next() {
		i = i + 1
		col = col + 1
	}

	while (1) {
		next()
		let char = text.charAt(i)
		if (t_is_whitespace(char)){
			continue
		}
		if (char == "\n"){
			line_nr = line_nr + 1
			col = 0
			continue
		}
		if (char == "\t"){
			col = col + 3
			continue
		}
		if (t_is_name_start_char(char)){
			let start = i
			while (1) {
				if (!t_is_name_char(char)){
					i = i - 1
					col = col - 1
					break
				}
				next()
				char = text.charAt(i)
			}
			let val = text.slice(start, i + 1)
			let kind = t_get_keyword_kind(val)
			push_token(kind, val)
			continue
		}
		if (t_is_number(char) || char == "-" && t_is_number(text.charAt(i + 1))){
			let start = i
			if (char == "-"){
				next()
				char = text.charAt(i)
			}
			while (1) {
				if (!t_is_number(char)){
					i = i - 1
					col = col - 1
					break
				}
				next()
				char = text.charAt(i)
			}
			let val = text.slice(start, i + 1)
			push_token(TokenKind.number, val)
			continue
		}
		if (t_is_quote(char)){
			let start = i
			let quote = char
			while (1) {
				next()
				char = text.charAt(i)
				if (char == quote){
					break
				}
			}
			let val = text.slice(start + 1, i)
			push_token(TokenKind.string, val)
			continue
		}
		if (char == "`"){
			let start = i
			while (1) {
				next()
				char = text.charAt(i)
				if (char == "`"){
					break
				}
			}
			let val = text.slice(start + 1, i)
			push_token(TokenKind.tmpl_string, val)
			continue
		}
		if (char == "/"){
			if (text.charAt(i + 1) == "/"){
				while (1) {
					if (char == "\n"){
						col = 0
						line_nr = line_nr + 1
						break
					}
					next()
					char = text.charAt(i)
				}
				continue
			}
		}
		if (char == "("){
			push_token(TokenKind.lpar, "")
			continue
		} else if (char == ")"){
			push_token(TokenKind.rpar, "")
			continue
		} else if (char == "["){
			push_token(TokenKind.lbr, "")
			continue
		} else if (char == "]"){
			push_token(TokenKind.rbr, "")
			continue
		} else if (char == "{"){
			push_token(TokenKind.lcur, "")
			continue
		} else if (char == "}"){
			push_token(TokenKind.rcur, "")
			continue
		} else if (char == "."){
			push_token(TokenKind.dot, "")
			continue
		} else if (char == ":"){
			push_token(TokenKind.colon, "")
			continue
		} else if (char == ","){
			push_token(TokenKind.comma, "")
			continue
		} else if (char == "+"){
			push_token(TokenKind.plus, "")
			continue
		} else if (char == "-"){
			push_token(TokenKind.minus, "")
			continue
		} else if (char == "*"){
			push_token(TokenKind.mul, "")
			continue
		} else if (char == "/"){
			push_token(TokenKind.div, "")
			continue
		} else if (char == "&"){
			if (text.charAt(i + 1) == "&"){
				i = i + 1
				col = col + 1
				push_token(TokenKind.and, "")
				continue
			}
		} else if (char == "|"){
			if (text.charAt(i + 1) == "|"){
				i = i + 1
				col = col + 1
				push_token(TokenKind.or, "")
				continue
			}
		} else if (char == "="){
			if (text.charAt(i + 1) == "="){
				i = i + 1
				col = col + 1
				push_token(TokenKind.eq, "")
				continue
			}
			push_token(TokenKind.assign, "=")
			continue
		} else if (char == "!"){
			if (text.charAt(i + 1) == "="){
				i = i + 1
				col = col + 1
				push_token(TokenKind.ne, "")
				continue
			}
			push_token(TokenKind.not, "!")
			continue
		} else if (char == "<"){
			if (text.charAt(i + 1) == "="){
				i = i + 1
				col = col + 1
				push_token(TokenKind.le, "")
				continue
			}
			push_token(TokenKind.lt, "<")
			continue
		} else if (char == ">"){
			if (text.charAt(i + 1) == "="){
				i = i + 1
				col = col + 1
				push_token(TokenKind.ge, "")
				continue
			}
			push_token(TokenKind.gt, ">")
			continue
		}
		if (i >= text.length){
			break
		}
		console.error("unexpected char: " + char + " in " + line_nr + ":" + col)
	}
	push_token(TokenKind.eof, "")
	return tokens
}

let NodeKind = {
	file: "file",
	var_decl: "var_decl",
	literal: "literal",
	object_expr: "object_expr",
	obj_property: "obj_property",
	array_expr: "array_expr",
	binary_expr: "binary_expr",
	prefix_expr: "prefix_expr",
	return_stmt: "return_stmt",
	if_stmt: "if_stmt",
	break: "break",
	continue: "continue",
	while_stmt: "while_stmt",
	export_stmt: "export_stmt",
	import_stmt: "import_stmt",
	function_decl: "function_decl",
	member_expr: "member_expr",
	comp_member_expr: "comp_member_expr",
	call_expr: "call_expr",
	try_catch: "try_catch"
}
let p_idx = 0
let p_tokens = null
let p_tok = null
function p_parse(tokens) {
	p_tokens = tokens
	p_idx = -1
	p_next()
	let file = {
		kind: NodeKind.file,
		body: null
	}
	file.body = p_parse_stmt_list()
	return file
}

function p_next() {
	p_idx = p_idx + 1
	p_tok = p_tokens[p_idx]
}

function p_check(kind) {
	if (p_tok.kind != kind){
		console.error("Expected " + kind + " but got " + p_tok.kind + " in " + p_tok.line + ":" + p_tok.column)
		return null
	}
	p_next()
}

function p_check_name() {
	let n = p_tok.val
	p_check(TokenKind.name)
	return n
}

function p_parse_stmt_list() {
	let list = []
	while (1) {
		if (p_tok.kind == "eof"){
			break
		}
		if (p_tok.kind == TokenKind.rcur){
			break
		}
		node = p_parse_stmt()
		if (!node){
			break
		}
		list.push(node)
	}
	return list
}

function p_parse_stmt() {
	if (p_tok.kind == TokenKind.key_let){
		return p_variable_decl()
	}
	if (p_tok.kind == TokenKind.key_function){
		return p_function_decl()
	}
	if (p_tok.kind == TokenKind.key_return){
		return p_return_stmt()
	}
	if (p_tok.kind == TokenKind.key_if){
		return p_if_stmt()
	}
	if (p_tok.kind == TokenKind.key_while){
		return p_while_stmt()
	}
	if (p_tok.kind == TokenKind.key_export){
		return p_export()
	}
	if (p_tok.kind == TokenKind.key_import){
		return p_import()
	}
	if (p_tok.kind == TokenKind.key_try){
		return p_try_catch()
	}
	let node = p_parse_expr()
	if (node == null){
		console.error("Unexpected node " + p_tok.kind + " in " + p_tok.line + ":" + p_tok.column)
	}
	return node
}

function p_variable_decl() {
	p_next()
	let name = p_check_name()
	let node = {
		kind: NodeKind.var_decl,
		name: name,
		init: null
	}
	p_check(TokenKind.assign)
	node.init = p_parse_expr()
	return node
}

function p_function_decl() {
	p_check(TokenKind.key_function)
	let node = {
		kind: NodeKind.function_decl,
		name: null,
		params: null,
		body: null
	}
	if (p_tok.kind == TokenKind.name){
		node.name = p_tok.val
		p_next()
	}
	node.params = p_function_params()
	p_check(TokenKind.lcur)
	node.body = p_parse_stmt_list()
	p_check(TokenKind.rcur)
	return node
}

function p_function_params() {
	let params = []
	p_check(TokenKind.lpar)
	while (1) {
		if (p_tok.kind == TokenKind.rpar){
			break
		}
		let name = p_check_name()
		params.push(name)
		if (p_tok.kind != TokenKind.comma){
			break
		}
		p_next()
	}
	p_check(TokenKind.rpar)
	return params
}

function p_return_stmt() {
	p_check(TokenKind.key_return)
	let node = {
		kind: NodeKind.return_stmt,
		expr: p_parse_expr()
	}
	return node
}

function p_if_stmt() {
	let node = {
		kind: NodeKind.if_stmt,
		condition: null,
		alternate: null,
		consequent: null
	}
	if (p_tok.kind != TokenKind.key_if){
		node.consequent = p_parse_if_body()
		return node
	}
	p_next()
	p_check(TokenKind.lpar)
	node.condition = p_parse_expr()
	p_check(TokenKind.rpar)
	node.consequent = p_parse_if_body()
	if (p_tok.kind == TokenKind.key_else){
		p_next()
		node.alternate = p_if_stmt()
	}
	return node
}

function p_parse_if_body() {
	p_check(TokenKind.lcur)
	let node = p_parse_stmt_list()
	p_check(TokenKind.rcur)
	return node
}

function p_while_stmt() {
	let node = {
		kind: NodeKind.while_stmt,
		condition: null,
		body: null
	}
	p_check(TokenKind.key_while)
	node.condition = p_parse_expr()
	p_check(TokenKind.lcur)
	node.body = p_parse_stmt_list()
	p_check(TokenKind.rcur)
	return node
}

function p_export() {
	p_check(TokenKind.key_export)
	let node = {
		kind: NodeKind.export_stmt,
		init: null,
		idents: []
	}
	if (p_tok.kind == TokenKind.key_function){
		node.init = p_parse_stmt()
	} else if (p_tok.kind == TokenKind.lcur){
		p_next()
		while (p_tok.kind != TokenKind.rcur) {
			node.idents.push(p_parse_literal())
			if (p_tok.kind == TokenKind.comma){
				p_next()
			}
		}
		p_next()
	} else {
		console.error("Cannot export " + p_tok.kind)
	}
	return node
}

function p_import() {
	p_check(TokenKind.key_import)
	p_check(TokenKind.mul)
	p_check(TokenKind.key_as)
	let node = {
		kind: NodeKind.import_stmt,
		ident: null,
		mod_name: null
	}
	node.ident = p_parse_literal()
	p_check(TokenKind.key_from)
	node.mod_name = p_parse_literal()
	return node
}

function p_try_catch() {
	p_check(TokenKind.key_try)
	p_check(TokenKind.lcur)
	let node = {
		kind: NodeKind.try_catch,
		try_body: null,
		exception_var: null,
		catch_body: null,
		finally_body: null
	}
	node.try_body = p_parse_stmt_list()
	p_check(TokenKind.rcur)
	if (p_tok.kind == TokenKind.key_catch){
		p_next()
		if (p_tok.kind == TokenKind.lpar){
			p_next()
			node.exception_var = p_parse_literal()
			p_check(TokenKind.rpar)
		}
		p_check(TokenKind.lcur)
		node.catch_body = p_parse_stmt_list()
		p_check(TokenKind.rcur)
	}
	if (p_tok.kind == TokenKind.key_finally){
		p_next()
		p_check(TokenKind.lcur)
		node.finally_body = p_parse_stmt_list()
		p_check(TokenKind.rcur)
	}
	return node
}

function p_parse_expr() {
	if (p_tok.kind == TokenKind.key_break){
		return p_break_expr()
	}
	if (p_tok.kind == TokenKind.key_continue){
		return p_continue_expr()
	}
	if (p_tok.kind == TokenKind.key_function){
		return p_function_decl()
	}
	let node = p_parse_prefix()
	while (1) {
		if (p_tok.kind == TokenKind.eof){
			break
		}
		let expr = p_parse_infix(node)
		if (expr == null || expr == node){
			break
		}
		node = expr
	}
	return node
}

function p_break_expr() {
	p_check(TokenKind.key_break)
	return {
		kind: NodeKind.break
	}
}

function p_continue_expr() {
	p_check(TokenKind.key_continue)
	return {
		kind: NodeKind.continue
	}
}

function p_is_literal(kind) {
	return kind == TokenKind.string || kind == TokenKind.tmpl_string || kind == TokenKind.number || kind == TokenKind.name || kind == TokenKind.key_null
}

function p_is_prefix_op(kind) {
	return kind == TokenKind.not || kind == TokenKind.key_new
}

function p_parse_prefix() {
	if (p_is_literal(p_tok.kind)){
		return p_parse_literal()
	}
	if (p_tok.kind == TokenKind.lcur){
		return p_object_expr()
	}
	if (p_tok.kind == TokenKind.lbr){
		return p_array_expr()
	}
	if (p_tok.kind == TokenKind.lpar){
		p_next()
		let node = p_parse_expr()
		p_check(TokenKind.rpar)
		return node
	}
	if (p_is_prefix_op(p_tok.kind)){
		return p_parse_prefix_expr()
	}
	return null
}

function p_parse_literal() {
	let node = {
		kind: NodeKind.literal,
		lit_kind: p_tok.kind,
		val: p_tok.val
	}
	p_next()
	return node
}

function p_object_expr() {
	let node = {
		kind: NodeKind.object_expr,
		properties: []
	}
	p_check(TokenKind.lcur)
	while (1) {
		if (p_tok.kind == TokenKind.rcur){
			break
		}
		let prop = {
			kind: NodeKind.obj_property,
			name: p_parse_literal(),
			value: null
		}
		p_check(TokenKind.colon)
		prop.value = p_parse_expr()
		node.properties.push(prop)
		if (p_tok.kind != TokenKind.comma){
			break
		}
		p_next()
	}
	p_check(TokenKind.rcur)
	return node
}

function p_array_expr() {
	p_check(TokenKind.lbr)
	let node = {
		kind: NodeKind.array_expr,
		elements: []
	}
	while (1) {
		if (p_tok.kind == TokenKind.rbr){
			break
		}
		let element = {
			kind: NodeKind.array_element,
			value: p_parse_expr()
		}
		node.elements.push(element)
		if (p_tok.kind != TokenKind.comma){
			break
		}
		p_next()
	}
	p_check(TokenKind.rbr)
	return node
}

function p_parse_prefix_expr() {
	let node = {
		kind: NodeKind.prefix_expr,
		op: p_tok.kind,
		value: null
	}
	p_next()
	node.value = p_parse_literal()
	return node
}

function p_is_binary_operator(kind) {
	return kind == TokenKind.assign || kind == TokenKind.plus || kind == TokenKind.minus || kind == TokenKind.mul || kind == TokenKind.div || kind == TokenKind.or || kind == TokenKind.and || kind == TokenKind.lt || kind == TokenKind.le || kind == TokenKind.gt || kind == TokenKind.ge || kind == TokenKind.eq || kind == TokenKind.ne || kind == TokenKind.key_in
}

function p_parse_binary_expr(left) {
	let node = {
		kind: NodeKind.binary_expr,
		left: left,
		right: null,
		op: p_tok.kind
	}
	p_next()
	node.right = p_parse_expr()
	if (!node.right){
		console.log(p_tok)
	}
	return node
}

function p_parse_infix(left) {
	if (p_is_binary_operator(p_tok.kind)){
		return p_parse_binary_expr(left)
	}
	if (p_tok.kind == TokenKind.lpar){
		return p_parse_call_expr(left)
	}
	if (p_tok.kind == TokenKind.dot){
		return p_parse_member_expr(left)
	}
	if (p_tok.kind == TokenKind.lbr){
		return p_parse_computed_member_expr(left)
	}
	return left
}

function p_parse_call_expr(ident) {
	let node = {
		kind: NodeKind.call_expr,
		callee: ident,
		params: p_call_args()
	}
	return node
}

function p_call_args() {
	let params = []
	p_check(TokenKind.lpar)
	while (1) {
		if (p_tok.kind == TokenKind.rpar){
			break
		}
		let expr = p_parse_expr()
		params.push(expr)
		if (p_tok.kind != TokenKind.comma){
			break
		}
		p_next()
	}
	p_check(TokenKind.rpar)
	return params
}

function p_parse_member_expr(parent) {
	p_check(TokenKind.dot)
	let node = {
		kind: NodeKind.member_expr,
		parent: parent,
		member: p_parse_expr()
	}
	return node
}

function p_parse_computed_member_expr(parent) {
	p_check(TokenKind.lbr)
	let node = {
		kind: NodeKind.comp_member_expr,
		parent: parent,
		member: p_parse_expr()
	}
	p_check(TokenKind.rbr)
	return node
}

let g_out = ""
let g_indent = -1
let g_emptyline = 1
function g_write(str) {
	if (g_emptyline){
		let i = 0
		while (i < g_indent) {
			g_out = g_out + "\t"
			i = i + 1
		}
	}
	g_emptyline = 0
	g_out = g_out + str
}

function g_writeln(str) {
	g_write(str + "\n")
	g_emptyline = 1
}

function g_op_str(kind) {
	if (kind == TokenKind.key_in){
		return "in"
	}
	return kind
}

function g_gen(node) {
	g_out = ""
	g_generate_body(node.body)
	return g_out
}

function g_generate_body(body) {
	let i = 0
	while (i < body.length) {
		g_indent = g_indent + 1
		g_generate_node(body[i])
		g_indent = g_indent - 1
		i = i + 1
		g_writeln("")
	}
}

function g_generate_node(node) {
	let kind = node.kind
	if (kind == NodeKind.function_decl){
		g_write("function ")
		if (node.name){
			g_write(node.name)
		}
		g_write("(")
		let i = 0
		while (i < node.params.length) {
			g_write(node.params[i])
			if (i + 1 < node.params.length){
				g_write(", ")
			}
			i = i + 1
		}
		g_writeln(") {")
		g_generate_body(node.body)
		g_writeln("}")
	} else if (kind == NodeKind.var_decl){
		g_write("let ")
		g_write(node.name)
		g_write(" = ")
		g_generate_node(node.init)
	} else if (kind == NodeKind.if_stmt){
		if (node.condition){
			g_write("if (")
			g_generate_node(node.condition)
			g_write(")")
		}
		g_writeln("{")
		g_generate_body(node.consequent)
		g_write("}")
		if (node.alternate){
			g_write(" else ")
			g_generate_node(node.alternate)
		}
	} else if (kind == NodeKind.return_stmt){
		g_write("return ")
		if (node.expr){
			g_generate_node(node.expr)
		}
	} else if (kind == NodeKind.while_stmt){
		g_write("while (")
		g_generate_node(node.condition)
		g_writeln(") {")
		g_generate_body(node.body)
		g_write("}")
	} else if (kind == NodeKind.break){
		g_write("break")
	} else if (kind == NodeKind.continue){
		g_write("continue")
	} else if (kind == NodeKind.call_expr){
		g_generate_node(node.callee)
		g_write("(")
		let i = 0
		while (i < node.params.length) {
			g_generate_node(node.params[i])
			if (i + 1 < node.params.length){
				g_write(", ")
			}
			i = i + 1
		}
		g_write(")")
	} else if (kind == NodeKind.binary_expr){
		g_generate_node(node.left)
		g_write(" ")
		g_write(g_op_str(node.op))
		g_write(" ")
		g_generate_node(node.right)
	} else if (kind == NodeKind.member_expr){
		g_generate_node(node.parent)
		g_write(".")
		g_generate_node(node.member)
	} else if (kind == NodeKind.comp_member_expr){
		g_generate_node(node.parent)
		g_write("[")
		g_generate_node(node.member)
		g_write("]")
	} else if (kind == NodeKind.prefix_expr){
		if (node.op == TokenKind.key_new){
			g_write("new ")
		} else {
			g_write(node.op)
		}
		g_generate_node(node.value)
	} else if (kind == NodeKind.object_expr){
		g_writeln("{")
		g_indent = g_indent + 1
		let i = 0
		while (i < node.properties.length) {
			let prop = node.properties[i]
			g_generate_node(prop.name)
			g_write(": ")
			g_generate_node(prop.value)
			if (i + 1 < node.properties.length){
				g_writeln(",")
			} else {
				g_writeln("")
			}
			i = i + 1
		}
		g_indent = g_indent - 1
		g_write("}")
	} else if (kind == NodeKind.array_expr){
		g_write("[")
		let i = 0
		while (i < node.elements.length) {
			let el = node.elements[i]
			g_generate_node(el.value)
			if (i + 1 < node.elements.length){
				g_write(", ")
			}
			i = i + 1
		}
		g_write("]")
	} else if (kind == NodeKind.literal){
		if (node.lit_kind == TokenKind.string){
			g_write("\"")
			g_write(node.val.replace("\"", "\\\""))
			g_write("\"")
		} else if (node.lit_kind == TokenKind.tmpl_string){
			g_write("`")
			g_write(node.val)
			g_write("`")
		} else {
			g_write(node.val)
		}
	} else if (kind == NodeKind.export_stmt){
		if (node.init && node.init.kind == NodeKind.function_decl){
			g_write("module.exports.")
			g_write(node.init.name)
			g_write(" = ")
			g_generate_node(node.init)
		} else {
			g_write("module.exports = {")
			let i = 0
			while (i < node.idents.length) {
				let el = node.idents[i]
				g_generate_node(el)
				if (i + 1 < node.idents.length){
					g_write(", ")
				}
				i = i + 1
			}
			g_write("}")
		}
	} else if (kind == NodeKind.import_stmt){
		g_write("const ")
		g_generate_node(node.ident)
		g_write(" = require(")
		g_generate_node(node.mod_name)
		g_write(")")
	} else if (kind == NodeKind.try_catch){
		g_writeln("try {")
		g_generate_body(node.try_body)
		g_write("}")
		if (node.catch_body){
			g_write(" catch ")
			if (node.exception_var){
				g_write("(")
				g_generate_node(node.exception_var)
				g_write(")")
			}
			g_writeln("{")
			g_generate_body(node.catch_body)
			g_write("}")
		}
		if (node.finally_body){
			g_writeln(" finally { ")
			g_generate_body(node.finally_body)
			g_write("}")
		}
	} else {
		console.error("Unknown node kind " + kind)
	}
}

module.exports.compile = function compile(text) {
	let tokens = t_tokenize(text)
	const
	ast = p_parse(tokens)
	return g_gen(ast)
}

