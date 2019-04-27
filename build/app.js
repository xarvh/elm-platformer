(function(scope){
'use strict';

function F(arity, fun, wrapper) {
  wrapper.a = arity;
  wrapper.f = fun;
  return wrapper;
}

function F2(fun) {
  return F(2, fun, function(a) { return function(b) { return fun(a,b); }; })
}
function F3(fun) {
  return F(3, fun, function(a) {
    return function(b) { return function(c) { return fun(a, b, c); }; };
  });
}
function F4(fun) {
  return F(4, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return fun(a, b, c, d); }; }; };
  });
}
function F5(fun) {
  return F(5, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return fun(a, b, c, d, e); }; }; }; };
  });
}
function F6(fun) {
  return F(6, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return function(f) {
    return fun(a, b, c, d, e, f); }; }; }; }; };
  });
}
function F7(fun) {
  return F(7, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return function(f) {
    return function(g) { return fun(a, b, c, d, e, f, g); }; }; }; }; }; };
  });
}
function F8(fun) {
  return F(8, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return function(f) {
    return function(g) { return function(h) {
    return fun(a, b, c, d, e, f, g, h); }; }; }; }; }; }; };
  });
}
function F9(fun) {
  return F(9, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return function(f) {
    return function(g) { return function(h) { return function(i) {
    return fun(a, b, c, d, e, f, g, h, i); }; }; }; }; }; }; }; };
  });
}

function A2(fun, a, b) {
  return fun.a === 2 ? fun.f(a, b) : fun(a)(b);
}
function A3(fun, a, b, c) {
  return fun.a === 3 ? fun.f(a, b, c) : fun(a)(b)(c);
}
function A4(fun, a, b, c, d) {
  return fun.a === 4 ? fun.f(a, b, c, d) : fun(a)(b)(c)(d);
}
function A5(fun, a, b, c, d, e) {
  return fun.a === 5 ? fun.f(a, b, c, d, e) : fun(a)(b)(c)(d)(e);
}
function A6(fun, a, b, c, d, e, f) {
  return fun.a === 6 ? fun.f(a, b, c, d, e, f) : fun(a)(b)(c)(d)(e)(f);
}
function A7(fun, a, b, c, d, e, f, g) {
  return fun.a === 7 ? fun.f(a, b, c, d, e, f, g) : fun(a)(b)(c)(d)(e)(f)(g);
}
function A8(fun, a, b, c, d, e, f, g, h) {
  return fun.a === 8 ? fun.f(a, b, c, d, e, f, g, h) : fun(a)(b)(c)(d)(e)(f)(g)(h);
}
function A9(fun, a, b, c, d, e, f, g, h, i) {
  return fun.a === 9 ? fun.f(a, b, c, d, e, f, g, h, i) : fun(a)(b)(c)(d)(e)(f)(g)(h)(i);
}

console.warn('Compiled in DEV mode. Follow the advice at https://elm-lang.org/0.19.0/optimize for better performance and smaller assets.');


var _List_Nil_UNUSED = { $: 0 };
var _List_Nil = { $: '[]' };

function _List_Cons_UNUSED(hd, tl) { return { $: 1, a: hd, b: tl }; }
function _List_Cons(hd, tl) { return { $: '::', a: hd, b: tl }; }


var _List_cons = F2(_List_Cons);

function _List_fromArray(arr)
{
	var out = _List_Nil;
	for (var i = arr.length; i--; )
	{
		out = _List_Cons(arr[i], out);
	}
	return out;
}

function _List_toArray(xs)
{
	for (var out = []; xs.b; xs = xs.b) // WHILE_CONS
	{
		out.push(xs.a);
	}
	return out;
}

var _List_map2 = F3(function(f, xs, ys)
{
	for (var arr = []; xs.b && ys.b; xs = xs.b, ys = ys.b) // WHILE_CONSES
	{
		arr.push(A2(f, xs.a, ys.a));
	}
	return _List_fromArray(arr);
});

var _List_map3 = F4(function(f, xs, ys, zs)
{
	for (var arr = []; xs.b && ys.b && zs.b; xs = xs.b, ys = ys.b, zs = zs.b) // WHILE_CONSES
	{
		arr.push(A3(f, xs.a, ys.a, zs.a));
	}
	return _List_fromArray(arr);
});

var _List_map4 = F5(function(f, ws, xs, ys, zs)
{
	for (var arr = []; ws.b && xs.b && ys.b && zs.b; ws = ws.b, xs = xs.b, ys = ys.b, zs = zs.b) // WHILE_CONSES
	{
		arr.push(A4(f, ws.a, xs.a, ys.a, zs.a));
	}
	return _List_fromArray(arr);
});

var _List_map5 = F6(function(f, vs, ws, xs, ys, zs)
{
	for (var arr = []; vs.b && ws.b && xs.b && ys.b && zs.b; vs = vs.b, ws = ws.b, xs = xs.b, ys = ys.b, zs = zs.b) // WHILE_CONSES
	{
		arr.push(A5(f, vs.a, ws.a, xs.a, ys.a, zs.a));
	}
	return _List_fromArray(arr);
});

var _List_sortBy = F2(function(f, xs)
{
	return _List_fromArray(_List_toArray(xs).sort(function(a, b) {
		return _Utils_cmp(f(a), f(b));
	}));
});

var _List_sortWith = F2(function(f, xs)
{
	return _List_fromArray(_List_toArray(xs).sort(function(a, b) {
		var ord = A2(f, a, b);
		return ord === elm$core$Basics$EQ ? 0 : ord === elm$core$Basics$LT ? -1 : 1;
	}));
});



// EQUALITY

function _Utils_eq(x, y)
{
	for (
		var pair, stack = [], isEqual = _Utils_eqHelp(x, y, 0, stack);
		isEqual && (pair = stack.pop());
		isEqual = _Utils_eqHelp(pair.a, pair.b, 0, stack)
		)
	{}

	return isEqual;
}

function _Utils_eqHelp(x, y, depth, stack)
{
	if (depth > 100)
	{
		stack.push(_Utils_Tuple2(x,y));
		return true;
	}

	if (x === y)
	{
		return true;
	}

	if (typeof x !== 'object' || x === null || y === null)
	{
		typeof x === 'function' && _Debug_crash(5);
		return false;
	}

	/**/
	if (x.$ === 'Set_elm_builtin')
	{
		x = elm$core$Set$toList(x);
		y = elm$core$Set$toList(y);
	}
	if (x.$ === 'RBNode_elm_builtin' || x.$ === 'RBEmpty_elm_builtin')
	{
		x = elm$core$Dict$toList(x);
		y = elm$core$Dict$toList(y);
	}
	//*/

	/**_UNUSED/
	if (x.$ < 0)
	{
		x = elm$core$Dict$toList(x);
		y = elm$core$Dict$toList(y);
	}
	//*/

	for (var key in x)
	{
		if (!_Utils_eqHelp(x[key], y[key], depth + 1, stack))
		{
			return false;
		}
	}
	return true;
}

var _Utils_equal = F2(_Utils_eq);
var _Utils_notEqual = F2(function(a, b) { return !_Utils_eq(a,b); });



// COMPARISONS

// Code in Generate/JavaScript.hs, Basics.js, and List.js depends on
// the particular integer values assigned to LT, EQ, and GT.

function _Utils_cmp(x, y, ord)
{
	if (typeof x !== 'object')
	{
		return x === y ? /*EQ*/ 0 : x < y ? /*LT*/ -1 : /*GT*/ 1;
	}

	/**/
	if (x instanceof String)
	{
		var a = x.valueOf();
		var b = y.valueOf();
		return a === b ? 0 : a < b ? -1 : 1;
	}
	//*/

	/**_UNUSED/
	if (!x.$)
	//*/
	/**/
	if (x.$[0] === '#')
	//*/
	{
		return (ord = _Utils_cmp(x.a, y.a))
			? ord
			: (ord = _Utils_cmp(x.b, y.b))
				? ord
				: _Utils_cmp(x.c, y.c);
	}

	// traverse conses until end of a list or a mismatch
	for (; x.b && y.b && !(ord = _Utils_cmp(x.a, y.a)); x = x.b, y = y.b) {} // WHILE_CONSES
	return ord || (x.b ? /*GT*/ 1 : y.b ? /*LT*/ -1 : /*EQ*/ 0);
}

var _Utils_lt = F2(function(a, b) { return _Utils_cmp(a, b) < 0; });
var _Utils_le = F2(function(a, b) { return _Utils_cmp(a, b) < 1; });
var _Utils_gt = F2(function(a, b) { return _Utils_cmp(a, b) > 0; });
var _Utils_ge = F2(function(a, b) { return _Utils_cmp(a, b) >= 0; });

var _Utils_compare = F2(function(x, y)
{
	var n = _Utils_cmp(x, y);
	return n < 0 ? elm$core$Basics$LT : n ? elm$core$Basics$GT : elm$core$Basics$EQ;
});


// COMMON VALUES

var _Utils_Tuple0_UNUSED = 0;
var _Utils_Tuple0 = { $: '#0' };

function _Utils_Tuple2_UNUSED(a, b) { return { a: a, b: b }; }
function _Utils_Tuple2(a, b) { return { $: '#2', a: a, b: b }; }

function _Utils_Tuple3_UNUSED(a, b, c) { return { a: a, b: b, c: c }; }
function _Utils_Tuple3(a, b, c) { return { $: '#3', a: a, b: b, c: c }; }

function _Utils_chr_UNUSED(c) { return c; }
function _Utils_chr(c) { return new String(c); }


// RECORDS

function _Utils_update(oldRecord, updatedFields)
{
	var newRecord = {};

	for (var key in oldRecord)
	{
		newRecord[key] = oldRecord[key];
	}

	for (var key in updatedFields)
	{
		newRecord[key] = updatedFields[key];
	}

	return newRecord;
}


// APPEND

var _Utils_append = F2(_Utils_ap);

function _Utils_ap(xs, ys)
{
	// append Strings
	if (typeof xs === 'string')
	{
		return xs + ys;
	}

	// append Lists
	if (!xs.b)
	{
		return ys;
	}
	var root = _List_Cons(xs.a, ys);
	xs = xs.b
	for (var curr = root; xs.b; xs = xs.b) // WHILE_CONS
	{
		curr = curr.b = _List_Cons(xs.a, ys);
	}
	return root;
}



var _JsArray_empty = [];

function _JsArray_singleton(value)
{
    return [value];
}

function _JsArray_length(array)
{
    return array.length;
}

var _JsArray_initialize = F3(function(size, offset, func)
{
    var result = new Array(size);

    for (var i = 0; i < size; i++)
    {
        result[i] = func(offset + i);
    }

    return result;
});

var _JsArray_initializeFromList = F2(function (max, ls)
{
    var result = new Array(max);

    for (var i = 0; i < max && ls.b; i++)
    {
        result[i] = ls.a;
        ls = ls.b;
    }

    result.length = i;
    return _Utils_Tuple2(result, ls);
});

var _JsArray_unsafeGet = F2(function(index, array)
{
    return array[index];
});

var _JsArray_unsafeSet = F3(function(index, value, array)
{
    var length = array.length;
    var result = new Array(length);

    for (var i = 0; i < length; i++)
    {
        result[i] = array[i];
    }

    result[index] = value;
    return result;
});

var _JsArray_push = F2(function(value, array)
{
    var length = array.length;
    var result = new Array(length + 1);

    for (var i = 0; i < length; i++)
    {
        result[i] = array[i];
    }

    result[length] = value;
    return result;
});

var _JsArray_foldl = F3(function(func, acc, array)
{
    var length = array.length;

    for (var i = 0; i < length; i++)
    {
        acc = A2(func, array[i], acc);
    }

    return acc;
});

var _JsArray_foldr = F3(function(func, acc, array)
{
    for (var i = array.length - 1; i >= 0; i--)
    {
        acc = A2(func, array[i], acc);
    }

    return acc;
});

var _JsArray_map = F2(function(func, array)
{
    var length = array.length;
    var result = new Array(length);

    for (var i = 0; i < length; i++)
    {
        result[i] = func(array[i]);
    }

    return result;
});

var _JsArray_indexedMap = F3(function(func, offset, array)
{
    var length = array.length;
    var result = new Array(length);

    for (var i = 0; i < length; i++)
    {
        result[i] = A2(func, offset + i, array[i]);
    }

    return result;
});

var _JsArray_slice = F3(function(from, to, array)
{
    return array.slice(from, to);
});

var _JsArray_appendN = F3(function(n, dest, source)
{
    var destLen = dest.length;
    var itemsToCopy = n - destLen;

    if (itemsToCopy > source.length)
    {
        itemsToCopy = source.length;
    }

    var size = destLen + itemsToCopy;
    var result = new Array(size);

    for (var i = 0; i < destLen; i++)
    {
        result[i] = dest[i];
    }

    for (var i = 0; i < itemsToCopy; i++)
    {
        result[i + destLen] = source[i];
    }

    return result;
});



// LOG

var _Debug_log_UNUSED = F2(function(tag, value)
{
	return value;
});

var _Debug_log = F2(function(tag, value)
{
	console.log(tag + ': ' + _Debug_toString(value));
	return value;
});


// TODOS

function _Debug_todo(moduleName, region)
{
	return function(message) {
		_Debug_crash(8, moduleName, region, message);
	};
}

function _Debug_todoCase(moduleName, region, value)
{
	return function(message) {
		_Debug_crash(9, moduleName, region, value, message);
	};
}


// TO STRING

function _Debug_toString_UNUSED(value)
{
	return '<internals>';
}

function _Debug_toString(value)
{
	return _Debug_toAnsiString(false, value);
}

function _Debug_toAnsiString(ansi, value)
{
	if (typeof value === 'function')
	{
		return _Debug_internalColor(ansi, '<function>');
	}

	if (typeof value === 'boolean')
	{
		return _Debug_ctorColor(ansi, value ? 'True' : 'False');
	}

	if (typeof value === 'number')
	{
		return _Debug_numberColor(ansi, value + '');
	}

	if (value instanceof String)
	{
		return _Debug_charColor(ansi, "'" + _Debug_addSlashes(value, true) + "'");
	}

	if (typeof value === 'string')
	{
		return _Debug_stringColor(ansi, '"' + _Debug_addSlashes(value, false) + '"');
	}

	if (typeof value === 'object' && '$' in value)
	{
		var tag = value.$;

		if (typeof tag === 'number')
		{
			return _Debug_internalColor(ansi, '<internals>');
		}

		if (tag[0] === '#')
		{
			var output = [];
			for (var k in value)
			{
				if (k === '$') continue;
				output.push(_Debug_toAnsiString(ansi, value[k]));
			}
			return '(' + output.join(',') + ')';
		}

		if (tag === 'Set_elm_builtin')
		{
			return _Debug_ctorColor(ansi, 'Set')
				+ _Debug_fadeColor(ansi, '.fromList') + ' '
				+ _Debug_toAnsiString(ansi, elm$core$Set$toList(value));
		}

		if (tag === 'RBNode_elm_builtin' || tag === 'RBEmpty_elm_builtin')
		{
			return _Debug_ctorColor(ansi, 'Dict')
				+ _Debug_fadeColor(ansi, '.fromList') + ' '
				+ _Debug_toAnsiString(ansi, elm$core$Dict$toList(value));
		}

		if (tag === 'Array_elm_builtin')
		{
			return _Debug_ctorColor(ansi, 'Array')
				+ _Debug_fadeColor(ansi, '.fromList') + ' '
				+ _Debug_toAnsiString(ansi, elm$core$Array$toList(value));
		}

		if (tag === '::' || tag === '[]')
		{
			var output = '[';

			value.b && (output += _Debug_toAnsiString(ansi, value.a), value = value.b)

			for (; value.b; value = value.b) // WHILE_CONS
			{
				output += ',' + _Debug_toAnsiString(ansi, value.a);
			}
			return output + ']';
		}

		var output = '';
		for (var i in value)
		{
			if (i === '$') continue;
			var str = _Debug_toAnsiString(ansi, value[i]);
			var c0 = str[0];
			var parenless = c0 === '{' || c0 === '(' || c0 === '[' || c0 === '<' || c0 === '"' || str.indexOf(' ') < 0;
			output += ' ' + (parenless ? str : '(' + str + ')');
		}
		return _Debug_ctorColor(ansi, tag) + output;
	}

	if (typeof value === 'object')
	{
		var output = [];
		for (var key in value)
		{
			var field = key[0] === '_' ? key.slice(1) : key;
			output.push(_Debug_fadeColor(ansi, field) + ' = ' + _Debug_toAnsiString(ansi, value[key]));
		}
		if (output.length === 0)
		{
			return '{}';
		}
		return '{ ' + output.join(', ') + ' }';
	}

	return _Debug_internalColor(ansi, '<internals>');
}

function _Debug_addSlashes(str, isChar)
{
	var s = str
		.replace(/\\/g, '\\\\')
		.replace(/\n/g, '\\n')
		.replace(/\t/g, '\\t')
		.replace(/\r/g, '\\r')
		.replace(/\v/g, '\\v')
		.replace(/\0/g, '\\0');

	if (isChar)
	{
		return s.replace(/\'/g, '\\\'');
	}
	else
	{
		return s.replace(/\"/g, '\\"');
	}
}

function _Debug_ctorColor(ansi, string)
{
	return ansi ? '\x1b[96m' + string + '\x1b[0m' : string;
}

function _Debug_numberColor(ansi, string)
{
	return ansi ? '\x1b[95m' + string + '\x1b[0m' : string;
}

function _Debug_stringColor(ansi, string)
{
	return ansi ? '\x1b[93m' + string + '\x1b[0m' : string;
}

function _Debug_charColor(ansi, string)
{
	return ansi ? '\x1b[92m' + string + '\x1b[0m' : string;
}

function _Debug_fadeColor(ansi, string)
{
	return ansi ? '\x1b[37m' + string + '\x1b[0m' : string;
}

function _Debug_internalColor(ansi, string)
{
	return ansi ? '\x1b[94m' + string + '\x1b[0m' : string;
}



// CRASH


function _Debug_crash_UNUSED(identifier)
{
	throw new Error('https://github.com/elm/core/blob/1.0.0/hints/' + identifier + '.md');
}


function _Debug_crash(identifier, fact1, fact2, fact3, fact4)
{
	switch(identifier)
	{
		case 0:
			throw new Error('What node should I take over? In JavaScript I need something like:\n\n    Elm.Main.init({\n        node: document.getElementById("elm-node")\n    })\n\nYou need to do this with any Browser.sandbox or Browser.element program.');

		case 1:
			throw new Error('Browser.application programs cannot handle URLs like this:\n\n    ' + document.location.href + '\n\nWhat is the root? The root of your file system? Try looking at this program with `elm reactor` or some other server.');

		case 2:
			var jsonErrorString = fact1;
			throw new Error('Problem with the flags given to your Elm program on initialization.\n\n' + jsonErrorString);

		case 3:
			var portName = fact1;
			throw new Error('There can only be one port named `' + portName + '`, but your program has multiple.');

		case 4:
			var portName = fact1;
			var problem = fact2;
			throw new Error('Trying to send an unexpected type of value through port `' + portName + '`:\n' + problem);

		case 5:
			throw new Error('Trying to use `(==)` on functions.\nThere is no way to know if functions are "the same" in the Elm sense.\nRead more about this at https://package.elm-lang.org/packages/elm/core/latest/Basics#== which describes why it is this way and what the better version will look like.');

		case 6:
			var moduleName = fact1;
			throw new Error('Your page is loading multiple Elm scripts with a module named ' + moduleName + '. Maybe a duplicate script is getting loaded accidentally? If not, rename one of them so I know which is which!');

		case 8:
			var moduleName = fact1;
			var region = fact2;
			var message = fact3;
			throw new Error('TODO in module `' + moduleName + '` ' + _Debug_regionToString(region) + '\n\n' + message);

		case 9:
			var moduleName = fact1;
			var region = fact2;
			var value = fact3;
			var message = fact4;
			throw new Error(
				'TODO in module `' + moduleName + '` from the `case` expression '
				+ _Debug_regionToString(region) + '\n\nIt received the following value:\n\n    '
				+ _Debug_toString(value).replace('\n', '\n    ')
				+ '\n\nBut the branch that handles it says:\n\n    ' + message.replace('\n', '\n    ')
			);

		case 10:
			throw new Error('Bug in https://github.com/elm/virtual-dom/issues');

		case 11:
			throw new Error('Cannot perform mod 0. Division by zero error.');
	}
}

function _Debug_regionToString(region)
{
	if (region.start.line === region.end.line)
	{
		return 'on line ' + region.start.line;
	}
	return 'on lines ' + region.start.line + ' through ' + region.end.line;
}



// MATH

var _Basics_add = F2(function(a, b) { return a + b; });
var _Basics_sub = F2(function(a, b) { return a - b; });
var _Basics_mul = F2(function(a, b) { return a * b; });
var _Basics_fdiv = F2(function(a, b) { return a / b; });
var _Basics_idiv = F2(function(a, b) { return (a / b) | 0; });
var _Basics_pow = F2(Math.pow);

var _Basics_remainderBy = F2(function(b, a) { return a % b; });

// https://www.microsoft.com/en-us/research/wp-content/uploads/2016/02/divmodnote-letter.pdf
var _Basics_modBy = F2(function(modulus, x)
{
	var answer = x % modulus;
	return modulus === 0
		? _Debug_crash(11)
		:
	((answer > 0 && modulus < 0) || (answer < 0 && modulus > 0))
		? answer + modulus
		: answer;
});


// TRIGONOMETRY

var _Basics_pi = Math.PI;
var _Basics_e = Math.E;
var _Basics_cos = Math.cos;
var _Basics_sin = Math.sin;
var _Basics_tan = Math.tan;
var _Basics_acos = Math.acos;
var _Basics_asin = Math.asin;
var _Basics_atan = Math.atan;
var _Basics_atan2 = F2(Math.atan2);


// MORE MATH

function _Basics_toFloat(x) { return x; }
function _Basics_truncate(n) { return n | 0; }
function _Basics_isInfinite(n) { return n === Infinity || n === -Infinity; }

var _Basics_ceiling = Math.ceil;
var _Basics_floor = Math.floor;
var _Basics_round = Math.round;
var _Basics_sqrt = Math.sqrt;
var _Basics_log = Math.log;
var _Basics_isNaN = isNaN;


// BOOLEANS

function _Basics_not(bool) { return !bool; }
var _Basics_and = F2(function(a, b) { return a && b; });
var _Basics_or  = F2(function(a, b) { return a || b; });
var _Basics_xor = F2(function(a, b) { return a !== b; });



var _Bitwise_and = F2(function(a, b)
{
	return a & b;
});

var _Bitwise_or = F2(function(a, b)
{
	return a | b;
});

var _Bitwise_xor = F2(function(a, b)
{
	return a ^ b;
});

function _Bitwise_complement(a)
{
	return ~a;
};

var _Bitwise_shiftLeftBy = F2(function(offset, a)
{
	return a << offset;
});

var _Bitwise_shiftRightBy = F2(function(offset, a)
{
	return a >> offset;
});

var _Bitwise_shiftRightZfBy = F2(function(offset, a)
{
	return a >>> offset;
});



var _String_cons = F2(function(chr, str)
{
	return chr + str;
});

function _String_uncons(string)
{
	var word = string.charCodeAt(0);
	return word
		? elm$core$Maybe$Just(
			0xD800 <= word && word <= 0xDBFF
				? _Utils_Tuple2(_Utils_chr(string[0] + string[1]), string.slice(2))
				: _Utils_Tuple2(_Utils_chr(string[0]), string.slice(1))
		)
		: elm$core$Maybe$Nothing;
}

var _String_append = F2(function(a, b)
{
	return a + b;
});

function _String_length(str)
{
	return str.length;
}

var _String_map = F2(function(func, string)
{
	var len = string.length;
	var array = new Array(len);
	var i = 0;
	while (i < len)
	{
		var word = string.charCodeAt(i);
		if (0xD800 <= word && word <= 0xDBFF)
		{
			array[i] = func(_Utils_chr(string[i] + string[i+1]));
			i += 2;
			continue;
		}
		array[i] = func(_Utils_chr(string[i]));
		i++;
	}
	return array.join('');
});

var _String_filter = F2(function(isGood, str)
{
	var arr = [];
	var len = str.length;
	var i = 0;
	while (i < len)
	{
		var char = str[i];
		var word = str.charCodeAt(i);
		i++;
		if (0xD800 <= word && word <= 0xDBFF)
		{
			char += str[i];
			i++;
		}

		if (isGood(_Utils_chr(char)))
		{
			arr.push(char);
		}
	}
	return arr.join('');
});

function _String_reverse(str)
{
	var len = str.length;
	var arr = new Array(len);
	var i = 0;
	while (i < len)
	{
		var word = str.charCodeAt(i);
		if (0xD800 <= word && word <= 0xDBFF)
		{
			arr[len - i] = str[i + 1];
			i++;
			arr[len - i] = str[i - 1];
			i++;
		}
		else
		{
			arr[len - i] = str[i];
			i++;
		}
	}
	return arr.join('');
}

var _String_foldl = F3(function(func, state, string)
{
	var len = string.length;
	var i = 0;
	while (i < len)
	{
		var char = string[i];
		var word = string.charCodeAt(i);
		i++;
		if (0xD800 <= word && word <= 0xDBFF)
		{
			char += string[i];
			i++;
		}
		state = A2(func, _Utils_chr(char), state);
	}
	return state;
});

var _String_foldr = F3(function(func, state, string)
{
	var i = string.length;
	while (i--)
	{
		var char = string[i];
		var word = string.charCodeAt(i);
		if (0xDC00 <= word && word <= 0xDFFF)
		{
			i--;
			char = string[i] + char;
		}
		state = A2(func, _Utils_chr(char), state);
	}
	return state;
});

var _String_split = F2(function(sep, str)
{
	return str.split(sep);
});

var _String_join = F2(function(sep, strs)
{
	return strs.join(sep);
});

var _String_slice = F3(function(start, end, str) {
	return str.slice(start, end);
});

function _String_trim(str)
{
	return str.trim();
}

function _String_trimLeft(str)
{
	return str.replace(/^\s+/, '');
}

function _String_trimRight(str)
{
	return str.replace(/\s+$/, '');
}

function _String_words(str)
{
	return _List_fromArray(str.trim().split(/\s+/g));
}

function _String_lines(str)
{
	return _List_fromArray(str.split(/\r\n|\r|\n/g));
}

function _String_toUpper(str)
{
	return str.toUpperCase();
}

function _String_toLower(str)
{
	return str.toLowerCase();
}

var _String_any = F2(function(isGood, string)
{
	var i = string.length;
	while (i--)
	{
		var char = string[i];
		var word = string.charCodeAt(i);
		if (0xDC00 <= word && word <= 0xDFFF)
		{
			i--;
			char = string[i] + char;
		}
		if (isGood(_Utils_chr(char)))
		{
			return true;
		}
	}
	return false;
});

var _String_all = F2(function(isGood, string)
{
	var i = string.length;
	while (i--)
	{
		var char = string[i];
		var word = string.charCodeAt(i);
		if (0xDC00 <= word && word <= 0xDFFF)
		{
			i--;
			char = string[i] + char;
		}
		if (!isGood(_Utils_chr(char)))
		{
			return false;
		}
	}
	return true;
});

var _String_contains = F2(function(sub, str)
{
	return str.indexOf(sub) > -1;
});

var _String_startsWith = F2(function(sub, str)
{
	return str.indexOf(sub) === 0;
});

var _String_endsWith = F2(function(sub, str)
{
	return str.length >= sub.length &&
		str.lastIndexOf(sub) === str.length - sub.length;
});

var _String_indexes = F2(function(sub, str)
{
	var subLen = sub.length;

	if (subLen < 1)
	{
		return _List_Nil;
	}

	var i = 0;
	var is = [];

	while ((i = str.indexOf(sub, i)) > -1)
	{
		is.push(i);
		i = i + subLen;
	}

	return _List_fromArray(is);
});


// TO STRING

function _String_fromNumber(number)
{
	return number + '';
}


// INT CONVERSIONS

function _String_toInt(str)
{
	var total = 0;
	var code0 = str.charCodeAt(0);
	var start = code0 == 0x2B /* + */ || code0 == 0x2D /* - */ ? 1 : 0;

	for (var i = start; i < str.length; ++i)
	{
		var code = str.charCodeAt(i);
		if (code < 0x30 || 0x39 < code)
		{
			return elm$core$Maybe$Nothing;
		}
		total = 10 * total + code - 0x30;
	}

	return i == start
		? elm$core$Maybe$Nothing
		: elm$core$Maybe$Just(code0 == 0x2D ? -total : total);
}


// FLOAT CONVERSIONS

function _String_toFloat(s)
{
	// check if it is a hex, octal, or binary number
	if (s.length === 0 || /[\sxbo]/.test(s))
	{
		return elm$core$Maybe$Nothing;
	}
	var n = +s;
	// faster isNaN check
	return n === n ? elm$core$Maybe$Just(n) : elm$core$Maybe$Nothing;
}

function _String_fromList(chars)
{
	return _List_toArray(chars).join('');
}




function _Char_toCode(char)
{
	var code = char.charCodeAt(0);
	if (0xD800 <= code && code <= 0xDBFF)
	{
		return (code - 0xD800) * 0x400 + char.charCodeAt(1) - 0xDC00 + 0x10000
	}
	return code;
}

function _Char_fromCode(code)
{
	return _Utils_chr(
		(code < 0 || 0x10FFFF < code)
			? '\uFFFD'
			:
		(code <= 0xFFFF)
			? String.fromCharCode(code)
			:
		(code -= 0x10000,
			String.fromCharCode(Math.floor(code / 0x400) + 0xD800)
			+
			String.fromCharCode(code % 0x400 + 0xDC00)
		)
	);
}

function _Char_toUpper(char)
{
	return _Utils_chr(char.toUpperCase());
}

function _Char_toLower(char)
{
	return _Utils_chr(char.toLowerCase());
}

function _Char_toLocaleUpper(char)
{
	return _Utils_chr(char.toLocaleUpperCase());
}

function _Char_toLocaleLower(char)
{
	return _Utils_chr(char.toLocaleLowerCase());
}



/**/
function _Json_errorToString(error)
{
	return elm$json$Json$Decode$errorToString(error);
}
//*/


// CORE DECODERS

function _Json_succeed(msg)
{
	return {
		$: 0,
		a: msg
	};
}

function _Json_fail(msg)
{
	return {
		$: 1,
		a: msg
	};
}

var _Json_decodeInt = { $: 2 };
var _Json_decodeBool = { $: 3 };
var _Json_decodeFloat = { $: 4 };
var _Json_decodeValue = { $: 5 };
var _Json_decodeString = { $: 6 };

function _Json_decodeList(decoder) { return { $: 7, b: decoder }; }
function _Json_decodeArray(decoder) { return { $: 8, b: decoder }; }

function _Json_decodeNull(value) { return { $: 9, c: value }; }

var _Json_decodeField = F2(function(field, decoder)
{
	return {
		$: 10,
		d: field,
		b: decoder
	};
});

var _Json_decodeIndex = F2(function(index, decoder)
{
	return {
		$: 11,
		e: index,
		b: decoder
	};
});

function _Json_decodeKeyValuePairs(decoder)
{
	return {
		$: 12,
		b: decoder
	};
}

function _Json_mapMany(f, decoders)
{
	return {
		$: 13,
		f: f,
		g: decoders
	};
}

var _Json_andThen = F2(function(callback, decoder)
{
	return {
		$: 14,
		b: decoder,
		h: callback
	};
});

function _Json_oneOf(decoders)
{
	return {
		$: 15,
		g: decoders
	};
}


// DECODING OBJECTS

var _Json_map1 = F2(function(f, d1)
{
	return _Json_mapMany(f, [d1]);
});

var _Json_map2 = F3(function(f, d1, d2)
{
	return _Json_mapMany(f, [d1, d2]);
});

var _Json_map3 = F4(function(f, d1, d2, d3)
{
	return _Json_mapMany(f, [d1, d2, d3]);
});

var _Json_map4 = F5(function(f, d1, d2, d3, d4)
{
	return _Json_mapMany(f, [d1, d2, d3, d4]);
});

var _Json_map5 = F6(function(f, d1, d2, d3, d4, d5)
{
	return _Json_mapMany(f, [d1, d2, d3, d4, d5]);
});

var _Json_map6 = F7(function(f, d1, d2, d3, d4, d5, d6)
{
	return _Json_mapMany(f, [d1, d2, d3, d4, d5, d6]);
});

var _Json_map7 = F8(function(f, d1, d2, d3, d4, d5, d6, d7)
{
	return _Json_mapMany(f, [d1, d2, d3, d4, d5, d6, d7]);
});

var _Json_map8 = F9(function(f, d1, d2, d3, d4, d5, d6, d7, d8)
{
	return _Json_mapMany(f, [d1, d2, d3, d4, d5, d6, d7, d8]);
});


// DECODE

var _Json_runOnString = F2(function(decoder, string)
{
	try
	{
		var value = JSON.parse(string);
		return _Json_runHelp(decoder, value);
	}
	catch (e)
	{
		return elm$core$Result$Err(A2(elm$json$Json$Decode$Failure, 'This is not valid JSON! ' + e.message, _Json_wrap(string)));
	}
});

var _Json_run = F2(function(decoder, value)
{
	return _Json_runHelp(decoder, _Json_unwrap(value));
});

function _Json_runHelp(decoder, value)
{
	switch (decoder.$)
	{
		case 3:
			return (typeof value === 'boolean')
				? elm$core$Result$Ok(value)
				: _Json_expecting('a BOOL', value);

		case 2:
			if (typeof value !== 'number') {
				return _Json_expecting('an INT', value);
			}

			if (-2147483647 < value && value < 2147483647 && (value | 0) === value) {
				return elm$core$Result$Ok(value);
			}

			if (isFinite(value) && !(value % 1)) {
				return elm$core$Result$Ok(value);
			}

			return _Json_expecting('an INT', value);

		case 4:
			return (typeof value === 'number')
				? elm$core$Result$Ok(value)
				: _Json_expecting('a FLOAT', value);

		case 6:
			return (typeof value === 'string')
				? elm$core$Result$Ok(value)
				: (value instanceof String)
					? elm$core$Result$Ok(value + '')
					: _Json_expecting('a STRING', value);

		case 9:
			return (value === null)
				? elm$core$Result$Ok(decoder.c)
				: _Json_expecting('null', value);

		case 5:
			return elm$core$Result$Ok(_Json_wrap(value));

		case 7:
			if (!Array.isArray(value))
			{
				return _Json_expecting('a LIST', value);
			}
			return _Json_runArrayDecoder(decoder.b, value, _List_fromArray);

		case 8:
			if (!Array.isArray(value))
			{
				return _Json_expecting('an ARRAY', value);
			}
			return _Json_runArrayDecoder(decoder.b, value, _Json_toElmArray);

		case 10:
			var field = decoder.d;
			if (typeof value !== 'object' || value === null || !(field in value))
			{
				return _Json_expecting('an OBJECT with a field named `' + field + '`', value);
			}
			var result = _Json_runHelp(decoder.b, value[field]);
			return (elm$core$Result$isOk(result)) ? result : elm$core$Result$Err(A2(elm$json$Json$Decode$Field, field, result.a));

		case 11:
			var index = decoder.e;
			if (!Array.isArray(value))
			{
				return _Json_expecting('an ARRAY', value);
			}
			if (index >= value.length)
			{
				return _Json_expecting('a LONGER array. Need index ' + index + ' but only see ' + value.length + ' entries', value);
			}
			var result = _Json_runHelp(decoder.b, value[index]);
			return (elm$core$Result$isOk(result)) ? result : elm$core$Result$Err(A2(elm$json$Json$Decode$Index, index, result.a));

		case 12:
			if (typeof value !== 'object' || value === null || Array.isArray(value))
			{
				return _Json_expecting('an OBJECT', value);
			}

			var keyValuePairs = _List_Nil;
			// TODO test perf of Object.keys and switch when support is good enough
			for (var key in value)
			{
				if (value.hasOwnProperty(key))
				{
					var result = _Json_runHelp(decoder.b, value[key]);
					if (!elm$core$Result$isOk(result))
					{
						return elm$core$Result$Err(A2(elm$json$Json$Decode$Field, key, result.a));
					}
					keyValuePairs = _List_Cons(_Utils_Tuple2(key, result.a), keyValuePairs);
				}
			}
			return elm$core$Result$Ok(elm$core$List$reverse(keyValuePairs));

		case 13:
			var answer = decoder.f;
			var decoders = decoder.g;
			for (var i = 0; i < decoders.length; i++)
			{
				var result = _Json_runHelp(decoders[i], value);
				if (!elm$core$Result$isOk(result))
				{
					return result;
				}
				answer = answer(result.a);
			}
			return elm$core$Result$Ok(answer);

		case 14:
			var result = _Json_runHelp(decoder.b, value);
			return (!elm$core$Result$isOk(result))
				? result
				: _Json_runHelp(decoder.h(result.a), value);

		case 15:
			var errors = _List_Nil;
			for (var temp = decoder.g; temp.b; temp = temp.b) // WHILE_CONS
			{
				var result = _Json_runHelp(temp.a, value);
				if (elm$core$Result$isOk(result))
				{
					return result;
				}
				errors = _List_Cons(result.a, errors);
			}
			return elm$core$Result$Err(elm$json$Json$Decode$OneOf(elm$core$List$reverse(errors)));

		case 1:
			return elm$core$Result$Err(A2(elm$json$Json$Decode$Failure, decoder.a, _Json_wrap(value)));

		case 0:
			return elm$core$Result$Ok(decoder.a);
	}
}

function _Json_runArrayDecoder(decoder, value, toElmValue)
{
	var len = value.length;
	var array = new Array(len);
	for (var i = 0; i < len; i++)
	{
		var result = _Json_runHelp(decoder, value[i]);
		if (!elm$core$Result$isOk(result))
		{
			return elm$core$Result$Err(A2(elm$json$Json$Decode$Index, i, result.a));
		}
		array[i] = result.a;
	}
	return elm$core$Result$Ok(toElmValue(array));
}

function _Json_toElmArray(array)
{
	return A2(elm$core$Array$initialize, array.length, function(i) { return array[i]; });
}

function _Json_expecting(type, value)
{
	return elm$core$Result$Err(A2(elm$json$Json$Decode$Failure, 'Expecting ' + type, _Json_wrap(value)));
}


// EQUALITY

function _Json_equality(x, y)
{
	if (x === y)
	{
		return true;
	}

	if (x.$ !== y.$)
	{
		return false;
	}

	switch (x.$)
	{
		case 0:
		case 1:
			return x.a === y.a;

		case 3:
		case 2:
		case 4:
		case 6:
		case 5:
			return true;

		case 9:
			return x.c === y.c;

		case 7:
		case 8:
		case 12:
			return _Json_equality(x.b, y.b);

		case 10:
			return x.d === y.d && _Json_equality(x.b, y.b);

		case 11:
			return x.e === y.e && _Json_equality(x.b, y.b);

		case 13:
			return x.f === y.f && _Json_listEquality(x.g, y.g);

		case 14:
			return x.h === y.h && _Json_equality(x.b, y.b);

		case 15:
			return _Json_listEquality(x.g, y.g);
	}
}

function _Json_listEquality(aDecoders, bDecoders)
{
	var len = aDecoders.length;
	if (len !== bDecoders.length)
	{
		return false;
	}
	for (var i = 0; i < len; i++)
	{
		if (!_Json_equality(aDecoders[i], bDecoders[i]))
		{
			return false;
		}
	}
	return true;
}


// ENCODE

var _Json_encode = F2(function(indentLevel, value)
{
	return JSON.stringify(_Json_unwrap(value), null, indentLevel) + '';
});

function _Json_wrap(value) { return { $: 0, a: value }; }
function _Json_unwrap(value) { return value.a; }

function _Json_wrap_UNUSED(value) { return value; }
function _Json_unwrap_UNUSED(value) { return value; }

function _Json_emptyArray() { return []; }
function _Json_emptyObject() { return {}; }

var _Json_addField = F3(function(key, value, object)
{
	object[key] = _Json_unwrap(value);
	return object;
});

function _Json_addEntry(func)
{
	return F2(function(entry, array)
	{
		array.push(_Json_unwrap(func(entry)));
		return array;
	});
}

var _Json_encodeNull = _Json_wrap(null);



// TASKS

function _Scheduler_succeed(value)
{
	return {
		$: 0,
		a: value
	};
}

function _Scheduler_fail(error)
{
	return {
		$: 1,
		a: error
	};
}

function _Scheduler_binding(callback)
{
	return {
		$: 2,
		b: callback,
		c: null
	};
}

var _Scheduler_andThen = F2(function(callback, task)
{
	return {
		$: 3,
		b: callback,
		d: task
	};
});

var _Scheduler_onError = F2(function(callback, task)
{
	return {
		$: 4,
		b: callback,
		d: task
	};
});

function _Scheduler_receive(callback)
{
	return {
		$: 5,
		b: callback
	};
}


// PROCESSES

var _Scheduler_guid = 0;

function _Scheduler_rawSpawn(task)
{
	var proc = {
		$: 0,
		e: _Scheduler_guid++,
		f: task,
		g: null,
		h: []
	};

	_Scheduler_enqueue(proc);

	return proc;
}

function _Scheduler_spawn(task)
{
	return _Scheduler_binding(function(callback) {
		callback(_Scheduler_succeed(_Scheduler_rawSpawn(task)));
	});
}

function _Scheduler_rawSend(proc, msg)
{
	proc.h.push(msg);
	_Scheduler_enqueue(proc);
}

var _Scheduler_send = F2(function(proc, msg)
{
	return _Scheduler_binding(function(callback) {
		_Scheduler_rawSend(proc, msg);
		callback(_Scheduler_succeed(_Utils_Tuple0));
	});
});

function _Scheduler_kill(proc)
{
	return _Scheduler_binding(function(callback) {
		var task = proc.f;
		if (task.$ === 2 && task.c)
		{
			task.c();
		}

		proc.f = null;

		callback(_Scheduler_succeed(_Utils_Tuple0));
	});
}


/* STEP PROCESSES

type alias Process =
  { $ : tag
  , id : unique_id
  , root : Task
  , stack : null | { $: SUCCEED | FAIL, a: callback, b: stack }
  , mailbox : [msg]
  }

*/


var _Scheduler_working = false;
var _Scheduler_queue = [];


function _Scheduler_enqueue(proc)
{
	_Scheduler_queue.push(proc);
	if (_Scheduler_working)
	{
		return;
	}
	_Scheduler_working = true;
	while (proc = _Scheduler_queue.shift())
	{
		_Scheduler_step(proc);
	}
	_Scheduler_working = false;
}


function _Scheduler_step(proc)
{
	while (proc.f)
	{
		var rootTag = proc.f.$;
		if (rootTag === 0 || rootTag === 1)
		{
			while (proc.g && proc.g.$ !== rootTag)
			{
				proc.g = proc.g.i;
			}
			if (!proc.g)
			{
				return;
			}
			proc.f = proc.g.b(proc.f.a);
			proc.g = proc.g.i;
		}
		else if (rootTag === 2)
		{
			proc.f.c = proc.f.b(function(newRoot) {
				proc.f = newRoot;
				_Scheduler_enqueue(proc);
			});
			return;
		}
		else if (rootTag === 5)
		{
			if (proc.h.length === 0)
			{
				return;
			}
			proc.f = proc.f.b(proc.h.shift());
		}
		else // if (rootTag === 3 || rootTag === 4)
		{
			proc.g = {
				$: rootTag === 3 ? 0 : 1,
				b: proc.f.b,
				i: proc.g
			};
			proc.f = proc.f.d;
		}
	}
}



function _Process_sleep(time)
{
	return _Scheduler_binding(function(callback) {
		var id = setTimeout(function() {
			callback(_Scheduler_succeed(_Utils_Tuple0));
		}, time);

		return function() { clearTimeout(id); };
	});
}




// PROGRAMS


var _Platform_worker = F4(function(impl, flagDecoder, debugMetadata, args)
{
	return _Platform_initialize(
		flagDecoder,
		args,
		impl.init,
		impl.update,
		impl.subscriptions,
		function() { return function() {} }
	);
});



// INITIALIZE A PROGRAM


function _Platform_initialize(flagDecoder, args, init, update, subscriptions, stepperBuilder)
{
	var result = A2(_Json_run, flagDecoder, _Json_wrap(args ? args['flags'] : undefined));
	elm$core$Result$isOk(result) || _Debug_crash(2 /**/, _Json_errorToString(result.a) /**/);
	var managers = {};
	result = init(result.a);
	var model = result.a;
	var stepper = stepperBuilder(sendToApp, model);
	var ports = _Platform_setupEffects(managers, sendToApp);

	function sendToApp(msg, viewMetadata)
	{
		result = A2(update, msg, model);
		stepper(model = result.a, viewMetadata);
		_Platform_dispatchEffects(managers, result.b, subscriptions(model));
	}

	_Platform_dispatchEffects(managers, result.b, subscriptions(model));

	return ports ? { ports: ports } : {};
}



// TRACK PRELOADS
//
// This is used by code in elm/browser and elm/http
// to register any HTTP requests that are triggered by init.
//


var _Platform_preload;


function _Platform_registerPreload(url)
{
	_Platform_preload.add(url);
}



// EFFECT MANAGERS


var _Platform_effectManagers = {};


function _Platform_setupEffects(managers, sendToApp)
{
	var ports;

	// setup all necessary effect managers
	for (var key in _Platform_effectManagers)
	{
		var manager = _Platform_effectManagers[key];

		if (manager.a)
		{
			ports = ports || {};
			ports[key] = manager.a(key, sendToApp);
		}

		managers[key] = _Platform_instantiateManager(manager, sendToApp);
	}

	return ports;
}


function _Platform_createManager(init, onEffects, onSelfMsg, cmdMap, subMap)
{
	return {
		b: init,
		c: onEffects,
		d: onSelfMsg,
		e: cmdMap,
		f: subMap
	};
}


function _Platform_instantiateManager(info, sendToApp)
{
	var router = {
		g: sendToApp,
		h: undefined
	};

	var onEffects = info.c;
	var onSelfMsg = info.d;
	var cmdMap = info.e;
	var subMap = info.f;

	function loop(state)
	{
		return A2(_Scheduler_andThen, loop, _Scheduler_receive(function(msg)
		{
			var value = msg.a;

			if (msg.$ === 0)
			{
				return A3(onSelfMsg, router, value, state);
			}

			return cmdMap && subMap
				? A4(onEffects, router, value.i, value.j, state)
				: A3(onEffects, router, cmdMap ? value.i : value.j, state);
		}));
	}

	return router.h = _Scheduler_rawSpawn(A2(_Scheduler_andThen, loop, info.b));
}



// ROUTING


var _Platform_sendToApp = F2(function(router, msg)
{
	return _Scheduler_binding(function(callback)
	{
		router.g(msg);
		callback(_Scheduler_succeed(_Utils_Tuple0));
	});
});


var _Platform_sendToSelf = F2(function(router, msg)
{
	return A2(_Scheduler_send, router.h, {
		$: 0,
		a: msg
	});
});



// BAGS


function _Platform_leaf(home)
{
	return function(value)
	{
		return {
			$: 1,
			k: home,
			l: value
		};
	};
}


function _Platform_batch(list)
{
	return {
		$: 2,
		m: list
	};
}


var _Platform_map = F2(function(tagger, bag)
{
	return {
		$: 3,
		n: tagger,
		o: bag
	}
});



// PIPE BAGS INTO EFFECT MANAGERS


function _Platform_dispatchEffects(managers, cmdBag, subBag)
{
	var effectsDict = {};
	_Platform_gatherEffects(true, cmdBag, effectsDict, null);
	_Platform_gatherEffects(false, subBag, effectsDict, null);

	for (var home in managers)
	{
		_Scheduler_rawSend(managers[home], {
			$: 'fx',
			a: effectsDict[home] || { i: _List_Nil, j: _List_Nil }
		});
	}
}


function _Platform_gatherEffects(isCmd, bag, effectsDict, taggers)
{
	switch (bag.$)
	{
		case 1:
			var home = bag.k;
			var effect = _Platform_toEffect(isCmd, home, taggers, bag.l);
			effectsDict[home] = _Platform_insert(isCmd, effect, effectsDict[home]);
			return;

		case 2:
			for (var list = bag.m; list.b; list = list.b) // WHILE_CONS
			{
				_Platform_gatherEffects(isCmd, list.a, effectsDict, taggers);
			}
			return;

		case 3:
			_Platform_gatherEffects(isCmd, bag.o, effectsDict, {
				p: bag.n,
				q: taggers
			});
			return;
	}
}


function _Platform_toEffect(isCmd, home, taggers, value)
{
	function applyTaggers(x)
	{
		for (var temp = taggers; temp; temp = temp.q)
		{
			x = temp.p(x);
		}
		return x;
	}

	var map = isCmd
		? _Platform_effectManagers[home].e
		: _Platform_effectManagers[home].f;

	return A2(map, applyTaggers, value)
}


function _Platform_insert(isCmd, newEffect, effects)
{
	effects = effects || { i: _List_Nil, j: _List_Nil };

	isCmd
		? (effects.i = _List_Cons(newEffect, effects.i))
		: (effects.j = _List_Cons(newEffect, effects.j));

	return effects;
}



// PORTS


function _Platform_checkPortName(name)
{
	if (_Platform_effectManagers[name])
	{
		_Debug_crash(3, name)
	}
}



// OUTGOING PORTS


function _Platform_outgoingPort(name, converter)
{
	_Platform_checkPortName(name);
	_Platform_effectManagers[name] = {
		e: _Platform_outgoingPortMap,
		r: converter,
		a: _Platform_setupOutgoingPort
	};
	return _Platform_leaf(name);
}


var _Platform_outgoingPortMap = F2(function(tagger, value) { return value; });


function _Platform_setupOutgoingPort(name)
{
	var subs = [];
	var converter = _Platform_effectManagers[name].r;

	// CREATE MANAGER

	var init = _Process_sleep(0);

	_Platform_effectManagers[name].b = init;
	_Platform_effectManagers[name].c = F3(function(router, cmdList, state)
	{
		for ( ; cmdList.b; cmdList = cmdList.b) // WHILE_CONS
		{
			// grab a separate reference to subs in case unsubscribe is called
			var currentSubs = subs;
			var value = _Json_unwrap(converter(cmdList.a));
			for (var i = 0; i < currentSubs.length; i++)
			{
				currentSubs[i](value);
			}
		}
		return init;
	});

	// PUBLIC API

	function subscribe(callback)
	{
		subs.push(callback);
	}

	function unsubscribe(callback)
	{
		// copy subs into a new array in case unsubscribe is called within a
		// subscribed callback
		subs = subs.slice();
		var index = subs.indexOf(callback);
		if (index >= 0)
		{
			subs.splice(index, 1);
		}
	}

	return {
		subscribe: subscribe,
		unsubscribe: unsubscribe
	};
}



// INCOMING PORTS


function _Platform_incomingPort(name, converter)
{
	_Platform_checkPortName(name);
	_Platform_effectManagers[name] = {
		f: _Platform_incomingPortMap,
		r: converter,
		a: _Platform_setupIncomingPort
	};
	return _Platform_leaf(name);
}


var _Platform_incomingPortMap = F2(function(tagger, finalTagger)
{
	return function(value)
	{
		return tagger(finalTagger(value));
	};
});


function _Platform_setupIncomingPort(name, sendToApp)
{
	var subs = _List_Nil;
	var converter = _Platform_effectManagers[name].r;

	// CREATE MANAGER

	var init = _Scheduler_succeed(null);

	_Platform_effectManagers[name].b = init;
	_Platform_effectManagers[name].c = F3(function(router, subList, state)
	{
		subs = subList;
		return init;
	});

	// PUBLIC API

	function send(incomingValue)
	{
		var result = A2(_Json_run, converter, _Json_wrap(incomingValue));

		elm$core$Result$isOk(result) || _Debug_crash(4, name, result.a);

		var value = result.a;
		for (var temp = subs; temp.b; temp = temp.b) // WHILE_CONS
		{
			sendToApp(temp.a(value));
		}
	}

	return { send: send };
}



// EXPORT ELM MODULES
//
// Have DEBUG and PROD versions so that we can (1) give nicer errors in
// debug mode and (2) not pay for the bits needed for that in prod mode.
//


function _Platform_export_UNUSED(exports)
{
	scope['Elm']
		? _Platform_mergeExportsProd(scope['Elm'], exports)
		: scope['Elm'] = exports;
}


function _Platform_mergeExportsProd(obj, exports)
{
	for (var name in exports)
	{
		(name in obj)
			? (name == 'init')
				? _Debug_crash(6)
				: _Platform_mergeExportsProd(obj[name], exports[name])
			: (obj[name] = exports[name]);
	}
}


function _Platform_export(exports)
{
	scope['Elm']
		? _Platform_mergeExportsDebug('Elm', scope['Elm'], exports)
		: scope['Elm'] = exports;
}


function _Platform_mergeExportsDebug(moduleName, obj, exports)
{
	for (var name in exports)
	{
		(name in obj)
			? (name == 'init')
				? _Debug_crash(6, moduleName)
				: _Platform_mergeExportsDebug(moduleName + '.' + name, obj[name], exports[name])
			: (obj[name] = exports[name]);
	}
}




// HELPERS


var _VirtualDom_divertHrefToApp;

var _VirtualDom_doc = typeof document !== 'undefined' ? document : {};


function _VirtualDom_appendChild(parent, child)
{
	parent.appendChild(child);
}

var _VirtualDom_init = F4(function(virtualNode, flagDecoder, debugMetadata, args)
{
	// NOTE: this function needs _Platform_export available to work

	/**_UNUSED/
	var node = args['node'];
	//*/
	/**/
	var node = args && args['node'] ? args['node'] : _Debug_crash(0);
	//*/

	node.parentNode.replaceChild(
		_VirtualDom_render(virtualNode, function() {}),
		node
	);

	return {};
});



// TEXT


function _VirtualDom_text(string)
{
	return {
		$: 0,
		a: string
	};
}



// NODE


var _VirtualDom_nodeNS = F2(function(namespace, tag)
{
	return F2(function(factList, kidList)
	{
		for (var kids = [], descendantsCount = 0; kidList.b; kidList = kidList.b) // WHILE_CONS
		{
			var kid = kidList.a;
			descendantsCount += (kid.b || 0);
			kids.push(kid);
		}
		descendantsCount += kids.length;

		return {
			$: 1,
			c: tag,
			d: _VirtualDom_organizeFacts(factList),
			e: kids,
			f: namespace,
			b: descendantsCount
		};
	});
});


var _VirtualDom_node = _VirtualDom_nodeNS(undefined);



// KEYED NODE


var _VirtualDom_keyedNodeNS = F2(function(namespace, tag)
{
	return F2(function(factList, kidList)
	{
		for (var kids = [], descendantsCount = 0; kidList.b; kidList = kidList.b) // WHILE_CONS
		{
			var kid = kidList.a;
			descendantsCount += (kid.b.b || 0);
			kids.push(kid);
		}
		descendantsCount += kids.length;

		return {
			$: 2,
			c: tag,
			d: _VirtualDom_organizeFacts(factList),
			e: kids,
			f: namespace,
			b: descendantsCount
		};
	});
});


var _VirtualDom_keyedNode = _VirtualDom_keyedNodeNS(undefined);



// CUSTOM


function _VirtualDom_custom(factList, model, render, diff)
{
	return {
		$: 3,
		d: _VirtualDom_organizeFacts(factList),
		g: model,
		h: render,
		i: diff
	};
}



// MAP


var _VirtualDom_map = F2(function(tagger, node)
{
	return {
		$: 4,
		j: tagger,
		k: node,
		b: 1 + (node.b || 0)
	};
});



// LAZY


function _VirtualDom_thunk(refs, thunk)
{
	return {
		$: 5,
		l: refs,
		m: thunk,
		k: undefined
	};
}

var _VirtualDom_lazy = F2(function(func, a)
{
	return _VirtualDom_thunk([func, a], function() {
		return func(a);
	});
});

var _VirtualDom_lazy2 = F3(function(func, a, b)
{
	return _VirtualDom_thunk([func, a, b], function() {
		return A2(func, a, b);
	});
});

var _VirtualDom_lazy3 = F4(function(func, a, b, c)
{
	return _VirtualDom_thunk([func, a, b, c], function() {
		return A3(func, a, b, c);
	});
});

var _VirtualDom_lazy4 = F5(function(func, a, b, c, d)
{
	return _VirtualDom_thunk([func, a, b, c, d], function() {
		return A4(func, a, b, c, d);
	});
});

var _VirtualDom_lazy5 = F6(function(func, a, b, c, d, e)
{
	return _VirtualDom_thunk([func, a, b, c, d, e], function() {
		return A5(func, a, b, c, d, e);
	});
});

var _VirtualDom_lazy6 = F7(function(func, a, b, c, d, e, f)
{
	return _VirtualDom_thunk([func, a, b, c, d, e, f], function() {
		return A6(func, a, b, c, d, e, f);
	});
});

var _VirtualDom_lazy7 = F8(function(func, a, b, c, d, e, f, g)
{
	return _VirtualDom_thunk([func, a, b, c, d, e, f, g], function() {
		return A7(func, a, b, c, d, e, f, g);
	});
});

var _VirtualDom_lazy8 = F9(function(func, a, b, c, d, e, f, g, h)
{
	return _VirtualDom_thunk([func, a, b, c, d, e, f, g, h], function() {
		return A8(func, a, b, c, d, e, f, g, h);
	});
});



// FACTS


var _VirtualDom_on = F2(function(key, handler)
{
	return {
		$: 'a0',
		n: key,
		o: handler
	};
});
var _VirtualDom_style = F2(function(key, value)
{
	return {
		$: 'a1',
		n: key,
		o: value
	};
});
var _VirtualDom_property = F2(function(key, value)
{
	return {
		$: 'a2',
		n: key,
		o: value
	};
});
var _VirtualDom_attribute = F2(function(key, value)
{
	return {
		$: 'a3',
		n: key,
		o: value
	};
});
var _VirtualDom_attributeNS = F3(function(namespace, key, value)
{
	return {
		$: 'a4',
		n: key,
		o: { f: namespace, o: value }
	};
});



// XSS ATTACK VECTOR CHECKS


function _VirtualDom_noScript(tag)
{
	return tag == 'script' ? 'p' : tag;
}

function _VirtualDom_noOnOrFormAction(key)
{
	return /^(on|formAction$)/i.test(key) ? 'data-' + key : key;
}

function _VirtualDom_noInnerHtmlOrFormAction(key)
{
	return key == 'innerHTML' || key == 'formAction' ? 'data-' + key : key;
}

function _VirtualDom_noJavaScriptUri_UNUSED(value)
{
	return /^javascript:/i.test(value.replace(/\s/g,'')) ? '' : value;
}

function _VirtualDom_noJavaScriptUri(value)
{
	return /^javascript:/i.test(value.replace(/\s/g,''))
		? 'javascript:alert("This is an XSS vector. Please use ports or web components instead.")'
		: value;
}

function _VirtualDom_noJavaScriptOrHtmlUri_UNUSED(value)
{
	return /^\s*(javascript:|data:text\/html)/i.test(value) ? '' : value;
}

function _VirtualDom_noJavaScriptOrHtmlUri(value)
{
	return /^\s*(javascript:|data:text\/html)/i.test(value)
		? 'javascript:alert("This is an XSS vector. Please use ports or web components instead.")'
		: value;
}



// MAP FACTS


var _VirtualDom_mapAttribute = F2(function(func, attr)
{
	return (attr.$ === 'a0')
		? A2(_VirtualDom_on, attr.n, _VirtualDom_mapHandler(func, attr.o))
		: attr;
});

function _VirtualDom_mapHandler(func, handler)
{
	var tag = elm$virtual_dom$VirtualDom$toHandlerInt(handler);

	// 0 = Normal
	// 1 = MayStopPropagation
	// 2 = MayPreventDefault
	// 3 = Custom

	return {
		$: handler.$,
		a:
			!tag
				? A2(elm$json$Json$Decode$map, func, handler.a)
				:
			A3(elm$json$Json$Decode$map2,
				tag < 3
					? _VirtualDom_mapEventTuple
					: _VirtualDom_mapEventRecord,
				elm$json$Json$Decode$succeed(func),
				handler.a
			)
	};
}

var _VirtualDom_mapEventTuple = F2(function(func, tuple)
{
	return _Utils_Tuple2(func(tuple.a), tuple.b);
});

var _VirtualDom_mapEventRecord = F2(function(func, record)
{
	return {
		message: func(record.message),
		stopPropagation: record.stopPropagation,
		preventDefault: record.preventDefault
	}
});



// ORGANIZE FACTS


function _VirtualDom_organizeFacts(factList)
{
	for (var facts = {}; factList.b; factList = factList.b) // WHILE_CONS
	{
		var entry = factList.a;

		var tag = entry.$;
		var key = entry.n;
		var value = entry.o;

		if (tag === 'a2')
		{
			(key === 'className')
				? _VirtualDom_addClass(facts, key, _Json_unwrap(value))
				: facts[key] = _Json_unwrap(value);

			continue;
		}

		var subFacts = facts[tag] || (facts[tag] = {});
		(tag === 'a3' && key === 'class')
			? _VirtualDom_addClass(subFacts, key, value)
			: subFacts[key] = value;
	}

	return facts;
}

function _VirtualDom_addClass(object, key, newClass)
{
	var classes = object[key];
	object[key] = classes ? classes + ' ' + newClass : newClass;
}



// RENDER


function _VirtualDom_render(vNode, eventNode)
{
	var tag = vNode.$;

	if (tag === 5)
	{
		return _VirtualDom_render(vNode.k || (vNode.k = vNode.m()), eventNode);
	}

	if (tag === 0)
	{
		return _VirtualDom_doc.createTextNode(vNode.a);
	}

	if (tag === 4)
	{
		var subNode = vNode.k;
		var tagger = vNode.j;

		while (subNode.$ === 4)
		{
			typeof tagger !== 'object'
				? tagger = [tagger, subNode.j]
				: tagger.push(subNode.j);

			subNode = subNode.k;
		}

		var subEventRoot = { j: tagger, p: eventNode };
		var domNode = _VirtualDom_render(subNode, subEventRoot);
		domNode.elm_event_node_ref = subEventRoot;
		return domNode;
	}

	if (tag === 3)
	{
		var domNode = vNode.h(vNode.g);
		_VirtualDom_applyFacts(domNode, eventNode, vNode.d);
		return domNode;
	}

	// at this point `tag` must be 1 or 2

	var domNode = vNode.f
		? _VirtualDom_doc.createElementNS(vNode.f, vNode.c)
		: _VirtualDom_doc.createElement(vNode.c);

	if (_VirtualDom_divertHrefToApp && vNode.c == 'a')
	{
		domNode.addEventListener('click', _VirtualDom_divertHrefToApp(domNode));
	}

	_VirtualDom_applyFacts(domNode, eventNode, vNode.d);

	for (var kids = vNode.e, i = 0; i < kids.length; i++)
	{
		_VirtualDom_appendChild(domNode, _VirtualDom_render(tag === 1 ? kids[i] : kids[i].b, eventNode));
	}

	return domNode;
}



// APPLY FACTS


function _VirtualDom_applyFacts(domNode, eventNode, facts)
{
	for (var key in facts)
	{
		var value = facts[key];

		key === 'a1'
			? _VirtualDom_applyStyles(domNode, value)
			:
		key === 'a0'
			? _VirtualDom_applyEvents(domNode, eventNode, value)
			:
		key === 'a3'
			? _VirtualDom_applyAttrs(domNode, value)
			:
		key === 'a4'
			? _VirtualDom_applyAttrsNS(domNode, value)
			:
		(key !== 'value' || key !== 'checked' || domNode[key] !== value) && (domNode[key] = value);
	}
}



// APPLY STYLES


function _VirtualDom_applyStyles(domNode, styles)
{
	var domNodeStyle = domNode.style;

	for (var key in styles)
	{
		domNodeStyle[key] = styles[key];
	}
}



// APPLY ATTRS


function _VirtualDom_applyAttrs(domNode, attrs)
{
	for (var key in attrs)
	{
		var value = attrs[key];
		value
			? domNode.setAttribute(key, value)
			: domNode.removeAttribute(key);
	}
}



// APPLY NAMESPACED ATTRS


function _VirtualDom_applyAttrsNS(domNode, nsAttrs)
{
	for (var key in nsAttrs)
	{
		var pair = nsAttrs[key];
		var namespace = pair.f;
		var value = pair.o;

		value
			? domNode.setAttributeNS(namespace, key, value)
			: domNode.removeAttributeNS(namespace, key);
	}
}



// APPLY EVENTS


function _VirtualDom_applyEvents(domNode, eventNode, events)
{
	var allCallbacks = domNode.elmFs || (domNode.elmFs = {});

	for (var key in events)
	{
		var newHandler = events[key];
		var oldCallback = allCallbacks[key];

		if (!newHandler)
		{
			domNode.removeEventListener(key, oldCallback);
			allCallbacks[key] = undefined;
			continue;
		}

		if (oldCallback)
		{
			var oldHandler = oldCallback.q;
			if (oldHandler.$ === newHandler.$)
			{
				oldCallback.q = newHandler;
				continue;
			}
			domNode.removeEventListener(key, oldCallback);
		}

		oldCallback = _VirtualDom_makeCallback(eventNode, newHandler);
		domNode.addEventListener(key, oldCallback,
			_VirtualDom_passiveSupported
			&& { passive: elm$virtual_dom$VirtualDom$toHandlerInt(newHandler) < 2 }
		);
		allCallbacks[key] = oldCallback;
	}
}



// PASSIVE EVENTS


var _VirtualDom_passiveSupported;

try
{
	window.addEventListener('t', null, Object.defineProperty({}, 'passive', {
		get: function() { _VirtualDom_passiveSupported = true; }
	}));
}
catch(e) {}



// EVENT HANDLERS


function _VirtualDom_makeCallback(eventNode, initialHandler)
{
	function callback(event)
	{
		var handler = callback.q;
		var result = _Json_runHelp(handler.a, event);

		if (!elm$core$Result$isOk(result))
		{
			return;
		}

		var tag = elm$virtual_dom$VirtualDom$toHandlerInt(handler);

		// 0 = Normal
		// 1 = MayStopPropagation
		// 2 = MayPreventDefault
		// 3 = Custom

		var value = result.a;
		var message = !tag ? value : tag < 3 ? value.a : value.message;
		var stopPropagation = tag == 1 ? value.b : tag == 3 && value.stopPropagation;
		var currentEventNode = (
			stopPropagation && event.stopPropagation(),
			(tag == 2 ? value.b : tag == 3 && value.preventDefault) && event.preventDefault(),
			eventNode
		);
		var tagger;
		var i;
		while (tagger = currentEventNode.j)
		{
			if (typeof tagger == 'function')
			{
				message = tagger(message);
			}
			else
			{
				for (var i = tagger.length; i--; )
				{
					message = tagger[i](message);
				}
			}
			currentEventNode = currentEventNode.p;
		}
		currentEventNode(message, stopPropagation); // stopPropagation implies isSync
	}

	callback.q = initialHandler;

	return callback;
}

function _VirtualDom_equalEvents(x, y)
{
	return x.$ == y.$ && _Json_equality(x.a, y.a);
}



// DIFF


// TODO: Should we do patches like in iOS?
//
// type Patch
//   = At Int Patch
//   | Batch (List Patch)
//   | Change ...
//
// How could it not be better?
//
function _VirtualDom_diff(x, y)
{
	var patches = [];
	_VirtualDom_diffHelp(x, y, patches, 0);
	return patches;
}


function _VirtualDom_pushPatch(patches, type, index, data)
{
	var patch = {
		$: type,
		r: index,
		s: data,
		t: undefined,
		u: undefined
	};
	patches.push(patch);
	return patch;
}


function _VirtualDom_diffHelp(x, y, patches, index)
{
	if (x === y)
	{
		return;
	}

	var xType = x.$;
	var yType = y.$;

	// Bail if you run into different types of nodes. Implies that the
	// structure has changed significantly and it's not worth a diff.
	if (xType !== yType)
	{
		if (xType === 1 && yType === 2)
		{
			y = _VirtualDom_dekey(y);
			yType = 1;
		}
		else
		{
			_VirtualDom_pushPatch(patches, 0, index, y);
			return;
		}
	}

	// Now we know that both nodes are the same $.
	switch (yType)
	{
		case 5:
			var xRefs = x.l;
			var yRefs = y.l;
			var i = xRefs.length;
			var same = i === yRefs.length;
			while (same && i--)
			{
				same = xRefs[i] === yRefs[i];
			}
			if (same)
			{
				y.k = x.k;
				return;
			}
			y.k = y.m();
			var subPatches = [];
			_VirtualDom_diffHelp(x.k, y.k, subPatches, 0);
			subPatches.length > 0 && _VirtualDom_pushPatch(patches, 1, index, subPatches);
			return;

		case 4:
			// gather nested taggers
			var xTaggers = x.j;
			var yTaggers = y.j;
			var nesting = false;

			var xSubNode = x.k;
			while (xSubNode.$ === 4)
			{
				nesting = true;

				typeof xTaggers !== 'object'
					? xTaggers = [xTaggers, xSubNode.j]
					: xTaggers.push(xSubNode.j);

				xSubNode = xSubNode.k;
			}

			var ySubNode = y.k;
			while (ySubNode.$ === 4)
			{
				nesting = true;

				typeof yTaggers !== 'object'
					? yTaggers = [yTaggers, ySubNode.j]
					: yTaggers.push(ySubNode.j);

				ySubNode = ySubNode.k;
			}

			// Just bail if different numbers of taggers. This implies the
			// structure of the virtual DOM has changed.
			if (nesting && xTaggers.length !== yTaggers.length)
			{
				_VirtualDom_pushPatch(patches, 0, index, y);
				return;
			}

			// check if taggers are "the same"
			if (nesting ? !_VirtualDom_pairwiseRefEqual(xTaggers, yTaggers) : xTaggers !== yTaggers)
			{
				_VirtualDom_pushPatch(patches, 2, index, yTaggers);
			}

			// diff everything below the taggers
			_VirtualDom_diffHelp(xSubNode, ySubNode, patches, index + 1);
			return;

		case 0:
			if (x.a !== y.a)
			{
				_VirtualDom_pushPatch(patches, 3, index, y.a);
			}
			return;

		case 1:
			_VirtualDom_diffNodes(x, y, patches, index, _VirtualDom_diffKids);
			return;

		case 2:
			_VirtualDom_diffNodes(x, y, patches, index, _VirtualDom_diffKeyedKids);
			return;

		case 3:
			if (x.h !== y.h)
			{
				_VirtualDom_pushPatch(patches, 0, index, y);
				return;
			}

			var factsDiff = _VirtualDom_diffFacts(x.d, y.d);
			factsDiff && _VirtualDom_pushPatch(patches, 4, index, factsDiff);

			var patch = y.i(x.g, y.g);
			patch && _VirtualDom_pushPatch(patches, 5, index, patch);

			return;
	}
}

// assumes the incoming arrays are the same length
function _VirtualDom_pairwiseRefEqual(as, bs)
{
	for (var i = 0; i < as.length; i++)
	{
		if (as[i] !== bs[i])
		{
			return false;
		}
	}

	return true;
}

function _VirtualDom_diffNodes(x, y, patches, index, diffKids)
{
	// Bail if obvious indicators have changed. Implies more serious
	// structural changes such that it's not worth it to diff.
	if (x.c !== y.c || x.f !== y.f)
	{
		_VirtualDom_pushPatch(patches, 0, index, y);
		return;
	}

	var factsDiff = _VirtualDom_diffFacts(x.d, y.d);
	factsDiff && _VirtualDom_pushPatch(patches, 4, index, factsDiff);

	diffKids(x, y, patches, index);
}



// DIFF FACTS


// TODO Instead of creating a new diff object, it's possible to just test if
// there *is* a diff. During the actual patch, do the diff again and make the
// modifications directly. This way, there's no new allocations. Worth it?
function _VirtualDom_diffFacts(x, y, category)
{
	var diff;

	// look for changes and removals
	for (var xKey in x)
	{
		if (xKey === 'a1' || xKey === 'a0' || xKey === 'a3' || xKey === 'a4')
		{
			var subDiff = _VirtualDom_diffFacts(x[xKey], y[xKey] || {}, xKey);
			if (subDiff)
			{
				diff = diff || {};
				diff[xKey] = subDiff;
			}
			continue;
		}

		// remove if not in the new facts
		if (!(xKey in y))
		{
			diff = diff || {};
			diff[xKey] =
				!category
					? (typeof x[xKey] === 'string' ? '' : null)
					:
				(category === 'a1')
					? ''
					:
				(category === 'a0' || category === 'a3')
					? undefined
					:
				{ f: x[xKey].f, o: undefined };

			continue;
		}

		var xValue = x[xKey];
		var yValue = y[xKey];

		// reference equal, so don't worry about it
		if (xValue === yValue && xKey !== 'value' && xKey !== 'checked'
			|| category === 'a0' && _VirtualDom_equalEvents(xValue, yValue))
		{
			continue;
		}

		diff = diff || {};
		diff[xKey] = yValue;
	}

	// add new stuff
	for (var yKey in y)
	{
		if (!(yKey in x))
		{
			diff = diff || {};
			diff[yKey] = y[yKey];
		}
	}

	return diff;
}



// DIFF KIDS


function _VirtualDom_diffKids(xParent, yParent, patches, index)
{
	var xKids = xParent.e;
	var yKids = yParent.e;

	var xLen = xKids.length;
	var yLen = yKids.length;

	// FIGURE OUT IF THERE ARE INSERTS OR REMOVALS

	if (xLen > yLen)
	{
		_VirtualDom_pushPatch(patches, 6, index, {
			v: yLen,
			i: xLen - yLen
		});
	}
	else if (xLen < yLen)
	{
		_VirtualDom_pushPatch(patches, 7, index, {
			v: xLen,
			e: yKids
		});
	}

	// PAIRWISE DIFF EVERYTHING ELSE

	for (var minLen = xLen < yLen ? xLen : yLen, i = 0; i < minLen; i++)
	{
		var xKid = xKids[i];
		_VirtualDom_diffHelp(xKid, yKids[i], patches, ++index);
		index += xKid.b || 0;
	}
}



// KEYED DIFF


function _VirtualDom_diffKeyedKids(xParent, yParent, patches, rootIndex)
{
	var localPatches = [];

	var changes = {}; // Dict String Entry
	var inserts = []; // Array { index : Int, entry : Entry }
	// type Entry = { tag : String, vnode : VNode, index : Int, data : _ }

	var xKids = xParent.e;
	var yKids = yParent.e;
	var xLen = xKids.length;
	var yLen = yKids.length;
	var xIndex = 0;
	var yIndex = 0;

	var index = rootIndex;

	while (xIndex < xLen && yIndex < yLen)
	{
		var x = xKids[xIndex];
		var y = yKids[yIndex];

		var xKey = x.a;
		var yKey = y.a;
		var xNode = x.b;
		var yNode = y.b;

		// check if keys match

		if (xKey === yKey)
		{
			index++;
			_VirtualDom_diffHelp(xNode, yNode, localPatches, index);
			index += xNode.b || 0;

			xIndex++;
			yIndex++;
			continue;
		}

		// look ahead 1 to detect insertions and removals.

		var xNext = xKids[xIndex + 1];
		var yNext = yKids[yIndex + 1];

		if (xNext)
		{
			var xNextKey = xNext.a;
			var xNextNode = xNext.b;
			var oldMatch = yKey === xNextKey;
		}

		if (yNext)
		{
			var yNextKey = yNext.a;
			var yNextNode = yNext.b;
			var newMatch = xKey === yNextKey;
		}


		// swap x and y
		if (newMatch && oldMatch)
		{
			index++;
			_VirtualDom_diffHelp(xNode, yNextNode, localPatches, index);
			_VirtualDom_insertNode(changes, localPatches, xKey, yNode, yIndex, inserts);
			index += xNode.b || 0;

			index++;
			_VirtualDom_removeNode(changes, localPatches, xKey, xNextNode, index);
			index += xNextNode.b || 0;

			xIndex += 2;
			yIndex += 2;
			continue;
		}

		// insert y
		if (newMatch)
		{
			index++;
			_VirtualDom_insertNode(changes, localPatches, yKey, yNode, yIndex, inserts);
			_VirtualDom_diffHelp(xNode, yNextNode, localPatches, index);
			index += xNode.b || 0;

			xIndex += 1;
			yIndex += 2;
			continue;
		}

		// remove x
		if (oldMatch)
		{
			index++;
			_VirtualDom_removeNode(changes, localPatches, xKey, xNode, index);
			index += xNode.b || 0;

			index++;
			_VirtualDom_diffHelp(xNextNode, yNode, localPatches, index);
			index += xNextNode.b || 0;

			xIndex += 2;
			yIndex += 1;
			continue;
		}

		// remove x, insert y
		if (xNext && xNextKey === yNextKey)
		{
			index++;
			_VirtualDom_removeNode(changes, localPatches, xKey, xNode, index);
			_VirtualDom_insertNode(changes, localPatches, yKey, yNode, yIndex, inserts);
			index += xNode.b || 0;

			index++;
			_VirtualDom_diffHelp(xNextNode, yNextNode, localPatches, index);
			index += xNextNode.b || 0;

			xIndex += 2;
			yIndex += 2;
			continue;
		}

		break;
	}

	// eat up any remaining nodes with removeNode and insertNode

	while (xIndex < xLen)
	{
		index++;
		var x = xKids[xIndex];
		var xNode = x.b;
		_VirtualDom_removeNode(changes, localPatches, x.a, xNode, index);
		index += xNode.b || 0;
		xIndex++;
	}

	while (yIndex < yLen)
	{
		var endInserts = endInserts || [];
		var y = yKids[yIndex];
		_VirtualDom_insertNode(changes, localPatches, y.a, y.b, undefined, endInserts);
		yIndex++;
	}

	if (localPatches.length > 0 || inserts.length > 0 || endInserts)
	{
		_VirtualDom_pushPatch(patches, 8, rootIndex, {
			w: localPatches,
			x: inserts,
			y: endInserts
		});
	}
}



// CHANGES FROM KEYED DIFF


var _VirtualDom_POSTFIX = '_elmW6BL';


function _VirtualDom_insertNode(changes, localPatches, key, vnode, yIndex, inserts)
{
	var entry = changes[key];

	// never seen this key before
	if (!entry)
	{
		entry = {
			c: 0,
			z: vnode,
			r: yIndex,
			s: undefined
		};

		inserts.push({ r: yIndex, A: entry });
		changes[key] = entry;

		return;
	}

	// this key was removed earlier, a match!
	if (entry.c === 1)
	{
		inserts.push({ r: yIndex, A: entry });

		entry.c = 2;
		var subPatches = [];
		_VirtualDom_diffHelp(entry.z, vnode, subPatches, entry.r);
		entry.r = yIndex;
		entry.s.s = {
			w: subPatches,
			A: entry
		};

		return;
	}

	// this key has already been inserted or moved, a duplicate!
	_VirtualDom_insertNode(changes, localPatches, key + _VirtualDom_POSTFIX, vnode, yIndex, inserts);
}


function _VirtualDom_removeNode(changes, localPatches, key, vnode, index)
{
	var entry = changes[key];

	// never seen this key before
	if (!entry)
	{
		var patch = _VirtualDom_pushPatch(localPatches, 9, index, undefined);

		changes[key] = {
			c: 1,
			z: vnode,
			r: index,
			s: patch
		};

		return;
	}

	// this key was inserted earlier, a match!
	if (entry.c === 0)
	{
		entry.c = 2;
		var subPatches = [];
		_VirtualDom_diffHelp(vnode, entry.z, subPatches, index);

		_VirtualDom_pushPatch(localPatches, 9, index, {
			w: subPatches,
			A: entry
		});

		return;
	}

	// this key has already been removed or moved, a duplicate!
	_VirtualDom_removeNode(changes, localPatches, key + _VirtualDom_POSTFIX, vnode, index);
}



// ADD DOM NODES
//
// Each DOM node has an "index" assigned in order of traversal. It is important
// to minimize our crawl over the actual DOM, so these indexes (along with the
// descendantsCount of virtual nodes) let us skip touching entire subtrees of
// the DOM if we know there are no patches there.


function _VirtualDom_addDomNodes(domNode, vNode, patches, eventNode)
{
	_VirtualDom_addDomNodesHelp(domNode, vNode, patches, 0, 0, vNode.b, eventNode);
}


// assumes `patches` is non-empty and indexes increase monotonically.
function _VirtualDom_addDomNodesHelp(domNode, vNode, patches, i, low, high, eventNode)
{
	var patch = patches[i];
	var index = patch.r;

	while (index === low)
	{
		var patchType = patch.$;

		if (patchType === 1)
		{
			_VirtualDom_addDomNodes(domNode, vNode.k, patch.s, eventNode);
		}
		else if (patchType === 8)
		{
			patch.t = domNode;
			patch.u = eventNode;

			var subPatches = patch.s.w;
			if (subPatches.length > 0)
			{
				_VirtualDom_addDomNodesHelp(domNode, vNode, subPatches, 0, low, high, eventNode);
			}
		}
		else if (patchType === 9)
		{
			patch.t = domNode;
			patch.u = eventNode;

			var data = patch.s;
			if (data)
			{
				data.A.s = domNode;
				var subPatches = data.w;
				if (subPatches.length > 0)
				{
					_VirtualDom_addDomNodesHelp(domNode, vNode, subPatches, 0, low, high, eventNode);
				}
			}
		}
		else
		{
			patch.t = domNode;
			patch.u = eventNode;
		}

		i++;

		if (!(patch = patches[i]) || (index = patch.r) > high)
		{
			return i;
		}
	}

	var tag = vNode.$;

	if (tag === 4)
	{
		var subNode = vNode.k;

		while (subNode.$ === 4)
		{
			subNode = subNode.k;
		}

		return _VirtualDom_addDomNodesHelp(domNode, subNode, patches, i, low + 1, high, domNode.elm_event_node_ref);
	}

	// tag must be 1 or 2 at this point

	var vKids = vNode.e;
	var childNodes = domNode.childNodes;
	for (var j = 0; j < vKids.length; j++)
	{
		low++;
		var vKid = tag === 1 ? vKids[j] : vKids[j].b;
		var nextLow = low + (vKid.b || 0);
		if (low <= index && index <= nextLow)
		{
			i = _VirtualDom_addDomNodesHelp(childNodes[j], vKid, patches, i, low, nextLow, eventNode);
			if (!(patch = patches[i]) || (index = patch.r) > high)
			{
				return i;
			}
		}
		low = nextLow;
	}
	return i;
}



// APPLY PATCHES


function _VirtualDom_applyPatches(rootDomNode, oldVirtualNode, patches, eventNode)
{
	if (patches.length === 0)
	{
		return rootDomNode;
	}

	_VirtualDom_addDomNodes(rootDomNode, oldVirtualNode, patches, eventNode);
	return _VirtualDom_applyPatchesHelp(rootDomNode, patches);
}

function _VirtualDom_applyPatchesHelp(rootDomNode, patches)
{
	for (var i = 0; i < patches.length; i++)
	{
		var patch = patches[i];
		var localDomNode = patch.t
		var newNode = _VirtualDom_applyPatch(localDomNode, patch);
		if (localDomNode === rootDomNode)
		{
			rootDomNode = newNode;
		}
	}
	return rootDomNode;
}

function _VirtualDom_applyPatch(domNode, patch)
{
	switch (patch.$)
	{
		case 0:
			return _VirtualDom_applyPatchRedraw(domNode, patch.s, patch.u);

		case 4:
			_VirtualDom_applyFacts(domNode, patch.u, patch.s);
			return domNode;

		case 3:
			domNode.replaceData(0, domNode.length, patch.s);
			return domNode;

		case 1:
			return _VirtualDom_applyPatchesHelp(domNode, patch.s);

		case 2:
			if (domNode.elm_event_node_ref)
			{
				domNode.elm_event_node_ref.j = patch.s;
			}
			else
			{
				domNode.elm_event_node_ref = { j: patch.s, p: patch.u };
			}
			return domNode;

		case 6:
			var data = patch.s;
			for (var i = 0; i < data.i; i++)
			{
				domNode.removeChild(domNode.childNodes[data.v]);
			}
			return domNode;

		case 7:
			var data = patch.s;
			var kids = data.e;
			var i = data.v;
			var theEnd = domNode.childNodes[i];
			for (; i < kids.length; i++)
			{
				domNode.insertBefore(_VirtualDom_render(kids[i], patch.u), theEnd);
			}
			return domNode;

		case 9:
			var data = patch.s;
			if (!data)
			{
				domNode.parentNode.removeChild(domNode);
				return domNode;
			}
			var entry = data.A;
			if (typeof entry.r !== 'undefined')
			{
				domNode.parentNode.removeChild(domNode);
			}
			entry.s = _VirtualDom_applyPatchesHelp(domNode, data.w);
			return domNode;

		case 8:
			return _VirtualDom_applyPatchReorder(domNode, patch);

		case 5:
			return patch.s(domNode);

		default:
			_Debug_crash(10); // 'Ran into an unknown patch!'
	}
}


function _VirtualDom_applyPatchRedraw(domNode, vNode, eventNode)
{
	var parentNode = domNode.parentNode;
	var newNode = _VirtualDom_render(vNode, eventNode);

	if (!newNode.elm_event_node_ref)
	{
		newNode.elm_event_node_ref = domNode.elm_event_node_ref;
	}

	if (parentNode && newNode !== domNode)
	{
		parentNode.replaceChild(newNode, domNode);
	}
	return newNode;
}


function _VirtualDom_applyPatchReorder(domNode, patch)
{
	var data = patch.s;

	// remove end inserts
	var frag = _VirtualDom_applyPatchReorderEndInsertsHelp(data.y, patch);

	// removals
	domNode = _VirtualDom_applyPatchesHelp(domNode, data.w);

	// inserts
	var inserts = data.x;
	for (var i = 0; i < inserts.length; i++)
	{
		var insert = inserts[i];
		var entry = insert.A;
		var node = entry.c === 2
			? entry.s
			: _VirtualDom_render(entry.z, patch.u);
		domNode.insertBefore(node, domNode.childNodes[insert.r]);
	}

	// add end inserts
	if (frag)
	{
		_VirtualDom_appendChild(domNode, frag);
	}

	return domNode;
}


function _VirtualDom_applyPatchReorderEndInsertsHelp(endInserts, patch)
{
	if (!endInserts)
	{
		return;
	}

	var frag = _VirtualDom_doc.createDocumentFragment();
	for (var i = 0; i < endInserts.length; i++)
	{
		var insert = endInserts[i];
		var entry = insert.A;
		_VirtualDom_appendChild(frag, entry.c === 2
			? entry.s
			: _VirtualDom_render(entry.z, patch.u)
		);
	}
	return frag;
}


function _VirtualDom_virtualize(node)
{
	// TEXT NODES

	if (node.nodeType === 3)
	{
		return _VirtualDom_text(node.textContent);
	}


	// WEIRD NODES

	if (node.nodeType !== 1)
	{
		return _VirtualDom_text('');
	}


	// ELEMENT NODES

	var attrList = _List_Nil;
	var attrs = node.attributes;
	for (var i = attrs.length; i--; )
	{
		var attr = attrs[i];
		var name = attr.name;
		var value = attr.value;
		attrList = _List_Cons( A2(_VirtualDom_attribute, name, value), attrList );
	}

	var tag = node.tagName.toLowerCase();
	var kidList = _List_Nil;
	var kids = node.childNodes;

	for (var i = kids.length; i--; )
	{
		kidList = _List_Cons(_VirtualDom_virtualize(kids[i]), kidList);
	}
	return A3(_VirtualDom_node, tag, attrList, kidList);
}

function _VirtualDom_dekey(keyedNode)
{
	var keyedKids = keyedNode.e;
	var len = keyedKids.length;
	var kids = new Array(len);
	for (var i = 0; i < len; i++)
	{
		kids[i] = keyedKids[i].b;
	}

	return {
		$: 1,
		c: keyedNode.c,
		d: keyedNode.d,
		e: kids,
		f: keyedNode.f,
		b: keyedNode.b
	};
}

/*
 * Copyright (c) 2010 Mozilla Corporation
 * Copyright (c) 2010 Vladimir Vukicevic
 * Copyright (c) 2013 John Mayer
 * Copyright (c) 2018 Andrey Kuzmin
 *
 * Permission is hereby granted, free of charge, to any person
 * obtaining a copy of this software and associated documentation
 * files (the "Software"), to deal in the Software without
 * restriction, including without limitation the rights to use,
 * copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following
 * conditions:
 *
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
 * OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
 * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
 * WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
 * OTHER DEALINGS IN THE SOFTWARE.
 */

// Vector2

var _MJS_v2 = F2(function(x, y) {
    return new Float64Array([x, y]);
});

var _MJS_v2getX = function(a) {
    return a[0];
};

var _MJS_v2getY = function(a) {
    return a[1];
};

var _MJS_v2setX = F2(function(x, a) {
    return new Float64Array([x, a[1]]);
});

var _MJS_v2setY = F2(function(y, a) {
    return new Float64Array([a[0], y]);
});

var _MJS_v2toRecord = function(a) {
    return { x: a[0], y: a[1] };
};

var _MJS_v2fromRecord = function(r) {
    return new Float64Array([r.x, r.y]);
};

var _MJS_v2add = F2(function(a, b) {
    var r = new Float64Array(2);
    r[0] = a[0] + b[0];
    r[1] = a[1] + b[1];
    return r;
});

var _MJS_v2sub = F2(function(a, b) {
    var r = new Float64Array(2);
    r[0] = a[0] - b[0];
    r[1] = a[1] - b[1];
    return r;
});

var _MJS_v2negate = function(a) {
    var r = new Float64Array(2);
    r[0] = -a[0];
    r[1] = -a[1];
    return r;
};

var _MJS_v2direction = F2(function(a, b) {
    var r = new Float64Array(2);
    r[0] = a[0] - b[0];
    r[1] = a[1] - b[1];
    var im = 1.0 / _MJS_v2lengthLocal(r);
    r[0] = r[0] * im;
    r[1] = r[1] * im;
    return r;
});

function _MJS_v2lengthLocal(a) {
    return Math.sqrt(a[0] * a[0] + a[1] * a[1]);
}
var _MJS_v2length = _MJS_v2lengthLocal;

var _MJS_v2lengthSquared = function(a) {
    return a[0] * a[0] + a[1] * a[1];
};

var _MJS_v2distance = F2(function(a, b) {
    var dx = a[0] - b[0];
    var dy = a[1] - b[1];
    return Math.sqrt(dx * dx + dy * dy);
});

var _MJS_v2distanceSquared = F2(function(a, b) {
    var dx = a[0] - b[0];
    var dy = a[1] - b[1];
    return dx * dx + dy * dy;
});

var _MJS_v2normalize = function(a) {
    var r = new Float64Array(2);
    var im = 1.0 / _MJS_v2lengthLocal(a);
    r[0] = a[0] * im;
    r[1] = a[1] * im;
    return r;
};

var _MJS_v2scale = F2(function(k, a) {
    var r = new Float64Array(2);
    r[0] = a[0] * k;
    r[1] = a[1] * k;
    return r;
});

var _MJS_v2dot = F2(function(a, b) {
    return a[0] * b[0] + a[1] * b[1];
});

// Vector3

var _MJS_v3temp1Local = new Float64Array(3);
var _MJS_v3temp2Local = new Float64Array(3);
var _MJS_v3temp3Local = new Float64Array(3);

var _MJS_v3 = F3(function(x, y, z) {
    return new Float64Array([x, y, z]);
});

var _MJS_v3getX = function(a) {
    return a[0];
};

var _MJS_v3getY = function(a) {
    return a[1];
};

var _MJS_v3getZ = function(a) {
    return a[2];
};

var _MJS_v3setX = F2(function(x, a) {
    return new Float64Array([x, a[1], a[2]]);
});

var _MJS_v3setY = F2(function(y, a) {
    return new Float64Array([a[0], y, a[2]]);
});

var _MJS_v3setZ = F2(function(z, a) {
    return new Float64Array([a[0], a[1], z]);
});

var _MJS_v3toRecord = function(a) {
    return { x: a[0], y: a[1], z: a[2] };
};

var _MJS_v3fromRecord3 = function(r) {
    return new Float64Array([r.x, r.y, r.z]);
};

var _MJS_v3add = F2(function(a, b) {
    var r = new Float64Array(3);
    r[0] = a[0] + b[0];
    r[1] = a[1] + b[1];
    r[2] = a[2] + b[2];
    return r;
});

function _MJS_v3subLocal(a, b, r) {
    if (r === undefined) {
        r = new Float64Array(3);
    }
    r[0] = a[0] - b[0];
    r[1] = a[1] - b[1];
    r[2] = a[2] - b[2];
    return r;
}
var _MJS_v3sub = F2(_MJS_v3subLocal);

var _MJS_v3negate = function(a) {
    var r = new Float64Array(3);
    r[0] = -a[0];
    r[1] = -a[1];
    r[2] = -a[2];
    return r;
};

function _MJS_v3directionLocal(a, b, r) {
    if (r === undefined) {
        r = new Float64Array(3);
    }
    return _MJS_v3normalizeLocal(_MJS_v3subLocal(a, b, r), r);
}
var _MJS_v3direction = F2(_MJS_v3directionLocal);

function _MJS_v3lengthLocal(a) {
    return Math.sqrt(a[0] * a[0] + a[1] * a[1] + a[2] * a[2]);
}
var _MJS_v3length = _MJS_v3lengthLocal;

var _MJS_v3lengthSquared = function(a) {
    return a[0] * a[0] + a[1] * a[1] + a[2] * a[2];
};

var _MJS_v3distance = function(a, b) {
    var dx = a[0] - b[0];
    var dy = a[1] - b[1];
    var dz = a[2] - b[2];
    return Math.sqrt(dx * dx + dy * dy + dz * dz);
};

var _MJS_v3distanceSquared = function(a, b) {
    var dx = a[0] - b[0];
    var dy = a[1] - b[1];
    var dz = a[2] - b[2];
    return dx * dx + dy * dy + dz * dz;
};

function _MJS_v3normalizeLocal(a, r) {
    if (r === undefined) {
        r = new Float64Array(3);
    }
    var im = 1.0 / _MJS_v3lengthLocal(a);
    r[0] = a[0] * im;
    r[1] = a[1] * im;
    r[2] = a[2] * im;
    return r;
}
var _MJS_v3normalize = _MJS_v3normalizeLocal;

var _MJS_v3scale = F2(function(k, a) {
    return new Float64Array([a[0] * k, a[1] * k, a[2] * k]);
});

var _MJS_v3dotLocal = function(a, b) {
    return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
};
var _MJS_v3dot = F2(_MJS_v3dotLocal);

function _MJS_v3crossLocal(a, b, r) {
    if (r === undefined) {
        r = new Float64Array(3);
    }
    r[0] = a[1] * b[2] - a[2] * b[1];
    r[1] = a[2] * b[0] - a[0] * b[2];
    r[2] = a[0] * b[1] - a[1] * b[0];
    return r;
}
var _MJS_v3cross = F2(_MJS_v3crossLocal);

var _MJS_v3mul4x4 = F2(function(m, v) {
    var w;
    var tmp = _MJS_v3temp1Local;
    var r = new Float64Array(3);

    tmp[0] = m[3];
    tmp[1] = m[7];
    tmp[2] = m[11];
    w = _MJS_v3dotLocal(v, tmp) + m[15];
    tmp[0] = m[0];
    tmp[1] = m[4];
    tmp[2] = m[8];
    r[0] = (_MJS_v3dotLocal(v, tmp) + m[12]) / w;
    tmp[0] = m[1];
    tmp[1] = m[5];
    tmp[2] = m[9];
    r[1] = (_MJS_v3dotLocal(v, tmp) + m[13]) / w;
    tmp[0] = m[2];
    tmp[1] = m[6];
    tmp[2] = m[10];
    r[2] = (_MJS_v3dotLocal(v, tmp) + m[14]) / w;
    return r;
});

// Vector4

var _MJS_v4 = F4(function(x, y, z, w) {
    return new Float64Array([x, y, z, w]);
});

var _MJS_v4getX = function(a) {
    return a[0];
};

var _MJS_v4getY = function(a) {
    return a[1];
};

var _MJS_v4getZ = function(a) {
    return a[2];
};

var _MJS_v4getW = function(a) {
    return a[3];
};

var _MJS_v4setX = F2(function(x, a) {
    return new Float64Array([x, a[1], a[2], a[3]]);
});

var _MJS_v4setY = F2(function(y, a) {
    return new Float64Array([a[0], y, a[2], a[3]]);
});

var _MJS_v4setZ = F2(function(z, a) {
    return new Float64Array([a[0], a[1], z, a[3]]);
});

var _MJS_v4setW = F2(function(w, a) {
    return new Float64Array([a[0], a[1], a[2], w]);
});

var _MJS_v4toRecord = function(a) {
    return { x: a[0], y: a[1], z: a[2], w: a[3] };
};

var _MJS_v4fromRecord = function(r) {
    return new Float64Array([r.x, r.y, r.z, r.w]);
};

var _MJS_v4add = F2(function(a, b) {
    var r = new Float64Array(4);
    r[0] = a[0] + b[0];
    r[1] = a[1] + b[1];
    r[2] = a[2] + b[2];
    r[3] = a[3] + b[3];
    return r;
});

var _MJS_v4sub = F2(function(a, b) {
    var r = new Float64Array(4);
    r[0] = a[0] - b[0];
    r[1] = a[1] - b[1];
    r[2] = a[2] - b[2];
    r[3] = a[3] - b[3];
    return r;
});

var _MJS_v4negate = function(a) {
    var r = new Float64Array(4);
    r[0] = -a[0];
    r[1] = -a[1];
    r[2] = -a[2];
    r[3] = -a[3];
    return r;
};

var _MJS_v4direction = F2(function(a, b) {
    var r = new Float64Array(4);
    r[0] = a[0] - b[0];
    r[1] = a[1] - b[1];
    r[2] = a[2] - b[2];
    r[3] = a[3] - b[3];
    var im = 1.0 / _MJS_v4lengthLocal(r);
    r[0] = r[0] * im;
    r[1] = r[1] * im;
    r[2] = r[2] * im;
    r[3] = r[3] * im;
    return r;
});

function _MJS_v4lengthLocal(a) {
    return Math.sqrt(a[0] * a[0] + a[1] * a[1] + a[2] * a[2] + a[3] * a[3]);
}
var _MJS_v4length = _MJS_v4lengthLocal;

var _MJS_v4lengthSquared = function(a) {
    return a[0] * a[0] + a[1] * a[1] + a[2] * a[2] + a[3] * a[3];
};

var _MJS_v4distance = F2(function(a, b) {
    var dx = a[0] - b[0];
    var dy = a[1] - b[1];
    var dz = a[2] - b[2];
    var dw = a[3] - b[3];
    return Math.sqrt(dx * dx + dy * dy + dz * dz + dw * dw);
});

var _MJS_v4distanceSquared = F2(function(a, b) {
    var dx = a[0] - b[0];
    var dy = a[1] - b[1];
    var dz = a[2] - b[2];
    var dw = a[3] - b[3];
    return dx * dx + dy * dy + dz * dz + dw * dw;
});

var _MJS_v4normalize = function(a) {
    var r = new Float64Array(4);
    var im = 1.0 / _MJS_v4lengthLocal(a);
    r[0] = a[0] * im;
    r[1] = a[1] * im;
    r[2] = a[2] * im;
    r[3] = a[3] * im;
    return r;
};

var _MJS_v4scale = F2(function(k, a) {
    var r = new Float64Array(4);
    r[0] = a[0] * k;
    r[1] = a[1] * k;
    r[2] = a[2] * k;
    r[3] = a[3] * k;
    return r;
});

var _MJS_v4dot = F2(function(a, b) {
    return a[0] * b[0] + a[1] * b[1] + a[2] * b[2] + a[3] * b[3];
});

// Matrix4

var _MJS_m4x4temp1Local = new Float64Array(16);
var _MJS_m4x4temp2Local = new Float64Array(16);

var _MJS_m4x4identity = new Float64Array([
    1.0, 0.0, 0.0, 0.0,
    0.0, 1.0, 0.0, 0.0,
    0.0, 0.0, 1.0, 0.0,
    0.0, 0.0, 0.0, 1.0
]);

var _MJS_m4x4fromRecord = function(r) {
    var m = new Float64Array(16);
    m[0] = r.m11;
    m[1] = r.m21;
    m[2] = r.m31;
    m[3] = r.m41;
    m[4] = r.m12;
    m[5] = r.m22;
    m[6] = r.m32;
    m[7] = r.m42;
    m[8] = r.m13;
    m[9] = r.m23;
    m[10] = r.m33;
    m[11] = r.m43;
    m[12] = r.m14;
    m[13] = r.m24;
    m[14] = r.m34;
    m[15] = r.m44;
    return m;
};

var _MJS_m4x4toRecord = function(m) {
    return {
        m11: m[0], m21: m[1], m31: m[2], m41: m[3],
        m12: m[4], m22: m[5], m32: m[6], m42: m[7],
        m13: m[8], m23: m[9], m33: m[10], m43: m[11],
        m14: m[12], m24: m[13], m34: m[14], m44: m[15]
    };
};

var _MJS_m4x4inverse = function(m) {
    var r = new Float64Array(16);

    r[0] = m[5] * m[10] * m[15] - m[5] * m[11] * m[14] - m[9] * m[6] * m[15] +
        m[9] * m[7] * m[14] + m[13] * m[6] * m[11] - m[13] * m[7] * m[10];
    r[4] = -m[4] * m[10] * m[15] + m[4] * m[11] * m[14] + m[8] * m[6] * m[15] -
        m[8] * m[7] * m[14] - m[12] * m[6] * m[11] + m[12] * m[7] * m[10];
    r[8] = m[4] * m[9] * m[15] - m[4] * m[11] * m[13] - m[8] * m[5] * m[15] +
        m[8] * m[7] * m[13] + m[12] * m[5] * m[11] - m[12] * m[7] * m[9];
    r[12] = -m[4] * m[9] * m[14] + m[4] * m[10] * m[13] + m[8] * m[5] * m[14] -
        m[8] * m[6] * m[13] - m[12] * m[5] * m[10] + m[12] * m[6] * m[9];
    r[1] = -m[1] * m[10] * m[15] + m[1] * m[11] * m[14] + m[9] * m[2] * m[15] -
        m[9] * m[3] * m[14] - m[13] * m[2] * m[11] + m[13] * m[3] * m[10];
    r[5] = m[0] * m[10] * m[15] - m[0] * m[11] * m[14] - m[8] * m[2] * m[15] +
        m[8] * m[3] * m[14] + m[12] * m[2] * m[11] - m[12] * m[3] * m[10];
    r[9] = -m[0] * m[9] * m[15] + m[0] * m[11] * m[13] + m[8] * m[1] * m[15] -
        m[8] * m[3] * m[13] - m[12] * m[1] * m[11] + m[12] * m[3] * m[9];
    r[13] = m[0] * m[9] * m[14] - m[0] * m[10] * m[13] - m[8] * m[1] * m[14] +
        m[8] * m[2] * m[13] + m[12] * m[1] * m[10] - m[12] * m[2] * m[9];
    r[2] = m[1] * m[6] * m[15] - m[1] * m[7] * m[14] - m[5] * m[2] * m[15] +
        m[5] * m[3] * m[14] + m[13] * m[2] * m[7] - m[13] * m[3] * m[6];
    r[6] = -m[0] * m[6] * m[15] + m[0] * m[7] * m[14] + m[4] * m[2] * m[15] -
        m[4] * m[3] * m[14] - m[12] * m[2] * m[7] + m[12] * m[3] * m[6];
    r[10] = m[0] * m[5] * m[15] - m[0] * m[7] * m[13] - m[4] * m[1] * m[15] +
        m[4] * m[3] * m[13] + m[12] * m[1] * m[7] - m[12] * m[3] * m[5];
    r[14] = -m[0] * m[5] * m[14] + m[0] * m[6] * m[13] + m[4] * m[1] * m[14] -
        m[4] * m[2] * m[13] - m[12] * m[1] * m[6] + m[12] * m[2] * m[5];
    r[3] = -m[1] * m[6] * m[11] + m[1] * m[7] * m[10] + m[5] * m[2] * m[11] -
        m[5] * m[3] * m[10] - m[9] * m[2] * m[7] + m[9] * m[3] * m[6];
    r[7] = m[0] * m[6] * m[11] - m[0] * m[7] * m[10] - m[4] * m[2] * m[11] +
        m[4] * m[3] * m[10] + m[8] * m[2] * m[7] - m[8] * m[3] * m[6];
    r[11] = -m[0] * m[5] * m[11] + m[0] * m[7] * m[9] + m[4] * m[1] * m[11] -
        m[4] * m[3] * m[9] - m[8] * m[1] * m[7] + m[8] * m[3] * m[5];
    r[15] = m[0] * m[5] * m[10] - m[0] * m[6] * m[9] - m[4] * m[1] * m[10] +
        m[4] * m[2] * m[9] + m[8] * m[1] * m[6] - m[8] * m[2] * m[5];

    var det = m[0] * r[0] + m[1] * r[4] + m[2] * r[8] + m[3] * r[12];

    if (det === 0) {
        return elm$core$Maybe$Nothing;
    }

    det = 1.0 / det;

    for (var i = 0; i < 16; i = i + 1) {
        r[i] = r[i] * det;
    }

    return elm$core$Maybe$Just(r);
};

var _MJS_m4x4inverseOrthonormal = function(m) {
    var r = new Float64Array(16);
    _MJS_m4x4transposeLocal(m, r);
    var t = [m[12], m[13], m[14]];
    r[3] = r[7] = r[11] = 0;
    r[12] = -_MJS_v3dotLocal([r[0], r[4], r[8]], t);
    r[13] = -_MJS_v3dotLocal([r[1], r[5], r[9]], t);
    r[14] = -_MJS_v3dotLocal([r[2], r[6], r[10]], t);
    return r;
};

function _MJS_m4x4makeFrustumLocal(left, right, bottom, top, znear, zfar) {
    var r = new Float64Array(16);

    r[0] = 2 * znear / (right - left);
    r[1] = 0;
    r[2] = 0;
    r[3] = 0;
    r[4] = 0;
    r[5] = 2 * znear / (top - bottom);
    r[6] = 0;
    r[7] = 0;
    r[8] = (right + left) / (right - left);
    r[9] = (top + bottom) / (top - bottom);
    r[10] = -(zfar + znear) / (zfar - znear);
    r[11] = -1;
    r[12] = 0;
    r[13] = 0;
    r[14] = -2 * zfar * znear / (zfar - znear);
    r[15] = 0;

    return r;
}
var _MJS_m4x4makeFrustum = F6(_MJS_m4x4makeFrustumLocal);

var _MJS_m4x4makePerspective = F4(function(fovy, aspect, znear, zfar) {
    var ymax = znear * Math.tan(fovy * Math.PI / 360.0);
    var ymin = -ymax;
    var xmin = ymin * aspect;
    var xmax = ymax * aspect;

    return _MJS_m4x4makeFrustumLocal(xmin, xmax, ymin, ymax, znear, zfar);
});

function _MJS_m4x4makeOrthoLocal(left, right, bottom, top, znear, zfar) {
    var r = new Float64Array(16);

    r[0] = 2 / (right - left);
    r[1] = 0;
    r[2] = 0;
    r[3] = 0;
    r[4] = 0;
    r[5] = 2 / (top - bottom);
    r[6] = 0;
    r[7] = 0;
    r[8] = 0;
    r[9] = 0;
    r[10] = -2 / (zfar - znear);
    r[11] = 0;
    r[12] = -(right + left) / (right - left);
    r[13] = -(top + bottom) / (top - bottom);
    r[14] = -(zfar + znear) / (zfar - znear);
    r[15] = 1;

    return r;
}
var _MJS_m4x4makeOrtho = F6(_MJS_m4x4makeOrthoLocal);

var _MJS_m4x4makeOrtho2D = F4(function(left, right, bottom, top) {
    return _MJS_m4x4makeOrthoLocal(left, right, bottom, top, -1, 1);
});

function _MJS_m4x4mulLocal(a, b) {
    var r = new Float64Array(16);
    var a11 = a[0];
    var a21 = a[1];
    var a31 = a[2];
    var a41 = a[3];
    var a12 = a[4];
    var a22 = a[5];
    var a32 = a[6];
    var a42 = a[7];
    var a13 = a[8];
    var a23 = a[9];
    var a33 = a[10];
    var a43 = a[11];
    var a14 = a[12];
    var a24 = a[13];
    var a34 = a[14];
    var a44 = a[15];
    var b11 = b[0];
    var b21 = b[1];
    var b31 = b[2];
    var b41 = b[3];
    var b12 = b[4];
    var b22 = b[5];
    var b32 = b[6];
    var b42 = b[7];
    var b13 = b[8];
    var b23 = b[9];
    var b33 = b[10];
    var b43 = b[11];
    var b14 = b[12];
    var b24 = b[13];
    var b34 = b[14];
    var b44 = b[15];

    r[0] = a11 * b11 + a12 * b21 + a13 * b31 + a14 * b41;
    r[1] = a21 * b11 + a22 * b21 + a23 * b31 + a24 * b41;
    r[2] = a31 * b11 + a32 * b21 + a33 * b31 + a34 * b41;
    r[3] = a41 * b11 + a42 * b21 + a43 * b31 + a44 * b41;
    r[4] = a11 * b12 + a12 * b22 + a13 * b32 + a14 * b42;
    r[5] = a21 * b12 + a22 * b22 + a23 * b32 + a24 * b42;
    r[6] = a31 * b12 + a32 * b22 + a33 * b32 + a34 * b42;
    r[7] = a41 * b12 + a42 * b22 + a43 * b32 + a44 * b42;
    r[8] = a11 * b13 + a12 * b23 + a13 * b33 + a14 * b43;
    r[9] = a21 * b13 + a22 * b23 + a23 * b33 + a24 * b43;
    r[10] = a31 * b13 + a32 * b23 + a33 * b33 + a34 * b43;
    r[11] = a41 * b13 + a42 * b23 + a43 * b33 + a44 * b43;
    r[12] = a11 * b14 + a12 * b24 + a13 * b34 + a14 * b44;
    r[13] = a21 * b14 + a22 * b24 + a23 * b34 + a24 * b44;
    r[14] = a31 * b14 + a32 * b24 + a33 * b34 + a34 * b44;
    r[15] = a41 * b14 + a42 * b24 + a43 * b34 + a44 * b44;

    return r;
}
var _MJS_m4x4mul = F2(_MJS_m4x4mulLocal);

var _MJS_m4x4mulAffine = F2(function(a, b) {
    var r = new Float64Array(16);
    var a11 = a[0];
    var a21 = a[1];
    var a31 = a[2];
    var a12 = a[4];
    var a22 = a[5];
    var a32 = a[6];
    var a13 = a[8];
    var a23 = a[9];
    var a33 = a[10];
    var a14 = a[12];
    var a24 = a[13];
    var a34 = a[14];

    var b11 = b[0];
    var b21 = b[1];
    var b31 = b[2];
    var b12 = b[4];
    var b22 = b[5];
    var b32 = b[6];
    var b13 = b[8];
    var b23 = b[9];
    var b33 = b[10];
    var b14 = b[12];
    var b24 = b[13];
    var b34 = b[14];

    r[0] = a11 * b11 + a12 * b21 + a13 * b31;
    r[1] = a21 * b11 + a22 * b21 + a23 * b31;
    r[2] = a31 * b11 + a32 * b21 + a33 * b31;
    r[3] = 0;
    r[4] = a11 * b12 + a12 * b22 + a13 * b32;
    r[5] = a21 * b12 + a22 * b22 + a23 * b32;
    r[6] = a31 * b12 + a32 * b22 + a33 * b32;
    r[7] = 0;
    r[8] = a11 * b13 + a12 * b23 + a13 * b33;
    r[9] = a21 * b13 + a22 * b23 + a23 * b33;
    r[10] = a31 * b13 + a32 * b23 + a33 * b33;
    r[11] = 0;
    r[12] = a11 * b14 + a12 * b24 + a13 * b34 + a14;
    r[13] = a21 * b14 + a22 * b24 + a23 * b34 + a24;
    r[14] = a31 * b14 + a32 * b24 + a33 * b34 + a34;
    r[15] = 1;

    return r;
});

var _MJS_m4x4makeRotate = F2(function(angle, axis) {
    var r = new Float64Array(16);
    axis = _MJS_v3normalizeLocal(axis, _MJS_v3temp1Local);
    var x = axis[0];
    var y = axis[1];
    var z = axis[2];
    var c = Math.cos(angle);
    var c1 = 1 - c;
    var s = Math.sin(angle);

    r[0] = x * x * c1 + c;
    r[1] = y * x * c1 + z * s;
    r[2] = z * x * c1 - y * s;
    r[3] = 0;
    r[4] = x * y * c1 - z * s;
    r[5] = y * y * c1 + c;
    r[6] = y * z * c1 + x * s;
    r[7] = 0;
    r[8] = x * z * c1 + y * s;
    r[9] = y * z * c1 - x * s;
    r[10] = z * z * c1 + c;
    r[11] = 0;
    r[12] = 0;
    r[13] = 0;
    r[14] = 0;
    r[15] = 1;

    return r;
});

var _MJS_m4x4rotate = F3(function(angle, axis, m) {
    var r = new Float64Array(16);
    var im = 1.0 / _MJS_v3lengthLocal(axis);
    var x = axis[0] * im;
    var y = axis[1] * im;
    var z = axis[2] * im;
    var c = Math.cos(angle);
    var c1 = 1 - c;
    var s = Math.sin(angle);
    var xs = x * s;
    var ys = y * s;
    var zs = z * s;
    var xyc1 = x * y * c1;
    var xzc1 = x * z * c1;
    var yzc1 = y * z * c1;
    var t11 = x * x * c1 + c;
    var t21 = xyc1 + zs;
    var t31 = xzc1 - ys;
    var t12 = xyc1 - zs;
    var t22 = y * y * c1 + c;
    var t32 = yzc1 + xs;
    var t13 = xzc1 + ys;
    var t23 = yzc1 - xs;
    var t33 = z * z * c1 + c;
    var m11 = m[0], m21 = m[1], m31 = m[2], m41 = m[3];
    var m12 = m[4], m22 = m[5], m32 = m[6], m42 = m[7];
    var m13 = m[8], m23 = m[9], m33 = m[10], m43 = m[11];
    var m14 = m[12], m24 = m[13], m34 = m[14], m44 = m[15];

    r[0] = m11 * t11 + m12 * t21 + m13 * t31;
    r[1] = m21 * t11 + m22 * t21 + m23 * t31;
    r[2] = m31 * t11 + m32 * t21 + m33 * t31;
    r[3] = m41 * t11 + m42 * t21 + m43 * t31;
    r[4] = m11 * t12 + m12 * t22 + m13 * t32;
    r[5] = m21 * t12 + m22 * t22 + m23 * t32;
    r[6] = m31 * t12 + m32 * t22 + m33 * t32;
    r[7] = m41 * t12 + m42 * t22 + m43 * t32;
    r[8] = m11 * t13 + m12 * t23 + m13 * t33;
    r[9] = m21 * t13 + m22 * t23 + m23 * t33;
    r[10] = m31 * t13 + m32 * t23 + m33 * t33;
    r[11] = m41 * t13 + m42 * t23 + m43 * t33;
    r[12] = m14,
    r[13] = m24;
    r[14] = m34;
    r[15] = m44;

    return r;
});

function _MJS_m4x4makeScale3Local(x, y, z) {
    var r = new Float64Array(16);

    r[0] = x;
    r[1] = 0;
    r[2] = 0;
    r[3] = 0;
    r[4] = 0;
    r[5] = y;
    r[6] = 0;
    r[7] = 0;
    r[8] = 0;
    r[9] = 0;
    r[10] = z;
    r[11] = 0;
    r[12] = 0;
    r[13] = 0;
    r[14] = 0;
    r[15] = 1;

    return r;
}
var _MJS_m4x4makeScale3 = F3(_MJS_m4x4makeScale3Local);

var _MJS_m4x4makeScale = function(v) {
    return _MJS_m4x4makeScale3Local(v[0], v[1], v[2]);
};

var _MJS_m4x4scale3 = F4(function(x, y, z, m) {
    var r = new Float64Array(16);

    r[0] = m[0] * x;
    r[1] = m[1] * x;
    r[2] = m[2] * x;
    r[3] = m[3] * x;
    r[4] = m[4] * y;
    r[5] = m[5] * y;
    r[6] = m[6] * y;
    r[7] = m[7] * y;
    r[8] = m[8] * z;
    r[9] = m[9] * z;
    r[10] = m[10] * z;
    r[11] = m[11] * z;
    r[12] = m[12];
    r[13] = m[13];
    r[14] = m[14];
    r[15] = m[15];

    return r;
});

var _MJS_m4x4scale = F2(function(v, m) {
    var r = new Float64Array(16);
    var x = v[0];
    var y = v[1];
    var z = v[2];

    r[0] = m[0] * x;
    r[1] = m[1] * x;
    r[2] = m[2] * x;
    r[3] = m[3] * x;
    r[4] = m[4] * y;
    r[5] = m[5] * y;
    r[6] = m[6] * y;
    r[7] = m[7] * y;
    r[8] = m[8] * z;
    r[9] = m[9] * z;
    r[10] = m[10] * z;
    r[11] = m[11] * z;
    r[12] = m[12];
    r[13] = m[13];
    r[14] = m[14];
    r[15] = m[15];

    return r;
});

function _MJS_m4x4makeTranslate3Local(x, y, z) {
    var r = new Float64Array(16);

    r[0] = 1;
    r[1] = 0;
    r[2] = 0;
    r[3] = 0;
    r[4] = 0;
    r[5] = 1;
    r[6] = 0;
    r[7] = 0;
    r[8] = 0;
    r[9] = 0;
    r[10] = 1;
    r[11] = 0;
    r[12] = x;
    r[13] = y;
    r[14] = z;
    r[15] = 1;

    return r;
}
var _MJS_m4x4makeTranslate3 = F3(_MJS_m4x4makeTranslate3Local);

var _MJS_m4x4makeTranslate = function(v) {
    return _MJS_m4x4makeTranslate3Local(v[0], v[1], v[2]);
};

var _MJS_m4x4translate3 = F4(function(x, y, z, m) {
    var r = new Float64Array(16);
    var m11 = m[0];
    var m21 = m[1];
    var m31 = m[2];
    var m41 = m[3];
    var m12 = m[4];
    var m22 = m[5];
    var m32 = m[6];
    var m42 = m[7];
    var m13 = m[8];
    var m23 = m[9];
    var m33 = m[10];
    var m43 = m[11];

    r[0] = m11;
    r[1] = m21;
    r[2] = m31;
    r[3] = m41;
    r[4] = m12;
    r[5] = m22;
    r[6] = m32;
    r[7] = m42;
    r[8] = m13;
    r[9] = m23;
    r[10] = m33;
    r[11] = m43;
    r[12] = m11 * x + m12 * y + m13 * z + m[12];
    r[13] = m21 * x + m22 * y + m23 * z + m[13];
    r[14] = m31 * x + m32 * y + m33 * z + m[14];
    r[15] = m41 * x + m42 * y + m43 * z + m[15];

    return r;
});

var _MJS_m4x4translate = F2(function(v, m) {
    var r = new Float64Array(16);
    var x = v[0];
    var y = v[1];
    var z = v[2];
    var m11 = m[0];
    var m21 = m[1];
    var m31 = m[2];
    var m41 = m[3];
    var m12 = m[4];
    var m22 = m[5];
    var m32 = m[6];
    var m42 = m[7];
    var m13 = m[8];
    var m23 = m[9];
    var m33 = m[10];
    var m43 = m[11];

    r[0] = m11;
    r[1] = m21;
    r[2] = m31;
    r[3] = m41;
    r[4] = m12;
    r[5] = m22;
    r[6] = m32;
    r[7] = m42;
    r[8] = m13;
    r[9] = m23;
    r[10] = m33;
    r[11] = m43;
    r[12] = m11 * x + m12 * y + m13 * z + m[12];
    r[13] = m21 * x + m22 * y + m23 * z + m[13];
    r[14] = m31 * x + m32 * y + m33 * z + m[14];
    r[15] = m41 * x + m42 * y + m43 * z + m[15];

    return r;
});

var _MJS_m4x4makeLookAt = F3(function(eye, center, up) {
    var z = _MJS_v3directionLocal(eye, center, _MJS_v3temp1Local);
    var x = _MJS_v3normalizeLocal(_MJS_v3crossLocal(up, z, _MJS_v3temp2Local), _MJS_v3temp2Local);
    var y = _MJS_v3normalizeLocal(_MJS_v3crossLocal(z, x, _MJS_v3temp3Local), _MJS_v3temp3Local);
    var tm1 = _MJS_m4x4temp1Local;
    var tm2 = _MJS_m4x4temp2Local;

    tm1[0] = x[0];
    tm1[1] = y[0];
    tm1[2] = z[0];
    tm1[3] = 0;
    tm1[4] = x[1];
    tm1[5] = y[1];
    tm1[6] = z[1];
    tm1[7] = 0;
    tm1[8] = x[2];
    tm1[9] = y[2];
    tm1[10] = z[2];
    tm1[11] = 0;
    tm1[12] = 0;
    tm1[13] = 0;
    tm1[14] = 0;
    tm1[15] = 1;

    tm2[0] = 1; tm2[1] = 0; tm2[2] = 0; tm2[3] = 0;
    tm2[4] = 0; tm2[5] = 1; tm2[6] = 0; tm2[7] = 0;
    tm2[8] = 0; tm2[9] = 0; tm2[10] = 1; tm2[11] = 0;
    tm2[12] = -eye[0]; tm2[13] = -eye[1]; tm2[14] = -eye[2]; tm2[15] = 1;

    return _MJS_m4x4mulLocal(tm1, tm2);
});


function _MJS_m4x4transposeLocal(m) {
    var r = new Float64Array(16);

    r[0] = m[0]; r[1] = m[4]; r[2] = m[8]; r[3] = m[12];
    r[4] = m[1]; r[5] = m[5]; r[6] = m[9]; r[7] = m[13];
    r[8] = m[2]; r[9] = m[6]; r[10] = m[10]; r[11] = m[14];
    r[12] = m[3]; r[13] = m[7]; r[14] = m[11]; r[15] = m[15];

    return r;
}
var _MJS_m4x4transpose = _MJS_m4x4transposeLocal;

var _MJS_m4x4makeBasis = F3(function(vx, vy, vz) {
    var r = new Float64Array(16);

    r[0] = vx[0];
    r[1] = vx[1];
    r[2] = vx[2];
    r[3] = 0;
    r[4] = vy[0];
    r[5] = vy[1];
    r[6] = vy[2];
    r[7] = 0;
    r[8] = vz[0];
    r[9] = vz[1];
    r[10] = vz[2];
    r[11] = 0;
    r[12] = 0;
    r[13] = 0;
    r[14] = 0;
    r[15] = 1;

    return r;
});




// ELEMENT


var _Debugger_element;

var _Browser_element = _Debugger_element || F4(function(impl, flagDecoder, debugMetadata, args)
{
	return _Platform_initialize(
		flagDecoder,
		args,
		impl.init,
		impl.update,
		impl.subscriptions,
		function(sendToApp, initialModel) {
			var view = impl.view;
			/**_UNUSED/
			var domNode = args['node'];
			//*/
			/**/
			var domNode = args && args['node'] ? args['node'] : _Debug_crash(0);
			//*/
			var currNode = _VirtualDom_virtualize(domNode);

			return _Browser_makeAnimator(initialModel, function(model)
			{
				var nextNode = view(model);
				var patches = _VirtualDom_diff(currNode, nextNode);
				domNode = _VirtualDom_applyPatches(domNode, currNode, patches, sendToApp);
				currNode = nextNode;
			});
		}
	);
});



// DOCUMENT


var _Debugger_document;

var _Browser_document = _Debugger_document || F4(function(impl, flagDecoder, debugMetadata, args)
{
	return _Platform_initialize(
		flagDecoder,
		args,
		impl.init,
		impl.update,
		impl.subscriptions,
		function(sendToApp, initialModel) {
			var divertHrefToApp = impl.setup && impl.setup(sendToApp)
			var view = impl.view;
			var title = _VirtualDom_doc.title;
			var bodyNode = _VirtualDom_doc.body;
			var currNode = _VirtualDom_virtualize(bodyNode);
			return _Browser_makeAnimator(initialModel, function(model)
			{
				_VirtualDom_divertHrefToApp = divertHrefToApp;
				var doc = view(model);
				var nextNode = _VirtualDom_node('body')(_List_Nil)(doc.body);
				var patches = _VirtualDom_diff(currNode, nextNode);
				bodyNode = _VirtualDom_applyPatches(bodyNode, currNode, patches, sendToApp);
				currNode = nextNode;
				_VirtualDom_divertHrefToApp = 0;
				(title !== doc.title) && (_VirtualDom_doc.title = title = doc.title);
			});
		}
	);
});



// ANIMATION


var _Browser_requestAnimationFrame =
	typeof requestAnimationFrame !== 'undefined'
		? requestAnimationFrame
		: function(callback) { setTimeout(callback, 1000 / 60); };


function _Browser_makeAnimator(model, draw)
{
	draw(model);

	var state = 0;

	function updateIfNeeded()
	{
		state = state === 1
			? 0
			: ( _Browser_requestAnimationFrame(updateIfNeeded), draw(model), 1 );
	}

	return function(nextModel, isSync)
	{
		model = nextModel;

		isSync
			? ( draw(model),
				state === 2 && (state = 1)
				)
			: ( state === 0 && _Browser_requestAnimationFrame(updateIfNeeded),
				state = 2
				);
	};
}



// APPLICATION


function _Browser_application(impl)
{
	var onUrlChange = impl.onUrlChange;
	var onUrlRequest = impl.onUrlRequest;
	var key = function() { key.a(onUrlChange(_Browser_getUrl())); };

	return _Browser_document({
		setup: function(sendToApp)
		{
			key.a = sendToApp;
			_Browser_window.addEventListener('popstate', key);
			_Browser_window.navigator.userAgent.indexOf('Trident') < 0 || _Browser_window.addEventListener('hashchange', key);

			return F2(function(domNode, event)
			{
				if (!event.ctrlKey && !event.metaKey && !event.shiftKey && event.button < 1 && !domNode.target && !domNode.download)
				{
					event.preventDefault();
					var href = domNode.href;
					var curr = _Browser_getUrl();
					var next = elm$url$Url$fromString(href).a;
					sendToApp(onUrlRequest(
						(next
							&& curr.protocol === next.protocol
							&& curr.host === next.host
							&& curr.port_.a === next.port_.a
						)
							? elm$browser$Browser$Internal(next)
							: elm$browser$Browser$External(href)
					));
				}
			});
		},
		init: function(flags)
		{
			return A3(impl.init, flags, _Browser_getUrl(), key);
		},
		view: impl.view,
		update: impl.update,
		subscriptions: impl.subscriptions
	});
}

function _Browser_getUrl()
{
	return elm$url$Url$fromString(_VirtualDom_doc.location.href).a || _Debug_crash(1);
}

var _Browser_go = F2(function(key, n)
{
	return A2(elm$core$Task$perform, elm$core$Basics$never, _Scheduler_binding(function() {
		n && history.go(n);
		key();
	}));
});

var _Browser_pushUrl = F2(function(key, url)
{
	return A2(elm$core$Task$perform, elm$core$Basics$never, _Scheduler_binding(function() {
		history.pushState({}, '', url);
		key();
	}));
});

var _Browser_replaceUrl = F2(function(key, url)
{
	return A2(elm$core$Task$perform, elm$core$Basics$never, _Scheduler_binding(function() {
		history.replaceState({}, '', url);
		key();
	}));
});



// GLOBAL EVENTS


var _Browser_fakeNode = { addEventListener: function() {}, removeEventListener: function() {} };
var _Browser_doc = typeof document !== 'undefined' ? document : _Browser_fakeNode;
var _Browser_window = typeof window !== 'undefined' ? window : _Browser_fakeNode;

var _Browser_on = F3(function(node, eventName, sendToSelf)
{
	return _Scheduler_spawn(_Scheduler_binding(function(callback)
	{
		function handler(event)	{ _Scheduler_rawSpawn(sendToSelf(event)); }
		node.addEventListener(eventName, handler, _VirtualDom_passiveSupported && { passive: true });
		return function() { node.removeEventListener(eventName, handler); };
	}));
});

var _Browser_decodeEvent = F2(function(decoder, event)
{
	var result = _Json_runHelp(decoder, event);
	return elm$core$Result$isOk(result) ? elm$core$Maybe$Just(result.a) : elm$core$Maybe$Nothing;
});



// PAGE VISIBILITY


function _Browser_visibilityInfo()
{
	return (typeof _VirtualDom_doc.hidden !== 'undefined')
		? { hidden: 'hidden', change: 'visibilitychange' }
		:
	(typeof _VirtualDom_doc.mozHidden !== 'undefined')
		? { hidden: 'mozHidden', change: 'mozvisibilitychange' }
		:
	(typeof _VirtualDom_doc.msHidden !== 'undefined')
		? { hidden: 'msHidden', change: 'msvisibilitychange' }
		:
	(typeof _VirtualDom_doc.webkitHidden !== 'undefined')
		? { hidden: 'webkitHidden', change: 'webkitvisibilitychange' }
		: { hidden: 'hidden', change: 'visibilitychange' };
}



// ANIMATION FRAMES


function _Browser_rAF()
{
	return _Scheduler_binding(function(callback)
	{
		var id = requestAnimationFrame(function() {
			callback(_Scheduler_succeed(Date.now()));
		});

		return function() {
			cancelAnimationFrame(id);
		};
	});
}


function _Browser_now()
{
	return _Scheduler_binding(function(callback)
	{
		callback(_Scheduler_succeed(Date.now()));
	});
}



// DOM STUFF


function _Browser_withNode(id, doStuff)
{
	return _Scheduler_binding(function(callback)
	{
		_Browser_requestAnimationFrame(function() {
			var node = document.getElementById(id);
			callback(node
				? _Scheduler_succeed(doStuff(node))
				: _Scheduler_fail(elm$browser$Browser$Dom$NotFound(id))
			);
		});
	});
}


function _Browser_withWindow(doStuff)
{
	return _Scheduler_binding(function(callback)
	{
		_Browser_requestAnimationFrame(function() {
			callback(_Scheduler_succeed(doStuff()));
		});
	});
}


// FOCUS and BLUR


var _Browser_call = F2(function(functionName, id)
{
	return _Browser_withNode(id, function(node) {
		node[functionName]();
		return _Utils_Tuple0;
	});
});



// WINDOW VIEWPORT


function _Browser_getViewport()
{
	return {
		scene: _Browser_getScene(),
		viewport: {
			x: _Browser_window.pageXOffset,
			y: _Browser_window.pageYOffset,
			width: _Browser_doc.documentElement.clientWidth,
			height: _Browser_doc.documentElement.clientHeight
		}
	};
}

function _Browser_getScene()
{
	var body = _Browser_doc.body;
	var elem = _Browser_doc.documentElement;
	return {
		width: Math.max(body.scrollWidth, body.offsetWidth, elem.scrollWidth, elem.offsetWidth, elem.clientWidth),
		height: Math.max(body.scrollHeight, body.offsetHeight, elem.scrollHeight, elem.offsetHeight, elem.clientHeight)
	};
}

var _Browser_setViewport = F2(function(x, y)
{
	return _Browser_withWindow(function()
	{
		_Browser_window.scroll(x, y);
		return _Utils_Tuple0;
	});
});



// ELEMENT VIEWPORT


function _Browser_getViewportOf(id)
{
	return _Browser_withNode(id, function(node)
	{
		return {
			scene: {
				width: node.scrollWidth,
				height: node.scrollHeight
			},
			viewport: {
				x: node.scrollLeft,
				y: node.scrollTop,
				width: node.clientWidth,
				height: node.clientHeight
			}
		};
	});
}


var _Browser_setViewportOf = F3(function(id, x, y)
{
	return _Browser_withNode(id, function(node)
	{
		node.scrollLeft = x;
		node.scrollTop = y;
		return _Utils_Tuple0;
	});
});



// ELEMENT


function _Browser_getElement(id)
{
	return _Browser_withNode(id, function(node)
	{
		var rect = node.getBoundingClientRect();
		var x = _Browser_window.pageXOffset;
		var y = _Browser_window.pageYOffset;
		return {
			scene: _Browser_getScene(),
			viewport: {
				x: x,
				y: y,
				width: _Browser_doc.documentElement.clientWidth,
				height: _Browser_doc.documentElement.clientHeight
			},
			element: {
				x: x + rect.left,
				y: y + rect.top,
				width: rect.width,
				height: rect.height
			}
		};
	});
}



// LOAD and RELOAD


function _Browser_reload(skipCache)
{
	return A2(elm$core$Task$perform, elm$core$Basics$never, _Scheduler_binding(function(callback)
	{
		_VirtualDom_doc.location.reload(skipCache);
	}));
}

function _Browser_load(url)
{
	return A2(elm$core$Task$perform, elm$core$Basics$never, _Scheduler_binding(function(callback)
	{
		try
		{
			_Browser_window.location = url;
		}
		catch(err)
		{
			// Only Firefox can throw a NS_ERROR_MALFORMED_URI exception here.
			// Other browsers reload the page, so let's be consistent about that.
			_VirtualDom_doc.location.reload(false);
		}
	}));
}


function _WebGL_log(/* msg */) {
  // console.log(msg);
}

var _WebGL_guid = 0;

function _WebGL_listEach(fn, list) {
  for (; list.b; list = list.b) {
    fn(list.a);
  }
}

function _WebGL_listLength(list) {
  var length = 0;
  for (; list.b; list = list.b) {
    length++;
  }
  return length;
}

var _WebGL_rAF = typeof requestAnimationFrame !== 'undefined' ?
  requestAnimationFrame :
  function (cb) { setTimeout(cb, 1000 / 60); };

// eslint-disable-next-line no-unused-vars
var _WebGL_entity = F5(function (settings, vert, frag, mesh, uniforms) {

  if (!mesh.id) {
    mesh.id = _WebGL_guid++;
  }

  return {
    $: 0,
    a: settings,
    b: vert,
    c: frag,
    d: mesh,
    e: uniforms
  };

});

// eslint-disable-next-line no-unused-vars
var _WebGL_enableBlend = F2(function (gl, setting) {
  gl.enable(gl.BLEND);
  // a   b   c   d   e   f   g h i j
  // eq1 f11 f12 eq2 f21 f22 r g b a
  gl.blendEquationSeparate(setting.a, setting.d);
  gl.blendFuncSeparate(setting.b, setting.c, setting.e, setting.f);
  gl.blendColor(setting.g, setting.h, setting.i, setting.j);
});

// eslint-disable-next-line no-unused-vars
var _WebGL_enableDepthTest = F2(function (gl, setting) {
  gl.enable(gl.DEPTH_TEST);
  // a    b    c    d
  // func mask near far
  gl.depthFunc(setting.a);
  gl.depthMask(setting.b);
  gl.depthRange(setting.c, setting.d);
});

// eslint-disable-next-line no-unused-vars
var _WebGL_enableStencilTest = F2(function (gl, setting) {
  gl.enable(gl.STENCIL_TEST);
  // a   b    c         d     e     f      g      h     i     j      k
  // ref mask writeMask test1 fail1 zfail1 zpass1 test2 fail2 zfail2 zpass2
  gl.stencilFuncSeparate(gl.FRONT, setting.d, setting.a, setting.b);
  gl.stencilOpSeparate(gl.FRONT, setting.e, setting.f, setting.g);
  gl.stencilMaskSeparate(gl.FRONT, setting.c);
  gl.stencilFuncSeparate(gl.BACK, setting.h, setting.a, setting.b);
  gl.stencilOpSeparate(gl.BACK, setting.i, setting.j, setting.k);
  gl.stencilMaskSeparate(gl.BACK, setting.c);
});

// eslint-disable-next-line no-unused-vars
var _WebGL_enableScissor = F2(function (gl, setting) {
  gl.enable(gl.SCISSOR_TEST);
  gl.scissor(setting.a, setting.b, setting.c, setting.d);
});

// eslint-disable-next-line no-unused-vars
var _WebGL_enableColorMask = F2(function (gl, setting) {
  gl.colorMask(setting.a, setting.b, setting.c, setting.d);
});

// eslint-disable-next-line no-unused-vars
var _WebGL_enableCullFace = F2(function (gl, setting) {
  gl.enable(gl.CULL_FACE);
  gl.cullFace(setting.a);
});

// eslint-disable-next-line no-unused-vars
var _WebGL_enablePolygonOffset = F2(function (gl, setting) {
  gl.enable(gl.POLYGON_OFFSET_FILL);
  gl.polygonOffset(setting.a, setting.b);
});

// eslint-disable-next-line no-unused-vars
var _WebGL_enableSampleCoverage = F2(function (gl, setting) {
  gl.enable(gl.SAMPLE_COVERAGE);
  gl.sampleCoverage(setting.a, setting.b);
});

// eslint-disable-next-line no-unused-vars
var _WebGL_enableSampleAlphaToCoverage = F2(function (gl, setting) {
  gl.enable(gl.SAMPLE_ALPHA_TO_COVERAGE);
});

// eslint-disable-next-line no-unused-vars
var _WebGL_disableBlend = function (gl) {
  gl.disable(gl.BLEND);
};

// eslint-disable-next-line no-unused-vars
var _WebGL_disableDepthTest = function (gl) {
  gl.disable(gl.DEPTH_TEST);
};

// eslint-disable-next-line no-unused-vars
var _WebGL_disableStencilTest = function (gl) {
  gl.disable(gl.STENCIL_TEST);
};

// eslint-disable-next-line no-unused-vars
var _WebGL_disableScissor = function (gl) {
  gl.disable(gl.SCISSOR_TEST);
};

// eslint-disable-next-line no-unused-vars
var _WebGL_disableColorMask = function (gl) {
  gl.colorMask(true, true, true, true);
};

// eslint-disable-next-line no-unused-vars
var _WebGL_disableCullFace = function (gl) {
  gl.disable(gl.CULL_FACE);
};

// eslint-disable-next-line no-unused-vars
var _WebGL_disablePolygonOffset = function (gl) {
  gl.disable(gl.POLYGON_OFFSET_FILL);
};

// eslint-disable-next-line no-unused-vars
var _WebGL_disableSampleCoverage = function (gl) {
  gl.disable(gl.SAMPLE_COVERAGE);
};

// eslint-disable-next-line no-unused-vars
var _WebGL_disableSampleAlphaToCoverage = function (gl) {
  gl.disable(gl.SAMPLE_ALPHA_TO_COVERAGE);
};

function _WebGL_doCompile(gl, src, type) {

  var shader = gl.createShader(type);
  _WebGL_log('Created shader');

  gl.shaderSource(shader, src);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    throw gl.getShaderInfoLog(shader);
  }

  return shader;

}

function _WebGL_doLink(gl, vshader, fshader) {

  var program = gl.createProgram();
  _WebGL_log('Created program');

  gl.attachShader(program, vshader);
  gl.attachShader(program, fshader);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    throw gl.getProgramInfoLog(program);
  }

  return program;

}

function _WebGL_getAttributeInfo(gl, type) {
  switch (type) {
    case gl.FLOAT:
      return { size: 1, type: Float32Array, baseType: gl.FLOAT };
    case gl.FLOAT_VEC2:
      return { size: 2, type: Float32Array, baseType: gl.FLOAT };
    case gl.FLOAT_VEC3:
      return { size: 3, type: Float32Array, baseType: gl.FLOAT };
    case gl.FLOAT_VEC4:
      return { size: 4, type: Float32Array, baseType: gl.FLOAT };
    case gl.INT:
      return { size: 1, type: Int32Array, baseType: gl.INT };
    case gl.INT_VEC2:
      return { size: 2, type: Int32Array, baseType: gl.INT };
    case gl.INT_VEC3:
      return { size: 3, type: Int32Array, baseType: gl.INT };
    case gl.INT_VEC4:
      return { size: 4, type: Int32Array, baseType: gl.INT };
  }
}

/**
 *  Form the buffer for a given attribute.
 *
 *  @param {WebGLRenderingContext} gl context
 *  @param {WebGLActiveInfo} attribute the attribute to bind to.
 *         We use its name to grab the record by name and also to know
 *         how many elements we need to grab.
 *  @param {Mesh} mesh The mesh coming in from Elm.
 *  @param {Object} attributes The mapping between the attribute names and Elm fields
 *  @return {WebGLBuffer}
 */
function _WebGL_doBindAttribute(gl, attribute, mesh, attributes) {
  // The length of the number of vertices that
  // complete one 'thing' based on the drawing mode.
  // ie, 2 for Lines, 3 for Triangles, etc.
  var elemSize = mesh.a.elemSize;

  var idxKeys = [];
  for (var i = 0; i < elemSize; i++) {
    idxKeys.push(String.fromCharCode(97 + i));
  }

  function dataFill(data, cnt, fillOffset, elem, key) {
    var i;
    if (elemSize === 1) {
      for (i = 0; i < cnt; i++) {
        data[fillOffset++] = cnt === 1 ? elem[key] : elem[key][i];
      }
    } else {
      idxKeys.forEach(function (idx) {
        for (i = 0; i < cnt; i++) {
          data[fillOffset++] = cnt === 1 ? elem[idx][key] : elem[idx][key][i];
        }
      });
    }
  }

  var attributeInfo = _WebGL_getAttributeInfo(gl, attribute.type);

  if (attributeInfo === undefined) {
    throw new Error('No info available for: ' + attribute.type);
  }

  var dataIdx = 0;
  var array = new attributeInfo.type(_WebGL_listLength(mesh.b) * attributeInfo.size * elemSize);

  _WebGL_listEach(function (elem) {
    dataFill(array, attributeInfo.size, dataIdx, elem, attributes[attribute.name] || attribute.name);
    dataIdx += attributeInfo.size * elemSize;
  }, mesh.b);

  var buffer = gl.createBuffer();
  _WebGL_log('Created attribute buffer ' + attribute.name);

  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, array, gl.STATIC_DRAW);
  return buffer;
}

/**
 *  This sets up the binding caching buffers.
 *
 *  We don't actually bind any buffers now except for the indices buffer.
 *  The problem with filling the buffers here is that it is possible to
 *  have a buffer shared between two webgl shaders;
 *  which could have different active attributes. If we bind it here against
 *  a particular program, we might not bind them all. That final bind is now
 *  done right before drawing.
 *
 *  @param {WebGLRenderingContext} gl context
 *  @param {Mesh} mesh a mesh object from Elm
 *  @return {Object} buffer - an object with the following properties
 *  @return {Number} buffer.numIndices
 *  @return {WebGLBuffer} buffer.indexBuffer
 *  @return {Object} buffer.buffers - will be used to buffer attributes
 */
function _WebGL_doBindSetup(gl, mesh) {
  _WebGL_log('Created index buffer');
  var indexBuffer = gl.createBuffer();
  var indices = (mesh.a.indexSize === 0)
    ? _WebGL_makeSequentialBuffer(mesh.a.elemSize * _WebGL_listLength(mesh.b))
    : _WebGL_makeIndexedBuffer(mesh.c, mesh.a.indexSize);

  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);

  return {
    numIndices: indices.length,
    indexBuffer: indexBuffer,
    buffers: {}
  };
}

/**
 *  Create an indices array and fill it with 0..n
 *
 *  @param {Number} numIndices The number of indices
 *  @return {Uint16Array} indices
 */
function _WebGL_makeSequentialBuffer(numIndices) {
  var indices = new Uint16Array(numIndices);
  for (var i = 0; i < numIndices; i++) {
    indices[i] = i;
  }
  return indices;
}

/**
 *  Create an indices array and fill it from indices
 *  based on the size of the index
 *
 *  @param {List} indicesList the list of indices
 *  @param {Number} indexSize the size of the index
 *  @return {Uint16Array} indices
 */
function _WebGL_makeIndexedBuffer(indicesList, indexSize) {
  var indices = new Uint16Array(_WebGL_listLength(indicesList) * indexSize);
  var fillOffset = 0;
  var i;
  _WebGL_listEach(function (elem) {
    if (indexSize === 1) {
      indices[fillOffset++] = elem;
    } else {
      for (i = 0; i < indexSize; i++) {
        indices[fillOffset++] = elem[String.fromCharCode(97 + i)];
      }
    }
  }, indicesList);
  return indices;
}

function _WebGL_getProgID(vertID, fragID) {
  return vertID + '#' + fragID;
}

var _WebGL_drawGL = F2(function (model, domNode) {

  var gl = model.f.gl;

  if (!gl) {
    return domNode;
  }

  gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT | gl.STENCIL_BUFFER_BIT);
  _WebGL_log('Drawing');

  function drawEntity(entity) {
    if (!entity.d.b.b) {
      return; // Empty list
    }

    var progid;
    var program;
    if (entity.b.id && entity.c.id) {
      progid = _WebGL_getProgID(entity.b.id, entity.c.id);
      program = model.f.programs[progid];
    }

    if (!program) {

      var vshader;
      if (entity.b.id) {
        vshader = model.f.shaders[entity.b.id];
      } else {
        entity.b.id = _WebGL_guid++;
      }

      if (!vshader) {
        vshader = _WebGL_doCompile(gl, entity.b.src, gl.VERTEX_SHADER);
        model.f.shaders[entity.b.id] = vshader;
      }

      var fshader;
      if (entity.c.id) {
        fshader = model.f.shaders[entity.c.id];
      } else {
        entity.c.id = _WebGL_guid++;
      }

      if (!fshader) {
        fshader = _WebGL_doCompile(gl, entity.c.src, gl.FRAGMENT_SHADER);
        model.f.shaders[entity.c.id] = fshader;
      }

      var glProgram = _WebGL_doLink(gl, vshader, fshader);

      program = {
        glProgram: glProgram,
        attributes: Object.assign({}, entity.b.attributes, entity.c.attributes),
        uniformSetters: _WebGL_createUniformSetters(
          gl,
          model,
          glProgram,
          Object.assign({}, entity.b.uniforms, entity.c.uniforms)
        )
      };

      progid = _WebGL_getProgID(entity.b.id, entity.c.id);
      model.f.programs[progid] = program;

    }

    gl.useProgram(program.glProgram);

    _WebGL_setUniforms(program.uniformSetters, entity.e);

    var buffer = model.f.buffers[entity.d.id];

    if (!buffer) {
      buffer = _WebGL_doBindSetup(gl, entity.d);
      model.f.buffers[entity.d.id] = buffer;
    }

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffer.indexBuffer);

    var numAttributes = gl.getProgramParameter(program.glProgram, gl.ACTIVE_ATTRIBUTES);

    for (var i = 0; i < numAttributes; i++) {
      var attribute = gl.getActiveAttrib(program.glProgram, i);

      var attribLocation = gl.getAttribLocation(program.glProgram, attribute.name);
      gl.enableVertexAttribArray(attribLocation);

      if (buffer.buffers[attribute.name] === undefined) {
        buffer.buffers[attribute.name] = _WebGL_doBindAttribute(gl, attribute, entity.d, program.attributes);
      }
      var attributeBuffer = buffer.buffers[attribute.name];
      var attributeInfo = _WebGL_getAttributeInfo(gl, attribute.type);

      gl.bindBuffer(gl.ARRAY_BUFFER, attributeBuffer);
      gl.vertexAttribPointer(attribLocation, attributeInfo.size, attributeInfo.baseType, false, 0, 0);
    }

    _WebGL_listEach(function (setting) {
      A2(elm_explorations$webgl$WebGL$Internal$enableSetting, gl, setting);
    }, entity.a);

    gl.drawElements(entity.d.a.mode, buffer.numIndices, gl.UNSIGNED_SHORT, 0);

    _WebGL_listEach(function (setting) {
      A2(elm_explorations$webgl$WebGL$Internal$disableSetting, gl, setting);
    }, entity.a);

  }

  _WebGL_listEach(drawEntity, model.g);
  return domNode;
});

function _WebGL_createUniformSetters(gl, model, program, uniformsMap) {
  var textureCounter = 0;
  function createUniformSetter(program, uniform) {
    var uniformLocation = gl.getUniformLocation(program, uniform.name);
    switch (uniform.type) {
      case gl.INT:
        return function (value) {
          gl.uniform1i(uniformLocation, value);
        };
      case gl.FLOAT:
        return function (value) {
          gl.uniform1f(uniformLocation, value);
        };
      case gl.FLOAT_VEC2:
        return function (value) {
          gl.uniform2fv(uniformLocation, new Float32Array(value));
        };
      case gl.FLOAT_VEC3:
        return function (value) {
          gl.uniform3fv(uniformLocation, new Float32Array(value));
        };
      case gl.FLOAT_VEC4:
        return function (value) {
          gl.uniform4fv(uniformLocation, new Float32Array(value));
        };
      case gl.FLOAT_MAT4:
        return function (value) {
          gl.uniformMatrix4fv(uniformLocation, false, new Float32Array(value));
        };
      case gl.SAMPLER_2D:
        var currentTexture = textureCounter++;
        return function (texture) {
          gl.activeTexture(gl.TEXTURE0 + currentTexture);
          var tex = model.f.textures[texture.id];
          if (!tex) {
            _WebGL_log('Created texture');
            tex = texture.createTexture(gl);
            model.f.textures[texture.id] = tex;
          }
          gl.bindTexture(gl.TEXTURE_2D, tex);
          gl.uniform1i(uniformLocation, currentTexture);
        };
      case gl.BOOL:
        return function (value) {
          gl.uniform1i(uniformLocation, value);
        };
      default:
        _WebGL_log('Unsupported uniform type: ' + uniform.type);
        return function () {};
    }
  }

  var uniformSetters = {};
  var numUniforms = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS);
  for (var i = 0; i < numUniforms; i++) {
    var uniform = gl.getActiveUniform(program, i);
    uniformSetters[uniformsMap[uniform.name] || uniform.name] = createUniformSetter(program, uniform);
  }

  return uniformSetters;
}

function _WebGL_setUniforms(setters, values) {
  Object.keys(values).forEach(function (name) {
    var setter = setters[name];
    if (setter) {
      setter(values[name]);
    }
  });
}

// VIRTUAL-DOM WIDGET

// eslint-disable-next-line no-unused-vars
var _WebGL_toHtml = F3(function (options, factList, entities) {
  return _VirtualDom_custom(
    factList,
    {
      g: entities,
      f: {},
      h: options
    },
    _WebGL_render,
    _WebGL_diff
  );
});

// eslint-disable-next-line no-unused-vars
var _WebGL_enableAlpha = F2(function (options, option) {
  options.contextAttributes.alpha = true;
  options.contextAttributes.premultipliedAlpha = option.a;
});

// eslint-disable-next-line no-unused-vars
var _WebGL_enableDepth = F2(function (options, option) {
  options.contextAttributes.depth = true;
  options.sceneSettings.push(function (gl) {
    gl.clearDepth(option.a);
  });
});

// eslint-disable-next-line no-unused-vars
var _WebGL_enableStencil = F2(function (options, option) {
  options.contextAttributes.stencil = true;
  options.sceneSettings.push(function (gl) {
    gl.clearStencil(option.a);
  });
});

// eslint-disable-next-line no-unused-vars
var _WebGL_enableAntialias = F2(function (options, option) {
  options.contextAttributes.antialias = true;
});

// eslint-disable-next-line no-unused-vars
var _WebGL_enableClearColor = F2(function (options, option) {
  options.sceneSettings.push(function (gl) {
    gl.clearColor(option.a, option.b, option.c, option.d);
  });
});

/**
 *  Creates canvas and schedules initial _WebGL_drawGL
 *  @param {Object} model
 *  @param {Object} model.f that may contain the following properties:
           gl, shaders, programs, buffers, textures
 *  @param {List<Option>} model.h list of options coming from Elm
 *  @param {List<Entity>} model.g list of entities coming from Elm
 *  @return {HTMLElement} <canvas> if WebGL is supported, otherwise a <div>
 */
function _WebGL_render(model) {
  var options = {
    contextAttributes: {
      alpha: false,
      depth: false,
      stencil: false,
      antialias: false,
      premultipliedAlpha: false
    },
    sceneSettings: []
  };

  _WebGL_listEach(function (option) {
    A2(elm_explorations$webgl$WebGL$Internal$enableOption, options, option);
  }, model.h);

  _WebGL_log('Render canvas');
  var canvas = _VirtualDom_doc.createElement('canvas');
  var gl = canvas.getContext && (
    canvas.getContext('webgl', options.contextAttributes) ||
    canvas.getContext('experimental-webgl', options.contextAttributes)
  );

  if (gl) {
    options.sceneSettings.forEach(function (sceneSetting) {
      sceneSetting(gl);
    });
  } else {
    canvas = _VirtualDom_doc.createElement('div');
    canvas.innerHTML = '<a href="https://get.webgl.org/">Enable WebGL</a> to see this content!';
  }

  model.f.gl = gl;
  model.f.shaders = [];
  model.f.programs = {};
  model.f.buffers = [];
  model.f.textures = [];

  // Render for the first time.
  // This has to be done in animation frame,
  // because the canvas is not in the DOM yet
  _WebGL_rAF(function () {
    A2(_WebGL_drawGL, model, canvas);
  });

  return canvas;
}

function _WebGL_diff(oldModel, newModel) {
  newModel.f = oldModel.f;
  return _WebGL_drawGL(newModel);
}
var author$project$Game$CameraFollowsPlayer = {$: 'CameraFollowsPlayer'};
var author$project$Vector$Vector = F2(
	function (x, y) {
		return {x: x, y: y};
	});
var author$project$Vector$origin = A2(author$project$Vector$Vector, 0, 0);
var elm$core$Array$Array_elm_builtin = F4(
	function (a, b, c, d) {
		return {$: 'Array_elm_builtin', a: a, b: b, c: c, d: d};
	});
var elm$core$Array$branchFactor = 32;
var elm$core$Basics$EQ = {$: 'EQ'};
var elm$core$Basics$GT = {$: 'GT'};
var elm$core$Basics$LT = {$: 'LT'};
var elm$core$Dict$foldr = F3(
	function (func, acc, t) {
		foldr:
		while (true) {
			if (t.$ === 'RBEmpty_elm_builtin') {
				return acc;
			} else {
				var key = t.b;
				var value = t.c;
				var left = t.d;
				var right = t.e;
				var $temp$func = func,
					$temp$acc = A3(
					func,
					key,
					value,
					A3(elm$core$Dict$foldr, func, acc, right)),
					$temp$t = left;
				func = $temp$func;
				acc = $temp$acc;
				t = $temp$t;
				continue foldr;
			}
		}
	});
var elm$core$List$cons = _List_cons;
var elm$core$Dict$toList = function (dict) {
	return A3(
		elm$core$Dict$foldr,
		F3(
			function (key, value, list) {
				return A2(
					elm$core$List$cons,
					_Utils_Tuple2(key, value),
					list);
			}),
		_List_Nil,
		dict);
};
var elm$core$Dict$keys = function (dict) {
	return A3(
		elm$core$Dict$foldr,
		F3(
			function (key, value, keyList) {
				return A2(elm$core$List$cons, key, keyList);
			}),
		_List_Nil,
		dict);
};
var elm$core$Set$toList = function (_n0) {
	var dict = _n0.a;
	return elm$core$Dict$keys(dict);
};
var elm$core$Elm$JsArray$foldr = _JsArray_foldr;
var elm$core$Array$foldr = F3(
	function (func, baseCase, _n0) {
		var tree = _n0.c;
		var tail = _n0.d;
		var helper = F2(
			function (node, acc) {
				if (node.$ === 'SubTree') {
					var subTree = node.a;
					return A3(elm$core$Elm$JsArray$foldr, helper, acc, subTree);
				} else {
					var values = node.a;
					return A3(elm$core$Elm$JsArray$foldr, func, acc, values);
				}
			});
		return A3(
			elm$core$Elm$JsArray$foldr,
			helper,
			A3(elm$core$Elm$JsArray$foldr, func, baseCase, tail),
			tree);
	});
var elm$core$Array$toList = function (array) {
	return A3(elm$core$Array$foldr, elm$core$List$cons, _List_Nil, array);
};
var elm$core$Basics$ceiling = _Basics_ceiling;
var elm$core$Basics$fdiv = _Basics_fdiv;
var elm$core$Basics$logBase = F2(
	function (base, number) {
		return _Basics_log(number) / _Basics_log(base);
	});
var elm$core$Basics$toFloat = _Basics_toFloat;
var elm$core$Array$shiftStep = elm$core$Basics$ceiling(
	A2(elm$core$Basics$logBase, 2, elm$core$Array$branchFactor));
var elm$core$Elm$JsArray$empty = _JsArray_empty;
var elm$core$Array$empty = A4(elm$core$Array$Array_elm_builtin, 0, elm$core$Array$shiftStep, elm$core$Elm$JsArray$empty, elm$core$Elm$JsArray$empty);
var elm$core$Array$Leaf = function (a) {
	return {$: 'Leaf', a: a};
};
var elm$core$Array$SubTree = function (a) {
	return {$: 'SubTree', a: a};
};
var elm$core$Elm$JsArray$initializeFromList = _JsArray_initializeFromList;
var elm$core$List$foldl = F3(
	function (func, acc, list) {
		foldl:
		while (true) {
			if (!list.b) {
				return acc;
			} else {
				var x = list.a;
				var xs = list.b;
				var $temp$func = func,
					$temp$acc = A2(func, x, acc),
					$temp$list = xs;
				func = $temp$func;
				acc = $temp$acc;
				list = $temp$list;
				continue foldl;
			}
		}
	});
var elm$core$List$reverse = function (list) {
	return A3(elm$core$List$foldl, elm$core$List$cons, _List_Nil, list);
};
var elm$core$Array$compressNodes = F2(
	function (nodes, acc) {
		compressNodes:
		while (true) {
			var _n0 = A2(elm$core$Elm$JsArray$initializeFromList, elm$core$Array$branchFactor, nodes);
			var node = _n0.a;
			var remainingNodes = _n0.b;
			var newAcc = A2(
				elm$core$List$cons,
				elm$core$Array$SubTree(node),
				acc);
			if (!remainingNodes.b) {
				return elm$core$List$reverse(newAcc);
			} else {
				var $temp$nodes = remainingNodes,
					$temp$acc = newAcc;
				nodes = $temp$nodes;
				acc = $temp$acc;
				continue compressNodes;
			}
		}
	});
var elm$core$Basics$apR = F2(
	function (x, f) {
		return f(x);
	});
var elm$core$Basics$eq = _Utils_equal;
var elm$core$Tuple$first = function (_n0) {
	var x = _n0.a;
	return x;
};
var elm$core$Array$treeFromBuilder = F2(
	function (nodeList, nodeListSize) {
		treeFromBuilder:
		while (true) {
			var newNodeSize = elm$core$Basics$ceiling(nodeListSize / elm$core$Array$branchFactor);
			if (newNodeSize === 1) {
				return A2(elm$core$Elm$JsArray$initializeFromList, elm$core$Array$branchFactor, nodeList).a;
			} else {
				var $temp$nodeList = A2(elm$core$Array$compressNodes, nodeList, _List_Nil),
					$temp$nodeListSize = newNodeSize;
				nodeList = $temp$nodeList;
				nodeListSize = $temp$nodeListSize;
				continue treeFromBuilder;
			}
		}
	});
var elm$core$Basics$add = _Basics_add;
var elm$core$Basics$apL = F2(
	function (f, x) {
		return f(x);
	});
var elm$core$Basics$floor = _Basics_floor;
var elm$core$Basics$gt = _Utils_gt;
var elm$core$Basics$max = F2(
	function (x, y) {
		return (_Utils_cmp(x, y) > 0) ? x : y;
	});
var elm$core$Basics$mul = _Basics_mul;
var elm$core$Basics$sub = _Basics_sub;
var elm$core$Elm$JsArray$length = _JsArray_length;
var elm$core$Array$builderToArray = F2(
	function (reverseNodeList, builder) {
		if (!builder.nodeListSize) {
			return A4(
				elm$core$Array$Array_elm_builtin,
				elm$core$Elm$JsArray$length(builder.tail),
				elm$core$Array$shiftStep,
				elm$core$Elm$JsArray$empty,
				builder.tail);
		} else {
			var treeLen = builder.nodeListSize * elm$core$Array$branchFactor;
			var depth = elm$core$Basics$floor(
				A2(elm$core$Basics$logBase, elm$core$Array$branchFactor, treeLen - 1));
			var correctNodeList = reverseNodeList ? elm$core$List$reverse(builder.nodeList) : builder.nodeList;
			var tree = A2(elm$core$Array$treeFromBuilder, correctNodeList, builder.nodeListSize);
			return A4(
				elm$core$Array$Array_elm_builtin,
				elm$core$Elm$JsArray$length(builder.tail) + treeLen,
				A2(elm$core$Basics$max, 5, depth * elm$core$Array$shiftStep),
				tree,
				builder.tail);
		}
	});
var elm$core$Basics$True = {$: 'True'};
var elm$core$Basics$lt = _Utils_lt;
var elm$core$Array$fromListHelp = F3(
	function (list, nodeList, nodeListSize) {
		fromListHelp:
		while (true) {
			var _n0 = A2(elm$core$Elm$JsArray$initializeFromList, elm$core$Array$branchFactor, list);
			var jsArray = _n0.a;
			var remainingItems = _n0.b;
			if (_Utils_cmp(
				elm$core$Elm$JsArray$length(jsArray),
				elm$core$Array$branchFactor) < 0) {
				return A2(
					elm$core$Array$builderToArray,
					true,
					{nodeList: nodeList, nodeListSize: nodeListSize, tail: jsArray});
			} else {
				var $temp$list = remainingItems,
					$temp$nodeList = A2(
					elm$core$List$cons,
					elm$core$Array$Leaf(jsArray),
					nodeList),
					$temp$nodeListSize = nodeListSize + 1;
				list = $temp$list;
				nodeList = $temp$nodeList;
				nodeListSize = $temp$nodeListSize;
				continue fromListHelp;
			}
		}
	});
var elm$core$Array$fromList = function (list) {
	if (!list.b) {
		return elm$core$Array$empty;
	} else {
		return A3(elm$core$Array$fromListHelp, list, _List_Nil, 0);
	}
};
var elm$core$Dict$RBEmpty_elm_builtin = {$: 'RBEmpty_elm_builtin'};
var elm$core$Dict$empty = elm$core$Dict$RBEmpty_elm_builtin;
var elm$core$Bitwise$shiftRightZfBy = _Bitwise_shiftRightZfBy;
var elm$random$Random$Seed = F2(
	function (a, b) {
		return {$: 'Seed', a: a, b: b};
	});
var elm$random$Random$next = function (_n0) {
	var state0 = _n0.a;
	var incr = _n0.b;
	return A2(elm$random$Random$Seed, ((state0 * 1664525) + incr) >>> 0, incr);
};
var elm$random$Random$initialSeed = function (x) {
	var _n0 = elm$random$Random$next(
		A2(elm$random$Random$Seed, 0, 1013904223));
	var state1 = _n0.a;
	var incr = _n0.b;
	var state2 = (state1 + x) >>> 0;
	return elm$random$Random$next(
		A2(elm$random$Random$Seed, state2, incr));
};
var author$project$Game$new = {
	cameraMode: author$project$Game$CameraFollowsPlayer,
	cameraPosition: author$project$Vector$origin,
	darknessState: 0,
	darknessTarget: 0,
	entitiesById: elm$core$Dict$empty,
	lastId: 0,
	laters: _List_Nil,
	mapBackgroundTiles: elm$core$Array$fromList(_List_Nil),
	mapForegroundTiles: elm$core$Array$fromList(_List_Nil),
	mapHeight: 1,
	mapWidth: 1,
	playerId: 0,
	rootEntitiesIds: _List_Nil,
	seed: elm$random$Random$initialSeed(0),
	time: 0
};
var elm$core$Basics$False = {$: 'False'};
var author$project$Game$updateEnvNeutral = {dt: 1.0e-2, inputClickJump: false, inputHoldCrouch: false, inputHoldHorizontalMove: 0, inputHoldJump: false, inputHoldUp: false, inputUseGearClick: false};
var elm$core$Tuple$mapSecond = F2(
	function (func, _n0) {
		var x = _n0.a;
		var y = _n0.b;
		return _Utils_Tuple2(
			x,
			func(y));
	});
var author$project$GameMain$applyOneInitFunction = F3(
	function (env, f, _n0) {
		var game = _n0.a;
		var os = _n0.b;
		return A2(
			elm$core$Tuple$mapSecond,
			function (o) {
				return A2(elm$core$List$cons, o, os);
			},
			A2(f, env, game));
	});
var author$project$GameMain$init = function (fs) {
	return A3(
		elm$core$List$foldl,
		author$project$GameMain$applyOneInitFunction(author$project$Game$updateEnvNeutral),
		_Utils_Tuple2(author$project$Game$new, _List_Nil),
		fs);
};
var author$project$Main$OnResize = function (a) {
	return {$: 'OnResize', a: a};
};
var author$project$Game$OutcomeNone = {$: 'OutcomeNone'};
var author$project$Game$noOut = function (a) {
	return _Utils_Tuple2(a, author$project$Game$OutcomeNone);
};
var author$project$Game$OutcomeList = function (a) {
	return {$: 'OutcomeList', a: a};
};
var author$project$Game$entityUpdate_runOneFunction = F4(
	function (env, maybeParent, f, _n0) {
		var entity = _n0.a;
		var game = _n0.b;
		var os = _n0.c;
		var _n1 = A4(f, env, maybeParent, game, entity);
		var e = _n1.a;
		var w = _n1.b;
		var o = _n1.c;
		return _Utils_Tuple3(
			e,
			w,
			A2(elm$core$List$cons, o, os));
	});
var author$project$Game$Parent = function (a) {
	return {$: 'Parent', a: a};
};
var elm$core$Basics$identity = function (x) {
	return x;
};
var elm$core$Basics$compare = _Utils_compare;
var elm$core$Maybe$Just = function (a) {
	return {$: 'Just', a: a};
};
var elm$core$Maybe$Nothing = {$: 'Nothing'};
var elm$core$Dict$get = F2(
	function (targetKey, dict) {
		get:
		while (true) {
			if (dict.$ === 'RBEmpty_elm_builtin') {
				return elm$core$Maybe$Nothing;
			} else {
				var key = dict.b;
				var value = dict.c;
				var left = dict.d;
				var right = dict.e;
				var _n1 = A2(elm$core$Basics$compare, targetKey, key);
				switch (_n1.$) {
					case 'LT':
						var $temp$targetKey = targetKey,
							$temp$dict = left;
						targetKey = $temp$targetKey;
						dict = $temp$dict;
						continue get;
					case 'EQ':
						return elm$core$Maybe$Just(value);
					default:
						var $temp$targetKey = targetKey,
							$temp$dict = right;
						targetKey = $temp$targetKey;
						dict = $temp$dict;
						continue get;
				}
			}
		}
	});
var elm$core$Maybe$andThen = F2(
	function (callback, maybeValue) {
		if (maybeValue.$ === 'Just') {
			var value = maybeValue.a;
			return callback(value);
		} else {
			return elm$core$Maybe$Nothing;
		}
	});
var elm$core$Maybe$map = F2(
	function (f, maybe) {
		if (maybe.$ === 'Just') {
			var value = maybe.a;
			return elm$core$Maybe$Just(
				f(value));
		} else {
			return elm$core$Maybe$Nothing;
		}
	});
var author$project$Game$getParent = F2(
	function (game, entity) {
		return A2(
			elm$core$Maybe$map,
			author$project$Game$Parent,
			A2(
				elm$core$Maybe$andThen,
				function (id) {
					return A2(elm$core$Dict$get, id, game.entitiesById);
				},
				entity.maybeParentId));
	});
var elm$core$Set$Set_elm_builtin = function (a) {
	return {$: 'Set_elm_builtin', a: a};
};
var elm$core$Set$empty = elm$core$Set$Set_elm_builtin(elm$core$Dict$empty);
var author$project$Game$newEntity__ = F2(
	function (maybeParentId, game) {
		return {
			absolutePosition: author$project$Vector$origin,
			absoluteVelocity: author$project$Vector$origin,
			angleToParent: 0,
			animationStart: game.time,
			childrenIds: _List_Nil,
			components: elm$core$Dict$empty,
			flipX: false,
			id: game.lastId + 1,
			maybeParentId: maybeParentId,
			relativePosition: author$project$Vector$origin,
			relativeVelocity: author$project$Vector$origin,
			renderScripts: _List_Nil,
			size: {height: 0, width: 0},
			spawnedAt: game.time,
			tags: elm$core$Set$empty,
			tileCollisions: _List_Nil,
			wrappedUpdateFunctions: _List_Nil
		};
	});
var author$project$Vector$add = F2(
	function (a, b) {
		return {x: a.x + b.x, y: a.y + b.y};
	});
var author$project$Game$setPositionsFromRelative = F3(
	function (maybeParent, relativePosition, entity) {
		if (maybeParent.$ === 'Nothing') {
			return _Utils_update(
				entity,
				{absolutePosition: relativePosition, relativePosition: relativePosition});
		} else {
			var parent = maybeParent.a.a;
			return _Utils_update(
				entity,
				{
					absolutePosition: A2(author$project$Vector$add, relativePosition, parent.absolutePosition),
					relativePosition: relativePosition
				});
		}
	});
var elm$core$Dict$Black = {$: 'Black'};
var elm$core$Dict$RBNode_elm_builtin = F5(
	function (a, b, c, d, e) {
		return {$: 'RBNode_elm_builtin', a: a, b: b, c: c, d: d, e: e};
	});
var elm$core$Dict$Red = {$: 'Red'};
var elm$core$Dict$balance = F5(
	function (color, key, value, left, right) {
		if ((right.$ === 'RBNode_elm_builtin') && (right.a.$ === 'Red')) {
			var _n1 = right.a;
			var rK = right.b;
			var rV = right.c;
			var rLeft = right.d;
			var rRight = right.e;
			if ((left.$ === 'RBNode_elm_builtin') && (left.a.$ === 'Red')) {
				var _n3 = left.a;
				var lK = left.b;
				var lV = left.c;
				var lLeft = left.d;
				var lRight = left.e;
				return A5(
					elm$core$Dict$RBNode_elm_builtin,
					elm$core$Dict$Red,
					key,
					value,
					A5(elm$core$Dict$RBNode_elm_builtin, elm$core$Dict$Black, lK, lV, lLeft, lRight),
					A5(elm$core$Dict$RBNode_elm_builtin, elm$core$Dict$Black, rK, rV, rLeft, rRight));
			} else {
				return A5(
					elm$core$Dict$RBNode_elm_builtin,
					color,
					rK,
					rV,
					A5(elm$core$Dict$RBNode_elm_builtin, elm$core$Dict$Red, key, value, left, rLeft),
					rRight);
			}
		} else {
			if ((((left.$ === 'RBNode_elm_builtin') && (left.a.$ === 'Red')) && (left.d.$ === 'RBNode_elm_builtin')) && (left.d.a.$ === 'Red')) {
				var _n5 = left.a;
				var lK = left.b;
				var lV = left.c;
				var _n6 = left.d;
				var _n7 = _n6.a;
				var llK = _n6.b;
				var llV = _n6.c;
				var llLeft = _n6.d;
				var llRight = _n6.e;
				var lRight = left.e;
				return A5(
					elm$core$Dict$RBNode_elm_builtin,
					elm$core$Dict$Red,
					lK,
					lV,
					A5(elm$core$Dict$RBNode_elm_builtin, elm$core$Dict$Black, llK, llV, llLeft, llRight),
					A5(elm$core$Dict$RBNode_elm_builtin, elm$core$Dict$Black, key, value, lRight, right));
			} else {
				return A5(elm$core$Dict$RBNode_elm_builtin, color, key, value, left, right);
			}
		}
	});
var elm$core$Dict$insertHelp = F3(
	function (key, value, dict) {
		if (dict.$ === 'RBEmpty_elm_builtin') {
			return A5(elm$core$Dict$RBNode_elm_builtin, elm$core$Dict$Red, key, value, elm$core$Dict$RBEmpty_elm_builtin, elm$core$Dict$RBEmpty_elm_builtin);
		} else {
			var nColor = dict.a;
			var nKey = dict.b;
			var nValue = dict.c;
			var nLeft = dict.d;
			var nRight = dict.e;
			var _n1 = A2(elm$core$Basics$compare, key, nKey);
			switch (_n1.$) {
				case 'LT':
					return A5(
						elm$core$Dict$balance,
						nColor,
						nKey,
						nValue,
						A3(elm$core$Dict$insertHelp, key, value, nLeft),
						nRight);
				case 'EQ':
					return A5(elm$core$Dict$RBNode_elm_builtin, nColor, nKey, value, nLeft, nRight);
				default:
					return A5(
						elm$core$Dict$balance,
						nColor,
						nKey,
						nValue,
						nLeft,
						A3(elm$core$Dict$insertHelp, key, value, nRight));
			}
		}
	});
var elm$core$Dict$insert = F3(
	function (key, value, dict) {
		var _n0 = A3(elm$core$Dict$insertHelp, key, value, dict);
		if ((_n0.$ === 'RBNode_elm_builtin') && (_n0.a.$ === 'Red')) {
			var _n1 = _n0.a;
			var k = _n0.b;
			var v = _n0.c;
			var l = _n0.d;
			var r = _n0.e;
			return A5(elm$core$Dict$RBNode_elm_builtin, elm$core$Dict$Black, k, v, l, r);
		} else {
			var x = _n0;
			return x;
		}
	});
var elm$core$Dict$getMin = function (dict) {
	getMin:
	while (true) {
		if ((dict.$ === 'RBNode_elm_builtin') && (dict.d.$ === 'RBNode_elm_builtin')) {
			var left = dict.d;
			var $temp$dict = left;
			dict = $temp$dict;
			continue getMin;
		} else {
			return dict;
		}
	}
};
var elm$core$Dict$moveRedLeft = function (dict) {
	if (((dict.$ === 'RBNode_elm_builtin') && (dict.d.$ === 'RBNode_elm_builtin')) && (dict.e.$ === 'RBNode_elm_builtin')) {
		if ((dict.e.d.$ === 'RBNode_elm_builtin') && (dict.e.d.a.$ === 'Red')) {
			var clr = dict.a;
			var k = dict.b;
			var v = dict.c;
			var _n1 = dict.d;
			var lClr = _n1.a;
			var lK = _n1.b;
			var lV = _n1.c;
			var lLeft = _n1.d;
			var lRight = _n1.e;
			var _n2 = dict.e;
			var rClr = _n2.a;
			var rK = _n2.b;
			var rV = _n2.c;
			var rLeft = _n2.d;
			var _n3 = rLeft.a;
			var rlK = rLeft.b;
			var rlV = rLeft.c;
			var rlL = rLeft.d;
			var rlR = rLeft.e;
			var rRight = _n2.e;
			return A5(
				elm$core$Dict$RBNode_elm_builtin,
				elm$core$Dict$Red,
				rlK,
				rlV,
				A5(
					elm$core$Dict$RBNode_elm_builtin,
					elm$core$Dict$Black,
					k,
					v,
					A5(elm$core$Dict$RBNode_elm_builtin, elm$core$Dict$Red, lK, lV, lLeft, lRight),
					rlL),
				A5(elm$core$Dict$RBNode_elm_builtin, elm$core$Dict$Black, rK, rV, rlR, rRight));
		} else {
			var clr = dict.a;
			var k = dict.b;
			var v = dict.c;
			var _n4 = dict.d;
			var lClr = _n4.a;
			var lK = _n4.b;
			var lV = _n4.c;
			var lLeft = _n4.d;
			var lRight = _n4.e;
			var _n5 = dict.e;
			var rClr = _n5.a;
			var rK = _n5.b;
			var rV = _n5.c;
			var rLeft = _n5.d;
			var rRight = _n5.e;
			if (clr.$ === 'Black') {
				return A5(
					elm$core$Dict$RBNode_elm_builtin,
					elm$core$Dict$Black,
					k,
					v,
					A5(elm$core$Dict$RBNode_elm_builtin, elm$core$Dict$Red, lK, lV, lLeft, lRight),
					A5(elm$core$Dict$RBNode_elm_builtin, elm$core$Dict$Red, rK, rV, rLeft, rRight));
			} else {
				return A5(
					elm$core$Dict$RBNode_elm_builtin,
					elm$core$Dict$Black,
					k,
					v,
					A5(elm$core$Dict$RBNode_elm_builtin, elm$core$Dict$Red, lK, lV, lLeft, lRight),
					A5(elm$core$Dict$RBNode_elm_builtin, elm$core$Dict$Red, rK, rV, rLeft, rRight));
			}
		}
	} else {
		return dict;
	}
};
var elm$core$Dict$moveRedRight = function (dict) {
	if (((dict.$ === 'RBNode_elm_builtin') && (dict.d.$ === 'RBNode_elm_builtin')) && (dict.e.$ === 'RBNode_elm_builtin')) {
		if ((dict.d.d.$ === 'RBNode_elm_builtin') && (dict.d.d.a.$ === 'Red')) {
			var clr = dict.a;
			var k = dict.b;
			var v = dict.c;
			var _n1 = dict.d;
			var lClr = _n1.a;
			var lK = _n1.b;
			var lV = _n1.c;
			var _n2 = _n1.d;
			var _n3 = _n2.a;
			var llK = _n2.b;
			var llV = _n2.c;
			var llLeft = _n2.d;
			var llRight = _n2.e;
			var lRight = _n1.e;
			var _n4 = dict.e;
			var rClr = _n4.a;
			var rK = _n4.b;
			var rV = _n4.c;
			var rLeft = _n4.d;
			var rRight = _n4.e;
			return A5(
				elm$core$Dict$RBNode_elm_builtin,
				elm$core$Dict$Red,
				lK,
				lV,
				A5(elm$core$Dict$RBNode_elm_builtin, elm$core$Dict$Black, llK, llV, llLeft, llRight),
				A5(
					elm$core$Dict$RBNode_elm_builtin,
					elm$core$Dict$Black,
					k,
					v,
					lRight,
					A5(elm$core$Dict$RBNode_elm_builtin, elm$core$Dict$Red, rK, rV, rLeft, rRight)));
		} else {
			var clr = dict.a;
			var k = dict.b;
			var v = dict.c;
			var _n5 = dict.d;
			var lClr = _n5.a;
			var lK = _n5.b;
			var lV = _n5.c;
			var lLeft = _n5.d;
			var lRight = _n5.e;
			var _n6 = dict.e;
			var rClr = _n6.a;
			var rK = _n6.b;
			var rV = _n6.c;
			var rLeft = _n6.d;
			var rRight = _n6.e;
			if (clr.$ === 'Black') {
				return A5(
					elm$core$Dict$RBNode_elm_builtin,
					elm$core$Dict$Black,
					k,
					v,
					A5(elm$core$Dict$RBNode_elm_builtin, elm$core$Dict$Red, lK, lV, lLeft, lRight),
					A5(elm$core$Dict$RBNode_elm_builtin, elm$core$Dict$Red, rK, rV, rLeft, rRight));
			} else {
				return A5(
					elm$core$Dict$RBNode_elm_builtin,
					elm$core$Dict$Black,
					k,
					v,
					A5(elm$core$Dict$RBNode_elm_builtin, elm$core$Dict$Red, lK, lV, lLeft, lRight),
					A5(elm$core$Dict$RBNode_elm_builtin, elm$core$Dict$Red, rK, rV, rLeft, rRight));
			}
		}
	} else {
		return dict;
	}
};
var elm$core$Dict$removeHelpPrepEQGT = F7(
	function (targetKey, dict, color, key, value, left, right) {
		if ((left.$ === 'RBNode_elm_builtin') && (left.a.$ === 'Red')) {
			var _n1 = left.a;
			var lK = left.b;
			var lV = left.c;
			var lLeft = left.d;
			var lRight = left.e;
			return A5(
				elm$core$Dict$RBNode_elm_builtin,
				color,
				lK,
				lV,
				lLeft,
				A5(elm$core$Dict$RBNode_elm_builtin, elm$core$Dict$Red, key, value, lRight, right));
		} else {
			_n2$2:
			while (true) {
				if ((right.$ === 'RBNode_elm_builtin') && (right.a.$ === 'Black')) {
					if (right.d.$ === 'RBNode_elm_builtin') {
						if (right.d.a.$ === 'Black') {
							var _n3 = right.a;
							var _n4 = right.d;
							var _n5 = _n4.a;
							return elm$core$Dict$moveRedRight(dict);
						} else {
							break _n2$2;
						}
					} else {
						var _n6 = right.a;
						var _n7 = right.d;
						return elm$core$Dict$moveRedRight(dict);
					}
				} else {
					break _n2$2;
				}
			}
			return dict;
		}
	});
var elm$core$Dict$removeMin = function (dict) {
	if ((dict.$ === 'RBNode_elm_builtin') && (dict.d.$ === 'RBNode_elm_builtin')) {
		var color = dict.a;
		var key = dict.b;
		var value = dict.c;
		var left = dict.d;
		var lColor = left.a;
		var lLeft = left.d;
		var right = dict.e;
		if (lColor.$ === 'Black') {
			if ((lLeft.$ === 'RBNode_elm_builtin') && (lLeft.a.$ === 'Red')) {
				var _n3 = lLeft.a;
				return A5(
					elm$core$Dict$RBNode_elm_builtin,
					color,
					key,
					value,
					elm$core$Dict$removeMin(left),
					right);
			} else {
				var _n4 = elm$core$Dict$moveRedLeft(dict);
				if (_n4.$ === 'RBNode_elm_builtin') {
					var nColor = _n4.a;
					var nKey = _n4.b;
					var nValue = _n4.c;
					var nLeft = _n4.d;
					var nRight = _n4.e;
					return A5(
						elm$core$Dict$balance,
						nColor,
						nKey,
						nValue,
						elm$core$Dict$removeMin(nLeft),
						nRight);
				} else {
					return elm$core$Dict$RBEmpty_elm_builtin;
				}
			}
		} else {
			return A5(
				elm$core$Dict$RBNode_elm_builtin,
				color,
				key,
				value,
				elm$core$Dict$removeMin(left),
				right);
		}
	} else {
		return elm$core$Dict$RBEmpty_elm_builtin;
	}
};
var elm$core$Dict$removeHelp = F2(
	function (targetKey, dict) {
		if (dict.$ === 'RBEmpty_elm_builtin') {
			return elm$core$Dict$RBEmpty_elm_builtin;
		} else {
			var color = dict.a;
			var key = dict.b;
			var value = dict.c;
			var left = dict.d;
			var right = dict.e;
			if (_Utils_cmp(targetKey, key) < 0) {
				if ((left.$ === 'RBNode_elm_builtin') && (left.a.$ === 'Black')) {
					var _n4 = left.a;
					var lLeft = left.d;
					if ((lLeft.$ === 'RBNode_elm_builtin') && (lLeft.a.$ === 'Red')) {
						var _n6 = lLeft.a;
						return A5(
							elm$core$Dict$RBNode_elm_builtin,
							color,
							key,
							value,
							A2(elm$core$Dict$removeHelp, targetKey, left),
							right);
					} else {
						var _n7 = elm$core$Dict$moveRedLeft(dict);
						if (_n7.$ === 'RBNode_elm_builtin') {
							var nColor = _n7.a;
							var nKey = _n7.b;
							var nValue = _n7.c;
							var nLeft = _n7.d;
							var nRight = _n7.e;
							return A5(
								elm$core$Dict$balance,
								nColor,
								nKey,
								nValue,
								A2(elm$core$Dict$removeHelp, targetKey, nLeft),
								nRight);
						} else {
							return elm$core$Dict$RBEmpty_elm_builtin;
						}
					}
				} else {
					return A5(
						elm$core$Dict$RBNode_elm_builtin,
						color,
						key,
						value,
						A2(elm$core$Dict$removeHelp, targetKey, left),
						right);
				}
			} else {
				return A2(
					elm$core$Dict$removeHelpEQGT,
					targetKey,
					A7(elm$core$Dict$removeHelpPrepEQGT, targetKey, dict, color, key, value, left, right));
			}
		}
	});
var elm$core$Dict$removeHelpEQGT = F2(
	function (targetKey, dict) {
		if (dict.$ === 'RBNode_elm_builtin') {
			var color = dict.a;
			var key = dict.b;
			var value = dict.c;
			var left = dict.d;
			var right = dict.e;
			if (_Utils_eq(targetKey, key)) {
				var _n1 = elm$core$Dict$getMin(right);
				if (_n1.$ === 'RBNode_elm_builtin') {
					var minKey = _n1.b;
					var minValue = _n1.c;
					return A5(
						elm$core$Dict$balance,
						color,
						minKey,
						minValue,
						left,
						elm$core$Dict$removeMin(right));
				} else {
					return elm$core$Dict$RBEmpty_elm_builtin;
				}
			} else {
				return A5(
					elm$core$Dict$balance,
					color,
					key,
					value,
					left,
					A2(elm$core$Dict$removeHelp, targetKey, right));
			}
		} else {
			return elm$core$Dict$RBEmpty_elm_builtin;
		}
	});
var elm$core$Dict$remove = F2(
	function (key, dict) {
		var _n0 = A2(elm$core$Dict$removeHelp, key, dict);
		if ((_n0.$ === 'RBNode_elm_builtin') && (_n0.a.$ === 'Red')) {
			var _n1 = _n0.a;
			var k = _n0.b;
			var v = _n0.c;
			var l = _n0.d;
			var r = _n0.e;
			return A5(elm$core$Dict$RBNode_elm_builtin, elm$core$Dict$Black, k, v, l, r);
		} else {
			var x = _n0;
			return x;
		}
	});
var elm$core$Dict$update = F3(
	function (targetKey, alter, dictionary) {
		var _n0 = alter(
			A2(elm$core$Dict$get, targetKey, dictionary));
		if (_n0.$ === 'Just') {
			var value = _n0.a;
			return A3(elm$core$Dict$insert, targetKey, value, dictionary);
		} else {
			return A2(elm$core$Dict$remove, targetKey, dictionary);
		}
	});
var author$project$Game$uNewEntity = F4(
	function (maybeParentId, fs, env, oldGame) {
		var e = A2(author$project$Game$newEntity__, maybeParentId, oldGame);
		var maybeParent = A2(author$project$Game$getParent, oldGame, e);
		var _n0 = A3(
			elm$core$List$foldl,
			A2(author$project$Game$entityUpdate_runOneFunction, env, maybeParent),
			_Utils_Tuple3(
				A3(author$project$Game$setPositionsFromRelative, maybeParent, author$project$Vector$origin, e),
				_Utils_update(
					oldGame,
					{lastId: e.id}),
				_List_Nil),
			fs);
		var entity = _n0.a;
		var newGame = _n0.b;
		var outcomes = _n0.c;
		var updateParent = function () {
			if (maybeParentId.$ === 'Nothing') {
				return elm$core$Basics$identity;
			} else {
				var parentId = maybeParentId.a;
				return A2(
					elm$core$Dict$update,
					parentId,
					elm$core$Maybe$map(
						function (p) {
							return _Utils_update(
								p,
								{
									childrenIds: A2(elm$core$List$cons, entity.id, p.childrenIds)
								});
						}));
			}
		}();
		var entitiesById = updateParent(
			A3(elm$core$Dict$insert, entity.id, entity, newGame.entitiesById));
		var rootEntitiesIds = function () {
			if (maybeParentId.$ === 'Nothing') {
				return A2(elm$core$List$cons, entity.id, newGame.rootEntitiesIds);
			} else {
				return newGame.rootEntitiesIds;
			}
		}();
		return _Utils_Tuple2(
			_Utils_update(
				newGame,
				{entitiesById: entitiesById, lastId: entity.id, rootEntitiesIds: rootEntitiesIds}),
			author$project$Game$OutcomeList(outcomes));
	});
var author$project$Game$entityOnly = F2(
	function (game, entity) {
		return _Utils_Tuple3(entity, game, author$project$Game$OutcomeNone);
	});
var elm$core$Basics$neq = _Utils_notEqual;
var elm$core$List$foldrHelper = F4(
	function (fn, acc, ctr, ls) {
		if (!ls.b) {
			return acc;
		} else {
			var a = ls.a;
			var r1 = ls.b;
			if (!r1.b) {
				return A2(fn, a, acc);
			} else {
				var b = r1.a;
				var r2 = r1.b;
				if (!r2.b) {
					return A2(
						fn,
						a,
						A2(fn, b, acc));
				} else {
					var c = r2.a;
					var r3 = r2.b;
					if (!r3.b) {
						return A2(
							fn,
							a,
							A2(
								fn,
								b,
								A2(fn, c, acc)));
					} else {
						var d = r3.a;
						var r4 = r3.b;
						var res = (ctr > 500) ? A3(
							elm$core$List$foldl,
							fn,
							acc,
							elm$core$List$reverse(r4)) : A4(elm$core$List$foldrHelper, fn, acc, ctr + 1, r4);
						return A2(
							fn,
							a,
							A2(
								fn,
								b,
								A2(
									fn,
									c,
									A2(fn, d, res))));
					}
				}
			}
		}
	});
var elm$core$List$foldr = F3(
	function (fn, acc, ls) {
		return A4(elm$core$List$foldrHelper, fn, acc, 0, ls);
	});
var elm$core$List$filter = F2(
	function (isGood, list) {
		return A3(
			elm$core$List$foldr,
			F2(
				function (x, xs) {
					return isGood(x) ? A2(elm$core$List$cons, x, xs) : xs;
				}),
			_List_Nil,
			list);
	});
var elm$core$List$maybeCons = F3(
	function (f, mx, xs) {
		var _n0 = f(mx);
		if (_n0.$ === 'Just') {
			var x = _n0.a;
			return A2(elm$core$List$cons, x, xs);
		} else {
			return xs;
		}
	});
var elm$core$List$filterMap = F2(
	function (f, xs) {
		return A3(
			elm$core$List$foldr,
			elm$core$List$maybeCons(f),
			_List_Nil,
			xs);
	});
var author$project$Game$uDeleteEntity = F3(
	function (id, env, game) {
		var _n0 = A2(elm$core$Dict$get, id, game.entitiesById);
		if (_n0.$ === 'Nothing') {
			return author$project$Game$noOut(game);
		} else {
			var entity = _n0.a;
			var removeId = elm$core$List$filter(
				function (i) {
					return !_Utils_eq(i, id);
				});
			var removeFromParent = function () {
				var _n1 = A2(author$project$Game$getParent, game, entity);
				if (_n1.$ === 'Nothing') {
					return function (g) {
						return _Utils_update(
							g,
							{
								rootEntitiesIds: removeId(g.rootEntitiesIds)
							});
					};
				} else {
					var parent = _n1.a.a;
					return function (g) {
						return _Utils_update(
							g,
							{
								entitiesById: A3(
									elm$core$Dict$insert,
									parent.id,
									_Utils_update(
										parent,
										{
											childrenIds: removeId(parent.childrenIds)
										}),
									g.entitiesById)
							});
					};
				}
			}();
			var removeEntity = F2(
				function (e, entitiesById) {
					return A3(
						elm$core$List$foldl,
						removeEntity,
						A2(elm$core$Dict$remove, e.id, entitiesById),
						A2(
							elm$core$List$filterMap,
							function (i) {
								return A2(elm$core$Dict$get, i, entitiesById);
							},
							entity.childrenIds));
				});
			return author$project$Game$noOut(
				removeFromParent(
					_Utils_update(
						game,
						{
							entitiesById: A2(removeEntity, entity, game.entitiesById)
						})));
		}
	});
var author$project$Game$toTriple = function (_n0) {
	var e = _n0.a;
	var _n1 = _n0.b;
	var g = _n1.a;
	var o = _n1.b;
	return _Utils_Tuple3(e, g, o);
};
var author$project$Game$uToE = F5(
	function (f, env, maybeParent, game, entity) {
		return author$project$Game$toTriple(
			_Utils_Tuple2(
				entity,
				A2(f, env, game)));
	});
var author$project$EntityMain$killAfter = F5(
	function (duration, env, maybeParent, game, entity) {
		return (_Utils_cmp(game.time - entity.spawnedAt, duration) < 0) ? A2(author$project$Game$entityOnly, game, entity) : A5(
			author$project$Game$uToE,
			author$project$Game$uDeleteEntity(entity.id),
			env,
			maybeParent,
			game,
			entity);
	});
var author$project$Game$WrapEntityFunction = function (a) {
	return {$: 'WrapEntityFunction', a: a};
};
var elm$core$Basics$append = _Utils_append;
var elm$core$List$map = F2(
	function (f, xs) {
		return A3(
			elm$core$List$foldr,
			F2(
				function (x, acc) {
					return A2(
						elm$core$List$cons,
						f(x),
						acc);
				}),
			_List_Nil,
			xs);
	});
var author$project$Game$appendEntityUpdateFunctions = F2(
	function (fs, entity) {
		return _Utils_update(
			entity,
			{
				wrappedUpdateFunctions: _Utils_ap(
					entity.wrappedUpdateFunctions,
					A2(elm$core$List$map, author$project$Game$WrapEntityFunction, fs))
			});
	});
var author$project$Game$RenderScript = function (a) {
	return {$: 'RenderScript', a: a};
};
var author$project$Game$appendRenderFunctions = F2(
	function (fs, entity) {
		return _Utils_update(
			entity,
			{
				renderScripts: _Utils_ap(
					entity.renderScripts,
					A2(elm$core$List$map, author$project$Game$RenderScript, fs))
			});
	});
var author$project$Game$RenderableSvg = F2(
	function (a, b) {
		return {$: 'RenderableSvg', a: a, b: b};
	});
var elm$core$Basics$min = F2(
	function (x, y) {
		return (_Utils_cmp(x, y) < 0) ? x : y;
	});
var elm$core$String$fromFloat = _String_fromNumber;
var elm$core$Result$isOk = function (result) {
	if (result.$ === 'Ok') {
		return true;
	} else {
		return false;
	}
};
var elm$core$Basics$idiv = _Basics_idiv;
var elm$core$Elm$JsArray$initialize = _JsArray_initialize;
var elm$core$Array$initializeHelp = F5(
	function (fn, fromIndex, len, nodeList, tail) {
		initializeHelp:
		while (true) {
			if (fromIndex < 0) {
				return A2(
					elm$core$Array$builderToArray,
					false,
					{nodeList: nodeList, nodeListSize: (len / elm$core$Array$branchFactor) | 0, tail: tail});
			} else {
				var leaf = elm$core$Array$Leaf(
					A3(elm$core$Elm$JsArray$initialize, elm$core$Array$branchFactor, fromIndex, fn));
				var $temp$fn = fn,
					$temp$fromIndex = fromIndex - elm$core$Array$branchFactor,
					$temp$len = len,
					$temp$nodeList = A2(elm$core$List$cons, leaf, nodeList),
					$temp$tail = tail;
				fn = $temp$fn;
				fromIndex = $temp$fromIndex;
				len = $temp$len;
				nodeList = $temp$nodeList;
				tail = $temp$tail;
				continue initializeHelp;
			}
		}
	});
var elm$core$Basics$le = _Utils_le;
var elm$core$Basics$remainderBy = _Basics_remainderBy;
var elm$core$Array$initialize = F2(
	function (len, fn) {
		if (len <= 0) {
			return elm$core$Array$empty;
		} else {
			var tailLen = len % elm$core$Array$branchFactor;
			var tail = A3(elm$core$Elm$JsArray$initialize, tailLen, len - tailLen, fn);
			var initialFromIndex = (len - tailLen) - elm$core$Array$branchFactor;
			return A5(elm$core$Array$initializeHelp, fn, initialFromIndex, len, _List_Nil, tail);
		}
	});
var elm$core$Result$Err = function (a) {
	return {$: 'Err', a: a};
};
var elm$core$Result$Ok = function (a) {
	return {$: 'Ok', a: a};
};
var elm$json$Json$Decode$Failure = F2(
	function (a, b) {
		return {$: 'Failure', a: a, b: b};
	});
var elm$json$Json$Decode$Field = F2(
	function (a, b) {
		return {$: 'Field', a: a, b: b};
	});
var elm$json$Json$Decode$Index = F2(
	function (a, b) {
		return {$: 'Index', a: a, b: b};
	});
var elm$json$Json$Decode$OneOf = function (a) {
	return {$: 'OneOf', a: a};
};
var elm$core$Basics$and = _Basics_and;
var elm$core$Basics$or = _Basics_or;
var elm$core$Char$toCode = _Char_toCode;
var elm$core$Char$isLower = function (_char) {
	var code = elm$core$Char$toCode(_char);
	return (97 <= code) && (code <= 122);
};
var elm$core$Char$isUpper = function (_char) {
	var code = elm$core$Char$toCode(_char);
	return (code <= 90) && (65 <= code);
};
var elm$core$Char$isAlpha = function (_char) {
	return elm$core$Char$isLower(_char) || elm$core$Char$isUpper(_char);
};
var elm$core$Char$isDigit = function (_char) {
	var code = elm$core$Char$toCode(_char);
	return (code <= 57) && (48 <= code);
};
var elm$core$Char$isAlphaNum = function (_char) {
	return elm$core$Char$isLower(_char) || (elm$core$Char$isUpper(_char) || elm$core$Char$isDigit(_char));
};
var elm$core$List$length = function (xs) {
	return A3(
		elm$core$List$foldl,
		F2(
			function (_n0, i) {
				return i + 1;
			}),
		0,
		xs);
};
var elm$core$List$map2 = _List_map2;
var elm$core$List$rangeHelp = F3(
	function (lo, hi, list) {
		rangeHelp:
		while (true) {
			if (_Utils_cmp(lo, hi) < 1) {
				var $temp$lo = lo,
					$temp$hi = hi - 1,
					$temp$list = A2(elm$core$List$cons, hi, list);
				lo = $temp$lo;
				hi = $temp$hi;
				list = $temp$list;
				continue rangeHelp;
			} else {
				return list;
			}
		}
	});
var elm$core$List$range = F2(
	function (lo, hi) {
		return A3(elm$core$List$rangeHelp, lo, hi, _List_Nil);
	});
var elm$core$List$indexedMap = F2(
	function (f, xs) {
		return A3(
			elm$core$List$map2,
			f,
			A2(
				elm$core$List$range,
				0,
				elm$core$List$length(xs) - 1),
			xs);
	});
var elm$core$String$all = _String_all;
var elm$core$String$fromInt = _String_fromNumber;
var elm$core$String$join = F2(
	function (sep, chunks) {
		return A2(
			_String_join,
			sep,
			_List_toArray(chunks));
	});
var elm$core$String$uncons = _String_uncons;
var elm$core$String$split = F2(
	function (sep, string) {
		return _List_fromArray(
			A2(_String_split, sep, string));
	});
var elm$json$Json$Decode$indent = function (str) {
	return A2(
		elm$core$String$join,
		'\n    ',
		A2(elm$core$String$split, '\n', str));
};
var elm$json$Json$Encode$encode = _Json_encode;
var elm$json$Json$Decode$errorOneOf = F2(
	function (i, error) {
		return '\n\n(' + (elm$core$String$fromInt(i + 1) + (') ' + elm$json$Json$Decode$indent(
			elm$json$Json$Decode$errorToString(error))));
	});
var elm$json$Json$Decode$errorToString = function (error) {
	return A2(elm$json$Json$Decode$errorToStringHelp, error, _List_Nil);
};
var elm$json$Json$Decode$errorToStringHelp = F2(
	function (error, context) {
		errorToStringHelp:
		while (true) {
			switch (error.$) {
				case 'Field':
					var f = error.a;
					var err = error.b;
					var isSimple = function () {
						var _n1 = elm$core$String$uncons(f);
						if (_n1.$ === 'Nothing') {
							return false;
						} else {
							var _n2 = _n1.a;
							var _char = _n2.a;
							var rest = _n2.b;
							return elm$core$Char$isAlpha(_char) && A2(elm$core$String$all, elm$core$Char$isAlphaNum, rest);
						}
					}();
					var fieldName = isSimple ? ('.' + f) : ('[\'' + (f + '\']'));
					var $temp$error = err,
						$temp$context = A2(elm$core$List$cons, fieldName, context);
					error = $temp$error;
					context = $temp$context;
					continue errorToStringHelp;
				case 'Index':
					var i = error.a;
					var err = error.b;
					var indexName = '[' + (elm$core$String$fromInt(i) + ']');
					var $temp$error = err,
						$temp$context = A2(elm$core$List$cons, indexName, context);
					error = $temp$error;
					context = $temp$context;
					continue errorToStringHelp;
				case 'OneOf':
					var errors = error.a;
					if (!errors.b) {
						return 'Ran into a Json.Decode.oneOf with no possibilities' + function () {
							if (!context.b) {
								return '!';
							} else {
								return ' at json' + A2(
									elm$core$String$join,
									'',
									elm$core$List$reverse(context));
							}
						}();
					} else {
						if (!errors.b.b) {
							var err = errors.a;
							var $temp$error = err,
								$temp$context = context;
							error = $temp$error;
							context = $temp$context;
							continue errorToStringHelp;
						} else {
							var starter = function () {
								if (!context.b) {
									return 'Json.Decode.oneOf';
								} else {
									return 'The Json.Decode.oneOf at json' + A2(
										elm$core$String$join,
										'',
										elm$core$List$reverse(context));
								}
							}();
							var introduction = starter + (' failed in the following ' + (elm$core$String$fromInt(
								elm$core$List$length(errors)) + ' ways:'));
							return A2(
								elm$core$String$join,
								'\n\n',
								A2(
									elm$core$List$cons,
									introduction,
									A2(elm$core$List$indexedMap, elm$json$Json$Decode$errorOneOf, errors)));
						}
					}
				default:
					var msg = error.a;
					var json = error.b;
					var introduction = function () {
						if (!context.b) {
							return 'Problem with the given value:\n\n';
						} else {
							return 'Problem with the value at json' + (A2(
								elm$core$String$join,
								'',
								elm$core$List$reverse(context)) + ':\n\n    ');
						}
					}();
					return introduction + (elm$json$Json$Decode$indent(
						A2(elm$json$Json$Encode$encode, 4, json)) + ('\n\n' + msg));
			}
		}
	});
var elm$json$Json$Decode$map = _Json_map1;
var elm$json$Json$Decode$map2 = _Json_map2;
var elm$json$Json$Decode$succeed = _Json_succeed;
var elm$virtual_dom$VirtualDom$toHandlerInt = function (handler) {
	switch (handler.$) {
		case 'Normal':
			return 0;
		case 'MayStopPropagation':
			return 1;
		case 'MayPreventDefault':
			return 2;
		default:
			return 3;
	}
};
var elm$svg$Svg$trustedNode = _VirtualDom_nodeNS('http://www.w3.org/2000/svg');
var elm$svg$Svg$rect = elm$svg$Svg$trustedNode('rect');
var elm$svg$Svg$Attributes$fill = _VirtualDom_attribute('fill');
var elm$svg$Svg$Attributes$height = _VirtualDom_attribute('height');
var elm$svg$Svg$Attributes$opacity = _VirtualDom_attribute('opacity');
var elm$svg$Svg$Attributes$width = _VirtualDom_attribute('width');
var elm$svg$Svg$Attributes$x = _VirtualDom_attribute('x');
var elm$svg$Svg$Attributes$y = _VirtualDom_attribute('y');
var author$project$Missions$Intro$fadeInRender = F5(
	function (delay, duration, env, game, entity) {
		var age = (game.time - entity.spawnedAt) - delay;
		var opacity = A2(elm$core$Basics$min, 1, 1 - (age / duration));
		return A2(
			author$project$Game$RenderableSvg,
			1,
			A2(
				elm$svg$Svg$rect,
				_List_fromArray(
					[
						elm$svg$Svg$Attributes$x('-1'),
						elm$svg$Svg$Attributes$y('-1'),
						elm$svg$Svg$Attributes$width('2'),
						elm$svg$Svg$Attributes$height('2'),
						elm$svg$Svg$Attributes$fill('black'),
						elm$svg$Svg$Attributes$opacity(
						elm$core$String$fromFloat(opacity))
					]),
				_List_Nil));
	});
var author$project$Missions$Intro$addFadeIn = function (delay) {
	var duration = 6;
	return A2(
		author$project$Game$uNewEntity,
		elm$core$Maybe$Nothing,
		_List_fromArray(
			[
				F4(
				function (env, maybeParent, game, entity) {
					return A2(
						author$project$Game$entityOnly,
						game,
						A2(
							author$project$Game$appendRenderFunctions,
							_List_fromArray(
								[
									A2(author$project$Missions$Intro$fadeInRender, delay, duration)
								]),
							A2(
								author$project$Game$appendEntityUpdateFunctions,
								_List_fromArray(
									[
										author$project$EntityMain$killAfter(delay + duration)
									]),
								entity)));
				})
			]));
};
var elm$core$String$foldr = _String_foldr;
var elm$core$String$toList = function (string) {
	return A3(elm$core$String$foldr, elm$core$List$cons, _List_Nil, string);
};
var author$project$Map$stringToTiles = F2(
	function (idToTile, tilesAsStrings) {
		return elm$core$Array$fromList(
			A2(
				elm$core$List$map,
				idToTile,
				elm$core$String$toList(
					A2(elm$core$String$join, '', tilesAsStrings))));
	});
var author$project$TransformTree$Nest = F2(
	function (a, b) {
		return {$: 'Nest', a: a, b: b};
	});
var author$project$Tiles$backgroundNone = {
	id: _Utils_chr(' '),
	render: A2(author$project$TransformTree$Nest, _List_Nil, _List_Nil)
};
var avh4$elm_color$Color$RgbaSpace = F4(
	function (a, b, c, d) {
		return {$: 'RgbaSpace', a: a, b: b, c: c, d: d};
	});
var avh4$elm_color$Color$hsla = F4(
	function (hue, sat, light, alpha) {
		var _n0 = _Utils_Tuple3(hue, sat, light);
		var h = _n0.a;
		var s = _n0.b;
		var l = _n0.c;
		var m2 = (l <= 0.5) ? (l * (s + 1)) : ((l + s) - (l * s));
		var m1 = (l * 2) - m2;
		var hueToRgb = function (h__) {
			var h_ = (h__ < 0) ? (h__ + 1) : ((h__ > 1) ? (h__ - 1) : h__);
			return ((h_ * 6) < 1) ? (m1 + (((m2 - m1) * h_) * 6)) : (((h_ * 2) < 1) ? m2 : (((h_ * 3) < 2) ? (m1 + (((m2 - m1) * ((2 / 3) - h_)) * 6)) : m1));
		};
		var b = hueToRgb(h - (1 / 3));
		var g = hueToRgb(h);
		var r = hueToRgb(h + (1 / 3));
		return A4(avh4$elm_color$Color$RgbaSpace, r, g, b, alpha);
	});
var avh4$elm_color$Color$hsl = F3(
	function (h, s, l) {
		return A4(avh4$elm_color$Color$hsla, h, s, l, 1.0);
	});
var author$project$Svgl$Tree$defaultParams = {
	fill: A3(avh4$elm_color$Color$hsl, 1, 1, 0.5),
	h: 1,
	opacity: 1,
	rotate: 0,
	stroke: A3(avh4$elm_color$Color$hsl, 1, 1, 0.3),
	strokeWidth: 2.5e-2,
	w: 1,
	x: 0,
	y: 0,
	z: 0
};
var author$project$Svgl$Primitives$Ellipse = {$: 'Ellipse'};
var author$project$TransformTree$Leaf = function (a) {
	return {$: 'Leaf', a: a};
};
var author$project$Svgl$Tree$ellipse = function (params) {
	return author$project$TransformTree$Leaf(
		_Utils_Tuple2(author$project$Svgl$Primitives$Ellipse, params));
};
var author$project$Svgl$Primitives$Rectangle = {$: 'Rectangle'};
var author$project$Svgl$Tree$rect = function (params) {
	return author$project$TransformTree$Leaf(
		_Utils_Tuple2(author$project$Svgl$Primitives$Rectangle, params));
};
var avh4$elm_color$Color$charcoal = A4(avh4$elm_color$Color$RgbaSpace, 85 / 255, 87 / 255, 83 / 255, 1.0);
var avh4$elm_color$Color$darkCharcoal = A4(avh4$elm_color$Color$RgbaSpace, 46 / 255, 52 / 255, 54 / 255, 1.0);
var elm$core$Basics$negate = function (n) {
	return -n;
};
var author$project$Tiles$rivetedPanel = {
	id: _Utils_chr('#'),
	render: function () {
		var re = _Utils_update(
			author$project$Svgl$Tree$defaultParams,
			{fill: avh4$elm_color$Color$darkCharcoal, stroke: avh4$elm_color$Color$charcoal});
		var o = 0.37;
		var ell = _Utils_update(
			author$project$Svgl$Tree$defaultParams,
			{fill: avh4$elm_color$Color$charcoal, h: 0.1, strokeWidth: 0, w: 0.1});
		return A2(
			author$project$TransformTree$Nest,
			_List_Nil,
			_List_fromArray(
				[
					author$project$Svgl$Tree$rect(re),
					author$project$Svgl$Tree$ellipse(
					_Utils_update(
						ell,
						{x: -o, y: -o})),
					author$project$Svgl$Tree$ellipse(
					_Utils_update(
						ell,
						{x: o, y: -o})),
					author$project$Svgl$Tree$ellipse(
					_Utils_update(
						ell,
						{x: o, y: o})),
					author$project$Svgl$Tree$ellipse(
					_Utils_update(
						ell,
						{x: -o, y: o}))
				]));
	}()
};
var author$project$TransformTree$Translate = function (a) {
	return {$: 'Translate', a: a};
};
var author$project$TransformTree$translate2 = F2(
	function (x, y) {
		return author$project$TransformTree$Translate(
			{x: x, y: y, z: 0});
	});
var author$project$Tiles$rivetedPanel3x3 = {
	id: _Utils_chr('3'),
	render: function () {
		var re = _Utils_update(
			author$project$Svgl$Tree$defaultParams,
			{fill: avh4$elm_color$Color$darkCharcoal, h: 3, stroke: avh4$elm_color$Color$charcoal, w: 3});
		var o = 1.37;
		var ell = _Utils_update(
			author$project$Svgl$Tree$defaultParams,
			{fill: avh4$elm_color$Color$charcoal, h: 0.1, strokeWidth: 0, w: 0.1});
		return A2(
			author$project$TransformTree$Nest,
			_List_fromArray(
				[
					A2(author$project$TransformTree$translate2, 1, 1)
				]),
			_List_fromArray(
				[
					author$project$Svgl$Tree$rect(re),
					author$project$Svgl$Tree$ellipse(
					_Utils_update(
						ell,
						{x: -o, y: -o})),
					author$project$Svgl$Tree$ellipse(
					_Utils_update(
						ell,
						{x: o, y: -o})),
					author$project$Svgl$Tree$ellipse(
					_Utils_update(
						ell,
						{x: o, y: o})),
					author$project$Svgl$Tree$ellipse(
					_Utils_update(
						ell,
						{x: -o, y: o}))
				]));
	}()
};
var author$project$Tiles$backgroundTilesById = A3(
	elm$core$List$foldl,
	F2(
		function (tile, accum) {
			return A3(elm$core$Dict$insert, tile.id, tile, accum);
		}),
	elm$core$Dict$empty,
	_List_fromArray(
		[author$project$Tiles$backgroundNone, author$project$Tiles$rivetedPanel, author$project$Tiles$rivetedPanel3x3]));
var elm$core$Maybe$withDefault = F2(
	function (_default, maybe) {
		if (maybe.$ === 'Just') {
			var value = maybe.a;
			return value;
		} else {
			return _default;
		}
	});
var author$project$Tiles$idToBackgroundTile = function (id) {
	return A2(
		elm$core$Maybe$withDefault,
		author$project$Tiles$backgroundNone,
		A2(elm$core$Dict$get, id, author$project$Tiles$backgroundTilesById));
};
var author$project$TileCollision$collideNever = function (aabbTrajectory) {
	return elm$core$Maybe$Nothing;
};
var author$project$Tiles$foregroundNone = {
	collider: author$project$TileCollision$collideNever,
	hasCeilingSpace: true,
	id: _Utils_chr(' '),
	isLadder: false,
	jumpDown: false,
	render: A2(author$project$TransformTree$Nest, _List_Nil, _List_Nil)
};
var elm_community$list_extra$List$Extra$minimumBy = F2(
	function (f, ls) {
		var minBy = F2(
			function (x, _n1) {
				var y = _n1.a;
				var fy = _n1.b;
				var fx = f(x);
				return (_Utils_cmp(fx, fy) < 0) ? _Utils_Tuple2(x, fx) : _Utils_Tuple2(y, fy);
			});
		if (ls.b) {
			if (!ls.b.b) {
				var l_ = ls.a;
				return elm$core$Maybe$Just(l_);
			} else {
				var l_ = ls.a;
				var ls_ = ls.b;
				return elm$core$Maybe$Just(
					A3(
						elm$core$List$foldl,
						minBy,
						_Utils_Tuple2(
							l_,
							f(l_)),
						ls_).a);
			}
		} else {
			return elm$core$Maybe$Nothing;
		}
	});
var author$project$TileCollision$combine = function (colliders) {
	var combined = function (input) {
		return A2(
			elm_community$list_extra$List$Extra$minimumBy,
			function ($) {
				return $.distanceSquared;
			},
			A2(
				elm$core$List$filterMap,
				function (collider) {
					return collider(input);
				},
				colliders));
	};
	return combined;
};
var author$project$TileCollision$collisionMap = F3(
	function (transformGeometry, transformVec, c) {
		return {
			aabbPositionAtImpact: transformVec(c.aabbPositionAtImpact),
			distanceSquared: c.distanceSquared,
			fix: transformVec(c.fix),
			geometry: transformGeometry(c.geometry),
			impactPoint: transformVec(c.impactPoint),
			tile: c.tile
		};
	});
var author$project$TileCollision$transform = F4(
	function (forwards, backwards, geo, collider) {
		var transformed = function (input) {
			return A2(
				elm$core$Maybe$map,
				A2(author$project$TileCollision$collisionMap, geo, backwards),
				collider(
					_Utils_update(
						input,
						{
							relativeEnd: forwards(input.relativeEnd),
							relativeStart: forwards(input.relativeStart)
						})));
		};
		return transformed;
	});
var author$project$TileCollision$vecInvertX = function (v) {
	return _Utils_update(
		v,
		{x: -v.x});
};
var author$project$TileCollision$invertX = A3(author$project$TileCollision$transform, author$project$TileCollision$vecInvertX, author$project$TileCollision$vecInvertX, elm$core$Basics$identity);
var elm$core$Basics$composeR = F3(
	function (f, g, x) {
		return g(
			f(x));
	});
var author$project$TileCollision$map = F2(
	function (f, collider) {
		return A2(
			elm$core$Basics$composeR,
			collider,
			elm$core$Maybe$map(
				A2(author$project$TileCollision$collisionMap, f, elm$core$Basics$identity)));
	});
var author$project$TileCollision$distanceSquared = F2(
	function (a, b) {
		var dy = a.y - b.y;
		var dx = a.x - b.x;
		return (dx * dx) + (dy * dy);
	});
var author$project$TileCollision$makeTrajectory = F3(
	function (s, e, x) {
		return (((x - s.x) * (e.y - s.y)) / (e.x - s.x)) + s.y;
	});
var author$project$TileCollision$minimumDistance = 1.0e-4;
var elm$core$Basics$ge = _Utils_ge;
var author$project$TileCollision$collideWhenXIncreases = F2(
	function (bounceBackTheshold, _n0) {
		var relativeStart = _n0.relativeStart;
		var relativeEnd = _n0.relativeEnd;
		var halfWidth = _n0.halfWidth;
		var halfHeight = _n0.halfHeight;
		var blockX = -0.5;
		if (_Utils_cmp(relativeStart.x, relativeEnd.x) > -1) {
			return elm$core$Maybe$Nothing;
		} else {
			if (_Utils_cmp(relativeStart.x + halfWidth, blockX + bounceBackTheshold) > -1) {
				return elm$core$Maybe$Nothing;
			} else {
				if (_Utils_cmp(relativeEnd.x + halfWidth, blockX) < 1) {
					return elm$core$Maybe$Nothing;
				} else {
					var trajectory = A2(author$project$TileCollision$makeTrajectory, relativeStart, relativeEnd);
					var collisionY = trajectory(blockX - halfWidth);
					if (_Utils_cmp(collisionY + halfHeight, -0.5) < 1) {
						return elm$core$Maybe$Nothing;
					} else {
						if ((collisionY - halfHeight) >= 0.5) {
							return elm$core$Maybe$Nothing;
						} else {
							var point = {x: blockX, y: collisionY};
							var fixedX = (blockX - halfWidth) - author$project$TileCollision$minimumDistance;
							var aabbPositionAtImpact = {x: fixedX, y: collisionY};
							return elm$core$Maybe$Just(
								{
									aabbPositionAtImpact: aabbPositionAtImpact,
									distanceSquared: A2(author$project$TileCollision$distanceSquared, relativeStart, aabbPositionAtImpact),
									fix: _Utils_update(
										relativeEnd,
										{x: fixedX}),
									geometry: _Utils_Tuple0,
									impactPoint: point,
									tile: {column: 0, row: 0}
								});
						}
					}
				}
			}
		}
	});
var author$project$TileCollision$thickCollideWhenXIncreases = author$project$TileCollision$collideWhenXIncreases(0.99);
var author$project$Tiles$Decreases = {$: 'Decreases'};
var author$project$Tiles$X = function (a) {
	return {$: 'X', a: a};
};
var author$project$Tiles$collideWhenXDecreases = A2(
	author$project$TileCollision$map,
	function (_n0) {
		return author$project$Tiles$X(author$project$Tiles$Decreases);
	},
	author$project$TileCollision$invertX(author$project$TileCollision$thickCollideWhenXIncreases));
var author$project$Tiles$Increases = {$: 'Increases'};
var author$project$Tiles$collideWhenXIncreases = A2(
	author$project$TileCollision$map,
	function (_n0) {
		return author$project$Tiles$X(author$project$Tiles$Increases);
	},
	author$project$TileCollision$thickCollideWhenXIncreases);
var author$project$TileCollision$vecFlipXY = function (v) {
	return {x: v.y, y: v.x};
};
var author$project$TileCollision$flipXY = function (collider) {
	var transformed = function (input) {
		return A2(
			elm$core$Maybe$map,
			A2(author$project$TileCollision$collisionMap, elm$core$Basics$identity, author$project$TileCollision$vecFlipXY),
			collider(
				_Utils_update(
					input,
					{
						halfHeight: input.halfWidth,
						halfWidth: input.halfHeight,
						relativeEnd: author$project$TileCollision$vecFlipXY(input.relativeEnd),
						relativeStart: author$project$TileCollision$vecFlipXY(input.relativeStart)
					})));
	};
	return transformed;
};
var author$project$Tiles$Y = function (a) {
	return {$: 'Y', a: a};
};
var author$project$Tiles$collideWhenYDecreases = A2(
	author$project$TileCollision$map,
	function (_n0) {
		return author$project$Tiles$Y(author$project$Tiles$Decreases);
	},
	author$project$TileCollision$flipXY(
		author$project$TileCollision$invertX(author$project$TileCollision$thickCollideWhenXIncreases)));
var author$project$Tiles$collideWhenYIncreases = A2(
	author$project$TileCollision$map,
	function (_n0) {
		return author$project$Tiles$Y(author$project$Tiles$Increases);
	},
	author$project$TileCollision$flipXY(author$project$TileCollision$thickCollideWhenXIncreases));
var author$project$Tiles$squareObstacle = author$project$TileCollision$combine(
	_List_fromArray(
		[author$project$Tiles$collideWhenYIncreases, author$project$Tiles$collideWhenYDecreases, author$project$Tiles$collideWhenXIncreases, author$project$Tiles$collideWhenXDecreases]));
var avh4$elm_color$Color$black = A4(avh4$elm_color$Color$RgbaSpace, 0 / 255, 0 / 255, 0 / 255, 1.0);
var avh4$elm_color$Color$grey = A4(avh4$elm_color$Color$RgbaSpace, 211 / 255, 215 / 255, 207 / 255, 1.0);
var elm$core$Basics$pi = _Basics_pi;
var elm$core$Basics$degrees = function (angleInDegrees) {
	return (angleInDegrees * elm$core$Basics$pi) / 180;
};
var author$project$Tiles$crossedStruts = {
	collider: author$project$Tiles$squareObstacle,
	hasCeilingSpace: false,
	id: _Utils_chr('X'),
	isLadder: false,
	jumpDown: false,
	render: A2(
		author$project$TransformTree$Nest,
		_List_Nil,
		_List_fromArray(
			[
				author$project$Svgl$Tree$rect(
				_Utils_update(
					author$project$Svgl$Tree$defaultParams,
					{
						fill: avh4$elm_color$Color$grey,
						h: 0.2,
						rotate: elm$core$Basics$degrees(45),
						stroke: avh4$elm_color$Color$black,
						w: 1.3
					})),
				author$project$Svgl$Tree$rect(
				_Utils_update(
					author$project$Svgl$Tree$defaultParams,
					{
						fill: avh4$elm_color$Color$grey,
						h: 0.2,
						rotate: elm$core$Basics$degrees(-45),
						stroke: avh4$elm_color$Color$black,
						w: 1.3
					})),
				author$project$Svgl$Tree$rect(
				_Utils_update(
					author$project$Svgl$Tree$defaultParams,
					{fill: avh4$elm_color$Color$grey, h: 0.2, stroke: avh4$elm_color$Color$black, y: 0.4})),
				author$project$Svgl$Tree$rect(
				_Utils_update(
					author$project$Svgl$Tree$defaultParams,
					{fill: avh4$elm_color$Color$grey, h: 0.2, stroke: avh4$elm_color$Color$black, y: -0.4}))
			]))
};
var avh4$elm_color$Color$rgb = F3(
	function (r, g, b) {
		return A4(avh4$elm_color$Color$RgbaSpace, r, g, b, 1.0);
	});
var author$project$Tiles$ground = {
	collider: author$project$Tiles$squareObstacle,
	hasCeilingSpace: false,
	id: _Utils_chr('*'),
	isLadder: false,
	jumpDown: false,
	render: A2(
		author$project$TransformTree$Nest,
		_List_Nil,
		_List_fromArray(
			[
				author$project$Svgl$Tree$rect(
				_Utils_update(
					author$project$Svgl$Tree$defaultParams,
					{
						fill: A3(avh4$elm_color$Color$rgb, 0.5, 0.3, 0.2),
						stroke: A3(avh4$elm_color$Color$rgb, 0.2, 0.1, 0.1)
					}))
			]))
};
var author$project$Tiles$ladder = {
	collider: author$project$TileCollision$collideNever,
	hasCeilingSpace: true,
	id: _Utils_chr('H'),
	isLadder: true,
	jumpDown: false,
	render: function () {
		var params = _Utils_update(
			author$project$Svgl$Tree$defaultParams,
			{
				fill: A3(avh4$elm_color$Color$rgb, 0, 0.16, 1),
				stroke: A3(avh4$elm_color$Color$rgb, 0.13, 0.2, 0.5),
				strokeWidth: 1.0e-2
			});
		return A2(
			author$project$TransformTree$Nest,
			_List_Nil,
			_List_fromArray(
				[
					author$project$Svgl$Tree$rect(
					_Utils_update(
						params,
						{h: 0.1, w: 0.8, y: 0.25})),
					author$project$Svgl$Tree$rect(
					_Utils_update(
						params,
						{h: 0.1, w: 0.8, y: 0})),
					author$project$Svgl$Tree$rect(
					_Utils_update(
						params,
						{h: 0.1, w: 0.8, y: -0.25})),
					author$project$Svgl$Tree$rect(
					_Utils_update(
						params,
						{h: 0.1, w: 0.8, y: -0.5})),
					author$project$Svgl$Tree$rect(
					_Utils_update(
						params,
						{w: 0.15, x: -0.35})),
					author$project$Svgl$Tree$rect(
					_Utils_update(
						params,
						{w: 0.15, x: 0.35}))
				]));
	}()
};
var author$project$Tiles$platformThickness = 0.2;
var avh4$elm_color$Color$lightGrey = A4(avh4$elm_color$Color$RgbaSpace, 238 / 255, 238 / 255, 236 / 255, 1.0);
var author$project$Tiles$oneWayPlatform = {
	collider: A2(
		author$project$TileCollision$map,
		function (_n0) {
			return author$project$Tiles$Y(author$project$Tiles$Decreases);
		},
		author$project$TileCollision$flipXY(
			author$project$TileCollision$invertX(
				author$project$TileCollision$collideWhenXIncreases(author$project$Tiles$platformThickness)))),
	hasCeilingSpace: true,
	id: _Utils_chr('-'),
	isLadder: false,
	jumpDown: true,
	render: A2(
		author$project$TransformTree$Nest,
		_List_Nil,
		_List_fromArray(
			[
				author$project$Svgl$Tree$rect(
				_Utils_update(
					author$project$Svgl$Tree$defaultParams,
					{fill: avh4$elm_color$Color$lightGrey, h: author$project$Tiles$platformThickness, stroke: avh4$elm_color$Color$grey, y: 0.5 - (author$project$Tiles$platformThickness / 2)}))
			]))
};
var author$project$Tiles$rivetedBlocker = {
	collider: author$project$Tiles$squareObstacle,
	hasCeilingSpace: false,
	id: _Utils_chr('#'),
	isLadder: false,
	jumpDown: false,
	render: function () {
		var re = _Utils_update(
			author$project$Svgl$Tree$defaultParams,
			{fill: avh4$elm_color$Color$grey, stroke: avh4$elm_color$Color$lightGrey});
		var o = 0.37;
		var ell = _Utils_update(
			author$project$Svgl$Tree$defaultParams,
			{fill: avh4$elm_color$Color$lightGrey, h: 0.1, strokeWidth: 0, w: 0.1});
		return A2(
			author$project$TransformTree$Nest,
			_List_Nil,
			_List_fromArray(
				[
					author$project$Svgl$Tree$rect(re),
					author$project$Svgl$Tree$ellipse(
					_Utils_update(
						ell,
						{x: -o, y: -o})),
					author$project$Svgl$Tree$ellipse(
					_Utils_update(
						ell,
						{x: o, y: -o})),
					author$project$Svgl$Tree$ellipse(
					_Utils_update(
						ell,
						{x: o, y: o})),
					author$project$Svgl$Tree$ellipse(
					_Utils_update(
						ell,
						{x: -o, y: o}))
				]));
	}()
};
var avh4$elm_color$Color$red = A4(avh4$elm_color$Color$RgbaSpace, 204 / 255, 0 / 255, 0 / 255, 1.0);
var avh4$elm_color$Color$white = A4(avh4$elm_color$Color$RgbaSpace, 255 / 255, 255 / 255, 255 / 255, 1.0);
var author$project$Tiles$transparentBlocker = {
	collider: author$project$Tiles$squareObstacle,
	hasCeilingSpace: false,
	id: _Utils_chr('\''),
	isLadder: false,
	jumpDown: false,
	render: author$project$Svgl$Tree$rect(
		_Utils_update(
			author$project$Svgl$Tree$defaultParams,
			{fill: avh4$elm_color$Color$white, opacity: 0.5, stroke: avh4$elm_color$Color$red}))
};
var author$project$Tiles$foregroundTilesById = A3(
	elm$core$List$foldl,
	F2(
		function (tile, accum) {
			return A3(elm$core$Dict$insert, tile.id, tile, accum);
		}),
	elm$core$Dict$empty,
	_List_fromArray(
		[author$project$Tiles$foregroundNone, author$project$Tiles$transparentBlocker, author$project$Tiles$rivetedBlocker, author$project$Tiles$oneWayPlatform, author$project$Tiles$crossedStruts, author$project$Tiles$ground, author$project$Tiles$ladder]));
var author$project$Tiles$idToForegroundTile = function (id) {
	return A2(
		elm$core$Maybe$withDefault,
		author$project$Tiles$foregroundNone,
		A2(elm$core$Dict$get, id, author$project$Tiles$foregroundTilesById));
};
var elm$core$List$maximum = function (list) {
	if (list.b) {
		var x = list.a;
		var xs = list.b;
		return elm$core$Maybe$Just(
			A3(elm$core$List$foldl, elm$core$Basics$max, x, xs));
	} else {
		return elm$core$Maybe$Nothing;
	}
};
var elm$core$String$length = _String_length;
var author$project$Map$define = function (raw) {
	return {
		pois: raw.pois,
		set: function (game) {
			return _Utils_update(
				game,
				{
					mapBackgroundTiles: A2(author$project$Map$stringToTiles, author$project$Tiles$idToBackgroundTile, raw.background),
					mapForegroundTiles: A2(author$project$Map$stringToTiles, author$project$Tiles$idToForegroundTile, raw.foreground),
					mapHeight: elm$core$List$length(raw.foreground),
					mapWidth: A2(
						elm$core$Maybe$withDefault,
						1,
						elm$core$List$maximum(
							A2(elm$core$List$map, elm$core$String$length, raw.foreground)))
				});
		}
	};
};
var author$project$Maps$Intro$map = author$project$Map$define(
	{
		background: _List_fromArray(
			['    #####################################################################', '    #####################################################################', '    ##########################   ########################################', '    ##########################   ########################################', '    ###########   ############3  ########################################', '    ###########   #######################################################', '    ###########3  #######################################################', '    #####################################################################', '    #####################################################################', '    ##########################################################          X', '    #####################################################################']),
		foreground: _List_fromArray(
			['    #####################################################################', '    #                                                         ###########', '    #                                                         ###########', '    #                             [    ]                      ###########', '    #        [                                         [    ] ###########', '    #                                                         ###########', '    #                                                         ###########', '    #                                      X                  ###########', '    #  D  1                               XXX                 ###########', '    #  D  1                       X      X###                           X', '    #####################################################################']),
		pois: {
			exit: {x: 70.95674300254453, y: 0.9287531806615763},
			learnToCrawl: {x: 57.27226463104326, y: 5.559796437659032},
			learnToJump: {x: 29.918575063613233, y: 6.653944020356234},
			learnToMove: {x: 15.465648854961831, y: 6.195928753180661},
			startingPosition: {x: 6.4325699745547045, y: 1.5394402035623407}
		}
	});
var author$project$Missions$Intro$map = author$project$Maps$Intro$map;
var author$project$Game$WrapFunction = function (a) {
	return {$: 'WrapFunction', a: a};
};
var author$project$Game$uLater = F4(
	function (delay, f, env, game) {
		return author$project$Game$noOut(
			_Utils_update(
				game,
				{
					laters: A2(
						elm$core$List$cons,
						_Utils_Tuple2(
							game.time + delay,
							author$project$Game$WrapFunction(f)),
						game.laters)
				}));
	});
var author$project$Game$uList = F3(
	function (fs, env, game) {
		var fold = F2(
			function (f, _n0) {
				var w = _n0.a;
				var os = _n0.b;
				return A2(
					elm$core$Tuple$mapSecond,
					function (o) {
						return A2(elm$core$List$cons, o, os);
					},
					A2(f, env, w));
			});
		return A2(
			elm$core$Tuple$mapSecond,
			author$project$Game$OutcomeList,
			A3(
				elm$core$List$foldl,
				fold,
				_Utils_Tuple2(game, _List_Nil),
				fs));
	});
var author$project$SpeechBubble$defaultDuration = function (content) {
	return 3.0 + (0.1 * elm$core$String$length(content));
};
var author$project$Game$OutcomeQueryWidth = function (a) {
	return {$: 'OutcomeQueryWidth', a: a};
};
var author$project$Components$Bool_ = function (a) {
	return {$: 'Bool_', a: a};
};
var author$project$Components$bool = F3(
	function (namespace, name, _default) {
		var key = namespace + ('/' + name);
		var set = F2(
			function (v, e) {
				return _Utils_update(
					e,
					{
						components: A3(
							elm$core$Dict$insert,
							key,
							author$project$Components$Bool_(v),
							e.components)
					});
			});
		var get = function (e) {
			var _n0 = A2(elm$core$Dict$get, key, e.components);
			if ((_n0.$ === 'Just') && (_n0.a.$ === 'Bool_')) {
				var f = _n0.a.a;
				return f;
			} else {
				return _default;
			}
		};
		return {get: get, set: set};
	});
var author$project$Components$Float_ = function (a) {
	return {$: 'Float_', a: a};
};
var author$project$Components$float = F3(
	function (namespace, name, _default) {
		var key = namespace + ('/' + name);
		var set = F2(
			function (v, e) {
				return _Utils_update(
					e,
					{
						components: A3(
							elm$core$Dict$insert,
							key,
							author$project$Components$Float_(v),
							e.components)
					});
			});
		var get = function (e) {
			var _n0 = A2(elm$core$Dict$get, key, e.components);
			if ((_n0.$ === 'Just') && (_n0.a.$ === 'Float_')) {
				var f = _n0.a.a;
				return f;
			} else {
				return _default;
			}
		};
		return {get: get, set: set};
	});
var author$project$Components$Int_ = function (a) {
	return {$: 'Int_', a: a};
};
var author$project$Components$int = F3(
	function (namespace, name, _default) {
		var key = namespace + ('/' + name);
		var set = F2(
			function (v, e) {
				return _Utils_update(
					e,
					{
						components: A3(
							elm$core$Dict$insert,
							key,
							author$project$Components$Int_(v),
							e.components)
					});
			});
		var get = function (e) {
			var _n0 = A2(elm$core$Dict$get, key, e.components);
			if ((_n0.$ === 'Just') && (_n0.a.$ === 'Int_')) {
				var f = _n0.a.a;
				return f;
			} else {
				return _default;
			}
		};
		return {get: get, set: set};
	});
var author$project$Components$PlayerActionState = function (a) {
	return {$: 'PlayerActionState', a: a};
};
var author$project$Components$playerActionState = F3(
	function (namespace, name, _default) {
		var key = namespace + ('/' + name);
		var set = F2(
			function (v, e) {
				return _Utils_update(
					e,
					{
						components: A3(
							elm$core$Dict$insert,
							key,
							author$project$Components$PlayerActionState(v),
							e.components)
					});
			});
		var get = function (e) {
			var _n0 = A2(elm$core$Dict$get, key, e.components);
			if ((_n0.$ === 'Just') && (_n0.a.$ === 'PlayerActionState')) {
				var f = _n0.a.a;
				return f;
			} else {
				return _default;
			}
		};
		return {get: get, set: set};
	});
var author$project$Components$Seconds_ = function (a) {
	return {$: 'Seconds_', a: a};
};
var author$project$Components$seconds = F3(
	function (namespace, name, _default) {
		var key = namespace + ('/' + name);
		var set = F2(
			function (v, e) {
				return _Utils_update(
					e,
					{
						components: A3(
							elm$core$Dict$insert,
							key,
							author$project$Components$Seconds_(v),
							e.components)
					});
			});
		var get = function (e) {
			var _n0 = A2(elm$core$Dict$get, key, e.components);
			if ((_n0.$ === 'Just') && (_n0.a.$ === 'Seconds_')) {
				var f = _n0.a.a;
				return f;
			} else {
				return _default;
			}
		};
		return {get: get, set: set};
	});
var author$project$Components$Vector_ = function (a) {
	return {$: 'Vector_', a: a};
};
var author$project$Components$vector = F3(
	function (namespace, name, _default) {
		var key = namespace + ('/' + name);
		var set = F2(
			function (v, e) {
				return _Utils_update(
					e,
					{
						components: A3(
							elm$core$Dict$insert,
							key,
							author$project$Components$Vector_(v),
							e.components)
					});
			});
		var get = function (e) {
			var _n0 = A2(elm$core$Dict$get, key, e.components);
			if ((_n0.$ === 'Just') && (_n0.a.$ === 'Vector_')) {
				var f = _n0.a.a;
				return f;
			} else {
				return _default;
			}
		};
		return {get: get, set: set};
	});
var author$project$Components$componentNamespace = function (namespace) {
	return {
		bool: author$project$Components$bool(namespace),
		_float: author$project$Components$float(namespace),
		_int: author$project$Components$int(namespace),
		playerActionState: author$project$Components$playerActionState(namespace),
		seconds: author$project$Components$seconds(namespace),
		vector: author$project$Components$vector(namespace)
	};
};
var author$project$Game$componentNamespace = author$project$Components$componentNamespace;
var author$project$SpeechBubble$component = author$project$Game$componentNamespace('bubble');
var author$project$SpeechBubble$cTextWidth = A2(author$project$SpeechBubble$component._float, 'textWidth', 0);
var author$project$SpeechBubble$queryTextWidth = F4(
	function (env, maybeParent, game, entity) {
		return (!author$project$SpeechBubble$cTextWidth.get(entity)) ? _Utils_Tuple3(
			entity,
			game,
			author$project$Game$OutcomeQueryWidth(entity.id)) : _Utils_Tuple3(entity, game, author$project$Game$OutcomeNone);
	});
var elm$svg$Svg$Attributes$transform = _VirtualDom_attribute('transform');
var elm_explorations$linear_algebra$Math$Matrix4$toRecord = _MJS_m4x4toRecord;
var author$project$Viewport$Combine$transform = function (mat4) {
	var m = elm_explorations$linear_algebra$Math$Matrix4$toRecord(mat4);
	var f = m.m24;
	var e = m.m14;
	var d = m.m22;
	var c = m.m12;
	var b = m.m21;
	var a = m.m11;
	var values = A2(
		elm$core$List$map,
		elm$core$String$fromFloat,
		_List_fromArray(
			[a, b, c, d, e, f]));
	return elm$svg$Svg$Attributes$transform(
		'matrix(' + (A2(elm$core$String$join, ',', values) + ')'));
};
var elm$svg$Svg$g = elm$svg$Svg$trustedNode('g');
var elm$svg$Svg$path = elm$svg$Svg$trustedNode('path');
var elm$virtual_dom$VirtualDom$text = _VirtualDom_text;
var elm$svg$Svg$text = elm$virtual_dom$VirtualDom$text;
var elm$svg$Svg$text_ = elm$svg$Svg$trustedNode('text');
var elm$svg$Svg$Attributes$class = _VirtualDom_attribute('class');
var elm$svg$Svg$Attributes$d = _VirtualDom_attribute('d');
var elm$svg$Svg$Attributes$fontSize = _VirtualDom_attribute('font-size');
var elm$svg$Svg$Attributes$id = _VirtualDom_attribute('id');
var elm$svg$Svg$Attributes$stroke = _VirtualDom_attribute('stroke');
var elm$svg$Svg$Attributes$strokeWidth = _VirtualDom_attribute('stroke-width');
var elm$svg$Svg$Attributes$textLength = _VirtualDom_attribute('textLength');
var elm_explorations$linear_algebra$Math$Matrix4$translate3 = _MJS_m4x4translate3;
var author$project$SpeechBubble$render = F4(
	function (args, env, game, entity) {
		var textWidthAsRatio = author$project$SpeechBubble$cTextWidth.get(entity);
		var textW = textWidthAsRatio * env.visibleWorldSize.width;
		var margin = 0.5;
		var bubbleW = (2 * margin) + textW;
		var bubbleH = (2 * margin) + 0.6;
		var _n0 = function () {
			if (args.offscreen) {
				var marginFromTop = 1.0;
				var yOffset = ((env.visibleWorldSize.height / 2) - marginFromTop) - (bubbleH / 2);
				return {
					offset: A3(elm_explorations$linear_algebra$Math$Matrix4$translate3, game.cameraPosition.x, game.cameraPosition.y + yOffset, 0),
					path: _List_fromArray(
						[
							'M ' + (elm$core$String$fromFloat(bubbleW / (-2)) + (' ' + elm$core$String$fromFloat(bubbleH / (-2)))),
							'v ' + elm$core$String$fromFloat(bubbleH),
							'h ' + elm$core$String$fromFloat(bubbleW),
							'v ' + elm$core$String$fromFloat(-bubbleH),
							'z'
						]),
					textX: elm$core$String$fromFloat(((-bubbleW) / 2) + 0.5),
					textY: elm$core$String$fromFloat((bubbleH / 2) - 0.5)
				};
			} else {
				var yOffset = 1.5;
				var xOffset = 0.3;
				return {
					offset: A3(elm_explorations$linear_algebra$Math$Matrix4$translate3, entity.absolutePosition.x + xOffset, entity.absolutePosition.y + yOffset, 0),
					path: _List_fromArray(
						[
							'M 0 0',
							'v 1',
							'h -2',
							'v ' + elm$core$String$fromFloat(bubbleH),
							'h ' + elm$core$String$fromFloat(bubbleW),
							'v ' + elm$core$String$fromFloat(-bubbleH),
							'L 0.5 1',
							'z'
						]),
					textX: '-1.5',
					textY: '-1.5'
				};
			}
		}();
		var path = _n0.path;
		var offset = _n0.offset;
		var textX = _n0.textX;
		var textY = _n0.textY;
		return A2(
			author$project$Game$RenderableSvg,
			2,
			A2(
				elm$svg$Svg$g,
				_List_fromArray(
					[
						author$project$Viewport$Combine$transform(
						offset(env.worldToCamera)),
						(!textW) ? elm$svg$Svg$Attributes$opacity('0') : elm$svg$Svg$Attributes$class('')
					]),
				_List_fromArray(
					[
						A2(
						elm$svg$Svg$path,
						_List_fromArray(
							[
								elm$svg$Svg$Attributes$d(
								A2(elm$core$String$join, ' ', path)),
								elm$svg$Svg$Attributes$fill('white'),
								elm$svg$Svg$Attributes$stroke('black'),
								elm$svg$Svg$Attributes$strokeWidth('0.1')
							]),
						_List_Nil),
						A2(
						elm$svg$Svg$text_,
						_List_fromArray(
							[
								elm$svg$Svg$Attributes$class('speech-baloon'),
								elm$svg$Svg$Attributes$id(
								elm$core$String$fromInt(entity.id)),
								elm$svg$Svg$Attributes$transform('scale(1, -1)'),
								elm$svg$Svg$Attributes$x(textX),
								elm$svg$Svg$Attributes$y(textY),
								elm$svg$Svg$Attributes$fontSize('1'),
								textW ? elm$svg$Svg$Attributes$textLength(
								elm$core$String$fromFloat(textW)) : elm$svg$Svg$Attributes$class('')
							]),
						_List_fromArray(
							[
								elm$svg$Svg$text(args.content)
							]))
					])));
	});
var author$project$SpeechBubble$uNew = F3(
	function (maybeParentId, content, onDone) {
		var args = {
			content: content,
			offscreen: _Utils_eq(maybeParentId, elm$core$Maybe$Nothing)
		};
		var init = F4(
			function (env, _n0, game, entity) {
				return author$project$Game$toTriple(
					_Utils_Tuple2(
						A2(
							author$project$Game$appendEntityUpdateFunctions,
							_List_fromArray(
								[author$project$SpeechBubble$queryTextWidth]),
							A2(
								author$project$Game$appendRenderFunctions,
								_List_fromArray(
									[
										author$project$SpeechBubble$render(args)
									]),
								entity)),
						A4(
							author$project$Game$uLater,
							author$project$SpeechBubble$defaultDuration(content),
							author$project$Game$uList(
								_List_fromArray(
									[
										author$project$Game$uDeleteEntity(entity.id),
										onDone
									])),
							env,
							game)));
			});
		return A2(
			author$project$Game$uNewEntity,
			maybeParentId,
			_List_fromArray(
				[init]));
	});
var author$project$Missions$Intro$odenSays = F3(
	function (delay, content, onDone) {
		return A2(
			author$project$Game$uLater,
			delay,
			F2(
				function (env, game) {
					return A5(
						author$project$SpeechBubble$uNew,
						elm$core$Maybe$Just(game.playerId),
						content,
						onDone,
						env,
						game);
				}));
	});
var author$project$Missions$Intro$uSeries = F3(
	function (chainableFunctions, env, game) {
		if (!chainableFunctions.b) {
			return author$project$Game$noOut(game);
		} else {
			var f = chainableFunctions.a;
			var fs = chainableFunctions.b;
			return A3(
				f,
				author$project$Missions$Intro$uSeries(fs),
				env,
				game);
		}
	});
var author$project$Missions$Intro$zaneSays = F3(
	function (delay, content, onDone) {
		return A2(
			author$project$Game$uLater,
			delay,
			A3(author$project$SpeechBubble$uNew, elm$core$Maybe$Nothing, content, onDone));
	});
var author$project$Game$gravity = 40.0;
var author$project$Vector$sub = F2(
	function (a, b) {
		return {x: a.x - b.x, y: a.y - b.y};
	});
var author$project$Game$setVelocitiesFromAbsolute = F3(
	function (maybeParent, absoluteVelocity, entity) {
		if (maybeParent.$ === 'Nothing') {
			return _Utils_update(
				entity,
				{absoluteVelocity: absoluteVelocity, relativeVelocity: absoluteVelocity});
		} else {
			var parent = maybeParent.a.a;
			return _Utils_update(
				entity,
				{
					absoluteVelocity: absoluteVelocity,
					relativeVelocity: A2(author$project$Vector$sub, absoluteVelocity, parent.absoluteVelocity)
				});
		}
	});
var author$project$EntityMain$applyGravity = F4(
	function (env, maybeParent, game, entity) {
		var absoluteVelocity = A2(
			author$project$Vector$add,
			entity.absoluteVelocity,
			{x: 0, y: (-author$project$Game$gravity) * env.dt});
		return A2(
			author$project$Game$entityOnly,
			game,
			A3(author$project$Game$setVelocitiesFromAbsolute, maybeParent, absoluteVelocity, entity));
	});
var elm$core$Array$bitMask = 4294967295 >>> (32 - elm$core$Array$shiftStep);
var elm$core$Bitwise$and = _Bitwise_and;
var elm$core$Elm$JsArray$unsafeGet = _JsArray_unsafeGet;
var elm$core$Array$getHelp = F3(
	function (shift, index, tree) {
		getHelp:
		while (true) {
			var pos = elm$core$Array$bitMask & (index >>> shift);
			var _n0 = A2(elm$core$Elm$JsArray$unsafeGet, pos, tree);
			if (_n0.$ === 'SubTree') {
				var subTree = _n0.a;
				var $temp$shift = shift - elm$core$Array$shiftStep,
					$temp$index = index,
					$temp$tree = subTree;
				shift = $temp$shift;
				index = $temp$index;
				tree = $temp$tree;
				continue getHelp;
			} else {
				var values = _n0.a;
				return A2(elm$core$Elm$JsArray$unsafeGet, elm$core$Array$bitMask & index, values);
			}
		}
	});
var elm$core$Bitwise$shiftLeftBy = _Bitwise_shiftLeftBy;
var elm$core$Array$tailIndex = function (len) {
	return (len >>> 5) << 5;
};
var elm$core$Array$get = F2(
	function (index, _n0) {
		var len = _n0.a;
		var startShift = _n0.b;
		var tree = _n0.c;
		var tail = _n0.d;
		return ((index < 0) || (_Utils_cmp(index, len) > -1)) ? elm$core$Maybe$Nothing : ((_Utils_cmp(
			index,
			elm$core$Array$tailIndex(len)) > -1) ? elm$core$Maybe$Just(
			A2(elm$core$Elm$JsArray$unsafeGet, elm$core$Array$bitMask & index, tail)) : elm$core$Maybe$Just(
			A3(elm$core$Array$getHelp, startShift, index, tree)));
	});
var author$project$Game$getForegroundTile = F2(
	function (game, _n0) {
		var row = _n0.row;
		var column = _n0.column;
		var _n1 = A2(elm$core$Array$get, column + (((game.mapHeight - row) - 1) * game.mapWidth), game.mapForegroundTiles);
		if (_n1.$ === 'Just') {
			var tile = _n1.a;
			return tile;
		} else {
			return author$project$Tiles$foregroundNone;
		}
	});
var author$project$Game$setPositionsFromAbsolute = F3(
	function (maybeParent, absolutePosition, entity) {
		if (maybeParent.$ === 'Nothing') {
			return _Utils_update(
				entity,
				{absolutePosition: absolutePosition, relativePosition: absolutePosition});
		} else {
			var parent = maybeParent.a.a;
			return _Utils_update(
				entity,
				{
					absolutePosition: absolutePosition,
					relativePosition: A2(author$project$Vector$sub, absolutePosition, parent.absolutePosition)
				});
		}
	});
var author$project$TileCollision$tileSub = F2(
	function (tile, vec) {
		return {x: vec.x - tile.column, y: vec.y - tile.row};
	});
var author$project$TileCollision$absoluteToRelativeTrajectory = F2(
	function (tile, trajectory) {
		return {
			halfHeight: trajectory.height / 2,
			halfWidth: trajectory.width / 2,
			relativeEnd: A2(author$project$TileCollision$tileSub, tile, trajectory.end),
			relativeStart: A2(author$project$TileCollision$tileSub, tile, trajectory.start)
		};
	});
var author$project$TileCollision$tileAdd = F2(
	function (tile, vec) {
		return {x: vec.x + tile.column, y: vec.y + tile.row};
	});
var author$project$TileCollision$relativeToAbsoluteCollision = function (relative) {
	return _Utils_update(
		relative,
		{
			aabbPositionAtImpact: A2(author$project$TileCollision$tileAdd, relative.tile, relative.aabbPositionAtImpact),
			fix: A2(author$project$TileCollision$tileAdd, relative.tile, relative.fix),
			impactPoint: A2(author$project$TileCollision$tileAdd, relative.tile, relative.impactPoint)
		});
};
var elm$core$Basics$round = _Basics_round;
var author$project$TileCollision$coordinateToTile = elm$core$Basics$round;
var author$project$TileCollision$tileRange = F3(
	function (start, end, half) {
		return (_Utils_cmp(start, end) < 0) ? A2(
			elm$core$List$range,
			author$project$TileCollision$coordinateToTile(start - half),
			author$project$TileCollision$coordinateToTile(end + half)) : A2(
			elm$core$List$range,
			author$project$TileCollision$coordinateToTile(end - half),
			author$project$TileCollision$coordinateToTile(start + half));
	});
var elm$core$List$append = F2(
	function (xs, ys) {
		if (!ys.b) {
			return xs;
		} else {
			return A3(elm$core$List$foldr, elm$core$List$cons, ys, xs);
		}
	});
var elm$core$List$concat = function (lists) {
	return A3(elm$core$List$foldr, elm$core$List$append, _List_Nil, lists);
};
var elm$core$List$concatMap = F2(
	function (f, list) {
		return elm$core$List$concat(
			A2(elm$core$List$map, f, list));
	});
var elm_community$list_extra$List$Extra$andThen = elm$core$List$concatMap;
var elm_community$list_extra$List$Extra$lift2 = F3(
	function (f, la, lb) {
		return A2(
			elm_community$list_extra$List$Extra$andThen,
			function (a) {
				return A2(
					elm_community$list_extra$List$Extra$andThen,
					function (b) {
						return _List_fromArray(
							[
								A2(f, a, b)
							]);
					},
					lb);
			},
			la);
	});
var author$project$TileCollision$sweep = function (_n0) {
	var start = _n0.start;
	var end = _n0.end;
	var width = _n0.width;
	var height = _n0.height;
	return A3(
		elm_community$list_extra$List$Extra$lift2,
		F2(
			function (x, y) {
				return {column: x, row: y};
			}),
		A3(author$project$TileCollision$tileRange, start.x, end.x, width / 2),
		A3(author$project$TileCollision$tileRange, start.y, end.y, height / 2));
};
var author$project$TileCollision$recursiveCollide = F3(
	function (getCollider, trajectory, pairs) {
		recursiveCollide:
		while (true) {
			var testCollision = function (tile) {
				return A2(
					elm$core$Maybe$map,
					function (collision) {
						return _Utils_update(
							collision,
							{tile: tile});
					},
					A2(
						getCollider,
						tile,
						A2(author$project$TileCollision$absoluteToRelativeTrajectory, tile, trajectory)));
			};
			var maybeCollision = A2(
				elm$core$Maybe$map,
				author$project$TileCollision$relativeToAbsoluteCollision,
				A2(
					elm_community$list_extra$List$Extra$minimumBy,
					function ($) {
						return $.distanceSquared;
					},
					A2(
						elm$core$List$filterMap,
						testCollision,
						author$project$TileCollision$sweep(trajectory))));
			if (maybeCollision.$ === 'Nothing') {
				return pairs;
			} else {
				var collision = maybeCollision.a;
				if (elm$core$List$length(pairs) > 10) {
					return A2(elm$core$List$cons, collision, pairs);
				} else {
					var $temp$getCollider = getCollider,
						$temp$trajectory = _Utils_update(
						trajectory,
						{end: collision.fix}),
						$temp$pairs = A2(elm$core$List$cons, collision, pairs);
					getCollider = $temp$getCollider;
					trajectory = $temp$trajectory;
					pairs = $temp$pairs;
					continue recursiveCollide;
				}
			}
		}
	});
var author$project$TileCollision$collide = F2(
	function (getCollider, trajectory) {
		return A3(author$project$TileCollision$recursiveCollide, getCollider, trajectory, _List_Nil);
	});
var author$project$Tiles$fixSpeed = F2(
	function (collisions, speed) {
		var sp = F2(
			function (collision, v) {
				var _n0 = collision.geometry;
				if (_n0.$ === 'X') {
					if (_n0.a.$ === 'Increases') {
						var _n1 = _n0.a;
						return _Utils_update(
							v,
							{
								x: A2(elm$core$Basics$min, 0, v.x)
							});
					} else {
						var _n2 = _n0.a;
						return _Utils_update(
							v,
							{
								x: A2(elm$core$Basics$max, 0, v.x)
							});
					}
				} else {
					if (_n0.a.$ === 'Increases') {
						var _n3 = _n0.a;
						return _Utils_update(
							v,
							{
								y: A2(elm$core$Basics$min, 0, v.y)
							});
					} else {
						var _n4 = _n0.a;
						return _Utils_update(
							v,
							{
								y: A2(elm$core$Basics$max, 0, v.y)
							});
					}
				}
			});
		return A3(elm$core$List$foldl, sp, speed, collisions);
	});
var author$project$Vector$scale = F2(
	function (l, v) {
		return {x: v.x * l, y: v.y * l};
	});
var author$project$EntityMain$moveCollideAndSlide = F4(
	function (env, maybeParent, game, entity) {
		var idealAbsolutePosition = A2(
			author$project$Vector$add,
			entity.absolutePosition,
			A2(author$project$Vector$scale, env.dt, entity.absoluteVelocity));
		var collisions = A2(
			author$project$TileCollision$collide,
			A2(
				elm$core$Basics$composeR,
				author$project$Game$getForegroundTile(game),
				function ($) {
					return $.collider;
				}),
			{end: idealAbsolutePosition, height: entity.size.height, start: entity.absolutePosition, width: entity.size.width});
		var fixedAbsolutePosition = function () {
			if (!collisions.b) {
				return idealAbsolutePosition;
			} else {
				var collision = collisions.a;
				var cs = collisions.b;
				return collision.fix;
			}
		}();
		var fixedAbsoluteVelocity = A2(author$project$Tiles$fixSpeed, collisions, entity.absoluteVelocity);
		return A2(
			author$project$Game$entityOnly,
			game,
			A3(
				author$project$Game$setVelocitiesFromAbsolute,
				maybeParent,
				fixedAbsoluteVelocity,
				A3(
					author$project$Game$setPositionsFromAbsolute,
					maybeParent,
					fixedAbsolutePosition,
					_Utils_update(
						entity,
						{tileCollisions: collisions}))));
	});
var author$project$Game$setVelocitiesFromRelative = F3(
	function (maybeParent, relativeVelocity, entity) {
		if (maybeParent.$ === 'Nothing') {
			return _Utils_update(
				entity,
				{absoluteVelocity: relativeVelocity, relativeVelocity: relativeVelocity});
		} else {
			var parent = maybeParent.a.a;
			return _Utils_update(
				entity,
				{
					absoluteVelocity: A2(author$project$Vector$add, relativeVelocity, parent.absoluteVelocity),
					relativeVelocity: relativeVelocity
				});
		}
	});
var author$project$Player$Climbing = {$: 'Climbing'};
var author$project$Player$Crawl = {$: 'Crawl'};
var author$project$Player$CrouchIdle = {$: 'CrouchIdle'};
var author$project$Player$InTheAir = {$: 'InTheAir'};
var author$project$Player$Run = {$: 'Run'};
var author$project$Player$Slide = {$: 'Slide'};
var author$project$Player$StandIdle = {$: 'StandIdle'};
var author$project$Player$Zapped = {$: 'Zapped'};
var author$project$PlayerMain$airHorizontalFriction = 3;
var author$project$PlayerMain$airWalkingSpeed = 9;
var author$project$PlayerMain$component = author$project$Game$componentNamespace('player');
var author$project$PlayerMain$cState = function () {
	var c = A2(author$project$PlayerMain$component.playerActionState, 'actionState', author$project$Player$StandIdle);
	var set = F3(
		function (game, state, e) {
			return A2(
				c.set,
				state,
				_Utils_eq(
					state,
					c.get(e)) ? e : _Utils_update(
					e,
					{animationStart: game.time}));
		});
	return {get: c.get, set: set};
}();
var elm$core$List$any = F2(
	function (isOkay, list) {
		any:
		while (true) {
			if (!list.b) {
				return false;
			} else {
				var x = list.a;
				var xs = list.b;
				if (isOkay(x)) {
					return true;
				} else {
					var $temp$isOkay = isOkay,
						$temp$list = xs;
					isOkay = $temp$isOkay;
					list = $temp$list;
					continue any;
				}
			}
		}
	});
var author$project$PlayerMain$canReachLadder = F2(
	function (game, entity) {
		return A2(
			elm$core$List$any,
			A2(
				elm$core$Basics$composeR,
				author$project$Game$getForegroundTile(game),
				function ($) {
					return $.isLadder;
				}),
			author$project$TileCollision$sweep(
				{end: entity.absolutePosition, height: entity.size.height, start: entity.absolutePosition, width: entity.size.width}));
	});
var author$project$PlayerMain$size = {height: 1.9, width: 0.8};
var elm$core$Basics$composeL = F3(
	function (g, f, x) {
		return g(
			f(x));
	});
var elm$core$Basics$not = _Basics_not;
var elm$core$List$all = F2(
	function (isOkay, list) {
		return !A2(
			elm$core$List$any,
			A2(elm$core$Basics$composeL, elm$core$Basics$not, isOkay),
			list);
	});
var author$project$PlayerMain$ceilingHasSpace = F2(
	function (game, entity) {
		var startPosition = entity.absolutePosition;
		var endPosition = _Utils_update(
			startPosition,
			{y: startPosition.y + ((author$project$PlayerMain$size.height - entity.size.height) / 2)});
		var collisions = A2(
			author$project$TileCollision$collide,
			A2(
				elm$core$Basics$composeR,
				author$project$Game$getForegroundTile(game),
				function ($) {
					return $.collider;
				}),
			{end: endPosition, height: entity.size.height, start: startPosition, width: entity.size.width});
		return A2(
			elm$core$List$all,
			function (collision) {
				return !_Utils_eq(
					collision.geometry,
					author$project$Tiles$Y(author$project$Tiles$Increases));
			},
			collisions);
	});
var author$project$PlayerMain$climbingSpeed = 5;
var author$project$PlayerMain$crawlingSpeed = 4;
var author$project$Game$coordinateToTile = author$project$TileCollision$coordinateToTile;
var elm_community$list_extra$List$Extra$find = F2(
	function (predicate, list) {
		find:
		while (true) {
			if (!list.b) {
				return elm$core$Maybe$Nothing;
			} else {
				var first = list.a;
				var rest = list.b;
				if (predicate(first)) {
					return elm$core$Maybe$Just(first);
				} else {
					var $temp$predicate = predicate,
						$temp$list = rest;
					predicate = $temp$predicate;
					list = $temp$list;
					continue find;
				}
			}
		}
	});
var author$project$PlayerMain$floorAllowsJumpDown = F2(
	function (game, entity) {
		var _n0 = A2(
			elm_community$list_extra$List$Extra$find,
			function (collision) {
				return _Utils_eq(
					collision.geometry,
					author$project$Tiles$Y(author$project$Tiles$Decreases));
			},
			entity.tileCollisions);
		if (_n0.$ === 'Nothing') {
			return false;
		} else {
			var collision = _n0.a;
			return A2(
				author$project$Game$getForegroundTile,
				game,
				{
					column: author$project$Game$coordinateToTile(entity.absolutePosition.x),
					row: collision.tile.row
				}).jumpDown;
		}
	});
var author$project$PlayerMain$isOnFloor = F2(
	function (game, entity) {
		return A2(
			elm$core$List$any,
			function (collision) {
				return _Utils_eq(
					collision.geometry,
					author$project$Tiles$Y(author$project$Tiles$Decreases));
			},
			entity.tileCollisions);
	});
var author$project$PlayerMain$jumpMaxHeightWithoutBoost = 1 + 0.2;
var elm$core$Basics$sqrt = _Basics_sqrt;
var author$project$PlayerMain$jumpInitialSpeed = elm$core$Basics$sqrt((2 * author$project$Game$gravity) * author$project$PlayerMain$jumpMaxHeightWithoutBoost);
var author$project$PlayerMain$jumpMaxHeightWithBoost = 2 + 0.3;
var author$project$PlayerMain$jumpBoostTime = (author$project$PlayerMain$jumpMaxHeightWithBoost - author$project$PlayerMain$jumpMaxHeightWithoutBoost) / author$project$PlayerMain$jumpInitialSpeed;
var author$project$PlayerMain$resizeSpeed = 10;
var author$project$PlayerMain$runningSpeed = 10;
var author$project$PlayerMain$slideFriction = 0.4;
var author$project$PlayerMain$zapDuration = 0.6;
var author$project$Vector$length = function (v) {
	return elm$core$Basics$sqrt((v.x * v.x) + (v.y * v.y));
};
var author$project$Vector$normalize = function (v) {
	return _Utils_eq(v, author$project$Vector$origin) ? v : A2(
		author$project$Vector$scale,
		1 / author$project$Vector$length(v),
		v);
};
var elm$core$Basics$abs = function (n) {
	return (n < 0) ? (-n) : n;
};
var elm$core$List$member = F2(
	function (x, xs) {
		return A2(
			elm$core$List$any,
			function (a) {
				return _Utils_eq(a, x);
			},
			xs);
	});
var author$project$PlayerMain$inputMovement = F4(
	function (env, maybeParent, game, entity) {
		var onFloor = A2(author$project$PlayerMain$isOnFloor, game, entity);
		var oldVelocity = entity.relativeVelocity;
		var oldState = author$project$PlayerMain$cState.get(entity);
		var oldPosition = entity.relativePosition;
		var inputJumpDown = env.inputHoldCrouch && env.inputClickJump;
		var flipX = _Utils_eq(env.inputHoldHorizontalMove, -1) ? true : ((env.inputHoldHorizontalMove === 1) ? false : entity.flipX);
		var doJumpDown = onFloor && (inputJumpDown && A2(author$project$PlayerMain$floorAllowsJumpDown, game, entity));
		var yOffsetDueToJumpDown = doJumpDown ? ((0 - author$project$Tiles$platformThickness) - 1.0e-2) : 0;
		var canClimb = A2(author$project$PlayerMain$canReachLadder, game, entity);
		var newState = (_Utils_eq(oldState, author$project$Player$Zapped) && (_Utils_cmp(game.time - entity.animationStart, author$project$PlayerMain$zapDuration) < 0)) ? author$project$Player$Zapped : ((_Utils_eq(oldState, author$project$Player$Climbing) && (!canClimb)) ? author$project$Player$InTheAir : ((env.inputHoldUp && canClimb) ? author$project$Player$Climbing : ((!onFloor) ? (((!_Utils_eq(oldState, author$project$Player$Climbing)) || env.inputClickJump) ? author$project$Player$InTheAir : author$project$Player$Climbing) : (inputJumpDown ? (doJumpDown ? author$project$Player$InTheAir : oldState) : ((env.inputHoldCrouch && (_Utils_eq(oldState, author$project$Player$Slide) && (_Utils_cmp(
			elm$core$Basics$abs(entity.relativeVelocity.x),
			author$project$PlayerMain$crawlingSpeed) > 0))) ? author$project$Player$Slide : ((env.inputHoldCrouch || (!A2(author$project$PlayerMain$ceilingHasSpace, game, entity))) ? ((!env.inputHoldHorizontalMove) ? author$project$Player$CrouchIdle : (_Utils_eq(oldState, author$project$Player$Run) ? author$project$Player$Slide : author$project$Player$Crawl)) : (env.inputClickJump ? author$project$Player$InTheAir : (env.inputHoldHorizontalMove ? author$project$Player$Run : author$project$Player$StandIdle))))))));
		var newRelativeVelocity = function () {
			switch (newState.$) {
				case 'InTheAir':
					return {
						x: (!env.inputHoldHorizontalMove) ? (oldVelocity.x * (1 - (author$project$PlayerMain$airHorizontalFriction * env.dt))) : (env.inputHoldHorizontalMove * author$project$PlayerMain$airWalkingSpeed),
						y: (env.inputClickJump && (_Utils_eq(oldState, author$project$Player$StandIdle) || _Utils_eq(oldState, author$project$Player$Run))) ? author$project$PlayerMain$jumpInitialSpeed : ((env.inputHoldJump && (_Utils_eq(oldState, author$project$Player$InTheAir) && ((oldVelocity.y > 0) && (_Utils_cmp(game.time - entity.animationStart, author$project$PlayerMain$jumpBoostTime) < 0)))) ? author$project$PlayerMain$jumpInitialSpeed : oldVelocity.y)
					};
				case 'StandIdle':
					return _Utils_update(
						oldVelocity,
						{x: 0});
				case 'CrouchIdle':
					return _Utils_update(
						oldVelocity,
						{x: 0});
				case 'Run':
					return _Utils_update(
						oldVelocity,
						{x: env.inputHoldHorizontalMove * author$project$PlayerMain$runningSpeed});
				case 'Crawl':
					return _Utils_update(
						oldVelocity,
						{x: env.inputHoldHorizontalMove * author$project$PlayerMain$crawlingSpeed});
				case 'Slide':
					return _Utils_update(
						oldVelocity,
						{x: oldVelocity.x * (1 - (author$project$PlayerMain$slideFriction * env.dt))});
				case 'Zapped':
					return _Utils_update(
						oldVelocity,
						{x: oldVelocity.x * (1 - (author$project$PlayerMain$airHorizontalFriction * env.dt))});
				default:
					return A2(
						author$project$Vector$scale,
						author$project$PlayerMain$climbingSpeed,
						author$project$Vector$normalize(
							{
								x: env.inputHoldHorizontalMove,
								y: env.inputHoldUp ? 1 : (env.inputHoldCrouch ? (-1) : 0)
							}));
			}
		}();
		var targetHeight = A2(
			elm$core$List$member,
			newState,
			_List_fromArray(
				[author$project$Player$CrouchIdle, author$project$Player$Crawl, author$project$Player$Slide])) ? 0.95 : author$project$PlayerMain$size.height;
		var height = (_Utils_cmp(targetHeight, entity.size.height) > 0) ? A2(elm$core$Basics$min, targetHeight, entity.size.height + (author$project$PlayerMain$resizeSpeed * env.dt)) : ((_Utils_cmp(targetHeight, entity.size.height) < 0) ? A2(elm$core$Basics$max, targetHeight, entity.size.height - (author$project$PlayerMain$resizeSpeed * env.dt)) : targetHeight);
		var yOffsetDueToSizeChange = (height - entity.size.height) / 2;
		var newRelativePosition = _Utils_update(
			oldPosition,
			{y: (oldPosition.y + yOffsetDueToSizeChange) + yOffsetDueToJumpDown});
		return _Utils_Tuple3(
			A3(
				author$project$PlayerMain$cState.set,
				game,
				newState,
				A3(
					author$project$Game$setPositionsFromRelative,
					maybeParent,
					newRelativePosition,
					A3(
						author$project$Game$setVelocitiesFromRelative,
						maybeParent,
						newRelativeVelocity,
						_Utils_update(
							entity,
							{
								flipX: flipX,
								size: _Utils_update(
									author$project$PlayerMain$size,
									{height: height})
							})))),
			game,
			author$project$Game$OutcomeNone);
	});
var author$project$PlayerMain$cCanFireAt = A2(author$project$PlayerMain$component.seconds, 'canFireAt', 0);
var author$project$TileCollision$collideOnce = F2(
	function (getCollider, trajectory) {
		var testCollision = function (tile) {
			return A2(
				elm$core$Maybe$map,
				function (collision) {
					return _Utils_update(
						collision,
						{tile: tile});
				},
				A2(
					getCollider,
					tile,
					A2(author$project$TileCollision$absoluteToRelativeTrajectory, tile, trajectory)));
		};
		var maybeCollision = A2(
			elm$core$Maybe$map,
			author$project$TileCollision$relativeToAbsoluteCollision,
			A2(
				elm_community$list_extra$List$Extra$minimumBy,
				function ($) {
					return $.distanceSquared;
				},
				A2(
					elm$core$List$filterMap,
					testCollision,
					author$project$TileCollision$sweep(trajectory))));
		return maybeCollision;
	});
var author$project$EntityMain$moveCollide = F5(
	function (onCollision, env, maybeParent, game, entity) {
		var idealAbsolutePosition = A2(
			author$project$Vector$add,
			entity.absolutePosition,
			A2(author$project$Vector$scale, env.dt, entity.absoluteVelocity));
		var maybeCollision = A2(
			author$project$TileCollision$collideOnce,
			A2(
				elm$core$Basics$composeR,
				author$project$Game$getForegroundTile(game),
				function ($) {
					return $.collider;
				}),
			{end: idealAbsolutePosition, height: entity.size.height, start: entity.absolutePosition, width: entity.size.width});
		if (maybeCollision.$ === 'Nothing') {
			return A2(
				author$project$Game$entityOnly,
				game,
				A3(author$project$Game$setPositionsFromAbsolute, maybeParent, idealAbsolutePosition, entity));
		} else {
			var collision = maybeCollision.a;
			return A5(
				onCollision,
				collision,
				env,
				maybeParent,
				game,
				A3(author$project$Game$setPositionsFromAbsolute, maybeParent, collision.aabbPositionAtImpact, entity));
		}
	});
var author$project$PlayerMain$removeOnTileCollision = F5(
	function (collision, env, maybeParent, game, entity) {
		return _Utils_Tuple3(entity, game, author$project$Game$OutcomeNone);
	});
var author$project$Game$RenderableNone = {$: 'RenderableNone'};
var author$project$Game$RenderableTree = function (a) {
	return {$: 'RenderableTree', a: a};
};
var author$project$TransformTree$translate = function (v) {
	return author$project$TransformTree$Translate(
		{x: v.x, y: v.y, z: 0});
};
var author$project$PlayerMain$renderProjectile = F3(
	function (env, game, entity) {
		return (!A2(env.overlapsViewport, entity.size, entity.absolutePosition)) ? author$project$Game$RenderableNone : author$project$Game$RenderableTree(
			A2(
				author$project$TransformTree$Nest,
				_List_fromArray(
					[
						author$project$TransformTree$translate(entity.absolutePosition)
					]),
				_List_fromArray(
					[
						author$project$Svgl$Tree$ellipse(
						_Utils_update(
							author$project$Svgl$Tree$defaultParams,
							{
								fill: A3(avh4$elm_color$Color$rgb, 0.7, 0.1, 0),
								h: 0.5,
								stroke: A3(avh4$elm_color$Color$rgb, 1, 0.2, 0),
								w: 0.5
							}))
					])));
	});
var elm$core$Dict$singleton = F2(
	function (key, value) {
		return A5(elm$core$Dict$RBNode_elm_builtin, elm$core$Dict$Black, key, value, elm$core$Dict$RBEmpty_elm_builtin, elm$core$Dict$RBEmpty_elm_builtin);
	});
var elm$core$Set$singleton = function (key) {
	return elm$core$Set$Set_elm_builtin(
		A2(elm$core$Dict$singleton, key, _Utils_Tuple0));
};
var author$project$PlayerMain$eDecayProjectile = F6(
	function (position, flipX, env, maybeParent, game, entity) {
		var xSign = flipX ? (-1) : 1;
		return A2(
			author$project$Game$entityOnly,
			game,
			A2(
				author$project$Game$appendRenderFunctions,
				_List_fromArray(
					[author$project$PlayerMain$renderProjectile]),
				A2(
					author$project$Game$appendEntityUpdateFunctions,
					_List_fromArray(
						[
							author$project$EntityMain$moveCollide(author$project$PlayerMain$removeOnTileCollision)
						]),
					A3(
						author$project$Game$setVelocitiesFromAbsolute,
						maybeParent,
						A2(author$project$Vector$Vector, 5 * xSign, 0),
						A3(
							author$project$Game$setPositionsFromAbsolute,
							maybeParent,
							position,
							_Utils_update(
								entity,
								{
									tags: elm$core$Set$singleton('decay projectile')
								}))))));
	});
var author$project$PlayerMain$reloadTime = 1;
var author$project$PlayerMain$inputUseGear = F4(
	function (env, maybeParent, game, entity) {
		return (env.inputUseGearClick && (_Utils_cmp(
			game.time,
			author$project$PlayerMain$cCanFireAt.get(entity)) > -1)) ? author$project$Game$toTriple(
			_Utils_Tuple2(
				A2(author$project$PlayerMain$cCanFireAt.set, game.time + author$project$PlayerMain$reloadTime, entity),
				A4(
					author$project$Game$uNewEntity,
					elm$core$Maybe$Nothing,
					_List_fromArray(
						[
							A2(author$project$PlayerMain$eDecayProjectile, entity.absolutePosition, entity.flipX)
						]),
					env,
					game))) : A2(author$project$Game$entityOnly, game, entity);
	});
var author$project$PlayerMain$moveCamera = F4(
	function (env, maybeParent, game, entity) {
		return (!_Utils_eq(game.cameraMode, author$project$Game$CameraFollowsPlayer)) ? _Utils_Tuple3(entity, game, author$project$Game$OutcomeNone) : _Utils_Tuple3(
			entity,
			_Utils_update(
				game,
				{cameraPosition: entity.absolutePosition}),
			author$project$Game$OutcomeNone);
	});
var author$project$Game$periodLinear = F3(
	function (time, phase, period) {
		var t = time + (phase * period);
		var n = elm$core$Basics$floor(t / period);
		return (t / period) - n;
	});
var author$project$PlayerMain$flashColor = F3(
	function (game, finishesAt, color) {
		return ((_Utils_cmp(game.time, finishesAt) < 0) && (A3(author$project$Game$periodLinear, game.time, finishesAt, 0.2) < 0.5)) ? avh4$elm_color$Color$white : color;
	});
var author$project$PlayerMain$render = F3(
	function (env, game, entity) {
		if (A2(env.overlapsViewport, author$project$PlayerMain$size, entity.absolutePosition)) {
			var state = author$project$PlayerMain$cState.get(entity);
			var height = entity.size.height;
			var width = (author$project$PlayerMain$size.width * author$project$PlayerMain$size.height) / height;
			var flash = _Utils_eq(state, author$project$Player$Zapped) ? A2(author$project$PlayerMain$flashColor, game, entity.animationStart + author$project$PlayerMain$zapDuration) : elm$core$Basics$identity;
			return author$project$Game$RenderableTree(
				author$project$Svgl$Tree$rect(
					_Utils_update(
						author$project$Svgl$Tree$defaultParams,
						{
							fill: flash(
								A3(avh4$elm_color$Color$rgb, 0, 0.7, 0)),
							h: height,
							rotate: (!_Utils_eq(state, author$project$Player$Zapped)) ? 0 : ((entity.relativeVelocity.x > 0) ? (elm$core$Basics$pi / 6) : ((-elm$core$Basics$pi) / 6)),
							stroke: flash(
								A3(avh4$elm_color$Color$rgb, 0, 1, 0)),
							w: width,
							x: entity.absolutePosition.x,
							y: entity.absolutePosition.y
						})));
		} else {
			return author$project$Game$RenderableNone;
		}
	});
var author$project$PlayerMain$init = F5(
	function (position, env, maybeParent, game, entity) {
		return _Utils_Tuple3(
			A2(
				author$project$Game$appendRenderFunctions,
				_List_fromArray(
					[author$project$PlayerMain$render]),
				A2(
					author$project$Game$appendEntityUpdateFunctions,
					_List_fromArray(
						[author$project$EntityMain$moveCollideAndSlide, author$project$EntityMain$applyGravity, author$project$PlayerMain$inputMovement, author$project$PlayerMain$moveCamera, author$project$PlayerMain$inputUseGear]),
					A3(
						author$project$Game$setPositionsFromRelative,
						maybeParent,
						position,
						_Utils_update(
							entity,
							{size: author$project$PlayerMain$size})))),
			_Utils_update(
				game,
				{playerId: entity.id}),
			author$project$Game$OutcomeNone);
	});
var author$project$Missions$Intro$init = _List_fromArray(
	[
		F2(
		function (env, game) {
			return author$project$Game$noOut(
				author$project$Missions$Intro$map.set(game));
		}),
		A2(
		author$project$Game$uNewEntity,
		elm$core$Maybe$Nothing,
		_List_fromArray(
			[
				author$project$PlayerMain$init(author$project$Missions$Intro$map.pois.startingPosition)
			])),
		author$project$Missions$Intro$addFadeIn(3),
		author$project$Missions$Intro$uSeries(
		_List_fromArray(
			[
				A2(author$project$Missions$Intro$zaneSays, 1, 'Oden! Can you hear me?'),
				A2(author$project$Missions$Intro$odenSays, 1, 'This is a terrible idea...'),
				A2(author$project$Missions$Intro$zaneSays, 1, 'ODEN! CAN. YOU. HEAR. ME?'),
				A2(author$project$Missions$Intro$odenSays, 0.3, '...'),
				A2(author$project$Missions$Intro$odenSays, 0.2, '-sigh-'),
				A2(author$project$Missions$Intro$odenSays, 0.2, 'Yes Zane, I can hear you loud and clear.')
			]))
	]);
var elm$browser$Browser$External = function (a) {
	return {$: 'External', a: a};
};
var elm$browser$Browser$Internal = function (a) {
	return {$: 'Internal', a: a};
};
var elm$browser$Browser$Dom$NotFound = function (a) {
	return {$: 'NotFound', a: a};
};
var elm$core$Basics$never = function (_n0) {
	never:
	while (true) {
		var nvr = _n0.a;
		var $temp$_n0 = nvr;
		_n0 = $temp$_n0;
		continue never;
	}
};
var elm$core$Task$Perform = function (a) {
	return {$: 'Perform', a: a};
};
var elm$core$Task$succeed = _Scheduler_succeed;
var elm$core$Task$init = elm$core$Task$succeed(_Utils_Tuple0);
var elm$core$Task$andThen = _Scheduler_andThen;
var elm$core$Task$map = F2(
	function (func, taskA) {
		return A2(
			elm$core$Task$andThen,
			function (a) {
				return elm$core$Task$succeed(
					func(a));
			},
			taskA);
	});
var elm$core$Task$map2 = F3(
	function (func, taskA, taskB) {
		return A2(
			elm$core$Task$andThen,
			function (a) {
				return A2(
					elm$core$Task$andThen,
					function (b) {
						return elm$core$Task$succeed(
							A2(func, a, b));
					},
					taskB);
			},
			taskA);
	});
var elm$core$Task$sequence = function (tasks) {
	return A3(
		elm$core$List$foldr,
		elm$core$Task$map2(elm$core$List$cons),
		elm$core$Task$succeed(_List_Nil),
		tasks);
};
var elm$core$Platform$sendToApp = _Platform_sendToApp;
var elm$core$Task$spawnCmd = F2(
	function (router, _n0) {
		var task = _n0.a;
		return _Scheduler_spawn(
			A2(
				elm$core$Task$andThen,
				elm$core$Platform$sendToApp(router),
				task));
	});
var elm$core$Task$onEffects = F3(
	function (router, commands, state) {
		return A2(
			elm$core$Task$map,
			function (_n0) {
				return _Utils_Tuple0;
			},
			elm$core$Task$sequence(
				A2(
					elm$core$List$map,
					elm$core$Task$spawnCmd(router),
					commands)));
	});
var elm$core$Task$onSelfMsg = F3(
	function (_n0, _n1, _n2) {
		return elm$core$Task$succeed(_Utils_Tuple0);
	});
var elm$core$Task$cmdMap = F2(
	function (tagger, _n0) {
		var task = _n0.a;
		return elm$core$Task$Perform(
			A2(elm$core$Task$map, tagger, task));
	});
_Platform_effectManagers['Task'] = _Platform_createManager(elm$core$Task$init, elm$core$Task$onEffects, elm$core$Task$onSelfMsg, elm$core$Task$cmdMap);
var elm$core$Task$command = _Platform_leaf('Task');
var elm$core$Task$perform = F2(
	function (toMessage, task) {
		return elm$core$Task$command(
			elm$core$Task$Perform(
				A2(elm$core$Task$map, toMessage, task)));
	});
var elm$core$String$slice = _String_slice;
var elm$core$String$dropLeft = F2(
	function (n, string) {
		return (n < 1) ? string : A3(
			elm$core$String$slice,
			n,
			elm$core$String$length(string),
			string);
	});
var elm$core$String$startsWith = _String_startsWith;
var elm$url$Url$Http = {$: 'Http'};
var elm$url$Url$Https = {$: 'Https'};
var elm$core$String$indexes = _String_indexes;
var elm$core$String$isEmpty = function (string) {
	return string === '';
};
var elm$core$String$left = F2(
	function (n, string) {
		return (n < 1) ? '' : A3(elm$core$String$slice, 0, n, string);
	});
var elm$core$String$contains = _String_contains;
var elm$core$String$toInt = _String_toInt;
var elm$url$Url$Url = F6(
	function (protocol, host, port_, path, query, fragment) {
		return {fragment: fragment, host: host, path: path, port_: port_, protocol: protocol, query: query};
	});
var elm$url$Url$chompBeforePath = F5(
	function (protocol, path, params, frag, str) {
		if (elm$core$String$isEmpty(str) || A2(elm$core$String$contains, '@', str)) {
			return elm$core$Maybe$Nothing;
		} else {
			var _n0 = A2(elm$core$String$indexes, ':', str);
			if (!_n0.b) {
				return elm$core$Maybe$Just(
					A6(elm$url$Url$Url, protocol, str, elm$core$Maybe$Nothing, path, params, frag));
			} else {
				if (!_n0.b.b) {
					var i = _n0.a;
					var _n1 = elm$core$String$toInt(
						A2(elm$core$String$dropLeft, i + 1, str));
					if (_n1.$ === 'Nothing') {
						return elm$core$Maybe$Nothing;
					} else {
						var port_ = _n1;
						return elm$core$Maybe$Just(
							A6(
								elm$url$Url$Url,
								protocol,
								A2(elm$core$String$left, i, str),
								port_,
								path,
								params,
								frag));
					}
				} else {
					return elm$core$Maybe$Nothing;
				}
			}
		}
	});
var elm$url$Url$chompBeforeQuery = F4(
	function (protocol, params, frag, str) {
		if (elm$core$String$isEmpty(str)) {
			return elm$core$Maybe$Nothing;
		} else {
			var _n0 = A2(elm$core$String$indexes, '/', str);
			if (!_n0.b) {
				return A5(elm$url$Url$chompBeforePath, protocol, '/', params, frag, str);
			} else {
				var i = _n0.a;
				return A5(
					elm$url$Url$chompBeforePath,
					protocol,
					A2(elm$core$String$dropLeft, i, str),
					params,
					frag,
					A2(elm$core$String$left, i, str));
			}
		}
	});
var elm$url$Url$chompBeforeFragment = F3(
	function (protocol, frag, str) {
		if (elm$core$String$isEmpty(str)) {
			return elm$core$Maybe$Nothing;
		} else {
			var _n0 = A2(elm$core$String$indexes, '?', str);
			if (!_n0.b) {
				return A4(elm$url$Url$chompBeforeQuery, protocol, elm$core$Maybe$Nothing, frag, str);
			} else {
				var i = _n0.a;
				return A4(
					elm$url$Url$chompBeforeQuery,
					protocol,
					elm$core$Maybe$Just(
						A2(elm$core$String$dropLeft, i + 1, str)),
					frag,
					A2(elm$core$String$left, i, str));
			}
		}
	});
var elm$url$Url$chompAfterProtocol = F2(
	function (protocol, str) {
		if (elm$core$String$isEmpty(str)) {
			return elm$core$Maybe$Nothing;
		} else {
			var _n0 = A2(elm$core$String$indexes, '#', str);
			if (!_n0.b) {
				return A3(elm$url$Url$chompBeforeFragment, protocol, elm$core$Maybe$Nothing, str);
			} else {
				var i = _n0.a;
				return A3(
					elm$url$Url$chompBeforeFragment,
					protocol,
					elm$core$Maybe$Just(
						A2(elm$core$String$dropLeft, i + 1, str)),
					A2(elm$core$String$left, i, str));
			}
		}
	});
var elm$url$Url$fromString = function (str) {
	return A2(elm$core$String$startsWith, 'http://', str) ? A2(
		elm$url$Url$chompAfterProtocol,
		elm$url$Url$Http,
		A2(elm$core$String$dropLeft, 7, str)) : (A2(elm$core$String$startsWith, 'https://', str) ? A2(
		elm$url$Url$chompAfterProtocol,
		elm$url$Url$Https,
		A2(elm$core$String$dropLeft, 8, str)) : elm$core$Maybe$Nothing);
};
var elm$browser$Browser$Dom$getViewport = _Browser_withWindow(_Browser_getViewport);
var author$project$Viewport$getWindowSize = function (msgConstructor) {
	var viewportToMsg = function (viewport) {
		return msgConstructor(
			{
				height: elm$core$Basics$floor(viewport.viewport.height),
				width: elm$core$Basics$floor(viewport.viewport.width)
			});
	};
	return A2(elm$core$Task$perform, viewportToMsg, elm$browser$Browser$Dom$getViewport);
};
var author$project$Main$init = function (flags) {
	var startingPosition = A2(author$project$Vector$Vector, 10, 10);
	var cmd = author$project$Viewport$getWindowSize(author$project$Main$OnResize);
	var _n0 = author$project$GameMain$init(author$project$Missions$Intro$init);
	var game = _n0.a;
	var outcomes = _n0.b;
	var model = {
		game: game,
		mousePosition: {left: 0, top: 0},
		newKeys: _List_Nil,
		oldKeys: _List_Nil,
		pause: false,
		viewportSize: {height: 480, width: 640}
	};
	return _Utils_Tuple2(model, cmd);
};
var author$project$Main$OnAnimationFrame = function (a) {
	return {$: 'OnAnimationFrame', a: a};
};
var author$project$Main$OnKey = function (a) {
	return {$: 'OnKey', a: a};
};
var author$project$Main$OnMouseMove = function (a) {
	return {$: 'OnMouseMove', a: a};
};
var author$project$Main$OnQueryWidthResponse = function (a) {
	return {$: 'OnQueryWidthResponse', a: a};
};
var elm$json$Json$Decode$field = _Json_decodeField;
var elm$json$Json$Decode$int = _Json_decodeInt;
var author$project$Main$mousePositionDecoder = A3(
	elm$json$Json$Decode$map2,
	F2(
		function (x, y) {
			return {left: x, top: y};
		}),
	A2(elm$json$Json$Decode$field, 'clientX', elm$json$Json$Decode$int),
	A2(elm$json$Json$Decode$field, 'clientY', elm$json$Json$Decode$int));
var elm$json$Json$Decode$andThen = _Json_andThen;
var elm$json$Json$Decode$float = _Json_decodeFloat;
var elm$json$Json$Decode$index = _Json_decodeIndex;
var author$project$Ports$TextWidth$textWidthResponse = _Platform_incomingPort(
	'textWidthResponse',
	A2(
		elm$json$Json$Decode$andThen,
		function (x0) {
			return A2(
				elm$json$Json$Decode$andThen,
				function (x1) {
					return elm$json$Json$Decode$succeed(
						_Utils_Tuple2(x0, x1));
				},
				A2(elm$json$Json$Decode$index, 1, elm$json$Json$Decode$float));
		},
		A2(elm$json$Json$Decode$index, 0, elm$json$Json$Decode$int)));
var elm$browser$Browser$Events$Window = {$: 'Window'};
var elm$browser$Browser$Events$MySub = F3(
	function (a, b, c) {
		return {$: 'MySub', a: a, b: b, c: c};
	});
var elm$browser$Browser$Events$State = F2(
	function (subs, pids) {
		return {pids: pids, subs: subs};
	});
var elm$browser$Browser$Events$init = elm$core$Task$succeed(
	A2(elm$browser$Browser$Events$State, _List_Nil, elm$core$Dict$empty));
var elm$browser$Browser$Events$nodeToKey = function (node) {
	if (node.$ === 'Document') {
		return 'd_';
	} else {
		return 'w_';
	}
};
var elm$browser$Browser$Events$addKey = function (sub) {
	var node = sub.a;
	var name = sub.b;
	return _Utils_Tuple2(
		_Utils_ap(
			elm$browser$Browser$Events$nodeToKey(node),
			name),
		sub);
};
var elm$browser$Browser$Events$Event = F2(
	function (key, event) {
		return {event: event, key: key};
	});
var elm$core$Platform$sendToSelf = _Platform_sendToSelf;
var elm$browser$Browser$Events$spawn = F3(
	function (router, key, _n0) {
		var node = _n0.a;
		var name = _n0.b;
		var actualNode = function () {
			if (node.$ === 'Document') {
				return _Browser_doc;
			} else {
				return _Browser_window;
			}
		}();
		return A2(
			elm$core$Task$map,
			function (value) {
				return _Utils_Tuple2(key, value);
			},
			A3(
				_Browser_on,
				actualNode,
				name,
				function (event) {
					return A2(
						elm$core$Platform$sendToSelf,
						router,
						A2(elm$browser$Browser$Events$Event, key, event));
				}));
	});
var elm$core$Dict$fromList = function (assocs) {
	return A3(
		elm$core$List$foldl,
		F2(
			function (_n0, dict) {
				var key = _n0.a;
				var value = _n0.b;
				return A3(elm$core$Dict$insert, key, value, dict);
			}),
		elm$core$Dict$empty,
		assocs);
};
var elm$core$Dict$foldl = F3(
	function (func, acc, dict) {
		foldl:
		while (true) {
			if (dict.$ === 'RBEmpty_elm_builtin') {
				return acc;
			} else {
				var key = dict.b;
				var value = dict.c;
				var left = dict.d;
				var right = dict.e;
				var $temp$func = func,
					$temp$acc = A3(
					func,
					key,
					value,
					A3(elm$core$Dict$foldl, func, acc, left)),
					$temp$dict = right;
				func = $temp$func;
				acc = $temp$acc;
				dict = $temp$dict;
				continue foldl;
			}
		}
	});
var elm$core$Dict$merge = F6(
	function (leftStep, bothStep, rightStep, leftDict, rightDict, initialResult) {
		var stepState = F3(
			function (rKey, rValue, _n0) {
				stepState:
				while (true) {
					var list = _n0.a;
					var result = _n0.b;
					if (!list.b) {
						return _Utils_Tuple2(
							list,
							A3(rightStep, rKey, rValue, result));
					} else {
						var _n2 = list.a;
						var lKey = _n2.a;
						var lValue = _n2.b;
						var rest = list.b;
						if (_Utils_cmp(lKey, rKey) < 0) {
							var $temp$rKey = rKey,
								$temp$rValue = rValue,
								$temp$_n0 = _Utils_Tuple2(
								rest,
								A3(leftStep, lKey, lValue, result));
							rKey = $temp$rKey;
							rValue = $temp$rValue;
							_n0 = $temp$_n0;
							continue stepState;
						} else {
							if (_Utils_cmp(lKey, rKey) > 0) {
								return _Utils_Tuple2(
									list,
									A3(rightStep, rKey, rValue, result));
							} else {
								return _Utils_Tuple2(
									rest,
									A4(bothStep, lKey, lValue, rValue, result));
							}
						}
					}
				}
			});
		var _n3 = A3(
			elm$core$Dict$foldl,
			stepState,
			_Utils_Tuple2(
				elm$core$Dict$toList(leftDict),
				initialResult),
			rightDict);
		var leftovers = _n3.a;
		var intermediateResult = _n3.b;
		return A3(
			elm$core$List$foldl,
			F2(
				function (_n4, result) {
					var k = _n4.a;
					var v = _n4.b;
					return A3(leftStep, k, v, result);
				}),
			intermediateResult,
			leftovers);
	});
var elm$core$Dict$union = F2(
	function (t1, t2) {
		return A3(elm$core$Dict$foldl, elm$core$Dict$insert, t2, t1);
	});
var elm$core$Process$kill = _Scheduler_kill;
var elm$browser$Browser$Events$onEffects = F3(
	function (router, subs, state) {
		var stepRight = F3(
			function (key, sub, _n6) {
				var deads = _n6.a;
				var lives = _n6.b;
				var news = _n6.c;
				return _Utils_Tuple3(
					deads,
					lives,
					A2(
						elm$core$List$cons,
						A3(elm$browser$Browser$Events$spawn, router, key, sub),
						news));
			});
		var stepLeft = F3(
			function (_n4, pid, _n5) {
				var deads = _n5.a;
				var lives = _n5.b;
				var news = _n5.c;
				return _Utils_Tuple3(
					A2(elm$core$List$cons, pid, deads),
					lives,
					news);
			});
		var stepBoth = F4(
			function (key, pid, _n2, _n3) {
				var deads = _n3.a;
				var lives = _n3.b;
				var news = _n3.c;
				return _Utils_Tuple3(
					deads,
					A3(elm$core$Dict$insert, key, pid, lives),
					news);
			});
		var newSubs = A2(elm$core$List$map, elm$browser$Browser$Events$addKey, subs);
		var _n0 = A6(
			elm$core$Dict$merge,
			stepLeft,
			stepBoth,
			stepRight,
			state.pids,
			elm$core$Dict$fromList(newSubs),
			_Utils_Tuple3(_List_Nil, elm$core$Dict$empty, _List_Nil));
		var deadPids = _n0.a;
		var livePids = _n0.b;
		var makeNewPids = _n0.c;
		return A2(
			elm$core$Task$andThen,
			function (pids) {
				return elm$core$Task$succeed(
					A2(
						elm$browser$Browser$Events$State,
						newSubs,
						A2(
							elm$core$Dict$union,
							livePids,
							elm$core$Dict$fromList(pids))));
			},
			A2(
				elm$core$Task$andThen,
				function (_n1) {
					return elm$core$Task$sequence(makeNewPids);
				},
				elm$core$Task$sequence(
					A2(elm$core$List$map, elm$core$Process$kill, deadPids))));
	});
var elm$browser$Browser$Events$onSelfMsg = F3(
	function (router, _n0, state) {
		var key = _n0.key;
		var event = _n0.event;
		var toMessage = function (_n2) {
			var subKey = _n2.a;
			var _n3 = _n2.b;
			var node = _n3.a;
			var name = _n3.b;
			var decoder = _n3.c;
			return _Utils_eq(subKey, key) ? A2(_Browser_decodeEvent, decoder, event) : elm$core$Maybe$Nothing;
		};
		var messages = A2(elm$core$List$filterMap, toMessage, state.subs);
		return A2(
			elm$core$Task$andThen,
			function (_n1) {
				return elm$core$Task$succeed(state);
			},
			elm$core$Task$sequence(
				A2(
					elm$core$List$map,
					elm$core$Platform$sendToApp(router),
					messages)));
	});
var elm$browser$Browser$Events$subMap = F2(
	function (func, _n0) {
		var node = _n0.a;
		var name = _n0.b;
		var decoder = _n0.c;
		return A3(
			elm$browser$Browser$Events$MySub,
			node,
			name,
			A2(elm$json$Json$Decode$map, func, decoder));
	});
_Platform_effectManagers['Browser.Events'] = _Platform_createManager(elm$browser$Browser$Events$init, elm$browser$Browser$Events$onEffects, elm$browser$Browser$Events$onSelfMsg, 0, elm$browser$Browser$Events$subMap);
var elm$browser$Browser$Events$subscription = _Platform_leaf('Browser.Events');
var elm$browser$Browser$Events$on = F3(
	function (node, name, decoder) {
		return elm$browser$Browser$Events$subscription(
			A3(elm$browser$Browser$Events$MySub, node, name, decoder));
	});
var elm$browser$Browser$Events$onResize = function (func) {
	return A3(
		elm$browser$Browser$Events$on,
		elm$browser$Browser$Events$Window,
		'resize',
		A2(
			elm$json$Json$Decode$field,
			'target',
			A3(
				elm$json$Json$Decode$map2,
				func,
				A2(elm$json$Json$Decode$field, 'innerWidth', elm$json$Json$Decode$int),
				A2(elm$json$Json$Decode$field, 'innerHeight', elm$json$Json$Decode$int))));
};
var author$project$Viewport$onWindowResize = function (msgConstructor) {
	return elm$browser$Browser$Events$onResize(
		F2(
			function (w, h) {
				return msgConstructor(
					{height: h, width: w});
			}));
};
var elm$browser$Browser$AnimationManager$Delta = function (a) {
	return {$: 'Delta', a: a};
};
var elm$browser$Browser$AnimationManager$State = F3(
	function (subs, request, oldTime) {
		return {oldTime: oldTime, request: request, subs: subs};
	});
var elm$browser$Browser$AnimationManager$init = elm$core$Task$succeed(
	A3(elm$browser$Browser$AnimationManager$State, _List_Nil, elm$core$Maybe$Nothing, 0));
var elm$browser$Browser$AnimationManager$now = _Browser_now(_Utils_Tuple0);
var elm$browser$Browser$AnimationManager$rAF = _Browser_rAF(_Utils_Tuple0);
var elm$core$Process$spawn = _Scheduler_spawn;
var elm$browser$Browser$AnimationManager$onEffects = F3(
	function (router, subs, _n0) {
		var request = _n0.request;
		var oldTime = _n0.oldTime;
		var _n1 = _Utils_Tuple2(request, subs);
		if (_n1.a.$ === 'Nothing') {
			if (!_n1.b.b) {
				var _n2 = _n1.a;
				return elm$browser$Browser$AnimationManager$init;
			} else {
				var _n4 = _n1.a;
				return A2(
					elm$core$Task$andThen,
					function (pid) {
						return A2(
							elm$core$Task$andThen,
							function (time) {
								return elm$core$Task$succeed(
									A3(
										elm$browser$Browser$AnimationManager$State,
										subs,
										elm$core$Maybe$Just(pid),
										time));
							},
							elm$browser$Browser$AnimationManager$now);
					},
					elm$core$Process$spawn(
						A2(
							elm$core$Task$andThen,
							elm$core$Platform$sendToSelf(router),
							elm$browser$Browser$AnimationManager$rAF)));
			}
		} else {
			if (!_n1.b.b) {
				var pid = _n1.a.a;
				return A2(
					elm$core$Task$andThen,
					function (_n3) {
						return elm$browser$Browser$AnimationManager$init;
					},
					elm$core$Process$kill(pid));
			} else {
				return elm$core$Task$succeed(
					A3(elm$browser$Browser$AnimationManager$State, subs, request, oldTime));
			}
		}
	});
var elm$time$Time$Posix = function (a) {
	return {$: 'Posix', a: a};
};
var elm$time$Time$millisToPosix = elm$time$Time$Posix;
var elm$browser$Browser$AnimationManager$onSelfMsg = F3(
	function (router, newTime, _n0) {
		var subs = _n0.subs;
		var oldTime = _n0.oldTime;
		var send = function (sub) {
			if (sub.$ === 'Time') {
				var tagger = sub.a;
				return A2(
					elm$core$Platform$sendToApp,
					router,
					tagger(
						elm$time$Time$millisToPosix(newTime)));
			} else {
				var tagger = sub.a;
				return A2(
					elm$core$Platform$sendToApp,
					router,
					tagger(newTime - oldTime));
			}
		};
		return A2(
			elm$core$Task$andThen,
			function (pid) {
				return A2(
					elm$core$Task$andThen,
					function (_n1) {
						return elm$core$Task$succeed(
							A3(
								elm$browser$Browser$AnimationManager$State,
								subs,
								elm$core$Maybe$Just(pid),
								newTime));
					},
					elm$core$Task$sequence(
						A2(elm$core$List$map, send, subs)));
			},
			elm$core$Process$spawn(
				A2(
					elm$core$Task$andThen,
					elm$core$Platform$sendToSelf(router),
					elm$browser$Browser$AnimationManager$rAF)));
	});
var elm$browser$Browser$AnimationManager$Time = function (a) {
	return {$: 'Time', a: a};
};
var elm$browser$Browser$AnimationManager$subMap = F2(
	function (func, sub) {
		if (sub.$ === 'Time') {
			var tagger = sub.a;
			return elm$browser$Browser$AnimationManager$Time(
				A2(elm$core$Basics$composeL, func, tagger));
		} else {
			var tagger = sub.a;
			return elm$browser$Browser$AnimationManager$Delta(
				A2(elm$core$Basics$composeL, func, tagger));
		}
	});
_Platform_effectManagers['Browser.AnimationManager'] = _Platform_createManager(elm$browser$Browser$AnimationManager$init, elm$browser$Browser$AnimationManager$onEffects, elm$browser$Browser$AnimationManager$onSelfMsg, 0, elm$browser$Browser$AnimationManager$subMap);
var elm$browser$Browser$AnimationManager$subscription = _Platform_leaf('Browser.AnimationManager');
var elm$browser$Browser$AnimationManager$onAnimationFrameDelta = function (tagger) {
	return elm$browser$Browser$AnimationManager$subscription(
		elm$browser$Browser$AnimationManager$Delta(tagger));
};
var elm$browser$Browser$Events$onAnimationFrameDelta = elm$browser$Browser$AnimationManager$onAnimationFrameDelta;
var elm$browser$Browser$Events$Document = {$: 'Document'};
var elm$browser$Browser$Events$onMouseMove = A2(elm$browser$Browser$Events$on, elm$browser$Browser$Events$Document, 'mousemove');
var elm$core$Platform$Sub$batch = _Platform_batch;
var elm$core$Platform$Sub$map = _Platform_map;
var elm$core$Platform$Sub$none = elm$core$Platform$Sub$batch(_List_Nil);
var ohanhi$keyboard$Keyboard$Down = function (a) {
	return {$: 'Down', a: a};
};
var ohanhi$keyboard$Keyboard$Up = function (a) {
	return {$: 'Up', a: a};
};
var elm$browser$Browser$Events$onKeyDown = A2(elm$browser$Browser$Events$on, elm$browser$Browser$Events$Document, 'keydown');
var elm$json$Json$Decode$string = _Json_decodeString;
var ohanhi$keyboard$Keyboard$RawKey = function (a) {
	return {$: 'RawKey', a: a};
};
var ohanhi$keyboard$Keyboard$eventKeyDecoder = A2(
	elm$json$Json$Decode$field,
	'key',
	A2(elm$json$Json$Decode$map, ohanhi$keyboard$Keyboard$RawKey, elm$json$Json$Decode$string));
var ohanhi$keyboard$Keyboard$downs = function (toMsg) {
	return elm$browser$Browser$Events$onKeyDown(
		A2(elm$json$Json$Decode$map, toMsg, ohanhi$keyboard$Keyboard$eventKeyDecoder));
};
var elm$browser$Browser$Events$onKeyUp = A2(elm$browser$Browser$Events$on, elm$browser$Browser$Events$Document, 'keyup');
var ohanhi$keyboard$Keyboard$ups = function (toMsg) {
	return elm$browser$Browser$Events$onKeyUp(
		A2(elm$json$Json$Decode$map, toMsg, ohanhi$keyboard$Keyboard$eventKeyDecoder));
};
var ohanhi$keyboard$Keyboard$subscriptions = elm$core$Platform$Sub$batch(
	_List_fromArray(
		[
			ohanhi$keyboard$Keyboard$downs(ohanhi$keyboard$Keyboard$Down),
			ohanhi$keyboard$Keyboard$ups(ohanhi$keyboard$Keyboard$Up)
		]));
var author$project$Main$subscriptions = function (model) {
	return elm$core$Platform$Sub$batch(
		_List_fromArray(
			[
				author$project$Viewport$onWindowResize(author$project$Main$OnResize),
				model.pause ? elm$core$Platform$Sub$none : elm$browser$Browser$Events$onAnimationFrameDelta(author$project$Main$OnAnimationFrame),
				A2(elm$core$Platform$Sub$map, author$project$Main$OnKey, ohanhi$keyboard$Keyboard$subscriptions),
				A2(
				elm$core$Platform$Sub$map,
				author$project$Main$OnMouseMove,
				elm$browser$Browser$Events$onMouseMove(author$project$Main$mousePositionDecoder)),
				author$project$Ports$TextWidth$textWidthResponse(author$project$Main$OnQueryWidthResponse)
			]));
};
var author$project$GameMain$executeOneLater = F3(
	function (env, _n0, _n1) {
		var timestamp = _n0.a;
		var f = _n0.b.a;
		var game = _n1.a;
		var os = _n1.b;
		return A2(
			elm$core$Tuple$mapSecond,
			function (o) {
				return A2(elm$core$List$cons, o, os);
			},
			A2(f, env, game));
	});
var elm$core$List$partition = F2(
	function (pred, list) {
		var step = F2(
			function (x, _n0) {
				var trues = _n0.a;
				var falses = _n0.b;
				return pred(x) ? _Utils_Tuple2(
					A2(elm$core$List$cons, x, trues),
					falses) : _Utils_Tuple2(
					trues,
					A2(elm$core$List$cons, x, falses));
			});
		return A3(
			elm$core$List$foldr,
			step,
			_Utils_Tuple2(_List_Nil, _List_Nil),
			list);
	});
var elm$core$Tuple$second = function (_n0) {
	var y = _n0.b;
	return y;
};
var author$project$GameMain$executeAllLaters = F2(
	function (env, _n0) {
		var game = _n0.a;
		var os = _n0.b;
		var _n1 = A2(
			elm$core$List$partition,
			function (_n2) {
				var timestamp = _n2.a;
				var later = _n2.b;
				return _Utils_cmp(timestamp, game.time) < 1;
			},
			game.laters);
		var latersToRunNow = _n1.a;
		var latersToRunLater = _n1.b;
		var latersDeltas = A2(elm$core$List$map, elm$core$Tuple$second, latersToRunNow);
		return A3(
			elm$core$List$foldl,
			author$project$GameMain$executeOneLater(env),
			_Utils_Tuple2(
				_Utils_update(
					game,
					{laters: latersToRunLater}),
				os),
			latersToRunNow);
	});
var author$project$GameMain$darknessSpeed = 100;
var author$project$GameMain$updateDarkness = F2(
	function (dt, game) {
		return _Utils_update(
			game,
			{
				darknessState: (_Utils_cmp(game.darknessTarget, game.darknessState) > 0) ? A2(elm$core$Basics$min, game.darknessTarget, game.darknessState + (author$project$GameMain$darknessSpeed * dt)) : A2(elm$core$Basics$max, game.darknessTarget, game.darknessState - (author$project$GameMain$darknessSpeed * dt))
			});
	});
var author$project$GameMain$entityExecuteOneUpdateFunction = F4(
	function (env, maybeParent, _n0, _n1) {
		var f = _n0.a;
		var entity = _n1.a;
		var game = _n1.b;
		var os = _n1.c;
		var _n2 = A4(f, env, maybeParent, game, entity);
		var e = _n2.a;
		var w = _n2.b;
		var o = _n2.c;
		return _Utils_Tuple3(
			e,
			w,
			A2(elm$core$List$cons, o, os));
	});
var author$project$GameMain$updateAbsoluteVectors = F2(
	function (maybeParent, entity) {
		if (maybeParent.$ === 'Nothing') {
			return entity;
		} else {
			var parent = maybeParent.a.a;
			return _Utils_update(
				entity,
				{
					absolutePosition: A2(author$project$Vector$add, parent.absolutePosition, entity.relativePosition),
					absoluteVelocity: A2(author$project$Vector$add, parent.absoluteVelocity, entity.relativeVelocity)
				});
		}
	});
var author$project$GameMain$entityUpdate = F4(
	function (env, maybeParent, id, _n0) {
		var game = _n0.a;
		var os = _n0.b;
		var _n1 = A2(elm$core$Dict$get, id, game.entitiesById);
		if (_n1.$ === 'Nothing') {
			return _Utils_Tuple2(game, os);
		} else {
			var entity = _n1.a;
			var _n2 = A3(
				elm$core$List$foldl,
				A2(author$project$GameMain$entityExecuteOneUpdateFunction, env, maybeParent),
				_Utils_Tuple3(entity, game, os),
				entity.wrappedUpdateFunctions);
			var e_ = _n2.a;
			var g = _n2.b;
			var o = _n2.c;
			var e = A2(author$project$GameMain$updateAbsoluteVectors, maybeParent, e_);
			var entitiesById = A3(elm$core$Dict$insert, id, e, g.entitiesById);
			return A3(
				elm$core$List$foldl,
				A2(
					author$project$GameMain$entityUpdate,
					env,
					elm$core$Maybe$Just(
						author$project$Game$Parent(e))),
				_Utils_Tuple2(
					_Utils_update(
						g,
						{entitiesById: entitiesById}),
					o),
				e.childrenIds);
		}
	});
var author$project$GameMain$updateEntities = F2(
	function (env, game) {
		return A3(
			elm$core$List$foldl,
			A2(author$project$GameMain$entityUpdate, env, elm$core$Maybe$Nothing),
			_Utils_Tuple2(game, _List_Nil),
			game.rootEntitiesIds);
	});
var author$project$GameMain$update = F2(
	function (env, game) {
		return A2(
			author$project$GameMain$executeAllLaters,
			env,
			A2(
				author$project$GameMain$updateEntities,
				env,
				A2(
					author$project$GameMain$updateDarkness,
					env.dt,
					_Utils_update(
						game,
						{time: game.time + env.dt}))));
	});
var elm$json$Json$Encode$int = _Json_wrap;
var author$project$Ports$TextWidth$textWidthRequest = _Platform_outgoingPort('textWidthRequest', elm$json$Json$Encode$int);
var elm$core$Debug$log = _Debug_log;
var elm$core$Debug$todo = _Debug_todo;
var author$project$Main$executeOutcome = function (o) {
	switch (o.$) {
		case 'OutcomeNone':
			return _List_Nil;
		case 'OutcomeList':
			var os = o.a;
			return A2(elm$core$List$concatMap, author$project$Main$executeOutcome, os);
		case 'OutcomeLog':
			var msg = o.a;
			var _n1 = A2(elm$core$Debug$log, 'LOG', msg);
			return _List_Nil;
		case 'OutcomeCrash':
			var msg = o.a;
			return _Debug_todo(
				'Main',
				{
					start: {line: 197, column: 13},
					end: {line: 197, column: 23}
				})(msg);
		default:
			var id = o.a;
			return _List_fromArray(
				[
					author$project$Ports$TextWidth$textWidthRequest(id)
				]);
	}
};
var elm$core$Platform$Cmd$batch = _Platform_batch;
var elm$core$Platform$Cmd$none = elm$core$Platform$Cmd$batch(_List_Nil);
var author$project$Main$noCmd = function (model) {
	return _Utils_Tuple2(model, elm$core$Platform$Cmd$none);
};
var author$project$SpeechBubble$applyWidth = F3(
	function (id, width, game) {
		return _Utils_update(
			game,
			{
				entitiesById: A3(
					elm$core$Dict$update,
					id,
					elm$core$Maybe$map(
						author$project$SpeechBubble$cTextWidth.set(width)),
					game.entitiesById)
			});
	});
var elm$core$Dict$map = F2(
	function (func, dict) {
		if (dict.$ === 'RBEmpty_elm_builtin') {
			return elm$core$Dict$RBEmpty_elm_builtin;
		} else {
			var color = dict.a;
			var key = dict.b;
			var value = dict.c;
			var left = dict.d;
			var right = dict.e;
			return A5(
				elm$core$Dict$RBNode_elm_builtin,
				color,
				key,
				A2(func, key, value),
				A2(elm$core$Dict$map, func, left),
				A2(elm$core$Dict$map, func, right));
		}
	});
var author$project$SpeechBubble$resetAll = function (game) {
	var resetTextWidth = F2(
		function (id, entity) {
			return (!author$project$SpeechBubble$cTextWidth.get(entity)) ? entity : A2(author$project$SpeechBubble$cTextWidth.set, 0, entity);
		});
	return _Utils_update(
		game,
		{
			entitiesById: A2(elm$core$Dict$map, resetTextWidth, game.entitiesById)
		});
};
var ohanhi$keyboard$Keyboard$ArrowUp = {$: 'ArrowUp'};
var ohanhi$keyboard$Keyboard$Character = function (a) {
	return {$: 'Character', a: a};
};
var ohanhi$keyboard$Keyboard$Control = {$: 'Control'};
var ohanhi$keyboard$Keyboard$Enter = {$: 'Enter'};
var ohanhi$keyboard$Keyboard$characterKey = function (_n0) {
	var value = _n0.a;
	return (elm$core$String$length(value) === 1) ? elm$core$Maybe$Just(
		ohanhi$keyboard$Keyboard$Character(value)) : elm$core$Maybe$Nothing;
};
var ohanhi$keyboard$Keyboard$Backspace = {$: 'Backspace'};
var ohanhi$keyboard$Keyboard$Clear = {$: 'Clear'};
var ohanhi$keyboard$Keyboard$Copy = {$: 'Copy'};
var ohanhi$keyboard$Keyboard$CrSel = {$: 'CrSel'};
var ohanhi$keyboard$Keyboard$Cut = {$: 'Cut'};
var ohanhi$keyboard$Keyboard$Delete = {$: 'Delete'};
var ohanhi$keyboard$Keyboard$EraseEof = {$: 'EraseEof'};
var ohanhi$keyboard$Keyboard$ExSel = {$: 'ExSel'};
var ohanhi$keyboard$Keyboard$Insert = {$: 'Insert'};
var ohanhi$keyboard$Keyboard$Paste = {$: 'Paste'};
var ohanhi$keyboard$Keyboard$Redo = {$: 'Redo'};
var ohanhi$keyboard$Keyboard$Undo = {$: 'Undo'};
var ohanhi$keyboard$Keyboard$editingKey = function (_n0) {
	var value = _n0.a;
	switch (value) {
		case 'Backspace':
			return elm$core$Maybe$Just(ohanhi$keyboard$Keyboard$Backspace);
		case 'Clear':
			return elm$core$Maybe$Just(ohanhi$keyboard$Keyboard$Clear);
		case 'Copy':
			return elm$core$Maybe$Just(ohanhi$keyboard$Keyboard$Copy);
		case 'CrSel':
			return elm$core$Maybe$Just(ohanhi$keyboard$Keyboard$CrSel);
		case 'Cut':
			return elm$core$Maybe$Just(ohanhi$keyboard$Keyboard$Cut);
		case 'Delete':
			return elm$core$Maybe$Just(ohanhi$keyboard$Keyboard$Delete);
		case 'EraseEof':
			return elm$core$Maybe$Just(ohanhi$keyboard$Keyboard$EraseEof);
		case 'ExSel':
			return elm$core$Maybe$Just(ohanhi$keyboard$Keyboard$ExSel);
		case 'Insert':
			return elm$core$Maybe$Just(ohanhi$keyboard$Keyboard$Insert);
		case 'Paste':
			return elm$core$Maybe$Just(ohanhi$keyboard$Keyboard$Paste);
		case 'Redo':
			return elm$core$Maybe$Just(ohanhi$keyboard$Keyboard$Redo);
		case 'Undo':
			return elm$core$Maybe$Just(ohanhi$keyboard$Keyboard$Undo);
		default:
			return elm$core$Maybe$Nothing;
	}
};
var ohanhi$keyboard$Keyboard$F1 = {$: 'F1'};
var ohanhi$keyboard$Keyboard$F10 = {$: 'F10'};
var ohanhi$keyboard$Keyboard$F11 = {$: 'F11'};
var ohanhi$keyboard$Keyboard$F12 = {$: 'F12'};
var ohanhi$keyboard$Keyboard$F13 = {$: 'F13'};
var ohanhi$keyboard$Keyboard$F14 = {$: 'F14'};
var ohanhi$keyboard$Keyboard$F15 = {$: 'F15'};
var ohanhi$keyboard$Keyboard$F16 = {$: 'F16'};
var ohanhi$keyboard$Keyboard$F17 = {$: 'F17'};
var ohanhi$keyboard$Keyboard$F18 = {$: 'F18'};
var ohanhi$keyboard$Keyboard$F19 = {$: 'F19'};
var ohanhi$keyboard$Keyboard$F2 = {$: 'F2'};
var ohanhi$keyboard$Keyboard$F20 = {$: 'F20'};
var ohanhi$keyboard$Keyboard$F3 = {$: 'F3'};
var ohanhi$keyboard$Keyboard$F4 = {$: 'F4'};
var ohanhi$keyboard$Keyboard$F5 = {$: 'F5'};
var ohanhi$keyboard$Keyboard$F6 = {$: 'F6'};
var ohanhi$keyboard$Keyboard$F7 = {$: 'F7'};
var ohanhi$keyboard$Keyboard$F8 = {$: 'F8'};
var ohanhi$keyboard$Keyboard$F9 = {$: 'F9'};
var ohanhi$keyboard$Keyboard$functionKey = function (_n0) {
	var value = _n0.a;
	switch (value) {
		case 'F1':
			return elm$core$Maybe$Just(ohanhi$keyboard$Keyboard$F1);
		case 'F2':
			return elm$core$Maybe$Just(ohanhi$keyboard$Keyboard$F2);
		case 'F3':
			return elm$core$Maybe$Just(ohanhi$keyboard$Keyboard$F3);
		case 'F4':
			return elm$core$Maybe$Just(ohanhi$keyboard$Keyboard$F4);
		case 'F5':
			return elm$core$Maybe$Just(ohanhi$keyboard$Keyboard$F5);
		case 'F6':
			return elm$core$Maybe$Just(ohanhi$keyboard$Keyboard$F6);
		case 'F7':
			return elm$core$Maybe$Just(ohanhi$keyboard$Keyboard$F7);
		case 'F8':
			return elm$core$Maybe$Just(ohanhi$keyboard$Keyboard$F8);
		case 'F9':
			return elm$core$Maybe$Just(ohanhi$keyboard$Keyboard$F9);
		case 'F10':
			return elm$core$Maybe$Just(ohanhi$keyboard$Keyboard$F10);
		case 'F11':
			return elm$core$Maybe$Just(ohanhi$keyboard$Keyboard$F11);
		case 'F12':
			return elm$core$Maybe$Just(ohanhi$keyboard$Keyboard$F12);
		case 'F13':
			return elm$core$Maybe$Just(ohanhi$keyboard$Keyboard$F13);
		case 'F14':
			return elm$core$Maybe$Just(ohanhi$keyboard$Keyboard$F14);
		case 'F15':
			return elm$core$Maybe$Just(ohanhi$keyboard$Keyboard$F15);
		case 'F16':
			return elm$core$Maybe$Just(ohanhi$keyboard$Keyboard$F16);
		case 'F17':
			return elm$core$Maybe$Just(ohanhi$keyboard$Keyboard$F17);
		case 'F18':
			return elm$core$Maybe$Just(ohanhi$keyboard$Keyboard$F18);
		case 'F19':
			return elm$core$Maybe$Just(ohanhi$keyboard$Keyboard$F19);
		case 'F20':
			return elm$core$Maybe$Just(ohanhi$keyboard$Keyboard$F20);
		default:
			return elm$core$Maybe$Nothing;
	}
};
var ohanhi$keyboard$Keyboard$ChannelDown = {$: 'ChannelDown'};
var ohanhi$keyboard$Keyboard$ChannelUp = {$: 'ChannelUp'};
var ohanhi$keyboard$Keyboard$MediaFastForward = {$: 'MediaFastForward'};
var ohanhi$keyboard$Keyboard$MediaPause = {$: 'MediaPause'};
var ohanhi$keyboard$Keyboard$MediaPlay = {$: 'MediaPlay'};
var ohanhi$keyboard$Keyboard$MediaPlayPause = {$: 'MediaPlayPause'};
var ohanhi$keyboard$Keyboard$MediaRecord = {$: 'MediaRecord'};
var ohanhi$keyboard$Keyboard$MediaRewind = {$: 'MediaRewind'};
var ohanhi$keyboard$Keyboard$MediaStop = {$: 'MediaStop'};
var ohanhi$keyboard$Keyboard$MediaTrackNext = {$: 'MediaTrackNext'};
var ohanhi$keyboard$Keyboard$MediaTrackPrevious = {$: 'MediaTrackPrevious'};
var ohanhi$keyboard$Keyboard$mediaKey = function (_n0) {
	var value = _n0.a;
	switch (value) {
		case 'ChannelDown':
			return elm$core$Maybe$Just(ohanhi$keyboard$Keyboard$ChannelDown);
		case 'ChannelUp':
			return elm$core$Maybe$Just(ohanhi$keyboard$Keyboard$ChannelUp);
		case 'MediaFastForward':
			return elm$core$Maybe$Just(ohanhi$keyboard$Keyboard$MediaFastForward);
		case 'MediaPause':
			return elm$core$Maybe$Just(ohanhi$keyboard$Keyboard$MediaPause);
		case 'MediaPlay':
			return elm$core$Maybe$Just(ohanhi$keyboard$Keyboard$MediaPlay);
		case 'MediaPlayPause':
			return elm$core$Maybe$Just(ohanhi$keyboard$Keyboard$MediaPlayPause);
		case 'MediaRecord':
			return elm$core$Maybe$Just(ohanhi$keyboard$Keyboard$MediaRecord);
		case 'MediaRewind':
			return elm$core$Maybe$Just(ohanhi$keyboard$Keyboard$MediaRewind);
		case 'MediaStop':
			return elm$core$Maybe$Just(ohanhi$keyboard$Keyboard$MediaStop);
		case 'MediaTrackNext':
			return elm$core$Maybe$Just(ohanhi$keyboard$Keyboard$MediaTrackNext);
		case 'MediaTrackPrevious':
			return elm$core$Maybe$Just(ohanhi$keyboard$Keyboard$MediaTrackPrevious);
		default:
			return elm$core$Maybe$Nothing;
	}
};
var ohanhi$keyboard$Keyboard$Alt = {$: 'Alt'};
var ohanhi$keyboard$Keyboard$AltGraph = {$: 'AltGraph'};
var ohanhi$keyboard$Keyboard$CapsLock = {$: 'CapsLock'};
var ohanhi$keyboard$Keyboard$Fn = {$: 'Fn'};
var ohanhi$keyboard$Keyboard$FnLock = {$: 'FnLock'};
var ohanhi$keyboard$Keyboard$Hyper = {$: 'Hyper'};
var ohanhi$keyboard$Keyboard$Meta = {$: 'Meta'};
var ohanhi$keyboard$Keyboard$NumLock = {$: 'NumLock'};
var ohanhi$keyboard$Keyboard$ScrollLock = {$: 'ScrollLock'};
var ohanhi$keyboard$Keyboard$Shift = {$: 'Shift'};
var ohanhi$keyboard$Keyboard$Super = {$: 'Super'};
var ohanhi$keyboard$Keyboard$Symbol = {$: 'Symbol'};
var ohanhi$keyboard$Keyboard$SymbolLock = {$: 'SymbolLock'};
var ohanhi$keyboard$Keyboard$modifierKey = function (_n0) {
	var value = _n0.a;
	switch (value) {
		case 'Alt':
			return elm$core$Maybe$Just(ohanhi$keyboard$Keyboard$Alt);
		case 'AltGraph':
			return elm$core$Maybe$Just(ohanhi$keyboard$Keyboard$AltGraph);
		case 'CapsLock':
			return elm$core$Maybe$Just(ohanhi$keyboard$Keyboard$CapsLock);
		case 'Control':
			return elm$core$Maybe$Just(ohanhi$keyboard$Keyboard$Control);
		case 'Fn':
			return elm$core$Maybe$Just(ohanhi$keyboard$Keyboard$Fn);
		case 'FnLock':
			return elm$core$Maybe$Just(ohanhi$keyboard$Keyboard$FnLock);
		case 'Hyper':
			return elm$core$Maybe$Just(ohanhi$keyboard$Keyboard$Hyper);
		case 'Meta':
			return elm$core$Maybe$Just(ohanhi$keyboard$Keyboard$Meta);
		case 'NumLock':
			return elm$core$Maybe$Just(ohanhi$keyboard$Keyboard$NumLock);
		case 'ScrollLock':
			return elm$core$Maybe$Just(ohanhi$keyboard$Keyboard$ScrollLock);
		case 'Shift':
			return elm$core$Maybe$Just(ohanhi$keyboard$Keyboard$Shift);
		case 'Super':
			return elm$core$Maybe$Just(ohanhi$keyboard$Keyboard$Super);
		case 'OS':
			return elm$core$Maybe$Just(ohanhi$keyboard$Keyboard$Super);
		case 'Symbol':
			return elm$core$Maybe$Just(ohanhi$keyboard$Keyboard$Symbol);
		case 'SymbolLock':
			return elm$core$Maybe$Just(ohanhi$keyboard$Keyboard$SymbolLock);
		default:
			return elm$core$Maybe$Nothing;
	}
};
var ohanhi$keyboard$Keyboard$ArrowDown = {$: 'ArrowDown'};
var ohanhi$keyboard$Keyboard$ArrowLeft = {$: 'ArrowLeft'};
var ohanhi$keyboard$Keyboard$ArrowRight = {$: 'ArrowRight'};
var ohanhi$keyboard$Keyboard$End = {$: 'End'};
var ohanhi$keyboard$Keyboard$Home = {$: 'Home'};
var ohanhi$keyboard$Keyboard$PageDown = {$: 'PageDown'};
var ohanhi$keyboard$Keyboard$PageUp = {$: 'PageUp'};
var ohanhi$keyboard$Keyboard$navigationKey = function (_n0) {
	var value = _n0.a;
	switch (value) {
		case 'ArrowDown':
			return elm$core$Maybe$Just(ohanhi$keyboard$Keyboard$ArrowDown);
		case 'ArrowLeft':
			return elm$core$Maybe$Just(ohanhi$keyboard$Keyboard$ArrowLeft);
		case 'ArrowRight':
			return elm$core$Maybe$Just(ohanhi$keyboard$Keyboard$ArrowRight);
		case 'ArrowUp':
			return elm$core$Maybe$Just(ohanhi$keyboard$Keyboard$ArrowUp);
		case 'Down':
			return elm$core$Maybe$Just(ohanhi$keyboard$Keyboard$ArrowDown);
		case 'Left':
			return elm$core$Maybe$Just(ohanhi$keyboard$Keyboard$ArrowLeft);
		case 'Right':
			return elm$core$Maybe$Just(ohanhi$keyboard$Keyboard$ArrowRight);
		case 'Up':
			return elm$core$Maybe$Just(ohanhi$keyboard$Keyboard$ArrowUp);
		case 'End':
			return elm$core$Maybe$Just(ohanhi$keyboard$Keyboard$End);
		case 'Home':
			return elm$core$Maybe$Just(ohanhi$keyboard$Keyboard$Home);
		case 'PageDown':
			return elm$core$Maybe$Just(ohanhi$keyboard$Keyboard$PageDown);
		case 'PageUp':
			return elm$core$Maybe$Just(ohanhi$keyboard$Keyboard$PageUp);
		default:
			return elm$core$Maybe$Nothing;
	}
};
var ohanhi$keyboard$Keyboard$oneOf = F2(
	function (fns, key) {
		oneOf:
		while (true) {
			if (!fns.b) {
				return elm$core$Maybe$Nothing;
			} else {
				var fn = fns.a;
				var rest = fns.b;
				var _n1 = fn(key);
				if (_n1.$ === 'Just') {
					var a = _n1.a;
					return elm$core$Maybe$Just(a);
				} else {
					var $temp$fns = rest,
						$temp$key = key;
					fns = $temp$fns;
					key = $temp$key;
					continue oneOf;
				}
			}
		}
	});
var ohanhi$keyboard$Keyboard$AppSwitch = {$: 'AppSwitch'};
var ohanhi$keyboard$Keyboard$Call = {$: 'Call'};
var ohanhi$keyboard$Keyboard$Camera = {$: 'Camera'};
var ohanhi$keyboard$Keyboard$CameraFocus = {$: 'CameraFocus'};
var ohanhi$keyboard$Keyboard$EndCall = {$: 'EndCall'};
var ohanhi$keyboard$Keyboard$GoBack = {$: 'GoBack'};
var ohanhi$keyboard$Keyboard$GoHome = {$: 'GoHome'};
var ohanhi$keyboard$Keyboard$HeadsetHook = {$: 'HeadsetHook'};
var ohanhi$keyboard$Keyboard$LastNumberRedial = {$: 'LastNumberRedial'};
var ohanhi$keyboard$Keyboard$MannerMode = {$: 'MannerMode'};
var ohanhi$keyboard$Keyboard$Notification = {$: 'Notification'};
var ohanhi$keyboard$Keyboard$VoiceDial = {$: 'VoiceDial'};
var ohanhi$keyboard$Keyboard$phoneKey = function (_n0) {
	var value = _n0.a;
	switch (value) {
		case 'AppSwitch':
			return elm$core$Maybe$Just(ohanhi$keyboard$Keyboard$AppSwitch);
		case 'Call':
			return elm$core$Maybe$Just(ohanhi$keyboard$Keyboard$Call);
		case 'Camera':
			return elm$core$Maybe$Just(ohanhi$keyboard$Keyboard$Camera);
		case 'CameraFocus':
			return elm$core$Maybe$Just(ohanhi$keyboard$Keyboard$CameraFocus);
		case 'EndCall':
			return elm$core$Maybe$Just(ohanhi$keyboard$Keyboard$EndCall);
		case 'GoBack':
			return elm$core$Maybe$Just(ohanhi$keyboard$Keyboard$GoBack);
		case 'GoHome':
			return elm$core$Maybe$Just(ohanhi$keyboard$Keyboard$GoHome);
		case 'HeadsetHook':
			return elm$core$Maybe$Just(ohanhi$keyboard$Keyboard$HeadsetHook);
		case 'LastNumberRedial':
			return elm$core$Maybe$Just(ohanhi$keyboard$Keyboard$LastNumberRedial);
		case 'Notification':
			return elm$core$Maybe$Just(ohanhi$keyboard$Keyboard$Notification);
		case 'MannerMode':
			return elm$core$Maybe$Just(ohanhi$keyboard$Keyboard$MannerMode);
		case 'VoiceDial':
			return elm$core$Maybe$Just(ohanhi$keyboard$Keyboard$VoiceDial);
		default:
			return elm$core$Maybe$Nothing;
	}
};
var ohanhi$keyboard$Keyboard$Again = {$: 'Again'};
var ohanhi$keyboard$Keyboard$Attn = {$: 'Attn'};
var ohanhi$keyboard$Keyboard$Cancel = {$: 'Cancel'};
var ohanhi$keyboard$Keyboard$ContextMenu = {$: 'ContextMenu'};
var ohanhi$keyboard$Keyboard$Escape = {$: 'Escape'};
var ohanhi$keyboard$Keyboard$Execute = {$: 'Execute'};
var ohanhi$keyboard$Keyboard$Find = {$: 'Find'};
var ohanhi$keyboard$Keyboard$Finish = {$: 'Finish'};
var ohanhi$keyboard$Keyboard$Help = {$: 'Help'};
var ohanhi$keyboard$Keyboard$Pause = {$: 'Pause'};
var ohanhi$keyboard$Keyboard$Play = {$: 'Play'};
var ohanhi$keyboard$Keyboard$Props = {$: 'Props'};
var ohanhi$keyboard$Keyboard$Select = {$: 'Select'};
var ohanhi$keyboard$Keyboard$ZoomIn = {$: 'ZoomIn'};
var ohanhi$keyboard$Keyboard$ZoomOut = {$: 'ZoomOut'};
var ohanhi$keyboard$Keyboard$uiKey = function (_n0) {
	var value = _n0.a;
	switch (value) {
		case 'Again':
			return elm$core$Maybe$Just(ohanhi$keyboard$Keyboard$Again);
		case 'Attn':
			return elm$core$Maybe$Just(ohanhi$keyboard$Keyboard$Attn);
		case 'Cancel':
			return elm$core$Maybe$Just(ohanhi$keyboard$Keyboard$Cancel);
		case 'ContextMenu':
			return elm$core$Maybe$Just(ohanhi$keyboard$Keyboard$ContextMenu);
		case 'Escape':
			return elm$core$Maybe$Just(ohanhi$keyboard$Keyboard$Escape);
		case 'Execute':
			return elm$core$Maybe$Just(ohanhi$keyboard$Keyboard$Execute);
		case 'Find':
			return elm$core$Maybe$Just(ohanhi$keyboard$Keyboard$Find);
		case 'Finish':
			return elm$core$Maybe$Just(ohanhi$keyboard$Keyboard$Finish);
		case 'Help':
			return elm$core$Maybe$Just(ohanhi$keyboard$Keyboard$Help);
		case 'Pause':
			return elm$core$Maybe$Just(ohanhi$keyboard$Keyboard$Pause);
		case 'Play':
			return elm$core$Maybe$Just(ohanhi$keyboard$Keyboard$Play);
		case 'Props':
			return elm$core$Maybe$Just(ohanhi$keyboard$Keyboard$Props);
		case 'Select':
			return elm$core$Maybe$Just(ohanhi$keyboard$Keyboard$Select);
		case 'ZoomIn':
			return elm$core$Maybe$Just(ohanhi$keyboard$Keyboard$ZoomIn);
		case 'ZoomOut':
			return elm$core$Maybe$Just(ohanhi$keyboard$Keyboard$ZoomOut);
		default:
			return elm$core$Maybe$Nothing;
	}
};
var ohanhi$keyboard$Keyboard$Spacebar = {$: 'Spacebar'};
var ohanhi$keyboard$Keyboard$Tab = {$: 'Tab'};
var ohanhi$keyboard$Keyboard$whitespaceKey = function (_n0) {
	var value = _n0.a;
	switch (value) {
		case 'Enter':
			return elm$core$Maybe$Just(ohanhi$keyboard$Keyboard$Enter);
		case 'Tab':
			return elm$core$Maybe$Just(ohanhi$keyboard$Keyboard$Tab);
		case 'Spacebar':
			return elm$core$Maybe$Just(ohanhi$keyboard$Keyboard$Spacebar);
		case ' ':
			return elm$core$Maybe$Just(ohanhi$keyboard$Keyboard$Spacebar);
		default:
			return elm$core$Maybe$Nothing;
	}
};
var ohanhi$keyboard$Keyboard$anyKey = ohanhi$keyboard$Keyboard$oneOf(
	_List_fromArray(
		[ohanhi$keyboard$Keyboard$characterKey, ohanhi$keyboard$Keyboard$modifierKey, ohanhi$keyboard$Keyboard$whitespaceKey, ohanhi$keyboard$Keyboard$navigationKey, ohanhi$keyboard$Keyboard$editingKey, ohanhi$keyboard$Keyboard$functionKey, ohanhi$keyboard$Keyboard$uiKey, ohanhi$keyboard$Keyboard$phoneKey, ohanhi$keyboard$Keyboard$mediaKey]));
var ohanhi$keyboard$Keyboard$KeyDown = function (a) {
	return {$: 'KeyDown', a: a};
};
var ohanhi$keyboard$Keyboard$KeyUp = function (a) {
	return {$: 'KeyUp', a: a};
};
var ohanhi$keyboard$Keyboard$insert = F3(
	function (keyParser, rawKey, list) {
		var _n0 = keyParser(rawKey);
		if (_n0.$ === 'Just') {
			var key = _n0.a;
			return A2(
				elm$core$List$cons,
				key,
				A2(
					elm$core$List$filter,
					elm$core$Basics$neq(key),
					list));
		} else {
			return list;
		}
	});
var ohanhi$keyboard$Keyboard$remove = F3(
	function (keyParser, rawKey, list) {
		var _n0 = keyParser(rawKey);
		if (_n0.$ === 'Just') {
			var key = _n0.a;
			return A2(
				elm$core$List$filter,
				elm$core$Basics$neq(key),
				list);
		} else {
			return list;
		}
	});
var ohanhi$keyboard$Keyboard$updateWithKeyChange = F3(
	function (keyParser, msg, state) {
		if (msg.$ === 'Down') {
			var key = msg.a;
			var nextState = A3(ohanhi$keyboard$Keyboard$insert, keyParser, key, state);
			var change = (!_Utils_eq(
				elm$core$List$length(nextState),
				elm$core$List$length(state))) ? A2(
				elm$core$Maybe$map,
				ohanhi$keyboard$Keyboard$KeyDown,
				keyParser(key)) : elm$core$Maybe$Nothing;
			return _Utils_Tuple2(nextState, change);
		} else {
			var key = msg.a;
			var nextState = A3(ohanhi$keyboard$Keyboard$remove, keyParser, key, state);
			var change = (!_Utils_eq(
				elm$core$List$length(nextState),
				elm$core$List$length(state))) ? A2(
				elm$core$Maybe$map,
				ohanhi$keyboard$Keyboard$KeyUp,
				keyParser(key)) : elm$core$Maybe$Nothing;
			return _Utils_Tuple2(nextState, change);
		}
	});
var ohanhi$keyboard$Keyboard$Arrows$boolToInt = function (bool) {
	return bool ? 1 : 0;
};
var ohanhi$keyboard$Keyboard$Arrows$arrows = function (keys) {
	var toInt = function (key) {
		return ohanhi$keyboard$Keyboard$Arrows$boolToInt(
			A2(elm$core$List$member, key, keys));
	};
	var x = toInt(ohanhi$keyboard$Keyboard$ArrowRight) - toInt(ohanhi$keyboard$Keyboard$ArrowLeft);
	var y = toInt(ohanhi$keyboard$Keyboard$ArrowUp) - toInt(ohanhi$keyboard$Keyboard$ArrowDown);
	return {x: x, y: y};
};
var author$project$Main$update = F2(
	function (msg, model) {
		switch (msg.$) {
			case 'Noop':
				return author$project$Main$noCmd(model);
			case 'OnResize':
				var size = msg.a;
				return author$project$Main$noCmd(
					_Utils_update(
						model,
						{
							game: author$project$SpeechBubble$resetAll(model.game),
							viewportSize: size
						}));
			case 'OnKey':
				var keymsg = msg.a;
				var _n3 = A3(ohanhi$keyboard$Keyboard$updateWithKeyChange, ohanhi$keyboard$Keyboard$anyKey, keymsg, model.newKeys);
				var keys = _n3.a;
				var maybeKeyChange = _n3.b;
				return A2(
					author$project$Main$updateOnKeyChange,
					maybeKeyChange,
					_Utils_update(
						model,
						{newKeys: keys, oldKeys: model.newKeys}));
			case 'OnMouseMove':
				var position = msg.a;
				return author$project$Main$noCmd(
					_Utils_update(
						model,
						{mousePosition: position}));
			case 'OnQueryWidthResponse':
				var _n4 = msg.a;
				var entityId = _n4.a;
				var width = _n4.b;
				return author$project$Main$noCmd(
					_Utils_update(
						model,
						{
							game: A3(author$project$SpeechBubble$applyWidth, entityId, width, model.game)
						}));
			default:
				var dtInMilliseconds = msg.a;
				var keyboardArrows = ohanhi$keyboard$Keyboard$Arrows$arrows(model.newKeys);
				var held = function (key) {
					return A2(elm$core$List$member, key, model.newKeys);
				};
				var dt = A2(elm$core$Basics$min, 100, dtInMilliseconds) / 1000;
				var clicked = function (key) {
					return A2(elm$core$List$member, key, model.newKeys) && (!A2(elm$core$List$member, key, model.oldKeys));
				};
				var thinkEnv = {
					dt: dt,
					inputClickJump: clicked(
						ohanhi$keyboard$Keyboard$Character(' ')),
					inputHoldCrouch: _Utils_eq(keyboardArrows.y, -1),
					inputHoldHorizontalMove: keyboardArrows.x,
					inputHoldJump: held(
						ohanhi$keyboard$Keyboard$Character(' ')),
					inputHoldUp: held(ohanhi$keyboard$Keyboard$ArrowUp),
					inputUseGearClick: clicked(ohanhi$keyboard$Keyboard$Control) || clicked(ohanhi$keyboard$Keyboard$Enter)
				};
				var _n5 = A2(author$project$GameMain$update, thinkEnv, model.game);
				var updatedGame = _n5.a;
				var outcomes = _n5.b;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{game: updatedGame}),
					elm$core$Platform$Cmd$batch(
						A2(elm$core$List$concatMap, author$project$Main$executeOutcome, outcomes)));
		}
	});
var author$project$Main$updateOnKeyChange = F2(
	function (maybeKeyChange, model) {
		if ((maybeKeyChange.$ === 'Just') && (maybeKeyChange.a.$ === 'KeyUp')) {
			var key = maybeKeyChange.a.a;
			var _n1 = A2(elm$core$Debug$log, 'KEY', key);
			_n1$2:
			while (true) {
				switch (_n1.$) {
					case 'Enter':
						return A2(
							author$project$Main$update,
							author$project$Main$OnAnimationFrame(20),
							model);
					case 'Character':
						if (_n1.a === 'p') {
							return author$project$Main$noCmd(
								_Utils_update(
									model,
									{pause: !model.pause}));
						} else {
							break _n1$2;
						}
					default:
						break _n1$2;
				}
			}
			return author$project$Main$noCmd(model);
		} else {
			return author$project$Main$noCmd(model);
		}
	});
var author$project$Main$Noop = {$: 'Noop'};
var author$project$Game$getBackgroundTile = F2(
	function (game, _n0) {
		var row = _n0.row;
		var column = _n0.column;
		var _n1 = A2(elm$core$Array$get, column + (((game.mapHeight - row) - 1) * game.mapWidth), game.mapBackgroundTiles);
		if (_n1.$ === 'Just') {
			var tile = _n1.a;
			return tile;
		} else {
			return author$project$Tiles$backgroundNone;
		}
	});
var author$project$Svgl$Primitives$fragmentShader = {
	src: '\n        precision mediump float;\n        precision mediump int;\n\n        uniform int sh;\n        uniform mat4 entityToWorld;\n        uniform mat4 worldToCamera;\n        uniform vec2 darknessFocus;\n        uniform float darknessIntensity;\n        uniform vec2 dimensions;\n        uniform vec4 fill;\n        uniform vec4 stroke;\n        uniform float strokeWidth;\n        uniform float opacity;\n\n        varying vec2 localPosition;\n        varying vec2 worldPosition;\n\n        // TODO: transform into `pixelSize`, make it a uniform\n        float pixelsPerTile = 30.0;\n        float e = 0.5 / pixelsPerTile;\n\n\n\n        /*\n         *     0               1                            1                     0\n         *     |------|--------|----------------------------|----------|----------|\n         *  -edge-e  -edge  -edge+e                      edge-e      edge      edge+e\n         */\n        float mirrorStep (float edge, float p) {\n          return smoothstep(-edge - e, -edge + e, p) - smoothstep(edge - e, edge + e, p);\n        }\n\n\n\n        /*\n         * Ellipse\n         */\n        float smoothEllipse(vec2 position, vec2 radii) {\n          float x = position.x;\n          float y = position.y;\n          float w = radii.x;\n          float h = radii.y;\n\n          float xx = x * x;\n          float yy = y * y;\n          float ww = w * w;\n          float hh = h * h;\n\n          // We will need the assumption that we are not too far from the ellipse\n          float ew = w + e;\n          float eh = h + e;\n\n          if ( xx / (ew * ew) + yy / (eh * eh) > 1.0 ) {\n            return 1.0;\n          }\n\n          /*\n          Given an ellipse Q with radii W and H, the ellipse P whose every point\n          has distance D from the closest point in A is given by:\n\n            x^2       y^2\n          ------- + ------- = 1\n          (W+D)^2   (H+D)^2\n\n          Assuming D << W and D << H we can solve for D dropping the terms in\n          D^3 and D^4.\n          We obtain: a * d^2 + b * d + c = 0\n          */\n\n          float c = xx * hh + yy * ww - ww * hh;\n          float b = 2.0 * (h * xx + yy * w - h * ww - w * hh);\n          float a = xx + yy - ww - hh - 4.0 * w * h;\n\n          float delta = sqrt(b * b - 4.0 * a * c);\n          //float solution1 = (-b + delta) / (2.0 * a);\n          float solution2 = (-b - delta) / (2.0 * a);\n\n          return smoothstep(-e, e, solution2);\n        }\n\n\n\n        void main () {\n          vec2 strokeSize = dimensions / 2.0 + strokeWidth;\n          vec2 fillSize = dimensions / 2.0 - strokeWidth;\n\n          float alpha;\n          float fillVsStroke;\n\n          if (sh == 1) {\n            alpha = 1.0 - smoothEllipse(localPosition, strokeSize);\n            fillVsStroke = smoothEllipse(localPosition, fillSize);\n          } else {\n            alpha = mirrorStep(strokeSize.x, localPosition.x) * mirrorStep(strokeSize.y, localPosition.y);\n            fillVsStroke = 1.0 - mirrorStep(fillSize.x, localPosition.x) * mirrorStep(fillSize.y, localPosition.y);\n          }\n\n          vec4 color = mix(fill, stroke, fillVsStroke);\n\n\n          // darkness effect\n          vec4 darknessColor = vec4(0.1, 0.1, 0.1, 1.0);\n          float d = distance(worldPosition, darknessFocus) / 10.0;\n          float i = 1.0 - 0.9 * darknessIntensity;\n          gl_FragColor = opacity * alpha * mix(color, darknessColor, smoothstep(i, i + 0.1, d));\n        }\n    ',
	attributes: {},
	uniforms: {darknessFocus: 'darknessFocus', darknessIntensity: 'darknessIntensity', dimensions: 'dimensions', entityToWorld: 'entityToWorld', fill: 'fill', opacity: 'opacity', sh: 'sh', stroke: 'stroke', strokeWidth: 'strokeWidth', worldToCamera: 'worldToCamera'}
};
var author$project$Svgl$Primitives$Attributes = function (position) {
	return {position: position};
};
var elm_explorations$linear_algebra$Math$Vector2$vec2 = _MJS_v2;
var elm_explorations$webgl$WebGL$Mesh3 = F2(
	function (a, b) {
		return {$: 'Mesh3', a: a, b: b};
	});
var elm_explorations$webgl$WebGL$triangles = elm_explorations$webgl$WebGL$Mesh3(
	{elemSize: 3, indexSize: 0, mode: 4});
var author$project$Svgl$Primitives$normalizedQuadMesh = elm_explorations$webgl$WebGL$triangles(
	_List_fromArray(
		[
			_Utils_Tuple3(
			author$project$Svgl$Primitives$Attributes(
				A2(elm_explorations$linear_algebra$Math$Vector2$vec2, -0.5, -0.5)),
			author$project$Svgl$Primitives$Attributes(
				A2(elm_explorations$linear_algebra$Math$Vector2$vec2, 0.5, -0.5)),
			author$project$Svgl$Primitives$Attributes(
				A2(elm_explorations$linear_algebra$Math$Vector2$vec2, 0.5, 0.5))),
			_Utils_Tuple3(
			author$project$Svgl$Primitives$Attributes(
				A2(elm_explorations$linear_algebra$Math$Vector2$vec2, -0.5, -0.5)),
			author$project$Svgl$Primitives$Attributes(
				A2(elm_explorations$linear_algebra$Math$Vector2$vec2, -0.5, 0.5)),
			author$project$Svgl$Primitives$Attributes(
				A2(elm_explorations$linear_algebra$Math$Vector2$vec2, 0.5, 0.5)))
		]));
var author$project$Svgl$Primitives$quadVertexShader = {
	src: '\n        precision mediump float;\n        precision mediump int;\n\n        attribute vec2 position;\n\n        uniform int sh;\n        uniform mat4 entityToWorld;\n        uniform mat4 worldToCamera;\n        uniform vec2 dimensions;\n        uniform vec4 fill;\n        uniform vec4 stroke;\n        uniform float strokeWidth;\n\n        varying vec2 localPosition;\n        varying vec2 worldPosition;\n\n        void main () {\n            localPosition = (dimensions + strokeWidth * 2.0) * position;\n            vec4 worldPosition4 = entityToWorld * vec4(localPosition, 0, 1);\n\n            worldPosition = worldPosition4.xy;\n            gl_Position = worldToCamera * worldPosition4;\n        }\n    ',
	attributes: {position: 'position'},
	uniforms: {dimensions: 'dimensions', entityToWorld: 'entityToWorld', fill: 'fill', sh: 'sh', stroke: 'stroke', strokeWidth: 'strokeWidth', worldToCamera: 'worldToCamera'}
};
var elm_explorations$webgl$WebGL$Internal$Blend = function (a) {
	return function (b) {
		return function (c) {
			return function (d) {
				return function (e) {
					return function (f) {
						return function (g) {
							return function (h) {
								return function (i) {
									return function (j) {
										return {$: 'Blend', a: a, b: b, c: c, d: d, e: e, f: f, g: g, h: h, i: i, j: j};
									};
								};
							};
						};
					};
				};
			};
		};
	};
};
var elm_explorations$webgl$WebGL$Settings$Blend$custom = function (_n0) {
	var r = _n0.r;
	var g = _n0.g;
	var b = _n0.b;
	var a = _n0.a;
	var color = _n0.color;
	var alpha = _n0.alpha;
	var expand = F2(
		function (_n1, _n2) {
			var eq1 = _n1.a;
			var f11 = _n1.b;
			var f12 = _n1.c;
			var eq2 = _n2.a;
			var f21 = _n2.b;
			var f22 = _n2.c;
			return elm_explorations$webgl$WebGL$Internal$Blend(eq1)(f11)(f12)(eq2)(f21)(f22)(r)(g)(b)(a);
		});
	return A2(expand, color, alpha);
};
var elm_explorations$webgl$WebGL$Settings$Blend$Blender = F3(
	function (a, b, c) {
		return {$: 'Blender', a: a, b: b, c: c};
	});
var elm_explorations$webgl$WebGL$Settings$Blend$customAdd = F2(
	function (_n0, _n1) {
		var factor1 = _n0.a;
		var factor2 = _n1.a;
		return A3(elm_explorations$webgl$WebGL$Settings$Blend$Blender, 32774, factor1, factor2);
	});
var elm_explorations$webgl$WebGL$Settings$Blend$add = F2(
	function (factor1, factor2) {
		return elm_explorations$webgl$WebGL$Settings$Blend$custom(
			{
				a: 0,
				alpha: A2(elm_explorations$webgl$WebGL$Settings$Blend$customAdd, factor1, factor2),
				b: 0,
				color: A2(elm_explorations$webgl$WebGL$Settings$Blend$customAdd, factor1, factor2),
				g: 0,
				r: 0
			});
	});
var elm_explorations$webgl$WebGL$Settings$Blend$Factor = function (a) {
	return {$: 'Factor', a: a};
};
var elm_explorations$webgl$WebGL$Settings$Blend$one = elm_explorations$webgl$WebGL$Settings$Blend$Factor(1);
var elm_explorations$webgl$WebGL$Settings$Blend$oneMinusSrcAlpha = elm_explorations$webgl$WebGL$Settings$Blend$Factor(771);
var author$project$Svgl$Primitives$settings = _List_fromArray(
	[
		A2(elm_explorations$webgl$WebGL$Settings$Blend$add, elm_explorations$webgl$WebGL$Settings$Blend$one, elm_explorations$webgl$WebGL$Settings$Blend$oneMinusSrcAlpha)
	]);
var elm_explorations$webgl$WebGL$Internal$disableSetting = F2(
	function (gl, setting) {
		switch (setting.$) {
			case 'Blend':
				return _WebGL_disableBlend(gl);
			case 'DepthTest':
				return _WebGL_disableDepthTest(gl);
			case 'StencilTest':
				return _WebGL_disableStencilTest(gl);
			case 'Scissor':
				return _WebGL_disableScissor(gl);
			case 'ColorMask':
				return _WebGL_disableColorMask(gl);
			case 'CullFace':
				return _WebGL_disableCullFace(gl);
			case 'PolygonOffset':
				return _WebGL_disablePolygonOffset(gl);
			case 'SampleCoverage':
				return _WebGL_disableSampleCoverage(gl);
			default:
				return _WebGL_disableSampleAlphaToCoverage(gl);
		}
	});
var elm_explorations$webgl$WebGL$Internal$enableOption = F2(
	function (ctx, option) {
		switch (option.$) {
			case 'Alpha':
				return A2(_WebGL_enableAlpha, ctx, option);
			case 'Depth':
				return A2(_WebGL_enableDepth, ctx, option);
			case 'Stencil':
				return A2(_WebGL_enableStencil, ctx, option);
			case 'Antialias':
				return A2(_WebGL_enableAntialias, ctx, option);
			default:
				return A2(_WebGL_enableClearColor, ctx, option);
		}
	});
var elm_explorations$webgl$WebGL$Internal$enableSetting = F2(
	function (gl, setting) {
		switch (setting.$) {
			case 'Blend':
				return A2(_WebGL_enableBlend, gl, setting);
			case 'DepthTest':
				return A2(_WebGL_enableDepthTest, gl, setting);
			case 'StencilTest':
				return A2(_WebGL_enableStencilTest, gl, setting);
			case 'Scissor':
				return A2(_WebGL_enableScissor, gl, setting);
			case 'ColorMask':
				return A2(_WebGL_enableColorMask, gl, setting);
			case 'CullFace':
				return A2(_WebGL_enableCullFace, gl, setting);
			case 'PolygonOffset':
				return A2(_WebGL_enablePolygonOffset, gl, setting);
			case 'SampleCoverage':
				return A2(_WebGL_enableSampleCoverage, gl, setting);
			default:
				return A2(_WebGL_enableSampleAlphaToCoverage, gl, setting);
		}
	});
var elm_explorations$webgl$WebGL$entityWith = _WebGL_entity;
var author$project$Svgl$Primitives$ellipse = function (u) {
	return A5(
		elm_explorations$webgl$WebGL$entityWith,
		author$project$Svgl$Primitives$settings,
		author$project$Svgl$Primitives$quadVertexShader,
		author$project$Svgl$Primitives$fragmentShader,
		author$project$Svgl$Primitives$normalizedQuadMesh,
		_Utils_update(
			u,
			{sh: 1}));
};
var author$project$Svgl$Primitives$rect = A4(elm_explorations$webgl$WebGL$entityWith, author$project$Svgl$Primitives$settings, author$project$Svgl$Primitives$quadVertexShader, author$project$Svgl$Primitives$fragmentShader, author$project$Svgl$Primitives$normalizedQuadMesh);
var author$project$Svgl$Primitives$normalizedRightTriMesh = elm_explorations$webgl$WebGL$triangles(
	_List_fromArray(
		[
			_Utils_Tuple3(
			author$project$Svgl$Primitives$Attributes(
				A2(elm_explorations$linear_algebra$Math$Vector2$vec2, -0.5, -0.5)),
			author$project$Svgl$Primitives$Attributes(
				A2(elm_explorations$linear_algebra$Math$Vector2$vec2, -0.5, 0.5)),
			author$project$Svgl$Primitives$Attributes(
				A2(elm_explorations$linear_algebra$Math$Vector2$vec2, 0.5, -0.5)))
		]));
var author$project$Svgl$Primitives$rightTri = A4(elm_explorations$webgl$WebGL$entityWith, author$project$Svgl$Primitives$settings, author$project$Svgl$Primitives$quadVertexShader, author$project$Svgl$Primitives$fragmentShader, author$project$Svgl$Primitives$normalizedRightTriMesh);
var author$project$Svgl$Primitives$shape = function (primitiveType) {
	switch (primitiveType.$) {
		case 'Rectangle':
			return author$project$Svgl$Primitives$rect;
		case 'Ellipse':
			return author$project$Svgl$Primitives$ellipse;
		default:
			return author$project$Svgl$Primitives$rightTri;
	}
};
var avh4$elm_color$Color$toRgba = function (_n0) {
	var r = _n0.a;
	var g = _n0.b;
	var b = _n0.c;
	var a = _n0.d;
	return {alpha: a, blue: b, green: g, red: r};
};
var elm_explorations$linear_algebra$Math$Vector4$vec4 = _MJS_v4;
var author$project$Svgl$Tree$colorToVec = function (color) {
	var _n0 = avh4$elm_color$Color$toRgba(color);
	var red = _n0.red;
	var green = _n0.green;
	var blue = _n0.blue;
	var alpha = _n0.alpha;
	return A4(elm_explorations$linear_algebra$Math$Vector4$vec4, red, green, blue, alpha);
};
var elm_explorations$linear_algebra$Math$Vector3$vec3 = _MJS_v3;
var author$project$Svgl$Tree$rotationPivot = A3(elm_explorations$linear_algebra$Math$Vector3$vec3, 0, 0, -1);
var elm_explorations$linear_algebra$Math$Matrix4$rotate = _MJS_m4x4rotate;
var author$project$Svgl$Tree$svglLeafToWebGLEntity = F3(
	function (defaultUniforms, parentToWorld, _n0) {
		var shape = _n0.a;
		var p = _n0.b;
		return A2(
			author$project$Svgl$Primitives$shape,
			shape,
			_Utils_update(
				defaultUniforms,
				{
					dimensions: A2(elm_explorations$linear_algebra$Math$Vector2$vec2, p.w, p.h),
					entityToWorld: A3(
						elm_explorations$linear_algebra$Math$Matrix4$rotate,
						p.rotate,
						author$project$Svgl$Tree$rotationPivot,
						A4(elm_explorations$linear_algebra$Math$Matrix4$translate3, p.x, p.y, p.z, parentToWorld)),
					fill: author$project$Svgl$Tree$colorToVec(p.fill),
					opacity: p.opacity,
					stroke: author$project$Svgl$Tree$colorToVec(p.stroke),
					strokeWidth: p.strokeWidth
				}));
	});
var author$project$TransformTree$rotationAxis = A3(elm_explorations$linear_algebra$Math$Vector3$vec3, 0, 0, -1);
var author$project$TransformTree$applyTransform = F2(
	function (t, mat) {
		if (t.$ === 'Translate') {
			var v = t.a;
			return A4(elm_explorations$linear_algebra$Math$Matrix4$translate3, v.x, v.y, v.z, mat);
		} else {
			var radians = t.a;
			return A3(elm_explorations$linear_algebra$Math$Matrix4$rotate, radians, author$project$TransformTree$rotationAxis, mat);
		}
	});
var author$project$TransformTree$resolveAndAppend = F4(
	function (makeOutput, transformSoFar, node, accumulator) {
		if (node.$ === 'Leaf') {
			var a = node.a;
			return A2(
				elm$core$List$cons,
				A2(makeOutput, transformSoFar, a),
				accumulator);
		} else {
			var transforms = node.a;
			var children = node.b;
			var newTransform = A3(elm$core$List$foldl, author$project$TransformTree$applyTransform, transformSoFar, transforms);
			return A3(
				elm$core$List$foldr,
				A2(author$project$TransformTree$resolveAndAppend, makeOutput, newTransform),
				accumulator,
				children);
		}
	});
var elm$core$List$sortBy = _List_sortBy;
var elm$core$Tuple$mapFirst = F2(
	function (func, _n0) {
		var x = _n0.a;
		var y = _n0.b;
		return _Utils_Tuple2(
			func(x),
			y);
	});
var elm_explorations$linear_algebra$Math$Matrix4$identity = _MJS_m4x4identity;
var author$project$GameMain$renderEntities = F3(
	function (baseUniforms, env, game) {
		var leafToWebGl = author$project$Svgl$Tree$svglLeafToWebGLEntity(baseUniforms);
		var executeOneRenderFunction = F3(
			function (entity, _n1, output) {
				var renderFunction = _n1.a;
				var _n0 = A3(renderFunction, env, game, entity);
				switch (_n0.$) {
					case 'RenderableNone':
						return output;
					case 'RenderableTree':
						var tree = _n0.a;
						return A2(
							elm$core$Tuple$mapFirst,
							A3(author$project$TransformTree$resolveAndAppend, leafToWebGl, elm_explorations$linear_algebra$Math$Matrix4$identity, tree),
							output);
					case 'RenderableSvg':
						var zIndex = _n0.a;
						var svg = _n0.b;
						return A2(
							elm$core$Tuple$mapSecond,
							elm$core$List$cons(
								_Utils_Tuple2(zIndex, svg)),
							output);
					default:
						var entities = _n0.a;
						return A2(
							elm$core$Tuple$mapFirst,
							elm$core$Basics$append(entities),
							output);
				}
			});
		var executeAllRenderFunctions = F3(
			function (id, entity, output) {
				return A3(
					elm$core$List$foldr,
					executeOneRenderFunction(entity),
					output,
					entity.renderScripts);
			});
		return A2(
			elm$core$Tuple$mapSecond,
			A2(
				elm$core$Basics$composeR,
				elm$core$List$sortBy(elm$core$Tuple$first),
				elm$core$List$map(elm$core$Tuple$second)),
			A3(
				elm$core$Dict$foldl,
				executeAllRenderFunctions,
				_Utils_Tuple2(_List_Nil, _List_Nil),
				game.entitiesById));
	});
var elm_community$list_extra$List$Extra$cartesianProduct = function (ll) {
	if (!ll.b) {
		return _List_fromArray(
			[_List_Nil]);
	} else {
		var xs = ll.a;
		var xss = ll.b;
		return A3(
			elm_community$list_extra$List$Extra$lift2,
			elm$core$List$cons,
			xs,
			elm_community$list_extra$List$Extra$cartesianProduct(xss));
	}
};
var author$project$Scene$visibleRowColumns = F3(
	function (game, _n0, _n1) {
		var x = _n0.x;
		var y = _n0.y;
		var width = _n1.width;
		var height = _n1.height;
		var top = A2(
			elm$core$Basics$min,
			game.mapHeight - 1,
			elm$core$Basics$ceiling(y + (height / 2)));
		var right = A2(
			elm$core$Basics$min,
			game.mapWidth - 1,
			elm$core$Basics$ceiling(x + (width / 2)));
		var listToRowColumn = function (l) {
			if ((l.b && l.b.b) && (!l.b.b.b)) {
				var column = l.a;
				var _n3 = l.b;
				var row = _n3.a;
				return {column: column, row: row};
			} else {
				return _Debug_todo(
					'Scene',
					{
						start: {line: 47, column: 21},
						end: {line: 47, column: 31}
					})('blerch');
			}
		};
		var left = A2(
			elm$core$Basics$max,
			0,
			elm$core$Basics$floor(x - (width / 2)));
		var bottom = A2(
			elm$core$Basics$max,
			0,
			elm$core$Basics$floor(y - (height / 2)));
		return A2(
			elm$core$List$map,
			listToRowColumn,
			elm_community$list_extra$List$Extra$cartesianProduct(
				_List_fromArray(
					[
						A2(elm$core$List$range, left, right),
						A2(elm$core$List$range, bottom, top)
					])));
	});
var author$project$Svgl$Primitives$defaultUniforms = {
	darknessFocus: A2(elm_explorations$linear_algebra$Math$Vector2$vec2, 0, 0),
	darknessIntensity: 0,
	dimensions: A2(elm_explorations$linear_algebra$Math$Vector2$vec2, 1, 1),
	entityToWorld: elm_explorations$linear_algebra$Math$Matrix4$identity,
	fill: A4(elm_explorations$linear_algebra$Math$Vector4$vec4, 0.4, 0.4, 0.4, 1),
	opacity: 1,
	sh: 0,
	stroke: A4(elm_explorations$linear_algebra$Math$Vector4$vec4, 0.6, 0.6, 0.6, 1),
	strokeWidth: 0.1,
	worldToCamera: elm_explorations$linear_algebra$Math$Matrix4$identity
};
var author$project$Viewport$worldToPixelScale = function (_n0) {
	var pixelSize = _n0.pixelSize;
	var minimumVisibleWorldSize = _n0.minimumVisibleWorldSize;
	var maxScaleY = pixelSize.height / minimumVisibleWorldSize.height;
	var maxScaleX = pixelSize.width / minimumVisibleWorldSize.width;
	return A2(elm$core$Basics$min, maxScaleX, maxScaleY);
};
var author$project$Viewport$actualVisibleWorldSize = function (viewport) {
	var scale = author$project$Viewport$worldToPixelScale(viewport);
	return {height: viewport.pixelSize.height / scale, width: viewport.pixelSize.width / scale};
};
var author$project$Viewport$overlaps = F2(
	function (viewport, viewportCenter) {
		var _n0 = author$project$Viewport$actualVisibleWorldSize(viewport);
		var width = _n0.width;
		var height = _n0.height;
		var bottom = viewportCenter.y - (height / 2);
		var top = viewportCenter.y + (height / 2);
		var left = viewportCenter.x - (width / 2);
		var right = viewportCenter.x + (width / 2);
		return F2(
			function (objectSize, objectCenter) {
				return (_Utils_cmp(objectCenter.x + (objectSize.width / 2), left) > 0) && ((_Utils_cmp(objectCenter.x - (objectSize.width / 2), right) < 0) && ((_Utils_cmp(objectCenter.y + (objectSize.height / 2), bottom) > 0) && (_Utils_cmp(objectCenter.y - (objectSize.height / 2), top) < 0)));
			});
	});
var elm_explorations$linear_algebra$Math$Matrix4$makeScale3 = _MJS_m4x4makeScale3;
var author$project$Viewport$worldToCameraTransform = function (viewport) {
	var scale = author$project$Viewport$worldToPixelScale(viewport);
	var scaleX = (2.0 * scale) / viewport.pixelSize.width;
	var scaleY = (2.0 * scale) / viewport.pixelSize.height;
	return A3(elm_explorations$linear_algebra$Math$Matrix4$makeScale3, scaleX, scaleY, 1);
};
var elm_explorations$linear_algebra$Math$Vector2$fromRecord = _MJS_v2fromRecord;
var author$project$Scene$entities = function (_n0) {
	var viewportSize = _n0.viewportSize;
	var game = _n0.game;
	var viewport = {
		minimumVisibleWorldSize: {height: 20, width: 20},
		pixelSize: viewportSize
	};
	var visibleWorldSize = author$project$Viewport$actualVisibleWorldSize(viewport);
	var worldToCamera = A4(
		elm_explorations$linear_algebra$Math$Matrix4$translate3,
		-game.cameraPosition.x,
		-game.cameraPosition.y,
		0,
		author$project$Viewport$worldToCameraTransform(viewport));
	var rowColumns = A3(author$project$Scene$visibleRowColumns, game, game.cameraPosition, visibleWorldSize);
	var render = F2(
		function (getTile, rowColumn) {
			return A2(
				author$project$TransformTree$Nest,
				_List_fromArray(
					[
						A2(author$project$TransformTree$translate2, rowColumn.column, rowColumn.row)
					]),
				_List_fromArray(
					[
						A2(getTile, game, rowColumn).render
					]));
		});
	var playerPosition = A2(
		elm$core$Maybe$withDefault,
		author$project$Vector$origin,
		A2(
			elm$core$Maybe$map,
			function ($) {
				return $.absolutePosition;
			},
			A2(elm$core$Dict$get, game.playerId, game.entitiesById)));
	var overlapsViewport = A2(author$project$Viewport$overlaps, viewport, game.cameraPosition);
	var renderEnv = {overlapsViewport: overlapsViewport, visibleWorldSize: visibleWorldSize, worldToCamera: worldToCamera};
	var baseUniforms = _Utils_update(
		author$project$Svgl$Primitives$defaultUniforms,
		{
			darknessFocus: elm_explorations$linear_algebra$Math$Vector2$fromRecord(playerPosition),
			darknessIntensity: game.darknessState,
			worldToCamera: worldToCamera
		});
	var appendTiles = function (getTile) {
		return A3(
			author$project$TransformTree$resolveAndAppend,
			author$project$Svgl$Tree$svglLeafToWebGLEntity(baseUniforms),
			elm_explorations$linear_algebra$Math$Matrix4$identity,
			A2(
				author$project$TransformTree$Nest,
				_List_Nil,
				A2(
					elm$core$List$map,
					render(getTile),
					rowColumns)));
	};
	var _n1 = A3(author$project$GameMain$renderEntities, baseUniforms, renderEnv, game);
	var webGlEntities = _n1.a;
	var svgs = _n1.b;
	return _Utils_Tuple2(
		A2(
			appendTiles,
			author$project$Game$getBackgroundTile,
			A2(appendTiles, author$project$Game$getForegroundTile, webGlEntities)),
		svgs);
};
var elm$html$Html$div = _VirtualDom_node('div');
var elm$html$Html$Attributes$height = function (n) {
	return A2(
		_VirtualDom_attribute,
		'height',
		elm$core$String$fromInt(n));
};
var elm$virtual_dom$VirtualDom$style = _VirtualDom_style;
var elm$html$Html$Attributes$style = elm$virtual_dom$VirtualDom$style;
var elm$html$Html$Attributes$width = function (n) {
	return A2(
		_VirtualDom_attribute,
		'width',
		elm$core$String$fromInt(n));
};
var elm$svg$Svg$svg = elm$svg$Svg$trustedNode('svg');
var elm$svg$Svg$Attributes$viewBox = _VirtualDom_attribute('viewBox');
var elm_explorations$webgl$WebGL$toHtmlWith = F3(
	function (options, attributes, entities) {
		return A3(_WebGL_toHtml, options, attributes, entities);
	});
var author$project$Viewport$Combine$wrapper = function (args) {
	var childrenAttributes = _List_fromArray(
		[
			A2(elm$html$Html$Attributes$style, 'position', 'absolute'),
			A2(elm$html$Html$Attributes$style, 'top', '0'),
			A2(elm$html$Html$Attributes$style, 'left', '0'),
			A2(elm$html$Html$Attributes$style, 'bottom', '0'),
			A2(elm$html$Html$Attributes$style, 'right', '0')
		]);
	var _n0 = args.viewportSize;
	var width = _n0.width;
	var height = _n0.height;
	var viewbox = elm$svg$Svg$Attributes$viewBox(
		A2(
			elm$core$String$join,
			' ',
			A2(
				elm$core$List$map,
				elm$core$String$fromInt,
				_List_fromArray(
					[-width, -height, width * 2, height * 2]))));
	return A2(
		elm$html$Html$div,
		_Utils_ap(
			_List_fromArray(
				[
					A2(elm$html$Html$Attributes$style, 'position', 'relative'),
					A2(elm$html$Html$Attributes$style, 'overflow', 'hidden'),
					A2(
					elm$html$Html$Attributes$style,
					'width',
					elm$core$String$fromInt(width) + 'px'),
					A2(
					elm$html$Html$Attributes$style,
					'height',
					elm$core$String$fromInt(height) + 'px')
				]),
			args.elementAttributes),
		_List_fromArray(
			[
				A3(
				elm_explorations$webgl$WebGL$toHtmlWith,
				args.webglOptions,
				A2(
					elm$core$List$cons,
					elm$html$Html$Attributes$width(width),
					A2(
						elm$core$List$cons,
						elm$html$Html$Attributes$height(height),
						childrenAttributes)),
				args.webGlEntities),
				A2(
				elm$svg$Svg$svg,
				A2(elm$core$List$cons, viewbox, childrenAttributes),
				_List_fromArray(
					[
						A2(
						elm$svg$Svg$g,
						_List_fromArray(
							[
								elm$svg$Svg$Attributes$transform(
								'scale(' + (elm$core$String$fromInt(width) + (', ' + (elm$core$String$fromInt(-height) + ')'))))
							]),
						args.svgContent)
					]))
			]));
};
var elm$virtual_dom$VirtualDom$map = _VirtualDom_map;
var elm$html$Html$map = elm$virtual_dom$VirtualDom$map;
var elm$json$Json$Encode$string = _Json_wrap;
var elm$html$Html$Attributes$stringProperty = F2(
	function (key, string) {
		return A2(
			_VirtualDom_property,
			key,
			elm$json$Json$Encode$string(string));
	});
var elm$html$Html$Attributes$id = elm$html$Html$Attributes$stringProperty('id');
var elm_explorations$webgl$WebGL$Internal$Alpha = function (a) {
	return {$: 'Alpha', a: a};
};
var elm_explorations$webgl$WebGL$alpha = elm_explorations$webgl$WebGL$Internal$Alpha;
var elm_explorations$webgl$WebGL$Internal$Antialias = {$: 'Antialias'};
var elm_explorations$webgl$WebGL$antialias = elm_explorations$webgl$WebGL$Internal$Antialias;
var elm_explorations$webgl$WebGL$Internal$ClearColor = F4(
	function (a, b, c, d) {
		return {$: 'ClearColor', a: a, b: b, c: c, d: d};
	});
var elm_explorations$webgl$WebGL$clearColor = elm_explorations$webgl$WebGL$Internal$ClearColor;
var author$project$Main$view = function (model) {
	var _n0 = author$project$Scene$entities(
		{game: model.game, viewportSize: model.viewportSize});
	var webGlEntities = _n0.a;
	var svgContent = _n0.b;
	return {
		body: _List_fromArray(
			[
				author$project$Viewport$Combine$wrapper(
				{
					elementAttributes: _List_fromArray(
						[
							elm$html$Html$Attributes$id('viewport')
						]),
					svgContent: A2(
						elm$core$List$map,
						elm$html$Html$map(
							function (_n1) {
								return author$project$Main$Noop;
							}),
						svgContent),
					viewportSize: model.viewportSize,
					webGlEntities: webGlEntities,
					webglOptions: _List_fromArray(
						[
							elm_explorations$webgl$WebGL$alpha(true),
							elm_explorations$webgl$WebGL$antialias,
							A4(elm_explorations$webgl$WebGL$clearColor, 0.2, 0.2, 0.2, 1)
						])
				})
			]),
		title: 'Generic platformer'
	};
};
var elm$browser$Browser$document = _Browser_document;
var author$project$Main$main = elm$browser$Browser$document(
	{init: author$project$Main$init, subscriptions: author$project$Main$subscriptions, update: author$project$Main$update, view: author$project$Main$view});
_Platform_export({'Main':{'init':author$project$Main$main(
	elm$json$Json$Decode$succeed(
		{}))(0)}});}(this));