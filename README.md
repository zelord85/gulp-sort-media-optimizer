gulp-sort-media-optimizer
--------------------------
Plugin extracts css rules inside of media queries and saves it to separated files.

EXAMPLE
-------
```js
var gulp = require("gulp");
var g = require("gulp-sort-media-optimizer")();

gulp.task("design.build", function() {
	gulp.src("src/design/style.css")
		.pipe(g.sortMediaOptimizer())
		.pipe(gulp.dest("build"));
});
```
Task `design.build` for below `style.css` file:
``` css
* {
	box-sizing: border-box;
}

@media (min-width: 910px) {
	.container {
		margin: 0 auto;
	}
}
@media (max-width: 910px) {
	.container {
		margin: 0 auto;
	}
}
```
Produces following files:

<table>
	<tr>
		<th>style.css</th>
		<th>style_l.css</th>
		<th>style_m.css</th>
	</tr>
	<tr>
		<td><pre>* {
	box-sizing: border-box;
}</pre></td>
		<td><pre>
@media (min-width: 910px) {
	.container {
		margin: 0 auto;
	}
}
</pre></td>
<td><pre>
@media (max-width: 910px) {
	.container {
		margin: 0 auto;
	}
}
</pre></td>
	</tr>
</table>

And now you can include it in your html in such way:
```html
<link rel="stylesheet" type="text/css" href="style.css" />
<link rel="stylesheet" type="text/css" href="style_l.css" media="(max-width: 910px)" />
<link rel="stylesheet" type="text/css" href="atyle_m.css" media="(min-width: 640px)" />
```

When a media query is true, the corresponding style sheet or style rules are applied, 
following the normal cascading rules. Style sheets with media queries attached 
to their <link> tags will still download even if their media queries
would return false (they will not apply, however).

Unless you use the `not` or `only` operators,
the media type is optional and the all type will be implied.
