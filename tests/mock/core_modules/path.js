const path = require('path')

const is_win = (path.sep === '\\')

const seps = {
  native: path.sep,
  other:  is_win ? '/' : '\\'
}

const regexs = {
  native: is_win ? /[\\]/g : /[\/]/g,
  other:  is_win ? /[\/]/g : /[\\]/g
}

const mock_join = (...args) => {
  const root      = args[0]
  const is_native = (root.indexOf(seps.native) >= 0)

  return is_native
    ? args.join(seps.native).replace(regexs.other, seps.native)
    : args.join(seps.other).replace(regexs.native, seps.other)
}

const mock_dirname = (path) => path.replace(/[\\\/][^\\\/]*$/, '')

path.resolve = mock_join
path.join    = mock_join
path.dirname = mock_dirname
