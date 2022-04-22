export default function fakeTag(
	literals: TemplateStringsArray,
	...expressions: string[]
) {
	let string = "";

	for (const [index, literal] of literals.entries()) {
		string += literal;

		if (index in expressions) {
			string += expressions[index];
		}
	}

	return string;
}
