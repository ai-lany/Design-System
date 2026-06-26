// Groups: 1=lineComment 2=blockComment 3=string 4=tag 5=keyword 6=number
const TOKEN_RE =
  /(\/\/[^\n]*)|(\/\*[\s\S]*?\*\/)|(\"(?:[^\"\\]|\\.)*\"|'(?:[^'\\]|\\.)*'|`(?:[^`\\]|\\.)*`)|(\/?>|<\/?[A-Za-z][A-Za-z0-9]*(?:\.[A-Za-z][A-Za-z0-9]*)*)|\b(const|let|var|function|return|import|export|default|from|if|else|true|false|null|undefined|new|type|interface|async|await|of|for|while|class|extends)\b|(\b\d+(?:\.\d+)?\b)/g;

export function highlight(code: string): JSX.Element[] {
  const out: JSX.Element[] = [];
  let last = 0;
  TOKEN_RE.lastIndex = 0;
  let m: RegExpExecArray | null;
  let key = 0;
  const push = (color: string | null, text: string) => {
    out.push(
      color ? (
        <span key={key++} style={{ color }}>
          {text}
        </span>
      ) : (
        <span key={key++}>{text}</span>
      ),
    );
  };
  while ((m = TOKEN_RE.exec(code)) !== null) {
    if (m.index > last) push(null, code.slice(last, m.index));
    const [full, lc, bc, str, tag, kw, num] = m;
    if (lc || bc)       push('var(--color-syntax-comment)', full);
    else if (str)       push('var(--color-syntax-string)', full);
    else if (tag)       push('var(--color-syntax-tag)', full);
    else if (kw)        push('var(--color-syntax-keyword)', full);
    else if (num)       push('var(--color-syntax-number)', full);
    last = m.index + full.length;
  }
  if (last < code.length) push(null, code.slice(last));
  return out;
}
