# nextein-plugin-markdown

Default plugin to read, parse and render markdown files in nextein.

This plugin runs in 3 different stages: `build`, `cleanup`, and `render`. Since it is al compressed into one single plugin, all options arguments will be passed to the all stages.

## Configuration

**remark** {Array}: A set of plugins for `remark`. Used at `build` stage.
**rehype** {Array}: A set of plugins for `rehype`. Used at `build` stage.
**raw** {Boolean}: Set to true to keep the raw value from entries. Used at `cleanup` stage. Default to `false`.
**position** {Boolean}: Set to true to keep the position information value in `content`. Used at `cleanup` stage. Default to `false`.
**excerpt** {String}: Default selector for excerpt param in Content. It must be a `unist-util-select` valid selector. Default to `':root > element[tagName=p]'` (the first paragraph).
 